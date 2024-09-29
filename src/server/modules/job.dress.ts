import {JobDressEntity} from "./typeorm/entities/job.dress";
import {colshapeHandle, colshapes} from "./checkpoints";
import {menu} from "./menu";
import {system} from "./system";
import {ScaleformTextMp} from "./scaleform.mp";
import {dress} from "./customization";
import {CustomEvent} from "./custom.event";
import {getJobData, JobId} from "../../shared/jobs";
import {testOneOfBooleans} from "../../shared/utilities";
import {Family} from "./families/family";
import {fractionCfg} from "./fractions/main";


CustomEvent.registerClient('job:dress:clear', (player) => {
    player.user.reloadSkin()
})
CustomEvent.registerClient('job:dress:save', (player, id, index, data:[number, number, number][], name: string) => {
    const user = player.user;
    if(!user) return;
    const item = JobDress.get(id);
    if(!item) return;
    if(!item.fraction && !item.family) return;
    if(!item.haveEditAccess(player)) return;
    const z = [...item.data.dress];
    if(typeof index === 'number' && z.find(q => q.id === index)){
        z.find(q => q.id === index).data = data;
        z.find(q => q.id === index).name = system.filterInput(name);
    } else {
        z.push({data, name, male: user.male, rank: 1, id: system.timestampMS })
    }
    item.data.dress = z;
    item.save()
    player.notify('Комплект одежды сохранён', 'success');
    item.menu(player);
})

export class JobDress {
    static pool: JobDress[] = [];
    static get(id: number){
        return this.pool.find(q => q.id === id)
    }
    static getIndex(id: number){
        return this.pool.findIndex(q => q.id === id)
    }
    static create(name: string, position: Vector3Mp, dimension = 0, fraction = 0, job: any = "", family: number = null){
        const item = new JobDressEntity();
        item.name = name;
        item.x = position.x;
        item.y = position.y;
        item.z = position.z;
        item.d = dimension;
        item.fraction = fraction;
        item.job = job || "";
        item.family = family;
        item.dress = [];
        item.save().then(data => {
            this.load(data);
        })
    }
    static createMenu(player: PlayerMp){
        let name: string;
        let fraction: number;
        let job: JobId;
        let family: number;
        const s = () => {
            const m = menu.new(player, 'Создание гардероба');

            m.newItem({
                name: 'Название',
                more: name ? 'Указано' : 'Не указано',
                desc: name || "",
                onpress: () => {
                    menu.input(player, "Введите имя", name || "", 30).then(n => {
                        if(!n) return s();
                        name = n;
                        s();
                    })
                }
            })

            m.newItem({
                name: 'Фракция',
                more: fraction ? fractionCfg.getFractionName(fraction) : 'Не для фракции',
                onpress: () => {
                    menu.selectFraction(player, "all", fraction).then(n => {
                        if(!n){
                            fraction = null;
                            return s();
                        }
                        fraction = n;
                        s();
                    })
                }
            })

            m.newItem({
                name: 'Работа',
                more: job ? getJobData(job).name : 'Не для работы',
                onpress: () => {
                    menu.selectJob(player, job).then(n => {
                        if(!n){
                            job = null;
                            return s();
                        }
                        job = n;
                        s();
                    })
                }
            })

            m.newItem({
                name: 'Семья',
                more: family ? Family.getByID(family).name : 'Не для семьи',
                onpress: () => {
                    menu.selectFamily(player).then(id => {
                        if(!id){
                            family = null;
                            return s();
                        }
                        family = id;
                        s();
                    })
                }
            })

            m.newItem({
                name: '~g~Создать',
                desc: 'Гардероб будет создан на вашей позиции',
                onpress: () => {
                    if(!fraction && !job && !family) return player.notify('Выберите для кого предназначен данный гардероб', 'error');
                    if(!testOneOfBooleans(!!fraction, !!job, !!family)) return player.notify('Гардероб не может быть одновременно для фракции, работы и семьи', 'error');
                    if(!name) return player.notify('Необходимо указать название', 'error');
                    menu.close(player);
                    player.user.log("AdminJob", `Создал гардероб ${name}`);
                    this.create(name, new mp.Vector3(player.position.x, player.position.y, player.position.z - 1), player.dimension, fraction, job, family);
                    player.notify('Гардероб успешно создан', 'success')
                }
            })

            m.open();
        }
        s();
    }
    static loadAll(){
        return JobDressEntity.find().then(data => data.map(item => this.load(item)))
    }
    static load(item: JobDressEntity){
        new JobDress(item);
    }
    readonly data: JobDressEntity;
    private colshape: colshapeHandle;
    private scaleform: ScaleformTextMp;
    get id(){
        return this.data.id
    }
    get fraction(){
        return this.data.fraction
    }
    get job(){
        return this.data.job
    }
    get family(){
        return this.data.family
    }
    get position(){
        return new mp.Vector3(this.data.x, this.data.y, this.data.z);
    }
    set position(val){
        this.data.x = val.x;
        this.data.y = val.y;
        this.data.z = val.z;
    }
    get dimension(){
        return this.data.d
    }
    set dimension(val){
        this.data.d = val;
    }
    get name(){
        return this.data.name
    }
    set name(val){
        this.data.name = val;
    }
    save(){
        return this.data.save()
    }
    create(){
        this.clear()
        this.colshape = colshapes.new(this.position, this.name, player => this.menu(player), { dimension: this.dimension });
        this.scaleform = new ScaleformTextMp(new mp.Vector3(this.position.x, this.position.y, this.position.z + 1), this.name, {
            dimension: this.dimension,
            range: 7
        })
    }
    clear(){
        if(this.colshape && this.colshape.exists){
            this.colshape.destroy();
            this.colshape = null;
        }
        if(this.scaleform && ScaleformTextMp.exists(this.scaleform)){
            this.scaleform.destroy();
            this.scaleform = null;
        }
    }
    move(position: Vector3Mp, dimension: number){
        this.position = position;
        this.dimension = dimension;
        this.create();
        this.save();
    }
    delete(player: PlayerMp){
        player.user.log("AdminJob", `Удалил гардероб ${this.name} ${this.id}`);
        system.debug.debug('Гардероб', this.name, this.id, 'был удалён');
        this.data.remove()
        this.clear();
        JobDress.pool.splice(JobDress.getIndex(this.id), 1);
    }
    haveEditAccess(player: PlayerMp){
        const user = player.user;
        if(!user) return false;
        if(user.hasPermission('admin:jobdress')) return true;
        return false;
    }
    haveAccess(player: PlayerMp){
        const user = player.user;
        if(!user) return false;
        if(user.hasPermission('admin:jobdress')) return true;
        if(this.fraction && user.fraction === this.fraction) return true;
        if(!!this.job && this.job === user.job) return true;
        if (this.family && this.family === user.familyId) return true;
        return false;
    }
    dressEditMenu(player: PlayerMp){
        const user = player.user;
        if(!user) return;
        if(!this.haveEditAccess(player)) return;
        const m = menu.new(player, 'Управление каталогом одежды');
        m.newItem({
            name: `~b~Новая одежда`,
            onpress: () => {
                CustomEvent.triggerClient(player, 'jobdress:edit', this.id, null, null, null)
            }
        })
        if(user.isAdminNow(5)){
            m.newItem({
                name: `~y~Скопировать из гардероба по ИД`,
                desc: 'Укажите ИД другого гардероба, и мы скопируем из него всю одежду',
                onpress: () => {
                    menu.input(player, 'Введите ИД гардероба', '', 6, 'int').then(id => {
                        if(!id) return;
                        const l = JobDress.get(id);
                        if(!l) return player.notify('Гардероб не обнаружен', 'error');
                        const dressData = [...this.data.dress]
                        dressData.push(...l.data.dress)
                        this.data.dress = dressData;
                        this.save();
                        player.notify('Готово')
                    })
                }
            })
        }
        const dressData = [...this.data.dress]
        dressData.map((item,itemid) => {
            m.newItem({
                name: item.name,
                more: `${item.male ? 'Мужская' : 'Женская'}`,
                onpress: () => {
                    const qw = () => {
                        const submenu = menu.new(player, item.name);
                        submenu.onclose = () => { this.dressEditMenu(player) };
                        submenu.newItem({
                            name: '~r~Удалить комплект',
                            onpress: () => {
                                menu.accept(player).then(status => {
                                    if(!status) return;
                                    const d = [...this.data.dress];
                                    d.splice(itemid, 1);
                                    this.data.dress = d;
                                    this.save()
                                    player.notify("Комплект удалён", 'success');
                                    this.dressEditMenu(player);
                                })
                            }
                        })

                        submenu.newItem({
                            name: `~b~Редактировать`,
                            onpress: () => {
                                if(user.male !== item.male) return player.notify('Пол не совпадает', 'error');
                                CustomEvent.triggerClient(player, 'jobdress:edit', this.id, item.id, item.data, item.name)
                            }
                        })

                        submenu.newItem({
                            name: 'Название',
                            more: item.name,
                            onpress: () => {
                                menu.input(player, 'Введите название', item.name, 20, 'text').then(val => {
                                    if(!val) return this.dressEditMenu(player);
                                    const q = [...this.data.dress]
                                    q.find(z => z.id === item.id).name = system.filterInput(val);
                                    this.data.dress = [...q]
                                    this.save().then(() => {
                                        qw();
                                    });
                                })
                            }
                        });
                        if(this.fraction){
                            submenu.newItem({
                                name: 'Ранг',
                                more: fractionCfg.getRankName(this.fraction, item.rank),
                                onpress: () => {
                                    menu.selectRank(player, this.fraction, item.rank).then(rank => {
                                        if(!rank || rank === item.rank) return;
                                        const q = [...this.data.dress]
                                        q.find(z => z.id === item.id).rank = rank;
                                        this.data.dress = [...q]
                                        this.save().then(() => {
                                            player.notify('Данные сохранены')
                                            qw();
                                        });
                                    })
                                }
                            });
                        }

                        submenu.newItem({
                            name: '~r~Удалить',
                            onpress: () => {
                                menu.accept(player).then(status => {
                                    if(!status) return;
                                    const q = [...this.data.dress]
                                    const i = q.findIndex(z => z.id === item.id)
                                    q.splice(i, 1);
                                    this.data.dress = [...q]
                                    this.save().then(() => {
                                        qw();
                                    });
                                })
                                menu.input(player, 'Введите название', item.name, 20, 'text').then(val => {
                                    if(!val) return this.dressEditMenu(player);
                                    const q = [...this.data.dress]
                                    q.find(z => z.id === item.id).name = val;
                                    this.data.dress = [...q]
                                    this.save().then(() => {
                                        qw();
                                    });
                                })
                            }
                        });

                        submenu.open();
                    }
                    qw();

                }
            })
        })
        m.open();
    }
    getDress(player: PlayerMp){
        return this.getAllDress(player)[0]
    }
    getAllDress(player: PlayerMp){
        const user = player.user;
        if(!user) return [];
        return this.data.dress.filter(q => q.male == user.male && (!this.fraction || !q.rank || q.rank <= user.rank))
    }
    dressUp(player: PlayerMp, item: [number, number, number][]){
        const user = player.user;
        if(!user) return;
        if(!item) return user.setJobDress(null);
        user.setJobDress(item);
        user.jobdressId = this.id;
    }
    menu(player: PlayerMp){
        const user = player.user;
        if(!user) return;
        if(!this.haveAccess(player)) return player.notify('У вас нет доступа', 'error');
        const m = menu.new(player, this.name);



        if(user.getJobDress){
            m.newItem({
                name: '~b~Снять рабочую одежду',
                onpress: () => {
                    if(!user.mp_character) return player.notify('Вы не можете использовать гардероб пока используется не стандартный скин', 'error')
                    user.setJobDress(null);
                    player.notify('Рабочая одежда снята', 'success')
                    this.menu(player);
                }
            })
        }

        this.getAllDress(player).map(item => {
            m.newItem({
                name: item.name,
                onpress: () => {
                    if(!user.mp_character) return player.notify('Вы не можете использовать гардероб пока используется не стандартный скин', 'error')
                    this.dressUp(player, item.data);
                    player.notify('Рабочая форма надета', 'success');
                    this.menu(player);
                }
            })
        })

        if(this.haveEditAccess(player)){
            m.newItem({
                name: 'Управление одеждой',
                onpress: () => {
                    this.dressEditMenu(player);
                }
            })
        }

        if(user.hasPermission('admin:jobdress')){
            m.newItem({
                name: '~y~Админ раздел'
            })
            if(user.isAdminNow(5)){
                m.newItem({
                    name: '~r~ID гардероба',
                    more: this.id
                })
            }
            m.newItem({
                name: 'Перенести на моё местоположение',
                onpress: () => {
                    menu.accept(player).then(status => {
                        if(!status) return this.menu(player);
                        menu.close(player)
                        this.move(new mp.Vector3(player.position.x, player.position.y, player.position.z - 1), player.dimension)
                        player.notify('Гардероб перенесён', 'success');
                    })
                }
            })

            m.newItem({
                name: `~r~Удалить гардероб`,
                desc: 'Действие необратимо',
                onpress: () => {
                    menu.accept(player).then(status => {
                        if(!status) return this.menu(player);
                        menu.close(player)
                        this.delete(player)
                        player.notify('Гардероб удалён', 'success');
                    })
                }
            })
        }
        m.open();
    }
    constructor(item: JobDressEntity) {
        this.data = item;
        let q:typeof item.dress = [];
        item.dress.map(z => {
            if(z.id) q.push(z)
        })
        item.dress = [...q];
        this.create()
        JobDress.pool.push(this);
    }
}


CustomEvent.registerClient('garderob:new', player => {
    const user = player.user;
    if(!user) return;
    if(user.hasPermission('admin:jobdress')) JobDress.createMenu(player)
})
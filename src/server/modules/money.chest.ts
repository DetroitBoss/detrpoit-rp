import {MoneyChestEntity} from "./typeorm/entities/money.chest";
import {colshapeHandle, colshapes} from "./checkpoints";
import {system} from "./system";
import {DynamicBlip} from "./dynamicBlip";
import {menu} from "./menu";
import {CustomEvent} from "./custom.event";
import {ScaleformTextMp} from "./scaleform.mp";
import {saveEntity} from "./typeorm";
import {Logs} from "./logs";
import { fractionCfg } from "./fractions/main";


export class MoneyChestClass {
    static pool = new Map<number, MoneyChestClass>()
    colshape: colshapeHandle;
    label: ScaleformTextMp;
    blip: DynamicBlip;
    todayTaked = 0;
    static get(id: number){
        return this.pool.get(id);
    }
    static getByFraction(fraction: number){
        return this.getAllByFraction(fraction)[0]
    }
    static getAllByFraction(fraction: number){
        return [...this.pool].map(q => q[1]).filter(q => q.fraction === fraction)
    }
    static getByPlayer(player: PlayerMp){
        if(!mp.players.exists(player)) return null;
        if(!player.user) return null;
        if(!player.user.fraction) return null;
        return this.getByFraction(player.user.fraction)
    }
    static create(player: PlayerMp, fraction: number) {
        const pos = new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.98);
        let data = new MoneyChestEntity();
        data.x = pos.x;
        data.y = pos.y;
        data.z = pos.z;
        data.d = player.dimension;
        data.fraction = fraction;
        data.save().then(res => {
            this.load(res);
        })
    }
    static loadAll() {
        return MoneyChestEntity.find().then(list => {
            list.map(item => {
                this.load(item);
            })
        })
    }
    static load(data: MoneyChestEntity) {
        return new MoneyChestClass(data);
    }
    data: MoneyChestEntity;
    get day_limit() {
        return this.data.day_limit
    }
    set day_limit(val){
        this.data.day_limit = val
        this.save();
    }
    get money() {
        return this.data.money
    }
    set money(val){
        this.data.money = val
        if (ScaleformTextMp.exists(this.label)) this.label.text = `${this.name} ($${system.numberFormat(this.money)})`;
        this.save();
    }
    get position() {
        return new mp.Vector3(this.data.x, this.data.y, this.data.z)
    }
    set position(val){
        this.data.x = val.x
        this.data.y = val.y
        this.data.z = val.z
        this.drawAll()
        this.save();
    }
    get dimension() {
        return this.data.d
    }
    set dimension(val){
        this.data.d = val;
        this.drawAll()
        this.save();
    }
    get fraction() {
        return this.data.fraction
    }
    get id() {
        return this.data.id
    }
    get name() {
        return `Сейф с деньгами ` + fractionCfg.getFractionName(this.fraction);
    }
    save(){
        saveEntity(this.data);
    }
    delete() {
        this.clearAll();
        MoneyChestClass.pool.delete(this.id);
        this.data.remove();
    }
    clearAll(){
        if (this.colshape){
            this.colshape.destroy();
            this.colshape = null;
        }
        if (this.label && ScaleformTextMp.exists(this.label)){
            this.label.destroy();
            this.label = null;
        }
        if (this.blip){
            this.blip.destroy();
            this.blip = null;
        }
        
    }
    drawAll(){
        const visualizationPredicate = (p: PlayerMp) => {
            return p.user && (p.user.fraction === this.fraction || p.user.hasPermission('admin:moneychest:access'));
        }

        this.clearAll();
        this.colshape = colshapes.new(this.position, this.name, player => {
            this.menu(player);
        }, {
            dimension: this.dimension,
            type: 27,
            predicate: visualizationPredicate
        }, 'admin', 'fraction');
        
        this.label = new ScaleformTextMp(new mp.Vector3(this.position.x, this.position.y, this.position.z + 1), `${this.name}\n($${system.numberFormat(this.money)})`, {
            dimension: this.dimension,
            range: 10,
            type: "front"
        }, visualizationPredicate, 'admin', 'fraction');

        this.blip = system.createDynamicBlip(`moneychest_${this.id}`, 108, 1, this.position, `${this.name}`, {
            dimension: this.dimension,
            fraction: this.fraction,
            shortRange: false,
            range: 20,
            interior: true
        });
    }

    showLogs(player: PlayerMp){

        Logs.open(player, `money_${this.id}`, 'Сейф')

    }
    addLog(who: PlayerMp, text: string){
        Logs.new(`money_${this.id}`, `${who.user.name} ${who.dbid}`, text)
    }
    /** Внести наличку в сейф */
    addMoney(player: PlayerMp, sum: number, pay = true){
        if(player){
            const user = player.user;
            if (!user) return;
            if (sum < 0) return this.menu(player);
            if (pay && sum > user.money) return this.menu(player), player.notify("У вас нет столько налички", "error");
            this.addLog(player, `[${system.timeStampString(system.timestamp, true)}] Пополнил сейф на $${system.numberFormat(sum)}${pay ? ' со своего кармана' : ''}`)
        }
        this.money += sum;
        if(player && pay) player.user.removeMoney(sum, true, `Пополнение сейфа ${this.id}`);
        if(player && system.distanceToPos(player.position, this.position) < 3) this.menu(player)
    }
    /** Взять наличку с сейфа */
    removeMoney(player: PlayerMp, sum: number){
        const user = player.user;
        if (!user) return;
        if (sum < 0) return this.menu(player);
        if (sum > this.money) return this.menu(player), player.notify("В сейфе недостаточно налички", "error");
        if (this.day_limit){
            if (sum + this.todayTaked > this.day_limit) return player.notify(`Лимит на сутки по изиманию средств - $${system.numberFormat(this.day_limit)}. Вы уже взяли сегодня $${system.numberFormat(this.todayTaked)}`, 'error')
            this.todayTaked += sum;
        }
        this.addLog(player, `[${system.timeStampString(system.timestamp, true)}] Взял с сейфа $${system.numberFormat(sum)}`)
        this.money -= sum;
        user.addMoney(sum, true, `Взял деньги с сейфа ${this.id}`);
        if(system.distanceToPos(player.position, this.position) < 3) this.menu(player)
    }
    menu(player: PlayerMp){
        const user = player.user;
        if(!user) return;
        if (!user.hasPermission('admin:moneychest:access') && user.fraction !== this.fraction) return player.notify("У вас нет доступа к данному сейфу", "error");
        const m = menu.new(player, "", `${this.name} #${this.id}`);
        m.sprite = "safe"


        m.newItem({
            name: "Баланс",
            more: `$${system.numberFormat(this.money)}`,
            onpress: () => {
                if(user.isAdminNow(6)){
                    menu.input(player, "Введите сумму", 100, 8, 'int').then(sum => {
                        if (typeof sum !== "number" || sum < 0) return this.menu(player)
                        this.money = sum;
                        this.menu(player)
                    })
                }
            }
        })

        m.newItem({
            name: "Закинуть наличные",
            onpress: () => {
                menu.input(player, "Введите сумму", system.smallestNumber(user.money, 100), 8, 'int').then(sum => {
                    if (typeof sum !== "number" || !sum) return this.menu(player)
                    this.addMoney(player, sum)
                })
            }
        })

        if(user.grab_money || user.grab_money_shop){
            m.newItem({
                name: "Разгрузить сумку с деньгами",
                more: `$${user.grab_money ? system.numberFormat(user.grab_money) :  system.numberFormat(user.grab_money_shop)}`,
                onpress: () => {
                    if (!user.grab_money && !user.grab_money_shop) return;
                    m.close();
                    const moneyToAdd = user.grab_money ? user.grab_money : user.grab_money_shop
                    this.addMoney(player, fractionCfg.getFraction(this.fraction).gos ? moneyToAdd * 0.15 : moneyToAdd, false)
                    user.grab_money = 0;
                    user.grab_money_shop = 0;
                    player.notify("Вы успешно разгрузили сумку с деньгами", "success");
                }
            })
        }

        if (user.isSubLeader || user.hasPermission('admin:moneychest:access')){
            m.newItem({
                name: 'Логи',
                onpress: () => {
                    this.showLogs(player);
                }
            })
        }
        if (user.isSubLeader || user.hasPermission('admin:moneychest:access')){
            m.newItem({
                name: "Снять наличные",
                onpress: () => {
                    menu.input(player, "Введите сумму", system.smallestNumber(this.money, 100), 8, 'int').then(sum => {
                        if (typeof sum !== "number" || !sum) return this.menu(player)
                        this.removeMoney(player, sum)
                    })
                }
            })
            if(this.day_limit){
                m.newItem({
                    name: "Использованый лимит",
                    more: `$${system.numberFormat(this.todayTaked)} / $${system.numberFormat(this.day_limit)}`,
                    desc: 'При превышении лимита сейф вам не позволит брать больше средства с сейфа. Лимит действует до рестарта сервера'
                })
            }
        }

        if (user.hasPermission('admin:moneychest:access')){
            m.newItem({
                name: "Установить баланс",
                onpress: () => {
                    menu.input(player, "Введите баланс", this.money, 8, 'int').then(sum => {
                        if(typeof sum !== "number" || sum < 0) return this.menu(player)
                        
                        this.money = sum;
                        player.notify("Новый баланс установлен", "success");
                        this.menu(player)
                    })
                }
            })
            m.newItem({
                name: "Установить лимит на сутки",
                desc: "Этот параметр отвечает за то, сколько лидер может взять за сутки денег. Если 0 - лимита нет",
                more: `$${system.numberFormat(this.day_limit)}`,
                onpress: () => {
                    menu.input(player, "Введите новый лимит", this.day_limit, 8, 'int').then(sum => {
                        if(typeof sum !== "number" || sum < 0) return this.menu(player) 
                        this.day_limit = sum;
                        player.notify("Новый лимит установлен", "success");
                        this.menu(player)
                    })
                }
            })
            if(system.distanceToPos(player.position, this.position) > 10){
                m.newItem({
                    name: "~b~ТП на место сейфа",
                    onpress: () => {
                        user.teleport(this.position.x, this.position.y, this.position.z, 0, this.dimension)
                    }
                })
            }
            m.newItem({
                name: "~b~Перенести на моё место",
                onpress: () => {
                    menu.accept(player).then(status => {
                        if(!status) return this.menu(player)
                        this.position = new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.98);
                        setTimeout(() => {
                            if(this.dimension !== player.dimension) this.dimension = player.dimension;
                            this.menu(player)
                            player.notify("Сейф успешно перенесён", "success")
                        }, 200);
                    })
                }
            })
            m.newItem({
                name: "~r~Удалить сейф",
                onpress: () => {
                    menu.accept(player).then(status => {
                        if(!status) return this.menu(player)
                        this.delete()
                        player.notify("Сейф успешно удалён", "success")
                    })
                }
            })
        }


        m.open();
    }
    constructor(data: MoneyChestEntity) {
        this.data = data;
        this.drawAll();
        MoneyChestClass.pool.set(this.id, this);
    }
}

const adminMenu = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    const m = menu.new(player, "Сейфы", "Список");

    MoneyChestClass.pool.forEach(item => {
        m.newItem({
            name: `${item.name} #${item.id}`,
            more: `$${system.numberFormat(item.money)}`,
            onpress: () => {
                item.menu(player);
            }
        })
    })

    m.newItem({
        name: `Новый сейф`,
        onpress: () => {
            menu.selectFraction(player).then(fraction => {
                if(!fraction) return adminMenu(player)
                if (MoneyChestClass.getByFraction(fraction)) return player.notify("Для данной фракции уже создан сейф", "error"), adminMenu(player);
                MoneyChestClass.create(player, fraction);
                player.notify("Сейф успешно создан", "success");
            })
        }
    })

    m.open();
}

CustomEvent.registerClient('admin:moneychest:access', player => {
    adminMenu(player);
})
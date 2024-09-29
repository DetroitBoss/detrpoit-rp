import {FractionGarageEntity} from "./typeorm/entities/fraction.garage";
import {colshapeHandle, colshapes} from "./checkpoints";
import {system} from "./system";
import {menu} from "./menu";
import {Vehicle} from "./vehicles";
import {CustomEvent} from "./custom.event";
import {User} from "./user";
import {DynamicBlip} from "./dynamicBlip";
import {ScaleformTextMp} from "./scaleform.mp";
import {fractionCfg} from "./fractions/main";


CustomEvent.registerClient('admin:fraction:garage', player => {
    const open = () => {
        const user = player.user;
        if (!user) return false;
        if (!user.hasPermission("admin:garage:accessRemote")) return player.notify("У вас нет доступа", "error");
        const m = menu.new(player, "Фракционные гаражи", "Список");
        FractionGarage.list.forEach(item => {
            m.newItem({
                name: `#${item.id} ${item.name}`,
                onpress: () => {
                    const submenu = menu.new(player, "Действия", "Список");
                    submenu.onclose = () => {
                        open();
                    }
                    submenu.newItem({
                        name: "Открыть",
                        onpress: () => {
                            item.menu(player);
                        }
                    })
                    submenu.newItem({
                        name: "Клонировать",
                        desc: "При клонировании мы скопируем полный дамп гаража и создадим новый в том месте, где вы стоите",
                        onpress: () => {
                            submenu.close();

                            FractionGarage.create(item.name, item.fraction, new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.9), player.heading, player.dimension, item.cars.map(car => {
                                let item = [...car]
                                item[1] = system.randomStr(8)
                                item[2] = system.getRandomInt(100000, 999999)
                                return item;
                            }));
                        }
                    })
                    submenu.open();
                }
            })
        })
        m.newItem({
            name: "Новый гараж",
            desc: "Создать гараж на вашем текущем месте",
            onpress: () => {
                menu.selectFraction(player).then(fraction => {
                    if(!fraction) return open();
                    FractionGarage.create(fractionCfg.getFractionName(fraction), fraction, new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.98), player.heading, player.dimension);
                    player.notify("Гараж успешно создан", "success");
                })
            }
        })
        m.open();
    }
    open();
})


export class FractionGarage {
    data: FractionGarageEntity;
    colshape: colshapeHandle;
    label: ScaleformTextMp;
    blip: DynamicBlip;
    static create(name: string, fraction: number, position: Vector3Mp, heading: number, dimension: number, cars?: any[]){
        const data = new FractionGarageEntity();

        data.name = name;
        data.fraction = fraction;
        data.x = position.x;
        data.y = position.y;
        data.z = position.z;
        data.d = dimension;
        data.h = heading;
        data.cars = cars ? cars : [];

        data.save().then(res => {
            this.load(res)
        })
    }
    static load(data: FractionGarageEntity){
        return new FractionGarage(data)
    }
    static loadAll(){
        return FractionGarageEntity.find().then(datas => {
            datas.map(data => {
                this.load(data);
            })
        })
    }
    static list = new Map < number, FractionGarage>();
    static get(id: number){
        return this.list.get(id);
    }

    get position(){
        return new mp.Vector3(this.data.x, this.data.y, this.data.z)
    }
    set position(val){
        this.data.x = val.x;
        this.data.y = val.y;
        this.data.z = val.z;
        this.createColshape();
        this.save();
    }
    
    get dimension(){
        return this.data.d
    }
    set dimension(val){
        this.data.d = val;
        this.createColshape();
        this.save();
    }
    get heading(){
        return this.data.h
    }
    set heading(val){
        this.data.h = val;
        this.save();
    }
    get id(){
        return this.data.id
    }
    get name(){
        return this.data.name
    }
    set name(val){
        this.data.name = val;
        this.createLabel();
        this.save();
    }
    get prefix(){
        return this.data.prefix
    }
    set prefix(val){
        this.data.prefix = val;
        this.createLabel();
        this.save();
    }
    get cars(){
        return this.data.cars
    }
    set cars(val){
        this.data.cars = val;
    }
    get fraction(){
        return this.data.fraction
    }
    set fraction(val){
        this.data.fraction = val;
        this.save();
    }
    get closed(){
        return !!this.data.closed
    }
    set closed(val){
        this.data.closed = val ? 1 : 0;
        this.save();
    }

    delete(){
        FractionGarage.list.delete(this.id)
        if (this.colshape) this.colshape.destroy();
        if (this.label) this.label.destroy();
        if (this.blip) this.blip.destroy();
        this.data.remove();
    }

    save(){
        this.data.save();
    }

    insertCar(model: string, r1: number, g1: number, b1: number, r2: number, g2: number, b2: number, livery: number){
        const plate = system.randomStr(8);
        const cars = [...this.cars];
        cars.push([model, plate.toUpperCase(), system.getRandomInt(100000, 999999), fractionCfg.getLeaderRank(this.fraction), r1, g1, b1, r2, g2, b2, livery]);
        this.cars = cars;
        this.save();
    }

    constructor(data: FractionGarageEntity){
        this.data = data
        this.createColshape();
        this.cars.map(car => {
            car[1] = car[1].toUpperCase();
        })

        FractionGarage.list.set(this.id, this);
    }
    usedVehicles = new Map<number, string>();
    createLabel(){
        if (this.label && ScaleformTextMp.exists(this.label)) this.label.destroy();
        this.label = new ScaleformTextMp(new mp.Vector3(this.position.x, this.position.y, this.position.z + 1), `Гараж ${this.name}`, {
            dimension: this.dimension,
            range: 10,
            type: "front"
        })
    }
    createColshape(){
        if(this.colshape) this.colshape.destroy();
        this.createLabel();
        const color = fractionCfg.getFractionColor(this.fraction);
        const rgb = color ? system.hexToRgb(color) : {r: 255, g: 0, b: 0};
        
        this.colshape = colshapes.new(this.position, () => {return this.name}, player => {
            this.menu(player)
        }, {
            dimension: this.dimension,
            type: 27,
            radius: 3,
            color: [rgb.r, rgb.g, rgb.b, 120]
        })
        if(this.blip) this.blip.destroy();
        this.blip = system.createDynamicBlip(`garage_${this.id}`, 50, 58, this.position, `Гараж ${this.name}`, {
            dimension: this.dimension,
            fraction: this.fraction,
            shortRange: false,
            range: 150
        })
    }
    haveAccessEdit(player: PlayerMp){
        const user = player.user;
        if(!user) return false;
        if (user.hasPermission("admin:garage:accessRemote")) return true;
        if(this.fraction !== user.fraction) return false;
        if (!user.hasPermission("fraction:garage:accessEdit")) return false;
        return true;
    }
    haveAccess(player: PlayerMp){
        const user = player.user;
        if(!user) return false;
        if (user.hasPermission("admin:garage:accessRemote")) return true;
        if(this.fraction === user.fraction) return true;
        return false;
    }
    menu(player: PlayerMp){
        const user = player.user;

        let veh = User.getNearestVehicle(player, 5);
        if (veh) {
            if (veh.garage !== this.id) veh = null;
        }


        if(!this.haveAccess(player)) return player.notify("У вас нет доступа к данному гаражу", "error");
        if (!this.haveAccessEdit(player) && !veh) return this.open(player);
        const m = menu.new(player, "", `Гараж ${this.name} (#${this.id})`)
        m.sprite = "shopui_title_ie_modgarage"

        m.newItem({
            name: "Открыть гараж",
            onpress: () => {
                this.open(player);
            }
        })
        m.newItem({
            name: "Поставить ближайший ТС в гараж",
            onpress: () => {
                let veh = User.getNearestVehicle(player, 5);
                if (veh) {
                    if (veh.garage !== this.id) veh = null;
                }
                if(!veh){
                    player.notify("Поблизости нет ТС либо этот ТС не принадлежит данному гаражу", "error")
                } else {
                    Vehicle.destroy(veh);
                }
                setTimeout(() => {
                    if(mp.players.exists(player)) this.menu(player);
                }, 100)
            }
        })



        if (!this.haveAccessEdit(player)) return m.open();

        m.newItem({
            name: "Каталог транспорта",
            onpress: () => {
                const submenu = menu.new(player, "", "Каталог ТС");
                submenu.onclose = () => {
                    this.save();
                    this.menu(player);
                }
                submenu.sprite = "shopui_title_ie_modgarage"
                let cars = [...this.cars];
                cars.map((car, i) => {
                    const cfg = Vehicle.getVehicleConfig(car[0]);
                    const name = cfg ? cfg.name : car[0];
                    const used = this.usedVehicles.get(car[2]);
                    submenu.newItem({
                        name: `${name} [${car[1]}]`,
                        type: 'list',
                        desc: `${used ? `Транспорт уже взят с гаража(${used})` : 'Транспорт в гараже'}`,
                        list: fractionCfg.getFractionRanks(this.fraction),
                        listSelected: car[3] - 1,
                        onchange: (val) => {
                            car[3] = val + 1
                        },
                        onpress: () => {
                            if(!user.hasPermission("admin:garage:accessRemote")) return;
                            menu.accept(player, 'Удалить ТС из гаража?').then(status => {
                                if(!status) return;
                                menu.close(player);
                                const used = this.usedVehicles.get(car[2]);
                                if(used) return player.notify('ТС сейчас используется и не может быть удалён из гаража', 'error');
                                cars.splice(i, 1);
                                this.cars = cars;
                                this.save();
                                player.notify('ТС удалён из гаража', 'success');
                            })
                        }
                    })
                })

                submenu.newItem({
                    name: '~g~Сохранить',
                    onpress: () => {
                        this.cars = cars;
                        this.save();
                        player.notify('Изменения сохранены', 'success')
                    }
                })

                if (user.hasPermission('admin:garage:accessRemote')){
                    submenu.newItem({
                        type: "range",
                        rangeselect: [1, 10],
                        name: `Добавить мой ТС в гараж`,
                        desc: 'При нажатии на эту кнопку вы добавите в каталог данного гаража копию ТС, в котором сами находитесь. Стрелками влево-вправо вы можете выбрать количество этих самых ТС',
                        onpress: (itm) => {
                            if(!player.vehicle) return player.notify("Вы должны быть в ТС, который хотите добавить", "error")
                            const model = player.vehicle.modelname;
                            const color1 = Vehicle.getPrimaryColor(player.vehicle);
                            const color2 = Vehicle.getSecondaryColor(player.vehicle);
                            const livery = player.vehicle.livery
                            for(let id = 0; id <= itm.listSelected; id++) this.insertCar(model, color1.r, color1.g, color1.b, color2.r, color2.g, color2.b, livery);
                            player.notify("ТС упешно добавлен", "success");
                            this.menu(player);
                        }
                    })
                }

                submenu.open();
            }
        })

        m.newItem({
            name: "Открыть/Закрыть гараж",
            desc: 'Вы можете временно закрыть доступ к гаражу, чтобы никто кроме тех, кто может им управлять не мог брать из него ТС',
            more: `${this.closed ? '~r~Закрыт' : '~g~Открыт'}`,
            onpress: () => {
                this.closed = !this.closed;
                player.notify(`Гараж ${this.closed ? 'Закрыт' : 'Открыт'}`, "error");
                this.menu(player);
            }
        })

        if (user.hasPermission("admin:garage:accessRemote")){
            if(!this.cars.find(car => Vehicle.isVehicleCommercial(car[0]))){
                m.newItem({
                    name: "~r~Отсутствует комерческий транспорт",
                    desc: 'В данном гараже нет комерческого транспорта. Без него члены фракции не смогут доставлять вещи со склада, ибо перевозить можно только на комерческом транспорте'
                })
            }
            m.newItem({
                name: "Название гаража",
                more: this.name,
                onpress: () => {
                    menu.input(player, "Введите название гаража", this.name).then(res => {
                        if(!res) return;
                        this.name = res;
                        this.menu(player);
                    })
                }
            })
            m.newItem({
                name: "Префикс гаража",
                desc: 'Если указать - то ТС будет спавнится с определённым префиксом',
                more: this.prefix || "Не указан",
                onpress: () => {
                    menu.input(player, "Введите префикс гаража", this.prefix).then(res => {
                        if(!res && typeof res !== "string") return;
                        this.prefix = res;
                        this.menu(player);
                    })
                }
            })
            m.newItem({
                name: "~b~Перенести гараж на моё местоположение",
                more: this.name,
                onpress: () => {
                    menu.accept(player).then(res => {
                        if (!res) return;
                        this.position = new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.9);
                        if(this.dimension !== player.dimension) this.dimension = player.dimension;
                        player.notify("Гараж перенесён", "error");
                    })
                }
            })
            m.newItem({
                name: "~r~Удалить",
                onpress: () => {
                    menu.accept(player).then(res => {
                        if(!res) return;
                        this.delete();
                    })
                }
            })
        }

        m.open();
    }
    open(player: PlayerMp){
        const user = player.user;
        if (!this.haveAccessEdit(player) && this.closed) return player.notify("Гараж закрыт", "error");
        const m = menu.new(player, "", "Список транспорта")
        m.sprite = "shopui_title_ie_modgarage"

        this.cars.map((car, carids) => {
            const cfg = Vehicle.getVehicleConfig(car[0]);
            const name = cfg ? cfg.name : car[0];
            const used = this.usedVehicles.get(car[2]);
            const rank = car[3] || 0;
            if(rank > user.rank) return;
            m.newItem({
                name: `${used ? '~r~' : '~g~'}${name}`,
                more: `${car[1]}`,
                desc: used ? `Транспорт уже взят с гаража (${used})` : `Транспорт в гараже ${Vehicle.isVehicleCommercial(car[0]) ? '(Подходит для перевозок)' : ''}`,
                onpress: () => {
                    m.close();
                    if(!this.haveAccessEdit(player)){
                        if(car[3] > user.rank) return player.notify("У вас нет доступа к данному транспорту", "error");
                    }
                    const used = this.usedVehicles.get(car[2]);
                    if (used){
                        const veh = Vehicle.toArray().find(v => v.fraction === this.fraction && v.garage === this.id && v.garagecarid == car[2])
                        if(veh){
                            if(veh.getOccupants().length > 0){
                                user.setWaypoint(veh.position.x, veh.position.y, veh.position.z, `Местоположение фракционного ТС ${car[1]}`, true);
                                player.notify(`Транспорт уже взят с гаража (${used}) и используется. ${veh ? 'GPS метка установлена' : 'Местоположение не известно'}`, "error");
                            } else {
                                Vehicle.teleport(veh, this.position, this.heading, this.dimension);
                                Vehicle.repair(veh, true);
                                player.user.putIntoVehicle(veh, 0);
                            }
                        }
                        return;
                    }
                    if(system.distanceToPos(player.position, this.position) > 10 || player.dimension !== this.dimension) return player.notify("Брать ТС на расстоянии нельзя", "error");
                    if(Vehicle.toArray().filter(veh => veh && veh.dimension === this.dimension && system.distanceToPos(veh.position, this.position) < 2).length > 0) return player.notify("Гараж заставлен транспортом, освободите зону", "error")
                    this.usedVehicles.set(car[2], `${user.name} #${user.id}`);
                    const veh = Vehicle.spawnFractionVehicle(this.fraction, car[2], this.id, car[0], this.position, this.heading, this.dimension, this.prefix ? this.prefix+(carids+1) : car[1]);
                    veh.fractionMinRank = car[3];
                    Vehicle.setPrimaryColor(veh, car[4], car[5], car[6])
                    Vehicle.setSecondaryColor(veh, car[7], car[8], car[9])
                    if(typeof car[10] === "number") veh.livery = car[10]
                    setTimeout(() => {
                        if (!mp.players.exists(player)) return;
                        if (!mp.vehicles.exists(veh)) return;
                        player.user.putIntoVehicle(veh, 0);
                    }, 500)
                }
            })
        })
        
        m.newItem({
            name: `Вернуть весь транспорт`,
            onpress: () => {
                m.close();

                if (!this.haveAccessEdit(player)){
                    return player.notify('У вас нет доступа', 'error')
                }

                let count = 0;
                this.cars.forEach(car => {
                    const used = this.usedVehicles.get(car[2]);
                    
                    if (used) {
                        const veh = Vehicle
                            .toArray()
                            .find(v => v.fraction === this.fraction && v.garage === this.id && v.garagecarid == car[2])
                        if (veh) {
                            if (veh.getOccupants().length === 0) {
                                Vehicle.destroy(veh)
                            }
                            else count++;
                        }
                    }
                });
                if (count) player.notify(`${count} машин заняты`, 'info')
            }
        });
                
        m.open();
    }
}

setInterval(() => FractionGarage.list.forEach(item => item.save()), 240000);
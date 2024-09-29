import {VehicleConfigsEntity} from "./typeorm/entities/vehicle.configs"
import {VehicleEntity} from "./typeorm/entities/vehicle";
import {system} from "./system";
import {CustomEvent} from "./custom.event";
import {inventory} from "./inventory";
import {inventoryShared, KEYS_ITEM_ID, OWNER_TYPES} from "../../shared/inventory";
import {
    commercialVehicles,
    FUEL_MAX_DEFAULT, isABike, isAMotorcycle,
    maxAfkFractionCarTime,
    maxAfkRentCarTime,
    maxAfkTime,
    npcVehicles,
    VEHICLE_FUEL_RATE,
    VEHICLE_FUEL_TYPE
} from "../../shared/vehicles";
import {menu} from "./menu";

import {FractionGarage} from "./fraction.garages";
import {OPENING_HOOD_LIST, PLAYER_IN_VEHICLE_CONFIG, PlayerInVehicleConfigItem} from "../../shared/player.in.vehicle";
import {houses} from "./houses";
import {business} from "./business";
import {BUSINESS_SUBTYPE_NAMES, BUSINESS_TYPE} from "../../shared/business";
import {parking} from "./businesses/parking";
import {PARKING_CARS, PARKING_DAY_COST, PARKING_START_COST} from "../../shared/parking";
import {vehicleSpawnPoints} from "../../shared/npc.park.zone";
import {User} from "./user";
import {DONATE_VIRTS_PER_COIN, SELL_GOS_TAX_PERCENT, VEHICLE_RESPAWN_COST} from "../../shared/economy";
import {userChoise} from "./admin";
import {UserEntity} from "./typeorm/entities/user";
import {saveEntity} from "./typeorm";
import {DELIVER_COOLDOWN_SECONDS, DELIVER_COST, DELIVER_SECONDS} from "../../shared/deliver.system";
import {Family} from "./families/family";
import {FamilyEntity} from "./typeorm/entities/family";
import {ChipTuningOption} from "../../shared/lsc";
import {DRIFT_PARAMS} from "../../shared/drift";
import {Logs} from "./logs";
import {getX2Param, UserStatic} from "./usermodule/static";
import {gui} from "./gui";
import {distinctArray} from "../../shared/arrays";
import {BATTLE_PASS_VEHICLES} from "../../shared/battlePass/main";
import {lscConfig} from "./businesses/lsc";


setTimeout(() => {
    Vehicle.spawnNpcVehicles(mp.config.announce);
    setInterval(() => {
        Vehicle.spawnNpcVehicles(false);
    }, 30 * 60000)
}, 1000)

let orderCd = new Map<number, number>();

// CustomEvent.registerClient('vehicle:getAllTuning', (player, vehicleId) => {
//     if(!mp.vehicles.at(vehicleId)) return []
//     return mp.vehicles.at(vehicleId).entity.data.tuning
// })

CustomEvent.registerClient('vehicle:getMaxSpeed', (player, modelName: string) => {
    return getVehicleConfig(modelName)?.maxSpeed ?? 999
})

CustomEvent.registerCef('drift:set', (player, data: {ids: number, status: boolean, angle:number, speed:number}) => {
    const user = player.user;
    if(!user) return;
    const veh = player.vehicle;
    if(!veh) return;
    if(!user.isDriver) return;
    if(veh.inventoryTmp !== data.ids) return;
    veh.setVariables({
        driftAngle: data.angle,
        driftSpeed: data.speed,
        driftEnable: data.status,
    })
})

CustomEvent.registerCef('vehicle:requestrespawn', (player, id: number) => {
    const user = player.user;
    if(!user) return;
    if(user.spam(1000)) return;

    const veh = Vehicle.toArray().find(vehicle => vehicle.dbid === id)?.entity;
    if (!veh || !veh.exists) {
        return;
    }

    if (veh.data.carSharing)
        return player.notify('Нельзя заказать доставку этого ТС')
    
    if (veh.familyOwner) {
        const familyVehicle = user.family.cars.find(q => q.id == id)

        if(!familyVehicle || !familyVehicle.exists)
            return;

        if (!user.family.isCan(user.familyRank, 'car_park'))
            return player.notify('У вас нет полномочий отправить машину в гараж')
    }

    const inSpawn = veh.inSpawnPoint;
    menu.accept(player, `Вы хотите заказать доставку ТС ${!inSpawn ? `в гараж` : 'к себе'}. Стоимость $${system.numberFormat(inSpawn ? DELIVER_COST : VEHICLE_RESPAWN_COST)}`, 'small').then(async status => {
        if(!status) return;
        const myPos = {...player.position};
        if(!mp.players.exists(player)) return;
        if(inSpawn){
            if(veh.familyOwner && !user.family.isCan(user.familyRank, 'car_teleport')) return player.notify('У вас нет полномочий отправить к себе')
            if(player.dimension) return player.notify('В данное место нельзя осуществить доставку', 'error');
            if(user.attachedToPlace) return player.notify('Вы не можете заказать доставку ТС в данный момент', 'error');
            if(user.bank_money < DELIVER_COST) return player.notify('У вас недостаточно средств для оплаты доставки')
            if(user.inSaveZone) return player.notify('В данную зону нельзя осуществить доставку', 'error')
            if(orderCd.has(user.id) && orderCd.get(user.id) - system.timestamp > 0) return player.notify(`Вы недавно заказывали доставку ТС. Повторный заказ вы сможете сделать через ${(orderCd.get(user.id) - system.timestamp > 0 ? orderCd.get(user.id) - system.timestamp : 'несколько')} секунд`, 'error')
            if(player.vehicle) return player.notify('Покиньте транспорт', 'error')
            player.notify('Ожидайте поблизости', 'success')
            if(!await user.waitTimer(10, DELIVER_SECONDS, 'Ожидание доставки')) return;
            if(player.vehicle) return player.notify('Покиньте транспорт', 'error')
        }
        if(inSpawn !== veh.inSpawnPoint) return;
        if(veh.onParkingFine) return player.notify('ТС на штрафстоянке', 'error');
        if(!veh.exists) return;
        if(veh.vehicle.getOccupants().length) return player.notify('В ТС кто то находится', "error");
        if(!user.tryRemoveBankMoney(inSpawn ? DELIVER_COST : VEHICLE_RESPAWN_COST, true, `Доставка ${veh.name} ${veh.number} ${!inSpawn ? `в гараж` : 'к себе'}`, 'Служба эвакуации')) return;
        if(inSpawn) {
            orderCd.set(user.id, system.timestamp + DELIVER_COOLDOWN_SECONDS)
            const ids = user.id;
            setTimeout(() => {
                orderCd.delete(ids)
            }, DELIVER_COOLDOWN_SECONDS * 1000)
            Vehicle.teleport(veh.vehicle, new mp.Vector3(myPos.x, myPos.y, myPos.z), 0, 0)
            veh.vehicle.usedAfterRespawn = true;
        } else veh.respawn();
        player.notify(`ТС доставлен ${inSpawn ? `к вам` : 'на точку парковки'}`, "success");
    })
})

CustomEvent.registerClient('vehicle:syncDirt', (player, val: number) => {
    const user = player.user;
    if(!user) return;
    const veh = player.vehicle;
    if(!veh) return;
    Vehicle.setDirtLevel(veh, val);
})

export class Vehicle {
    private static tempid = 10000000;
    static getInventory(vehicle: VehicleMp){
        if(!mp.vehicles.exists(vehicle)) return [];
        if (vehicle.garagecarid){
            const garage = FractionGarage.get(vehicle.garage);
            if(garage) return inventory.getInventory(OWNER_TYPES.FRACTION_VEHICLE, vehicle.garagecarid)
        }
        else if (!vehicle.dbid) return inventory.getInventory(OWNER_TYPES.VEHICLE_TEMP, vehicle.inventoryTmp)
        else return inventory.getInventory(OWNER_TYPES.VEHICLE, vehicle.dbid)
    }
    static getName(vehicle: VehicleMp|string){
        if (typeof vehicle !== "string" && !mp.vehicles.exists(vehicle)) return null;
        const cfg = this.getVehicleConfig(typeof vehicle !== "string" ? vehicle.modelname : vehicle);
        if(cfg) return cfg.name
        return typeof vehicle !== "string" ? vehicle.modelname : vehicle
    }
    static getDirtLevel(vehicle: VehicleMp){
        if(!vehicle || !mp.vehicles.exists(vehicle)) return 0.0;
        return vehicle.getVariable('dirt') || 0.01
    }
    static setDirtLevel(vehicle: VehicleMp, val: number){
        if(!vehicle || !mp.vehicles.exists(vehicle)) return;
        vehicle.setVariable('dirt', val ? val : 0.01)
    }
    static isNumberValid(number: string){
        const test = /^[a-zA-Z0-9 ]{1,8}$/
        return number.search(test) === 0
    }
    static applyChipTuning(vehicle: VehicleMp, data: ChipTuningOption[]) {
        vehicle.setVariable('tuning:chip', JSON.stringify(data));
    }
    static spawnNpcVehicles(test = false){
        if(Vehicle.toArray().filter(q => q.npc).length > 100) return;
        let points: {
            x: number;
            y: number;
            z: number;
            heading: number;
            models: string[];
            id: number;
        }[] = [];

        if (points.length === 0){
            vehicleSpawnPoints.map(item => {
                if (!points.find(q => system.distanceToPos(new mp.Vector3(item.x, item.y, item.z), new mp.Vector3(q.x, q.y, q.z)) < 10)) points.push(item);
            })
    
            points = points.filter(q => !system.isPointInPoints(new mp.Vector3(q.x, q.y, q.z), this.blockNpcCarZone, 20));
        }

        const vehs = Vehicle.toArray().filter(q => q.dimension === 0).map(q => q.position).filter(q => system.isPointInPoints(q, points, 50));
        points = points.filter(q => !system.isPointInPoints(q, vehs, 50))

        points.map((item, index) => {
            const model = item.models && item.models.length > 1 ? system.randomArrayElement(item.models) : system.randomArrayElement(npcVehicles)
            if (this.isVehicleCommercial(model)) return;
            const veh = this.spawn(model, new mp.Vector3(item.x, item.y, item.z), item.heading, 0, false, system.getRandomInt(1, 5) !== 1);
            veh.numberPlate = system.randomStr(8).toUpperCase();
            if (system.getRandomInt(1, 4) == 1) {
                this.setPrimaryColor(veh, 255, 255, 255)
                this.setSecondaryColor(veh, 255, 255, 255)
            } else if (system.getRandomInt(1, 3) == 2) {
                const r = system.getRandomInt(0, 120);
                const g = system.getRandomInt(0, 120);
                const b = system.getRandomInt(0, 120);
                this.setPrimaryColor(veh, r, g, b)
                this.setSecondaryColor(veh, r, g, b)
            }
            veh.npc = true;
            if (test) mp.labels.new(`ID: ${item.id}`, new mp.Vector3(item.x, item.y, item.z), {
                drawDistance: 15, los: false
            })
        })
    }
    static blockNpcCarZone: Vector3Mp[] = []
    static addBlockNpcCarZone(pos: Vector3Mp){
        Vehicle.toArray().filter(veh => veh.npc).filter(veh => system.distanceToPos(veh.position, pos) < 30).map(veh => veh.destroy());
        this.blockNpcCarZone.push(pos)
    }
    data: VehicleEntity;
    vehicle: VehicleMp;
    id: number;
    static list = new Map <number, Vehicle>();
    static get(id: number){
        return this.list.get(id);
    }
    static getByTmpId(id: number){
        return Vehicle.toArray().find(veh => veh.inventoryTmp === id);
    }
    static getByCarageCarId(id: number){
        return Vehicle.toArray().find(veh => veh.garagecarid === id);
    }
    get isDonate(){
        return this.data.isDonate
    }
    get config(){
        return getVehicleConfig(this.vehicle.modelname)
    }
    get avia(){
        const cfg = this.config;
        if(!cfg) return false;
        return cfg.fuel_type === VEHICLE_FUEL_TYPE.AIR
    }
    /** Номерной знак */
    get number(){
        return this.data.number
    }
    set number(val: string){
        this.data.number = val;
        this.save();
    }
    /** Налоги */
    get tax(){
        return this.data.tax
    }
    get tax_day(){
        return this.data.taxDay
    }
    set tax(val){
        this.data.tax = val;
        this.save();
    }
    setOwner(owner: UserEntity, pos: {
        x: number;
        y: number;
        z: number;
        h: number;
        d: number;
    }){
        if(owner){
            this.key = system.getRandomInt(1000000, 9999999);
            this.data.userId = owner.id;
            this.data.user = owner;
            this.data.tax = 0;
            this.position = pos;
            if(this.exists) {
                this.vehicle.setVariable('owner', owner.id);
                this.vehicle.user = owner.id;
            }
            this.data.family = null;
            this.data.familyId = null;
            if(this.exists && this.vehicle.getVariable('ownerfamily')) this.vehicle.setVariable('ownerfamily', null);
            this.save()
        }
    }

    setOwnerFamily(owner: FamilyEntity, pos: {
        x: number;
        y: number;
        z: number;
        h: number;
        d: number;
    }){
        if(owner){
            this.key = system.getRandomInt(1000000, 9999999);
            this.data.family = owner;
            this.data.familyId = owner.id;
            this.data.tax = 0;
            this.position = pos;
            if(this.exists) {
                this.vehicle.setVariable('ownerfamily', owner.id);
                this.vehicle.user = owner.id;
            }
            this.data.user = null;
            this.data.userId = null;
            if(this.exists && this.vehicle.getVariable('owner')) this.vehicle.setVariable('owner', null);
            this.save()
        }
    }
    get owner(){
        return this.data.userId
    }
    get familyOwner(){
        return this.data.familyId
    }
    get fromRank() {
        return this.data.fromRank

    }
    set fromRank(num) {
        if(isNaN(num) || num < 0) this.data.fromRank = 1
        else this.data.fromRank = num
        saveEntity(this.data)
    }
    get ownerData(){
        if(!this.owner) return null;
        return User.getData(this.owner)
    }
    get name(){
        const data = getVehicleConfig(this.data.model);
        if (!data) return this.data.model
        else return data.name
    }
    get model(){
        return this.data.model
    }
    get exists(){
        return mp.vehicles.exists(this.vehicle)
    }
    setNumber(value:string){
        if(!value) value = system.randomStr(8)
        this.data.number = value;
        if (this.exists) this.vehicle.numberPlate = value;
        this.save();
    }
    setRandomNumber(len = 8){
        const value = system.randomStr(len);
        this.setNumber(value);
    }
    
    constructor(data: VehicleEntity){
        let fndVeh = Vehicle.toArray().find(veh => veh.dbid == data.id);
        if(fndVeh) Vehicle.destroy(fndVeh);
        let pos = JSON.parse(data.position) as {x:number, y:number, z: number, h:number, d: number;}
        this.vehicle = Vehicle.spawn(data.model, new mp.Vector3(pos.x, pos.y, pos.z), pos.h, pos.d, false, true)
        this.data = data
        this.id = data.id
        this.vehicle.dbid = data.id
        this.vehicle.needRespawn = true
        this.vehicle.user = data.userId
        this.vehicle.setVariable('id', data.id)
        if(data.familyId){
            this.vehicle.setVariable('ownerfamily', data.familyId)
        } else {
            this.vehicle.setVariable('owner', data.userId)
        }
        this.vehicle.numberPlate = data.number;
        let primaryColor = JSON.parse(data.color_primary) as RGB;
        let secondaryColor = JSON.parse(data.color_secondary) as RGB;
        this.vehicle.setColorRGB(primaryColor[0], primaryColor[1], primaryColor[2], secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        this.vehicle.entity = this;
        Vehicle.setDirtLevel(this.vehicle, this.data.dirt)
        Vehicle.list.set(this.id, this);
        this.vehicle.setVariables({
            driftAngle: this.data.driftAngle,
            driftSpeed: this.data.driftSpeed,
            driftEnable: false,
        })
        setTimeout(() => {
            this.applyCustomization();
        }, 100)
    }
    static enableDrift(veh: VehicleMp){
        if(!veh || !mp.vehicles.exists(veh)) return;
        veh.setVariable('driftEnable', false)
    }
    static getDriftSettings(veh: VehicleMp){
        if(!veh || !mp.vehicles.exists(veh)) return;
        return {
            ids: veh.inventoryTmp,
            status: !!veh.getVariable('driftEnable'),
            angle: <number>veh.getVariable('driftAngle') || 0,
            speed: <number>veh.getVariable('driftSpeed') || 0,
        }
    }
    static haveDriftMode(vehicle: VehicleMp){
        if(!vehicle || !mp.vehicles.exists(vehicle)) return false;
        if(!!vehicle.getVariable('driftAdmin')) return true;
        if(vehicle.entity) return vehicle.entity.haveDriftMode
        return false;
    }
    get haveDriftMode(){
        return (this.exists && !!this.vehicle.getVariable('driftAdmin')) || !!this.data.tuning.find(m => m[0] === 3004 && m[1] !== lscConfig.find(q => q.id === 3004).default)
    }

    applyCustomization(){
        if (!mp.vehicles.exists(this.vehicle)) return;
        let toSync:[number,number][] = [];

        let tuning = [...this.data.tuning]
        lscConfig.map(mod => {
            if(mod.default != null && !this.data.tuning.find(m => m[0] == mod.id)) tuning.push([ mod.id, mod.default ])
        })

        tuning.map(([mod, value]) => {
            if(mod == 1000 || mod == 1001 || mod == 3002) return;
            else if (mod < 0 || mod > 61 || mod == 22 ) return toSync.push([mod, value]);
            else this.vehicle.setMod(mod, value);
        })
        this.vehicle.setVariable('neonColor', JSON.parse(this.data.color_neon) as RGB);
        this.vehicle.setVariable('primaryColor', JSON.parse(this.data.color_primary) as RGB);
        this.vehicle.setVariable('secondaryColor', JSON.parse(this.data.color_secondary) as RGB);
        this.vehicle.setVariable('tyreSmokeColor', JSON.parse(this.data.color_tyre_smoke) as RGB);
        this.vehicle.setVariable('tuningData', toSync);
        let primaryColor = JSON.parse(this.data.color_primary) as RGB;
        let secondaryColor = JSON.parse(this.data.color_secondary) as RGB;
        let neonColor = JSON.parse(this.data.color_neon) as RGB

        Vehicle.setPrimaryColor(this.vehicle, primaryColor[0], primaryColor[1], primaryColor[2])
        Vehicle.setSecondaryColor(this.vehicle, secondaryColor[0], secondaryColor[1], secondaryColor[2])
        Vehicle.applyChipTuning(this.vehicle, this.data.chipTuning);
    }
    get position():{x:number, y: number, z: number, h:number, d: number}{
        return JSON.parse(this.data.position)
    }
    set position(value: { x: number, y: number, z: number, h: number, d: number }){
        this.data.position = JSON.stringify(value);
        if(mp.vehicles.exists(this.vehicle)){
            this.vehicle.spawnPosition = new mp.Vector3(value.x, value.y, value.z);
            this.vehicle.spawnRotation = new mp.Vector3(0, 0, value.h);
            this.vehicle.spawnDimension = value.d;
        }
        this.save();
    }
    save(){
        return new Promise((resolve, reject) => {
            if(!this.data) return reject("No data");
            if (!mp.vehicles.exists(this.vehicle)) return reject("No mp vehicle");
            this.data.driftAngle = this.vehicle.getVariable('driftAngle')
            this.data.driftSpeed = this.vehicle.getVariable('driftSpeed')
            this.data.livery = this.vehicle.livery + 1;
            this.data.dirt = Vehicle.getDirtLevel(this.vehicle)
            this.data.color_primary = JSON.stringify(this.vehicle.getColorRGB(0));
            this.data.color_secondary = JSON.stringify(this.vehicle.getColorRGB(1));
            saveEntity(this.data).then(resolve).catch(err => reject(err));
        })
    }
    get onParkingFine(){
        return this.position.d >= this.fineDimension
    }
    get fine(){
        return this.data.fine
    }
    get fineDimension(){
        return Vehicle.fineDimension
    }
    static get fineDimension() {
        return (99999999)
    }
    set fine(val){
        this.data.fine = val;
        this.data.fine_day = 0;
        if (!val) this.data.fine_reason = null;
        this.save();
    }
    moveToParkingFine(cost:number, moveNow = true, reason?: string){
        this.data.fine = cost;
        this.data.fine_day = 0;
        if(reason) this.data.fine_reason = reason;
        this.position = { ...this.position, d: this.fineDimension}
        this.save();
        if (moveNow){
            if(mp.vehicles.exists(this.vehicle)){
                this.vehicle.getOccupants().map(target => {
                    target.user.leaveVehicle();
                })
            }
            this.respawn();
        }
    }
    respawn(){
        if(mp.vehicles.exists(this.vehicle)){
            if (this.onParkingFine){
                this.vehicle.dimension = this.fineDimension
            } else {
                Vehicle.teleport(this.vehicle, new mp.Vector3(this.position.x, this.position.y, this.position.z), this.position.h, this.position.d)
                setTimeout(() => {
                    Vehicle.teleport(this.vehicle, new mp.Vector3(this.position.x, this.position.y, this.position.z), this.position.h, this.position.d)
                    Vehicle.repair(this.vehicle, true);
                    if(this.exists) this.vehicle.usedAfterRespawn = false
                }, 2000)
            }
            if(this.vehicle.getOccupants().length === 0) this.vehicle.usedAfterRespawn = false;
        }
    }
    
    public rentedBy: User;
    
    get sellSumMoney(){
        if (BATTLE_PASS_VEHICLES.find(el => el === this.model) !== undefined)
            return this.data.cost * 0.7;
        let sum = this.isDonate ? this.data.cost * DONATE_VIRTS_PER_COIN : this.data.cost;
        sum -= this.isDonate ? 0 : ((sum / 100) * SELL_GOS_TAX_PERCENT)
        return sum;
    }
    get sellSumCoin(){
        if (!this.isDonate) return 0;
        return this.data.cost / 4;
    }

    sellVehicleByMoney(){
        const sum = this.sellSumMoney;
        if(this.familyOwner){
            const family = Family.getByID(this.familyOwner)
            if(!family) return this.deleteFromDatabase();
            family.addMoney(sum, null, `Продажа ТС ${this.name} ${this.number} в гос`)
            this.deleteFromDatabase();
            return;
        }
        const target = User.get(this.owner);
        if (target) target.user.addMoney(sum, true, `Продажа ТС ${this.name} ${this.number} в гос`), this.deleteFromDatabase()
        else User.addMoney(this.owner, sum, `$${system.numberFormat(sum)} Продажа ТС ${this.name} ${this.number} в гос`).then(() => this.deleteFromDatabase())
    }
    sellVehicleByCoin(){
        const sum = this.sellSumCoin;
        if(this.familyOwner){
            const family = Family.getByID(this.familyOwner)
            if(!family) return this.deleteFromDatabase();
            family.addDonateMoney(sum, null, `Продажа ТС ${this.name} ${this.number} в гос`)
            this.deleteFromDatabase();
            return;
        }
        const target = User.get(this.owner);
        if (target){
            target.user.account.donate = target.user.account.donate + sum;
            target.user.account.save();
            this.deleteFromDatabase()
        } else {
            User.getData(this.owner).then(d => {
                if (!d) return;
                User.getDataAccount(d.accountId).then(account => {
                    if(!account) return;
                    account.donate = account.donate + sum;
                    this.deleteFromDatabase();
                    account.save();
                })
            })
        }
    }


    sellForGos(){
        if(this.isDonate){
            this.sellVehicleByCoin()
        } else {
            this.sellVehicleByMoney()
        }
        if(this.owner){
            const owner = User.get(this.owner);
            if(owner){
                owner.user.achiev.achievTickByType("vehSellGos")
            }
        }
    }
    deleteFromDatabase(){
        if(this.exists) Vehicle.destroy(this.vehicle)
        Vehicle.list.delete(this.id);
        this.data.remove();
    }
    async selectParkPlace(player: PlayerMp):Promise<{type:"house"|"parking",id:number}>{
        const user = player.user;
        if (this.familyOwner && user.familyId === this.familyOwner) return Vehicle.selectParkPlace(player, this.avia, true)
        //if (this.owner !== player.dbid) return null;
        const userEntity = await User.getData(this.owner)
        return Vehicle.selectParkPlace(player, this.avia, false, userEntity)
    }

    static selectParkPlace(player: PlayerMp, avia: boolean, isFamilyMoney: boolean = false, userEntity?: UserEntity):Promise<{type:"house"|"parking",id:number, pos: {d: number, h: number, x: number, y: number, z: number}}>{
        const user = player.user;
        return new Promise((resolve) => {
            if(isFamilyMoney){
                const family = user.family;
                if(!family) {
                    player.notify("Вы не член семьи", 'error');
                    return resolve(null);
                }
                const house = family.house;
                if(!house) {
                    player.notify("У вашей семьи нет дома", 'error');
                    return resolve(null);
                }
                const slot = houses.getFreeVehicleSlot(house, avia);
                if (!slot) {
                    resolve(null);
                    return player.notify("В гараже семейного дома нет свободного места"+(avia ? ' под вертолёт' : ''))
                }
                resolve({type: "house", id: house.id, pos: slot})
                return;
            }
            const m = menu.new(player, "Выбор места парковки", "Выберите место парковки из списка");
            m.onclose = () => {
                resolve(null);
            }

            const houseEnt = user.houseEntityLive;
            if (houseEnt && (houseEnt.car_interrior || avia)){
                m.newItem({
                    name: `${houseEnt.name} #${houseEnt.id}`,
                    onpress: () => {
                        if(!houseEnt.car_interrior) return player.notify("В данном доме нет гаража", "error");
                        const slot = houses.getFreeVehicleSlot(houseEnt, avia);
                        if (!slot) return player.notify("В гараже дома нет свободного места"+(avia ? ' под вертолёт' : ''))
                        m.close();
                        resolve({type: "house", id: houseEnt.id, pos: slot})
                    }
                })
            } else {
                m.newItem({
                    name: houseEnt ? `${houseEnt.name} #${houseEnt.id}` : `Дом`,
                    more: `Недоступен`,
                    desc: 'Чтобы выбрать дом у вас должен быть дом с гаражом'
                })
            }

            const allVehs = parking.allVehsInAllParking()
            const myCarsOnParks = allVehs.filter(veh => veh.entity.owner === (userEntity ? userEntity.id : user.id)).length
            if (myCarsOnParks >= (userEntity ? User.parkingMax(userEntity) : user.parkingMax)){
                m.newItem({
                    name: "Парковки не доступны",
                    desc: `Вам недоступны новые парковочные места, поскольку у вас уже есть ${myCarsOnParks} ТС на парковке`
                })
            } else {
                business.data.filter(q => q.type === BUSINESS_TYPE.PARKING && (q.sub_type === 1) === avia).map(biz => {
                    let dims: number[] = [];
                    for (let id = 0; id <= biz.upgrade; id++) {
                        dims.push(parking.getFloorForDimension(biz, id));
                    }
                    m.newItem({
                        name: `${BUSINESS_SUBTYPE_NAMES[biz.type][biz.sub_type]} #${biz.id}`,
                        desc: `${biz.name}. Единоразовая оплата: $${system.numberFormat(PARKING_START_COST)}. Посуточная оплата: $${system.numberFormat(PARKING_DAY_COST)}`,
                        more: `Мест: ${(PARKING_CARS.length * dims.length) - allVehs.filter(q => dims.includes(q.entity.position.d)).length}`,
                        onpress: () => {
                            let slot = parking.getFreeSlot(biz);
                            if(!slot) return player.notify("Свободных мест нет", "error");
                            m.close();
                            return resolve({type: "parking", id: biz.id, pos: parking.getFreeSlot(biz)})
                        }
                    })
                })
            }
            m.open();
        })
    }
    get spawnPointType(){
        return system.isPointInPoints(this.position, PARKING_CARS, 5) ? "parking" : "house"
    }
    get inSpawnPoint() {
        if (!mp.vehicles.exists(this.vehicle)) return false;
        return Vehicle.inSpawnPoint(this.vehicle);
    }
    /** Заморозить ТС на месте */
    static freeze(vehicle: VehicleMp, status: boolean){
        if(!mp.vehicles.exists(vehicle)) return;
        vehicle.setVariable('freeze', status)
    }
    static getFreezeStatus(vehicle: VehicleMp){
        if(!mp.vehicles.exists(vehicle)) return false;
        return !!vehicle.getVariable('freeze')
    }
    static inSpawnPoint(vehicle: VehicleMp) {
        if (!mp.vehicles.exists(vehicle)) return false;
        if (vehicle.dimension != vehicle.spawnDimension) return false;
        if (system.distanceToPos(vehicle.position, vehicle.spawnPosition) > 2) return false;
        return true;
    }
    static repair(vehicle: VehicleMp, fullPriority = false){
        if (!vehicle) return;
        if (!mp.vehicles.exists(vehicle)) return;
        const fullFix = fullPriority || vehicle.dead || vehicle.bodyHealth <= 0 || vehicle.engineHealth <= 0

        const heading = vehicle.heading;

        vehicle.repair();
        setTimeout(() => {
            if(!mp.vehicles.exists(vehicle)) return;
            if(fullFix) {
                vehicle.spawn(vehicle.position, heading)
                vehicle.repair();
                setTimeout(() => {
                    if(vehicle.entity) vehicle.entity.applyCustomization();
                    vehicle.rotation = new mp.Vector3(0, 0, heading);
                }, 100)
            }
        }, 1000)
    }

    static pullPlayerFromTrunk(vehicle: VehicleMp) {
        if (!vehicle.playerInTruck) {
            return;
        }

        const player = UserStatic.get(vehicle.playerInTruck);
        if (!player) {
            return;
        }

        vehicle.playerInTruck = null;
        player.setVariable('inVehicleTruck', null);
    }

    static respawn(vehicle: VehicleMp, onlyRespawn = false){
        if (!vehicle) return;
        if (!mp.vehicles.exists(vehicle)) return;

        this.pullPlayerFromTrunk(vehicle);

        system.debug.debug(`Vehicle.respawn`, `SID: ${vehicle.id}`, `rentCar: ${vehicle.rentCar}`, `garage: ${vehicle.garage}`, `dbid: ${vehicle.dbid}`, `usedAfterRespawn: ${vehicle.usedAfterRespawn}`, `spawnPosition: ${!!vehicle.spawnPosition}`, `spawnRotation: ${!!vehicle.spawnRotation}`, `spawnDimension: ${!!vehicle.spawnDimension}`)
        if(vehicle.rentCar){
            if(vehicle.rentCarOwner){
                const owner = User.get(vehicle.rentCarOwner);
                if(owner) owner.rentCar = null;
            }
            return this.destroy(vehicle);
        }
        if (vehicle.garage && vehicle.garagecarid){
            return this.destroy(vehicle);
        }
        if (!vehicle.spawnPosition) return;
        if (!vehicle.usedAfterRespawn) return;
        vehicle.afkTime = 0;
        vehicle.usedAfterRespawn = false;
        // if (system.distanceToPos(vehicle.spawnPosition, vehicle.position) < 2 && vehicle.spawnDimension === vehicle.dimension) return;
        if (!vehicle.needRespawn && !onlyRespawn) return this.destroy(vehicle);
        if(vehicle.entity) return vehicle.entity.respawn();
        Vehicle.repair(vehicle, true);
        if(vehicle.spawnPosition){
            Vehicle.teleport(vehicle, vehicle.spawnPosition, vehicle.spawnRotation ? vehicle.spawnRotation.z : vehicle.rotation.z, typeof vehicle.spawnDimension === "number" ? vehicle.spawnDimension : vehicle.dimension)
        }
    }
    static toArray(){
        // Vehicle.toArray()
        return mp.vehicles.toArray().filter(q => !q.deleted)
    }
    static destroy(vehicle: VehicleMp){
        if (!vehicle) return false;
        if (!mp.vehicles.exists(vehicle)) return false;

        this.pullPlayerFromTrunk(vehicle);

        const id = vehicle.id;
        system.debug.debug(`Vehicle.destroy`, `SID: ${id}`, `rentCar: ${vehicle.rentCar}`, `garage: ${vehicle.garage}`, `dbid: ${vehicle.dbid}`, `usedAfterRespawn: ${vehicle.usedAfterRespawn}`, `spawnPosition: ${!!vehicle.spawnPosition}`, `spawnRotation: ${!!vehicle.spawnRotation}`, `spawnDimension: ${!!vehicle.spawnDimension}`)
        if (vehicle.garage && vehicle.garagecarid){
            const garage = FractionGarage.get(vehicle.garage);
            if(garage && garage.usedVehicles){
                garage.usedVehicles.delete(vehicle.garagecarid);
            }
        }
        system.debug.debug(`Vehicle.destroy`, `SID: ${id}`, `start`)
        // vehicle.destroy();
        vehicle.getOccupants().map(target => {
            if(mp.players.exists(target)) target.user.leaveVehicle()
        })
        setTimeout(() => {
            if(!mp.vehicles.exists(vehicle)) return;
            vehicle.dimension = system.getRandomInt(10000000, 100000000);
            vehicle.usedAfterRespawn = false;
            vehicle.garage = null;
            vehicle.garagecarid = null;
            vehicle.rentCar = false;
            vehicle.deleted = true;
            vehicle.isMission = false;
            vehicle.missionType = null;
            vehicle.missionOwner = null;
            vehicle.deliverPos = null;
            if(vehicle.dbid){
                vehicle.dbid = null;
                vehicle.setVariable('owner', null)
            }

        }, 900)
        system.debug.debug(`Vehicle.destroy`, `SID: ${id}`, `complete`)
        return true;
    }
    static findFreeParkingZone(pos: Vector3Mp, r: number, dimension = 0){
        let points = vehicleSpawnPoints.filter(q => q && q.x && q.y && q.z && q.heading).map(q => {return {...q, free: true}});
        points = points.filter(q => system.distanceToPos(q, pos) <= r);
        const vehs = Vehicle.toArray().filter(q => q.dimension === dimension && system.distanceToPos(q.position, pos) <= r).map(q => q.position);
        points.map(q => {
            q.free = !system.isPointInPoints(q, vehs, 3)
        })
        points = points.filter(q => q.free);
        if(points.length == 0) return null;
        return system.randomArrayElement(points)

    }
    static access(vehicle: VehicleMp, player: PlayerMp){
        if(!mp.players.exists(player)) return false;
        const user = player.user;
        if (user.hasPermission('admin:vehicle:unlock')) return true;
        if (vehicle.dbid && vehicle.entity) {
            if (!!inventory.getInventory(OWNER_TYPES.PLAYER, player.user.id).find(item => item.item_id === 805 && item.advancedNumber === vehicle.entity.key)) return true;
        }

        if(vehicle.fraction){}


        return false;
    }
    static teleport(vehicle: VehicleMp, position: Vector3Mp, h?: number, d?:number){
        if(!mp.vehicles.exists(vehicle)) return;
        system.debug.debug(`Vehicle.teleport`, `CID: ${vehicle.id}`, `modelname: ${vehicle.modelname}`)
        if(vehicle.getOccupants().length == 0){
            vehicle.position = position;
            if (typeof h === "number") vehicle.rotation.z = h;
            if (typeof d === "number") vehicle.dimension = d;
            return;
        }
        vehicle.getOccupants().filter(target => mp.players.exists(target) && target.user).map(target => {
            target.user.teleportVisible(h, position, d);
        })
        setTimeout(() => {
            if (!mp.vehicles.exists(vehicle)) return;
            if (typeof d === 'number') {
                let occupants = vehicle.getOccupants().filter(target => mp.players.exists(target) && target.user)
                vehicle.dimension = d;
                occupants.map(target => {
                    target.dimension = d;``
                })
            }
            vehicle.position = position;
            if (typeof h === "number") vehicle.rotation = new mp.Vector3(vehicle.rotation.x, vehicle.rotation.y, h);
        }, system.TELEPORT_TIME)
    }
    static getPlayerVehicles(id: number){
        return Vehicle.toArray().filter(veh => veh.dbid && veh.entity && veh.getVariable('owner') === id).map(veh => {return veh.entity});
    }
    static getVehiclesByPlayerKeys(player: PlayerMp): Vehicle[] {
        const carKeys = player.user.allMyItems
            .filter(item => item.item_id === KEYS_ITEM_ID && item.advancedString === 'car');

        return distinctArray(carKeys, (item) => item.advancedNumber)
            .map(item => Vehicle.getByKey(item.advancedNumber))
            .filter(vehicle => vehicle && !vehicle.familyOwner);
    }

    static getByKey(key: number) {
        return Vehicle.toArray().find(vehicle => vehicle.dbid && vehicle.entity && vehicle.entity.key === key)?.entity;
    }

    static getFamilyVehicles(id: number){
        return Vehicle.toArray().filter(veh => veh.dbid && veh.entity && veh.getVariable('ownerfamily') === id).map(veh => {return veh.entity});
    }
    static spawn(
        model: string,
        position: Vector3Mp,
        heading: number = 0,
        dimension: number = 0,
        engine = false,
        locked = false,
        fuel?: number,
        color1?: RGB, color2?: RGB
    ) {
        let veh = mp.vehicles.new(typeof model === "string" ? mp.joaat(model) : model, position, {
            dimension,
            heading,
            locked,
            engine
        })
        veh.setVariable('engine', engine);
        veh.setVariable('locked', locked);
        if(fuel) veh.setVariable('fuel', fuel);
        veh.setVariable('modelname', model);
        veh.engine = engine;
        veh.locked = locked;
        veh.modelname = model;
        if(!setVehicleParamsByConfig(veh)){
            veh.setVariable('fuel_max', FUEL_MAX_DEFAULT)
            if(!veh.getVariable('fuel')) veh.setVariable('fuel', FUEL_MAX_DEFAULT)
            veh.setVariable('fuel_type', VEHICLE_FUEL_TYPE.A92)
            veh.setVariable('name', model)
        }
        veh.spawnPosition = veh.position
        veh.spawnRotation = veh.rotation
        veh.spawnDimension = veh.dimension

        veh.usedAfterRespawn = false;
        veh.inventoryTmp = this.tempid+1;
        this.tempid++;
        veh.afkTime = 0;

        if (color1 && color2) {
            veh.setColorRGB(color1[0], color1[1], color1[2], color2[0], color2[1], color2[2]);
        } else {
            veh.setColorRGB(0,0,0,0,0,0)
        }
        // system.debug.debug(`Vehicle.spawn`, `CID: ${veh.id}`, `modelname: ${veh.modelname}`)
        return veh;
    }
    static getPrimaryColor(vehicle: VehicleMp){
        if (!mp.vehicles.exists(vehicle)) return;
        const color = vehicle.getColorRGB(0)
        return {
            r: color[0],
            g: color[1],
            b: color[2],
        }
    }
    static getSecondaryColor(vehicle: VehicleMp){
        if (!mp.vehicles.exists(vehicle)) return;
        const color = vehicle.getColorRGB(1)
        return {
            r: color[0],
            g: color[1],
            b: color[2],
        }
    }
    static setPrimaryColor(vehicle:VehicleMp, r: number, g: number, b: number){
        if(!mp.vehicles.exists(vehicle)) return;
        const secondaryColor = vehicle.getColorRGB(1)
        vehicle.setColorRGB(r, g, b, secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    }
    static setSecondaryColor(vehicle:VehicleMp, r: number, g: number, b: number){
        if(!mp.vehicles.exists(vehicle)) return;
        const primaryColor = vehicle.getColorRGB(0)
        vehicle.setColorRGB(primaryColor[0], primaryColor[1], primaryColor[2], r, g, b)
    }
    get locked(){
        if (!mp.vehicles.exists(this.vehicle)) return true;
        return this.vehicle.locked
    }
    set locked(value: boolean){
        Vehicle.setLocked(this.vehicle, value)
    }
    get engine(){
        if (!mp.vehicles.exists(this.vehicle)) return true;
        return this.vehicle.engine
    }
    set engine(value: boolean){
        Vehicle.setEngine(this.vehicle, value)
    }
    get key(){
        return this.data.key
    }
    set key(value: number){
        if (!mp.vehicles.exists(this.vehicle)) return;
        this.data.key = value;
    }
    /** Получить скорость ТС на основании вектора ускорения объекта */
    static getSpeed(vehicle: VehicleMp){
        if (!mp.vehicles.exists(vehicle)) return 0;
        return Math.sqrt(vehicle.velocity.x*vehicle.velocity.x + vehicle.velocity.y*vehicle.velocity.y+vehicle.velocity.z*vehicle.velocity.z)
    }
    static getFuel(vehicle: VehicleMp){
        if (!mp.vehicles.exists(vehicle)) return 0;
        return vehicle.getVariable('fuel') || 0;
    }
    static getFuelMax(vehicle: VehicleMp){
        if (!mp.vehicles.exists(vehicle)) return 0;
        return vehicle.getVariable('fuel_max') || 0;
    }
    static setFuel(vehicle: VehicleMp, value: number){
        if (!mp.vehicles.exists(vehicle)) return false;
        if (value < 0) value = 0;
        vehicle.setVariable('fuel', Math.min(value, Vehicle.getFuelMax(vehicle)));
    }
    static addFuel(vehicle: VehicleMp, value: number){
        if (!mp.vehicles.exists(vehicle)) return false;
        if (value < 0) value = 0;
        vehicle.setVariable('fuel', Math.min(Vehicle.getFuel(vehicle) + value, Vehicle.getFuelMax(vehicle)));
    }
    static getEngine(vehicle: VehicleMp){
        if (!mp.vehicles.exists(vehicle)) return false;
        return vehicle.engine;
    }
    static setEngine(vehicle: VehicleMp, engine: boolean){
        if (!mp.vehicles.exists(vehicle)) return false;
        const cfg = this.getVehicleConfig(vehicle);
        if(cfg){
            if (cfg.fuel_min && !this.getFuel(vehicle)) engine = false;
        }
        vehicle.engine = engine;
        vehicle.setVariable('engine', engine)
    }
    static getLocked(vehicle: VehicleMp){
        if (!mp.vehicles.exists(vehicle)) return false;
        return vehicle.locked;
    }
    static setLocked(vehicle: VehicleMp, locked: boolean){
        if (!mp.vehicles.exists(vehicle)) return false;
        vehicle.locked = locked;
        vehicle.setVariable('locked', locked)
    }
    static spawnPlayersVehicles(){
        return VehicleEntity.find().then(vehicles => vehicles.map(vehicle => Vehicle.spawnPlayerVehicle(vehicle)))
    }
    static spawnPlayerVehicle(vehicle: VehicleEntity){
        return new Vehicle(vehicle)
    }
    static spawnFractionVehicle(fraction: number, garagecarid: number, garage: number, model: string, position: Vector3Mp, heading: number = 0, dimension: number = 0, number?:string){
        const veh = this.spawn(model, position, heading, dimension);
        veh.fraction = fraction;
        veh.garage = garage;
        veh.garagecarid = garagecarid;
        veh.setVariable('fraction', fraction)
        veh.usedAfterRespawn = true;
        if(number) veh.numberPlate = number.toUpperCase();
        return veh;
    }
    static createNewDatabaseVehicle(player: PlayerMp, cnfId:number, primaryColor: {r: number, g: number, b: number}, secondaryColor: {r: number, g: number, b: number}, position: Vector3Mp, heading: number, dimension: number, cost: number, donate: number, isFamilyMoney = false): Promise<Vehicle>{
        return new Promise((resolve, reject) => {
            const conf = getVehicleConfigById(cnfId)
            let v = new VehicleEntity();
            v.color_primary = JSON.stringify([primaryColor.r, primaryColor.g, primaryColor.b])
            v.color_secondary = JSON.stringify([secondaryColor.r, secondaryColor.g, secondaryColor.b])
            v.fuel = conf.fuel_max;
            if(isFamilyMoney){
                v.family = player.user.family.entity;
            } else {
                v.user = player.user.entity;
            }
            v.fromRank = isFamilyMoney? player.user.family.leaderRankID : 0;
            v.cost = cost;
            v.donate = !!donate ? 1 : 0;
            v.model = conf.model;
            v.key = system.getRandomInt(1000000, 9999999);
            v.position = JSON.stringify({x: position.x, y: position.y, z: position.z, h: heading, d: dimension});
            v.save().then(v1 => {
                if(isFamilyMoney){
                    system.debug.info(`Создан новый ТС для семьи ${v.family.name} ${conf.model}`);
                } else {
                    system.debug.info(`Создан новый ТС для ${player.user.name} #${player.dbid} ${conf.model}`);
                }
                const newV = this.spawnPlayerVehicle(v1)
                resolve(newV);
            }).catch(err => {
                system.debug.error(err);
            })
        })
    }
    /** Подходит ли данный транспорт для транспортировки грузов */
    static isVehicleCommercial(vehicle:VehicleMp):boolean;
    static isVehicleCommercial(model:string):boolean;
    static isVehicleCommercial(item: string | VehicleMp){
        if(typeof item === "string") return commercialVehicles.includes(item.toLowerCase())
        else return commercialVehicles.includes(item.modelname.toLowerCase())
    }


    /** Получить конфиг ТС */
    static getVehicleConfig(vehicle: VehicleMp): VehicleConfigsEntity;
    static getVehicleConfig(configID: number): VehicleConfigsEntity;
    static getVehicleConfig(model: string): VehicleConfigsEntity;
    static getVehicleConfig(data: string | VehicleMp | number): VehicleConfigsEntity {
        if (typeof data === "number") return getVehicleConfigById(data)
        else if (typeof data === "string") return getVehicleConfig(data)
        else {
            if(!mp.vehicles.exists(data)) return null;
            return getVehicleConfig(data.modelname)
        }
    }
    
    
    /** Свободен ли транспорт для осуществления доставки */
    static isVehicleCommercialFree(veh: VehicleMp){
        if(!mp.vehicles.exists(veh)) return false;
        if (veh.dressOrder) return false;
        if (veh.fractionOrder) return false;

        return true;
    }
    static clear(veh: VehicleMp){
        if(mp.vehicles.exists(veh)){
            veh.dressOrder = null;
        }
    }
    
    /** Имеет ли игрок доступ к ТС */
    static hasAccessToVehicle(player: PlayerMp, veh: VehicleMp): boolean {
        const user = player.user;
        let haveAccess = false;
        if (player.user.hasPermission('admin:vehicle:unlock')) haveAccess = true;
        if (!haveAccess) {
            if (veh.rentCarOwner === player.dbid) haveAccess = true;
            if (veh.entity?.rentedBy == player.user) haveAccess = true;
        }
        if (!haveAccess) {
            if (user.deliverJobCar && user.deliverJobCar === veh) haveAccess = true;
            if (user.taxiCar && user.taxiCar === veh) haveAccess = true;
            if (user.fraction && user.fraction === veh.fraction
                && (!veh.fractionMinRank || user.rank >= veh.fractionMinRank)) haveAccess = true;
            if (user.fireSquad && user.fireSquad === veh.fireSquad) haveAccess = true;
        }
        
        if (!haveAccess && veh.entity 
            && veh.entity.familyOwner && user.familyId && user.familyId == veh.entity.familyOwner 
            && user.family.ranks.findIndex(r => r.id == user.familyRank) >= user.family.ranks.findIndex(r => r.id == veh.entity.fromRank)) 
                haveAccess = true;
        
        if (!haveAccess) {
            // Управление транспортом игрока
            if (veh.dbid && !veh.entity?.rentedBy) {
                if (veh.entity.owner === player.dbid) haveAccess = true;
                else if ((!!user.allMyItems.find(item => item.item_id === 805 && item.advancedNumber === veh.entity.key && item.advancedString === "car"))) haveAccess = true;
            }
            if (veh.gr6Id && user.gr6jobCar && user.gr6jobCar.id == veh.id) {
                haveAccess = true;
            }
            if (veh.getVariable('farm')) haveAccess = true

            if (veh.anyoneHasAccess === true) haveAccess = true

            if (veh.getVariable('busman') && player.user.id === veh.getVariable('busman')) haveAccess = true;

            if (veh.getVariable('electrician') && player.user.id === veh.getVariable('electrician')) haveAccess = true;

            if (veh.getVariable('sanitation') && player.user.sanitationSquad === veh.getVariable('sanitation')) haveAccess = true;
        }
        
        return haveAccess;
    }
    
    static lockVehStatusChange(player: PlayerMp, veh: VehicleMp){
        const user = player.user;
        if(!user) return;
        if (!mp.vehicles.exists(veh)) return player.notify("Выбранный транспорт поблизости не обнаружен", "error");
        if (veh.dimension != player.dimension) return player.notify("Выбранный транспорт не обнаружен в данном месте", "error");
        if (system.distanceToPos2D(veh.position, player.position) > 200) return player.notify("Выбранный транспорт слишком далеко", "error");
        let haveAccess = this.hasAccessToVehicle(player, veh);
        if (!haveAccess) {
            player.notify("У вас нет ключей от данного автомобиля", "error");
        } else {
            Vehicle.setLocked(veh, !Vehicle.getLocked(veh));
            player.notify(`Замок ${Vehicle.getLocked(veh) ? 'закрыт' : 'открыт'}`, "success");
        }
        // if(player.user.isAdminNow()) return;
        if(player.vehicle) return;
        if(!user.walkingWithObject) player.user.playAnimation([["anim@mp_player_intmenu@key_fob@", "fob_click_fp", 1]], true);
    }
    /** Получить конфиг багажника ТС */
    static haveTruck(vehicle: VehicleMp): PlayerInVehicleConfigItem;
    static haveTruck(model: string): PlayerInVehicleConfigItem;
    static haveTruck(data: string | VehicleMp): PlayerInVehicleConfigItem {
        return PLAYER_IN_VEHICLE_CONFIG.find(param => param.model === (typeof data === "string" ? data : data.modelname))
    }
    /** Получить конфиг капота ТС */
    static haveHood(vehicle: VehicleMp): boolean;
    static haveHood(model: string): boolean;
    static haveHood(data: string | VehicleMp): boolean {
        return !!OPENING_HOOD_LIST.find(param => param === (typeof data === "string" ? data : data.modelname))
    }
    static openHoodStatus(veh: VehicleMp): boolean {
        return !!veh.getVariable('hoodopen')
    }
    static setHoodStatus(veh: VehicleMp, status: boolean) {
        veh.setVariable('hoodopen', status)
    }
    
    static openTruckStatus(veh: VehicleMp): boolean {
        return !!veh.getVariable('truckopen')
    }
    static setTruckStatus(veh: VehicleMp, status: boolean) {
        veh.setVariable('truckopen', status)
    }
}

CustomEvent.registerClient('admins:vehicle:color', player => {
    if(!player.vehicle) return;
    if(!player.user.isAdminNow()) return;
    let m = menu.new(player, "Покраска ТС", "Выбор цветов");
    const primaryColor = player.vehicle.getColorRGB(0)
    const secondaryColor = player.vehicle.getColorRGB(1)
    m.newItem({
        name: "Основной цвет",
        type: "color",
        color: {r: primaryColor[0], g: primaryColor[1], b: primaryColor[2]},
        onchangeColor: (val) => {
            if(!player.vehicle) return;
            Vehicle.setPrimaryColor(player.vehicle, val.r, val.g, val.b)
        }
    })
    m.newItem({
        name: "Дополнительный цвет",
        type: "color",
        color: { r: secondaryColor[0], g: secondaryColor[1], b: secondaryColor[2]},
        onchangeColor: (val) => {
            if(!player.vehicle) return;
            Vehicle.setSecondaryColor(player.vehicle, val.r, val.g, val.b)
        }
    })
    if (typeof player.vehicle.livery !== "number") player.vehicle.livery = 0;
    m.newItem({
        name: "Винил",
        type: "range",
        rangeselect: [-1, 260],
        listSelected: player.vehicle.livery + 1,
        onchange: (val) => {
            if(!player.vehicle) return;
            player.vehicle.livery = val - 1;
        }
    })
    m.open();
})
CustomEvent.registerClient('admins:vehicle:info', async player => {
    if(!player.vehicle) return;
    if(!player.user.isAdminNow()) return;
    const veh = player.vehicle;
    let m = menu.new(player, "ТС", "Информация");
    if(veh.entity){
        m.newItem({
            name: 'Тип ТС',
            more: `Игрок/Семья`
        })
        if(veh.entity.owner){
            const owner = await User.getData(veh.entity.owner);
            if(owner){
                m.newItem({
                    name: 'Игрок',
                    more: `${owner.rp_name} ${owner.id}`,
                    desc: `ID ТС в БД ${veh.entity.id}`,
                    onpress: () => {
                        userChoise(player, owner.id)
                    }
                })
            }
        } else if(veh.entity.familyOwner){
            const owner = Family.getByID(veh.entity.familyOwner)
            if(owner){
                m.newItem({
                    name: 'Семья',
                    more: `${owner.name} ${owner.id}`,
                    desc: `ID ТС в БД ${veh.entity.id}`
                })
            }
        }
        m.newItem({
            name: 'Логи багажника',
            onpress: () => {
                Logs.open(player, `vehicle_${veh.entity.id}`, `Багажник ${veh.entity.name} #${veh.entity.id}`)
            }
        })
    } else if(veh.npc){
        m.newItem({
            name: 'Тип ТС',
            more: `NPC`,
            desc: 'Этот ТС был заспавнен автоматом при запуске сервера'
        })
    } else if(veh.fraction){
        m.newItem({
            name: 'Тип ТС',
            more: `Фракция ${veh.fraction}`,
        })
    }
    m.newItem({
        name: 'Модель',
        more: `${veh.modelname}`
    })
    m.newItem({
        name: "Номерной знак",
        more: veh.numberPlate
    })
    if(player.user.isAdminNow(5)){
        const status = !!veh.getVariable('driftAdmin')
        m.newItem({
            name: "Админский дрифтмод",
            more: `${status ? 'Установлен' : 'Не установлен'}`,
            desc: `${!DRIFT_PARAMS.includes(veh.modelname) ? 'На данный ТС не предусмотрен дрифтмод' : ''}`,
            onpress: () => {
                if(!mp.vehicles.exists(veh)) return;
                const status = !!veh.getVariable('driftAdmin')
                veh.setVariables({
                    driftAdmin: !status,
                    driftAngle: 100,
                    driftSpeed: 100,
                    driftEnable: false
                })
                player.notify(`Дрифт мод ${!status ? 'Установлен' : 'Снят'}`, 'success');
            }
        })
    }

    m.open();

});

mp.events.add('playerQuit', player => {
    const user = player.user;
    if (!user) return;
    const vehicles = Vehicle.getPlayerVehicles(user.id)
    
    vehicles.forEach(veh => {
        veh.vehicle.getOccupants().map(occupant => {
            if (mp.players.exists(occupant)) occupant.user.leaveVehicle()
        })
        Vehicle.respawn(veh.vehicle)
    })
});

CustomEvent.registerClient('admins:vehicle:fuel', player => {
    if(!player.vehicle) return;
    if(!player.user.isAdminNow()) return;
    let m = menu.new(player, "Топливо ТС", "Параметры");
    m.newItem({
        name: "Текущий уровень",
        more: `${Vehicle.getFuel(player.vehicle)} / ${Vehicle.getFuelMax(player.vehicle)}`,
        onpress: () => {
            if (!player.vehicle) return;
            if (!player.user.isAdminNow()) return;
            menu.input(player, "Введите новый уровень топлива", Vehicle.getFuel(player.vehicle), 4, 'int').then(val => {
                if(typeof val !== "number") return;
                if(val < 0) return player.notify("Уровень топлива не может быть отрицательным", "error")
                if(val > Vehicle.getFuelMax(player.vehicle)) return player.notify('Уровень топлива не может быть выше максимального', "error");
                Vehicle.setFuel(player.vehicle, val);
                player.notify("Уровень установлен", "success");
            })
        }
    })
    m.newItem({
        name: "~g~Полный бак",
        onpress: () => {
            if (!player.vehicle) return;
            if (!player.user.isAdminNow()) return;
            Vehicle.setFuel(player.vehicle, Vehicle.getFuelMax(player.vehicle));
            player.notify("Уровень установлен", "success");
        }
    })   
    m.open();
})
CustomEvent.registerClient('admins:vehicle:respawnRange', (player) => {
    if (!player.user.isAdminNow()) return;
    const vehicles = player.user.getNearestVehicles(20);
    vehicles.map(vehicle => {
        Vehicle.respawn(vehicle, false);
    })
})
CustomEvent.registerClient('admins:vehicle:respawn', (player, id: number, onlyRespawn: boolean) => {
    if (!player.user.isAdminNow()) return;
    const vehicle = mp.vehicles.at(id);
    if(!vehicle) return player.notify("Поблизости ТС не обнаружен", "error");
    Vehicle.respawn(vehicle, onlyRespawn);
})
CustomEvent.registerClient('admins:vehicle:fullFix', (player, id: number) => {
    if (!player.user.isAdminNow()) return;
    const vehicle = mp.vehicles.at(id);
    if(!vehicle) return player.notify("Поблизости ТС не обнаружен", "error");
    Vehicle.repair(vehicle, true);
    Vehicle.setFuel(vehicle, Vehicle.getFuelMax(vehicle));
    if (vehicle.getOccupants().length == 0 || vehicle.getOccupant(0) === player) vehicle.rotation = new mp.Vector3(0, 0, vehicle.rotation.z)
})

function checkForLevel(player: PlayerMp, vehicle: VehicleMp) {
    if (player.seat !== 0) return;
    if (player.user.antiBlockEnterVehicle) return;
    if (player.user.level >= 3) return;
    if (isAMotorcycle(vehicle.modelname)) return;
    if (isABike(vehicle.modelname)) return;
    if (player.user.haveActiveLicense("car") || player.user.haveActiveLicense("truck") || player.user.haveActiveLicense("moto")) return;

    player.removeFromVehicle();
    player.notify("До 3 уровня, транспорт можно водить только с лицензией");
}

mp.events.add("playerEnterVehicle", (player: PlayerMp, vehicle) => {
    checkForLevel(player, vehicle);
    vehicle.usedAfterRespawn = true;
    vehicle.afkTime = 0;
});

setInterval(() => {
    let respVehs = 0;
    mp.vehicles.forEachInDimension(0, veh => {
        if(!mp.vehicles.exists(veh)) return;
        if(!veh.usedAfterRespawn) return;
        const occupants = veh.getOccupants().length
        if (occupants === 0) veh.afkTime+=0.5;
        else veh.afkTime = 0;

        if (veh.fraction) {
            if (veh.afkTime >= maxAfkFractionCarTime) veh.afkTime = 9999999;
        }

        if (veh.rentCar) {
            // 
            if (veh.afkTime >= maxAfkRentCarTime) veh.afkTime = 9999999;
            else if ((veh.afkTime % 5 === 0 || ([1,2,3,4].includes(maxAfkRentCarTime - veh.afkTime))) && veh.afkTime > 0){
                const owner = mp.players.toArray().find(target => target.dbid === veh.rentCarOwner);
                if(owner){
                    owner.user.notifyPhone("Аренда транспорта", "Окончание срока аренды", `Внимание! Ваш арендованый транспорт пропадёт через ${Math.floor(maxAfkRentCarTime - veh.afkTime)} мин., если вы не продолжите его использовать`, "error")
                }
            }
        }

        if (respVehs > 20) return;
        let needResp = false;
        if (veh.fraction){
            needResp = veh.afkTime >= maxAfkFractionCarTime
        } else if(veh.rentCar){
            needResp = veh.afkTime >= maxAfkRentCarTime
        } else {
            needResp = veh.afkTime >= maxAfkTime
        }
        if (needResp){
            if(veh.dbid){
                const owner = User.get(veh.user);
                if(owner && mp.players.exists(owner)){
                    if (system.distanceToPos2D(owner.position, veh.position) < 100) return veh.afkTime -= 5;
                }
            }
            return Vehicle.respawn(veh), respVehs++;
        }
    })
}, 30000)

export let vehicleConfigs = new Map <number, VehicleConfigsEntity>();

export const getVehicleConfig = (model:string):  VehicleConfigsEntity => {
    let item = [...vehicleConfigs].find(([_, item]) => item.model.toLowerCase() == model.toLowerCase());
    if(item) return item[1];
    else return null;
}
export const getVehicleConfigById = (id:number) => {
    let item = [...vehicleConfigs].find(([_, item]) => item.id == id);
    if(item) return item[1];
    else return null;
}
export const getVehicleConfigsArray = () => {
    return [...vehicleConfigs].map(q => {
        return q[1]
    })
}
export const reloadConfig = (conf: VehicleConfigsEntity) => {
    Vehicle.toArray().filter(veh => veh.modelname.toLowerCase() == conf.model.toLowerCase()).map(veh => {
        setVehicleParamsByConfig(veh, conf);
    })
}

export const setVehicleParamsByConfig = (vehicle: VehicleMp, conf?: VehicleConfigsEntity) => {
    if (!conf) conf = getVehicleConfig(vehicle.modelname)
    if(!conf) return false;
    vehicle.setVariable("fuel_max", conf.fuel_max);
    vehicle.setVariable("fuel_type", conf.fuel_type);
    vehicle.setVariable("name", conf.name);
    vehicle.setVariable("multiple", conf.multiple);
    vehicle.setVariable("maxSpeed", conf.maxSpeed);
    if (conf.fuel_max > 0){
        if(typeof vehicle.getVariable('fuel') !== "number"){
            vehicle.setVariable('fuel', conf.fuel_max)
        }
    }
    return true
}

export const loadVehicleConfigs = () => {
    return new Promise(resolve => {
        console.time("Загрузка конфигов транспорта")
        VehicleConfigsEntity.find().then(list => {
            list.map(item => {
                vehicleConfigs.set(item.id, item);
            })
            console.timeEnd("Загрузка конфигов транспорта")
            resolve(null)
        })
    })
}


CustomEvent.registerClient('lockveh', (player, vehid: number) => {
    if(!player.user) return;
    const veh = player.vehicle || mp.vehicles.at(vehid);
    Vehicle.lockVehStatusChange(player, veh);
})
CustomEvent.registerClient('engineveh', (player, vehId: number) => {
    if(!player.user) return;
    /*
    const veh = player.vehicle
    if (!veh) return player.notify(`${vehId}`);
    if (!veh) return player.notify("Вы должны находится в ТС", "error");
     */
    const veh = mp.vehicles.at(vehId);

    if (!veh) return player.notify("Вы должны находится в ТС", "error");

    if(veh.brIndexUser) return;
    //if (veh.getOccupant(0) !== player) return player.notify("Вы должны находится за рулём", "error");
    if (!Vehicle.hasAccessToVehicle(player, veh)) return player.notify("У вас нет ключей от данного ТС", "error");
    Vehicle.setEngine(player.vehicle, !Vehicle.getEngine(player.vehicle))
    const cfg = Vehicle.getVehicleConfig(veh);
    if(cfg){
        if (cfg.fuel_max > 0 && !Vehicle.getFuel(veh)){
            if (cfg.fuel_type === VEHICLE_FUEL_TYPE.ELECTRO) return player.notify(`Аккумулятор разряжен`, 'error');
            return player.notify(`Топливо закончилось`, 'error');
        }
    }
})

setInterval(() => {
    mp.vehicles.forEachInDimension(0, vehicle => {
        if(vehicle.dead) return;
        const currentFuel = Vehicle.getFuel(vehicle);
        if(!currentFuel) return;
        if(!Vehicle.getEngine(vehicle)) return;
        const occupantsCount = vehicle.getOccupants().length;
        if(!occupantsCount) return;
        let fuel_min = 1;
        let fuel_type: any = VEHICLE_FUEL_TYPE.A92;
        const cfg = Vehicle.getVehicleConfig(vehicle);
        if (cfg) fuel_min = cfg.fuel_min
        if (cfg) fuel_type = cfg.fuel_type
        const speed = Vehicle.getSpeed(vehicle);
        let resultRate = 0;
        if (fuel_type !== VEHICLE_FUEL_TYPE.ELECTRO) resultRate += VEHICLE_FUEL_RATE.AFK * fuel_min;
        if(speed > 0){
            resultRate += speed * VEHICLE_FUEL_RATE.SPEED * fuel_min;
            resultRate += occupantsCount * VEHICLE_FUEL_RATE.PASSENGERS * fuel_min;
        }
        if (resultRate == 0) return;
        let resFuel = currentFuel - (resultRate);
        if(resFuel < 0) resFuel = 0;
        if (resFuel == 0) Vehicle.setEngine(vehicle, false);
        Vehicle.setFuel(vehicle, resFuel);
    })
}, VEHICLE_FUEL_RATE.INTERVAL * 1000)

/* Команда, выгнать игрока из автомобиля */

gui.chat.registerCommand("eject", (player: PlayerMp, str: string) => {
    const vehicle = player.vehicle,
        id = parseInt(str);


    if (isNaN(id) || id < 1 || id > 99999999) return;
    if (!vehicle)
        return player.notify("Необходимо находится в автомобиле", "error");
    if (!vehicle.getOccupant(0) || vehicle.getOccupant(0) !== player)
        return player.notify("Необходимо находится за рулём автомобиля", "error");


    const target = User.get(id);
    if (!target) return player.notify("Данный игрок отсуствует в автомобиле", "error");
    if (!vehicle.getOccupants().find(el => el.user.id === target.user.id)) return player.notify("Данный игрок отсуствует в автомобиле", "error");
    if (target.user.id === player.user.id) return player.notify("Вы не можете вытолкнуть самого себя", "error");

    target.notify("Водитель вытолкнул вас из транспорта");
    target.removeFromVehicle();
});
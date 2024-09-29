import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId} from "typeorm";
import {UserEntity} from "./user";
import {getInteriorHouseById, MAX_RESIDENTS} from "../../../../shared/inrerriors";
import {HOUSE_MAX_TAX_DAYS_DEFAULT, HOUSE_TAX_PERCENT, HOUSE_TAX_PERCENT_DAY_MAX} from "../../../../shared/economy";
import {FamilyEntity} from "./family";
import {Family} from "../../families/family";
import {saveEntity} from "../index";
import {Logs} from "../../logs";
import {getBaseItemNameById} from "../../../../shared/inventory";
import {system} from "../../system";
import {MiningHouseItemData} from "../../../../shared/mining";
import {User} from "../../user";
import {sendMiningData} from "../../mining";
import {getVipConfig} from "../../../../shared/vip";
import {FurnitureEntity} from "./furniture";



@Entity()
export class HouseEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    /** Название */
    @Column({ type: "varchar", length: 200 })
    name: string;
    /** Координата X */
    @Column({ type: "float", default: 0 })
    x: number;
    /** Координата Y */
    @Column({ type: "float", default: 0 })
    y: number;
    /** Координата Z */
    @Column({ type: "float", default: 0 })
    z: number;
    /** Угол H */
    @Column({ type: "int", default: 0 })
    h: number;
    /** Измерение */
    @Column({ type: "int", default: 0 })
    d: number;
    /** Интерьер */
    @Column({ type: "int", default: 0 })
    interrior: number;

    /** Координата X */
    @Column({ type: "float", default: 0 })
    car_x: number;
    /** Координата Y */
    @Column({ type: "float", default: 0 })
    car_y: number;
    /** Координата Z */
    @Column({ type: "float", default: 0 })
    car_z: number;
    /** Угол H */
    @Column({ type: "int", default: 0 })
    car_h: number;
    /** Измерение */
    @Column({ type: "int", default: 0 })
    car_d: number;
    /** Интерьер гаража */
    @Column({ type: "int", default: 0 })
    car_interrior: number;
    /** Кому дом принадлежит */
    @ManyToOne(type => UserEntity, { eager: true })
    @JoinColumn()
    user: UserEntity;
    @RelationId((post: HouseEntity) => post.user) // you need to specify target relation
    userId: number;

    /** Если владелец дома семья */
    @ManyToOne(type => FamilyEntity)
    @JoinColumn()
    family: FamilyEntity;
    @RelationId((post: HouseEntity) => post.family) // you need to specify target relation
    familyId: number;

    /** Дом для семьи */
    @Column({ type: "int", default: 0 })
    forFamily: number;

    /** Для многоквартирного дома */
    @Column({ type: "int", default: 0 })
    forTp: number;


    /** Список подселённых игроков */
    @Column({ type: "varchar", length: 500, default: '[]' })
    private residents_list: string;

    get residents(): number[]{
        if(!this.userId) return [];
        return JSON.parse(this.residents_list || "[]");
    }
    set residents(val){
        this.residents_list = JSON.stringify(val || []);
    }

    get userList(){
        if(!this.userId) return [];
        return [this.userId, ...this.residents];
    }

    garageAccess(target: PlayerMp | number){
        const id = typeof target === 'number' ? target : target.dbid;
        return this.userList.includes(id)
    }

    garageAccessVehicle(veh: VehicleMp){
        if(this.forFamily && veh.entity && veh.entity.familyOwner && veh.entity.familyOwner === this.familyId) return true;
        return !this.forFamily && veh.entity && veh.entity.owner && this.userList.includes(veh.entity.owner);
    }

    get max_residents(){
        return MAX_RESIDENTS.find(q => q.price <= this.price) ? MAX_RESIDENTS.find(q => q.price <= this.price).count || 1 : 1
    }

    /** Неоплаченный налог */
    @Column({ type: "int", default: 0 })
    tax: number;

    get taxDay() {
        return Math.min((this.price / 100) * HOUSE_TAX_PERCENT, HOUSE_TAX_PERCENT_DAY_MAX)
    }

    get taxMax() {
        const maxDays = getVipConfig(this.user?.vip)?.taxPropertyMaxDays ?? HOUSE_MAX_TAX_DAYS_DEFAULT;
        return this.taxDay * maxDays;
    }


    /** Стоимость */
    @Column({ type: "int", default: 0 })
    price: number;
    /** Уровень склада */
    @Column({ type: "int", default: 0 })
    stock: number;
    
    /** Код для ключа */
    @Column({ type: "int", default: 0 })
    key: number;

    /** Открыто или закрыто */
    @Column({ type: "int", default: 0 })
    opened: number;






    /** Координата X */
    @Column({ type: "float", default: 0 })
    air_x: number;
    /** Координата Y */
    @Column({ type: "float", default: 0 })
    air_y: number;
    /** Координата Z */
    @Column({ type: "float", default: 0 })
    air_z: number;
    /** Угол H */
    @Column({ type: "int", default: 0 })
    air_h: number;
    /** Измерение */
    @Column({ type: "int", default: 0 })
    air_d: number;


    /** Есть ли склад */
    @Column({ type: "int", default: 0 })
    haveChest: number;
    /** Уровень склада */
    @Column({ type: "int", default: 0 })
    haveChestLevel: number;
    /** Есть ли денежный сейф в помещении склада */
    @Column({ type: "int", default: 0 })
    haveMoneyChest: number;
    /** Количество денег в денежном сейфе */
    @Column({ type: "int", default: 0 })
    private moneyChestData: number;

    get moneyChest(){
        if(this.forFamily){
            const family = Family.getByID(this.familyId)
            if(family){
                return family.money
            }
        }
        return this.moneyChestData
    }
    removeMoneyChest(val: number, player: PlayerMp, reason: string){
        if(player && reason && val) Logs.new(`housemoney_${this.id}`, `${player.user.name} ${player.user.id}`, `${reason} ($${system.numberFormat(val)})`)
        if(this.forFamily){
            const family = Family.getByID(this.familyId)
            if(family){
                family.removeMoney(val, player, reason);
                return;
            }
        }
        this.moneyChest-=val;
    }
    addMoneyChest(val: number, player: PlayerMp, reason: string){
        if(player && reason && val) Logs.new(`housemoney_${this.id}`, `${player.user.name} ${player.user.id}`, `${reason} ($${system.numberFormat(val)})`)
        if(this.forFamily){
            const family = Family.getByID(this.familyId)
            if(family){
                family.addMoney(val, player, reason);
                return;
            }
        }
        this.moneyChest+=val;
    }
    set moneyChest(val){
        if(this.forFamily){
            const family = Family.getByID(this.familyId)
            if(family){
                family.money = val;
                return;
            }
        }
        this.moneyChestData = val;
        saveEntity(this)
    }

    /** Количество денег в денежном сейфе */
    @Column({ type: "varchar", default: null, nullable: true })
    private miningDataParams: string;

    get miningData(): MiningHouseItemData {
        return this.miningDataParams ? JSON.parse(this.miningDataParams) : null
    }

    set miningData(val){
        this.miningDataParams = val ? JSON.stringify(val) : null;
        const intData = getInteriorHouseById(this.interrior)
        if(!intData) return;
        if(!intData.mining) return;
        User.getNearestPlayersByCoord(new mp.Vector3(intData.mining.x, intData.mining.y, intData.mining.z), mp.config["stream-distance"], this.id).map(target => {
            sendMiningData(target, this);
        })
    }

    @Column({type: "int", default: 0})
    private agencyTime: number;

    get canPurchase(): boolean {
        return system.timestamp >= this.agencyTime;
    }

    set timeForPurchase(time: number) {
        this.agencyTime = time;
    }

    public furniture: FurnitureEntity[] = [];

    get furnitureData(): FurnitureEntity[] {
        return this.furniture
    }

    set furnitureData(data) {
        this.furniture = data;
    }
}
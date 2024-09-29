import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, RelationId} from "typeorm";
import {AccountEntity} from "./account";
import {startChips, startMoney} from "../../../../shared/economy";
import {food_max, water_max} from "../../../../shared/survival";
import {InventoryEquipList} from "../../../../shared/inventory";
import {LicenceType} from "../../../../shared/licence";
import {VipId} from "../../../../shared/vip";
import {User} from "../../user";
import {UserAchievmentData} from "../../../../shared/achievements";
import { IUserStats } from '../../../../shared/userStats'

@Entity()
export class UserEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 100, default: ''})
    admin_name: string;
    @Column({ type: "varchar", length: 100})
    rp_name: string;
    /** Фишки казино */
    @Column({ default: startChips })
    chips:number;
    /** Наличные средства игрока */
    @Column({ default: startMoney })
    money:number;
    /** Банковские средства игрока */
    @Column({ default: 0 })
    bank_money:number;
    /** Номер банковского счёта игрока */
    @Column({ length: 256, default: '' })
    bank_number: string;
    /** Тарифный план */
    @Column({ default: 0 })
    bank_tarif:number;

    /** Банковские средства игрока */
    @Column({ default: 0 })
    crypto_money:number;
    /** Фракция */
    @Column({ type: "varchar", default: null, nullable: true, length: 30 })
    crypto_number:string;

    /** Опыт текущего уровня */
    @Column({ default: 0 })
    exp:number;
    /** Текущий уровень */
    @Column({ default: 1 })
    level:number;

    /** Фракция */
    @Column({ default: 0 })
    fraction:number;
    /** Фракция */
    @Column({ default: 0 })
    rank:number;
    @Column( {default: 0})
    fraction_warns: number;
    /** Фракция */
    @Column({ type: "varchar", default: null, nullable: true })
    tag:string;


    @ManyToOne(type => AccountEntity, account => account.id)
    @JoinColumn()
    account: AccountEntity;
    @RelationId((post: UserEntity) => post.account) // you need to specify target relation
    accountId: number;


    // @ManyToOne(type => HouseEntity, account => account.id)
    // @JoinColumn()
    // house: HouseEntity;
    // @RelationId((post: UserEntity) => post.house) // you need to specify target relation
    // houseId: number;

    @OneToOne(type => UserEntity, account => account.id)
    @JoinColumn()
    partner: UserEntity
    @RelationId((post: UserEntity) => post.partner) // you need to specify target relation
    partnerId: number;

    @Column({ type: "varchar", length: 200, default: '{"x":0,"y":0,"z":0,"h":0,"d":0}' })
    position: string;
    @Column({ type: "varchar", length: 2048, default: null })
    skin: string;
    @Column({ type: "varchar", length: 1000, default: '[]' })
    tattoos: string;
    /** Одежда */
    @Column({
        type: "varchar", length: 1000, default: JSON.stringify({
            bracelet: 0,
            watch: 0,
            ear: 0,
            glasses: 0,
            hat: 0,
            accessorie: 0,
            accessorie2: 0,
            foot: 0,
            leg: 0,
            torso: 0,
            mask: 0,
        } as InventoryEquipList)
    })
    dress: string;
    /** Возраст */
    @Column({ default: 0 })
    age: number;
    /** Показатель здоровья */
    @Column({ default: 100 })
    health: number;
    /** Показатель амора */
    @Column({ default: 0 })
    armour: number;
    /** Показатель воды */
    @Column({ default: water_max, type: "float" })
    water: number;
    /** Показатель еды */
    @Column({ default: food_max, type: "float" })
    food: number;
    /** Номер ID карты персонажа */
    @Column({ default: null, type: "varchar", length: 20})
    social_number: string;
    /** Информация по заключению в тюрьме */
    @Column({type: "varchar", length: 512, default: null, nullable: true})
    prison: string;
    /** Срок заключения в РП тюрьме */
    @Column({ default: 0 })
    jail_time: number;
    /** Срок заключения в админской тюрьме */
    @Column({ default: 0 })
    jail_time_admin: number;
    /** Причина заключения в РП тюрьме */
    @Column({ type: "varchar", length: 100, default: "", nullable: true })
    jail_reason: string;
    /** Причина заключения в админской тюрьме */
    @Column({ type: "varchar", length: 100, default: "", nullable: true })
    jail_reason_admin: string;
    /** Текущий уровень розыска игрока */
    @Column({ default: 0 })
    wanted_level: 0 | 1 | 2 | 3 | 4 | 5;
    /** Причина текущего уровеня розыска игрока */
    @Column({ default: null, type: "varchar", length: 512})
    wanted_reason: string;
    /** Горячие клавиши */
    @Column({ type: "varchar", length: 512, default: "[0,0,0,0,0]"})
    hotkeys: string;
    /** Время отсидки в больнице */
    @Column({ default: 0 })
    heal_time: number;

    /** Болезни */
    @Column({ type: "varchar", length: 800, default: "{}" })
    private ill_data: string;

    get ill(): { [name: string]: number}{
        return JSON.parse(this.ill_data || "{}")
    }
    set ill(value){
        this.ill_data = JSON.stringify(value)
    }

    /** Горячие клавиши */
    @Column({ type: "varchar", length: 800, default: "{}" })
    private job_stats_data: string;

    get jobStats(): {[name:string]: number}{
        return JSON.parse(this.job_stats_data)
    }
    set jobStats(value){
        this.job_stats_data = JSON.stringify(value)
    }

    @Column({ type: "varchar", length: 500, default: "[]" })
    private licenses_data: string;
    
    /** Список лицензий */
    get licenses(): [LicenceType, number, string][]{
        return JSON.parse(this.licenses_data || "[]")
    }
    set licenses(value){
        this.licenses_data = JSON.stringify(value)
    }

    @Column({ type: "varchar", length: 500, default: "[]" })
    private purchased_anims: string;

    /** Список ID купленных анимаций */
    get purchasedAnims(): number[] {
        return JSON.parse(this.purchased_anims || "[]")
    }
    set purchasedAnims(value: number[]) {
        this.purchased_anims = JSON.stringify(value)
    }

    @Column({ type: "text", nullable: true })
    private quests_data: string;
    
    /** Список квестов */
    get quests(): [number, [boolean, number][], boolean][]{
        return JSON.parse(this.quests_data || "[]")
    }
    set quests(value){
        this.quests_data = JSON.stringify(value)
    }

    /** Последний раз был в сети */
    @Column({type: 'int', default: 0})
    online: number;
    /** Время истечение бана */
    @Column({type: 'int', default: 0})
    ban_end: number;
    /** Админ, который выдал бан */
    @Column({type: 'int', default: 0})
    ban_admin: number;
    /** Время истечение бана */
    @Column({ type: "varchar", length: 500, nullable: true })
    ban_reason: string;


    @Column({ type: "text", nullable: true })
    private warns_data: string;

    /** Список варнов */
    get warns(): {reason: string, admin: number, time: number}[] {
        return JSON.parse(this.warns_data || "[]")
    }
    set warns(value) {
        this.warns_data = JSON.stringify(value)
    }
    /** Сколько ТС может иметь игрок */
    @Column({ type: 'int', default: 0 })
    vehicles_limit: number;
    /** Уровень админки */
    @Column({ default: 0 })
    admin_level: number;
    /** Хелпер */
    @Column({ default: 0 })
    helper_level: number;
    /** Сколько выполнено заказов по перевозке */
    @Column({ default: 0 })
    deliver_total:number;
    /** Сколько выполнено заказов по перевозке на текущем уровне */
    @Column({ default: 0 })
    deliver_current:number;
    /** Уровень дальнобойщика */
    @Column({ default: 0 })
    deliver_level:number;

    /** Текущая випка */
    @Column({ type: "varchar", length: 400, default: null, nullable: true })
    vip: VipId;
    /** Срок окончания випки */
    @Column({ default: 0 })
    vip_end: number;
    /** Выбранная квестовая линия */
    @Column({ default: 0 })
    quest_line: number;

    @Column({ type: "text", nullable: true })
    private success_item: string;

    /** Список варнов */
    get successItem(): number[] {
        return JSON.parse(this.success_item || "[]")
    }
    set successItem(value) {
        this.success_item = JSON.stringify(value)
    }

    @Column({ type: "text", nullable: true })
    private achievements_item: string;

    /** Список варнов */
    get achievements(): UserAchievmentData {
        return JSON.parse(this.achievements_item || "{}")
    }
    set achievements(value) {
        this.achievements_item = JSON.stringify(value)
    }

    /** Дата регистрации */
    @Column({ default: 0 })
    date_reg:number;
    /** Дата входа */
    @Column({ default: 0 })
    date_auth:number;
    /** Всего отыграно */
    @Column({ default: 0 })
    played_time:number;

    get is_online(){
        return !!User.get(this.id)
    }

    
    /** Семья */
    @Column({ default: 0 })
    family:number;
    /** Ранг в семье */
    @Column({ type: 'int', default: 0 })
    familyRank:number;
    /** Очки для семьи */
    @Column({ default: 0 })
    familyScores:number;
    /** Очки репутации принесенные в семью */
    @Column({ default: 0 })
    familyReputationPoints: number;
    /** Отыграно времени для купона на ТС */
    @Column({ default: 0 })
    playtimecar:number;

    /** Уровень апгрейда инвентаря */
    @Column({ default: 0 })
    inventory_level:number;

    /** Рекорд дрифта */
    @Column({ default: 0 })
    drift_best:number;

    /** Хранилище рулетки */
    @Column({ type: "text", nullable: true })
    roulette_storage: string;
    get rouletteStorage(): number[] {
        return JSON.parse(this.roulette_storage || "[]")
    }
    set rouletteStorage(value) {
        this.roulette_storage = JSON.stringify(value)
    }

    /** Время, после которого можно будет взять новое задание на ограбление */
    @Column({ default: 0 })
    robberyTask_nextAvailableTime: number;

    @Column({ default: false })
    isCasinoHelpShowed: boolean;

    @Column({ default: 0 })
    farmerExp: number;

    @Column({ type: 'int', default: null })
    selectedBag: number;

    @Column({ default: false })
    isFreeChipTuningUsed: boolean;

    @Column({ default: 0 })
    candyCount: number;

    @Column({default: 0})
    lollipops: number;

    @Column({ type: "varchar", length: 800, default: "{}" })
    private fish_stats: string;
    get fishStats(): {[id: number]: number} {
        return JSON.parse(this.fish_stats)
    }
    set fishStats(value){
        this.fish_stats = JSON.stringify(value)
    }

    @Column({ default: 0 })
    walkingStyle: number;

    @Column({ type: "varchar", length: 800, default: "{}" })
    public _stats: string;
    get stats(): IUserStats {
        return JSON.parse(this._stats)
    }
    set stats(value){
        this._stats = JSON.stringify(value)
    }
}
@Entity()
export class UserDatingEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    /** Текст записи */
    @Column({ type: "varchar", length: 1024 })
    name: string;


    /** Кому принадлежит */
    @ManyToOne(type => UserEntity)
    @JoinColumn()
    user: UserEntity;
    @RelationId((post: UserDatingEntity) => post.user) // you need to specify target relation
    userId: number;

    /** Кому принадлежит */
    @ManyToOne(type => UserEntity)
    @JoinColumn()
    target: UserEntity;
    @RelationId((post: UserDatingEntity) => post.target) // you need to specify target relation
    targetId: number;


}
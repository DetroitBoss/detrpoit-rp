import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId} from "typeorm";
import {UserEntity} from "./user";
import {
    DONATE_VIRTS_PER_COIN,
    VEHICLE_MAX_TAX_PERCENT_DAY,
    VEHICLE_TAX_PERCENT
} from "../../../../shared/economy";
import {FamilyEntity} from "./family";
import {getVipConfig} from "../../../../shared/vip";
import {ChipTuningOption} from "../../../../shared/lsc";
import { ICarSharingVehicleData } from '../../vehicle.carsharing'

@Entity()
export class VehicleEntity extends BaseEntity {
    /** Уникальный ID */
    @PrimaryGeneratedColumn()
    id: number;
    /** Модель ТС */
    @Column({ type: "varchar", length: 100})
    model: string;
    /** Местоположение */
    @Column({ type: "varchar", length: 300, default: '{"x":0,"y":0,"z":0,"h":0,"d":0}' })
    position: string;
    /** Основной цвет */
    @Column({ type: "varchar", length: 100, default: '[0,0,0]' })
    color_primary: string;
    /** Дополнительный цвет */
    @Column({ type: "varchar", length: 100, default: '[0,0,0]' })
    color_secondary: string;
    /** Цвет неона */
    @Column({ type: "varchar", length: 100, default: '[255,0,0]' })
    color_neon: string;
    /** Цвет дыма колес */
    @Column({ type: "varchar", length: 100, default: '[255,0,0]' })
    color_tyre_smoke: string;
    /** Номерной знак */
    @Column({ type: "varchar", length: 10, default: "" })
    number: string;
    /** Задолженость по платежу */
    @Column({ default: 0 })
    tax:number;
    get taxDay(){
        return this.isDonate ? 0 : this.cost * (VEHICLE_TAX_PERCENT / 100)
    }

    get isDonate(){
        return !!this.donate
    }
    /** Стоимость, за которую ТС покупалась */
    @Column({ default: 0 })
    cost:number;
    /** Покупалась за донат */
    @Column({ default: 0 })
    donate:0|1;
    /** Текущий запас топлива */
    @Column({ default: 0 })
    fuel:number;
    
    
    @ManyToOne(type => UserEntity, { eager: true })
    @JoinColumn()
    user: UserEntity;
    @RelationId((post: VehicleEntity) => post.user) // you need to specify target relation
    userId: number;

    /** Номер замка */
    @Column({ default: 0 })
    key: number;
    /** Наличие противоугонной системы */
    @Column({ default: 0 })
    keyProtect: 0 | 1;

    /** Размер штрафа для оплаты штрафстоянки */
    @Column({ default: 0 })
    fine: number;
    /** Время поступления на штрафстоянку */
    @Column({ default: 0 })
    fine_day: number;
    @Column({ type: "varchar", length: 300, nullable: true })
    fine_reason: string;

    @Column({ type: "varchar", length: 1024, default: '[]' })
    private tuning_data: string;
    
    /** Данные кастомизации ТС */
    get tuning(): [number, number][]{
        return JSON.parse(this.tuning_data)
    }
    set tuning(val){
        this.tuning_data = JSON.stringify(val)
    }

    /** Винил */
    @Column({ type: "int", default: 0 })
    livery: number;

    /** Грязь */
    @Column({ type: "float", default: 0 })
    dirt: number;

    /** Зависимость дрифта от угла */
    @Column({ type: "int", default: 0 })
    driftAngle: number;
    /** Зависимость дрифта от скорости */
    @Column({ type: "int", default: 0 })
    driftSpeed: number;


    @ManyToOne(type => FamilyEntity)
    @JoinColumn()
    family: FamilyEntity;
    @RelationId((post: VehicleEntity) => post.family) // you need to specify target relation
    familyId: number;

    /** Минимальный ранг для пользования ТС семьей */
    @Column({ type: "int", default: 0 })
    fromRank: number;

    @Column({ type: "varchar", length: 1024, nullable: true, default: null })
    private chipTuningData?: string;

    get chipTuning() {
        return <ChipTuningOption[]>JSON.parse(this.chipTuningData)
    }

    set chipTuning(data) {
        this.chipTuningData = JSON.stringify(data);
    }

    @Column({ default: false })
    isAutopilotInstalled: boolean;

    @Column({ type: "varchar", length: 1024, nullable: true, default: null })
    private carSharingData?: string;

    get carSharing() {
        return <ICarSharingVehicleData>JSON.parse(this.carSharingData)
    }

    set carSharing(data) {
        this.carSharingData = JSON.stringify(data);
    }
}
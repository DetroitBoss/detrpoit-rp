import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {VEHICLE_FUEL_TYPE} from "../../../../shared/vehicles";
import {LicenceType} from "../../../../shared/licence";


@Entity()
export class VehicleConfigsEntity extends BaseEntity {
    /** Уникальный ID */
    @PrimaryGeneratedColumn()
    id: number;
    /** Модель ТС */
    @Column({ type: "varchar", length: 100 })
    model: string;
    /** Название ТС */
    @Column({ type: "varchar", length: 200 })
    name: string;
    /** Стоимость. Если 0 - не продаётся */
    @Column({ default: 0 })
    cost: number;
    /** Количество на складе. Если 0 - не продаётся */
    @Column({ default: 0 })
    count: number;
    /** Максимальный объём багажника в КГ */
    @Column({ default: 0 })
    stock: number;
    /** Максимальный объём бензобака */
    @Column({ default: 0 })
    fuel_max: number;
    /** Показатель расхода топлива */
    @Column({ default: 0 })
    fuel_min: number;
    /** Тип топлива */
    @Column({ type: "int", default: 0 })
    fuel_type: VEHICLE_FUEL_TYPE;
    /** Наличие автопилота */
    @Column({ default: 0 })
    autopilot: 0|1;
    /** Требуется ли лицензия для покупки и управления данным транспортом */
    @Column({ type: "varchar", default: "" })
    license: LicenceType;
    /** Множитель ускорения */
    @Column({ default: 100 })
    multiple: number;
    /** Максимальная скорость Т/С, при 0 максимальная скорость остается по умолчанию */
    @Column({ default: 0 })
    maxSpeed: number;

    get avia(){
        return this.fuel_type === VEHICLE_FUEL_TYPE.AIR
    }
}
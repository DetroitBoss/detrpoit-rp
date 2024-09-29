import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class LscConfigEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /** ID слота мода */
    @Column()
    slotId: number;

    /** Название мода */
    @Column()
    name: string;

    /** Раздел мода */
    @Column()
    sector: number;

    /** С какого уровня бизнеса данная штука будет доступна для заказа */
    @Column()
    level: number;

    @Column()
    target: string;

    /** Процент от стоимости машины, который будет минимальной ценой на штуку */
    @Column({ type: 'float' })
    percent: number;

    @Column({default: false})
    isColor: boolean;

    /** Если true то elements может не придти, вместо него надо впихнуть названия элементов LSC_WHEELS, т.е. [ 'sportwheels', 'suvwheels' и тд ]*/
    @Column({default: false})
    isWheelType?: boolean;

    /** Если true то elements может не придти, вместо него надо впихнуть названия элементов LSC_WHEELS индекса выбранного выше */
    @Column({default: false})
    isWheelTypeValue?: boolean;

    /** Если true то выводить модуль который над выбором цвета с выбором одного из LSC_COLOR_MODS (где в примере интерфейса написано Глянцевый).  */
    @Column({default: false})
    isColorMod?: boolean;

    @Column({default: null, nullable: true})
    default: number;

    // Закупочная стоимость
    @Column()
    cost: number;
}
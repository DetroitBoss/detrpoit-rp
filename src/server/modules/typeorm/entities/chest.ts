import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, JoinColumn } from "typeorm";
import { UserEntity } from "./user";
import {FamilyReputationType} from "../../../../shared/family";

@Entity()
export class FractionChestEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    /** Название */
    @Column({ type: "varchar", length: 1024 })
    name: string;
    /** Префикс, если требуется. Им будет помечатся оружие и прочее */
    @Column({ type: "varchar", length: 1024 })
    prefix?: string;
    @Column({type: 'float'})
    pos_x: number;
    @Column({ type: 'float' })
    pos_y: number;
    @Column({ type: 'float' })
    pos_z: number;
    @Column()
    pos_d: number;
    @Column()
    fraction?: number;
    @Column()
    family?: number;
    @Column({default: 0})
    closed: number;
    /** Максимальная вместительность в гр */
    @Column({ default: 1000 })
    size: number
    
    /** Каталог */
    @Column({ type: "varchar", length: 4096, default: '[]' })
    private items_data: string;

    /** Каталог предметов */
    get items(): [number, number, number][]{
        return JSON.parse(this.items_data);
    }
    set items(val){
        this.items_data = JSON.stringify(val);
    }

    /** Каталог */
    @Column({ type: "varchar", length: 4096, default: '[]' })
    private limits_data: string;

    /** Каталог предметов */
    get limits():[number, number, number][]{
        return JSON.parse(this.limits_data);
    }
    set limits(val){
        this.limits_data = JSON.stringify(val);
    }

    /** Логи */
    @Column({ type: "text" })
    logs: string;

}

@Entity()
export class FractionChestOrderEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    /** Тип */
    @Column()
    fraction: number;
    @Column({ nullable: true })
    familyType?: number;
    @Column({type: 'float'})
    x: number;
    @Column({ type: 'float' })
    y: number;
    @Column({ type: 'float' })
    z: number;
    @Column()
    d: number;
    @Column({default: 0})
    closed: number;
    
    /** Каталог */
    @Column({ type: "varchar", length: 4096, default: '[]' })
    private items_data: string;

    /** Каталог предметов
     * ID, Количество, Стоимость, пополнение за 6 часов, максимальное количество, сколько можно взять за 1 заказ
     */
    get items(): [number, number, number, number, number, number][]{
        return JSON.parse(this.items_data);
    }
    set items(val){
        this.items_data = JSON.stringify(val);
    }

}
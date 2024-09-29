import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class ShootingRatingEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    /** Имя игрока */
    @Column({ type: "varchar", length: 100 })
    name:string;

    /** Кому запись принадлежит */
    @Column({ type: "int", default: 0 })
    userId: number;
    
    /** Лучший результат */
    @Column({ type: "int", default: 0 })
    time: number;

    /** В каком стрельбище получен данный результат */
    @Column({ type: "int", default: 0 })
    item: number;
}
import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class DuelRatingEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    /** Имя игрока */
    @Column({ type: "varchar", length: 100 })
    name:string;

    /** Кому запись принадлежит */
    @Column({ type: "int", default: 0 })
    userId: number;
    
    /** Количество побед */
    @Column({ type: "int", default: 0 })
    wins: number;
    /** Количество поражений */
    @Column({ type: "int", default: 0 })
    defeates: number;

    /** Время лога в формате UNIX TIMESTAMP */
    time: number;
}
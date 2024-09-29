import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class IslandBattleEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int" })
    fractionId: number;

    @Column({ type: "int" })
    time: number;

    @Column({ type: "int" })
    lastPayment: number;
}
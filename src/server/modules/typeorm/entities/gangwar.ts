import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { UserEntity } from "./user";
import {FileLogType} from "../../../../shared/log";

@Entity()
export class GangWarEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    /** ID зоны */
    @Column({ type: "int", default: 0 })
    zone: number;
    /** Владелец зоны (фракция) */
    @Column({ type: "int", default: 0 })
    owner: number;
}
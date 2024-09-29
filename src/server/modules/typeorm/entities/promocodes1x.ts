import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Promocodes1x extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /** Название промокода */
    @Column({ type: "varchar", length: 60})
    name: string;

    @Column()
    expiredAt: number;

    @Column({ type: "varchar", length: 1024 })
    bonuses: string;
}

@Entity()
export class Promocode1xUse extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    promocodeId: number;

    @Column()
    userId: number;

    @CreateDateColumn()
    activatedAt: Date;
}
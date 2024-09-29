import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity()
export class BusinessTaxLogEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number

    @Column()
    businessId: number

    @Column()
    money: number

    @Column()
    time: number
}
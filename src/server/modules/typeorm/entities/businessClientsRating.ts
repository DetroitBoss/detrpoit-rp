import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class BusinessClientsRatingEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    itemName: string

    @Column()
    count: number

    @Column()
    businessId: number

    @Column()
    money: number

    @Column()
    userId: number

    @Column()
    time: number
}
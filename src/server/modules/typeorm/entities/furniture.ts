import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class FurnitureEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'int'})
    cfgId: number;

    @Column({type: 'int'})
    houseId: number;

    @Column({type: 'varchar', default: null})
    pos: string

    @Column({type: 'varchar', default: null})
    rot: string
}
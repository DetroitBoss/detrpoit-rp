import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class MoneyChestEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({type: 'float'})
    x: number;
    @Column({ type: 'float' })
    y: number;
    @Column({ type: 'float' })
    z: number;
    @Column()
    d: number;
    @Column()
    fraction: number;
    @Column({default: 0})
    money: number;
    @Column({default: 0})
    day_limit: number;
}

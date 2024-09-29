import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId
} from "typeorm";
import {UserEntity} from "./user";

@Entity()
export class MarketHistoryEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => UserEntity, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    seller: UserEntity;

    @RelationId((entity: MarketHistoryEntity) => entity.seller)
    sellerId: number;

    @Column()
    itemConfigId: number;

    @Column()
    itemName: string;

    @Column()
    count: number;

    @Column()
    moneyIncome: number;

    @Column({ length: 128 })
    buyerName: string;

    @CreateDateColumn({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)" })
    createDate: Date;
}
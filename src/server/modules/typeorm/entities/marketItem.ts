import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, RelationId} from "typeorm";
import {ItemEntity} from "./inventory";
import {UserEntity} from "./user";

@Entity()
export class MarketItemEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    item: ItemEntity;

    @Column()
    itemId: number;

    @ManyToOne(type => UserEntity, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    seller: UserEntity;

    @RelationId((entity: MarketItemEntity) => entity.seller)
    sellerId: number;

    /** Цена за единицу товара (.count) */
    @Column()
    price: number;

    /** Время удаления со склада рынка, если null, предмет всё ещё продается */
    @Column({ type: "int", nullable: true })
    deleteStockTime?: number;
}
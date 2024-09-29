import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm'

@Entity()
export class UserGiftEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int" })
    item_id: number;

    @Column({ type: "int" })
    userFromId: number;

    @Column({ type: "int" })
    userToId: number;
}

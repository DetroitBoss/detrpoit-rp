import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class InventoryLogEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int", default: 0 })
    itemId: number;

    @Column({ type: "varchar", length: 120, default: '' })
    itemName: string;

    @Column({ type: "varchar", length: 1024, default: ''})
    serial: string;

    @Column({ type: "varchar", length: 1024, default: ''})
    action: string;

    @Column({ type: "varchar", length: 1024, default: ''})
    text: string;

    @Column({ type: "bigint", default: 0 })
    actorId: number;

    @Column({ type: "bigint", default: 0 })
    targetId: number;

    /** Время лога в формате UNIX TIMESTAMP */
    @Column({ type: "int", default: 0 })
    time: number;
}
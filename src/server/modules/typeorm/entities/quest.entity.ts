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
export class QuestEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    dbId: number;

    @ManyToOne(type => UserEntity, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    user: UserEntity;

    @RelationId((entity: QuestEntity) => entity.user)
    userId: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'varchar', length: 50 })
    questId: string;

    @Column()
    complete: boolean = false;

    @Column({ type: 'varchar', length: 512, nullable: true })
    dataJson: string = null;
}
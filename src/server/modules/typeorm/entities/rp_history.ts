import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { UserEntity } from "./user";

@Entity()
export class RpHistoryEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    /** Текст записи */
    @Column({ type: "varchar", length: 1024})
    text: string;

    /** Кому лог принадлежит */
    @ManyToOne(type => UserEntity)
    @JoinColumn()
    user: UserEntity;
    @RelationId((post: RpHistoryEntity) => post.user) // you need to specify target relation
    userId: number;


    /** Время лога в формате UNIX TIMESTAMP */
    @Column({ type: "int", default: 0})
    time: number;
}
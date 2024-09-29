import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { UserEntity } from "./user";
import {BusinessEntity} from "./business";

@Entity()
export class BankHistoryEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    /** Текст записи */
    @Column({ type: "varchar", length: 1024})
    text: string;
    /** Тип записи */
    @Column({ type: "varchar", length: 1024})
    type: "add" | "remove" | "reject";
    /** Сумма */
    @Column()
    sum: number;

    /** Кому лог принадлежит */
    @ManyToOne(type => UserEntity, {
        cascade: true,
        onDelete: "CASCADE"
    })
    @JoinColumn()
    user: UserEntity;
    @RelationId((post: BankHistoryEntity) => post.user) // you need to specify target relation
    userId: number;
    /** Номер банковского счёта */
    @Column({ type: "varchar", length: 1024 })
    bank_number: string
    /** Инициатор платежа */
    @Column({ type: "varchar", length: 100 })
    target: string
    /** Номер чека */
    @Column({ type: "varchar", length: 100 })
    ticket: string


    /** Время лога в формате UNIX TIMESTAMP */
    @Column()
    time: number;
}
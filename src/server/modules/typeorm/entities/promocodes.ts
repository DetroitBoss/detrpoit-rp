import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { AccountEntity } from "./account";
import { startMoney } from "../../../../shared/economy";
// import { LogType } from "../../../../shared/log";
import { UserEntity } from "./user";

/** Использование промокода */
@Entity()
export class PromocodeUseEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    /** Код, который был введён */
    @Column({ type: "varchar", length: 60})
    code: string;

    /** На какого персонажа был введён код */
    @ManyToOne(type => UserEntity)
    @JoinColumn()
    user: UserEntity;
    @RelationId((post: PromocodeUseEntity) => post.user) // you need to specify target relation
    userId: number;
    @Column({ type: "int", default: 0 }) // you need to specify target relation
    accountId: number;
    
    /** Данный ввод был для медиакода. Этот флаг нужен чтобы человек не мог 2 раза ввести медиакод от разных медиа. */
    @Column({ type: "int", default: 0 })
    media?: 0 | 1;

    /** Время лога в формате UNIX TIMESTAMP */
    @Column({ type: "int", default: 0 })
    time: number;

}

/** Использование промокода */
@Entity()
export class PromocodeList extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    /** Код */
    @Column({ type: "varchar", length: 60})
    code: string;

    /** Сколько средств он даёт */
    @Column({ type: "int", default: 0 })
    money: number;

    /** До которого времени промокод действует. Если 0 - то он работает вечно */
    @Column({ type: "int", default: 0 })
    time_end: number;

    /** Время лога в формате UNIX TIMESTAMP */
    @Column({ type: "int", default: 0 })
    time: number;

}
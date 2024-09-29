import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId} from "typeorm";
import {UserEntity} from "./user";
import {FamilyLogType, FileLogType} from "../../../../shared/log";
import {FamilyEntity} from "./family";

@Entity()
export class LogEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    /** Текст записи */
    @Column({ type: "varchar", length: 1024})
    text: string;
    /** Тип логов */
    @Column({ type: "varchar", length: 100 })
    type:FileLogType;

    @Column({ type: "int", default: 0 })
    userId: number;
    
    /** С кем было взаимодействие, если было */
    @Column({ type: "int", default: 0, nullable: true })
    target?: number;

    /** Время лога в формате UNIX TIMESTAMP */
    @Column({ type: "int", default: 0 })
    time: number;
}

@Entity()
export class LogFamilyEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    /** Текст записи */
    @Column({ type: "varchar", length: 1024})
    text: string;
    /** Тип логов */
    @Column({ type: "varchar", length: 100 })
    type:FamilyLogType;

    @Column({ type: "int", default: 0 })
    familyId: number;

    /** С кем было взаимодействие, если было */
    @Column({ type: "int", default: 0, nullable: true })
    target?: number;


    /** С кем было взаимодействие, если было */
    @Column({ type: "varchar", length: 50 })
    targetName?: string;

    /** Время лога в формате UNIX TIMESTAMP */
    @Column({ type: "int", default: 0 })
    time: number;


    /** Количество, если было */
    @Column({ type: "int", default: 0 })
    count: number;
}

@Entity()
export class LogItemsEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    /** Текст записи */
    @Column({ type: "varchar", length: 1024})
    text: string;

    /** ID раздела */
    @Column({ type: "varchar", length: 1024})
    ids: string;

    /** Имя */
    @Column({ type: "varchar", length: 1024})
    who: string;

    /** Время лога в формате UNIX TIMESTAMP */
    @Column({ type: "int", default: 0 })
    time: number;
}
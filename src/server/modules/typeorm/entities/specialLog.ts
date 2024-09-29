import {Entity, BaseEntity, PrimaryGeneratedColumn, Column} from "typeorm";


@Entity()
export class SpecialLog extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /** Текст записи */
    @Column({ type: "varchar", length: 2048})
    text: string;

    @Column({ type: "int", default: 0 })
    userId: number;

    /** С кем было взаимодействие, если было */
    @Column({ type: "int", default: 0, nullable: true })
    target?: number;

    /** Время лога в формате UNIX TIMESTAMP */
    @Column({ type: "int", default: 0 })
    time: number;
}
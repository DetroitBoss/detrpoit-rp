import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, JoinColumn } from "typeorm";
import { UserEntity } from "./user";
import {JobId} from "../../../../shared/jobs";

@Entity()
export class JobDressEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    /** Название */
    @Column({ type: "varchar", length: 120 })
    name: string;
    @Column({type: 'float'})
    x: number;
    @Column({ type: 'float' })
    y: number;
    @Column({ type: 'float' })
    z: number;
    @Column()
    d: number;
    /** Для какой фракции сделан гардероб */
    @Column()
    fraction?: number;
    /** Для какой работы сделан гардероб */
    @Column({ type: "varchar", length: 255 })
    job?: JobId;
    /** Для какой семьи сделан гардероб */
    @Column({ type: 'int', nullable: true })
    family?: number;

    /** Каталог */
    @Column({ type: "text", nullable: true })
    private dressItems: string;

    /** Каталог предметов */
    get dress(): {data: [number, number, number][], name: string, male: boolean, rank?: number, id: number }[]{
        return JSON.parse(this.dressItems || "[]");
    }
    set dress(val) {
        this.dressItems = JSON.stringify(val);
    }

}
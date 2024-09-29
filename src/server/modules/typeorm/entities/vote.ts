import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { UserEntity } from "./user";

@Entity()
export class VoteEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    /** Имя голосования */
    @Column({ type: "varchar", length: 100 })
    name:string;


    @Column({ type: "text" })
    private list: string;

    @Column({ type: "text" })
    private list_res: string;

    /** Начало */
    @Column({ type: "int", default: 0 })
    start: number;

    /** Начало */
    @Column({ type: "int", default: 0 })
    end: number;

    /** Закрыто админом */
    @Column({ type: "int", default: 0 })
    closed: 0 | 1;

    /** Варианты голосования */
    get variants(): string[] {
        return JSON.parse(this.list || '[]')
    }

    set variants(data){
        this.list = JSON.stringify(data || []);
    }

    /** Сколько голосов отдали за каждый вариант */
    get variants_res(): number[] {
        return JSON.parse(this.list_res || '[]')
    }

    set variants_res(data){
        this.list_res = JSON.stringify(data || []);
    }
}

@Entity()
export class VoteList extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    /** Имя проголосовавшего */
    @Column({ type: "varchar", length: 100 })
    name:string;

    /** ID проголосовавшего */
    @Column({ type: "int" })
    user:number;

    /** ID голосования */
    @Column({ type: "int" })
    vote:number;

    /** Какой голос */
    @Column({ type: "int" })
    variant:number;


}
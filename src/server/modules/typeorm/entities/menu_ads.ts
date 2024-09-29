import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { UserEntity } from "./user";

@Entity()
export class MenuAdsEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    /** Текст рекламы */
    @Column({ type: "varchar", length: 400})
    text: string;
    /** Заголовок */
    @Column({ type: "varchar", length: 80 })
    title:string;
    /** Текст кнопки */
    @Column({ type: "varchar", length: 80 })
    button:string;
    /** Картинка */
    @Column({ type: "varchar", length: 80 })
    pic:string;

    /** Кому лог принадлежит */
    @ManyToOne(type => UserEntity)
    @JoinColumn()
    user: UserEntity;
    @RelationId((post: MenuAdsEntity) => post.user) // you need to specify target relation
    userId: number;
    
    /** Данные по кастомизации */
    @Column({ type: "varchar", length: 12000, default: "[]" })
    private poss: string;
    get pos(): {x: number, y: number, z: number} {
        return JSON.parse(this.poss)
    }
    set pos(val: { x: number, y: number, z: number }) {
        this.poss = JSON.stringify(val);
    }
}
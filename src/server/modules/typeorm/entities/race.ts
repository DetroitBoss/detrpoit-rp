import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {RACE_TYPE} from "../../../../shared/race";

@Entity()
export class RaceCategoryEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    /** Название */
    @Column({ type: "varchar", length: 100, default: "" })
    name: string;

    /** Допустимые ТС */
    @Column({ type: "varchar", length: 5000, default: "[]" })
    private carrs: string;
    get cars(): string[] {
        return JSON.parse(this.carrs)
    }
    set cars(val) {
        this.carrs = JSON.stringify(val);
    }
}
@Entity()
export class RaceEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    /** Название */
    @Column({ type: "varchar", length: 100, default: ""})
    name: string;
    /** Тип */
    @Column({ type: "varchar", length: 10, default: "line" as RACE_TYPE})
    type: RACE_TYPE;
    /** Сколько раз трасса использовалась */
    @Column({ default: 0 })
    uses: number;
    /** Статус трассы */
    @Column({ default: 0 })
    status: number;

    /** Кому трасса принадлежит */
    @Column({ default: 0 })
    userId: number;
    /** Какой каталог ТС */
    @Column({ default: 0 })
    carsId: number;
    
    /** Данные по трассе */
    @Column({ type: "varchar", length: 5000, default: "[]" })
    private poss: string;
    get pos(): {x: number, y: number, z: number, h: number}[] {
        return JSON.parse(this.poss)
    }
    set pos(val) {
        this.poss = JSON.stringify(val);
    }
    /** Стартовые позиции */
    @Column({ type: "varchar", length: 5000, default: "[]" })
    private startss: string;
    get starts(): {x: number, y: number, z: number, h: number}[] {
        return JSON.parse(this.startss)
    }
    set starts(val) {
        this.startss = JSON.stringify(val);
    }
}

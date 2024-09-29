import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import {ClothData, GloveClothData} from "../../../../shared/cloth";

@Entity()
export class DressEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    /** Название */
    @Column({ type: "varchar", length: 1024 })
    name: string;
    /** Стоимость */
    @Column({ type: "int", default: 0 })
    price: number;
    /** Данные по кастомизации */
    @Column({ type: "varchar", length: 12000, default: "[]" })
    datas: string;
    get data(): ClothData[] | GloveClothData[] {
        return JSON.parse(this.datas)
    }
    set data(val: { component: number, drawable: number, texture: number, name?: string }[][] | GloveClothData[]){
        this.datas = JSON.stringify(val);
    }
    /** Категория */
    @Column({ type: "int", default: 0 })
    category: number;
    /** Для мужчины */
    @Column({ type: "int", default: 1 })
    male: number;
    /** для создания персонажа */
    @Column({ type: "int", default: 0 })
    forCreate: number;
    /** для коробок */
    @Column({ type: "int", default: 0 })
    forBox: number;
    @Column({ type: "int", default: -1 })
    forMedia: number;
    @Column({ type: "boolean", default: false })
    forBattlePass: boolean;
    @Column({ type: "boolean", default: false })
    donateBlock: boolean;
    edited = false

    get inventoryIcon(){
        if (this.category == 107) return 959
        if (this.category == 106) return 957
        if (this.category == 102) return 956
        if (this.category == 101) return 955
        if (this.category == 100) return 954
        if (this.category == 7) return 958
        if (this.category == 6) return 953
        if (this.category == 4) return 952
        if (this.category == 3) return 951
        if (this.category == 1) return 950
    }
}
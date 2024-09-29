import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IFractionRank} from "../../../../shared/fractions/ranks";

@Entity()
export class FractionsEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fractionId: number;

    @Column()
    name: string

    @Column()
    desc: string;

    /** Иконка */
    @Column()
    icon: string;

    /** Гос фракция */
    @Column()
    gos: boolean;


    /** Полномочия полицейских */
    @Column()
    police: boolean;

    /** Правительство */
    @Column()
    government: boolean;

    /** Мафия */
    @Column()
    mafia: boolean;

    /** Банда */
    @Column()
    gang: boolean;

    /** HEX Цвет фракции для некоторых систем */
    @Column()
    color: string;

    /** Цвет зоны капта для банд */
    @Column()
    blipgangcolor:number;

    @Column()
    codes_str: string

    get codes() {
        return JSON.parse(this.codes_str)
    }

    set codes(data: string[]) {
        this.codes_str = JSON.stringify(data)
    }

    @Column({type: "varchar", length: 512})
    spawn_str: string

    get spawn() {
        if (!this.spawn_str) return null;
        return JSON.parse(this.spawn_str)
    }

    set spawn(data: {x: number, y: number, z: number, h: number}) {
        this.spawn_str = JSON.stringify(data)
    }

    @Column()
    armour_male_str: string

    get armour_male() {
        if (!this.armour_male_str) return null;
        return JSON.parse(this.armour_male_str)
    }

    set armour_male(data: {drawable: number, texture: number}) {
        this.armour_male_str = JSON.stringify(data)
    }

    @Column()
    armour_female_str: string

    get armour_female() {
        if (!this.armour_female_str) return null;
        return JSON.parse(this.armour_female_str)
    }

    set armour_female(data: {drawable: number, texture: number}) {
        this.armour_female_str = JSON.stringify(data)
    }

    @Column()
    armour_male_small_str: string

    get armour_male_small() {
        if (!this.armour_male_small_str) return null;
        return JSON.parse(this.armour_male_small_str)
    }

    set armour_male_small(data: {drawable: number, texture: number}) {
        this.armour_male_small_str = JSON.stringify(data)
    }

    @Column()
    armour_female_small_str: string

    get armour_female_small() {
        if (!this.armour_female_small_str) return null;
        return JSON.parse(this.armour_female_small_str)
    }

    set armour_female_small(data: {drawable: number, texture: number}) {
        this.armour_female_small_str = JSON.stringify(data)
    }

    @Column()
    armorName: string

    @Column()
    fractionChestsList: string

    get fractionChests() {
        return JSON.parse(this.fractionChestsList);
    }

    set fractionChests(data: number[]) {
        this.fractionChestsList = JSON.stringify(data);
    }

    @Column({type: "varchar", length: 8192})
    fractionRanks: string

    set ranks(data: IFractionRank[]) {
        this.fractionRanks = JSON.stringify(data);
    }

    get ranks() {
        return JSON.parse(this.fractionRanks);
    }
}
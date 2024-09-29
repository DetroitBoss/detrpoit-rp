import {FACTION_ID} from "../fractions";

export interface IFractionDTO {
    id: FACTION_ID;
    name: string;
    desc: string;
    icon: string;
    gos: boolean;
    police: boolean;
    government: boolean;
    mafia?: boolean;
    gang: boolean;
    ranks: string[];
    moneybase: number;
    salaries: number[];
    color: string;
    blipgangcolor:number;
    codes:string[]
    spawn: {x: number, y: number, z: number, h: number},
    armour_male: {drawable: number, texture: number},
    armour_female: {drawable: number, texture: number},
    armour_male_small: {drawable: number, texture: number},
    armour_female_small: {drawable: number, texture: number},
    armorName: string;
}

import { JULY_SEASON } from "./seasons/july";

export const BATTLE_PASS_SEASON = JULY_SEASON;
export const BASIC_TASKS_COUNT = 4;

export const BATTLE_PASS_VEHICLES: string[] = [
    'rmodbacalar',
    'panamera',
]

export interface IBattlePassRating {
    name: string
    exp: number
}

export interface IEveryDayEXP {
    time: number,
    exp: number
}
import {BaseReward} from "./rewards";
import {IEveryDayEXP} from "./main";
import {BaseTaskConfig} from "./tasks";

/** Интерфейс конфига сезона **/

export interface IBattlePassDiscount {
    expires: number,
    specialPrice: number
}

export interface IRandomExp {
    exp: number
    hour: number
    minute: number
}

export interface IBattlePassSeason {
    id: string
    name: string
    endTime: number
    battlePassCost: number
    levelExp: number
    discount: IBattlePassDiscount
    everyDayExp: IEveryDayEXP
    levelPrice: number
    rewards: BaseReward[]
    globalTasks: BaseTaskConfig[]
    basicTasks: BaseTaskConfig[],
    randomExp: IRandomExp
}
import {IBattlePassRating} from "./main";
import {RewardRarity} from "./rewards";

export interface PurchaseDTO {
    coins: number,
    discountActive: boolean,
    price: number,
    expires?: number,
    discountPrice?: number
}

export interface BattlePassDTO {
    exp: number,
    receivedRewards: number[]
    battlePassExpires: string
    coins: number,
    discountActive: boolean,
    everyDayExp: string
}

export interface TaskDTO {
    exp: number,
    name: string,
    desc: string,
    progress: number,
    goal: number
}

export interface BattlePassTasksDTO {
    global: TaskDTO,
    basic: TaskDTO[]
}

export interface ITakeMenu {
    isOpened: boolean,
    rarity: RewardRarity,
    canTake: boolean,
    name: string,
    level: number
}

export interface RatingDTO {
    place?: number
    id: number
    name: string
    exp: number
}
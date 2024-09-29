import { ActivityType, FieldStage, GreenhouseStage } from './config'

export interface IFarmWorkPoint {
    pos: Vector3Mp
    processed: boolean
}

export interface IFieldWorkData extends IFarmWorkData {
    stage: FieldStage,
}

export interface IGreenhouseWorkData extends IFarmWorkData {
    stage: GreenhouseStage,
}

export interface IAnimalWorkData extends IFarmWorkData {
    animals: IFarmAnimal[]
}

export interface IFarmAnimal {
    state: FarmAnimalState
    id: number
    feedCount: number
}

export enum FarmAnimalState {
    Feed,// Животное ждет кормления
    Idle,// Животное просто стоит
    Use// Животное ждет когда его подоят / ???
}

export interface IFarmWorkData {
    id: number
    type: ActivityType
    points: IFarmWorkPoint[]
}

export interface IFarmOwnerData {
    id: number
    capital: number
    totalPaid: number
    rentedAt: number
    workers: {
        money: number, 
        name: string,
        level: number
    }[]
}

export interface IBestFarmer {
    id: number
    name: string
    exp: number
}

export type FarmUiComponent = "shop" | "entrance" | "dots" | "statistic" | "rating" | "milk" | "can" | "best";

export type EntranceComponent = "FieldOwner" 
    | "GreenhouseOwner" 
    | "CattleOwner" 
    | "FieldWorker" 
    | "GreenhouseWorker" 
    | "CattleWorker"
    | "CattleReady"
    | "GreenhouseReady"
    | "FieldReady"

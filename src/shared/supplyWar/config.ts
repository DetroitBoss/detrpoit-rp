import {colshapeHandleOptions} from "../checkpoints";

/** Разрешенные модели авто для погрузки **/
export const SUPPLY_WAR_ALLOW_VEHICLE_MODELS: string[] = [
    'burrito3',
    'SPEEDO4'
];
export const SUPPLY_WAR_ALLOW_FRACTIONS: ISupplyWarFraction[] = [
    {
        id:18,
        position: new mp.Vector3(873.50, -2180.23, 29.52)
    },
    {
        id:19,
        position: new mp.Vector3(98.16, -1957.76, 19.74)
    },
    {
        id:20,
        position: new mp.Vector3(491.07, -1343.00, 28.24)
    },
    {
        id:21,
        position: new mp.Vector3(-449.98, -1723.47, 17.68)
    },
    {
        id:22,
        position: new mp.Vector3(544.61, -1926.15, 23.82)
    },
    {
        id:23,
        position: new mp.Vector3(-315.86, 225.47, 86.81)
    },
    {
        id:24,
        position: new mp.Vector3(-1517.70, 869.94, 180.73)
    },
    {
        id:25,
        position: new mp.Vector3(1393.18, 1116.35, 113.84)
    }
];

/** Время подготовки в секундах **/
export const SUPPLY_WAR_PREPARATION_TIME: number = 300;

export const SUPPLY_WAR_INTERACTION_MESSAGE: string = "Погрузка";
export const SUPPLY_WAR_INTERACTION_OPTIONS: colshapeHandleOptions = {
    dimension: 0,
    radius: 5,
    type: 1,
    color: [255, 105, 0, 155]
};

export const SUPPLY_WAR_BLIP_SPRITE: number = 615;
export const SUPPLY_WAR_BLIP_COLOR: number = 59;
export const SUPPLY_WAR_BLIP_SCALE: number = 0.8;
export const SUPPLY_WAR_BLIP_NAME: string = "Война за снабжение";

export enum SUPPLY_WAR_STEP {
    PREPARATION,
    PROCESS
}

export interface ISupplyWar {
    step: SUPPLY_WAR_STEP
    destroy: () => void
}

export interface ISupplyWarCreate {
    maxVehiclesLoad?: number
    items?: string
    position?: Vector3Mp
}

export interface ISupplyWarItem {
    itemId: number,
    count: number
}

export interface ISupplyWarFraction {
    id: number,
    position: Vector3Mp
}
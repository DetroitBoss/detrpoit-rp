import {system} from "../server/modules/system";

/** Сколько парковочных мест может быть у игрока. По сути это определяет сколько ТС игрок может иметь без дома */
export const PARKING_CARS_PLAYER_MAX = 1;
/** Параметр, который отвечает за шаг измерения в парковке для определения бизнеса по измерению. НЕ ТРОГАТЬ!!! */
export const PARKING_STEP = 1000;
/** Сколько процентов идёт в доход парковки */
export const BUSINESS_REWARD_PERCENT = 60;
/** Стоимость парковки за одни реальные сутки */
export const PARKING_DAY_COST = 1000;
/** Стоимость стартовой оплаты парковки */
export const PARKING_START_COST = 5000;
export const PARKING_EXIT = new mp.Vector3(1252.56, 230.10, -48.84)
export const PARKING_AVIA_EXIT = new mp.Vector3(-1446.84, -3261.47, -26.64)
export const PARKING_CARS: { x: number, y: number, z: number, h: number }[] = [
    {x: 1309.35, y: 258.40, z: -49.48, h: 90},
    {x: 1309.35, y: 249.80, z: -49.48, h: 90},
    {x: 1309.35, y: 241.30, z: -49.48, h: 90},
    {x: 1309.35, y: 231.80, z: -49.48, h: 90},
    {x: 1295.35, y: 231.80, z: -49.48, h: 90},
    {x: 1295.35, y: 241.30, z: -49.48, h: 90},
    {x: 1295.35, y: 249.80, z: -49.48, h: 90},
    {x: 1281.00, y: 258.40, z: -49.78, h: 270},
    {x: 1281.00, y: 249.80, z: -49.48, h: 270},
    {x: 1281.00, y: 241.30, z: -49.48, h: 270}
    // { x: 0, y: 0, z: 0, h: 0 },
]
export const PARKING_AVIA: { x: number, y: number, z: number, h: number }[] = [
    // { x: 0, y: 0, z: 0, h: 0 },
    { x: -1428.87, y: -3307.79, z: -25.64, h: 326 },
]

export interface IParkingFloor {
    dimension: number,
    serial: number,
    haveCar: boolean,
    places: string,
    current: boolean,
    freePlaces: boolean
}

export interface IParkingData {
    id: number,
    name: string,
    exit: [Vector3Mp, number, number] | null,
    floors: IParkingFloor[],
    singlePayment: string,
    dailyPayment: string,
    subType: number
}
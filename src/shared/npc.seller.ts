import {LicenceType} from "./licence";
import {FACTION_ID} from "./fractions";

export interface NpcSeller {
    /** Имя НЦП */
    name: string;
    /** Модель НЦП */
    model: string;
    /** Местоположение */
    pos: Vector3Mp;
    /** Угол поворота */
    heading: number;
    /** Список предметов, которые можно купить */
    items: {
        /** ID предмета */
        item: number,
        /** Стоимость за единицу, либо указать массив из двух чисел, тогда сумма будет случайной между ними */
        cost: number | [number, number],
        /** Максимальное количество. Если указать 0 - то неограничено */
        max: number,
        /** Какое количество единиц будет при запуске сервера */
        start: number,
        /** Количество восстановления каждый час */
        perhour: number
    }[];
    /** Измерение, в котором NPC должен находится
     * @default 0
     */
    dimension: number;
    /** Требуется ли лицензия для покупки? Если да, то какая? */
    license?: LicenceType;
    /** Список фракций, у которых есть доступ, если не указать - то доступ будет для всех */
    factions?: FACTION_ID[];
    /** Доступ для членов семьи */
    forFamily?: boolean;
    /** Метка на карте, если она необходима */
    blip?: { id: number, color: number },
    /** Какой процент от суммы пойдёт в сейф фракции, если не указать - то никакой */
    partToFraction?: number,
}

export const NPC_SELLERS_LIST:NpcSeller[] = [
    {
     name: "Vadim",
    model: "s_m_y_dealer_01", 
    pos: new mp.Vector3(1984.88, 5175.11, 47.64),
    heading: 101,
    items: [
        {item: 880, cost: [100, 150], max: 0, start: 1000, perhour: 500},
        {item: 60, cost: [100, 150], max: 0, start: 1000, perhour: 500},
        {item: 58, cost: [150, 200], max: 0, start: 1000, perhour: 500},
        {item: 59, cost: [150, 200], max: 0, start: 1000, perhour: 500},
    ],
    dimension: 0,
    factions: [18, 19, 21, 20, 22, 23, 24, 25],
    blip: {id:496, color:52}
    }
]
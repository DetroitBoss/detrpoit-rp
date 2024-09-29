import {ItemEntity} from "../server/modules/typeorm/entities/inventory";
import {ARMOR_ITEM_ID} from "./inventory";

export type CraftType = "plantacion" | "drugs" | "bomb" | "medicine" | "gun103" | "gunTec"| "mef" | "lsd"| "DMT" | "trava" | "winepress" | "winebottle" | "biofuel" | "armor" | "silos" | "sushi"

export type CraftItemFactoryMethod = (table: TableData, tableIndex: number) => Partial<ItemEntity>;

export interface CraftItem {
    /** ID предмета рецепта */
    recipe?: number;
    /** ID предмета, который будет получен по итогу */
    item: number;
    /** Количество предмета. Если указать, то количество у предмета будет определённым */
    count?:number
    /** Какие предметы и в каком количестве необходимы для крафта */
    items: [number, number][];
    /** Сколько секунд необходимо для крафта */
    seconds: number;
    type: CraftType,

    /** Крафт находится в семейном доме */
    inHouseInterior?: boolean;

    itemFactoryMethod?: CraftItemFactoryMethod;
}

export interface TableData {
    /** Координаты всех точек крафта данного раздела */
    pos: { x: number, y: number, z: number, h: number }[],
    /** Какой тип объектов можно крафтить на данных столах */
    type: CraftType,
    /** Название зоны крафта */
    name: string,
    /** Анимация которая будет проиграна */
    anim: string | [string, string],
    /** Режим работы, 
     * @example long - будет проиграна анимка в течении 5 секунд а потом пойдёт таймер отсчёта без участия игрока. То есть находится постоянно на маркере не надо будет.
     * @example short - будет проигрыватся анимка в течении всего таймера, рассчитана на вариант сделать тут на месте и получить результат.
     */
    mode: "short" | "long",
    /** ID блипа, если он необходим */
    blipid?:number;
    /** Цвет блипа, если он необходим */
    blipcolor?:number;
    /** Список ИД фрккций, у которых есть доступ */
    fractions?:number[]
    /** Есть ли доступ у семьи-мафии */
    mafia?: boolean;
}

/** Конфиг всех рецептов */
export const CRAFTING_ITEMS: CraftItem[] = [
    { items: [[859, 1], [858, 1], [857,1]], seconds: 30, type: "bomb", item: 854 },
    { items: [[872, 1], [873, 1], [874,1], [875,1], [876,1], [877,1], [878,1]], seconds: 5, type: "gun103", item: 532 },
    { items: [[872, 1], [873, 1], [874,1], [875,1]], seconds: 5, type: "gunTec", item: 511 },
    { items: [[880, 10],[55, 10]], seconds: 2, type: "trava", item: 51, count: 10},
    { items: [[57, 10],[55, 10],[58, 10]], seconds: 2, type: "lsd", item: 52, count: 10},
    { items: [[60, 10],[55, 10]], seconds: 2, type: "DMT", item: 53, count: 10 },
    { items: [[55, 10],[56, 10],[59, 10]], seconds: 2, type: "mef", item: 50, count: 10},
    { items: [[4000, 1],[4001, 1],[4002, 1]], seconds: 2, type: "armor", item: ARMOR_ITEM_ID },
    {
        items: [[879, 5]],
        seconds: 20,
        type: "winepress",
        item: 881
    },
    {
        items: [[881, 1]],
        seconds: 40,
        type: "winebottle",
        item: 882
    },
    {
        items: [[883, 10]],
        seconds: 60,
        type: "biofuel",
        item: 884
    },
    {
        items: [[895, 10]],
        seconds: 60,
        type: "silos",
        item: 896
    },
    {
        items: [[897, 10]],
        seconds: 60,
        type: "sushi",
        item: 898
    },
];
export const CRAFTING_TABLES: TableData[] = [
    {
        pos: [
            {x: -476.22, y: -1724.48, z: 18.51, h: 103},
            {x: 107.10, y: -1982.84, z: 19.96, h: 303},
            {x: 501.99, y: -1949.99, z: 23.72, h: 304},
            {x: 892.85, y: -2150.90, z: 31.27, h: 354},
            {x: 453.37, y: -1324.83, z: 28.27, h: 49},
            {x: -1490.10, y: 834.79, z: 176.00, h: 115},
            {x: 1399.26, y: 1142.09, z: 106.33, h: 176},
            {x: -347.97, y: 182.69, z: 81.95, h: 260}
        ],
        type: "gun103",
        name: "Крафт AK-103",
        anim: ["anim@heists@money_grab@duffel", "loop"],
        mode: "long",
        fractions: [18, 19, 20, 21, 22,23,24,25],
        mafia: true
    },
    {
        pos: [
            {x: -478.63, y: -1723.58, z: 18.51, h: 18},
            {x: 105.90, y: -1979.62, z: 19.96, h: 10},
            {x: 499.65, y: -1946.70, z: 23.72, h: 31},
            {x: 888.86, y: -2150.42, z: 31.27, h: 355},
            {x: 450.48, y: -1322.39, z: 28.27, h: 50}
        ],
        type: "gunTec",
        name: "Крафт револьвера",
        anim: ["anim@heists@money_grab@duffel", "loop"],
        mode: "long",
        fractions: [18, 19, 20, 21, 22]
    },
  //  {
  //      pos: [
  //          {x: -481.96, y: -1724.47, z: 18.51, h: 6},
  //          {x: 108.93, y: -1977.78, z: 19.96, h: 293},
  //          {x: 494.31, y: -1948.90, z: 23.72, h: 120},
  //          {x: 886.95, y: -2155.62, z: 31.27, h: 83},
  //          {x: 451.68, y: -1319.48, z: 28.27, h: 324},
  //          {x: -1487.16, y: 836.36, z: 176.00, h: 292},
  //          {x: 1397.72, y: 1144.77, z: 106.33, h: 267},
  //          {x: -352.22, y: 182.68, z: 81.95, h: 297}
  //      ],
  //      type: "armor",
  //      name: "Крафт бронежилета",
  //      anim: ["anim@heists@money_grab@duffel", "loop"],
  //      mode: "short",
  //      fractions: [21,19, 22, 18, 20, 24, 25, 23]
  //  },
    {
        pos: [
            {x: -494.98, y: -1713.46, z: 18.96, h: 6},
            {x: 89.73, y: -1985.43, z: 19.44, h: 293},
            {x: 495.42, y: -1943.95, z: 23.72, h: 120},
            {x: 896.71, y: -2161.14, z: 31.27, h: 83},
            {x: 465.11, y: -1331.95, z: 28.27, h: 324}
        ],
        type: "trava",
        name: "Крафт марихуаны",
        anim: ["anim@heists@money_grab@duffel", "loop"],
        mode: "short",
        fractions: [21, 19, 22, 18, 20]
    },
    {
        pos: [
            {x: -492.91, y: -1712.94, z: 18.96 , h: 6},
            {x: 90.82, y: -1983.43, z: 19.44, h: 293},
            {x: 497.30, y: -1942.79, z: 23.72, h: 120},
            {x: 897.30, y: -2156.44, z: 31.27, h: 83},
            {x: 466.54, y: -1330.12, z: 28.27, h: 324}
        ],
        type: "lsd",
        name: "Крафт ЛСД",
        anim: ["anim@heists@money_grab@duffel", "loop"],
        mode: "short",
        fractions: [21, 19, 22, 18, 20]
    },
    {
        pos: [
            {x: -352.45, y: 186.52, z: 81.95, h: 6},
            {x: -1489.74, y: 841.91, z: 176.00, h: 293},
            {x: 1384.03, y: 1136.31, z: 106.33, h: 120}
        ],
        type: "DMT",
        name: "Крафт DMT",
        anim: ["anim@heists@money_grab@duffel", "loop"],
        mode: "short",
        fractions: [23,24,25]
    },
    {
        pos: [
            {x: -354.09, y: 187.38, z: 81.95, h: 6},
            {x: -1491.82, y: 840.96, z: 176.00, h: 293},
            {x: 1386.48, y: 1136.40, z: 106.33, h: 120}
        ],
        type: "mef",
        name: "Крафт амфетамина",
        anim: ["anim@heists@money_grab@duffel", "loop"],
        mode: "short",
        fractions: [23,24,25]
    },
    { 
    pos: [
        { x: 437.13, y: 6455.88, z: 27.74, h: 141 },
        { x: 431.99, y: 6460.27, z: 27.75, h: 141 },
        { x: 426.98, y: 6464.19, z: 27.78, h: 133 },
    ], 
        type: "winepress",
        name: "Отжим винограда", 
        anim: ["special_ped@mountain_dancer@monologue_1@monologue_1a", "mtn_dnc_if_you_want_to_get_to_heaven"], 
        mode: "short",
        blipid: 365,
        blipcolor: 49,
        fractions: [23,24,25]
    },
    { 
        pos: [
        { x: 421.14, y: 6453.42, z: 27.98, h: 178 }, 
        { x: 415.34, y: 6452.03, z: 27.81, h: 183 }, 
        { x: 406.10, y: 6452.09, z: 27.81, h: 177 },
    ], 
        type: "winebottle", 
        name: "Изготовления вина", 
        anim: ["mini@repair", "fixing_a_ped"], 
        mode: "short", 
        blipid: 365,
        blipcolor: 49,
        fractions: [23,24,25]
    },
    {
        pos: [
            { x: 360.09, y: 3407.24, z: 35.40, h: 111 },
            { x: 360.83, y: 3404.44, z: 35.40, h: 116 },
        ],
        type: "biofuel",
        name: "Изготовления биотоплива",
        anim: ["mini@repair", "fixing_a_ped"],
        mode: "short",
        blipid: 361,
        blipcolor: 25,
        fractions: [23,24,25]
    },
    {
        pos: [
            { x: -65.98, y: 6243.67, z: 30.08, h: 298 },
            { x: -64.82, y: 6241.92, z: 30.09, h: 303 },
        ],
        type: "silos",
        name: "Изготовления силоса",
        anim: ["mini@repair", "fixing_a_ped"],
        mode: "short",
        blipid: 361,
        blipcolor: 25,
        fractions: [23,24,25]
    },
    {
        pos: [
            { x: -97.38, y: 2809.66, z: 52.22, h: 263 },
            { x: -96.05, y: 2811.75, z: 52.26, h: 333 },
        ],
        type: "sushi",
        name: "Изготовление суши",
        anim: ["mini@repair", "fixing_a_ped"],
        mode: "short",
        blipid: 760,
        blipcolor: 47,
        fractions: [23,24,25]
    },
];
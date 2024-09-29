/** Сколько секунд будет закладыватся взрывчатка */
import {MINIGAME_TYPE} from "./minigame";

export const GRAB_C4_SET_TIME = 10;
/** Сколько секунд будет идти таймер взрыва двери */
export const GRAB_C4_EXPLODE_TIME = 30;

export const GRAB_POS_LIST: (GrabItemItem | GrabItemMoney)[] = [
    //! ЭТО ПЕРВЫЙ ЭЛЕМЕНТ

    {
        type: "money",
        fractions: "mafia",
        familyLevel: 3,
        name: "Pacific",
        door: {
            timer: GRAB_C4_EXPLODE_TIME,
            hash: 961976194,
            x: 254.38,
            y: 225.72,
            z: 100.88,
            h: 272,
            r: 2.5,
            exit_r: 2.5,
            exit_x: 252.98,
            exit_y: 222.28,
            exit_z: 100.68,
            hide_x: 256.24,
            hide_y: 232.96, 
            hide_z: 102.36,
            default_x: 255.23,
            default_y: 223.98,
            default_z: 102.39,
        alert: [2,3,4,7]
        },
        online: 1,
        anim: ["anim@heists@money_grab@duffel", "loop"],
        second_anim: 10,
        points: [
            { x: 258.03, y: 214.47, z: 100.68, h: 161 },
            { x: 259.25, y: 217.74, z: 100.68, h: 341 },
            { x: 263.59, y: 216.23, z: 100.68, h: 341 },
            { x: 262.31, y: 213.02, z: 100.68, h: 156 },
        ],
        worldTime: [[17,18],[18,19],[19,20],[20,21],[21,22]],
        days: [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31],
        restoreWorldTime: [5, 18, 19, 20, 21],
        minigame: MINIGAME_TYPE.MONEY,
        money_max: [350000, 400000],
        money: [1500, 2000]
    },
    {
        type: "money",
        fractions: "mafia",
        familyLevel: 3,
        name: "Casino",
        door: {
            timer: GRAB_C4_EXPLODE_TIME,
            hash: -1042390945,
            x: 999.30,
            y: 29.06,
            z: 72.76,
            h: 328,
            r: 2.5,
            exit_r: 2.0,
            exit_x: 997.12,
            exit_y: 25.18,
            exit_z: 72.74,
            hide_x: 1002.22,
            hide_y: 26.59,
            hide_z: 68.30,
            default_x: 997.46,
            default_y: 29.39,
            default_z: 73.29,
            alert: [2,3, 4, 7]
        },
        online: 60,
        anim: ["anim@heists@money_grab@duffel", "loop"],
        minigame: MINIGAME_TYPE.MONEY,
        second_anim: 10,
        points: [
            { x: 998.74, y: -0.90, z: 71.74, h: 202 },
            { x: 996.05, y: -1.59, z: 71.74, h: 199 },
            { x: 975.62, y: 7.09, z: 71.74, h: 117 },
            { x: 974.11, y: 11.24, z: 71.74, h: 106 }
        ],
        worldTime: [[17,18],[18,19],[19,20],[20,21],[21,22]],
        days: [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,31],
        restoreWorldTime: [9, 18, 19, 20, 21],
        money_max: [400000, 450000],
        money: [1500, 2000]
    },

    {
        type: "money",
        fractions: "gang",
        name: "Fleeca1",
        door: {
            timer: GRAB_C4_EXPLODE_TIME,
            hash: 2121050683,
            x: 147.04,
            y: -1044.89,
            z: 28.47,
            h: 64,
            r: 2.5,
            exit_r: 2.5,
            exit_x: 148.69,
            exit_y: -1049.13,
            exit_z: 29.29,
            hide_x: 147.96,
            hide_y: -1044.71, 
            hide_z: 23.53,
            default_x: 148.03,
            default_y: -1044.36,
            default_z: 29.51,
            alert: [2,3]
        },
        worldTime: [[15, 16]],
        online: 1,
        anim: ["anim@heists@money_grab@duffel", "loop"],
        second_anim: 5,
        minigame: MINIGAME_TYPE.MONEY,
        points: [
            { x: 150.28, y: -1049.77, z: 28.45, h: 248 },
            { x: 149.13, y: -1050.64, z: 28.45, h: 159 },
            { x: 147.57, y: -1050.04, z: 28.45, h: 161 },
            { x: 147.34, y: -1048.79, z: 28.45, h: 68 },
        ],
        restoreWorldTime: [23],
        money_max: [300000, 350000],
        money: [1200, 1500],
    },
    {
        type: "money",
        fractions: "gang",
        name: "Fleeca3",
        door: {
            timer: GRAB_C4_EXPLODE_TIME,
            hash: 2121050683,
            x: 1176.41, 
            y: 2711.76,
            z: 37.20,
            h: 266,
            r: 2.5,
            exit_r: 4,
            exit_x: 1173.19,
            exit_y: 2715.11,
            exit_z: 38.01,
            hide_x: 1175.26,
            hide_y: 2711.91, 
            hide_z: 33.60,
            default_x: 1175.54,
            default_y: 2710.86,
            default_z: 38.23,
            alert: [7,3]
        },
        online: 1,
        worldTime: [[16, 17]],
        anim: ["anim@heists@money_grab@duffel", "loop"],
        second_anim: 5,
        minigame: MINIGAME_TYPE.MONEY,
        points: [
            { x: 1174.81, y: 2715.22, z: 37.17, h: 270 },
            { x: 1173.91, y: 2716.39, z: 37.17, h: 7 },
            { x: 1172.51, y: 2716.31, z: 37.17, h: 6 },
            { x: 1171.57, y: 2715.10, z: 37.17, h: 104 },
        ],
        restoreWorldTime: [23],
        money_max: [300000, 350000],
        money: [1200, 1500],
    },
    {
        type: "money",
        fractions: "gang",
        name: "Fleeca6",
        door: {
            timer: GRAB_C4_EXPLODE_TIME,
            hash: 2121050683,
            x: -1211.50,
            y: -335.54,
            z: 36.88,
            h: 115,
            r: 2.5,
            exit_r: 4,
            exit_x: -1207.20,
            exit_y: -337.18,
            exit_z: 37.70,
            hide_x: -1210.69,
            hide_y: -335.30, 
            hide_z: 30.12,
            default_x: -1211.26,
            default_y: -334.56,
            default_z: 37.92,
            alert: [2,3]
        },
        online: 1,
        worldTime: [[18, 19]],
        anim: ["anim@heists@money_grab@duffel", "loop"],
        second_anim: 5,
        minigame: MINIGAME_TYPE.MONEY,
        points: [
            { x: -1205.75, y: -336.63, z: 36.86, h: 297 },
            { x: -1205.94, y: -337.87, z: 36.86, h: 202 },
            { x: -1207.48, y: -338.75, z: 36.86, h: 179 },
            { x: -1208.56, y: -338.05, z: 36.86, h: 117 },
        ],
        restoreWorldTime: [23],
        money_max: [300000, 350000],
        money: [1200, 1500],
    },
    {
        type: "money",
        fractions: "gang",
        name: "Fleeca2",
        door: {
            timer: GRAB_C4_EXPLODE_TIME,
            hash: -63539571,
            x: -2957.62,
            y: 481.61,
            z: 14.80,
            h: 193,
            r: 2.5,
            exit_r: 4,
            exit_x: -2954.15,
            exit_y: 484.64,
            exit_z: 15.62,
            hide_x: -2957.88,
            hide_y: 482.30, 
            hide_z: 9.60,
            default_x: -2958.54,
            default_y: 482.27,
            default_z: 15.84,
            alert: [7,3]
        },
        online: 1,
        worldTime: [[19, 20]],
        anim: ["anim@heists@money_grab@duffel", "loop"],
        second_anim: 5,
        minigame: MINIGAME_TYPE.MONEY,
        points: [
            { x: -2954.15, y: 482.87, z: 14.78, h: 176 },
            { x: -2953.04, y: 483.67, z: 14.78, h: 274 },
            { x: -2952.87, y: 485.19, z: 14.78, h: 295 },
            { x: -2954.07, y: 486.00, z: 14.78, h: 356 },
        ],
        restoreWorldTime: [23],
        money_max: [300000, 350000],
        money: [1200, 1500],
    },
    {
        type: "money",
        fractions: "gang",
        name: "Fleeca5",
        door: {
            timer: GRAB_C4_EXPLODE_TIME,
            hash: 2121050683,
            x: -353.98,
            y: -53.93,
            z: 48.15,
            h: 68,
            r: 2.5,
            exit_r: 4,
            exit_x: -351.92, 
            exit_y: -58.28,
            exit_z: 48.96,
            hide_x: -352.75,
            hide_y: -54.34, 
            hide_z: 41.93,
            default_x: -352.74,
            default_y: -53.57,
            default_z: 49.18,
            alert: [2,3]
        },
        online: 1,
        worldTime: [[20, 21]],
        anim: ["anim@heists@money_grab@duffel", "loop"],
        second_anim: 5,
        minigame: MINIGAME_TYPE.MONEY,
        points: [
            { x: -353.47, y: -57.91, z: 48.11, h: 68 },
            { x: -353.17, y: -59.12, z: 48.11, h: 189 },
            { x: -351.62, y: -59.80, z: 48.11, h: 162 },
            { x: -350.44, y: -58.85, z: 48.11, h: 281 },
        ],
        restoreWorldTime: [23],
        money_max: [300000, 350000],
        money: [1200, 1500],
    },
    {
        type: "money",
        fractions: "gang",
        name: "Fleeca4",
        door: {
            timer: GRAB_C4_EXPLODE_TIME,
            hash: 2121050683,
            x: 311.08,
            y: -283.20,
            z: 53.27,
            h: 66,
            r: 2.5,
            exit_r: 4,
            exit_x: 313.06,
            exit_y: -287.49,
            exit_z: 54.09,
            hide_x: 312.24,
            hide_y: -283.49,
            hide_z: 45.97,
            default_x: 312.36,
            default_y: -282.73,
            default_z: 54.30,
            alert: [7,3]
        },
        online: 1,
        worldTime: [[21, 22]],
        anim: ["anim@heists@money_grab@duffel", "loop"],
        second_anim: 5,
        minigame: MINIGAME_TYPE.MONEY,
        points: [
            { x: 311.57, y: -287.00, z: 53.24, h: 69 },
            { x: 312.00, y: -288.43, z: 53.24, h: 164 },
            { x: 313.41, y: -289.14, z: 53.24, h: 190 },
            { x: 314.49, y: -288.10, z: 53.24, h: 248 },
        ],
        restoreWorldTime: [23],
        money_max: [300000, 350000],
        money: [1200, 1500],
    },
{
    type: "item",
    fractions: [18,19,20,21,22,23,24,25],
    name: "Army",
    worldTime: [[17,18],[18,19],[19,20],[20,21],[21,22]],
    online: 1,
    anim: ["anim@heists@money_grab@duffel", "loop"],
    second_anim: 10,
    points: [
        { x: -1779.71, y: 2995.42, z: 31.81, h: 337},
        { x: -1780.19, y: 2997.67, z: 31.81, h: 271 },
        { x: -1785.34, y: 3000.48, z: 31.81, h: 214 },
        { x: -1787.46, y: 2999.02, z: 31.81, h: 224},
        { x: -1798.27, y: 2930.29, z: 31.81, h: 48},
        { x: -1784.29, y: 2947.41, z: 31.81, h: 52}
    ],
    findChance: 0,
    restoreWorldTime: [4, 18, 19, 20, 21],
    days:[1, 3, 5, 7, 9, 11, 13, 15, 17, 19,21,23,25,27,29,31,24],
    giveItem: [

    {
        item: 529,
        amount: 10
        
    },
    {
        item: 910,
        amount: 20
        
    },
    {
        item: 519,
        amount: 6
        
    },
    {
        item: 500,
        amount: 15
        
    },
    {
        item: 532,
        amount: 4
        
    },
    {
        item: 530,
        amount: 10
        
    },
    {
        item: 544,
        amount: 10
        
    },
    {
        item: 151,
        amount: 100
        
    },
    
    {
        item: 854,
        amount: 2
        
    },
    {
        item: 539,
        amount: 10
        
    },
    {
        item: 537,
        amount: 10
        
    },
    {
                
        item: 872,
        amount: 20
                
    },
    {
        item: 873,
        amount: 20
        
    },
    {
        item: 874,
        amount: 20
        
    },
    {
        item: 875,
        amount: 20
        
    },
    {
        item: 876,
        amount: 20
        
    },
    {
        item: 877,
        amount: 20
        
    },
    {
        item: 571,
        amount: 10
        
    },
    {
        item: 878,
        amount: 10

    },
    {
        item: 960,
        amount: 30
        
    }
    
]
    
},
{
    type: "item",
    fractions: "gang",
    name: "Port",
    
    door: {
        timer: 420,
        hash: 2244758654,
        x: 610.3449,
        y: -3058.781,
        z: 5.422087,
        h: 358,
        r: 1.5,
        exit_r: 1,
        exit_x: 610.15, 
        exit_y: -3062.83,
        exit_z: 5.07,
        hide_x: 611.07,
        hide_y: -3058.70, 
        hide_z: 1.17,
        default_x: 610.983,
        default_y: -3059.51,
        default_z: 6.3120,
        alert: [4,7,2,3],
        alertBefore: true
    },
    online: 1,
    days: [2,4,6,8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 31],
    worldTime: [[17,18],[18,19],[19,20],[20,21],[21,22]],
    anim: ["anim@heists@money_grab@duffel", "loop"],
    second_anim: 10,
    points: [
        { x: 610.40, y: -3095.96, z: 5.07, h: 267 },
        { x: 613.22, y: -3093.60, z: 5.07, h: 187 },
        { x: 612.20, y: -3084.11, z: 5.07, h: 2 },
        { x: 609.99, y: -3081.54, z: 5.07, h: 266 }
    ],

    restoreWorldTime: [4, 18, 19, 20, 21],
    giveItem: [
    {
                
        item: 872,
        amount: 20
                
    },
    {
        item: 873,
        amount: 20
        
    },
    {
        item: 874,
        amount: 20
        
    },
    {
        item: 875,
        amount: 20
        
    },
    {
        item: 876,
        amount: 20
        
    },
    {
        item: 877,
        amount: 20
        
    },
    {
        item: 854,
        amount: 3
        
    },
    {
        item: 910,
        amount: 30
        
    },
    {
        item: 539,
        amount: 10
        
    },
    {
        item: 537,
        amount: 10
        
    },
    {
        item: 571,
        amount: 10
        
    },
    {
        item: 960,
        amount: 20
        
    }
]
    
}
    //! ЭТО КОНЕЦ ПЕРВОГО ЭЛЕМЕНТА
];

export interface GrabItemBase {
    /** Масив ID фракций, которые допускаются к ограблению, либо строковый параметр по типу фракции.
     * @tutorial {string} all - это значит что будут допущены и mafia и gang
     */
    fractions: number[] | "mafia" | "gang" | "all" | "family";
    /** Уровень семьи с которого доступен функционал крайм семьи */
    familyLevel?: number;
    /** Название */
    name: string;
    /** Параметр двери, если её необходимо вскрыть */
    door?: {
        /** Сколько секунд пройдёт прежде чем бомба рванёт */
        timer: number;
        /** Масив с ИД фракций, которые необходимо оповестить о подрыве двери */
        alert?: number[],
        /** Если поставить true - то оповещение о взрыве прийдёт когда бомбу УСТАНОВЯТ а не когда она бабахнет */
        alertBefore?:boolean,
        /** Координата метки для взрыва двери */
        x: number;
        /** Координата метки для взрыва двери */
        y: number;
        /** Координата метки для взрыва двери */
        z: number;
        /** Радиус */
        r: number;
        /** Угол поворота, В ПРОТИВОПОЛОЖНУЮ СТОРОНУ ОТ ДВЕРИ */
        h: number;
        /** Координата метки выхода, если дверь закрыта */
        exit_x: number;
        /** Координата метки, если дверь закрыта */
        exit_y: number;
        /** Координата метки, если дверь закрыта */
        exit_z: number;
        /** Радиус зоны выхода */
        exit_r: number;
        /** Хеш/Модель двери */
        hash: number;
        /** Координата X, куда мы будет прятать дверь, которую вскрыли. Это должно быть место, которое никто не видит, и при этом оно должно быть максимально рядом (в радиусе 20 метров) */
        hide_x: number;
        /** Координата Y, куда мы будет прятать дверь, которую вскрыли. Это должно быть место, которое никто не видит, и при этом оно должно быть максимально рядом (в радиусе 20 метров) */
        hide_y: number;
        /** Координата Z, куда мы будет прятать дверь, которую вскрыли. Это должно быть место, которое никто не видит, и при этом оно должно быть максимально рядом (в радиусе 20 метров) */
        hide_z: number;
        /** Координата X, Где сама дверь расположена по умолчанию */
        default_x: number;
        /** Координата Y, Где сама дверь расположена по умолчанию */
        default_y: number;
        /** Координата Z, Где сама дверь расположена по умолчанию */
        default_z: number;
    },
    /** Во сколько часов необходимо выполнить процедуру полного восстановления параметров до исходного состояния. Если не указать - то восстановления не будет происходить автоматически */
    restoreWorldTime: number[];
    /** Реальное время, если необходимо ограничить. От и до включительно */
    worldTime?: [number, number][];
    /** Если указать - систему можно будет запустить только вручную */
    adminRun?: number,
    /** Реальные дни, в которые будет работать, если необходимо ограничить */
    days?: number[];
    /** Координаты точек ограбления. Их количество будет определять сколько людей одновременно может грабить */
    points: { x: number, y: number, z: number, h: number }[];
    /** Анимация или сценарий
     * @example [string, string] - это анимация
     * @example string - это сценарий
     */
    anim: [string, string] | string;
    /** Сколько секунд будет проигрыватся анимация или сценарий */
    second_anim: number;
    /** Миниигра, если требуется. Будет проиграна после таймера second_anim */
    minigame?: MINIGAME_TYPE,
    /** Сколько минимум игроков должно быть на сервере, указывать если необходимо ограничить */
    online?: number;
    /** Каков шанс найти предмет. Если указать 100 - при каждом взломе игрок будет забирать предмет. Если не указать или указать 0 - то проверки на шанс вообще не будет */
    findChance?: number;
}

export interface GrabItemMoney extends GrabItemBase {
    type: "money"
    /** Сколько всего будет денег. Это либо статическое значение, либо массив из диапазона от и до */
    money_max: number | [number, number];
    /** Сколько даётся за один взлом. Это либо статическое значение, либо массив из диапазона от и до */
    money: number | [number, number];
}
export interface GrabItemItem extends GrabItemBase {
    type: "item"
    /** При каждом тике будет выдаваться случайный предмет из массива с равным шансом. Чтобы повысить шанс предмета - можете его продублировать */
    giveItem: {
        /** ИД предмета */
        item: number,
        /** Количество предметов */
        amount: number,
    }[];
}

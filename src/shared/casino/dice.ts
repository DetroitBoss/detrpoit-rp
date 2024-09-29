/** Модель стола для костей */
import {CASINO_MAIN_DIMENSION} from "./main";

export const DICE_TABLE_MODEL = 'vw_prop_casino_3cardpoker_01b';


export interface DiceCasinoItem {
    position: Vector3Mp,
    heading: number,
    dimension: number,
    /** Стол только для вип игроков */
    isVip: boolean,
    /** Стол будет обслуживать NPC */
    npc?: number,
    /** Выбор ставки стола. NPC будет выбирать случайно */
    betsSum: number[]
}

export const DICE_TABLES_LIST:DiceCasinoItem[] = [
    {
        position: new mp.Vector3(1152.331, 265.3826, -52.83587),
        heading: 222,
        dimension: CASINO_MAIN_DIMENSION,
        isVip: false,
        npc: 0,
        betsSum: [10, 50, 100]
    },
    {
        position: new mp.Vector3(1145.331, 266.219, -52.83587),
        heading: 40,
        dimension: CASINO_MAIN_DIMENSION,
        isVip: false,
        npc: 0,
        betsSum: [10, 50, 100]
    },
    {
        position: new mp.Vector3(1133.582, 266.858, -52.04345),
        heading: 346,
        dimension: CASINO_MAIN_DIMENSION,
        isVip: false,
        // npc: 0,
        betsSum: [100, 500, 1000]
    },
    {
        position: new mp.Vector3(1129.515, 261.9758, -52.04345),
        heading: 142,
        dimension: CASINO_MAIN_DIMENSION,
        isVip: false,
        // npc: 0,
        betsSum: [100, 500, 1000]
    },
    {
        position: new mp.Vector3(1144.333, 251.5709, -52.04153),
        heading: 98,
        dimension: CASINO_MAIN_DIMENSION,
        isVip: true,
        // npc: 0,
        betsSum: [1500, 2000, 2500]
    },
    {
        position: new mp.Vector3(1148.843, 247.0942, -52.04153),
        heading: 241,
        dimension: CASINO_MAIN_DIMENSION,
        isVip: true,
        // npc: 0,
        betsSum: [1500, 2000, 2500]
    },
]

export const DICE_TABLE_SETTINGS = {
    /** Название маркера а так же метки на карте */
    name: 'Стол с костями',
    /** Цвет стола */
    TABLE_COLOR: {
      DEFAULT: 0,
      VIP: 1,
    },
    /** Комиссия диллера */
    DEALER_PERCENT: {
        /** Бот */
        NPC: 10,
        /** Игрок */
        PLAYER: 5,
        TOPLAYER: 10
    },
    DRESS_POS: {x: 1088.35, y: 219.32, z: -50.10, h: 184},
    DRESS_MALE: <[number, number, number][]>[[0,0,0],[1,0,0],[3,11,0],[4,10,0],[5,0,0],[6,15,0],[7,36,0],[8,7,0],[9,0,0],[10,0,0],[11,40,0],[100,8,0],[101,0,0],[102,2,0]],
    DRESS_FEMALE: <[number, number, number][]>[[0,0,0],[1,0,0],[3,0,0],[4,6,0],[5,0,0],[6,19,3],[7,0,0],[8,24,0],[9,0,0],[10,0,0],[11,28,9],[100,-1,-1],[101,-1,-1],[102,-1,-1]],
    /** Позиция диллера */
    DEALER_OFFSET: {x: 0.00, y: 0.88, z: 1.0, h: 180},
    CAMERA_OFFSET: {
      PLAYER: {x: 0, y: -1.3, z: 3, rx: 0, ry: 0.7, rz: 0},
      CROUPIER: {x: 0, y: 1.0, z: 3, rx: 0, ry: -0.7, rz: 0},
    },
    /** Местоположение сидений */
    SEATS: <{x: number, y: number, z: number, h: number, sx: number, sy: number, sz: number}[]>[
        {x: -1.18, y: 0.02, z: 0.68, h: 293, sx: -1.18, sy: 0.02, sz: 0.68,},
        {x: -0.48, y: -0.68, z: 0.68, h: 342, sx: -0.48, sy: -0.68, sz: 0.68},
        {x: 0.46, y: -0.70, z: 0.68, h: 24, sx: 0.46, sy: -0.70, sz: 0.68,},
        {x: 1.20, y: -0.00, z: 0.68, h: 71, sx: 1.20, sy: -0.00, sz: 0.68,},
    ]
}

/** Таймер начала игры (когда можно отменить но нельзя поставить) */
export const DICE_PLAY_START_TIME = 15;
/** Таймер NPC ожидания (сколько ждёт NPC прежде чем начать) */
export const DICE_PLAY_WAIT_TIME = 20;
/** Сколько секунд даётся на то, чтобы кинуть кубик (Время даётся на каждый) */
export const DICE_PLAY_TIME = 10;
/** Сколько раз необходимо кинуть кубик */
export const DICE_PLAY_COUNT = 2;


export const DICE_BET_LIST:{sum: number, class: string}[] = [
    {sum: 100, class: 'chip-green'},
    {sum: 300, class: 'chip-pink'},
    {sum: 500, class: 'chip-red'},
    {sum: 1000, class: 'chip-white'},
    {sum: 2000, class: 'chip-yellow'},
    {sum: 3000, class: 'chip'},
]

export const getDiceBetClassName = (bet: number) => {
    return DICE_BET_LIST.find(q => q.sum === bet)?.class || 'chip'
}

export const getCasinoDiceTable = (id: number) => {
    return DICE_TABLES_LIST[id];
}

export interface DicePlayer {
    id: number,
    name: string,
    stage: 'wait' | 'ready' | 'dice' | 'ok',
    time?: number,
    score?: number,
    scoreArr?: number[]
}

export interface DiceData {
    stage: 'wait' | 'ready' | 'dice' | 'ok',
    players: [DicePlayer, DicePlayer, DicePlayer, DicePlayer];
    id: number,
    croupier?: number,
    bet: number,
    betsum: number,
}
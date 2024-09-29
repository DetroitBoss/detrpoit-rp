import {CASINO_MAIN_DIMENSION, CHIPS_TYPES, CHIPS_TYPES_SUM} from "./main";
/** Смещение позиции фишек по оси Z */
export const GRID_START_Z = 0.9448;

export const ROULETTE_STATENAMES = ['Ожидание', 'Ставки сделаны', 'Запуск...'];
export const enum ROULETTE_STATENAMES_ID {
    /** Ожидание, можно делать ставки */
    WAIT = 0,
    /** Ставки больше не принимаются */
    BET_END = 1,
    /** Рулетка запустилась */
    START = 2,
}
/** Сколько ставок на стол может сделать игрок */
export const ROULETTE_MAX_BETS = 3;
/** Сколько ставок на стол могут сделать игроки в сумме */
export const ROULETTE_MAX_BETS_TABLE = 30;
/** Модель пропа стола */
export const ROULETTE_TABLE_MODEL = 'vw_prop_casino_roulette_01';
/** Дистанция на котрой можно подключится к столу */
export const ROULETTE_TABLE_ENTER_DISTANCE = 3;
/** Дистация от точки позади сидения, на которой можно подключится к столу */
export const ROULETTE_TABLE_ENTER_DISTANCE_SEAT = 1;
/** Цвет стола */
export const ROULETTE_TABLE_COLOR = 0;
/** Цвет VIP стола */
export const ROULETTE_VIP_TABLE_COLOR = 1;
/** Сколько секунд даётся на ставку в рулетке */
export const ROULETTE_BET_TIME = 30;
/** Координаты размещения игроков */
export const ROULETTE_TABLE_SEATS_POSITIONS: [number, number, number, number, number, number, number][] = [
    [-0.20, -1.0, 0.70, 0, -0.20, -0.84, 0], // x: -0.20, -1.00, 0.70, h: 0, model: 623773339, needTp: false
    [0.77, -1.05, 0.70, 0, 0.78, -0.825, 0], // x: 0.76, -1.00, 0.70, h: 0, model: 623773339, needTp: false
    [1.50, -0.14, 0.70, 90, 1.35, -0.10, 100], // x: 1.50, -0.14, 0.70, h: 90, model: 623773339, needTp: false
    [0.76, 0.72, 0.70, 180, 0.78, 0.63, 180], // x: 0.76, 0.72, 0.70, h: 180, model: 623773339, needTp: false
]
/** Какую сумму мы считаем большим выигрышем ну или большим проигрышем */
export const ROULETTE_SUM_AS_BIG_WIN = 1000;


export interface ROULETTETableItem {
    /** Позиция стола */
    position: Vector3Mp,
    /** Угол поворота стола */
    heading: number,
    /** Доступные для игры фишки */
    chipTypePrices: CHIPS_TYPES_SUM[],
    /** Стол для вип игроков */
    isVip: boolean,
    /** Измерение в котором создаётся стол */
    dimension: number,
    dealer: number,
}

/** Базовые столы для рулетки */
export const ROULETTE_TABLE_POSITIONS:ROULETTETableItem[] = [
    {
        position: new mp.Vector3(1133.791, 262.3499, -52.04345),
        heading: 208,
        chipTypePrices: [100, 500, 1000],
        isVip: true,
        dimension: CASINO_MAIN_DIMENSION,
        dealer: 1
    },
    {
        position: new mp.Vector3(1129.629, 266.5121, -52.04345),
        heading: 40,
        chipTypePrices: [100, 500, 1000],
        isVip: true,
        dimension: CASINO_MAIN_DIMENSION,
        dealer: 1
    },
    {
        position: new mp.Vector3(1148.843, 251.3866, -52.04153),
        heading: 273,
        chipTypePrices: [100, 500, 1000],
        isVip: true,
        dimension: CASINO_MAIN_DIMENSION,
        dealer: 1
    },
    {
        position: new mp.Vector3(1144.333, 247.603, -52.04153),
        heading: 115,
        chipTypePrices: [100, 500, 1000],
        isVip: true,
        dimension: CASINO_MAIN_DIMENSION,
        dealer: 1
    },
    {
        position: new mp.Vector3(1148.714, 269.6028, -52.83587),
        heading: 45,
        chipTypePrices: [10, 50, 100],
        isVip: false,
        dimension: CASINO_MAIN_DIMENSION,
        dealer: 2
    },
    {
        position: new mp.Vector3(1149.343, 262.3951, -52.83587),
        heading: 222,
        chipTypePrices: [10, 50, 100],
        isVip: false,
        dimension: CASINO_MAIN_DIMENSION,
        dealer: 2
    }
]




















interface RuleInterface {
    multiplier: number;
    title: string;
    type: string;
    winNumbers: number[]
}

export const mapWinMultiplier: {[key: string]: number} = {
    'number': 35,
    'trio': 11,
    'dozen': 2,
    'small': 1,
    'even': 1,
    'red': 1,
    'black': 1,
    'odd': 1,
    'big': 1,
    'column': 2,
    'split': 17,
    'five-numbers': 6,
    'six-numbers': 5,
    'square': 8,
    'straight': 11,
};

export const mapWinName: {[key: string]: string} = {
    'number': 'Число',
    'trio': 'Трио',
    'dozen': 'Дюжина',
    'small': 'Малые',
    'even': 'Четные',
    'red': 'Красные',
    'black': 'Чёрные',
    'odd': 'Нечетные',
    'big': 'Большие',
    'column': 'Колонна',
    'split': 'Сплит',
    'five-numbers': '5 Номеров',
    'six-numbers': '6 Номеров',
    'square': 'Каре',
    'straight': 'Стрит',
};

export const mapWinDesc: {[key: string]: string} = {
    'number': 'Число',
    'trio': 'Трио',
    'dozen': 'Дюжина',
    'small': 'Малые',
    'even': 'Четные',
    'red': 'Красные',
    'black': 'Чёрные',
    'odd': 'Нечетные',
    'big': 'Большие',
    'column': 'Колонна',
    'split': 'Сплит',
    'five-numbers': '5 Номеров',
    'six-numbers': '6 Номеров',
    'square': 'Каре',
    'straight': 'Стрит',
};

export const mapWinIcon: {[key: string]: string} = {
    'number': 'info-r-09',
    'trio': 'info-r-07',
    'dozen': 'info-r-03',
    'small': 'info-r-01',
    'even': 'info-r-02',
    'red': 'info-r-02',
    'black': 'info-r-02',
    'odd': 'info-r-02',
    'big': 'info-r-01',
    'column': 'info-r-03',
    'split': 'info-r-08',
    'five-numbers': 'info-r-04',
    'six-numbers': 'info-r-04',
    'square': 'info-r-06',
    'straight': 'info-r-05',
};

const createRulesObject = (title: string, type: string, winNumbers: number[]): RuleInterface => ({
    multiplier: mapWinMultiplier[type],
    title,
    type,
    winNumbers
});

export const ROULETTE_RULES: {[key: string]: RuleInterface} = {
    '0-1-37': createRulesObject('Трио', 'trio', [0, 1, 37]),
    '1-36-37': createRulesObject('Трио', 'trio', [1, 36, 37]),
    '1-2-36': createRulesObject('Трио', 'trio', [1, 2, 36]),
    '0-37': createRulesObject('Сплит', 'split', [0, 37]),
    '1-37': createRulesObject('Сплит', 'split', [1, 37]),
    '1-36': createRulesObject('Сплит', 'split', [1, 36]),
    '2-36': createRulesObject('Сплит', 'split', [2, 36]),
    '50': createRulesObject('Сплит', 'split', [36, 37]),
    '36-37': createRulesObject('Сплит', 'split', [36, 37]),
    '36': createRulesObject('Double zero', 'number', [36]),
    '37': createRulesObject('Zero', 'number', [37]),
    '38': createRulesObject('Дюжина 1', 'dozen', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    '39': createRulesObject('Дюжина 2', 'dozen', [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]),
    '40': createRulesObject('Дюжина 3', 'dozen', [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]),
    '41': createRulesObject('Малые', 'small', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]),
    '42': createRulesObject('Четные', 'even', [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35]),
    '43': createRulesObject('Красные', 'red', [0, 2, 4, 6, 8, 11, 13, 15, 17, 18, 20, 22, 24, 26, 29, 31, 33, 35]),
    '44': createRulesObject('Черные', 'black', [1, 3, 5, 7, 9, 10, 12, 14, 16, 19, 21, 23, 25, 27, 28, 30, 32, 34]),
    '45': createRulesObject('Нечетные', 'odd', [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34]),
    '46': createRulesObject('Большие', 'big', [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]),
    '47': createRulesObject('Колонна 1', 'column', [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33]),
    '48': createRulesObject('Колонна 2', 'column', [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]),
    '49': createRulesObject('Колонна 3', 'column', [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35]),
    '50-51': createRulesObject('5 номеров', 'five-numbers', [37, 38, 0, 1, 2])
};

export const redNumbers: number[] = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
for (let i = 0; i < 36; i++) {
    ROULETTE_RULES[i] = createRulesObject(`${i + 1} ${redNumbers.includes(i + 1) ? 'красное': 'черное'}`, 'number', [i]);
}

for (let i = 0; i < 11; i++) {
    const ix3 = i * 3;

    const rulesSquareFirst = [ix3, ix3 + 1, ix3 + 3, ix3 + 4];
    const rulesSquareSecond = [ix3 + 1, ix3 + 2, ix3 + 4, ix3 + 5];

    ROULETTE_RULES[rulesSquareFirst.join('-')] = createRulesObject('Каре', 'square', rulesSquareFirst);
    ROULETTE_RULES[rulesSquareSecond.join('-')] = createRulesObject('Каре', 'square', rulesSquareSecond);

    const splitFirst = [ix3, ix3 + 3];
    const splitSecond = [ix3 + 1, ix3 + 4];
    const splitThree = [ix3 + 2, ix3 + 5];

    ROULETTE_RULES[splitFirst.join('-')] = createRulesObject('Сплит', 'split', splitFirst);
    ROULETTE_RULES[splitSecond.join('-')] = createRulesObject('Сплит', 'split', splitSecond);
    ROULETTE_RULES[splitThree.join('-')] = createRulesObject('Сплит', 'split', splitThree);
}

for (let i = 0; i < 12; i++) {
    const ix3 = i * 3;

    const splitFirst = [ix3, ix3 + 1];
    const splitSecond = [ix3 + 1, ix3 + 2];

    ROULETTE_RULES[splitFirst.join('-')] = createRulesObject('Сплит', 'split', splitFirst);
    ROULETTE_RULES[splitSecond.join('-')] = createRulesObject('Сплит', 'split', splitSecond);
}

for (let i = 51; i < 63; i++) {
    const j = i - 51;
    const jx3 = j * 3;

    ROULETTE_RULES[i] = createRulesObject('Стрит', 'straight', [jx3, jx3 + 1, jx3 + 2]);

    if (i !== 62) {
        const nextJ = (i - 50) * 3;

        ROULETTE_RULES[`${i}-${i + 1}`] = createRulesObject('6 номеров', 'six-numbers', [jx3, jx3 + 1, jx3 + 2, nextJ, nextJ + 1, nextJ + 2]);
    }
}

const getChipTypeByBalance = (table: TableInterface, balance: number) => {
    for (let i = table.chipTypePrices.length - 1; i >= 0; i--) {
        const chipPrice = table.chipTypePrices[i];

        if (balance >= chipPrice) {
            return i;
        }
    }
};

export const ROULETTE_MAP_ANIMS: {[key: number]: number} = {
    [36]: 1,
    [26]: 2,
    [9]: 3,
    [24]: 4,
    [28]: 5,
    [11]: 6,
    [7]: 7,
    [18]: 8,
    [12]: 37,
    [17]: 10,
    [5]: 11,
    [20]: 12,
    [32]: 13,
    [15]: 14,
    [3]: 15,
    [22]: 16,
    [34]: 17,
    [13]: 18,
    [1]: 19,
    [37]: 20,
    [27]: 21,
    [8]: 22,
    [25]: 23,
    [29]: 24,
    [10]: 25,
    [6]: 26,
    [19]: 27,
    [31]: 28,
    [16]: 29,
    [4]: 30,
    [21]: 31,
    [33]: 32,
    [14]: 33,
    [2]: 34,
    [23]: 35,
    [35]: 36,
    [30]: 9,
    [0]: 38
};
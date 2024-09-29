export const FIRM_ID_TO_BRAND_IMAGE = new Map<number, string>([
    [1, 'apple'],
    [2, 'samsung'],
    [4, 'kfc'],
    [5, 'mac'],
    [7, 'ps'],
    [8, 'xbox'],
    [10, 'bmw'],
    [11, 'mercedes'],
    [13, 'lv'],
    [15, 'gucci'],
    [17, 'chanel'],
    [19, 'fleeca'],
    [20, 'maze'],
    [23, 'bc'],
])

export const FIRM_ID_TO_COST = new Map<number, number>([
    [1, 500],
    [2, 550],
    [4, 600],
    [5, 650],
    [7, 700],
    [8, 800],
    [10, 900],
    [11, 950],
    [13, 1000],
    [15, 1200],
    [17, 1500],
    [19, 1500],
    [20, 1700],
    [23, 2000],
])

export interface IFieldDesc {
    title: string
    desc: string
}
export const FIELD_ID_TO_HINT = new Map<number, IFieldDesc>([
    [0, {desc: 'Встает на старт и получает дополнительно +1 000$', title: 'Start'}],
    [3, {desc: 'Встает на подоходный налог и должен заплатить 1 000$ банку', title: 'Tax'}],
    [6, {desc: 'Посещает тюрьму с визитом', title: 'Prison'}],
    [9, {desc: 'Учавствует в тестировании телепортации', title: 'Teleport'}],
    [12, {desc: 'Встает на Jackpot и может сыграть сделав ставку', title: 'Jackpot'}],
    [14, {desc: 'Получает дополнительно 2 000$ в виде возврата налогов от банка', title: 'Bonus'}],
    [16, {desc: 'Встает на подоходный налог и должен заплатить 1 000$ банку', title: 'Tax'}],
    [18, {desc: 'Встает на арест и отправляется в тюрьму', title: 'Arrest'}],
    [21, {desc: 'Следующий ход проспит', title: 'Skip'}],
    [22, {desc: 'Учавствует в тестировании телепортации', title: 'Teleport'}],
])

export const PLAYER_IDX_TO_IMAGE = new Map<number, string>([
    [0, 'boat'],
    [1, 'car'],
    [2, 'scooter'],
    [3, 'skate'],
])

export const FIRM_ID_TO_CARD_COLOR = new Map<number, string>([
    [1, 'red'],
    [2, 'red'],
    [4, 'aqua'],
    [5, 'aqua'],
    [7, 'blue'],
    [8, 'blue'],
    [10, 'purple'],
    [11, 'purple'],
    [13, 'sky'],
    [15, 'sky'],
    [17, 'sky'],
    [19, 'rose'],
    [20, 'rose'],
    [23, 'rose'],
])
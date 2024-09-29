/** ИД внутренних интерьеров казино */
export const CASINO_INTERIORS_IDS_IN = [275201];
/** ID интерьеров казино */
export const CASINO_INTERIORS_IDS = [274689, ...CASINO_INTERIORS_IDS_IN];
/** Пропи казиношных фишек */
export const CHIP_TYPE_MODELS = ['vw_prop_chip_10dollar_x1', 'vw_prop_chip_50dollar_x1', 'vw_prop_chip_100dollar_x1', 'vw_prop_chip_500dollar_x1', 'vw_prop_chip_1kdollar_x1', 'vw_prop_chip_5kdollar_x1', 'vw_prop_chip_10kdollar_x1'];
/** Все доступные фишки */
export type CHIPS_TYPES = 0 | 1 | 2 | 3 | 4 | 5 | 6;
/** Все доступные фишки по суммам */
export type CHIPS_TYPES_SUM = 10 | 50 | 100 | 500 | 1000 | 5000 | 10000;
export const CHIPS_TYPE: CHIPS_TYPES_SUM[] = [10, 50, 100, 500, 1000, 5000, 10000]
/** Стоимость одной фишки */
export const CHIP_COST = 100;
/** Стоимость одной фишки */
export const CHIP_SELL_COST = CHIP_COST * 0.9;
/** Минимально доступное количество фишек для покупки */
export const CHIP_MIN_BUY = 10;
/** Минимально доступное количество фишек для продажи */
export const CHIP_MIN_SELL = 10;
export const CASINO_MAIN_DIMENSION = 1;

export const EXIT_ANIM = ["anim_casino_b@amb@casino@games@shared@player@", "sit_exit_left"];
export const ENTER_ANIM = ["anim_casino_b@amb@casino@games@shared@player@", "sit_enter_right"];

export const CASINO_ENTER = {x: 935.05, y: 46.23, z: 80.20, h: 112}

export const CASINO_DEALERS:{model: string, speech: string, male: boolean}[] = [
    {model: 'u_f_m_casinocash_01', speech: 's_f_y_casino_01_asian_01', male: false},
    {model: 's_f_y_casino_01', speech: 's_f_y_casino_01_latina_01', male: false},
    {model: 's_m_y_casino_01', speech: 's_m_y_casino_01_white_01', male: true},
]

export const CASINO_CASHIER = {
    name: 'Anna',
    model: 'u_f_m_casinoshop_01',
    speech: 's_f_y_casino_01_asian_02',
    dimension: CASINO_MAIN_DIMENSION,
    pedPos: {x: 1117.57, y: 221.15, z: -49.44, h: 70},
}

export const CASINO_BUY_CHIPS_INTERFACE:{count: number, class: string}[] = [
    {count: 10, class: ''},
    // {count: 50, class: ''},
    {count: 100, class: ''},
    {count: 1000, class: 'blue'},
    {count: 10000, class: 'purple'},
    // {count: 100000, class: 'purple'},
]

export const getChipIndexBySum = (sum: number) => CHIPS_TYPE.findIndex(q => q === sum)
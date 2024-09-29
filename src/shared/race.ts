/** Маркера зоны регистрации */
export const RACE_REGISTER_POS:Vector3Mp[] = [
    new mp.Vector3(-246.19, -2007.87, 29.15),
    new mp.Vector3(-248.65, -2013.81, 29.15),
];
/** Координаты точек биллборда. Вектор - это координата, цифра - это угол поворота */
export const RACE_REGISTER_BOARD:[Vector3Mp, number][] = [
    [new mp.Vector3(-245.67, -2010.52, 30.15), 250]
];
/** Имя гоночной системы для оповещений и прочего */
export const RACE_NAME = "RaceClub";
/** Сколько минут даётся перед началом регистрации на гонку */
export const WAIT_FOR_START_REGISTER = 10;
/** Сколько минут даётся на регистрацию */
export const WAIT_REGISTER = 2;
/** Сколько минимум гонщиков может быть */
export const MIN_RACERS = 5;
/** Сколько максимум гонщиков может быть */
export const MAX_RACERS = 20;
/** Диапазон случайной награды. Первое место получит всю сумму, второе - в 2 раза меньше, третье - в 3 раза меньше
 * @example Сумма 3000
 * 1 Место - 3000
 * 2 Место - 1500
 * 3 Место - 1000
 */
export const MONEY_RAGE = [9000, 15000]

/** Сколько трасс может создать один игрок */
export const PLAYER_MAPS_LIMIT = 5;

/** Лимит количества чекпоинтов */
export const LIMIT_CHECKPOINTS = 100;
/** Минимальное количество чекпоинтов */
export const MIN_CHECKPOINTS = 10;

export type RACE_TYPE = "line" | "circle"
export const RACE_TYPE_ARR: RACE_TYPE[] = ["line", "circle"]
export const RACE_TYPE_ARR_NAME: string[] = ["Спринт", "Кольцо"]


/** Шанс выиграть экстра награду. 0 - выключить */
export const CHANCE_WIN_EXTRA_BONUS = 5;
/** Дать шанс выиграть экстра награду только первым трём местам */
export const CHANCE_WIN_EXTRA_BONUS_FIRST = true;
/** На сколько будет умножена награда за первое место для значения экстра награды? */
export const CHANCE_WIN_MULTIPLER = 10;

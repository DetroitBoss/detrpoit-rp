/** Центральная позиция тюрьмы (от неё будет исходить радиус передвижения заключенного по тюрьме) */
export const PRISON_CENTER_POSITION: Vector3Mp = new mp.Vector3(1690.39, 2584.47, 53.91);

/** Радиус тюрьмы по которому можно передвигаться */
export const PRISON_RADIUS: number = 150;

/** Сколько минут добавляется за попытку побега */
export const PRISON_MINUTES_FOR_RUN: number = 5;

/** Место куда телепортирует игрока после освобождения */
export const PRISON_FREE_POSITION: Vector3Mp = new mp.Vector3(1850.71, 2585.81, 45.67);

/** Меню посадки арестанта */
export const PRISON_ENTER_MENU_COORDS: Vector3Mp = new mp.Vector3(1690.37, 2582.35, 44.68);

/** Срок в секундах за одну звезду розыска */
export const PRISON_TIME_FOR_WANTED_LEVEL: number = 600;

/** Госпиталь позиция респавна */
export const PRISON_HOSPITAL_RESPAWN_POS: Vector3Mp[] = [
    new mp.Vector3(1600.58, 2499.33, 45.97),
    new mp.Vector3(1667.21, 2523.94, 45.56),
    new mp.Vector3(1596.09, 2493.60, 45.97),
    new mp.Vector3(1592.84, 2491.34, 45.97),
    new mp.Vector3(1590.11, 2488.52, 45.97),
]

/** Позиция шейпа госпиталя */
export const PRISON_HOSPITAL_SHAPE_POS: Vector3Mp = new mp.Vector3(1604.65, 2486.50, 45.97);

/** Время, которое игрок проведёт в тюремном госпитале, перед тем как сможет выйти из него (минуты) */
export const PRISON_HOSPITAL_TIME: number = 1;


/** Радиус госпиталя  */
export const PRISON_HOSPITAL_SHAPE_RADIUS: number = 50;

/** Места спавна игрока в тюрьме */
export const PRISON_SPAWN_POSITIONS: Vector3Mp[] = [
    new mp.Vector3(1717.57, 2460.03, 50.00),
    new mp.Vector3(1674.69, 2438.89, 45.98),
    new mp.Vector3(1678.24, 2438.53, 45.98),
    new mp.Vector3(1681.79, 2438.85, 45.98),
    new mp.Vector3(1685.53, 2438.60, 45.98),
    new mp.Vector3(1689.37, 2438.70, 45.98),
    new mp.Vector3(1692.87, 2438.52, 45.98),
    new mp.Vector3(1696.64, 2438.63, 45.98),
    new mp.Vector3(1700.57, 2438.75, 45.98),
    new mp.Vector3(1704.11, 2438.23, 45.98),
    new mp.Vector3(1707.78, 2438.66, 45.98),
    new mp.Vector3(1711.75, 2438.47, 45.98),
    new mp.Vector3(1717.31, 2445.07, 45.98),
    new mp.Vector3(1717.33, 2448.73, 45.98),
    new mp.Vector3(1717.10, 2452.48, 45.98),
    new mp.Vector3(1717.09, 2456.13, 45.98),
    new mp.Vector3(1717.27, 2460.03, 45.98),
    new mp.Vector3(1668.40, 2445.02, 45.98),
    new mp.Vector3(1668.38, 2448.63, 45.98),
    new mp.Vector3(1668.32, 2452.37, 45.98),
    new mp.Vector3(1668.37, 2456.10, 45.98),
]

/** Сколько получает гос. служащий за арест */
export const PRISON_ARREST_MONEY = 100;

/** Мужская форма заключенного */
export const PRISONER_DRESS_MALE: [number, number, number][] = [
    [3, 1, 0],
    [8,15,0],
    [6,1,1],
    [4,258,0],
    [11,621,0]

]

/** Женская форма заключенного */
export const PRISONER_DRESS_FEMALE: [number, number, number][] = [
    [3, 1, 0],
    [4,275,0],
    [6,3,0],
    [8,2,0],
    [11,628,0]
]

/** Сколько сокращается времени в секундах за одну мини игру */
export const TASKS_TIME_DELETE: number = 8;

/** Место, где едят заключенные */
export const PRISON_KITCHEN_EAT = new mp.Vector3(1629.69, 2463.40, 44.97);

/** Место, где пьют заключенные */
export const PRISON_KITCHEN_DRINK = new mp.Vector3(1633.54, 2467.83, 44.97);


/** Раз во сколько минут можно пользоваться кухней */
export const PRISON_KITCHEN_EATING: number = 5;

/** КД в секундах на взятие задания */
export const PRISON_TASKS_CD: number = 300;

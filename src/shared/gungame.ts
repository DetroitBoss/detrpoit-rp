/** Точка регистрации гангейма */
import {weapon_hashes} from "./anticheat";

export const DEATHMATH_POS = new mp.Vector3(-265.65, -2017.96, 29.15);
export const DEATHMATH_MARKER_PARAM = {
    type: 27,
    radius: 2,
    color: <[number, number, number, number]>[255, 0, 0, 120]
}
/** Угол поворота у точки регистрации (для корректного выхода из режима) */
export const DEATHMATH_HEADING = 236;
/** Максимальная ставка */
export const DEATHMATH_LIMIT_BET_MAX = 5000
/** Название системы*/
export const DEATHMATH_NAME = 'Поединки';
export const DEATHMATH_MAPS:{
    /** Название карты */
    name: string,
    /** Центр карты, {@link center.r Радиус} указывает границу зоны, выйдя за которую игрок погибает.<hr/> {@link spawnPoints Точки спавна} должны быть указаны в пределах этого радиуса */
    center: {x: number, y: number, z: number, r: number},
    /** Точки, в которых игрок может спавнится. Чем больше точек - тем выше шанс что игрок заспавнится не перед кем то. Их должно быть НЕ МЕНЕЕ чем указано в {@link DEATHMATH_MAX_PLAYERS}*/
    spawnPoints: {
        x: number,
        y: number,
        z: number,
        /** Улог поворота */
        h: number,
        /** Радиус спавна. Если не указать - игрок будет спавнится чётко в указанной позиции. Если же указать - то игрок может быть заспавлен с небольшим расбросом по оси {@link x X} и {@link y Y}. Координата {@link z Z} всегда остаётся статичной */
        r?:number
    }[]
}[] = [
        {name: "Лагерь альтруистов", center: {x: -1120.00, y: 4922.87, z: 218.31, r:50}, spawnPoints: [

        {x:-1153.24,y:4908.54,z:219.78,h:299},
        {x:-1112.37,y:4952.74,z:218.56,h:205},
        {x:-1097.66,y:4955.95,z:218.32,h:248},
        {x:-1097.05,y:4947.81,z:218.35,h:169},
        {x:-1109.29,y:4895.89,z:216.10,h:238},
        {x:-1121.18,y:4897.03,z:217.13,h:56},
        {x:-1142.47,y:4894.40,z:218.35,h:268},
        {x:-1171.89,y:4892.53,z:215.12,h:248},
        {x:-1126.91,y:4872.07,z:212.56,h:231},
        {x:-1112.39,y:4868.13,z:214.43,h:276},
        {x:-1100.74,y:4870.56,z:216.06,h:318},
        {x:-1083.33,y:4878.31,z:216.51,h:288},
        {x:-1074.12,y:4883.88,z:215.79,h:328},
        {x:-1061.27,y:4897.87,z:212.47,h:344},
        {x:-1061.60,y:4906.65,z:211.69,h:357},
        {x:-1068.40,y:4917.34,z:212.93,h:34},
        {x:-1068.21,y:4925.29,z:211.99,h:354},
        {x:-1076.32,y:4930.35,z:212.78,h:61},
        {x:-1132.54,y:4947.06,z:222.27,h:121},
        {x:-1136.49,y:4941.77,z:222.27,h:170},
        {x:-1150.02,y:4940.81,z:222.27,h:231},
        {x:-1164.53,y:4929.66,z:223.25,h:173},
        {x:-1168.56,y:4916.73,z:222.15,h:158}]},

    {name: "Свалка самолётов", center: {x: 2393.20, y: 3092.34, z: 48.15, r:50}, spawnPoints: [
        {x:2430.30,y:3106.33,z:48.15,h:293},
        {x:2419.74,y:3115.56,z:48.23,h:71},
        {x:2407.95,y:3136.30,z:48.17,h:95},
        {x:2389.38,y:3126.38,z:48.15,h:172},
        {x:2359.52,y:3138.61,z:48.21,h:165},
        {x:2343.32,y:3124.68,z:48.21,h:188},
        {x:2354.80,y:3122.69,z:48.21,h:327},
        {x:2360.19,y:3126.53,z:48.21,h:280},
        {x:2363.23,y:3079.24,z:48.16,h:208},
        {x:2351.09,y:3050.97,z:48.15,h:192},
        {x:2372.78,y:3047.07,z:48.19,h:295},
        {x:2398.39,y:3051.65,z:48.74,h:302},
        {x:2422.72,y:3059.37,z:48.98,h:20},
        {x:2432.47,y:3130.20,z:48.17,h:50},
        {x:2427.03,y:3155.79,z:48.15,h:55},
        {x:2418.66,y:3155.64,z:48.59,h:106},
        {x:2410.07,y:3152.48,z:48.34,h:215},
        {x:2331.65,y:3061.43,z:48.50,h:267},
        {x:2407.95,y:3032.31,z:48.15,h:28},
        {x:2421.16,y:3040.78,z:48.15,h:54}
    ]},

    {name: "Бараки в Сенди Шорс", center: {x: 76.57, y: 3691.32, z: 39.70, r:50}, spawnPoints: [
        {x:59.50,y:3756.86,z:39.71,h:114},
        {x:39.82,y:3751.87,z:39.64,h:113},
        {x:27.84,y:3748.71,z:39.63,h:133},
        {x:24.74,y:3741.73,z:39.67,h:284},
        {x:15.43,y:3735.60,z:39.65,h:95},
        {x:8.86,y:3735.40,z:42.79,h:149},
        {x:6.00,y:3731.29,z:44.00,h:139},
        {x:-2.29,y:3721.74,z:39.49,h:148},
        {x:-8.58,y:3709.59,z:39.28,h:175},
        {x:0.33,y:3698.85,z:39.49,h:264},
        {x:3.84,y:3687.41,z:39.56,h:211},
        {x:9.22,y:3681.31,z:39.67,h:216},
        {x:13.08,y:3663.51,z:40.07,h:151},
        {x:14.31,y:3651.21,z:40.41,h:263},
        {x:31.55,y:3656.64,z:39.75,h:273},
        {x:45.58,y:3656.38,z:39.73,h:286},
        {x:55.66,y:3660.17,z:39.67,h:293},
        {x:70.75,y:3672.76,z:39.69,h:5},
        {x:78.47,y:3676.59,z:39.69,h:264},
        {x:93.78,y:3682.33,z:39.63,h:276},
        {x:106.09,y:3688.08,z:39.75,h:295},
        {x:115.15,y:3693.37,z:39.64,h:18},
        {x:107.32,y:3707.79,z:39.82,h:20},
        {x:112.49,y:3732.61,z:39.74,h:6},
        {x:107.62,y:3736.91,z:39.73,h:101}
        ,{x:101.33,y:3748.69,z:39.74,h:64},
        {x:97.54,y:3751.93,z:40.73,h:158},
        {x:87.33,y:3757.49,z:39.75,h:145},
        {x:69.97,y:3724.44,z:39.73,h:178},
        {x:65.77,y:3706.46,z:39.75,h:150},
        {x:44.69,y:3694.48,z:39.75,h:66},
        {x:41.66,y:3722.38,z:39.54,h:320}
        
    ]},

    {name: "Фонтан (Быстрая карта)", center: {x: 288.34, y: -1601.21, z: 31.27, r:50}, spawnPoints: [
        {x:288.34,y:-1601.21,z:31.27,h:220},
        {x:298.72,y:-1608.34,z:30.53,h:305}
        ,{x:296.91,y:-1591.15,z:30.53,h:40},
        {x:284.27,y:-1589.07,z:30.53,h:106},
        {x:279.19,y:-1608.41,z:30.53,h:226},
        {x:263.69,y:-1620.84,z:27.07,h:51},
        {x:269.81,y:-1628.44,z:26.83,h:250},
        {x:280.98,y:-1632.85,z:27.34,h:222},
        {x:297.92,y:-1568.80,z:29.14,h:254},
        {x:304.96,y:-1570.10,z:29.29,h:223},
        {x:314.04,y:-1574.68,z:29.70,h:24},
        {x:322.71,y:-1585.69,z:29.29,h:220},
        {x:330.92,y:-1591.55,z:29.29,h:242},
        {x:336.53,y:-1595.24,z:29.32,h:214},
        {x:341.27,y:-1600.92,z:29.29,h:43},
        {x:328.02,y:-1616.54,z:32.53,h:140},
        {x:325.10,y:-1619.94,z:32.53,h:140},
        {x:320.94,y:-1624.85,z:32.53,h:140},
        {x:315.72,y:-1631.00,z:32.53,h:140},
        {x:310.53,y:-1637.12,z:32.53,h:140},
        {x:309.14,y:-1642.40,z:32.53,h:234},
        {x:309.34,y:-1646.62,z:32.53,h:206},
        {x:298.78,y:-1643.13,z:32.53,h:14}
        
    ]}
    

]

/** Игровые режимы гангейма */
export const enum DEATHMATH_MODE {
    /** Обычный режим, в нём идёт победа наступает у того, кто первый сделает указанное количество убийств */
    DEFAULT = 0,
    /** Режим с прогрессией. В нём игроку после каждого убийства будет выдаватся новое оружие. Победа наступает тогда, когда игрок первым убивает с последнего оружия ({@link DEATHMATH_GUNGAME_WEAPONS список - DEATHMATH_GUNGAME_WEAPONS}) */
    GUNGAME = 1,
    /** Такой же ДМ, только после смерти даётся случайное оружие */
    RANDOM = 2,
    /** Такой же ДМ, только разделение проходит на 2 команды */
    TEAM = 3,
}
/** Сколько регена давать при убийстве, если включено */
export const DEATHMATH_REGEN_POINTS = 50;
export const DEATHMATH_MODE_NAMES = ["DeathMath (Обычный)", "GunGame", "DeathMath (Случайное оружие)", "Командный ДМ (Обычный)"]
/** Сколько игроков максимум может принять участие */
export const DEATHMATH_MAX_PLAYERS = 20;
/** Этот параметр отвечает за то, сколько можно указать необходимого количества убийств чтобы игра завершилась. Хост указывает этот параметр самостоятельно */
export const DEATHMATH_KILLS_LIMITS = [5, 100];
/** Сколько процентов мы забираем из банка в никуда */
export const DEATHMATH_REWARD_GRAB = 10;
/** Сколько процентов заберёт третье место */
export const DEATHMATH_REWARD_3 = 10;
/** Сколько процентов заберёт второе место */
export const DEATHMATH_REWARD_2 = 10;
//////////////////////////////////////////////
//TODO Блок с командами

/** Название первой команды */
export const DEATHMATH_TEAM_1_NAME = 'Красная';
/** Мужская одежда первой команды */
export const DEATHMATH_DRESS_MALE_TEAM_1 = <[number, number, number][]>[
    [0,0,0],
    [1,0,0],
    [3,1,0],
    [4,88,10],
    [5,0,0],
    [6,7,10],
    [7,0,0],
    [8,15,0],
    [9,0,0],
    [10,0,0],
    [11,14,0],
    [100,0,0],
    [101,0,0],
    [102,0,0]
];
/** Мужская одежда второй команды */
export const DEATHMATH_DRESS_MALE_TEAM_2 = <[number, number, number][]>[
    [0,0,0],
    [1,0,0],
    [3,1,0],
    [4,117,0],
    [5,0,0],
    [6,7,9],
    [7,0,0],
    [8,15,0],
    [9,0,0],
    [10,0,0],
    [11,14,9],
    [100,0,0],
    [101,0,0],
    [102,0,0]
];

export interface IGunGameLobbySettings {
    map: number
    name: string
    mode: DEATHMATH_MODE
    password: string
    weapon: number
    kills: number
    bet: number
    armour: boolean
    regen: boolean
}

export interface IGunGameSession {
    id: number, // идентификатор
    name: string,
    type: "deathmatch" | "gungame" | "teamfight",
    btnType: "cancel" | "connect" | "create",
    place: number,
    online: number,
    maxPlayers: number,
    price: number,
    time: string,
    password: boolean
}

export interface IGunGameLobbySettings {
    map: number
    name: string
    mode: DEATHMATH_MODE 
    password: string
    weapon: number
    kills: number 
    bet: number
    armour: boolean 
    regen: boolean
}

/** Название второй команды */
export const DEATHMATH_TEAM_2_NAME = 'Синяя';
/** Женская одежда первой команды */
export const DEATHMATH_DRESS_FEMALE_TEAM_1 = <[number, number, number][]>[
[0,0,0],
[1,0,0],
[3,0,0],
[4,16,6],
[5,0,0],
[6,0,0]
,[7,0,0]
,[8,2,0],
[9,0,0],
[10,0,0],
[11,121,6],
[100,0,0],
[101,0,0],
[102,0,0]];
/** Женская одежда второй команды */
export const DEATHMATH_DRESS_FEMALE_TEAM_2 = <[number, number, number][]>[[0,0,0],
[0,0,0],
[1,0,0],
[3,0,0],
[4,16,7],
[5,0,0],
[6,0,0]
,[7,0,0]
,[8,2,0],
[9,0,0],
[10,0,0],
[11,121,11],
[100,0,0],
[101,0,0],
[102,0,0]];

//////////////////////////////////////////////
/** Список доступного оружия для GUNGAME режима */
export const DEATHMATH_GUNGAME_WEAPONS:{
    /** Модель оружия. {@link DUELS_WEAPON Пример} есть в файле <b>/duels.ts</b>*/
    weapon: string,
    /** Название оружия */
    name: string,
    /** Сколько убийств нужно выполнить с него чтобы перейти к следующему оружия (ну либо победить, если это последнее оружие в списке) */
    kills: number,
}[] = [{weapon: 'weapon_machinepistol', name: 'Machine Pistol', kills:2},
    {weapon: 'weapon_combatpdw', name: 'Combat PDW', kills:2},
    {weapon: 'weapon_smg', name: 'MP5K', kills:3},
    {weapon: 'weapon_musket', name: 'Musket', kills:1},
    {weapon: 'weapon_dbshotgun', name: 'Double Barrel Shotgun', kills:1},
    {weapon: 'weapon_heavyshotgun', name: 'Сайга', kills:2},
    {weapon: 'weapon_bullpuprifle_mk2', name: 'Bullpup Rifle Mk II', kills:2},
    {weapon: 'weapon_militaryrifle', name: 'Military Rifle', kills:2},
    {weapon: 'weapon_carbinerifle', name: 'HK-416', kills:3},
    {weapon: 'weapon_assaultrifle_mk2', name: 'Assault Rifle Mk II', kills:4},
    {weapon: 'weapon_sniperrifle', name: 'Sniper Rifle', kills:1},
    // {weapon: 'weapon_heavysniper_mk2', name: 'Heavy Sniper Mk II', kills:3},
    {weapon: 'weapon_mg', name: 'Печенег', kills:3},
    {weapon: 'weapon_combatmg_mk2', name: 'Combat MG Mk II', kills:4},
    {weapon: 'weapon_pistol50', name: 'Pistol .50', kills:1},
    // {weapon: 'weapon_vintagepistol', name: 'Vintage Pistol', kills:2},
    {weapon: 'weapon_revolver_mk2', name: 'Револьвер', kills:3},
    {weapon: 'weapon_switchblade', name: 'Нож', kills:1}
].filter(q => weapon_hashes.find(z => z[0].toLowerCase() === q.weapon.toLowerCase()))

/** Список доступного оружия для DEATHMATH режима */
export const DEATHMATH_DM_WEAPONS:{
    /** Модель оружия. {@link DUELS_WEAPON Пример} есть в файле <b>/duels.ts</b>*/
    weapon: string,
    /** Название оружия */
    name: string,
}[] = [
    {weapon: 'weapon_machinepistol', name: 'Machine Pistol'},
    {weapon: 'weapon_combatpdw', name: 'Combat PDW'},
    {weapon: 'weapon_smg', name: 'MP5K'},
    {weapon: 'weapon_musket', name: 'Musket'},
    {weapon: 'weapon_dbshotgun', name: 'Double Barrel Shotgun'},
    {weapon: 'weapon_heavyshotgun', name: 'Сайга'},
    {weapon: 'weapon_bullpuprifle_mk2', name: 'Bullpup Rifle Mk II'},
    {weapon: 'weapon_militaryrifle', name: 'Military Rifle'},
    {weapon: 'weapon_carbinerifle', name: 'HK-416'},
    {weapon: 'weapon_assaultrifle_mk2', name: 'Assault Rifle Mk II'},
    {weapon: 'weapon_sniperrifle', name: 'Sniper Rifle'},
    // {weapon: 'weapon_heavysniper_mk2', name: 'Heavy Sniper Mk II'},
    {weapon: 'weapon_mg', name: 'Печенег'},
    {weapon: 'weapon_combatmg_mk2', name: 'Combat MG Mk II'},
    {weapon: 'weapon_pistol50', name: 'Pistol .50'},
    // {weapon: 'weapon_vintagepistol', name: 'Vintage Pistol'},
    {weapon: 'weapon_revolver', name: 'Револьвер'},
].filter(q => weapon_hashes.find(z => z[0].toLowerCase() === q.weapon.toLowerCase()))
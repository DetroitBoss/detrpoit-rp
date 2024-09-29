import {CONSTRUCTION_REGISTER_POS} from "./construction";

export interface ISafeZone {
    x: number,
    y: number,
    z: number,
    r: number,
    disabled?: boolean,
    disableLockSpeed?: boolean
}

export const safeZones: ISafeZone[] = [
    // Ремонт квартир
    {x: CONSTRUCTION_REGISTER_POS.x, y: CONSTRUCTION_REGISTER_POS.y, z: CONSTRUCTION_REGISTER_POS.z, r: 20},
    // Maze Arena
    {x:-261.15,y:-2025.24,z:30.15,r:50},
    // Arcadius
    {x:-116.84,y:-605.05,z:36.28,r:50, disableLockSpeed:true},
    // Maze Bank
    {x:-66.51,y:-802.07,z:44.23,r:50, disableLockSpeed:true},
    // Городская больница
    {x:359.9,y:-590.07,z:28.23,r:100},
    // Тюрьма
    {x:1692.77,y:2603.04,z:45.56,r:180},
    // Порт (Дальнобои)
    {x:978.22,y:-3114.71,z:5.90,r:320, disableLockSpeed:true},
    // Автосалон PDM
    {x:-40.70,y:-1097.67,z:26.42,r:20, disableLockSpeed:true},
    // Элитный автосалон
    {x:-94.41,y: 84.65,z:71.67,r:40, disableLockSpeed:true},
    // Аукцион
    {x:478.74,y: -107.67,z:62.16,r:50, disableLockSpeed:true},
    // Обсерватория
    {x:-422.88,y:1135.57,z:325.85,r:100, disableLockSpeed:true},
    // Comedy club
    {x:-430.16, y:258.72, z:83.01, r:40, disableLockSpeed:true},
    // Бар Tequila (Западный вайнвуд)
    {x:-552.77, y:272.35, z:83.02, r:30, disableLockSpeed:true},
    // Galaxy club
    {x:-26.29, y:215.28, z:106.52, r:40, disableLockSpeed:true},
    // Vanila club
    {x:128.42, y:-1301.55, z:28.98, r:50, disableLockSpeed:true},
    // Инкассаторы
    {x:470.07, y:-1093.59, z:29.20, r:30, disableLockSpeed:true},
    //LSPD
    {x:454.48, y:-990.5, z:30.69, r:50},
    // Шериф Департамент в Сенди Шорс
    {x:1849.89, y:3688.99, z:34.27, r:40},
    // Шериф Департамент в Палето Бей
    {x:-446.30, y:6010.08, z:31.72, r:55},
    // USMC Garderob
    { x: -2343.30, y: 3264.50, z: 32.83, r:40},
    // Правительство
    { x: -527.33, y: -234.79, z: 37.92, r:90, disableLockSpeed: true},
    // Стройка
    { x: -461.84, y: -934.61, z: 29.39, r:110},
    // Клининг служба
    { x: -1535.37, y: -446.94, z: 35.59, r:55},
    // Сад
    { x: 2362.42, y: 5005.26, z: 43.45, r:200},
    //Life invader
    { x: -1076.30, y: -249.02, z: 44.02, r:70, disableLockSpeed:true},
    // Болька Палето
    { x: -251.44, y: 6320.88, z: 32.43, r:100},
    // Гараж Тони
    { x: 1955.67, y: 5181.91, z: 48.00, r:80},
    // Джеффри порт
    { x: -1061.80, y: -864.20, z: 4.91, r:80, disableLockSpeed:true},
    // Стэнли 
    { x: 19.46, y: -1302.21, z: 29.07, r:120},
    // Автошкола
    {x: -710.38, y: -1301.52, z: 5.11, r:30},
    // Авторынок
    {x: -1644.87, y: -901.33, z: 8.71, r:100},
    // ZZ Life Invader
    {x: -1090.62, y: -308.06, z: 37.65, r:30, disableLockSpeed:true},
    // Карьер
    {x: 2951.63, y: 2788.09, z: 41.32, r:50},
    // Клуб Багама
    {x: -1388.05, y: -618.52, z: 30.82, r:70, disableLockSpeed:true},
    // Рядом с болькой в ЛС
    {x: 226.99, y: -569.75, z: 43.87, r:50},
    // Церковь сенди
    {x: -317.26, y: 2809.21, z: 59.45, r:50},
    // Церковь город
    {x: -1674.16, y: -286.04, z: 51.89, r:50, disableLockSpeed:true},
    // Weazel News
    {x: -599.89, y: -930.32, z: 23.86, r:50, disableLockSpeed:true},
    // leopolds
    {x: -714.23, y: -366.43, z: 34.48, r:30, disableLockSpeed:true},
    // Sandy шорс
    {x: 1999.79, y: 3717.12, z: 32.17, r:40},
    // Paleto Bay
    {x: 145.06, y: 6415.19, z: 31.25, r:40},
    // Electrion work
    {x: 699.39, y: 129.79, z: 80.75, r:40},
    // Busman work
    {x: 422.42, y: -631.60, z: 28.50, r:40},
    // Haloween
    {x: 1661.92, y: 3660.42, z: 36.84, r:40},
    // Морг
    {x: 263.59, y: -1353.16, z: 24.54, r:40, disableLockSpeed:true},

    {x:1791.33,y:4985.50,z:53.04, r:65, disableLockSpeed:true},
    {x:1879.36,y:5065.63,z:53.88, r:65, disableLockSpeed:true},
    {x:2133.09,y:5172.37,z:56.58, r:65, disableLockSpeed:true},
    {x:1897.51,y:4852.31,z:50.30, r:65, disableLockSpeed:true},
    {x:1976.37,y:4827.43,z:49.97, r:65, disableLockSpeed:true},
    {x:1928.89,y:4777.54,z:45.98, r:65, disableLockSpeed:true},
    {x:2021.08,y:4892.17,z:44.31, r:65, disableLockSpeed:true},
    {x:2055.19,y:4926.50,z:42.32, r:65, disableLockSpeed:true},
    {x:2153.11,y:5000.13,z:43.89, r:65, disableLockSpeed:true},
    {x:2170.77,y:4966.70,z:47.17, r:65, disableLockSpeed:true},
    {x:2226.93,y:4912.58,z:43.41, r:65, disableLockSpeed:true},
    {x:2249.19,y:4777.68,z:46.31, r:65, disableLockSpeed:true},
    {x:2436.82,y:4766.08,z:36.09, r:65, disableLockSpeed:true},
    {x:2504.63,y:4837.58,z:38.47, r:65, disableLockSpeed:true},
    {x:2851.70,y:4630.57,z:51.69, r:65, disableLockSpeed:true},
    // Рынок
    {x: -1608.25, y: -1066.29, z: 13.0, r:40},
    // Риелторка город
    {x: -1011.18, y: -731.96, z: 21.53, r:40},
    // Риелторка сенди
    {x: 1931.86, y: 3720.24, z: 32.870, r:40},
    // Риелторка палето
    {x: -45.64, y: 6473.98, z: 31.46, r:40},
    // Мебельный магазин
    {x: 2751.41, y: 3460.18, z: 55.91, r:40},
    // Бойцовский клуб
    {x: 602.50, y: -436.08, z: 24.76, r:40},
    // Рыбалка номер 9
    {x: -1840.60, y: -1248.45, z: 8.62, r:40},

];

export const REDZONE_POSITIONS: {x: number, y: number, z: number, r: number}[] = [
    {x: 0, y: 0, z: 0, r: 0}
];
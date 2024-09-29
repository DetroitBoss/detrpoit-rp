export interface FishPositionItem {
    /** ID Блипа, если требуется. Метка будет отображена в центральной точке между всеми координатам. Если координата будет одна - то (прям очевидно) будет отображена на ней */
    blip?: number,
    /** Название зоны */
    name: string,
    /** Зоны точек рыбалок */
    pos: {
        /** Координата X */
        x: number,
        /** Координата Y */
        y: number,
        /** Координата Z */
        z: number,
        /** Угол поворота, если необходим. Он полезен если при сценарии игрока стоит повернуть на нужный угол, например если речь идёт о пирсе */
        h?: number
    }[],
    /** Радиус действия точек. Лучше ставить не менее 1. Если больше 3 - то визуального маркера не будет */
    r: number,
    /** Требуется ли лицензия чтобы добывать в данной зоне */
    needLicense?: boolean,
}
export const FISH_POS: FishPositionItem[] = [
    { name: "Зона для рыбалки", blip: 68, pos: [{ x: -3011.56, y: -1566.88, z: 7.89 }], r: 200},
    { name: "Зона для рыбалки", blip: 68, pos: [{ x: -2142.46, y: 6012.10, z: 1.34}], r: 200},
    { name: "Зона для рыбалки", blip: 68, pos: [{x: 3737.39, y: -1355.64, z: 0.57}], r: 200},
    
    { name: "Зона для рыбалки", blip: 68, pos: [{x: 5711.55, y: 4335.23, z: 0.32}], r: 500, needLicense: true },
    { name: "Зона для рыбалки", blip: 68, pos: [{ x: 4111.53, y: 1330.25, z: 2.15}], r: 500, needLicense: true },

    { name: "Зона для рыбалки", blip: 68, pos: [{x: 713.55, y: 4092.29, z: 33.73, h: 180},{x: 711.50, y: 4098.92, z: 34.79, h: 95},{x: 711.49, y: 4102.94, z: 34.79, h: 88} ], r: 4, needLicense: true },

    { name: "Зона для рыбалки", blip: 68,  pos: [{x: 1340.74, y: 4225.07, z: 32.92, h: 259},{x: 1307.48, y: 4230.05, z: 32.92, h: 197},{x: 1314.63, y: 4228.90, z: 32.92, h: 167},{x: 1321.88, y: 4227.48, z: 32.92, h: 168},{x: 1329.04, y: 4226.06, z: 32.92, h: 172},{x: 1336.22, y: 4224.81, z: 32.92, h: 170},{x: 1335.87, y: 4227.85, z: 32.92, h: 357}], r: 2, needLicense: true },

    { name: "Зона для рыбалки", blip: 68, pos: [{x: -3416.11, y: 951.86, z: 7.35, h: 182},{x: -3428.34, y: 977.75, z: 7.35, h: 88},{x: -3428.34, y: 970.21, z: 7.35, h: 77},{x: -3428.34, y: 962.00, z: 7.35, h: 93},{x: -3428.34, y: 954.82, z: 7.35, h: 92},{x: -3422.40, y: 951.81, z: 7.35, h: 181}], r: 2, needLicense: true },

    { name: "Зона для рыбалки", blip: 68, pos: [{x: -1823.14, y: -1266.26, z: 7.62, h: 230},{x: -1863.00, y: -1234.52, z: 7.62, h: 53},{x: -1862.89, y: -1239.84, z: 7.62, h: 121},{x: -1857.89, y: -1244.03, z: 7.62, h: 140},{x: -1852.83, y: -1248.27, z: 7.62, h: 155},{x: -1846.80, y: -1253.46, z: 7.62, h: 136},{x: -1840.41, y: -1258.69, z: 7.62, h: 143},{x: -1840.41, y: -1258.69, z: 7.62, h: 143},{x: -1834.39, y: -1263.74, z: 7.62, h: 141},{x: -1829.51, y: -1267.73, z: 7.62, h: 145}], r: 2, needLicense: true },

    { name: "Зона для рыбалки", blip: 68, pos: [{x: -69.07, y: -2779.93, z: 5.08, h: 189}, {x: -95.70, y: -2774.02, z: 5.08, h: 180}, {x: -92.70, y: -2774.21, z: 5.08, h: 176}, {x: -97.40, y: -2769.51, z: 5.08, h: 84}, {x: -97.28, y: -2764.29, z: 5.08, h: 99}, {x: -97.31, y: -2761.66, z: 5.08, h: 92}, {x: -69.90, y: -2776.86, z: 5.08, h: 118}, {x: -42.03, y: -2777.92, z: 0.62, h: 183}, {x: -18.90, y: -2763.88, z: 5.09, h: 183}, {x: 16.51, y: -2801.71, z: 1.53, h: 178}, {x: 11.00, y: -2801.53, z: 1.53, h: 131}, {x: 23.85, y: -2807.71, z: 4.70, h: 175}, {x: 46.01, y: -2794.05, z: 4.72, h: 179}, ], r: 2, needLicense: true },

    { name: "Зона для рыбалки", blip: 68, pos: [ {x:105.81,y:-3324.24,z:5.02,h:91},{x:105.84,y:-3309.31,z:5.07,h:102},{x:106.17,y:-3303.51,z:5.35,h:93},{x:105.38,y:-3292.67,z:5.05,h:90},{x:106.09,y:-3275.29,z:5.00,h:94},{x:105.30,y:-3260.24,z:5.06,h:91},{x:105.94,y:-3249.36,z:5.00,h:92},{x:106.09,y:-3227.07,z:5.00,h:94},{x:106.10,y:-3220.55,z:5.00,h:87},{x:105.36,y:-3205.92,z:5.02,h:92},{x:106.28,y:-3195.47,z:5.00,h:89},{x:105.98,y:-3184.21,z:5.00,h:93},{x:106.10,y:-3177.02,z:5.00,h:85},{x:106.17,y:-3168.97,z:5.00,h:92},{x:106.37,y:-3156.50,z:5.00,h:94},{x:106.05,y:-3151.47,z:5.00,h:94},{x:106.25,y:-3145.13,z:5.00,h:87},{x:106.22,y:-3140.42,z:5.00,h:104},{x:106.39,y:-3133.16,z:5.00,h:84},{x:106.50,y:-3128.43,z:5.00,h:96},{x:106.77,y:-3124.36,z:5.00,h:90},{x:106.62,y:-3113.62,z:5.00,h:93},{x:106.57,y:-3106.63,z:5.00,h:72},{x:106.67,y:-3100.68,z:5.00,h:92},{x:106.55,y:-3092.25,z:5.00,h:96},{x:106.45,y:-3086.52,z:5.00,h:93},{x:106.32,y:-3075.99,z:5.00,h:97},{x:106.53,y:-3069.42,z:5.00,h:100},{x:106.25,y:-3063.44,z:5.00,h:93},{x:106.40,y:-3052.31,z:5.00,h:88},{x:106.51,y:-3043.70,z:5.00,h:91},{x:106.45,y:-3036.91,z:5.00,h:96},{x:106.66,y:-3031.83,z:5.00,h:86},{x:106.56,y:-3027.08,z:5.00,h:89},{x:106.81,y:-3021.70,z:5.00,h:90},{x:106.49,y:-3014.59,z:5.00,h:89} ], r: 2, needLicense: true },

    { name: "Зона для рыбалки", blip: 68, pos: [ {x:467.74,y:-3362.82,z:5.07,h:90},{x:467.72,y:-3368.88,z:5.07,h:86},{x:467.58,y:-3375.53,z:5.07,h:88},{x:467.71,y:-3384.09,z:5.07,h:90},{x:467.87,y:-3389.94,z:5.07,h:179},{x:480.62,y:-3390.11,z:5.07,h:174},{x:487.32,y:-3390.12,z:5.07,h:177},{x:492.02,y:-3390.07,z:5.07,h:186},{x:504.46,y:-3389.96,z:5.07,h:182},{x:510.54,y:-3389.92,z:5.07,h:225},{x:510.87,y:-3384.66,z:5.07,h:279},{x:510.68,y:-3380.40,z:5.07,h:268},{x:510.58,y:-3375.23,z:5.07,h:270} ], r: 2, needLicense: true },

    { name: "Зона для рыбалки", blip: 68, pos: [{x:1298.30,y:-3349.26,z:4.90,h:269},{x:1298.25,y:-3340.50,z:4.90,h:272},{x:1298.20,y:-3336.00,z:4.90,h:265},{x:1298.18,y:-3330.49,z:4.91,h:275},{x:1299.41,y:-3325.88,z:5.00,h:265},{x:1298.06,y:-3321.04,z:4.91,h:277},{x:1298.11,y:-3315.77,z:4.91,h:266},{x:1298.18,y:-3311.16,z:4.91,h:271},{x:1298.15,y:-3305.59,z:4.91,h:268},{x:1298.44,y:-3299.24,z:4.97,h:263},{x:1298.96,y:-3293.08,z:5.00,h:281},{x:1298.26,y:-3287.53,z:4.91,h:271},{x:1298.23,y:-3280.98,z:4.91,h:288},{x:1298.23,y:-3275.71,z:4.91,h:280},{x:1298.29,y:-3270.64,z:4.91,h:271},{x:1298.31,y:-3265.06,z:4.91,h:277},{x:1299.33,y:-3260.65,z:5.00,h:253},{x:1298.20,y:-3255.64,z:4.91,h:272},{x:1298.29,y:-3250.29,z:4.91,h:267},{x:1298.23,y:-3243.75,z:4.91,h:273},{x:1298.22,y:-3237.85,z:4.91,h:266},{x:1298.19,y:-3231.88,z:4.91,h:269},{x:1299.04,y:-3227.64,z:4.97,h:255},{x:1298.26,y:-3221.85,z:4.91,h:268},{x:1298.11,y:-3216.03,z:4.92,h:276},{x:1298.21,y:-3210.66,z:4.91,h:280},{x:1298.18,y:-3202.06,z:4.91,h:269},{x:1298.95,y:-3195.34,z:4.97,h:272},{x:1298.29,y:-3187.66,z:4.91,h:266},{x:1298.31,y:-3182.42,z:4.91,h:267},{x:1298.27,y:-3174.84,z:4.91,h:270},{x:1298.31,y:-3168.79,z:4.91,h:261},{x:1299.01,y:-3162.46,z:4.97,h:272},{x:1298.22,y:-3154.29,z:4.91,h:262},{x:1298.31,y:-3147.89,z:4.91,h:270},{x:1298.33,y:-3140.60,z:4.91,h:263},{x:1299.50,y:-3130.19,z:4.97,h:272},{x:1298.13,y:-3124.80,z:4.91,h:278},{x:1298.20,y:-3119.64,z:4.91,h:281},{x:1298.26,y:-3115.06,z:4.93,h:276},{x:1298.08,y:-3109.54,z:4.93,h:276},{x:1298.32,y:-3104.64,z:4.91,h:275},{x:1298.41,y:-3098.86,z:4.91,h:268},{x:1298.57,y:-3091.27,z:4.91,h:269},{x:1298.48,y:-3086.30,z:4.91,h:268},{x:1298.45,y:-3081.02,z:4.91,h:272},{x:1299.50,y:-3076.53,z:4.96,h:269},{x:1298.44,y:-3071.56,z:4.91,h:275},{x:1298.53,y:-3062.49,z:4.92,h:318},{x:1292.47,y:-3061.32,z:4.97,h:1} ], r: 2, needLicense: true },
]


export const FISH_HELP_TEXT = `В данной зоне можно ловить рыбу`

/** На сколько должна заполниться шкала поимки чтобы рыба поймалась */
export const FISH_CATCH_CHANCE = 75;

export enum FISHER_LEVEL {
    First = 1,
    Second,
    Third,
    Fourth,
    Fifeth
}

export const FISHER_LEVELS_EXP_TO_ACHIEVE: [FISHER_LEVEL, number][] = [
    [FISHER_LEVEL.First, 0],
    [FISHER_LEVEL.Second, 500],// 10 - кол-во опыта для достижения
    [FISHER_LEVEL.Third, 1500],
    [FISHER_LEVEL.Fourth, 5000],
    [FISHER_LEVEL.Fifeth, 10000]
]

export interface IRod {
    itemId: number
    minLevelToBuy: number
    /** Кол-во процентов, добавляемых к шансу поимки самой редкой рыбы на уровне */
    bestFishChanceIncrement: number
}

export interface IFish {
    itemId: number
    expPerCatch: number
    catchChances: Map<FISHER_LEVEL, number>
}

export const FISHES: IFish[] = [
    // Расположить по степени возрастания крутости рыбы (первой в списке самую плохую рыбу)

    // Чибак
    { itemId: 9210, expPerCatch: 1, catchChances: new Map([
            [FISHER_LEVEL.First, 60],
            [FISHER_LEVEL.Second, 50],
            [FISHER_LEVEL.Third, 10],
            [FISHER_LEVEL.Fourth, 0],
            [FISHER_LEVEL.Fifeth, 0]
        ])
    },
    
    // Окунь
    { itemId: 9212, expPerCatch: 2, catchChances: new Map([
            [FISHER_LEVEL.First, 10],
            [FISHER_LEVEL.Second, 15],
            [FISHER_LEVEL.Third, 20],
            [FISHER_LEVEL.Fourth, 20],
            [FISHER_LEVEL.Fifeth, 20]
        ])
    },

    // Щука
    { itemId: 9213, expPerCatch: 3, catchChances: new Map([
            [FISHER_LEVEL.First, 5],
            [FISHER_LEVEL.Second, 10],
            [FISHER_LEVEL.Third, 15],
            [FISHER_LEVEL.Fourth, 20],
            [FISHER_LEVEL.Fifeth, 20]
        ])
    },

    

    // Судак
    { itemId: 9214, expPerCatch: 4, catchChances: new Map([
            [FISHER_LEVEL.First, 1],
            [FISHER_LEVEL.Second, 5],
            [FISHER_LEVEL.Third, 10],
            [FISHER_LEVEL.Fourth, 15],
            [FISHER_LEVEL.Fifeth, 30]
        ])
    },

    // Карп
    { itemId: 9211, expPerCatch: 5, catchChances: new Map([
            [FISHER_LEVEL.First, 0],
            [FISHER_LEVEL.Second, 1],
            [FISHER_LEVEL.Third, 5],
            [FISHER_LEVEL.Fourth, 15],
            [FISHER_LEVEL.Fifeth, 30]
        ])
    },
    // Кижуч
    { itemId: 823, expPerCatch: 6, catchChances: new Map([
            [FISHER_LEVEL.First, 0],
            [FISHER_LEVEL.Second, 0],
            [FISHER_LEVEL.Third, 1],
            [FISHER_LEVEL.Fourth, 10],
            [FISHER_LEVEL.Fifeth, 25]
        ])
    },

    // Лосось
    { itemId: 819, expPerCatch: 7, catchChances: new Map([
            [FISHER_LEVEL.First, 0],
            [FISHER_LEVEL.Second, 0],
            [FISHER_LEVEL.Third, 1],
            [FISHER_LEVEL.Fourth, 10],
            [FISHER_LEVEL.Fifeth, 20]
        ])
    },
    // Камбала
    { itemId: 821, expPerCatch: 8, catchChances: new Map([
            [FISHER_LEVEL.First, 0],
            [FISHER_LEVEL.Second, 0],
            [FISHER_LEVEL.Third, 1],
            [FISHER_LEVEL.Fourth, 10],
            [FISHER_LEVEL.Fifeth, 15]
        ])
    },

    // Осётр
    { itemId: 822, expPerCatch: 9, catchChances: new Map([
            [FISHER_LEVEL.First, 0],
            [FISHER_LEVEL.Second, 0],
            [FISHER_LEVEL.Third, 0],
            [FISHER_LEVEL.Fourth, 10],
            [FISHER_LEVEL.Fifeth, 13]
        ])
    },
    // Фуга
    { itemId: 820, expPerCatch: 10, catchChances: new Map([
            [FISHER_LEVEL.First, 0],
            [FISHER_LEVEL.Second, 0],
            [FISHER_LEVEL.Third, 0],
            [FISHER_LEVEL.Fourth, 5],
            [FISHER_LEVEL.Fifeth, 7]
        ])
    } 
]

export const RODS: IRod[] = [
    { itemId: 855, minLevelToBuy: 0, bestFishChanceIncrement: 0 },// Обычная удочка
    { itemId: 9200, minLevelToBuy: 2, bestFishChanceIncrement: 5 },// Хорошая удочка
    { itemId: 9201, minLevelToBuy: 4, bestFishChanceIncrement: 10 },// Превосходная удочка
]

/** Время анимации рыбалки */
export const FishAnimTime = 30

export const getFisherLevelByExp = (fisherExp: number): FISHER_LEVEL => {
    //todo: refactor
    if (fisherExp == 0) return FISHER_LEVELS_EXP_TO_ACHIEVE[0][0]
    const levelToFind = FISHER_LEVELS_EXP_TO_ACHIEVE[FISHER_LEVELS_EXP_TO_ACHIEVE.findIndex(level => level[1] >= fisherExp) - 1]
    return !levelToFind || isNaN(levelToFind[0])
        ? FISHER_LEVELS_EXP_TO_ACHIEVE[FISHER_LEVELS_EXP_TO_ACHIEVE.length - 1][0]
        : levelToFind[0]
}

export const getBestAvailabelFishByLevel = (level: FISHER_LEVEL): IFish => {
    return FISHES
        .filter(f => f.catchChances.get(level) != 0)
        .sort((a: IFish, b: IFish) => { return a.expPerCatch - b.expPerCatch })[0]
}

export interface IFishPullingKey {
    keyCode: number,
    keyName: string
}

export const FISH_PULLING_KEYS: Array<[IFishPullingKey, IFishPullingKey]> = [
    [{ keyCode: 65, keyName: "A" }, { keyCode: 68, keyName: "D" }],
    [{ keyCode: 87, keyName: "W" }, { keyCode: 68, keyName: "D" }],
    [{ keyCode: 65, keyName: "A" }, { keyCode: 88, keyName: "X" }],
    [{ keyCode: 83, keyName: "S" }, { keyCode: 68, keyName: "D" }],
    [{ keyCode: 83, keyName: "S" }, { keyCode: 88, keyName: "X" }],
]
import {componentsFemale, componentsMale} from "./clothesData"

export const clothShopNames = ["Магазин одежды", "Магазин одежды", "Магазин одежды", "Магазин одежды", "Эксклюзивная одежда"];

export const CLOTH_VARIATION_ID_MULTIPLER = 10000000

export const getPartName = (id: number) => {
    let res = ""
    switch (id) {
        case 1:
            res = "Маска"
            break;
        case 3:
            res = "Торс"
            break;
        case 4:
            res = "Ноги"
            break;
        case 5:
            res = "Рюкзаки и парашюты"
            break;
        case 6:
            res = "Обувь"
            break;
        case 7:
            res = "Аксессуары"
            break;
        case 8:
            res = "Нижняя часть торса"
            break;
        case 9:
            res = "Броня"
            break;
        case 11:
            res = "Верх"
            break;
    }
    return res;
}

export type ClothData = {
    component: number,
    drawable: number,
    texture: number,
    name?: string
}[];

export interface GloveClothData {
    name: string,
    texture: number,
    torsoMap: Array<[number, number]>,
}

export const partsList:[number, string, number?][] = [
    [1, "Маска"],
    [3, "Торс"],
    [333, "Полный"],
    [4, "Ноги"],
    // [5, "Рюкзаки и парашюты"],
    [6, "Обувь"],
    [7, "Аксессуары"],
    [9, "Броня"],
    [100, "Головные уборы"],
    [101, "Очки"],
    [102, "Уши"],
    [106, "Часы"],
    [107, "Браслеты"],
    [1000, "Перчатки"],
]

export const dressShopPartsList:[number, string, number?][] = [
    [1, "Маска"],
    [3, "Торс"],
    [333, "Полный"],
    [4, "Ноги"],
    // [5, "Рюкзаки и парашюты"],
    [6, "Обувь"],
    [7, "Аксессуары"],
    [100, "Головные уборы"],
    [101, "Очки"],
    [102, "Уши"],
    [106, "Часы"],
    [107, "Браслеты"],
    [1000, "Перчатки"],
]

export const partsListAdmin:[number, string, number?][] = [
    ...partsList,
    [5, "Рюкзаки и парашюты"],
    [10, "Декали"]
]

export const boneParts:[number, number, number?, number?, number?][] = [
    [1, 31086, 0.5, 2.5, 1],
    [3, 24818, 0, 3.5, 0.3],
    [4, 63931, -1.0, 3.0, 0],
    [6, 52301, 1.0, 2.5, 0],
    [7, 24818, 0, 2.5, 0],
    [100, 31086, 1.5, 2.0, 1.3],
    [101, 31086, 0.0, 2.5, 1],
    [102, 31086, 0.8, 0.0, 0.7],
    [106, 60309, 0, 2.5, 0],
    [107, 28422, 0, 2.5, 0],
]

export enum ArmorNames {
    StandardArmor = 'Стандартный бронежилет',
    PurpleArmor = 'Фиолетовый бронежилет',
    GreenArmor = 'Зеленый бронежилет',
    BlueArmor = 'Синий бронежилет',
    RedArmor = 'Красный бронежилет',
    YellowArmor = 'Желтый бронежилет',
    GovernmentArmor = 'Правительственный бронежилет',
    PoliceArmor = 'Полицейский бронежилет',
    FibArmor = 'Бронежилет FIB',
    ArmyArmor = 'Армейский бронежилет',
    SheriffArmor = 'Бронежилет шерифов',
    YakuzaArmor = 'Бронежилет якудза',
    RMArmor = 'Бронежилет РМ',
    LCNArmor = 'Бронежилет лкн',
    
}

export const getBoneData = (part:number) => {
    const cfg = boneParts.find(q => q[0] == part);
    if(!cfg) return null;
    return {
        bone: cfg[1],
        x: cfg[2],
        y: cfg[3],
        z: cfg[4],
    }
}

/** https://wiki.rage.mp/index.php?title=Masks */
export const getAllMasks = (male = true) => {
    return (male ? componentsMale : componentsFemale).filter(q => q.component === 1)
}



/** 
 * https://wiki.rage.mp/index.php?title=Male_Torsos \
 * https://wiki.rage.mp/index.php?title=Female_Torsos 
 * */
export const getAllTorsos = (male = true) => {
    return (male ? componentsMale : componentsFemale).filter(q => q.component === 3)
}
/** 
 * https://wiki.rage.mp/index.php?title=Male_Tops \
 * https://wiki.rage.mp/index.php?title=Female_Tops
 * */
export const getAllTops = (male = true) => {
    return (male ? componentsMale : componentsFemale).filter(q => q.component === 11)
}
/** 
 * https://wiki.rage.mp/index.php?title=Male_Undershirts \
 * https://wiki.rage.mp/index.php?title=Female_Undershirts
 * */
export const getAllUndershirts = (male = true) => {
    return (male ? componentsMale : componentsFemale).filter(q => q.component === 8)
}



/**
 *  https://wiki.rage.mp/index.php?title=Male_Legs \
 *  https://wiki.rage.mp/index.php?title=Female_Legs
*/
export const getAllLegs = (male = true) => {
    return (male ? componentsMale : componentsFemale).filter(q => q.component === 4)
}

/** 
 * https://wiki.rage.mp/index.php?title=Male_Shoes \
 * https://wiki.rage.mp/index.php?title=Female_Shoes
 * */
export const getAllShoes = (male = true) => {
    return (male ? componentsMale : componentsFemale).filter(q => q.component === 6)
}
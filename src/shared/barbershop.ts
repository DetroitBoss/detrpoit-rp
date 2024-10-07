/** Базовые настройки стоимости компонентов в барбершопе */
export const enum BarberShopCost {
    /** Причёска и борода */
    hair = 800,
    /** Краска */
    paint = 650,
    /** Линзы */
    lenses = 400,
    nails = 50000,
}

/** Базовые идентификаторы предметов в каталоге бизнеса */
export const enum BarberShopItemIds {
    HAIR = 1,
    PAINT = 2,
    LENSES = 3,
    NAILS = 4,
}
/** Функция расчёта стоимости предмета */
const getItemIdCost = (data:{item: number, price: number, count: number, max_count: number}[], id: number, defaultValue = 0) => {
    return data.find(q => q.item === id) ? data.find(q => q.item === id).price : defaultValue
}

export const getBarberItemDeafaultCost = (item: BarberShopItemIds) => {
    if (item === BarberShopItemIds.HAIR) return BarberShopCost.hair
    else if (item === BarberShopItemIds.PAINT) return BarberShopCost.paint
    else if (item === BarberShopItemIds.LENSES) return BarberShopCost.lenses
    else if (item === BarberShopItemIds.NAILS) return BarberShopCost.nails
}

/** Глобал функция расчёта стоимости */
export const getComponentCost = (component: keyof BarberData, data:{item: number, price: number, count: number, max_count: number}[] = []) => {
    if(['hair', 'beard', 'beardOpacity', 'eyebrows', 'eyebrowOpacity'].includes(component)) return getItemIdCost(data, BarberShopItemIds.HAIR, BarberShopCost.hair);
    if(['eyecolor'].includes(component)) return getItemIdCost(data, BarberShopItemIds.LENSES, BarberShopCost.lenses);
    if(['nails'].includes(component)) return getItemIdCost(data, BarberShopItemIds.NAILS, BarberShopCost.nails);
    return getItemIdCost(data, BarberShopItemIds.PAINT, BarberShopCost.paint)
}
export const getCatalogIdByComponent = (component: keyof BarberData) : BarberShopItemIds=> {
    if(['hair', 'beard', 'beardOpacity', 'eyebrows', 'eyebrowOpacity'].includes(component)) return BarberShopItemIds.HAIR;
    if(['eyecolor'].includes(component)) return BarberShopItemIds.LENSES;
    if(['nails'].includes(component)) return BarberShopItemIds.NAILS;
    return BarberShopItemIds.PAINT
}
/** Названия предметов каталога бизнеса */
export const BarberCatalogNames = ['Волосы', 'Краска для волос', 'Линзы']
/** Заполненость бизнеса по умолчанию */
export const barberCatalogBase:{item: number, price: number, count: number, max_count: number}[] = [
    {item: BarberShopItemIds.HAIR, price: BarberShopCost.hair, count: 10, max_count: 10},
    {item: BarberShopItemIds.PAINT, price: BarberShopCost.paint, count: 10, max_count: 10},
    {item: BarberShopItemIds.LENSES, price: BarberShopCost.lenses, count: 10, max_count: 10},
]
/** Данные барбершопа относительно лица персонажа */
export interface BarberData {
    /** Пол персонажа */
    sex:number,
    /** Причёска */
    hair: number,
    /** Цвет волос */
    hairColor: number,
    /** Цвет волос второстепенный */
    hairColor2: number,
    /** Цвет глаз */
    eyecolor: number,
    /** Стиль бровей */
    eyebrows: number,
    /** Цвет бровей */
    eyebrowsColor: number,
    /** Интенсивность бровей */
    eyebrowOpacity: number,
    /** Стиль бороды */
    beard: number,
    /** Губы */
    lips: number,
    /** Губы */
    lipsOpacity: number,
    /** Губы */
    lipsColor: number,
    /** Макияж */
    makeup: number,
    /** Макияж */
    makeupOpacity: number,
    /** Макияж */
    makeupColor: number,
    /** Цвет бороды */
    beardColor: number,
    /** Интенсивность бороды */
    beardOpacity: number,
    /** Румяна */
    blush: number,
    blushOpacity: number,
    blushColor: number,

    nails: number
}

export const NAILS_COMPONENT_ID = 10;

export const nailsConfig: { Id: number, Drawable: number, Texture: number }[] = [
    { Id: -1, Drawable: 0, Texture: 0 },
    { Id:  1, Drawable: 209, Texture: 0 },
    { Id:  2, Drawable: 209, Texture: 1 },
    { Id:  3, Drawable: 209, Texture: 2 },
    { Id:  4, Drawable: 209, Texture: 3 },
    { Id:  5, Drawable: 209, Texture: 4 },
    { Id:  6, Drawable: 209, Texture: 5 },
    { Id:  7, Drawable: 209, Texture: 6 },
    { Id:  8, Drawable: 209, Texture: 7 },
    { Id:  9, Drawable: 209, Texture: 8 },
    { Id:  10, Drawable: 209, Texture: 9 },
    { Id:  11, Drawable: 209, Texture: 10 },
    { Id:  12, Drawable: 210, Texture: 0 },
    { Id:  13, Drawable: 210, Texture: 1 },
    { Id:  14, Drawable: 210, Texture: 2 },
    { Id:  15, Drawable: 210, Texture: 3 },
    { Id:  16, Drawable: 210, Texture: 4 },
    { Id:  17, Drawable: 210, Texture: 5 },
    { Id:  18, Drawable: 210, Texture: 6 },
    { Id:  19, Drawable: 210, Texture: 7 },
    { Id:  20, Drawable: 210, Texture: 8 },
    { Id:  21, Drawable: 210, Texture: 9 },
    { Id:  22, Drawable: 210, Texture: 10 },
    { Id:  23, Drawable: 211, Texture: 0 },
    { Id:  24, Drawable: 211, Texture: 1 },
    { Id:  25, Drawable: 211, Texture: 2 },
    { Id:  26, Drawable: 211, Texture: 3 },
    { Id:  27, Drawable: 211, Texture: 4 },
    { Id:  28, Drawable: 211, Texture: 5 },
    { Id:  29, Drawable: 211, Texture: 6 },
    { Id:  30, Drawable: 211, Texture: 7 },
    { Id:  31, Drawable: 211, Texture: 8 },
    { Id:  32, Drawable: 211, Texture: 9 },
    { Id:  33, Drawable: 212, Texture: 0 },
    { Id:  34, Drawable: 212, Texture: 1 },
    { Id:  35, Drawable: 212, Texture: 2 },
    { Id:  36, Drawable: 212, Texture: 3 },
    { Id:  37, Drawable: 212, Texture: 4 },
    { Id:  38, Drawable: 212, Texture: 5 },
    { Id:  39, Drawable: 212, Texture: 6 },
    { Id:  40, Drawable: 212, Texture: 7 },
    { Id:  41, Drawable: 212, Texture: 8 },
    { Id:  42, Drawable: 212, Texture: 9 },
    { Id:  43, Drawable: 212, Texture: 10 },
    { Id:  44, Drawable: 213, Texture: 0 },
    { Id:  45, Drawable: 213, Texture: 1 },
    { Id:  46, Drawable: 213, Texture: 2 },
    { Id:  47, Drawable: 213, Texture: 3 },
    { Id:  48, Drawable: 213, Texture: 4 },
    { Id:  49, Drawable: 213, Texture: 5 },
    { Id:  50, Drawable: 213, Texture: 6 },
    { Id:  51, Drawable: 213, Texture: 7 },
    { Id:  52, Drawable: 213, Texture: 8 },
    { Id:  53, Drawable: 213, Texture: 9 },
    { Id:  54, Drawable: 214, Texture: 0 },
    { Id:  55, Drawable: 214, Texture: 1 },
    { Id:  56, Drawable: 214, Texture: 2 },
    { Id:  57, Drawable: 214, Texture: 3 },
    { Id:  58, Drawable: 214, Texture: 4 },
    { Id:  59, Drawable: 214, Texture: 5 },
    { Id:  60, Drawable: 214, Texture: 6 },
    { Id:  61, Drawable: 214, Texture: 7 },
    { Id:  62, Drawable: 214, Texture: 8 },
    { Id:  63, Drawable: 214, Texture: 9 },
    { Id:  64, Drawable: 214, Texture: 10 },
    { Id:  65, Drawable: 215, Texture: 0 },
    { Id:  66, Drawable: 215, Texture: 1 },
    { Id:  67, Drawable: 215, Texture: 2 },
    { Id:  68, Drawable: 215, Texture: 3 },
    { Id:  69, Drawable: 215, Texture: 4 },
    { Id:  70, Drawable: 215, Texture: 5 },
    { Id:  71, Drawable: 215, Texture: 6 },
    { Id:  72, Drawable: 215, Texture: 7 },
    { Id:  73, Drawable: 215, Texture: 8 },
    { Id:  74, Drawable: 215, Texture: 9 },
]

// Типы выпадающих в рулетке призов
export enum DropType {
    REAL,// Предмет из реальной жизни
    INVENTORY_ITEM,// Предмет из инвентаря
    VEHICLE,// Транспорт
    PLATE,// Номер на транспорт
    VIP
}

// Рулетка, в которой выпадает вещь
export enum RouletteType {
    STANDART = "standart",
    PREMIUM = "premium",
    LUXE = "luxe",
}

// Вариант продажи предмета
export enum DropSellType {
    DOLLARS,
    DONATE
}
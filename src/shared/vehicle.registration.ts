/** Услуги центра регистрации */
export const VEHICLE_REGISTRATION_TARIFS:[string, number, boolean, number][] = [
    ["Случайный 8 значный номер", 5000, false, 8],
    ["Случайный 7 значный номер", 10000, false, 7],
    ["Случайный 6 значный номер", 15000, false, 6],
    ["Номерной знак под заказ", 2500, true, 0],
]
/** Координаты точек регистрации транспорта */
export const VEHICLE_REGISTRATION_POS:{x:number, y: number, z: number}[] = [
    {x: -705.50, y: -1285.73, z: 4.10}
]
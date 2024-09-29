/** Оружие, которое можно выбрать для дуелей. Указанное оружие должно быть прописано в конфиге инвентаря */
export const DUELS_WEAPON: string[] = [
    "weapon_appistol",
    "weapon_pistol", "weapon_minismg",
    "weapon_revolver",
    "weapon_smg",
    "weapon_heavyshotgun",
    "weapon_assaultrifle_mk2",
    "weapon_combatmg",
];

/** Точка регистрации на дуэли. Указывать с Z минус 1, то есть координата для обычной метки */
export const DUELS_REGISTER_POS = new mp.Vector3( -266.82, -2035.07, 29.15);

/** Точка размещения доски с рейтингом */
export const DUELS_TABLE_DATA: [Vector3Mp, number] = [new mp.Vector3(-268.36, -2037.1, 30.5), 161]

/** Локации, где будет проходить дуэль. По 2 координаты и угол поворота, как будет стоять игрок */
export const DUELS_FIGHT_POS: {
    pos1: Vector3Mp,
    pos2: Vector3Mp,
    heading1: number,
    heading2: number,
}[] = [
        // Крыша старой больки
        { pos1: new mp.Vector3(390.92, -1417.83, 77.17), pos2: new mp.Vector3(339.39, -1375.18, 77.17), heading1: 48.28, heading2: 227.62 },
        // Элизиан-Айленд порт №1
        { pos1: new mp.Vector3(463.44, -2782.11, 6.04), pos2: new mp.Vector3(494.41, -2799.90, 6.04), heading1: 238.45, heading2: 58.49 },
        // Сайпрес-Флэтс Крыша
        { pos1: new mp.Vector3(1029.15, -2206.48, 51.05), pos2: new mp.Vector3(1023.67, -2251.95, 51.05), heading1: 175.96, heading2: 354.69 },
        // Хавик Крыша
        { pos1: new mp.Vector3(333.01, -59.87, 153.29), pos2: new mp.Vector3(347.26, -20.09, 153.29), heading1: 336.33, heading2: 156.04}
    ]
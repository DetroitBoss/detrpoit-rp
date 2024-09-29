export default interface PhoneHealthData {
    /** Текущий уровень игрока */
    level: number;
    /** Опыт игрока */
    exp: number;
    /** Максимальный опыт на данном уровне */
    maxExp: number;
    /** Здоровье (ХП) персонажа */
    health: number;
    /** Голод персонажа */
    hunger: number;
    /** Жажда персонажа */
    thirst: number;
}
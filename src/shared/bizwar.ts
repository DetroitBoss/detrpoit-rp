
/** КД между бизварами семей в минутах */
export const COOLDOWN_BEETWEN_BIZWARS = 30;

/** Максимальное количество атак на бизнесы одной семьи */
export const ATTACKS_DAILY_LIMIT = 3;

/** Максимальное количество защит бизнесов одной семьи */
export const DEFENSES_DAILY_LIMIT = 6;

/** Максимально возможная разница между количеством участников в команде для старта бизвара */
export const DIFFERENCE_BETWEEN_TEAMS_LIMIT = 250;

/** Время подготовки к бизвару в минутах */
export const BIZWAR_PREPARATION_TIME = 10;

/** Сколько минут дать перед тем, как всех кто выживет выкинет из боя (на лут) */
export const BIZWAR_EXIT_TIMEOUT_MINUTES = 1;

/** Сколько минут длится бизвар */
export const BIZWAR_TIME = 12;

/** Точки мест проведения бизваров */
export const BIZWAR_POINTS: IBizWarPoint[] = [
    { x: 2680.30, y: 2849.47, z: 39.85, r: 180 },
    { x: -541.43, y: 5318.55, z: 88.54, r: 180 },
    { x: 2400.48, y: 3083.56, z: 55.33, r: 180 },
    { x: 1715.95, y: -1601.04, z: 113.32, r: 180 },
    { x: 62.98, y: 3703.14, z: 39.75, r: 180 },
    { x: 1028.64, y: 2445.16, z: 58.37, r: 180 },
    { x: 292.45, y: 2862.28, z: 43.64, r: 180 },
    { x: 1549.28, y: -2120.55, z: 77.19, r: 180 },
    { x: 1743.18, y: -1552.16, z: 112.64, r: 180 },
    
]

export interface IBizWarPoint {
    x: number;
    y: number;
    z: number;
    r?: number;
    busy?: boolean;
}
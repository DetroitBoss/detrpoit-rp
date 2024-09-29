export interface constructionSessionItem {
    id: number,
    name: string,
    pass: boolean
}

export interface constructionMySessionItem {
    id: number,
    name: string,
    status: boolean,
    owner?: boolean
}

/** Разрешить подключатся после запуска сессии */
export const ALLOW_JOIN_AFTER_START = true;
export const CONSTRUCTION_REGISTER_POS = new mp.Vector3(-668.25, 214.85, 80.96)
/** Сколько минимум игроков должно быть для запуска */
export const CONSTRUCTION_MIN_FOR_START = 2;
/** Сколько максимум может быть игроков */
export const CONSTRUCTION_MAX = 4;

export const CONSTRUCTION_DRESS_MALE:[number, number, number][] = [[3, 0, 0],
    [8, 1, 0],
    [11, 1, 11],
    [1, 0, 0],
    [4, 89, 19],
    [6, 24, 0],
];
export const CONSTRUCTION_DRESS_FEMALE:[number, number, number][] = [
    [3, 0, 0],
    [8, 1, 1],
    [11, 14, 6],
    [1, 0, 0],
    [4, 92, 19],
    [6, 66, 0],
    [100, 120, 0],
    [101, 5, 0],
    [106, 1, 0],
]

export const CONSTRUCTION_HOUSES: { setSecond: number, pos: { x: number, y: number, z: number, h: number }, name: string, sets: [string, number, number, number, number, string, string, number, number?][], reward: number }[] = [
    {
        setSecond: 300,
        name: 'Топ хата',
        pos: {x: -792.80, y: 320.53, z: 127.04, h: 182},
        reward: 86000,
        sets: [
            ["pp_floor1", -787.48, 321.0757, 127.14, 0, 'Песчаный паркет', 'WORLD_HUMAN_GARDENER_PLANT', 10, 1],
            ["pp_floor2", -783.9006, 318.7404, 127.14, 0, 'Песчаный паркет', 'WORLD_HUMAN_GARDENER_PLANT', 10, 1],
            ["pp_floor3", -780.076, 318.7404, 127.14, 0, 'Песчаный паркет', 'WORLD_HUMAN_GARDENER_PLANT', 10, 1],
            ["pp_floor4", -778.1946, 318.7404, 127.14, 0, 'Песчаный паркет', 'WORLD_HUMAN_GARDENER_PLANT', 10, 1],
            ["pp_floor5", -775.2689, 318.7404, 127.14, 0, 'Песчаный паркет', 'WORLD_HUMAN_GARDENER_PLANT', 10, 1],
            ["pp_floor6", -775.7347, 318.7404, 127.14, 0, 'Песчаный паркет', 'WORLD_HUMAN_GARDENER_PLANT', 10, 1],
            ["pp_floor7", -775.7347, 327.3982, 127.14, 0, 'Песчаный паркет', 'WORLD_HUMAN_GARDENER_PLANT', 10, 1],
            ["pp_floor8", -778.6219, 327.3982, 127.14, 0, 'Песчаный паркет', 'WORLD_HUMAN_GARDENER_PLANT', 10, 1],
            ["pp_floor9", -776.2374, 330.5549, 127.14, 0, 'Песчаный паркет', 'WORLD_HUMAN_GARDENER_PLANT', 10, 1],
            ["pp_floor10", -787.4617, 328.8468, 127.14, 0, 'Плитка Адама', 'WORLD_HUMAN_GARDENER_PLANT', 10, 1],
            ["pp_floor11", -783.7022, 328.3, 127.14, 0, 'Плитка Адама', 'WORLD_HUMAN_GARDENER_PLANT', 10, 1],
            ["pp_floor12", -780.0383, 328.3, 127.14, 0, 'Плитка Адама', 'WORLD_HUMAN_GARDENER_PLANT', 10, 1],
            ["pp_floor13", -778.1489, 328.3, 127.14, 0, 'Плитка Адама', 'WORLD_HUMAN_GARDENER_PLANT', 10, 1],
            ["pp_floor14", -773.9064, 333.7294, 127.14, 0, 'Кавролин дьявола', 'WORLD_HUMAN_GARDENER_PLANT', 10, 1],
            ["pp_floor15", -769.773, 334.8942, 127.14, 0, 'Кавролин дьявола', 'WORLD_HUMAN_GARDENER_PLANT', 10, 1],
            ["pp_floor16", -767.7822, 337.6885, 127.14, 0, 'Кавролин дьявола', 'WORLD_HUMAN_GARDENER_PLANT', 10, 1],
            ["pp_floor17", -770.8292, 337.1935, 127.14, 0, 'Кавролин дьявола', 'WORLD_HUMAN_GARDENER_PLANT', 10, 1],
            ["pp_wall1", -790.6187, 319.5262, 127.14, 88, 'Светлый вход', 'WORLD_HUMAN_HAMMERING', 10, 2],
            ["pp_wall2", -789.3102, 323.6355, 127.14, 353, 'Кардамон любви', 'WORLD_HUMAN_HAMMERING', 10, 2],
            ["pp_wall3", -787.4655, 324.6894, 127.14, 96, 'Грёзы медузы', 'WORLD_HUMAN_HAMMERING', 10, 2],
            ["pp_wall4", -789.3287, 325.7908, 127.14, 182, 'Грёзы медузы', 'WORLD_HUMAN_HAMMERING', 10, 2],
            ["pp_wall5", -790.0692, 328.319, 127.14, 93, 'Кардамон любви', 'WORLD_HUMAN_HAMMERING', 10, 2],
            ["pp_wall6", -785.418, 331.7086, 127.14, 359, 'Грёзы медузы', 'WORLD_HUMAN_HAMMERING', 10, 2],
            ["pp_wall7", -779.5437, 330.6489, 127.14, 356, 'Грёзы медузы', 'WORLD_HUMAN_HAMMERING', 10, 2],
            ["pp_wall8", -774.2369, 331.459, 127.14, 358, 'Грёзы медузы', 'WORLD_HUMAN_HAMMERING', 10, 2],
            ["pp_wall9", -773.8049, 326.1978, 127.14, 270, 'Грёзы медузы', 'WORLD_HUMAN_HAMMERING', 10,2],
            ["pp_wall10", -773.8049, 317.7644, 127.14, 270, 'Грёзы медузы', 'WORLD_HUMAN_HAMMERING', 10, 2],
            ["pp_wall11", -776.147, 314.5254, 127.14, 184, 'Грёзы медузы', 'WORLD_HUMAN_HAMMERING', 10, 2],
            ["pp_wall12", -780.5873, 314.2187, 127.14, 231, 'Кардамон любви', 'WORLD_HUMAN_HAMMERING', 10, 2],
            ["pp_wall13", -787.3307, 316.3463, 127.14, 88, 'Грёзы медузы', 'WORLD_HUMAN_HAMMERING', 10, 2],
            ["pp_wall14", -789.3861, 318.601, 127.14, 181, 'Кардамон любви', 'WORLD_HUMAN_HAMMERING', 10, 2],
            ["pp_wall15", -777.7453, 324.7846, 127.14, 99, 'Полка в стенке', 'WORLD_HUMAN_HAMMERING', 10,2],
            ["pp_wall16", -777.9772, 332.547, 127.14, 181, 'Проход в светлый мир', 'WORLD_HUMAN_HAMMERING', 10, 2],
            ["pp_wall17", -779.3784, 333.5221, 127.14, 86, 'Темный кардамон', 'WORLD_HUMAN_HAMMERING', 10, 2],
            ["pp_wall18", -776.8394, 334.6281, 127.14, 359, 'Темный кардамон', 'WORLD_HUMAN_HAMMERING', 10, 2],
            ["pp_wall19", -773.7628, 337.7965, 127.14, 91, 'Итальянская пыль', 'WORLD_HUMAN_HAMMERING', 10, 2],
            ["pp_wall20", -769.863, 339.9488, 127.14, 357, 'Итальянская пыль', 'WORLD_HUMAN_HAMMERING', 10, 2],
            ["pp_wall21", -766.056, 336.4696, 127.14, 271, 'Белая глина', 'WORLD_HUMAN_HAMMERING', 10, 2],
            ["pp_wall22", -769.4066, 332.6429, 127.14, 171, 'Белая глина', 'WORLD_HUMAN_HAMMERING', 10, 2],
            ["pp_door1", -790.5096, 321.0173, 127.14, 0, 'Дверь из дуба', 'CODE_HUMAN_MEDIC_TEND_TO_DEAD', 10, 3],
            ["pp_door2", -776.1579, 331.6445, 127.14, 0, 'Дверь из дуба', 'CODE_HUMAN_MEDIC_TEND_TO_DEAD', 10, 3],
            ["pp_kitchen1", -784.2786, 330.5264, 127.14, 0, 'Карбоновое напыление', 'CODE_HUMAN_MEDIC_TEND_TO_DEAD', 10, 4],
            ["pp_kitchen2", -788.6039, 328.5783, 127.14, 0, 'Снежный полёт', 'CODE_HUMAN_MEDIC_TEND_TO_DEAD', 10, 4],
            ["pp_stroykabed", -771.0731, 336.9496, 127.14, 0, 'IKEA Family', 'CODE_HUMAN_MEDIC_TEND_TO_DEAD', 10, 4],
            ["pp_stroykabedraz", -773.6128, 335.3019, 127.14, 0, 'Розетки из Франции', 'CODE_HUMAN_MEDIC_TEND_TO_DEAD', 10, 4],
            ["pp_stroykabeddec", -771.7029, 332.9954, 127.14, 0, 'Сальвадор Дали', 'CODE_HUMAN_MEDIC_TEND_TO_DEAD', 10, 4],
            ["pp_kitchendec", -783.7343, 326.3725, 127.14, 0, 'Молоко матери', 'CODE_HUMAN_MEDIC_TEND_TO_DEAD', 10, 5],
            ["pp_mainlounge", -778.3633, 317.5556, 127.14, 0, 'Лаундж зона', 'CODE_HUMAN_MEDIC_TEND_TO_DEAD', 10, 5],
            ["pp_maindec", -774.7797, 324.3287, 127.14, 0, 'Абстракция', 'CODE_HUMAN_MEDIC_TEND_TO_DEAD', 10, 5],
            ["pp_decorderevo", -789.1453, 322.7384, 127.14, 0, 'Зонирование XXL', 'CODE_HUMAN_MEDIC_TEND_TO_DEAD', 10, 5],
        ]
    }
]
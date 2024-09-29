/** Стоимость изготовления ключа от склада */
export const WAREHOUSE_KEY_COST = 1000;
/** Стоимость смены замка от склада */
export const WAREHOUSE_LOCK_CHANGE = 1000;

/** Точка входа в инту*/
export const WAREHOUSE_INTERIOR_POS = new mp.Vector3(1104.64, -3081.43, -34.54);
/** Маркер управления складом */
export const WAREHOUSE_CONTROL_POS = new mp.Vector3(1088.81, -3082.36, -34.54)
/** Точка входа в инту (угол поворота) */
export const WAREHOUSE_INTERIOR_HEADING = 101

/** Список доступных ячеек для улучшения */
export const WAREHOUSE_SLOTS_POS:[number, number, number, number, number][] = [
    [1088.842, -3078.017, -34.54204, 1088.94,-3079.18],
    [1091.257, -3077.9, -34.54204, 1091.53,-3079.12],
    [1095.06, -3077.855, -34.54204, 1095.33,-3079.06],
    [1097.623, -3077.787, -34.54204, 1097.67,-3079.12],
    [1101.256, -3077.867, -34.54204, 1101.51,-3079.06],
    [1103.819, -3077.905, -34.54204, 1104.01,-3079.07],

    [1103.733, -3077.738, -32.34517, 1104.01,-3079.07],
    [1101.318, -3077.854, -32.34517, 1101.51,-3079.06],
    [1097.762, -3077.905, -32.34517, 1097.67,-3079.12],
    [1095.2, -3077.867, -32.34517, 1095.33,-3079.06],
    [1091.317, -3077.787, -32.34517, 1091.53,-3079.12],
    [1088.754, -3077.855, -32.34517, 1088.94,-3079.18],
]










export const WAREHOUSE_SLOTS_H_START = 160
export const WAREHOUSE_SLOTS_H_END = 190

export const WAREHOUSE_SLOTS_VARIANTS: {model: string, weight: number, cost: number, name: string, z: number}[] = [
    { model: 'ex_prop_crate_closed_sc', weight: 400, cost: 200000, name: 'Контейнер 1', z: 0},
    { model: 'prop_box_wood03a', weight: 500, cost: 275000, name: 'Контейнер 2', z: -0.1},
    { model: 'prop_box_wood07a', weight: 600, cost: 300000, name: 'Контейнер 3', z: 0},
    { model: 'ex_prop_crate_closed_bc', weight: 700, cost: 350000, name: 'Контейнер 4', z: 0},
    { model: 'ex_prop_crate_clothing_bc', weight: 750, cost: 400000, name: 'Контейнер 5', z: 0},
    { model: 'prop_boxpile_04a', weight: 800, cost: 500000, name: 'Контейнер 6', z: 0.65},
]
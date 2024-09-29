import {MINIGAME_TYPE} from "../minigame";

export const TASK_NAME = (type: MINIGAME_TYPE) => {
    if (type === MINIGAME_TYPE.JAILHAMMER) return "Забить гвозди в мастерской";
    if (type === MINIGAME_TYPE.JAILSEWING) return "Поработать за ткацким станком";
    if (type === MINIGAME_TYPE.JAILWASHING) return "Заправить стирку";
    if (type === MINIGAME_TYPE.JAILCOOKING) return "Приготовить еду для заключенных";
    if (type === MINIGAME_TYPE.JAILTOILET) return "Почистить туалеты в мед. корпусе";
    return "";
}

export const TASK_TYPES: MINIGAME_TYPE[] = [
    MINIGAME_TYPE.JAILHAMMER,
    MINIGAME_TYPE.JAILSEWING,
    MINIGAME_TYPE.JAILWASHING,
    MINIGAME_TYPE.JAILCOOKING,
    MINIGAME_TYPE.JAILTOILET
]

export const TASKS_BLIP_POSITION: Vector3Mp[] = [
    new mp.Vector3(1755.96, 2477.74, 45.96),
    new mp.Vector3(1771.32, 2485.43, 45.96),
    new mp.Vector3(1746.21, 2472.31, 45.96),
    new mp.Vector3(1628.82, 2459.73, 45.97),
    new mp.Vector3(1596.99, 2489.60, 49.99)
]

export const SEWING_POSITIONS: Vector3Mp[] = [
    new mp.Vector3(1774.95, 2490.89, 44.96),
    new mp.Vector3(1773.11,2489.93,44.96),
    new mp.Vector3(1771.16,2488.73,44.96),
    new mp.Vector3(1767.85,2486.85,44.96),
    new mp.Vector3(1765.91,2485.73,44.96),
    new mp.Vector3(1764.14,2484.56,44.96),
    new mp.Vector3(1765.46,2482.09,44.96),
    new mp.Vector3(1767.33,2483.14,44.96),
    new mp.Vector3(1769.27,2484.27,44.96),
    new mp.Vector3(1772.75,2486.18,44.96),
    new mp.Vector3(1774.39,2487.27,44.96),
    new mp.Vector3(1776.44,2488.41,44.96),
    new mp.Vector3(1778.11,2485.51,44.96),
    new mp.Vector3(1776.07,2484.39,44.96),
    new mp.Vector3(1774.28,2483.24,44.96),
    new mp.Vector3(1770.93,2481.36,44.96),
    new mp.Vector3(1769.00,2480.31,44.96),
    new mp.Vector3(1767.09,2479.17,44.96)
]

export const HAMMER_POSITIONS: Vector3Mp[] = [
    new mp.Vector3(1757.10, 2484.29, 44.96),
    new mp.Vector3(1759.18, 2480.80, 44.96),
    new mp.Vector3(1761.26, 2477.19, 44.96),
    new mp.Vector3(1763.31, 2473.58, 44.96),
    new mp.Vector3(1756.26, 2469.51, 44.96),
    new mp.Vector3(1754.08, 2473.05, 44.96),
    new mp.Vector3(1751.96, 2476.60, 44.96),
    new mp.Vector3(1749.99, 2480.26, 44.96)
]

export const WASHING_POSITIONS: Vector3Mp[] = [
    new mp.Vector3(1746.68,2463.89,44.96),
    new mp.Vector3(1745.54,2465.77,44.96),
    new mp.Vector3(1744.53,2467.70,44.96),
    new mp.Vector3(1743.49,2469.58,44.96),
    new mp.Vector3(1742.41,2471.47,44.96),
    new mp.Vector3(1741.40,2473.38,44.96),
    new mp.Vector3(1740.36,2475.22,44.96),
    new mp.Vector3(1738.93,2476.98,44.96)
]

export const COOKING_POSITIONS: Vector3Mp[] = [
    new mp.Vector3(1632.38,2459.46,44.97),
    new mp.Vector3(1639.16,2467.42,44.97),
    new mp.Vector3(1638.35,2468.70,44.97),
]

export const TOILET_POSITIONS: Vector3Mp[] = [
    new mp.Vector3(1590.11,2489.50,48.99),
    new mp.Vector3(1592.60,2492.39,48.99),
    new mp.Vector3(1595.16,2495.45,48.99),
    new mp.Vector3(1597.53,2498.38,48.99),
    new mp.Vector3(1599.91,2501.27,48.99)
]
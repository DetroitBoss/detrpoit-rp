export enum FarmerLevel {
    First = 1,
    Second,
    Third,
    Fourth,
    Fifth
}

export const EXP_PER_ACTION = 1 // Число exp даваемое за одно действие (полив, сбор, т.д.)
export const SALARY_PER_ACTION = 50 // Число денег за действие

export const FARMER_LEVELS: {
    level: FarmerLevel,
    requiredExp: number
}[] = [
    { level: FarmerLevel.First, requiredExp: 0 },
    { level: FarmerLevel.Second, requiredExp: 3000 },
    { level: FarmerLevel.Third, requiredExp: 15000 },
    { level: FarmerLevel.Fourth, requiredExp: 35000 },
    { level: FarmerLevel.Fifth, requiredExp: 70000 },
]

export const ANIMATION_FACTOR_FROM_PROGRESS = 2 // На сколько быстрее будет идти анимация с ростом уровня
export const DEFAULT_LANDING_TIME = 17 // Время длительности анимации на посадку (в сек)

export const ACTIVITY_RENT_TIME_IN_HOURS = 4 // На сколько аренда
export const ACTIVITY_RENT_COST = 20000 // Сколько стоит аренда
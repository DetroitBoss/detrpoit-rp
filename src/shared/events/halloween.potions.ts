export const COOK_POTION_EVENT = 'halloween:potions:cook';
export const KETTLES_POSITIONS: Vector3Mp[] = [
    new mp.Vector3(1666.92, 3686.23, 33.83)
];

export enum PotionType {
    HEALTH_DWARF = 10000,
    HEALTH_GIANT = 10001,
    HEALTH = 10002,
    ARMOR_BUG = 10003,
    MANTIS = 10004,
    SOFA_CRITIC = 10005,
    UNKNOWN = 10006,
    ALPHA= 10007,
    HEALTH_COCKROACH= 10008,
    DANCER = 10009,
    LOGAN = 10010
}

export interface RecipeIngredient {
    itemId: number,
    amount: number
}

export interface PotionRecipe {
    type: PotionType,
    resultItemId: number,
    ingredients: RecipeIngredient[]
}

/**
 * @param first itemId
 * @param second hasAmount
 */
export type RecipeIngredientDto = [number, number];


export interface PotionRecipeDto {
    type: PotionType,
    ingredients: RecipeIngredientDto[]
}

export const POTIONS_RECIPES: PotionRecipe[] = [
    {
        type: PotionType.HEALTH_DWARF,
        resultItemId: 10000,
        ingredients: [
            { itemId: 830, amount: 2 },
            { itemId: 7030, amount: 5 },
            { itemId: 9000, amount: 5 },
            { itemId: 7020, amount: 10 },
        ]
    },
    {
        type: PotionType.HEALTH_GIANT,
        resultItemId: 10001,
        ingredients: [
            { itemId: 21, amount: 5 },
            { itemId: 24, amount: 6 },
            { itemId: 27, amount: 7 },
            { itemId: 820, amount: 3 },
            { itemId: 7, amount: 9 },
            { itemId: 7026, amount: 10 },
        ]
    },
    {
        type: PotionType.HEALTH,
        resultItemId: 10002,
        ingredients: [
            { itemId: 7025, amount: 5 },
            { itemId: 7024, amount: 5 },
            { itemId: 9000, amount: 5 },
            { itemId: 9100, amount: 5 },
            { itemId: 7, amount: 9 },
            { itemId: 5, amount: 5 },
        ]
    },
    {
        type: PotionType.ARMOR_BUG,
        resultItemId: 10003,
        ingredients: [
            { itemId: 869, amount: 4 },
            { itemId: 7025, amount: 5 },
            { itemId: 7020, amount: 5 },
            { itemId: 7028, amount: 5 },
            { itemId: 7030, amount: 7 },
            { itemId: 9102, amount: 5 },
            { itemId: 5, amount: 6 },
            { itemId: 6, amount: 5 },
            { itemId: 900, amount: 7 },
            { itemId: 821, amount: 4 },
            { itemId: 822, amount: 4 },
            { itemId: 831, amount: 2 },
            { itemId: 833, amount: 2 },
        ]
    },
    {
        type: PotionType.MANTIS,
        resultItemId: 10004,
        ingredients: [
            { itemId: 153, amount: 10 },
            { itemId: 833, amount: 5 },
            { itemId: 6, amount: 7 },
            { itemId: 9210, amount: 2 },
            { itemId: 900, amount: 4 },
            { itemId: 908, amount: 2 },
            { itemId: 21, amount: 7 },
            { itemId: 27, amount: 4 },
            { itemId: 20, amount: 4 },
            { itemId: 1, amount: 6 },
            { itemId: 9000, amount: 6 },
        ]
    },
    {
        type: PotionType.SOFA_CRITIC,
        resultItemId: 10005,
        ingredients: [
            { itemId: 8, amount: 6 },
            { itemId: 21, amount: 5 },
            { itemId: 7, amount: 8 },
            { itemId: 5, amount: 5 },
            { itemId: 20, amount: 7 },
            { itemId: 22, amount: 5 },
            { itemId: 28, amount: 10 },
            { itemId: 26, amount: 4 },
            { itemId: 200, amount: 4 },
            { itemId: 206, amount: 3 },
            { itemId: 214, amount: 4 },
        ]
    },
    {
        type: PotionType.UNKNOWN,
        resultItemId: 10006,
        ingredients: [
            { itemId: 51, amount: 1 },
            { itemId: 206, amount: 5 },
            { itemId: 830, amount: 2 },
            { itemId: 820, amount: 1 },
            { itemId: 7030, amount: 7 },
            { itemId: 9000, amount: 5 },
        ]
    },
    {
        type: PotionType.ALPHA,
        resultItemId: 10007,
        ingredients: [
            { itemId: 214, amount: 5 },
            { itemId: 206, amount: 7 },
            { itemId: 200, amount: 9 },
            { itemId: 28, amount: 8 },
            { itemId: 7030, amount: 5 },
            { itemId: 7020, amount: 10 },
            { itemId: 910, amount: 4 },
            { itemId: 900, amount: 4 },
            { itemId: 907, amount: 6 },
        ]
    },
    {
        type: PotionType.HEALTH_COCKROACH,
        resultItemId: 10008,
        ingredients: [
            { itemId: 28, amount: 8 },
            { itemId: 7030, amount: 10 },
            { itemId: 7020, amount: 15 },
            { itemId: 908, amount: 5 },
            { itemId: 7030, amount: 7 },
            { itemId: 200, amount: 9 },
        ]
    },
    {
        type: PotionType.DANCER,
        resultItemId: 10009,
        ingredients: [
            { itemId: 200, amount: 8 },
            { itemId: 214, amount: 5 },
            { itemId: 9210, amount: 5 },
            { itemId: 834, amount: 1 },
            { itemId: 202, amount: 6 },
            { itemId: 21, amount: 8 },
            { itemId: 20, amount: 8 },
        ]
    },
    {
        type: PotionType.LOGAN,
        resultItemId: 10010,
        ingredients: [
            { itemId: 908, amount: 5 },
            { itemId: 907, amount: 5 },
            { itemId: 910, amount: 3 },
            { itemId: 51, amount: 1 },
            { itemId: 52, amount: 2 },
            { itemId: 7028, amount: 8 },
            { itemId: 7030, amount: 8 },
            { itemId: 9210, amount: 3 },
            { itemId: 9213, amount: 1 },
        ]
    },
];
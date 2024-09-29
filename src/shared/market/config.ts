export const RENT_COMMON_TENT_COST = 5000;
export const RENT_BLACK_TENT_COST = 15000;

export const START_RENT_COMMON_TENT_COST = 5000;
export const START_RENT_BLACK_TENT_COST = 20000;

export const RENT_TICK_MINUTES = 30;

export const MAX_RENT_TIME_MINUTES = 5 * 60;

export const STOCK_KEEP_MAX_TIME_MINUTES = 60 * 24;

export const NPC_SELLER_PERCENTS = 20;

export const SELLER_POSITION_RADIUS = 30;

export const MARKET_BLIP_SPRITE = 500;
export const MARKET_BLIP_COLOR = 5;

export const TENT_DESTROY_AFTER_CUFFS_SECONDS = 120;

export function getMarketRentCompensation(rentTimeLeftS: number): number {
    const rentTickLeft = Math.floor(rentTimeLeftS / 60 / RENT_TICK_MINUTES);
    return rentTickLeft * RENT_COMMON_TENT_COST;
}
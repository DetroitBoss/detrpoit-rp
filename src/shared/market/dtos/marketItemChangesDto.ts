export interface MarketItemChangesDto {
    itemId: number;

    itemConfigId: number;

    oldActive: boolean;
    newActive: boolean;

    oldPrice: number;
    newPrice: number;

    oldCount: number;
    newCount: number;
}
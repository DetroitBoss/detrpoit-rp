export interface MarketItemDto {
    itemId: number;

    itemConfigId: number;

    itemName: string;

    price?: number;

    count: number;

    inventoryCount: number;
}
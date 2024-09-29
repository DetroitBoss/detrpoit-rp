import {MarketItemDto} from "./marketItemDto";
import {MarketHistoryItemDto} from "./marketHistoryItemDto";

export interface MarketDto {
    id: number;

    ownerName: string;

    marketItems: MarketItemDto[];

    isPolice?: boolean

    rentTimeS?: number;

    isSellerAvailable?: boolean;

    history?: MarketHistoryItemDto[];
}


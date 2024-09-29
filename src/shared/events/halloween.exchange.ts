import {getBaseItemNameById} from "../inventory";

// Я делал это пьяным, не бейте

export enum ExchangeItemType {
    INVENTORY_ITEM,
    CLOTHES
}

export interface ExchangeItem {
    itemType: ExchangeItemType,
    price: number;

    isForMale?(dressConfig: DressConfigDto[]): boolean;
    getName(dressConfig: DressConfigDto[]): string,

    imageDict(): string,
    imageName(): string
}

export class ExchangeInventoryItem implements ExchangeItem {
    readonly itemType: ExchangeItemType = ExchangeItemType.INVENTORY_ITEM;

    readonly price: number;
    readonly configItemId: number;

    constructor(configItemId: number, price: number) {
        this.configItemId = configItemId;
        this.price = price;
    }

    getName(dressConfig: DressConfigDto[]): string {
        return getBaseItemNameById(this.configItemId);
    }

    imageName(): string {
        return "Item_" + this.configItemId;
    }

    imageDict(): string {
        return "inventory";
    }
}

export class ExchangeClothesItem implements ExchangeItem {
    readonly itemType: ExchangeItemType = ExchangeItemType.CLOTHES;
    readonly price: number;
    readonly dressConfigId: number;

    constructor(dressConfigId: number, price: number) {
        this.dressConfigId = dressConfigId;
        this.price = price;
    }

    isForMale(dressConfig: DressConfigDto[]): boolean {
        return dressConfig.find(cfg => cfg.id === this.dressConfigId).isMale;
    }

    getName(dressConfig: DressConfigDto[]): string {
        return dressConfig.find(dress => dress.id === this.dressConfigId).name;
    }

    imageName(): string {
        return this.dressConfigId.toString();
    }

    imageDict(): string {
        return "items";
    }
}

export interface DressConfigDto {
    id: number,
    name: string,
    isMale: boolean
}

export const EXCHANGE_ITEMS: ExchangeItem[] = [
    new ExchangeInventoryItem(2087, 10000),
    new ExchangeInventoryItem(2088, 9000),
    new ExchangeInventoryItem(2091, 8000),
    new ExchangeInventoryItem(2092, 6000),
    new ExchangeInventoryItem(2089, 5000),
    new ExchangeInventoryItem(2090, 5000),
    new ExchangeInventoryItem(10003, 150),
    new ExchangeInventoryItem(10010, 100),
    new ExchangeClothesItem(2574, 1500),
    new ExchangeClothesItem(2575, 800),
    new ExchangeClothesItem(2576, 900),
    new ExchangeClothesItem(2577, 1000),
    new ExchangeClothesItem(2578, 1000),
    new ExchangeClothesItem(2579, 700),
    new ExchangeClothesItem(2580, 700),
    new ExchangeClothesItem(2581, 700),
    new ExchangeClothesItem(2582, 500),
    new ExchangeClothesItem(2583, 500),
    new ExchangeClothesItem(2584, 500),
    new ExchangeClothesItem(2585, 500),
    new ExchangeClothesItem(2586, 500),
    new ExchangeClothesItem(2587, 1000),
    new ExchangeClothesItem(2588, 1000),
    new ExchangeClothesItem(2589, 12000),
    new ExchangeClothesItem(2590, 12000),
    new ExchangeClothesItem(2591, 12000),
    new ExchangeClothesItem(2592, 800),
    new ExchangeClothesItem(2593, 800),
    new ExchangeClothesItem(2594, 1500),
    new ExchangeClothesItem(2595, 800),
    new ExchangeClothesItem(2596, 800),
    new ExchangeClothesItem(2597, 900),
    new ExchangeClothesItem(2598, 1000),
    new ExchangeClothesItem(2599, 1000),
    new ExchangeClothesItem(2600, 1000),
    new ExchangeClothesItem(2601, 500),
    new ExchangeClothesItem(2602, 500),
    new ExchangeClothesItem(2603, 500),
    new ExchangeClothesItem(2604, 1000),
    new ExchangeClothesItem(2605, 1000),
    new ExchangeClothesItem(2606, 12000),
    new ExchangeClothesItem(2607, 12000),
    new ExchangeClothesItem(2608, 12000),

];
import {BUSINESS_TYPE} from "../business";

export interface IOrderCatalogDTO {
    name: string
    item: number
    price: number
    count: number
    max_count: number
    orderCount?: number
}

export interface IBaseBusinessInfo {
    name: string
    money: number
    cost: number
    tax: number
    taxMax: number
    type: BUSINESS_TYPE
    upgrade: number
}

export interface IPricesCatalog {
    item: number
    name: string
    price: number
    maxPrice: number
    count: number
    maxCount: number
}

export interface ITaxes {
    now: number
    day: number
    max: number
    end: string
}

export interface IBusinessRating {
    businessId: number
    itemName: string
    count: number
    money: number
    userId: number
    time: number
}

export interface IUserBuyerRating {
    userId: number
    money: number
}

export interface IBusinessCatalogRating {
    name: string,
    day: number
    week: number
    month: number
}

export interface IBusinessTaxLog {
    money: number
    time: string
}

export interface ILastSells {
    name: string
    count: number
    userId: number
    time: string
    money: number
}
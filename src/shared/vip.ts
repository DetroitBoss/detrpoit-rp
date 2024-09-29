import { StringNullableChain } from "lodash";
import {LicenceType} from "./licence";

/** На сколько дней даётся випка при регистрации аккаунта */
export const VIP_START_DAYS = 14;

/** На сколько дней даётся випка при активации промо */
export const VIP_PROMO_USE_DAYS = 14;

/** Випка которая выдается при вводе промокода */
export const PROMO_VIP_ID: VipId = "Sapfire";

export type VipId = "Sapfire" | "MediaLight" | "MediaHard" | "Ruby" | "Diamond"

/** Информация о випке */
export interface VipData {
    /** Идентификатор випки */
    id: VipId;
    /** Название випки */
    name: string;
    /** Стоимость випки на 30 дней, если 0 или не указывать - купить будет нельзя */
    cost?: number;
    /** Надбавка $ при выдаче PayDay */
    payday_money?: number;
    /** Надбавка опыта при выдаче PayDay */
    payday_exp?: number;
    /** Надбавка донат валюты при выдаче PayDay */
    payday_donate?: number;
    /** доп процент получаемого опыта работы (1-1000%)
     * @example Если будет выдано 200 опыта, а параметр указан 10, то будет выдано 100 + (200 / 100 * 10) опыта
     */
    job_skill_multipler?: number;
    /** Коэффициент зарплат на работах */
    jobPaymentMultiplier?: number;
    /** Данная випка предназначена для медиа */
    media?: true;
    /** Данная випка будет выдана при создании аккаунта. Если випок с этим статусом несколько - выберется случайно */
    start?: true;
    /**Лечение в больнице идет в 2 раза быстрее */
    healmultipler?: boolean;
    /**Сколько времени можно стоять AFK */
    afkminutes?: number;
    /** Доступ к /vipuninvite */
    vipuninvite?: boolean;
    /** Оптала налогов через сайт */
    sitepay?: boolean;
    /** Отметить что популярное */
    popular?: boolean;
    /** Цвет */
    color: string;
    /** VIP членство в казино */
    casino?: boolean;

    /** Время ожидания смерти в миллисекундах */
    deathScreenTime?: number;

    /** Максимальное время уплаты налогов в днях  */
    taxPropertyMaxDays?: number;
}

export const VIP_TARIFS: VipData[] = [

    { id: "Sapfire", name: "Saphire", cost:500, payday_exp: 1, healmultipler: true , afkminutes: 15 , color: "#FFFFFF", jobPaymentMultiplier: 1.2, deathScreenTime: 120000 },
    { id: "MediaLight", name: "Media Light", media: true, vipuninvite: true, payday_money: 1000, job_skill_multipler: 20, healmultipler: true, afkminutes: 25 , color: "#FFFFFF", casino: true, deathScreenTime: 60000 },
    { id: "MediaHard", name: "Media Hard", media: true, vipuninvite: true, payday_money: 1500, job_skill_multipler: 30, payday_exp: 1, healmultipler: true, afkminutes: 35,  color: "#FFFFFF", casino: true, deathScreenTime: 60000 },
    { id: "Ruby", name: "Ruby", cost: 1000, payday_money: 800, healmultipler: true, afkminutes:30 , payday_exp: 1, color: "#A48A57", jobPaymentMultiplier: 1.5, deathScreenTime: 90000, casino: true },
    { id: "Diamond", name: "Diamond", cost: 1500, payday_money: 1200,  healmultipler: true, afkminutes: 45, payday_exp: 2, popular: true , color: "#748DC3", jobPaymentMultiplier: 1.8, deathScreenTime: 60000, casino: true, taxPropertyMaxDays: 21 },

]

export const getVipConfig = (id: VipId) => {
    return VIP_TARIFS.find(q => q.id === id);
}



interface PacketData {
    /** ИД (уникальный, двух одинаковых быть не должно) */
    id: number,
    /** Название */
    name: string,
    /** Стоимость */
    price: number,
    /** Зачёркнутая цена */
    full_price: number,
    /** Отметка что это популярно */
    popular?: boolean,
    /** Награда */
    items: {
        /** Выдать випку */
        vip?: {
            /** Тип */
            type: VipId;
            /** Количество месяцев */
            time: number;
        },
        /** Выдать лицензии */
        licenses?: {id: LicenceType, days: number}[],
        /** Выдать деньги */
        money?:number,
        /** Выдать предметы */
        items?: number[]
    },
    /** Стиль (не трогать) */
    class: string
}
export const PACKETS: PacketData[] = [
    { id: 1, name:"Новичок",  class: "beginner", price: 599, full_price: 800, items: { vip: { type:"Sapfire", time: 1}, licenses: [{id: "car", days: 30}], money: 20000}},
    { id: 2, name:"Бывалый",  class: "veteran", price: 899, full_price: 1250, items: { vip: { type:"Sapfire", time: 1}, licenses: [{id: "car", days: 30}, {id: "truck", days: 30},{id: "med", days: 30}], money: 50000}},
    { id: 3, name:"Богач",    class: "rich",popular: true, price: 2499, full_price: 3770, items: { vip: { type:"Ruby", time: 1}, licenses: [{id: "car", days: 30},{id: "weapon", days: 30},{id: "med", days: 30}], money: 200000, items: [850, 851]}},
    { id: 4, name:"Бизнесмен",class: "millionaire", price: 4999, full_price: 5500, items: { vip: { type:"Diamond", time: 1}, licenses: [{id: "car", days: 30},{id: "weapon", days: 30},{id: "med", days: 30}], items: [850, 851], money: 400000}},
    { id: 5, name:"Набор лицензий",  class: "veteran", price: 1499, full_price: 2000, items: { licenses: [{id:"reanimation", days:30},{id: "car", days: 30},{id: "moto", days: 30},{id: "truck", days: 30},{id: "weapon", days: 30},{id: "med", days: 30}]}},
]
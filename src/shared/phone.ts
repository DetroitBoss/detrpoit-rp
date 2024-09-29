import {jobsList} from "./jobs";
import {ORDER_MENU_POS} from "./order.system";
import {GR6_BASE_POS} from "./gr6";
import {npcGrabCarSetting} from "./vehicles";
import {RACE_REGISTER_POS} from "./race";
import {DUELS_REGISTER_POS} from "./duels";
import {FINE_AIR_POS, FINE_CAR_POS} from "./fine.car";
import {TAXI_CONF} from "./taxi";
import {CONSTRUCTION_REGISTER_POS} from "./construction";
import {DRIFT_MAP_EXIT} from "./drift";

export interface Contact {
    groupName: string;
    contactId?: number;
    contactName?: string;
    contactNumber?: number;
}

export interface IPhoneMessengerDialogDTO {
    contactName: string,
    lastMessage: string,
    unreadMessages: boolean,
    time: number
    number: number
}

export interface IPhoneMessengerMessageDTO {
    text: string
    sender: number
    target: number
    time: number
    read: boolean
    gps: [number, number]
}

export interface PhoneSettings {
    /** Звуковые оповещения при СМС */
    sound?: boolean;
    /** Авиарежим */
    aviamode?: boolean;
    /** Тёмный цветовой режим */
    dark?: boolean;
    /** Увеличеный режим */
    big?: boolean;
    /** Уменьшать если курсор не в телефоне */
    minimize?: boolean;
    /** Фоновое изображение */
    background?: string;
}

export interface PhoneHistory {
    number: number;
    type: "fromme" | "tome" | "frommeC" | "tomeC" | "tommeMissed";
    time: string;
    count: number;
}[]

export interface BankingHistoryItem { id: number, text: string, type: "remove" | "add" | "reject", sum: number, time: number, target: string, ticket: string }


export const PHONE_GPS_STATIC = [
    {
        name: "Работы",
        id: "jobs",
        cats: [
            {
                name: "Начальные работы", items: jobsList.map(q => {
                    return [q.name, q.pos.x, q.pos.y, q.pos.z]
                })
            },
            {
                name: "Основные работы", items: [
                    ...ORDER_MENU_POS.map((item, index) => {
                      return [`Доставка продукции ${index+1}`, item.x, item.y, item.z]
                    }),
                    ["Инкассаторская служба Gruppe Sechs", GR6_BASE_POS.x, GR6_BASE_POS.y, GR6_BASE_POS.z],
                    ["Ламар", npcGrabCarSetting.npcPos.x, npcGrabCarSetting.npcPos.y, npcGrabCarSetting.npcPos.z],
                    ["Такси", TAXI_CONF.carRent.pos.x, TAXI_CONF.carRent.pos.y, TAXI_CONF.carRent.pos.z],
                    ["Ремонт квартир", CONSTRUCTION_REGISTER_POS.x, CONSTRUCTION_REGISTER_POS.y, CONSTRUCTION_REGISTER_POS.z],
                ]
            }
        ]
    },
    {
        name: "Досуг",
        id: "games",
        cats: [
            {
                name: "Центры развлечений", items: [
                    ["Гонки", RACE_REGISTER_POS[0].x, RACE_REGISTER_POS[0].y, RACE_REGISTER_POS[0].z],
                    ["Дуэли", DUELS_REGISTER_POS.x, DUELS_REGISTER_POS.y, DUELS_REGISTER_POS.z],
                    ["Дрифт", DRIFT_MAP_EXIT.x, DRIFT_MAP_EXIT.y, DRIFT_MAP_EXIT.z],

                ]
            },
        ]
    },
    {
        name: "Инфраструктура",
        id: "info",
        cats: [
            {
                name: "Штрафстоянки", items: FINE_CAR_POS.map((q, i) => {
                    return ["Штрафстоянка №"+(i+1), q.x, q.y, q.z]
                })
            },
            {
                name: "Авиа Штрафстоянки", items: FINE_AIR_POS.map((q, i) => {
                    return ["Ави Штрафстоянка №"+(i+1), q.x, q.y, q.z]
                })
            },
        ]
    }
]
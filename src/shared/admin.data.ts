interface AdminItem {
    /** Уровень админки */
    level: number;
    /** Название роли */
    name: string;
    /** Бонус к пейдею */
    money: number;
    /** Бонус к пейдею в виде донат валюты */
    donate_money?: number;
}
export const ADMIN_DATA: AdminItem[] = [
    {level: 1, name: "Модератор", money: 0},
    {level: 2, name: "Администратор", money: 0},
    {level: 3, name: "Администратор", money: 0},
    {level: 4, name: "Администратор", money: 0},
    {level: 5, name: "Администратор", money: 0},
    {level: 6, name: "Красный администратор", money: 0},
    {level: 7, name: "Специальный администратор", money: 0}
]

/** ЗП хелпера при PayDay*/
export const HELPER_PAYDAY_MONEY = [
    150,
    300,
    500,
]

export const enum REWARD_ADMIN_POINTS {
    CLOSE_TICKET = 1,
    MESSAGE_TICKET = 0,
    KICK = 1,
    JAIL = 2,
    WARN = 5,
    BAN = 5,
    CMUTE = 2,
    VMUTE = 2,
}

export interface AdminStatsData extends AdminStatsDataBase, AdminStatsDataTasks {}
export interface HelperStatsData extends AdminStatsDataBase, HelperStatsDataTasks {}

export interface AdminStatsDataTasks {
    kick: number,
    jail: number,
    warn: number,
    ban: number,
    cmute: number,
    vmute: number,
    close: number,
    message: number,
}
export interface HelperStatsDataTasks {
    close: number,
    message: number,
}

export interface AdminStatsDataBase {
    id: number,
    points: number,
}
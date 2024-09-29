export type FileLogType =
    "fractionChest"
    | "PlayerKill"
    | "PlayerDeath"
    | "PlayerJoin"
    | "PlayerLeave"
    | "codeInjection"
    | "anticheat"
    | "AdminJob"
    | "PlayerBuy"
    | "news"
    | "warningLog"
    | "errorLog"
    | "addCrypto"
    | "removeCrypto"
    | "addMoney"
    | "removeMoney"
    | "addChips"
    | "removeChips"
    | "addBankMoney"
    | "removeBankMoney"
    | "gosJob"
    | "fpsDebug"
    | "fractionKick"
    | "fractionInvite"
    | "fractionRank"
    | "AdminBan"
    | "DonateMoney"
    | "familyInvite"
    | "famAction"
    | "exchange"
    | "candiesAdd"
    | "lollipops"
    | "diving"
    | "battlePass"
    | "houses"
    | "tabletFraction"

export type FamilyLogType =
    "intoFamily"
    | "leaveFamily"
    | "addDonate"
    | "removeDonate"
    | "addMoney"
    | "removeMoney"
    | "addCargo"
    | "removeCargo"
    | "addPoints"
    | "removePoints"


export const logTypesList: [FileLogType, string][] = [
    ['codeInjection', 'Взлом безопасности'],
    ['anticheat', 'Античит'],
    ['AdminJob', 'Действия администратора'],
    ['AdminBan', 'Блокировки'],
    ['PlayerBuy', 'Покупка игроком'],
    ['PlayerKill', 'Убийство'],
    ['PlayerDeath', 'Смерть'],
    ['news', 'Новости'],
    ['news', 'Новости'],
    ['addMoney', 'Получение денег'],
    ['removeMoney', 'Списание денег'],
    ['addChips', 'Получение фишек'],
    ['removeChips', 'Списание фишек'],
    ['addBankMoney', 'Получение банковских денег'],
    ['removeBankMoney', 'Списание банковских денег'],
    ['gosJob', 'Действия гос сотрудника'],
    ['fpsDebug', 'FPS Отладка'],
    ['fractionKick', 'Кик с фракции'],
    ['fractionInvite', 'Инвайт во фракцию'],
    ['fractionRank', 'Ранг во фракции'],
    ['PlayerJoin', 'Игрок зашёл на сервер'],
    ['PlayerLeave', 'Игрок покинул сервер'],
    ['fractionChest', 'Фракционные склады'],
    ['DonateMoney', 'Манипуляции с коинами']
]

export const getLogTypeName = (id: FileLogType) => {
    return logTypesList.find(q => q[0] === id) ? logTypesList.find(q => q[0] === id)[1] : '!!!ОШИБКА!!!'
}

export const AdminStatsLog = 4
export const HelperStatsLog = 3
export const LogAccessLevel = 2
export const addBlackList = 5

export interface MyData {
    id: number;
    level: number;
    online: boolean;
    name: string;
}

export interface FetchedData {
    regToday: number;
    authToday: number;
    regYesterday: number;
    authYesterday: number;
    serverData: ServerData;
}

export interface ServerData { online: number, maxplayers: number, masterposition: number, allservers: number, peak: number, name: string }


export const logDomain = `rage.onyx-gta.ru`;

export interface UserTableData {
    id: number;
    online: number;
    rp_name: string;
    money: number;
    bank: number;
    bank_number: string;
    admin: number;
    helper: number;
    fraction: number;
    rank: number;
    register: number;
    enter: number;
    vip_status: string;
    vip_time: number;
}
export interface UserData extends UserTableData {
    played_time: number;
    lic: string;
    social: string;
    social_register: string;
    ip_reg: string;
    ip_last: string;
    donate: number | null;
    register: number;
    enter: number;
    date_ban: number;
    account: number;
}

export interface AdminItem {
    id: number;
    lvl: number;
    name: string;
    online: boolean;
    reports: number;
    played_time: number;
}


export interface LogItem {
    id: number;
    type: FileLogType;
    time: number;
    target?: number;
    userId: number;
    text: string;
}
export interface TradeLogItem {
    id: number;
    user_id: number;
    action: string;
    price: number;
    coins_before: number;
    coins_after: number;
    datetime: string;
}
export interface UnitPayLogItem {
    id: number;
    unitpay_id: number;
    account: number;
    sum: number;
    create_time: number;
    complete_time: number;
    status: number;
}


export interface BlackListData {
    id: number;
    steam?: string;
    lic?: string;
    guid: string;
    rgscId: bigint;
    reason: string;
}
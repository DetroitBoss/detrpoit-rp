export enum FRACTION_RIGHTS {
    CHANGE_RANKS,
    WARNS,
    KICK,
    MONEY,
    STORAGE,
    VEHICLES,
    AWARDS,
    DOORS,
    INVITE,
    DEPARTMENT,
    GOVERNMENT,
    BACK_CAR,
    BIZWAR
}

export const ALL_FRACTION_RIGHTS = [
    FRACTION_RIGHTS.CHANGE_RANKS,
    FRACTION_RIGHTS.WARNS,
    FRACTION_RIGHTS.KICK,
    FRACTION_RIGHTS.MONEY,
    FRACTION_RIGHTS.STORAGE,
    FRACTION_RIGHTS.VEHICLES,
    FRACTION_RIGHTS.AWARDS,
    FRACTION_RIGHTS.DOORS,
    FRACTION_RIGHTS.INVITE,
    FRACTION_RIGHTS.DEPARTMENT,
    FRACTION_RIGHTS.GOVERNMENT,
    FRACTION_RIGHTS.BACK_CAR,
    FRACTION_RIGHTS.BIZWAR
]

export const GOV_RIGHTS = [
    FRACTION_RIGHTS.DEPARTMENT,
    FRACTION_RIGHTS.GOVERNMENT
]

export const MAFIA_RIGHTS = [
    FRACTION_RIGHTS.BIZWAR
]

export function getRightName(right: FRACTION_RIGHTS) {
    if (right === FRACTION_RIGHTS.CHANGE_RANKS) {
        return "Изменение рангов";
    }

    if (right === FRACTION_RIGHTS.WARNS) {
        return "Выдавать и снимать выговоры";
    }

    if (right === FRACTION_RIGHTS.KICK) {
        return "Увольнять из фракции";
    }

    if (right === FRACTION_RIGHTS.MONEY) {
        return "Управление денежным сейфом";
    }

    if (right === FRACTION_RIGHTS.STORAGE) {
        return "Настройка склада";
    }

    if (right === FRACTION_RIGHTS.VEHICLES) {
        return "Настройка рангов для транспорта";
    }

    if (right === FRACTION_RIGHTS.AWARDS) {
        return "Выдавать премии";
    }

    if (right === FRACTION_RIGHTS.DOORS) {
        return "Открывать/закрывать двери во фракции";
    }

    if (right === FRACTION_RIGHTS.INVITE) {
        return "Приглашать игроков во фракцию"
    }

    if (right === FRACTION_RIGHTS.DEPARTMENT) {
        return "Доступ к рации департамента";
    }

    if (right === FRACTION_RIGHTS.GOVERNMENT) {
        return "Доступ к гос. волне";
    }

    if (right === FRACTION_RIGHTS.BACK_CAR) {
        return "Возвращать авто в гараж";
    }

    if (right === FRACTION_RIGHTS.BIZWAR) {
        return "Забивать войну за бизнес";
    }
}

export interface IFractionRank {
    name: string
    salary: number
    award: number
    rights: FRACTION_RIGHTS[]
    isLeader?: boolean
}

export interface IFractionMemberDTO {
    id: number
    name: string
    rank: number
    warns: number
    tag: string
    lastSeen: number
    tracker: boolean
    tracking?: boolean
}

export interface IFractionGarageDTO {
    id: number
    cars: [string, string, number, number, number, number, number, number, number, number, number][]
}

export interface IFractionStorageDTO {
    id: number
    items: [number, number, number][]
}

export interface IFractionStorageLog {
    who: string
    time: number
    text: string
}

export interface IFractionData {
    id: number;
    members: IFractionMemberDTO[],
    messages: { name: string, id: number, time: number, text: string }[],
    alerts?: { id: number, actual:boolean, name: string, text:string, timestamp: number, type: number, callAnswered?: string, code?: number, isGlobal: boolean, pos: [number, number]}[],
    playerPosition: {x: number, y: number, z: number, h: number, d: number},
    mafiabiz?: { id: number, name: string, price: number, type: number, stype: number}[]
}
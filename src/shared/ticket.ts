/**
 * Описание тикета. Используется для вывода в списке имеющихся тикетов для админов.
 */
export interface TicketDescription {
    /** ID тикета */
    id: number,

    /** ID игрока */
    creatorId: number,
    
    /** Имя игрока */
    creatorName: string,

    /** Тип игрока */
    creatorType: TicketCreatorType
    
    /** Время создания диалога */
    createTime: number;

    /** Имя админа, взявшего тикет */
    adminName?: string

    /** Сообщение от игрока */
    message: string,
}

/**
 * Полная информацию по тикету. Используется когда админ открывает его.
 */
export interface TicketFullData {
    description: TicketDescription
    
    /** Сообщения от админа */
    answers?: Array<string>
    
    /** Стата игрока */
    userInfo?: Array<[string, any]>
}

export enum TicketCreatorType {
    RegularPlayer,
    Media,
    Leader
}
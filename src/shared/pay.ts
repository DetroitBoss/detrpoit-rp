export enum PayType {
    CASH,
    CARD,
    COMPANY
}

export interface PayData { paytype: PayType, pin: string }
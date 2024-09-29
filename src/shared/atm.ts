export const ATM_PROPS = [
    { model: 506770882, offset: { x: 0.0, y: -0.58, z: 1 }, task: "PROP_HUMAN_ATM"},
    { model: -870868698, offset: { x: 0.0, y: -0.88, z: 1 }, task: "PROP_HUMAN_ATM"},
    { model: -1126237515, offset: { x: 0.0, y: -0.58, z: 1 }, task: "PROP_HUMAN_ATM"},
    { model: -1364697528, offset: { x: 0.0, y: -0.58, z: 1 }, task: "PROP_HUMAN_ATM"},
]

export interface BankHistoryItem {
    id: number;
    text: string;
    type: "remove" | "add" | "reject";
    sum: number;
    time: number;
    target: string;
    ticket: string;
}

export const ATM_BUTTONS: {id: number, name: string, icon: string}[] = [
    {id: 0, icon: 'wallet', name: 'Снятие налички'},
    {id: 1, icon: 'creditcard-income', name: 'Перевод на другой счёт'},
    {id: 2, icon: 'table', name: 'История операций'},
    {id: 3, icon: 'command', name: 'Смена пин-кода'},
]

export interface BankTax {
    id: number,
    name: string,
    address?: string,
    numberPlate?: string,
    maxTaxAmount: number,
    taxAmountLeft: number
}

export interface BankTaxes {
    houses: BankTax[],
    businesses: BankTax[]
    warehouse: BankTax[]
}
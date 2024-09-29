export interface IDonateStorageItem {
    id: number
    item_id: number
    serial: string
}

export interface IDonateStorageMenu {
    show: boolean
    name: string
    styles: any
    toStorage: boolean
}
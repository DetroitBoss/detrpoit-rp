import { KeyTypes } from "../enums/keyType.enum";

export interface Key {
    type?: KeyTypes,
    value?: string,
}
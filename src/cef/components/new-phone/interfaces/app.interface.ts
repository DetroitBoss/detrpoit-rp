import { PhonePages } from '../enums/phonePage.enum';
export interface App {
    isBig: boolean,
    name: string,
    icon: string,
    page: PhonePages,
    isBlock?: boolean
}
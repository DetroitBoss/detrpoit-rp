import {CoinsBonus} from "./CoinsBonus";
import {MoneyBonus} from "./MoneyBonus";
import {IBonus} from "./IBonus";

interface Bonuses {
    types: { type: string, name: string, bonus: IBonus<any> }[]
}

export const promocodeBonuses: Bonuses = {
    types: [
        { type: 'coins', name: 'Коины', bonus: new CoinsBonus() },
        { type: 'money', name: 'Деньги', bonus: new MoneyBonus() }
    ]
}

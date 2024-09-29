import {PokerCard} from "../card";
import {CombinationType, IPokerCombination} from "./combinations";

export class Highcard implements IPokerCombination {
    public readonly type: CombinationType;
    private readonly _cards: Array<PokerCard>;
    public highCard: PokerCard

    constructor(cards: Array<PokerCard>) {
        this.type = CombinationType.Highcard;
        this._cards = cards;
    }

    collected(): boolean {
        const maxValue = Math.max(...this._cards.map(c => Number(c.nominal)))
        this.highCard = this._cards.find(c => c.nominal == maxValue)

        return true;
    }

    isBigger(anotherCombination: IPokerCombination): boolean {
        if (anotherCombination.type == this.type) {
            // Если номинал этой комбинации выше друго пары
            return this.highCard.nominal > (<Highcard>anotherCombination).highCard.nominal
        }
        return this.type > anotherCombination.type
    }
}
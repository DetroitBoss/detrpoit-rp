import {PokerCard} from "../card";
import {CombinationType, IPokerCombination} from "./combinations";

export class Flush implements IPokerCombination {
    public readonly type: CombinationType;
    private readonly _cards: Array<PokerCard>;
    public higherCard: PokerCard
    public totalPower: number

    constructor(cards: Array<PokerCard>) {
        this.type = CombinationType.Flush;
        this._cards = cards;
    }

    collected(): boolean {
        // Сортируем по мастям
        this._cards.sort((a, b) => a.suit - b.suit)

        for (let i = 0; i < this._cards.length - 4; i++) {
            if (this._cards[i].suit == this._cards[i + 4].suit) {
                this.totalPower = this._cards.map(c => c.nominal).reduce((a, b) => a + b, 0)
                return true
            }
        }

        return false;
    }

    isBigger(anotherCombination: IPokerCombination): boolean {
        if (anotherCombination.type == this.type) {
            return this.totalPower > (<Flush>anotherCombination).totalPower
        }
        return this.type > anotherCombination.type
    }
}
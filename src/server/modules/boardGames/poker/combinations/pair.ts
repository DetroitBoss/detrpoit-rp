import {PokerCard} from "../card";
import {CombinationType, IPokerCombination} from "./combinations";

export class Pair implements IPokerCombination {
    public readonly type: CombinationType;
    private readonly _cards: Array<PokerCard>;
    public readonly highCard: Array<PokerCard> = new Array<PokerCard>(2)

    constructor(cards: Array<PokerCard>) {
        this.type = CombinationType.Pair;
        this._cards = cards;
    }

    collected(): boolean {
        this._cards.sort((a, b) => a.nominal - b.nominal)

        for (let i = 0; i < this._cards.length - 1; i++) {
            if (this._cards[i].nominal == this._cards[i + 1].nominal) {
                this.highCard[0] = this._cards[i]
                this.highCard[1] = this._cards[i + 1]
                return true
            }
        }

        return false
    }

    isBigger(anotherCombination: IPokerCombination): boolean {
        if (anotherCombination.type == this.type) {
            // Если номинал этой комбинации выше друго пары
            return this.highCard[0].nominal > (<Pair>anotherCombination).highCard[0].nominal
        }
        return this.type > anotherCombination.type
    }
}
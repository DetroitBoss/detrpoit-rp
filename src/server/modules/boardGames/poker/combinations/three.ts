import {PokerCard} from "../card";
import {CombinationType, IPokerCombination} from "./combinations";

export class Three implements IPokerCombination {
    public readonly type: CombinationType;
    private readonly _cards: Array<PokerCard>;
    public higherCard: PokerCard

    constructor(cards: Array<PokerCard>) {
        this.type = CombinationType.Three;
        this._cards = cards;
    }

    collected(): boolean {
        this._cards.sort((a, b) => a.nominal - b.nominal)

        for (let i = 0; i < this._cards.length - 2; i++) {
            // 3 карты подряд одного номинала
            if (this._cards[i].nominal == this._cards[i + 2].nominal) {
                this.higherCard = this._cards[i]
                return true
            }
        }

        return false
    }

    isBigger(anotherCombination: IPokerCombination): boolean {
        if (anotherCombination.type == this.type) {
            return this.higherCard.nominal > (<Three>anotherCombination).higherCard.nominal
        }
        return this.type > anotherCombination.type
    }
}
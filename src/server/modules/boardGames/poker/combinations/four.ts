import {PokerCard} from "../card";
import {CombinationType, IPokerCombination} from "./combinations";

export class Four implements IPokerCombination {
    public readonly type: CombinationType;
    private readonly _cards: Array<PokerCard>;
    public higherCard: PokerCard

    constructor(cards: Array<PokerCard>) {
        this.type = CombinationType.Four;
        this._cards = cards;
    }

    collected(): boolean {
        this._cards.sort((a, b) => a.nominal - b.nominal)

        for (let i = 0; i < this._cards.length - 3; i++) {
            // 4 карты подряд одного номинала
            if (this._cards[i].nominal == this._cards[i + 3].nominal) {
                this.higherCard = this._cards[i]
                return true
            }
        }
        return false;
    }

    isBigger(anotherCombination: IPokerCombination): boolean {
        if (anotherCombination.type == this.type) {
            return this.higherCard > (<Four>anotherCombination).higherCard
        }
        return this.type > anotherCombination.type
    }
}
import {Nominal, PokerCard} from "../card";
import {CombinationType, IPokerCombination} from "./combinations";

export class Street implements IPokerCombination {
    public readonly type: CombinationType;
    private readonly _cards: Array<PokerCard>;
    public higherCard: PokerCard

    constructor(cards: Array<PokerCard>) {
        this.type = CombinationType.Street;
        this._cards = cards;
    }

    collected(): boolean {
        for (let n = Nominal.Two; n <= Nominal.Ten; n++) {
            if (this._cards.find(c => c.nominal == n) &&
                this._cards.find(c => c.nominal == n + 1) &&
                this._cards.find(c => c.nominal == n + 2) &&
                this._cards.find(c => c.nominal == n + 3) &&
                this._cards.find(c => c.nominal == n + 4)
            ) {
                this.higherCard = this._cards.find(c => c.nominal == n + 4)
                return true
            }
        }

        return false;
    }

    isBigger(anotherCombination: IPokerCombination): boolean {
        if (anotherCombination.type == this.type) {
            return this.higherCard.nominal > (<Street>anotherCombination).higherCard.nominal
        }
        return this.type > anotherCombination.type
    }
}
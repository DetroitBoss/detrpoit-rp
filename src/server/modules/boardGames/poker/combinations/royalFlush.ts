import {Nominal, PokerCard} from "../card";
import {StreetFlush} from "./streetFlush";
import {CombinationType, IPokerCombination} from "./combinations";

export class RoyalFlush implements IPokerCombination {
    public readonly type: CombinationType;
    private readonly _cards: Array<PokerCard>;
    public higherCard: PokerCard

    constructor(cards: Array<PokerCard>) {
        this.type = CombinationType.RoyalFlush;
        this._cards = cards;
    }

    collected(): boolean {
        this._cards.sort((a, b) => a.suit - b.suit)
        const streetFlush = new StreetFlush(this._cards)
        if (streetFlush.collected() && streetFlush.higherCard.nominal == Nominal.Ace) {
            this.higherCard = streetFlush.higherCard
            return true
        }
        return false
    }

    isBigger(anotherCombination: IPokerCombination): boolean {
        if (anotherCombination.type == this.type) {
            return this.higherCard > (<RoyalFlush>anotherCombination).higherCard
        }
        return this.type > anotherCombination.type
    }
}
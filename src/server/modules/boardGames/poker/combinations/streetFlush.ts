import {PokerCard} from "../card";
import {Street} from "./street";
import {Flush} from "./flush";
import {CombinationType, IPokerCombination} from "./combinations";

export class StreetFlush implements IPokerCombination {
    public readonly type: CombinationType;
    private readonly _cards: Array<PokerCard>;
    public higherCard: PokerCard

    constructor(cards: Array<PokerCard>) {
        this.type = CombinationType.StreetFlush;
        this._cards = cards;
    }

    collected(): boolean {
        this._cards.sort((a, b) => a.nominal - b.nominal)
        const street = new Street(this._cards)

        if (street.collected()) {
            this._cards.splice(this._cards.indexOf(street.higherCard) + 1, 2)
            // Можно ли собрать флеш из карт стрита
            const flush = new Flush(this._cards)
            this.higherCard = street.higherCard
            return flush.collected();
        }
        return false;
    }

    isBigger(anotherCombination: IPokerCombination): boolean {
        if (anotherCombination.type == this.type) {
            return this.higherCard > (<StreetFlush>anotherCombination).higherCard
        }
        return this.type > anotherCombination.type
    }
}
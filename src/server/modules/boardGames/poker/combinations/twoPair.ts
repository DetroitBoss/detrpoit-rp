import {PokerCard} from "../card";
import {Pair} from "./pair";
import {CombinationType, IPokerCombination} from "./combinations";

export class TwoPair implements IPokerCombination {
    public readonly type: CombinationType;
    private readonly _cards: Array<PokerCard>;
    public higherPairCards: Array<PokerCard> = new Array<PokerCard>(2)

    constructor(cards: Array<PokerCard>) {
        this.type = CombinationType.TwoPair;
        this._cards = cards;
    }

    collected(): boolean {
        const firstPair = new Pair(this._cards)
        if (firstPair.collected()) {
            this._cards.splice(this._cards.indexOf(firstPair.highCard[0]), 1)
            this._cards.splice(this._cards.indexOf(firstPair.highCard[1]), 1)

            const secondPair = new Pair(this._cards)

            if (secondPair.collected()) {
                if (this._cards[0].nominal > secondPair.highCard[0].nominal) {
                    this.higherPairCards = firstPair.highCard
                } else {
                    this.higherPairCards = secondPair.highCard
                }
                return true
            }

            return false
        }

        return false
    }

    isBigger(anotherCombination: IPokerCombination): boolean {
        if (anotherCombination.type == this.type) {
            return this.higherPairCards[0].nominal > (<TwoPair>anotherCombination).higherPairCards[0].nominal
        }
        return this.type > anotherCombination.type
    }
}
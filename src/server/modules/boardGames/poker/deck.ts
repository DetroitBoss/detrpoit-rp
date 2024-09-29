import {Nominal, PokerCard, Suit} from "./card";
import {system} from "../../system";

export class PokerDeck {
    private readonly _cards: Array<PokerCard> = new Array<PokerCard>()

    constructor() {
        for (let suit = Suit.Heart; suit <= Suit.Spade; suit++)
            for (let nominal = Nominal.Two; nominal <= Nominal.Ace; nominal++)
            {
                this._cards.push(new PokerCard(suit, nominal))
            }
    }

    public extractCard(card: PokerCard): PokerCard {
        return this._cards.find(c => c.equal(card))
    }

    /** Достать рандомную карту из колоды */
    public extractRandomCard(): PokerCard {
        const card = system.randomArrayElement(this._cards)
        this._cards.splice(this._cards.indexOf(card), 1)

        return card
    }

    public extractRandomCards(cardsCount: number): PokerCard[] {
        const card = system.randomArrayElement(this._cards, cardsCount)
        card.forEach(c => this._cards.splice(this._cards.indexOf(c), 1))

        return card
    }
}
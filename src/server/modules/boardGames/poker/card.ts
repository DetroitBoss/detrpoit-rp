import {IPokerCardDTO, Nominal, Suit} from "../../../../shared/boardGames/poker/pokerCardDTO";

export class PokerCard
{
    public readonly suit: Suit
    public readonly nominal: Nominal

    constructor (suit: Suit, nominal: Nominal) {
        this.suit = suit;
        this.nominal = nominal;
    }

    public equal(anotherCard: PokerCard) {
        return this.suit == anotherCard.suit && this.nominal == anotherCard.nominal
    }

    public getDto(): IPokerCardDTO {
        return {
            nominal: this.nominal,
            suit: this.suit
        }
    }
}

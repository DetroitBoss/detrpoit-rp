export interface IPokerCardDTO {
    suit: Suit
    nominal: Nominal
}

export enum Suit {
    Heart,
    Diamond,
    Club,
    Spade
}

export enum Nominal {
    Two = 2,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Jack,
    Queen,
    King,
    Ace // = 14
}
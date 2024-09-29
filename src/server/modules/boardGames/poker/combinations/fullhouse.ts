import {PokerCard} from "../card";
import {Three} from "./three";
import {Pair} from "./pair";
import {CombinationType, IPokerCombination} from "./combinations";

export class Fullhouse implements IPokerCombination {
    public readonly type: CombinationType;
    private readonly _cards: Array<PokerCard>;
    public higherThreeCard: PokerCard
    public higherPairCard: PokerCard

    constructor(cards: Array<PokerCard>) {
        this.type = CombinationType.FullHouse;
        this._cards = cards;
    }

    collected(): boolean {
        this._cards.sort((a, b) => a.nominal - b.nominal)
        const three = new Three(this._cards)

        if (three.collected()) {
            this._cards.splice(this._cards.indexOf(three.higherCard), 3)
            const pair = new Pair(this._cards)

            if (pair.collected()) {
                this.higherThreeCard = three.higherCard
                this.higherPairCard = pair.highCard[0]

                return true;
            }

            return false;
        }

        return false;
    }

    isBigger(anotherCombination: IPokerCombination): boolean {
        if (anotherCombination.type == this.type) {
            let res: boolean
            this.higherThreeCard == (<Fullhouse>anotherCombination).higherThreeCard ?
                res = this.higherPairCard > (<Fullhouse>anotherCombination).higherPairCard
                : res = this.higherThreeCard > (<Fullhouse>anotherCombination).higherThreeCard

            return res
        }
        return this.type > anotherCombination.type
    }
}
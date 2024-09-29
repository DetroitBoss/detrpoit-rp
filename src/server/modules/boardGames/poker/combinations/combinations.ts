import {PokerCard} from "../card";
import {RoyalFlush} from "./royalFlush";
import {StreetFlush} from "./streetFlush";
import {Four} from "./four";
import {Fullhouse} from "./fullhouse";
import {Flush} from "./flush";
import {Street} from "./street";
import {Three} from "./three";
import {TwoPair} from "./twoPair";
import {Pair} from "./pair";
import {Highcard} from "./highcard";

export enum CombinationType {
    Highcard,
    Pair,
    TwoPair,
    Three,
    Street,
    Flush,
    FullHouse,
    Four,
    StreetFlush,
    RoyalFlush
}

export interface IPokerCombination {
    type: CombinationType;
    /** Собралась ли комбинация */
    collected(): boolean
    isBigger(anotherCombination: IPokerCombination): boolean
}

export const findBestCombination = (cards: PokerCard[]): IPokerCombination => {
    const fr = new RoyalFlush(cards)
    if (fr.collected()) return fr
    const sf = new StreetFlush(cards)
    if (sf.collected()) return sf
    const f4 = new Four(cards)
    if (f4.collected()) return f4
    const fh = new Fullhouse(cards)
    if (fh.collected()) return fh
    const fl = new Flush(cards)
    if (fl.collected()) return fl
    const st = new Street(cards)
    if (st.collected()) return st
    const t3 = new Three(cards)
    if (t3.collected()) return t3
    const t2 = new TwoPair(cards)
    if (t2.collected()) return t2
    const p2 = new Pair(cards)
    if (p2.collected()) return p2

    return new Highcard(cards)
}
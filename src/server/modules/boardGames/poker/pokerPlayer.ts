import {PokerCard} from "./card";
import {assertIsValidKeyGetter} from "react-data-grid/lib/utils";
import {IPokerPlayerDTO} from "../../../../shared/boardGames/poker/pokerPlayerDTO";
import {findBestCombination, IPokerCombination} from "./combinations/combinations";

export enum PokerMove {
    Undefined,
    Fold,
    Call,
    Raise,
    AllIn
}

export class PokerPlayer {
    private readonly _player: PlayerMp;
    private _cards: Array<PokerCard> = new Array<PokerCard>();
    private _balance: number;
    private _collectedCombination: IPokerCombination;

    public inGame: boolean;
    public currentMove: PokerMove
    public currentStageBetValue: number

    constructor(player: PlayerMp, balance: number = 0) {
        this._player = player
        this._balance = balance;
    }

    get collectedCombination(): IPokerCombination {
        return this._collectedCombination;
    }
    get balance(): number {
        return this._balance;
    }
    set balance(val: number) {
        this._balance = val
    }
    get player(): PlayerMp {
        return this._player;
    }

    public getDto(): IPokerPlayerDTO {
        return {
            inGame: this.inGame,
            balance: this.balance,
            currentStageBet: this.currentStageBetValue,
            userId: this.player.user.id
        }
    }

    public calculateCombination(tableCards: Array<PokerCard>) {
        this._collectedCombination = findBestCombination(this._cards.concat(tableCards))
    }

    /** Раздать карты игроку */
    public distributeCards(cards: Array<PokerCard>) {
        this.inGame = true
        this._collectedCombination = null
        this.clearCards()
        this._cards = cards
    }

    private clearCards() {
        this._cards = new Array<PokerCard>()
    }

    public fold() {
        this.inGame = false
        this.clearCards()
        this.currentStageBetValue = 0
        this.currentMove = PokerMove.Undefined
    }

    public call(currentBet: number) {
        this._balance -= currentBet
        this.currentStageBetValue = currentBet
        this.currentMove = PokerMove.Call
    }

    public raise(raisedValue: number) {
        this._balance -= raisedValue
        this.currentMove = PokerMove.Raise
        this.currentStageBetValue = raisedValue
    }

    /* Предложить игроку сделать ход */
    public suggestMove(currentBet: number) {
        const availableMoves = new Array<PokerMove>()
        // Игрок всегда может сбросить
        availableMoves.push(PokerMove.Fold)

        if (this.balance > 0) {
            availableMoves.push(PokerMove.AllIn)
            // Поднять можем если был колл не текущую ставку или есть баланс чтобы уровнять + 1
            if ((currentBet == this.currentStageBetValue)
                ||
                (this.balance > (currentBet - this.currentStageBetValue))
            )
                availableMoves.push(PokerMove.Raise)
        }
        if ((currentBet == this.currentStageBetValue)
            ||
            (currentBet > this.currentStageBetValue && this.balance >= (currentBet - this.currentStageBetValue))
        )
            availableMoves.push(PokerMove.Call)
        //todo: триггер на сеф
    }
}
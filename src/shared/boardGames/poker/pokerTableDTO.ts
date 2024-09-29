import {IPokerPlayerDTO} from "./pokerPlayerDTO";
import {IPokerCardDTO} from "./pokerCardDTO";

export enum DealingStage {
    WaitingForGame,
    Preflop,
    Flop,
    Tern,
    River
}

export interface IPokerTableDTO {
    /** Игроки за столом */
    players: Array<IPokerPlayerDTO>

    /** Текущая стадия текущей раздачи */
    dealingStage: DealingStage

    /** Игрок, делающий сейчас ставку */
    currentPlayer: IPokerPlayerDTO

    /** Карты, лежащие на столе */
    tableCards: Array<IPokerCardDTO>

    /** UserID дилера */
    dealerId: number
}
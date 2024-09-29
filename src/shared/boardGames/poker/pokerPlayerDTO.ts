export interface IPokerPlayerDTO {
    /** ID игрока из БД */
    userId: number

    /** Текущий баланс фишек за столом игрока */
    balance: number

    /** Кол-во фишек перед игроком (сделанных во время текущей стадии) */
    currentStageBet: number

    /** Находится ли игрок в игре (текущая раздача) */
    inGame: boolean
}
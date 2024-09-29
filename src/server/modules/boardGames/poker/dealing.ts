import {PokerBoardGame} from "./PokerBoardGame";
import {PokerMove, PokerPlayer} from "./pokerPlayer";
import {PokerCard} from "./card";
import {PokerDeck} from "./deck";
import {DealingStage, IPokerTableDTO} from "../../../../shared/boardGames/poker/pokerTableDTO";
import {CustomEvent} from "../../custom.event";

/**
 * Разадача
 */
export class PokerDealing {
    private readonly _game: PokerBoardGame;
    private _currentStage: DealingStage
    /** Игрок, делающий ставку */
    private _currentPlayer: PokerPlayer
    private _currentBet: number = 0
    private _totalBank: number = 0
    private _deck: PokerDeck
    /** Игрок, который будет делать последнюю ставку в стадии */
    private _lastPlayer: PokerPlayer
    private _tableCards: Array<PokerCard> = new Array<PokerCard>()

    constructor(game: PokerBoardGame) {
        this._game = game;
    }

    public get currentStage() {
        return this._currentStage
    }

    public getDto(): IPokerTableDTO {
        return {
            currentPlayer: this._currentPlayer.getDto(),
            dealingStage: this.currentStage,
            players: this._game.lobby.players.map(p => p.getDto()),
            dealerId: this._game.lobby.dealer.player.user.id,
            tableCards: this._tableCards.map(c => c.getDto())
        }
    }

    public onPlayerMadeMove(player: PlayerMp, move: PokerMove, raisedValue: number) {
        if (player != this._currentPlayer.player)
            throw new Error('Wrong player trying to make move')

        this._currentPlayer.currentMove = move
        let shouldFinishStage = this._currentPlayer == this._lastPlayer

        switch (move) {
            case PokerMove.Undefined:
                break;
            case PokerMove.Fold:
                this._currentPlayer.fold()
                break;
            case PokerMove.Call:
                this._currentPlayer.call(this._currentBet)
                break;
            case PokerMove.Raise:
                this._currentBet = raisedValue
                this._currentPlayer.raise(raisedValue)
                // Последним будет делать ставку чел, который поднял, если после него не поднимут еще раз
                this._lastPlayer = this._currentPlayer
                shouldFinishStage = false
                break;
            case PokerMove.AllIn:
                break;
        }
        this._game.lobby.players.map(p => CustomEvent.triggerCef(p.player, 'poker:player:move', this._currentPlayer.getDto()))
        if (shouldFinishStage)
            this.startNextStage()
        this.suggestMoveToNextPlayer()
    }

    public suggestMoveToNextPlayer() {
        this._currentPlayer = this._game.lobby.getNextInGamePlayer(this._currentPlayer)
        this._currentPlayer.suggestMove(this._currentBet)
    }

    private startNextStage() {
        this._game.lobby.players.forEach(p => {
            p.currentStageBetValue = 0
            p.currentMove = PokerMove.Undefined
        })
        this._totalBank += this._currentBet
        this._currentBet = 0

        switch (this.currentStage) {
            case DealingStage.WaitingForGame:
                this.startPreflop()
                this._currentStage = DealingStage.Preflop
                break;
            case DealingStage.Preflop:
                this.startFlop()
                this._currentStage = DealingStage.Flop
                break;
            case DealingStage.Flop:
                this.startTern()
                this._currentStage = DealingStage.Tern
                break;
            case DealingStage.Tern:
                this.startRiver()
                this._currentStage = DealingStage.River
                break;
            case DealingStage.River:
                // Если закончился ривер, то делаем подсчет победителя и включаем префлоп
                this.finish()
                this._currentStage = DealingStage.WaitingForGame
                break;
        }
        //todo: триггер на сеф с инфой о раздаче
        this.suggestMoveToNextPlayer()
    }

    private finish() {
        const finishedPlayers = this._game.lobby.players.filter(p => p.inGame)
        if (finishedPlayers.length == 1) this.setWinner(finishedPlayers[0])
        else {
            finishedPlayers.forEach(p => p.calculateCombination(this._tableCards))
            // Сортируем по старшинству комбинации
            finishedPlayers.sort((a, b) =>
                a.collectedCombination.type - b.collectedCombination.type)
            const winCombinationType = finishedPlayers[0].collectedCombination.type
            const playersWithWinCombination = finishedPlayers.filter(p => p.collectedCombination.type == winCombinationType)
            let winner = playersWithWinCombination[0]
            playersWithWinCombination.forEach(p => {
                if (p.collectedCombination.isBigger(winner.collectedCombination))
                    winner = p
            })
            this.setWinner(winner)
        }
        // Даем время посмотреть результаты
        setTimeout(this.startPreflop, 6000)
    }

    private setWinner(player: PokerPlayer) {
        player.balance += this._totalBank
    }

    private startPreflop() {
        // Устанавливаем дилера на эту раздачу
        this._game.lobby.setNextDealer()
        this._deck = new PokerDeck()
        this._totalBank = 0
        this._tableCards = new Array<PokerCard>()

        this._game.lobby.players.forEach(p => p.distributeCards(this._deck.extractRandomCards(2)))

        if (this._game.lobby.smallBlind.balance < this._game.settings.smallBlind)
            this._game.lobby.removePlayer(this._game.lobby.smallBlind.player)

        if (this._game.lobby.bigBlind.balance < this._game.settings.smallBlind * 2)
            this._game.lobby.removePlayer(this._game.lobby.bigBlind.player)

        // Делаем текущего игрока следующим за большим блайндом, дальше все автоматически
        this._currentBet = this._game.settings.smallBlind * 2
        this._currentPlayer = this._game.lobby.getNextPlayer(this._game.lobby.bigBlind)
        // Если никто не поднимет ставку, то бигблайнд будет последним делать ставку
        this._lastPlayer = this._game.lobby.bigBlind

        this._currentPlayer.suggestMove(this._currentBet)
    }

    private startFlop() {
        // Открываем на стол первые 3 карты
        this._tableCards.concat(this._deck.extractRandomCards(3))
        this._game.lobby.players.map(p => CustomEvent.triggerCef(p.player, 'poker:table:updateCards', this._tableCards.map(c => c.getDto())))
    }

    private startTern() {
        this._tableCards.push(this._deck.extractRandomCard())
        this._game.lobby.players.map(p => CustomEvent.triggerCef(p.player, 'poker:table:updateCards', this._tableCards.map(c => c.getDto())))
    }

    private startRiver() {
        this._tableCards.push(this._deck.extractRandomCard())
        this._game.lobby.players.map(p => CustomEvent.triggerCef(p.player, 'poker:table:updateCards', this._tableCards.map(c => c.getDto())))
    }
}
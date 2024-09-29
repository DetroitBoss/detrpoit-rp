import {PokerBoardGame} from "./PokerBoardGame";
import {PokerPlayer} from "./pokerPlayer";
import {menu} from "../../menu";
import {saveEntity} from "../../typeorm";
import {CustomEvent} from "../../custom.event";
import {IPokerTableDTO} from "../../../../shared/boardGames/poker/pokerTableDTO";

export class PokerGameLobby {
    private readonly _players: Array<PokerPlayer> = new Array<PokerPlayer>()
    private _game: PokerBoardGame;

    private _dealer: PokerPlayer

    constructor(game: PokerBoardGame) {
        this._game = game;
    }

    public get players() {
        return this._players
    }
    public get dealer() {
        return this._dealer
    }
    public get smallBlind() {
        return this.getNextPlayer(this._dealer)
    }
    public get bigBlind() {
        return this.getNextPlayer(this.smallBlind)
    }

    public getNextPlayer(playerFrom: PokerPlayer) {
        const nextPlayerIdx = this._players.indexOf(playerFrom) + 1
        if (this._players.length <= nextPlayerIdx)
            return this._players[0]
        else return this._players[nextPlayerIdx]
    }

    public getNextInGamePlayer(playerFrom: PokerPlayer) {
        const nextPlayerIdx = this._players.filter(p => p.inGame).indexOf(playerFrom) + 1
        if (this._players.length <= nextPlayerIdx)
            return this._players[0]
        else return this._players[nextPlayerIdx]
    }

    public setNextDealer() {
        if (this._players.length <= 0)
            throw new Error('Attempt to set next dealer with empty lobby')

        // Если первый дилер
        if (!this._dealer)
            this._dealer = this._players[0]
        else this._dealer = this.getNextPlayer(this._dealer)
    }

    public async addPlayer(player: PlayerMp): Promise<void> {
        if (player.user.chips < this._game.settings.smallBlind * 2) {
            return player.notify('Недостаточно фишек для игры. Приобрести можно в казино', 'warning')
        }

        const response = await menu.input(
            player,
            `Укажите число фишек, которые вы возьмете за стол (макс. ${player.user.chips})`,
            0,
            this._game.settings.smallBlind * 2,
            'int'
        )

        if (isNaN(response) || response < 0 || response > 10 * this._game.settings.smallBlind * 2) {
            return player.notify('Ошибка ввода', 'warning')
        }

        player.user.removeChips(response, false, 'Игра за покерным столом')

        const pokerPlayer = new PokerPlayer(player, response)
        if (this._game.started) {
            pokerPlayer.inGame = false
        }
        this.players.map(p => CustomEvent.triggerCef(p.player, 'poker:addPlayer', pokerPlayer.getDto()))
        this._players.push(pokerPlayer)
        CustomEvent.triggerCef(player, 'poker:startGame', this._game.dealing.getDto())

        if (!this._game.started && this._players.length >= this._game.settings.playersToStart) {
            this._game.start()
        }
    }

    public async removePlayer(player: PlayerMp): Promise<void> {
        const removedPokerPlayer = this._players.splice(this._players.findIndex(p => p.player == player), 1)
        if (!removedPokerPlayer?.length) return

        player.user.addChips(removedPokerPlayer[0].balance, false, 'Покинул покерный стол с выигрышем')
        await saveEntity(player.user.entity)

        this.players.map(p => CustomEvent.triggerCef(p.player, 'poker:removePlayer', removedPokerPlayer[0].getDto()))

        if (this._game.started && this._players.length <= this._game.settings.playersToLeave) {
            this._game.stop()
        }
    }
}
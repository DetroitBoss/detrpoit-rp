import {IField} from "./fields/IField";
import {StartField} from "./fields/StartField";
import {FirmField} from "./fields/FirmField";
import {Firm} from "./firm";
import {TaxField} from "./fields/TaxField";
import {PrisonField} from "./fields/PrisonField";
import {TeleportField} from "./fields/TeleportField";
import {JackpotField} from "./fields/JackpotField";
import {BonusIncomeField} from "./fields/BonusIncomeField";
import {SKipField} from "./fields/SkipField";
import {MonopolyPlayer} from "./monopolyPlayer";
import {system} from "../../system";
import {MonopolyStreet} from "./monopolyStreet";
import {CustomEvent} from "../../custom.event";
import {colshapes} from "../../checkpoints";
import {IBoardGameMonopolyTable} from "../../../../shared/boardGames/tables";

export class MonopolyGame {
    public fields: Array<IField> = new Array<IField>()
    public players: Array<MonopolyPlayer> = new Array<MonopolyPlayer>()
    private _currentPlayer: MonopolyPlayer
    private readonly _settings: IBoardGameMonopolyTable;
    private _started: boolean;

    constructor(settings: IBoardGameMonopolyTable) {
        this._settings = settings;
        this.createColshape()
        this.createFields()
    }

    private createFields() {
        this.fields = [
            new StartField(0),
            new FirmField(1, new Firm(1, 500, MonopolyStreet.Technic, 'Apple')),
            new FirmField(2, new Firm(2, 550, MonopolyStreet.Technic, 'Samsung')),
            new TaxField(3),
            new FirmField(4, new Firm(4, 600, MonopolyStreet.Food, 'KFC')),
            new FirmField(5, new Firm(5, 650, MonopolyStreet.Food, 'MacDonalds')),
            new PrisonField(6),
            new FirmField(7, new Firm(7, 700, MonopolyStreet.GameConsoles, 'PlayStation')),
            new FirmField(8, new Firm(8, 800, MonopolyStreet.GameConsoles, 'Xbox')),
            new TeleportField(9),
            new FirmField(10, new Firm(10, 900, MonopolyStreet.Cars, 'BMW')),
            new FirmField(11, new Firm(11, 950, MonopolyStreet.Cars, 'Mercedes-Benz')),
            new JackpotField(12),
            new FirmField(13, new Firm(13, 1000, MonopolyStreet.Cloth, 'LV')),
            new BonusIncomeField(14),
            new FirmField(15, new Firm(15, 1100, MonopolyStreet.Cloth, 'Gucci')),
            new TaxField(16),
            new FirmField(17, new Firm(17, 1200, MonopolyStreet.Cloth, 'Versace')),
            new PrisonField(18),
            new FirmField(19, new Firm(19, 1500, MonopolyStreet.Banks, 'Fleeca')),
            new FirmField(20, new Firm(20, 1700, MonopolyStreet.Banks, 'Maze Bank')),
            new SKipField(21),
            new TeleportField(22),
            new FirmField(23, new Firm(23, 2000, MonopolyStreet.Banks, 'Blaine County')),
        ]
    }

    private createColshape() {
        colshapes.new(system.getVector3Mp(this._settings.pos[0]), 'Играть в монополию', player => {
            this.addPlayer(player)
        }, {
            rotation: this._settings.pos[1],
            dimension: this._settings.dimension,
            type: -1,
            radius: 5
        })
    }

    private start() {
        this._currentPlayer = this.players[0]
        this._currentPlayer.suggestMove()
        this._started = true
    }

    private stop() {
        this.createFields()
        this._started = false
        this._currentPlayer = null
        this.players = new Array<MonopolyPlayer>()
    }

    public onPlayerConfirmBuyFirm(playerMp: PlayerMp) {
        const player = this.players.find(p => p.player == playerMp)
        if (this._currentPlayer != player) return
        player.acceptCurrectFirmBuySuggestion()
        player.releaseMove()
    }

    public onPlayerRejectBuyFirm(playerMp: PlayerMp) {
        const player = this.players.find(p => p.player == playerMp)
        if (this._currentPlayer != player) return
        player.releaseMove()
    }

    public onPlayerSellFirm(playerMp: PlayerMp, firmId: number) {
        const player = this.players.find(p => p.player == playerMp)
        if (this._currentPlayer != player) return

        const firmToRemove = player.firms.find(f => f.id == firmId)
        if (!firmToRemove) return

        player.removeFirm(firmToRemove)
    }

    public onPlayerSellFirms(playerMp: PlayerMp, firmIds: number[]) {
        const player = this.players.find(p => p.player == playerMp)
        if (this._currentPlayer != player) return playerMp.notify('Сейчас ход другого игрока', 'error')
        firmIds.map(id => player.removeFirm((<FirmField>this.fields.find(f => f.id == id)).firm))
    }

    public onPlayerThrewDices(playerMp: PlayerMp): [number, number] {
        const player = this.players.find(p => p.player == playerMp)

        const randomNumber1 = system.getRandomInt(1, 6)// Число выпавшее на кубике 1
        const randomNumber2 = system.getRandomInt(1, 6)// Число выпавшее на кубике 2

        if (player.prisonMoves > 0) {
            if (randomNumber1 == randomNumber2)
                player.prisonMoves = 0
            else player.prisonMoves -= 1
        }
        // Если игрок все еще не отбыл наказание, кидает след. игрок
        if (player.prisonMoves > 0) {
            setTimeout(() => this.suggestNextPlayerMove(), 3000)
            return [randomNumber1, randomNumber2]
        }

        setTimeout(() => player.teleportBy(randomNumber1 + randomNumber2), 3000)

        return [randomNumber1, randomNumber2]
    }

    public addPlayer(player: PlayerMp) {
        if (this._started) return player.notify('Игра уже началась', 'error')
        const monopolyPlayer = new MonopolyPlayer(player, this)

        this.players.map(p => CustomEvent.triggerCef(p.player, 'monopoly:addPlayer', monopolyPlayer.getDto()))
        this.players.push(monopolyPlayer)

        player.user.setGui('monopoly')
        CustomEvent.triggerCef(player, 'monopoly:setPlayers', this.players.map(p => p.getDto()))

        if (this.players.length >= this._settings.playersToStart) {
            this.start()
        }
    }

    public suggestNextPlayerMove() {
        const nextPlayerIdx = this.players.indexOf(this._currentPlayer) + 1
        this._currentPlayer = this.players.length <= nextPlayerIdx
            ? this.players[0]
            : this.players[nextPlayerIdx]
        this._currentPlayer.suggestMove()
    }

    public removePlayer(player: PlayerMp) {
        const leavedMonopolyPlayer = this.players.find(p => p.player == player)
        if (!leavedMonopolyPlayer) return
        this.players.splice(this.players.indexOf(leavedMonopolyPlayer), 1)

        if (this.players.length == this._settings.playersToLeave) {
            CustomEvent.triggerCef(this.players[0].player, 'monopoly:showWin')
            this.stop()
            return
        }

        if (this.players.length && this._currentPlayer == leavedMonopolyPlayer) {
            this.suggestNextPlayerMove()
        }
    }
}
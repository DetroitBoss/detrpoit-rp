import {Firm} from "./firm";
import {MonopolyGame} from "./monopolyGame";
import {FirmField} from "./fields/FirmField";
import {CustomEvent} from "../../custom.event";
import {FieldType} from "./fieldType";
import {MonopolyStreet} from "./monopolyStreet";
import {IMonopolyPlayerDTO} from "../../../../shared/boardGames/monopoly/playerDTO";
import {TaxField} from "./fields/TaxField";

export class MonopolyPlayer {
    private _currentFieldId: number = 0
    private _prisonMoves: number = 0
    private _balance: number = 2500
    private readonly _player: PlayerMp;
    private readonly _firms: Array<Firm> = new Array<Firm>()
    private readonly _game: MonopolyGame;

    constructor(player: PlayerMp, game: MonopolyGame) {
        this._player = player;
        this._game = game;
    }

    public get prisonMoves() {
        return this._prisonMoves
    }

    public set prisonMoves(val: number) {
        this._prisonMoves = val
        //todo: тригер что игрок в тюрьме
        this._game.players.forEach(p => CustomEvent.triggerCef(p.player, ''))
    }

    public get balance() {
        return this._balance
    }

    public set balance(val: number) {
        this._balance = val
        this._game.players.forEach(p => CustomEvent.triggerCef(p.player, 'monopoly:updateBalance', this._player.user.id, this.balance))
    }

    public get player() {
        return this._player
    }

    public get firms() {
        return this._firms
    }

    public getDto(): IMonopolyPlayerDTO {
        return {
            id: this._player.user.id,
            name: this._player.user.name,
            balance: this.balance,
            currentFieldId: this._currentFieldId,
            ownedFirmIds: this.firms.map(f => {
                return f.id
            })
        }
    }

    public teleportTo(fieldId: number) {
        this._currentFieldId = fieldId
        this._game.players.forEach(p => CustomEvent.triggerCef(p.player, 'monopoly:movePlayer', this._player.user.id, this._currentFieldId))
    }

    public teleportBy(stepsAmount: number) {
        // ID клетки в которую должен попасть игрок
        const targetFieldId = this._currentFieldId + stepsAmount
        const targetFieldDiff = targetFieldId - (this._game.fields.length - 1)

        if (targetFieldDiff > 0) {// Игрок прошел через стартовую клетку
            this.teleportTo(targetFieldDiff)
            this.balance += 500
        } else {
            this.teleportTo(targetFieldId)
        }

        const targetField = this._game.fields.find(f => f.id == this._currentFieldId)

        targetField.onPlayerReached(this)
    }

    public haveStreet(streetType: MonopolyStreet): boolean {
        const firmsByStreet = this._game.fields.filter(f => f.type == FieldType.Firm && (<FirmField>f).firm.street == streetType)
        return firmsByStreet.every(f => (<FirmField>f).firm.owner == this)
    }

    public releaseMove() {
        this._game.suggestNextPlayerMove()
    }

    public acceptCurrectFirmBuySuggestion() {
        const firm = (<FirmField>this._game.fields.find(f => f.id == this._currentFieldId))?.firm
        if (firm?.owner || this.balance < firm.cost)
            return this._player.notify('Серверная ошибка', 'error')

        this.balance -= firm.cost
        this._firms.push(firm)

        firm.owner = this
        this._game.players.forEach(p => CustomEvent.triggerCef(p.player, 'monopoly:updateOwnership', this._player.user.id, this.firms.map(f => {
            return f.id
        })))
        if (this.haveStreet(firm.street))
            return CustomEvent.triggerCef(
                this.player,
                'monopoly:showStreet',
                this._game.fields
                    .filter(f => f.type == FieldType.Firm && (<FirmField>f).firm.street == firm.street)
                    .map(f => f.id)
            )

        CustomEvent.triggerCef(this.player, 'monopoly:showNewFirm', firm.id)
    }

    public suggestBuyFirm(firm: Firm) {
        if (this.balance >= firm.cost) {
            CustomEvent.triggerCef(this.player, 'monopoly:suggestBuy', firm.id)
        } else {
            CustomEvent.triggerCef(this.player, 'monopoly:suggestSellToBuy')
        }
    }

    public removeFirm(firm: Firm) {
        firm.owner = null
        this.balance += firm.cost / 2
        this._firms.splice(this._firms.indexOf(firm), 1)
        this._game.players.forEach(p => CustomEvent.triggerCef(p.player, 'monopoly:updateOwnership', this._player.user.id, this.firms.map(f => {
            return f.id
        }) ?? []))

        const currentField = this._game.fields.find(f => f.id == this._currentFieldId)
        // Если продал фирму стоя на налоге или на чужой фирме
        if (currentField instanceof TaxField) {
            if (this.balance >= 1000) {
                this.balance -= 1000
                CustomEvent.triggerCef(this.player, 'monopoly:hideSuggestionToPay')
                this.releaseMove()
            }
        } else if ((<FirmField>currentField)?.firm.owner) {
            if (this.balance >= (<FirmField>currentField).firm.cost) {
                this.balance -= (<FirmField>currentField).firm.cost
                CustomEvent.triggerCef(this.player, 'monopoly:hideSuggestionToPay')
                this.releaseMove()
            }
        }
    }

    public withdrawBalance(amount: number) {
        if (this.balance >= amount) {
            this.balance -= amount
            this.releaseMove()
            return
        }
        CustomEvent.triggerCef(this.player, 'monopoly:suggestSellToPay')
    }

    public suggestMove() {
        this._game.players.forEach(p => CustomEvent.triggerCef(p.player, 'monopoly:setCurrentPlayerId', this._player.user.id))
    }
}
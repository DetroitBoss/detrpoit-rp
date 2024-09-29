import {IBoardGame} from "../interfaces/IBoardGame";
import {IBoardGamePokerTable} from "../../../../shared/boardGames/tables";
import {PokerGameLobby} from "./pokerGameLobby";
import {PokerDealing} from "./dealing";
import {colshapeHandle, colshapes} from "../../checkpoints";
import {system} from "../../system";

export class PokerBoardGame implements IBoardGame {
    public readonly lobby: PokerGameLobby = new PokerGameLobby(this)

    private readonly _settings: IBoardGamePokerTable;
    private readonly _colshape: colshapeHandle
    private _dealing: PokerDealing;
    private _started: boolean = false

    constructor(settings: IBoardGamePokerTable) {
        this._settings = settings;
        this._colshape = colshapes.new(system.getVector3Mp(settings.pos[0]), `${settings.smallBlind} / ${settings.smallBlind * 2}`, async player => {
            await this.lobby.addPlayer(player)
        }, {rotation: settings.pos[1]})
    }

    public get started() {
        return this._started
    }

    public get dealing() {
        return this._dealing
    }

    public get settings() {
        return this._settings
    }

    public start(): void {
        this._started = true
        this._dealing = new PokerDealing(this)
    }

    public stop(): void {
        this._started = false
    }

    async addPlayer(player: PlayerMp): Promise<void> {
        await this.lobby.addPlayer(player)
    }

    async removePlayer(player: PlayerMp): Promise<void> {
        await this.lobby.removePlayer(player)
    }
}
import {IBoardGameTable} from "../../../../shared/boardGames/tables";

export interface IBoardGame {
    get settings(): IBoardGameTable;
    get started(): boolean;

    start(): void;
    stop(): void;

    addPlayer(player: PlayerMp): void;
    removePlayer(player: PlayerMp): void;
}


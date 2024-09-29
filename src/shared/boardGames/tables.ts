import {Vector3WithHeading} from "../system";

export enum BoardGameType {
    Poker,
    Mems,
    Monopoly
}

export interface IBoardGameTable {
    type: BoardGameType
    pos: Vector3WithHeading
    playersToStart: number
    playersToLeave: number
}

export interface IBoardGamePokerTable extends IBoardGameTable {
    smallBlind: number
}

export interface IBoardGameMonopolyTable extends IBoardGameTable {
    dimension: number
}

export const POKER_TABLES: Array<IBoardGamePokerTable> = [
    // {
    //     type: BoardGameType.Poker,
    //     pos: [{ x: 2099.08, y: 5152.37, z: 50.22 }, 133],
    //     smallBlind: 100,
    //     playersToLeave: 1,
    //     playersToStart: 4
    // }
]

export const MONOPOLY_TABLES: Array<IBoardGameMonopolyTable> = [
    {
        type: BoardGameType.Monopoly,
        pos: [{ x: 122.41, y: 186.03, z: 98.66 }, 133],
        playersToLeave: 1,
        playersToStart: 4,
        dimension: 1
    },
    {
        type: BoardGameType.Monopoly,
        pos: [{ x: 122.41, y: 186.03, z: 98.66 }, 133],
        playersToLeave: 1,
        playersToStart: 4,
        dimension: 2
    },
    {
        type: BoardGameType.Monopoly,
        pos: [{ x: 122.41, y: 186.03, z: 98.66 }, 133],
        playersToLeave: 1,
        playersToStart: 4,
        dimension: 3
    },
    {
        type: BoardGameType.Monopoly,
        pos: [{ x: 122.41, y: 186.03, z: 98.66 }, 133],
        playersToLeave: 1,
        playersToStart: 4,
        dimension: 4
    }
]
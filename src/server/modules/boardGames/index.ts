import {MONOPOLY_TABLES, POKER_TABLES} from "../../../shared/boardGames/tables";
import {IBoardGame} from "./interfaces/IBoardGame";
import {PokerBoardGame} from "./poker/PokerBoardGame";
import {Pair} from "./poker/combinations/pair";
import {TwoPair} from "./poker/combinations/twoPair";
import {Three} from "./poker/combinations/three";
import {Street} from "./poker/combinations/street";
import {Flush} from "./poker/combinations/flush";
import {Fullhouse} from "./poker/combinations/fullhouse";
import {Four} from "./poker/combinations/four";
import {StreetFlush} from "./poker/combinations/streetFlush";
import {RoyalFlush} from "./poker/combinations/royalFlush";
import {PokerCard} from "./poker/card";
import {Nominal, Suit} from "../../../shared/boardGames/poker/pokerCardDTO";
import {MonopolyGame} from "./monopoly/monopolyGame";
import './monopoly/events'
import {colshapes} from "../checkpoints";
import {menu} from "../menu";

class BoardGameManager {
    public readonly tables: Array<IBoardGame> = new Array<IBoardGame>()
    public readonly monopolyTables: Array<MonopolyGame> = new Array<MonopolyGame>()

    constructor() {
        colshapes.new(
            new mp.Vector3(126.39, 185.15, 106.62),
            'Играть',
            this.openMenu
        )
        colshapes.new(
            new mp.Vector3(120.34, 192.19, 98.66),
            'Выйти',
            player => player.user.teleport(126.39, 185.15, 108.62, 0, 0),
            {dimension: -1}
        )
        POKER_TABLES.forEach(table => {
            this.tables.push(new PokerBoardGame(table))
        })
        MONOPOLY_TABLES.forEach(table => {
            this.monopolyTables.push(new MonopolyGame(table))
        })
    }

    private openMenu(player: PlayerMp) {
        const m = menu.new(player, 'Arcade')
        MONOPOLY_TABLES.forEach(t => {
            m.newItem({
                name: `Комната №${t.dimension}`,
                onpress: () => {
                    player.user.teleport(122.47, 193.59, 98.66, 0, t.dimension)
                },
            })
        })
        m.open()
    }

    public getPlayerPokerGame(player: PlayerMp): PokerBoardGame {
        return <PokerBoardGame>this.tables.find(t => (<PokerBoardGame>t).lobby.players.find(p => p.player == player))
    }

    public getPlayerMonopolyGame(player: PlayerMp): MonopolyGame {
        return this.monopolyTables.find(t => t.players.find(p => p.player == player))
    }
}

export const boardGameManager: BoardGameManager = new BoardGameManager()

const runTest = () => {
    const pair = [
        new PokerCard(Suit.Club, Nominal.Ace),
        new PokerCard(Suit.Club, Nominal.Ten),
        new PokerCard(Suit.Club, Nominal.Two),
        new PokerCard(Suit.Club, Nominal.Five),
        new PokerCard(Suit.Club, Nominal.Seven),
        new PokerCard(Suit.Club, Nominal.King),
        new PokerCard(Suit.Club, Nominal.Ten),
    ]
    console.log(new Pair(pair).collected())

    const twoPair = [
        new PokerCard(Suit.Club, Nominal.Ace),
        new PokerCard(Suit.Club, Nominal.Ten),
        new PokerCard(Suit.Club, Nominal.Two),
        new PokerCard(Suit.Club, Nominal.Five),
        new PokerCard(Suit.Club, Nominal.King),
        new PokerCard(Suit.Club, Nominal.King),
        new PokerCard(Suit.Club, Nominal.Ten),
    ]
    console.log(new TwoPair(twoPair).collected())

    const three = [
        new PokerCard(Suit.Club, Nominal.Ace),
        new PokerCard(Suit.Club, Nominal.Ten),
        new PokerCard(Suit.Club, Nominal.Two),
        new PokerCard(Suit.Club, Nominal.Ace),
        new PokerCard(Suit.Club, Nominal.King),
        new PokerCard(Suit.Club, Nominal.King),
        new PokerCard(Suit.Club, Nominal.Ace),
    ]
    console.log(new Three(three).collected())

    const street = [
        new PokerCard(Suit.Club, Nominal.Two),
        new PokerCard(Suit.Club, Nominal.Ten),
        new PokerCard(Suit.Club, Nominal.Three),
        new PokerCard(Suit.Club, Nominal.Five),
        new PokerCard(Suit.Club, Nominal.Four),
        new PokerCard(Suit.Club, Nominal.King),
        new PokerCard(Suit.Club, Nominal.Six),
    ]
    console.log(new Street(street).collected())

    const flush = [
        new PokerCard(Suit.Club, Nominal.Two),
        new PokerCard(Suit.Spade, Nominal.Ten),
        new PokerCard(Suit.Diamond, Nominal.Three),
        new PokerCard(Suit.Club, Nominal.Five),
        new PokerCard(Suit.Club, Nominal.Four),
        new PokerCard(Suit.Club, Nominal.King),
        new PokerCard(Suit.Club, Nominal.Six),
    ]
    console.log(new Flush(flush).collected())

    const fh = [
        new PokerCard(Suit.Club, Nominal.Two),
        new PokerCard(Suit.Spade, Nominal.Two),
        new PokerCard(Suit.Diamond, Nominal.Three),
        new PokerCard(Suit.Club, Nominal.Two),
        new PokerCard(Suit.Club, Nominal.Four),
        new PokerCard(Suit.Club, Nominal.King),
        new PokerCard(Suit.Club, Nominal.King),
    ]
    console.log(new Fullhouse(fh).collected())

    const f4 = [
        new PokerCard(Suit.Club, Nominal.Two),
        new PokerCard(Suit.Spade, Nominal.Two),
        new PokerCard(Suit.Diamond, Nominal.Three),
        new PokerCard(Suit.Club, Nominal.Two),
        new PokerCard(Suit.Club, Nominal.Four),
        new PokerCard(Suit.Club, Nominal.King),
        new PokerCard(Suit.Club, Nominal.Two),
    ]
    console.log(new Four(f4).collected())

    const sf = [
        new PokerCard(Suit.Club, Nominal.Two),
        new PokerCard(Suit.Heart, Nominal.Ten),
        new PokerCard(Suit.Club, Nominal.Three),
        new PokerCard(Suit.Club, Nominal.Five),
        new PokerCard(Suit.Club, Nominal.Four),
        new PokerCard(Suit.Spade, Nominal.King),
        new PokerCard(Suit.Club, Nominal.Six),
    ]
    console.log(new StreetFlush(sf).collected())

    const rf = [
        new PokerCard(Suit.Club, Nominal.Jack),
        new PokerCard(Suit.Club, Nominal.Ten),
        new PokerCard(Suit.Club, Nominal.Queen),
        new PokerCard(Suit.Heart, Nominal.Five),
        new PokerCard(Suit.Club, Nominal.King),
        new PokerCard(Suit.Spade, Nominal.King),
        new PokerCard(Suit.Club, Nominal.Ace),
    ]
    console.log(new RoyalFlush(rf).collected())
}

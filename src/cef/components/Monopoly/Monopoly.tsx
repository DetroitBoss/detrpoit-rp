import React, {useCallback, useLayoutEffect, useState} from "react";
import "./style.less";

import png from "./assets/*.png";
import svg from "./assets/*.svg";

import bigBrands from "./assets/bigBrands/*.png";
import brands from "./assets/brands/*.png";
import bonuses from "./assets/bonuses/*.svg";
import cards from "./assets/cards/*.png";
import dice from "./assets/dice/*.svg";
import figurines from "./assets/figurines/*.svg"
import {TooltipClass} from "../Tooltip/index";
import {IMonopolyPlayerDTO} from "../../../shared/boardGames/monopoly/playerDTO";
import {CustomEvent} from "../../modules/custom.event";

import RightSide from "./components/RightSide";
import LeftSide from "./components/LeftSide";
import {CEF} from "../../modules/CEF";
import Dice from "./components/Dice";
import Auction from "./components/Auction";
import Sell from "./components/Sell";
import GameOver from "./components/GameOver";
import Drop from "./components/Drop";
import DropCard from "./components/DropCard";
import Collection from "./components/Collection";
import YourTurn from "./components/YourTurn";
import Rules from "./components/Rules";
import Win from "./components/Win";

const Monopoly = () => {
    const [currentPlayerId, setCurrentPlayerId] = useState<number>(0)
    const [lastFieldId, setLastFieldId] = useState<number>(0)
    const [showDice, setShowDice] = useState<boolean>(false)
    const [showRules, setShowRules] = useState<boolean>(false)
    const [suggestBuyId, setSuggestBuyId] = useState<number>(0)
    const [suggestSellType, setSuggestSellType] = useState<'buyFirm' | 'payTax' | null>(null)
    const [showSell, setShowSell] = useState<boolean>(false)
    const [showNewFirm, setShowNewFirm] = useState<number>(0)
    const [showStreet, setShowStreet] = useState<number[]>(null)
    const [showWin, setShowWin] = useState<boolean>(false)

    const [players, setPlayers] = useState<IMonopolyPlayerDTO[]>([
        {
            id: 0,
            balance: 1200,
            name: 'Player 1',
            currentFieldId: 12,
            ownedFirmIds: [1, 8]
        },
        {
            id: 1,
            balance: 1000,
            name: 'Player 2',
            currentFieldId: 0,
            ownedFirmIds: [10, 13]
        },
        {
            id: 2,
            balance: 1000,
            name: 'Player 3',
            currentFieldId: 4,
            ownedFirmIds: [4, 19, 23]
        }
    ])

    useLayoutEffect(() => {
        const ev1 = CustomEvent.register('monopoly:suggestBuy', (id: number) => {
            setSuggestBuyId(id)
        })
        const ev2 = CustomEvent.register('monopoly:suggestSellToBuy', () => {
            setSuggestSellType('buyFirm')
        })
        const ev4 = CustomEvent.register('monopoly:suggestSellToPay', () => {
            setSuggestSellType('payTax')
        })
        const ev5 = CustomEvent.register('monopoly:hideSuggestionToPay', () => {
            setSuggestSellType(null)
            setShowSell(false)
        })
        const ev3 = CustomEvent.register('monopoly:showNewFirm', (firmId: number) => {
            setShowNewFirm(firmId)
        })
        const ev6 = CustomEvent.register('monopoly:showStreet', (ids: number[]) => {
            setShowStreet(ids)
        })
        const ev7 = CustomEvent.register('monopoly:showWin', () => {
            setShowWin(true)
        })
        return () => {
            ev1.destroy()
            ev2.destroy()
            ev3.destroy()
            ev4.destroy()
            ev5.destroy()
            ev6.destroy()
            ev7.destroy()
        }
    }, [])

    useLayoutEffect(() => {
        const ev1 = CustomEvent.register('monopoly:setCurrentPlayerId', (id: number) => {
            if (id == CEF.id) {
                setTimeout(() => setShowDice(true), 1000)
            }
            setCurrentPlayerId(id)
        })

        return () =>{
            ev1.destroy()
        }
    }, [currentPlayerId, showDice])

    useLayoutEffect(() => {
        const ev1 = CustomEvent.register('monopoly:setPlayers', (data: IMonopolyPlayerDTO[]) => {
            setPlayers(data)
        })
        const ev2 = CustomEvent.register('monopoly:addPlayer', (data: IMonopolyPlayerDTO) => {
            setPlayers(players.concat([data]))
        })
        const ev3 = CustomEvent.register('monopoly:movePlayer', (playerId: number, newFieldId: number) => {
            const playersCopy = [...players]
            setLastFieldId(newFieldId)
            playersCopy[players.findIndex(p => p.id == playerId)].currentFieldId = newFieldId
            setPlayers(playersCopy)
        })
        const ev4 = CustomEvent.register('monopoly:updateBalance', (playerId: number, newBalance: number) => {
            const playersCopy = [...players]
            playersCopy[players.findIndex(p => p.id == playerId)].balance = newBalance
            setPlayers(playersCopy)
        })
        const ev5 = CustomEvent.register('monopoly:updateOwnership', (playerId: number, newFirms: number[]) => {
            const playersCopy = [...players]
            playersCopy[players.findIndex(p => p.id == playerId)].ownedFirmIds = newFirms
            setPlayers(playersCopy)
        })

        return () =>{
            ev1.destroy()
            ev2.destroy()
            ev3.destroy()
            ev4.destroy()
            ev5.destroy()
        }
    }, [players])

    const getFieldPosition = (fieldId: number): [number, number] => {// [row, column]
        if (fieldId >= 0 && fieldId <= 6) {
            return [fieldId, 0]
        }

        if (fieldId >= 6 && fieldId <= 12) {
            return [6, fieldId - 6]
        }

        if (fieldId >= 12 && fieldId <= 18) {
            return [18 - fieldId, 6]
        }

        if (fieldId >= 18 && fieldId <= 24) {
            return [0, 24 - fieldId]
        }
    }

    return <div className="monopoly">

        <LeftSide
            lastFieldId={lastFieldId}
            currentPlayerId={currentPlayerId}
            players={players}
        />

        <div className="monopoly-board">
            <div className="monopoly-board-body">

                <div className="monopoly-board-body-center">
                    <img src={svg["onyx"]} className="monopoly-board-body-center__logo" alt=""/>
                    <div className="monopoly-board-body-center__title">Monopoly</div>
                    <div className="monopoly-board-body-center__text">[BLACK EDITION]</div>
                </div>

                {players[0]?.ownedFirmIds.map(id => {
                    return <TooltipClass text={`Присвоено игроком ${players[0].name}`} type={"light"} place={"top"}
                                         effect={"float"}>
                        <img
                            src={figurines["boat"]}
                            className="monopoly-board-body-block-status"
                            style={{
                                left: `${14.3 * getFieldPosition(id)[0]}%`,
                                top: `${14.29 * getFieldPosition(id)[1]}%`
                            }} alt=""
                        />
                    </TooltipClass>

                })}
                {players[1]?.ownedFirmIds.map(id => {
                    return <TooltipClass text={`Присвоено игроком ${players[1].name}`} type={"light"} place={"top"}
                                         effect={"float"}>
                        <img
                            src={figurines["car"]}
                            className="monopoly-board-body-block-status"
                            style={{
                                left: `${14.3 * getFieldPosition(id)[0]}%`,
                                top: `${14.29 * getFieldPosition(id)[1]}%`
                            }} alt=""
                        />
                    </TooltipClass>

                })}
                {players[2]?.ownedFirmIds.map(id => {
                    return <TooltipClass text={`Присвоено игроком ${players[2].name}`} type={"light"} place={"top"}
                                         effect={"float"}>
                        <img
                            src={figurines["scooter"]}
                            className="monopoly-board-body-block-status"
                            style={{
                                left: `${14.3 * getFieldPosition(id)[0]}%`,
                                top: `${14.29 * getFieldPosition(id)[1]}%`
                            }} alt=""
                        />
                    </TooltipClass>

                })}
                {players[3]?.ownedFirmIds.map(id => {
                    return <TooltipClass text={`Присвоено игроком ${players[3].name}`} type={"light"} place={"top"}
                                         effect={"float"}>
                        <img
                            src={figurines["skate"]}
                            className="monopoly-board-body-block-status"
                            style={{
                                left: `${14.3 * getFieldPosition(id)[0]}%`,
                                top: `${14.29 * getFieldPosition(id)[1]}%`
                            }} alt=""
                        />
                    </TooltipClass>

                })}


                <img
                    className="monopoly-board-body-block-playerImg monopoly-board-body-block-playerImg__boat"
                    src={figurines["boat"]}
                    style={{
                        left: `${14.35 * getFieldPosition(players[0]?.currentFieldId ?? 0)[0]}%`,
                        top: `${14.2 * getFieldPosition(players[0]?.currentFieldId ?? 0)[1]}%`
                    }} alt=""/>


                <img
                    className="monopoly-board-body-block-playerImg monopoly-board-body-block-playerImg__car"
                    src={figurines["car"]}
                    style={{
                        left: `${14.35 * getFieldPosition(players[1]?.currentFieldId ?? 0)[0]}%`,
                        top: `${14.2 * getFieldPosition(players[1]?.currentFieldId ?? 0)[1]}%`
                    }} alt=""/>


                <img
                    className="monopoly-board-body-block-playerImg monopoly-board-body-block-playerImg__scooter"
                    src={figurines["scooter"]}
                    style={{
                        left: `${14.35 * getFieldPosition(players[2]?.currentFieldId ?? 0)[0]}%`,
                        top: `${14.2 * getFieldPosition(players[2]?.currentFieldId ?? 0)[1]}%`
                    }} alt=""/>


                <img
                    className="monopoly-board-body-block-playerImg monopoly-board-body-block-playerImg__skate"
                    src={figurines["skate"]}
                    style={{
                        left: `${14.35 * getFieldPosition(players[3]?.currentFieldId ?? 0)[0]}%`,
                        top: `${14.2 * getFieldPosition(players[3]?.currentFieldId ?? 0)[1]}%`
                    }} alt=""/>


                <div className="monopoly-board-body-top">

                    <div className="monopoly-board-body-block monopoly-board-body-block-bonus">
                        <img src={svg["stripes"]} className="monopoly-board-body-block-bonus__background" alt=""/>
                        <img src={bonuses["start"]} className="monopoly-board-body-block-bonus__image" alt=""/>
                    </div>

                    <div className="monopoly-board-body-block">
                        <img src={brands["apple"]} className="monopoly-board-body-block__logo" alt=""/>

                        <div className="monopoly-board-body-block__price monopoly-board-body-block__price-red">
                            <span>500$</span>
                        </div>

                        <div className="monopoly-board-body-block-figurines">

                        </div>
                    </div>

                    <div className="monopoly-board-body-block">
                        <img src={brands["samsung"]} className="monopoly-board-body-block__logo" alt=""/>

                        <div className="monopoly-board-body-block__price monopoly-board-body-block__price-red">
                            <span>550$</span>
                        </div>
                    </div>

                    <div className="monopoly-board-body-block monopoly-board-body-block-bonus">
                        <img src={svg["stripes"]} className="monopoly-board-body-block-bonus__background" alt=""/>
                        <img src={bonuses["tax"]} className="monopoly-board-body-block-bonus__image" alt=""/>
                    </div>

                    <div className="monopoly-board-body-block">
                        <img src={brands["kfc"]} className="monopoly-board-body-block__logo" alt=""/>

                        <div className="monopoly-board-body-block__price monopoly-board-body-block__price-aqua">
                            <span>600$</span>
                        </div>
                    </div>

                    <div className="monopoly-board-body-block">
                        <img src={brands["mac"]} className="monopoly-board-body-block__logo" alt=""/>

                        <div className="monopoly-board-body-block__price monopoly-board-body-block__price-aqua">
                            <span>650$</span>
                        </div>
                    </div>

                </div>

                <div className="monopoly-board-body-right">

                    <div className="monopoly-board-body-block monopoly-board-body-block-bonus">
                        <img src={svg["stripes"]} className="monopoly-board-body-block-bonus__background" alt=""/>
                        <img src={bonuses["prison"]} className="monopoly-board-body-block-bonus__image" alt=""/>
                    </div>

                    <div className="monopoly-board-body-block">
                        <img src={brands["ps"]} className="monopoly-board-body-block__logo" alt=""/>

                        <div className="monopoly-board-body-block__price monopoly-board-body-block__price-blue">
                            <span>700$</span>
                        </div>
                    </div>

                    <div className="monopoly-board-body-block">
                        <img src={brands["xbox"]} className="monopoly-board-body-block__logo" alt=""/>

                        <div className="monopoly-board-body-block__price monopoly-board-body-block__price-blue">
                            <span>800$</span>
                        </div>

                        <div className="monopoly-board-body-block-figurines">

                        </div>
                    </div>

                    <div className="monopoly-board-body-block monopoly-board-body-block-bonus">
                        <img src={svg["stripes"]} className="monopoly-board-body-block-bonus__background" alt=""/>
                        <img src={bonuses["teleport"]} className="monopoly-board-body-block-bonus__image" alt=""/>

                        <div className="monopoly-board-body-block-figurines">

                        </div>
                    </div>

                    <div className="monopoly-board-body-block">
                        <img src={brands["bmw"]} className="monopoly-board-body-block__logo" alt=""/>

                        <div className="monopoly-board-body-block__price monopoly-board-body-block__price-purple">
                            <span>900$</span>
                        </div>

                        <div className="monopoly-board-body-block-figurines">

                        </div>
                    </div>

                    <div className="monopoly-board-body-block">
                        <img src={brands["mercedes"]} className="monopoly-board-body-block__logo" alt=""/>

                        <div className="monopoly-board-body-block__price monopoly-board-body-block__price-purple">
                            <span>950$</span>
                        </div>

                        <div className="monopoly-board-body-block-figurines">

                        </div>
                    </div>

                </div>

                <div className="monopoly-board-body-bottom">

                    <div className="monopoly-board-body-block monopoly-board-body-block-bonus">
                        <img src={svg["stripes"]} className="monopoly-board-body-block-bonus__background" alt=""/>
                        <img src={bonuses["jackpot"]} className="monopoly-board-body-block-bonus__image" alt=""/>

                        <div className="monopoly-board-body-block-figurines">

                        </div>
                    </div>

                    <div className="monopoly-board-body-block">
                        <img src={brands["lv"]} className="monopoly-board-body-block__logo" alt=""/>

                        <div className="monopoly-board-body-block__price monopoly-board-body-block__price-sky">
                            <span>1000$</span>
                        </div>

                        <div className="monopoly-board-body-block-figurines">

                        </div>
                    </div>

                    <div className="monopoly-board-body-block monopoly-board-body-block-bonus">
                        <img src={svg["stripes"]} className="monopoly-board-body-block-bonus__background" alt=""/>
                        <img src={bonuses["2000"]} className="monopoly-board-body-block-bonus__image" alt=""/>

                        <div className="monopoly-board-body-block-figurines">

                        </div>
                    </div>

                    <div className="monopoly-board-body-block">
                        <img src={brands["gucci"]} className="monopoly-board-body-block__logo" alt=""/>

                        <div className="monopoly-board-body-block__price monopoly-board-body-block__price-sky">
                            <span>1200$</span>
                        </div>

                        <div className="monopoly-board-body-block-figurines">

                        </div>
                    </div>

                    <div className="monopoly-board-body-block monopoly-board-body-block-bonus">
                        <img src={svg["stripes"]} className="monopoly-board-body-block-bonus__background" alt=""/>
                        <img src={bonuses["tax"]} className="monopoly-board-body-block-bonus__image" alt=""/>

                        <div className="monopoly-board-body-block-figurines">

                        </div>
                    </div>

                    <div className="monopoly-board-body-block">
                        <img src={brands["chanel"]} className="monopoly-board-body-block__logo" alt=""/>
                        <div className="monopoly-board-body-block__price monopoly-board-body-block__price-sky">
                            <span>1500$</span>
                        </div>

                        <div className="monopoly-board-body-block-figurines">

                        </div>
                    </div>

                </div>

                <div className="monopoly-board-body-left">

                    <div className="monopoly-board-body-block monopoly-board-body-block-bonus">
                        <img src={svg["stripes"]} className="monopoly-board-body-block-bonus__background" alt=""/>
                        <img src={bonuses["arrest"]} className="monopoly-board-body-block-bonus__image" alt=""/>

                        <div className="monopoly-board-body-block-figurines">

                        </div>
                    </div>

                    <div className="monopoly-board-body-block">
                        <img src={brands["fleeca"]} className="monopoly-board-body-block__logo" alt=""/>

                        <div className="monopoly-board-body-block__price  monopoly-board-body-block__price-rose">
                            <span>1500$</span>
                        </div>

                        <div className="monopoly-board-body-block-figurines">

                        </div>
                    </div>

                    <div className="monopoly-board-body-block">
                        <img src={brands["maze"]} className="monopoly-board-body-block__logo" alt=""/>

                        <div className="monopoly-board-body-block__price  monopoly-board-body-block__price-rose">
                            <span>1700$</span>
                        </div>

                        <div className="monopoly-board-body-block-figurines">

                        </div>
                    </div>

                    <div className="monopoly-board-body-block monopoly-board-body-block-bonus">
                        <img src={svg["stripes"]} className="monopoly-board-body-block-bonus__background" alt=""/>
                        <img src={bonuses["pass"]} className="monopoly-board-body-block-bonus__image" alt=""/>

                        <div className="monopoly-board-body-block-figurines">

                        </div>
                    </div>

                    <div className="monopoly-board-body-block monopoly-board-body-block-bonus">
                        <img src={svg["stripes"]} className="monopoly-board-body-block-bonus__background" alt=""/>
                        <img src={bonuses["teleport"]} className="monopoly-board-body-block-bonus__image" alt=""/>

                        <div className="monopoly-board-body-block-figurines">

                        </div>
                    </div>

                    <div className="monopoly-board-body-block">
                        <img src={brands["bc"]} className="monopoly-board-body-block__logo" alt=""/>

                        <div className="monopoly-board-body-block__price  monopoly-board-body-block__price-rose">
                            <span>2000$</span>
                        </div>

                        <div className="monopoly-board-body-block-figurines">

                        </div>
                    </div>

                </div>

            </div>
        </div>

        <RightSide
            showRules={() => setShowRules(true)}
            player={CEF.test ? players[0] : players.find(p => p.id == CEF.id)}
            idx={players.findIndex(p => p.id == CEF.id)}
        />

        {suggestSellType != null && <YourTurn
            type={suggestSellType}
            showSell={() => setShowSell(true)}
            hide={() => setSuggestSellType(null)}
        />}
        {<Auction/> && false}
        {showSell && <Sell
            type={suggestSellType}
            firmIds={players.find(p => p.id == CEF.id).ownedFirmIds}
            hide={() => setShowSell(false)}
        />}
        {<GameOver/> && false}
        {suggestBuyId != 0 && <Drop
            fieldId={suggestBuyId}
            hide={() => setSuggestBuyId(0)}
        />}
        {showNewFirm != 0 && <DropCard
            firmId={showNewFirm}
            hide={() => setShowNewFirm(0)}
        />}
        {showStreet && <Collection
            firmIds={showStreet}
            hide={() => setShowStreet(null)}
        />}
        {showRules && <Rules
            hide={() => setShowRules(false)}
        />}
        {showWin && <Win />}

        {showDice && <Dice
            hide={() => setShowDice(false)}
        />}
    </div>
}

export default Monopoly;
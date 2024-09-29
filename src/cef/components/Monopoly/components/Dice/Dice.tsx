import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import "./style.less";

import dice from "../../assets/dice/*.svg";
import svg from "../../assets/*.svg";
import {CustomEvent} from "../../../../modules/custom.event";
import {CEF} from "../../../../modules/CEF";

const Dice = (props: {hide: () => void}) => {
    const [secondsLeft, setSecondsLeft] = useState<number>(9)
    const [diceResults, setDiceResults] = useState<[number, number]>([6, 6])
    const intervalId = useRef(-1)

    const throwDices = useCallback(async () => {
        CEF.playSound('dice-sound')
        setTimeout(props.hide, 3000)
        const diceThrowResult: [number, number] = await CustomEvent.callServer('monopoly:throwDices')
        console.log(diceThrowResult)
        setDiceResults(diceThrowResult)
    }, [intervalId])

    const onClick = useCallback(async () => {
        setSecondsLeft(0)
    }, [])

    useEffect(() => {
        intervalId.current = setInterval(() => {
            setSecondsLeft(secondsLeft => {
                if (secondsLeft <= 0) {
                    clearInterval(intervalId.current)
                    throwDices()
                    return 0
                }
                else return secondsLeft - 1
            })
        }, 1000)
        return () => clearInterval(intervalId.current)
    }, [secondsLeft])

    return <div className="monopoly-dice" onClick={onClick}>

        <div className="monopoly-dice-gradient monopoly-dice-gradient__top"/>
        <div className="monopoly-dice-gradient monopoly-dice-gradient__bottom"/>

        <div className="monopoly-dice-time">
            <div className="monopoly-dice-time__text">времени на бросок</div>
            <div className="monopoly-dice-time__timer">00:0{secondsLeft}</div>
        </div>

        <img src={dice[`${diceResults[0]}`]} alt="" className="monopoly-dice__image-left"/>
        <img src={dice[`${diceResults[1]}`]} alt="" className="monopoly-dice__image-right"/>

        <div className="monopoly-dice-description">
            <img src={svg["mouse"]} alt=""/>
            <div className="monopoly-dice-description-text">
                <div>левая кнопка мыши</div>
                <span>Бросать кубик</span>
            </div>
        </div>

    </div>
}

export default Dice;
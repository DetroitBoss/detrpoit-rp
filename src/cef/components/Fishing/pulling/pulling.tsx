import './style.less';
import React, {Component} from 'react';
import { CustomEvent } from '../../../modules/custom.event'
import { CustomEventHandler } from '../../../../shared/custom.event'
import {FISH_PULLING_KEYS, FISHES, IFish, IFishPullingKey} from '../../../../shared/fish'

// @ts-ignore
import png from '../assets/*.png'
// @ts-ignore
import svg from "../assets/*.svg"
import { CEF } from '../../../modules/CEF'

const FISH_SPEED_FACTOR_FROM_EXP = 1// Сколько скорости за опыт
const FISH_MAX_LIMIT = 97// Число % выше которого рыба уплывает
const FISH_CATCH_LIMIT = 3// Число % достигнув которое вы ловите рыбу
const FISH_START_PROGRESS = 55// Число % на котором начинает движение рыба
const FISH_BUTTON_PRESS_FACTOR = 5// Число % на которое уменьшиться дальность рыбы при нажатии на клавишу A

const TENSION_SPEED = 0.15// Скорость с которой опускается уровень натяжения
const TENSION_MIN_LIMIT = 3// Число % ниже которого рыба срывается
const TENSION_MAX_LIMIT = 97// Число % выше которого леска рвется
const TENSION_START_PROGRESS = 95// Число % на котором начинает натяжение леска
const TENSION_BUTTON_PRESS_FACTOR = 5// Число % на которое увеличиться уровень натяжения лески при нажатии на D

const INTERVAL_UPDATE_TIME = 10// Число мс с которым обновляется интервал



export class FishPulling extends Component<{}, {
    show: boolean
    fishMovingProgress: number
    tensionProgress: number
    fishToCatch: IFish
    resultSended: boolean
    keysToPress: [IFishPullingKey, IFishPullingKey]
}> {
    private _fishInterval: number
    private _tensionInterval: number
    private _ev: CustomEventHandler

    constructor(props: any) {
        super(props);

        this.state = {
            show: false,
            fishMovingProgress: 0,
            tensionProgress: 0,
            fishToCatch: FISHES[0],
            resultSended: false,
            keysToPress: FISH_PULLING_KEYS[0]
        }
        
        this._ev = CustomEvent.register('fish:pulling:start', (fishToCatch: IFish, keysToPress: [IFishPullingKey, IFishPullingKey]) => {
            this.startGame(fishToCatch, keysToPress)
        })
    }

    private getFishSpeed(): number {
        return this.state.fishToCatch.expPerCatch / 10 * FISH_SPEED_FACTOR_FROM_EXP
    }
    
    private startGame(fish: IFish, keysToPress: [IFishPullingKey, IFishPullingKey]) {
        this.setState({
            show: true,
            tensionProgress: TENSION_START_PROGRESS,
            fishMovingProgress: FISH_START_PROGRESS,
            fishToCatch: fish,
            resultSended: false,
            keysToPress: keysToPress
        })
        
        if (this._fishInterval) clearInterval(this._fishInterval)
        if (this._tensionInterval) clearInterval(this._tensionInterval)

        this.addEventListener()
        
        this.startTensionMoving()
        this.startFishMoving()
    }
    
    private startFishMoving() {
        this._fishInterval = setInterval(() => {
            if (this.state.fishMovingProgress >= FISH_MAX_LIMIT) {
                CEF.alert.setAlert('error', 'Вы упустили рыбу')
                this.sendResultToClient(false)
                this.stopGame()
            }

            if (this.state.fishMovingProgress <= FISH_CATCH_LIMIT ) {
                this.sendResultToClient(true)
                this.stopGame()
            }
            
            this.setState({
                fishMovingProgress: this.state.fishMovingProgress + this.getFishSpeed()
            })
            
        }, INTERVAL_UPDATE_TIME)
    }

    private startTensionMoving() {
        this._tensionInterval = setInterval(() => {
            if (this.state.tensionProgress <= TENSION_MIN_LIMIT ||
                this.state.tensionProgress >= TENSION_MAX_LIMIT) {
                CEF.alert.setAlert('error', 'Упс! Вы порвали леску')
                this.sendResultToClient(false)
                this.stopGame()
            }

            this.setState({
                tensionProgress: this.state.tensionProgress - TENSION_SPEED
            })

        }, INTERVAL_UPDATE_TIME)
    }

    private stopGame() {
        if (this._fishInterval) clearInterval(this._fishInterval)
        if (this._tensionInterval) clearInterval(this._tensionInterval)
        
        this.removeEventListener()
        this.setState({
            show: false
        })
    }

    private addEventListener() {
        document.addEventListener('keyup', this.handleKeyUp);
    }
    private removeEventListener() {
        document.removeEventListener('keyup', this.handleKeyUp);
    }
    private handleKeyUp = (ev: KeyboardEvent) => {
        if (ev.keyCode == this.state.keysToPress[0].keyCode) {
            this.setState({
                fishMovingProgress: this.state.fishMovingProgress - FISH_BUTTON_PRESS_FACTOR
            })
        } else if (ev.keyCode == this.state.keysToPress[1].keyCode) {
            this.setState({
                tensionProgress: this.state.tensionProgress + TENSION_BUTTON_PRESS_FACTOR
            })
        } else {
            this.sendResultToClient(false)
            this.stopGame()
        }
    }
    
    private sendResultToClient(status: boolean) {
        CustomEvent.triggerClient('fishing:pulling:done', status, this.state.fishToCatch.itemId)
        this.setState({
            resultSended: true
        })
    }

    public componentWillUnmount() {
        if (!this.state.resultSended)
            this.sendResultToClient(false)
        
        this.stopGame()
        this._ev?.destroy()
    }

    render() {
        return <div className="fishing" style={{ display: this.state.show ? 'flex' : 'none'}}>

            <div className="fishing__helpImage">
                <img src={png["helpImage"]} alt=""/>
                <span>Не дай ей сорваться!</span>
            </div>

            <div className="fishing__help">
                Нажимай <span>{this.state.keysToPress[0].keyName}</span> чтобы не упустить рыбу и <span>{this.state.keysToPress[1].keyName}</span> чтобы держать леску
            </div>

            <div className="fishing-progress__left">

                <img src={svg["progressImageL"]} className="fishing-progress__image" alt=""/>
                <img src={png["helpImage"]} className="fishing-progress__help" alt=""/>

                <div
                    className={`fishing-progress__bar ${this.state.fishMovingProgress < 69 ? 'fishing-green' : null}`}>
                    <div style={{height: this.state.fishMovingProgress + "%"}}/>
                </div>

            </div>

            <div className="fishing-progress__right">

                <img src={svg["progressImage"]} className="fishing-progress__image" alt=""/>
                <img src={png["helpImage"]} className="fishing-progress__help" alt=""/>

                <div
                    className={`fishing-progress__bar ${this.state.tensionProgress > 69 && this.state.tensionProgress < TENSION_MAX_LIMIT ? 'fishing-green' : null}`}>
                    <div style={{height: this.state.tensionProgress + "%"}}/>
                </div>

            </div>
            
        </div>
    }
}
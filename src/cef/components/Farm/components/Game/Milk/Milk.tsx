import React, {Component} from "react";


// @ts-ignore
import png from './assets/*.png'
// @ts-ignore
import svg from "./assets/*.svg"

import "../../../style.less";
import { CEF } from '../../../../../modules/CEF'
import { CustomEventHandler } from '../../../../../../shared/custom.event'
import { CustomEvent } from '../../../../../modules/custom.event'

type key = 'A' | 'D'

export class Milk extends Component<{}, {
    id: number
    currentKey: key
    fill: number
    speed: number
}> {
    _ev: CustomEventHandler
    constructor(props: any) {
        super(props);

        this.state = {
            id: 0,
            currentKey: 'A',
            fill: 0,
            speed: 5
        }

        this._ev = CustomEvent.register('game:speed', (id: number, speed: number) => {
            this.setState({
                id,
                speed
            })
        })
    }

    public componentDidMount() {
        addEventListener('keyup', this.handleKeyUp)
    }

    public componentWillUnmount() {
        removeEventListener('keyup', this.handleKeyUp)
    }

    finishGame(): void {
        CustomEvent.triggerServer('waterGame:finish', true, this.state.id)
        this.close()
    }

    handleKeyUp = (e: KeyboardEvent) => {
        if (this.state.fill >= 100) return

        if (e.keyCode == 65) {// A
            if (this.state.currentKey == 'A') {
                this.setState({
                    currentKey: 'D',
                    fill: this.state.fill + this.state.speed
                })
            }
        } else if (e.keyCode == 68) {// D
            if (this.state.currentKey == 'D') {
                this.setState({
                    currentKey: 'A',
                    fill: this.state.fill + this.state.speed
                })
            }
        }
        if (this.state.fill >= 100) this.finishGame()
    }

    close() {
        CEF.gui.setGui(null)
    }
    
    render() {
        return <div className="farm-dotGame">

            <div className="exit" onClick={() => this.close()}>
                <div className="exit__icon"><img src={svg["closeIcon"]} alt="#"/></div>
                <div className="exit__title">Закрыть</div>
            </div>

            <img src={png["logo"]} className="farm-entrance__logo" alt=""/>
            <img src={png["dot"]} className="farm-entrance__dot" alt=""/>

            <div className="farm-dotGame-block">
                <img src={svg["block"]} className="farm-dotGame-block__background" alt=""/>

                <div className="farm-dotGame-block__logo">
                    <img src={png["bucket"]} alt=""/>
                </div>

                <div className="farm-dotGame-block-content">

                    <div className="farm-dotGame-block-content-nav">
                        <div className="farm-dotGame-block-content-nav__title">
                            <span>ПОДОИ</span>КОРОВУ
                        </div>

                        <div className="farm-dotGame-block-content-nav__line"/>

                        <div className="farm-dotGame-block-content-nav__description">
                            Нажимай поочередно <br/>на кнопки
                        </div>

                    </div>
                </div>

                <div className="farm-milkGame-buttons">
                    <div className={this.state.currentKey == 'A' ? 'milk-active' : ''}>A</div>
                    <div className={this.state.currentKey == 'D' ? 'milk-active' : ''}>D</div>
                </div>

                <div className="farm-milkGame-container">
                    <img src={png['dash']} className="farm-milkGame-container__dash" alt=""/>

                    <div className={`fuel_water`} style={{top: `${(100 - this.state.fill)}%`}}/>
                    <div className={`fuel_water`} style={{top: `${(100 - this.state.fill)}%`}}/>

                    <span className="farm-milkGame-container__percent">{ this.state.fill }%</span>
                    <span className="farm-milkGame-container__title">Уровень <br/> молока</span>
                </div>

            </div>
        </div>
    }
}
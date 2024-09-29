import React, {Component} from "react";


// @ts-ignore
import png from './assets/*.png'
// @ts-ignore
import svg from "./assets/*.svg"

import "../../style.less";
import { CustomEventHandler } from '../../../../../shared/custom.event'
import { CustomEvent } from '../../../../modules/custom.event'
import { CEF } from '../../../../modules/CEF'

export class Dots extends Component<{}, {
    id: number
    time: number,
    round: number,
    maxRounds: number,
    score: number,
    active: number,
    vegId: number,
    timeout?: NodeJS.Timeout
}> {
    ev: CustomEventHandler;
    constructor(props: any) {
        super(props);

        this.state = {
            id: 0,
            time: 1000,
            round: 0,
            maxRounds: 19,
            score: 0,
            active: -1,
            vegId: 7022,
        };
        
        this.ev = CustomEvent.register('dotsGame:init', (id: number, totalDots: number, vegId: number) => {
            this.setState({
                id,
                maxRounds: totalDots,
                vegId: vegId
            })
        })
        
        this.start()
    }

    componentWillUnmount = () => {
        if (this.ev)
            this.ev.destroy()
    }
    
    close() {
        CEF.gui.setGui(null)
    }

    next(score: number, round: number) {
        const timeout = setTimeout(() => {
            let score = this.state.score,
                round = this.state.round + 1;

            if (round > this.state.maxRounds) {
                this.finish()
            } else {
                this.next(score, round);
            }
        }, this.state.time);

        this.setState({...this.state, active: this.randomActive(), timeout, score, round});
    }

    click(position: number) {
        if (this.state.timeout) clearTimeout(this.state.timeout);

        let score = this.state.score,
            round = this.state.round + 1;

        if (position === this.state.active) {
            score += 1;
            if (round > this.state.maxRounds) {
                this.finish()
            }else {
                this.next(score, round);
            }
        } else {
            this.close();
        }
    }

    start() {
        this.next(0, 0)
    }

    finish() {
        CustomEvent.triggerServer('dotsGame:finish', this.state.id, true)
        this.close()
    }

    randomActive() {
        return Math.floor(Math.random() * 9)
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
                    <img src={png[this.state.vegId.toString()]} alt=""/>
                </div>

                <div className="farm-dotGame-block-content">

                    <div className="farm-dotGame-block-content-nav">
                        <div className="farm-dotGame-block-content-nav__title">
                            <span>СОБЕРИ</span>УРОЖАЙ
                        </div>
                        <div className="farm-dotGame-block-content-nav__line"/>

                        <div className="farm-dotGame-block-content-nav__description">
                            Нажимай <br/> на активные лунки
                        </div>
                    </div>

                    <div className="farm-dotGame-block-content-dots">
                        <div className={`${this.state.active === 0 ? "farm-active" : null}`} onClick={() => this.click(0)}/>
                        <div className={`${this.state.active === 1 ? "farm-active" : null}`} onClick={() => this.click(1)}/>
                        <div className={`${this.state.active === 2 ? "farm-active" : null}`} onClick={() => this.click(2)}/>
                        <div className={`${this.state.active === 3 ? "farm-active" : null}`} onClick={() => this.click(3)}/>
                        <div className={`${this.state.active === 4 ? "farm-active" : null}`} onClick={() => this.click(4)}/>
                        <div className={`${this.state.active === 5 ? "farm-active" : null}`} onClick={() => this.click(5)}/>
                        <div className={`${this.state.active === 6 ? "farm-active" : null}`} onClick={() => this.click(6)}/>
                        <div className={`${this.state.active === 7 ? "farm-active" : null}`} onClick={() => this.click(7)}/>
                        <div className={`${this.state.active === 8 ? "farm-active" : null}`} onClick={() => this.click(8)}/>
                    </div>

                </div>

            </div>
        </div>
    }
}
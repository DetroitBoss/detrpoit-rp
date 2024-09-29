import React, {Component} from "react";
import "../../style.less";
import png from "../../assets/*.png"
import svg from "../../assets/*.svg"

import {Circle} from "rc-progress";
import { Cable } from "shared/jobs/electrician/config";
import {CustomEvent} from "../../../../modules/custom.event";
import {CEF} from "../../../../modules/CEF";


export class Wires extends Component<{}, {
    cables: Cable[],
    holdInterval: any
}> {

    componentWillUnmount() {
        clearInterval(this.state.holdInterval);
    }

    constructor(props: any) {
        super(props);

        const holdInterval = setInterval(() => {
            if (!this.state) return;

            let cables = this.state.cables;

            cables.forEach(el => {
                if (el.active && !el.completed) {
                    if (el.percent !== 100) {
                        el.percent++;
                    }

                    if (el.percent === 100)  {
                        el.completed = true;
                    }

                    if (el.percent === 20 || el.percent === 40 || el.percent === 60 || el.percent === 80 || el.percent === 100) {
                        el.seconds++;
                    }
                }
            })

            this.setState({...this.state, cables})
            this.checkOnFinish()
        }, 50);

        this.state = {
            cables: [
                {
                    percent: 0,
                    seconds: 0,
                    active: false,
                    completed: false
                },
                {
                    percent: 0,
                    seconds: 0,
                    active: false,
                    completed: false
                },
                {
                    percent: 0,
                    seconds: 0,
                    active: false,
                    completed: false
                }
            ],

            holdInterval: holdInterval
        };

    }

    close() {
        CEF.gui.setGui(null);
    }

    finish(success: boolean) {
        CustomEvent.triggerClient('electrician:gameComplete', success);
        this.close();
    }

    holdStart(key: number) {
        if (this.state.cables.some(c => c.active)) return

        let cables = this.state.cables;

        cables[key].active = true;

        this.setState({...this.state, cables});
    }

    holdStop() {
        let cables = this.state.cables;

        cables.forEach(el => {
            if (el.active && el.percent < 100) {
                this.finish(false);
            }else{
                el.active = false;
            }
        })

        this.setState({...this.state, cables});
    }

    checkOnFinish() {
        if (this.state.cables.filter(el => el.completed).length === 3) this.finish(true);
    }


    render() {
        return <div className="wires" onMouseUp={() => this.holdStop()}>

            <div className="exit" onClick={() => this.close()}>
                <div className="exit__icon"><img src={svg["closeIcon"]} alt="#"/></div>
                <div className="exit__title">Закрыть</div>
            </div>

            <img src={png["background"]} alt="" className="wires__background"/>

            <div className="wires__title">подпаяй указанные точки</div>

            <div className="wires__text">ПРОВОДА</div>


            <img src={svg["wiresDescription"]} alt="" className="wires__description"/>

            <img src={png["wires"]} className="wires__image" alt=""/>

            {
                this.state.cables.map((el, key) => {
                    return <div
                        className={`wires-button wires-button__${key} ${el.active || el.completed ? "wires-button-active" : null}`}
                        key={key}>

                        <div className="wires-button__timer">{el.seconds}</div>
                        <div className="wires-button-body"
                             onMouseDown={() => this.holdStart(key)}
                        ><img src={svg["flashIcon"]} alt=""/></div>

                        <Circle
                            percent={el.percent}
                            strokeWidth={9}
                            trailWidth={9}
                            strokeColor="#277EFF"
                            trailColor="#FFFFFF1A"
                            className="wires-button__circle"
                        />

                    </div>
                })
            }

        </div>
    }
}
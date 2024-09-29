import './style.less';
import React, {Component} from 'react';

import balloon from './images/oxygenBalloon.svg';
import {CustomEventHandler} from "../../../shared/custom.event";
import {CustomEvent} from "../../modules/custom.event";


export class HudOxygen extends Component<{}, {
    show: boolean,
    oxygen: number,
    maxOxygen: number
}> {
    private ev: CustomEventHandler;
    private ev2: CustomEventHandler;

    constructor(props: any) {
        super(props);

        this.state = {
            show: false,
            oxygen: 600,
            maxOxygen: 1200
        }
        this.ev = CustomEvent.register('diving:oxygen:show', (toggle) => {
            this.setState({...this.state, show: toggle});
        });

        this.ev2 = CustomEvent.register('diving:oxygen:update', (oxygen, maxOxygen?) => {
            if (maxOxygen) {
                this.setState({...this.state, oxygen, maxOxygen});
            }else{
                if (oxygen === this.state.oxygen) return;
                this.setState({...this.state, oxygen});
            }
        });
    }

    componentWillUnmount() {
        this.ev.destroy();
        this.ev2.destroy();
    }

    calculatePercentForOxygen(): number {
        const val = Math.floor(this.state.oxygen * 100 / this.state.maxOxygen);
        if (val > 100) return 100;
        else if (val < 0) return 0;
        else return val;
    }

    render() {
        {
            return this.state.show === true ? <div className="hudOxygen">

                    <div className="hudOxygen__title">
                        <img src={balloon} alt=""/>
                        Осталось <br/>воздуха
                    </div>

                    <div className="hudOxygen__indicator">
                        <div style={{width: this.calculatePercentForOxygen() + "%"}}/>
                    </div>

                </div>
                :
                null
        }
    }

}
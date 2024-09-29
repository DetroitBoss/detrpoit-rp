import './style.less';
import React, {Component, ErrorInfo} from 'react';
import $ from 'jquery';
import svgs from './images/svg/*.svg'
// @ts-ignore
import ProgressBar from 'progressbar.js';
import {CEF} from '../../modules/CEF';
import {CustomEvent} from '../../modules/custom.event';
import {defaultHotkeys, getKeyName} from "../../../shared/hotkeys";

export class HudSpeedometerClass extends Component<{}, {
    speed: number
    show: boolean;
    fuel: number;
    locked: boolean;
    engine: boolean;
    strapped: boolean;
    data?: typeof defaultHotkeys;
}> {
    bar: ProgressBar.SemiCircle;
    constructor(props: any) {
        super(props);

        this.state = {
            show: CEF.test ? true : false,
            speed: 5,
            fuel: 0,
            locked: false,
            engine: false,
            strapped: false,
        }
        CustomEvent.register('hud:speedometer', (data: { [param: string]: any }) => {
            if (JSON.stringify(data).length < 5) return this.setState({ show: false });
            this.setState({ show: true, speed: data.s, fuel: data.f, locked: data.l, engine: data.e, strapped: data.x });
            if (this.bar) this.bar.animate(this.getBarLevel);
        })
        CustomEvent.register('currentHotkeys', ((data: typeof defaultHotkeys) => {
            this.setState({data})
        }))
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo){
        console.log("WE GOT ERROR");
        CustomEvent.trigger('react:error', error, errorInfo)
    }

    get speed(){
        if(!this.state.speed) return 0;
        return Math.min(this.state.speed, 999)
    }


    componentDidUpdate(){
        if (!this.bar && $('#circlespeedometer')) this.bar = new ProgressBar.SemiCircle('#circlespeedometer', {
            strokeWidth: 2,
            easing: 'easeInOut',
            duration: 98,
            color: '#ffffff',
            trailColor: 'rgba(255, 255, 255, 0.2)',
            trailWidth: 8,
            svgStyle: null
        });

    }

    get getBarLevel(){
        if(!this.speed) return 0.0;
        return Math.max(0, Math.min(Math.abs(this.speed) / 250, 1.0));
    }

    get speedString(){
        if (!this.speed) return '000';
        let spd = this.speed.toString();
        if (spd.length === 1) spd = '0' + spd;
        if (spd.length === 2) spd = '0' + spd;
        return spd;
    }

    get fuelLevelSVG(){
        if (this.state.fuel >= 75) return 'petrol-4';
        if (this.state.fuel >= 50) return 'petrol-3';
        if (this.state.fuel >= 25) return 'petrol-2';
        if (this.state.fuel >= 1) return 'petrol-1';
        return 'petrol-0';
    }


    render() {
        return <div className="hud-speedometer" style={{ display: this.state.show ? 'flex' : 'none'}}>
            <div className="petrol-wrap">
                <div className="petrol-level">
                    <img src={svgs[this.fuelLevelSVG]} width="24" height="24" />
                </div>
                <div className="icon-wrap">
                    <img src={svgs['petrol-icon']} width="24" height="24" /><i>{this.state.fuel}%</i>
                </div>
            </div>
            <div className="circle-speedometer-wrap">
                <div className="circle-speedometer">
                    <div className="circle-wrap">
                        <div id="circlespeedometer"></div>
                    </div>
                    <div className="block-rotate">
                        <div className="in-speed-wrapper">
                            <div className="in-speed-wrap">
                                <div className="in-speed-opacity">
                                    <p><span>{this.speedString}</span></p>
                                </div>
                            </div>
                            <p className="p-descr">км/ч</p>
                        </div>
                    </div>
                    {this.state.data ? <div className="other-value-wrap">
                        <div className={"other-value-item " + (this.state.strapped ? 'active' : '')}>
                            <img src={svgs['strapped']} width="24" height="24" />
                            <p>{getKeyName(this.state.data['seatbelt'])}</p>
                        </div>
                        <div className={"other-value-item " + (this.state.locked ? 'active' : '')}>
                            <img src={svgs['lock']} width="24" height="24" />
                            <p>{getKeyName(this.state.data['lockveh'])}</p>
                        </div>
                        <div className={"other-value-item " + (this.state.engine ? 'active' : '')}>
                            <img src={svgs['carburetor']} width="24" height="24" />
                            <p>{getKeyName(this.state.data['engineveh'])}</p>
                        </div>
                    </div> : <></>}

                </div>
            </div>
        </div>
    }
};
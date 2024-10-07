import './style.less';
import React, {Component} from 'react';
import svgs from './images/svg/*.svg'
import {CustomEvent} from '../../modules/custom.event';
import {CustomEventHandler} from '../../../shared/custom.event';
import {systemUtil} from '../../../shared/system';
import '../../assets/less/animate.less';
import '../../assets/less/uikit.less';
import {Circle} from 'rc-progress';
import {getMaxExpLevel} from '../../../shared/payday';
import {CEF} from "../../modules/CEF";

export class HudPayDay extends Component<{}, {
    time: string,
    show: boolean,
    level: number,
    exp: number,
    maxexp: number,
    add: {
        money:number;
        exp:number,
        info?:Array<{money:number, text:string}>
    },
    close?:boolean
}> {
    ev: CustomEventHandler;
    timer: NodeJS.Timeout;
    constructor(props: any) {
        super(props);

        this.state = {
            time: '00:00',
            show: false,
            level:1,
            exp:1,
            maxexp:2,
            add: {
                money: 999,
                exp: 1,
                info:[
                    // { money:100, text:"Директор"},
                    // { money:100, text:"Директор"},
                    // { money:100, text:"Директор"},
                    // { money:100, text:"Директор"}
                ]
            },
            close: false

        }

        CustomEvent.register('hud:data', (date: string, time1: string, time2: string, online: number, isAdmin: boolean, id: number, realHour: number, realMinutes: number) => {
            this.setState({ time: `${realHour}:${realMinutes}` });
        });

        this.ev = CustomEvent.register('hud:payday', (
            level: number,
            exp: number,
            add: {money:number; exp:number, info:Array<{money:number, text:string}>}) => {
            this.setState( { ...this.state, show:true, close: false, level, exp, maxexp: getMaxExpLevel(level), add} );

            if (this.timer) clearInterval(this.timer);
            this.timer = setTimeout(() => {
                this.setState( { close: true });
                setTimeout(() => { this.setState( { show:false })}, 1000);
            }, CEF.test ? 1000000 : 10000);
        })
    }

    get timeStringCorrect(){
        if(!this.state.time) return "00:00";
        if(typeof this.state.time !== "string") return '00:00';
        let [minutes, seconds] = this.state.time.split(':');
        if(minutes.length == 1) minutes = '0'+minutes;
        if(seconds.length == 1) seconds = '0'+seconds;

        return minutes+':'+seconds
    }

    componentWillUnmount() {
        if (this.ev) this.ev.destroy();
        if (this.timer) clearInterval(this.timer);
    }
    getMaxExpLevel = (level: number) => {
        return getMaxExpLevel(level);
    }
    render() {
        if(this.state.show === false ) return null;
        return <>
            <div className={`payday-wrapper animated ${ this.state.close == false ? 'fadeInUpPayday' : 'fadeInDownPayday'}`}>
                <div className="payday-head">
                    {/* <img src={svgs['logo-word-o-orange']} alt=""/> */}
                    <p className="font40 fontw800 mb8">PAYDAY</p>
                    <p className="font16 upper fontw400 mb40">{this.timeStringCorrect}</p>
                </div>
                <div className="payday-content">
                <i className="bg-payday-content"></i>
                    <div className="mm-progressbar-item mm-progressbar-item-level mb24">
                        <div className="circle-wrap">
                            <div><Circle
                                    percent={this.state.exp / getMaxExpLevel(this.state.level) * 100}
                                    strokeWidth={5} trailWidth={5} strokeColor="#ffffff"
                                    trailColor="rgba(196, 196, 196, 0.2)"/>
                            </div>
                            <div className="text-wrap">
                                <p className="big-value">{this.state.level}</p>
                                <p>{this.state.exp} / {this.state.maxexp}</p>
                            </div>
                        </div>
                        <p className="descr">Уровень</p>
                    </div>
                    <div className="payday-sum-line mb24">
                        <div>+${systemUtil.numberFormat(this.state.add.money)}</div>
                        <div>+{this.state.add.exp} EXP</div>
                    </div>
                    <ul>
                        {this.state.add.info.length && this.state.add.info.map( (data, id ) => {
                            return <li><strong>+${systemUtil.numberFormat(data.money)}</strong>{data.text}</li>
                        })}
                    </ul>
                </div>
            </div>
        </>
    }
}
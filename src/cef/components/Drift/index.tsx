import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import './style.less'
import {CEF} from '../../modules/CEF';
import svgClose from '../UserMenu/assets/svg/close.svg'
import svg from './images/*.svg'
import Draggable from 'react-draggable';
// @ts-ignore
import ProgressBar from 'progressbar.js';
import {system} from "../../modules/system";
import {SocketSync} from "../SocketSync";



export class DriftCounterScreen extends Component<{}, {status: boolean, score: number, multiple: number, text: string[], data?: {my: [number, number], today: {name: string, score: number}[], alltime: [string, number][]}}> {
    progress: any;
    constructor(props: any) {
        super(props);
        this.state = CEF.test && (location.href.includes("=hud")) ? {score: 0, multiple: 10,text: ["asf"], status: false} : {score: 0, multiple: 0,text: [], status: false}

        setTimeout(() => {
            CustomEvent.register('drift:score', (score: number, multiple: number, text: string[]) => {
                this.setState({score, multiple, text})
            })
            CustomEvent.register('driftmap', (status) => {
                this.setState({status})
            })
        }, 5000)

        // if(CEF.test && (location.href.includes("=hud"))){
        //     setInterval(() => {
        //         this.setState({score: this.state.score + 100})
        //     }, 1000)
        // }

    }

    componentDidUpdate(){

    }


    render() {
        return <>
            <section className="section-driftmod-wrapper">
                {this.state.score ? <div className="drift-counter-wrap">
                    <div className="drift-x animated flipInX">x{this.state.multiple.toFixed(1)}</div>
                    <div className="drift-size">{system.numberFormat(this.state.score)}</div>
                    <div className="drift-styles">
                        {this.state.text.map((text, i) => {
                            return <div className="" key={`drift_text_${i}`}><p>{text}</p></div>
                        })}

                    </div>
                </div> : <></>}
                {this.state.status ? <SocketSync path={'drift:hud'} data={e => {
                    const data = JSON.parse(e);
                    this.setState({data});
                }}>
                    {this.state.data ? <div className="drift-reputation">
                        <div className="drift-reputation-box first-large">
                            <p className="drift-r-title">Мой <strong>результат</strong></p>
                            <div className="drift-r-text"><p>{CEF.user.name}</p><img src={svg['star']} alt="" /></div>
                            <div className="drift-r-text"><div className="bage"><small>За все время</small> {system.numberFormat(this.state.data.my[1])}</div><div className="bage ml18"><small>Сегодня</small> {system.numberFormat(this.state.data.my[0])}</div></div>
                        </div>
                        <div className="drift-reputation-box">
                            <p className="drift-r-title">Топ 5 <strong>за сутки</strong></p>
                            {this.state.data.today.map((q, i) => {
                                return <div key={`today_${i}`} className="drift-r-text"><p>{q.name}</p><div className="bage">{system.numberFormat(q.score)}</div></div>
                            })}
                        </div>
                        <div className="drift-reputation-box">
                            <p className="drift-r-title">Топ 5 <strong>дрифтеров</strong></p>
                            {this.state.data.alltime.map((q, i) => {
                                return <div key={`all_${i}`} className="drift-r-text"><p>{q[0]}</p><div className="bage">{system.numberFormat(q[1])}</div></div>
                            })}
                        </div>
                    </div> : <></>}

                </SocketSync> : <></>}

            </section>
        </>;
    }
}



export class DriftScreen extends Component<{}, {block: boolean, show: boolean, ids?: number, status?: boolean, angle?: number, speed?: number}> {
    constructor(props: any) {
        super(props);
        this.state = {
            show: false,
            block: false,
        }

        setTimeout(() => {
            CustomEvent.register('drift:setting', (driftData: {ids: number, status: boolean, angle: number, speed: number}) => {
                this.setState({...driftData, show: true})
                CEF.gui.enableCusrsor()
            })
        }, 5000)

    }

    componentDidMount(){
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleKeyDown(ev: KeyboardEvent){
        if(this.state.block) return;
        if(!this.state.show) return;
        if(!this.state.status) return;
        const key: number = ev.keyCode;
        // W 38
        // S 40
        // A 37
        // D 39

        let {ids, status, angle, speed} = this.state

        if(key === 38){ angle = Math.min(angle + 5, 100) }
        if(key === 40){ angle = Math.max(angle - 5, 0) }
        if(key === 39){ speed = Math.min(speed + 5, 100) }
        if(key === 37){ speed = Math.max(speed - 5, 0) }
        if(angle === this.state.angle && speed === this.state.speed) return;

        this.setState({angle, speed, block: true}, () => {
            CustomEvent.triggerServer('drift:set', {ids, status, angle, speed})
            setTimeout(() => {
                this.setState({block: false})
            }, 200)
        })
    }

    render() {
        if(!this.state.show) return <></>;
        return <Draggable handle="#driftHeader"><div className="driftmod-box">
            <i className="driftmod-box-close-button" onClick={e => {
                this.setState({show: false})
                CEF.gui.disableCusrsor()
            }}><img src={svgClose} alt="" /></i>
            <h2 id={'driftHeader'}>Настройка<br />дрифта</h2>
            <div className="switch-wrapper flex-line mb16">
                <div className="switch-wrap">
                    <input type="checkbox" id="switchCheck" checked={!!this.state.status} onChange={e => {
                        e.preventDefault()
                        let {ids, status, angle, speed} = this.state
                        status = !status;
                        this.setState({status}, () => {
                            setTimeout(() => {
                                this.setState({status})
                            }, 100)
                        });
                        CustomEvent.triggerServer('drift:set', {ids, status, angle, speed})
                    }} />
                    <label htmlFor="switchCheck" />
                </div>
                <p className="title ml8">
                    <span style={{whiteSpace: 'nowrap'}}>Включить</span>
                </p>
            </div>
            <div className="driftmod-buttons flex-line">
                <div><img src={svg['arrow-mini-white-top']} alt="" /></div>
                <div><img src={svg['arrow-mini-white-bottom']} alt="" /></div>
                <div><img src={svg['arrow-mini-white-left']} alt="" /></div>
                <div><img src={svg['arrow-mini-white-right']} alt="" /></div>
                <p>Регулировка</p>
            </div>
            <div className="drift-grid-wrap">
                <p>Угол</p>
                <p>Скорость</p>
                <div className="drift-grid">
                    <div className="drift-mod-regulator" style={{
                        bottom: `${this.state.angle}%`,
                        left: `${this.state.speed}%`,
                    }} />
                    <img src={svg['drift-grid']} alt="" />
                </div>
            </div>
        </div></Draggable>;
    }
}
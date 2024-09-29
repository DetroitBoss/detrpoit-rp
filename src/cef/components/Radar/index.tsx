import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import './style.less'

import plates from './images/plates/*.png'

const radarDefault = {
    fs: 20,
    fp: "",
    ft: 0,
    rs: 0,
    rp: "",
    rt: 0,
    fl: 0,
    rl: 0,
    s: 0,
    on: true,
    show: false,
}

/** Компонент для обновления данных получая от сервера в режиме реального времени */
export class RadarClass extends Component<{}, typeof radarDefault> {
    constructor(props: any) {
        super(props);
        this.state = radarDefault

        CustomEvent.register('radar:show', (status: boolean) => {
            this.setState({show: status})
        })
        CustomEvent.register('radar:data', (fs: number, fp: string, rs: number, rp: string, ft: number, rt: number) => {
            this.setState({fs, rs, fp, rp, ft, rt})
        })
        CustomEvent.register('hud:speedometer', (data: { [param: string]: any }) => {
            if (JSON.stringify(data).length < 5) return this.setState({ s: 0 });
            return this.setState({ s: data.s });
        })
    }

    getValue(key: keyof typeof radarDefault){
        if(!this.state.on) return null;
        return this.state[key]
    }

    enable(){
        const newstatus = !this.state.on;
        this.setState({on: newstatus})
        CustomEvent.triggerClient('radar:status', newstatus)
    }

    upLimit(type: 1 | 2){
        const param: keyof typeof radarDefault = type == 1 ? 'fl' : 'rl'
        let val = this.state[param] + 20;
        if(val > 200) val = 0
        let data = {...this.state};
        data[param] = val;
        this.setState(data)
    }

    get enabled(){
        return !!this.state.on
    }


    render() {
        if(!this.state.show) return <></>;
        return <div className={"radar_block"}>

            <div id="radarFrame">
                {this.enabled && (this.state.fp || this.state.rp) ? <div id="plateReaderFrame">
                    <div className="frame_border" />

                    <div id="plateReader">
                        <div className="labels">
                            <p className="title">ПЕРЕДНИЙ РАДАР</p>
                            <p className="title">ЗАДНИЙ РАДАР</p>
                        </div>

                        <div className="plates">
                            <div id="frontPlate" className="plate_container">
                                <img id="frontPlateImg" className="plate" src={plates[this.state.ft]} />

                                <div id="frontPlateText" className="text_container">
                                    <p id="frontPlateTextFill" className="plate_blue">{this.state.fp}</p>
                                    <p className="hilite">{this.state.fp}</p>
                                    <p id="frontPlateTextLolite" className="lolite">{this.state.fp}</p>
                                    <p className="shadow">{this.state.fp}</p>
                                </div>
                            </div>

                            <div id="rearPlate" className="plate_container">
                                <img id="rearPlateImg" className="plate" src={plates[this.state.rt]} />

                                <div id="rearPlateText" className="text_container">
                                    <p id="rearPlateTextFill" className="plate_blue">{this.state.rp}</p>
                                    <p className="hilite">{this.state.rp}</p>
                                    <p id="rearPlateTextLolite" className="lolite">{this.state.rp}</p>
                                    <p className="shadow">{this.state.rp}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div> : <></>}

                <div className="frame_border" />

                <div className="radar_container">
                    <div className="panel_side panel_left" />

                    <div id="radar">
                        {/*<div className="label label_top">ПЕРЕДНИЙ РАДАР</div>*/}

                        <div className="pwr_button_container">
                            <div id="pwrBtn" data-nuitype="togglePower" className="pwr_button" onClick={e => {
                                e.preventDefault()
                                this.upLimit(1)
                            }}>FL</div>
                            <div id="pwrBtn" data-nuitype="togglePower" className="pwr_button" onClick={e => {
                                e.preventDefault()
                                this.enable()
                            }}>PWR</div>
                            <div id="pwrBtn" data-nuitype="togglePower" className="pwr_button" onClick={e => {
                                e.preventDefault()
                                this.upLimit(2)
                            }}>RL</div>
                        </div>

                        <div className="modes_container">
                            {/*<div className="modes">*/}
                            {/*    <p id="frontSame">SAME</p>*/}
                            {/*    <p id="frontOpp">OPP</p>*/}
                            {/*    <p id="frontXmit">XMIT</p>*/}
                            {/*</div>*/}

                            {/*<div className="modes">*/}
                            {/*    <p id="rearSame">SAME</p>*/}
                            {/*    <p id="rearOpp">OPP</p>*/}
                            {/*    <p id="rearXmit">XMIT</p>*/}
                            {/*</div>*/}
                        </div>

                        <div className="speeds_container">
                            <div className="display">
                                <p className="ghost_speed" />
                                <p className="speed" id="frontSpeed">{this.getValue('fs')}</p>
                            </div>

                            <div className="display">
                                <p className="ghost_speed" />
                                <p className="speed" id="rearSpeed">{this.getValue('rs')}</p>
                            </div>
                        </div>

                        <div className="speed_arrows_container">
                            {/*<div className="speed_arrows">*/}
                            {/*    <div className="arrow" id="frontDirAway" />*/}
                            {/*    <div className="arrow arrow_down" id="frontDirTowards" />*/}
                            {/*</div>*/}

                            {/*<div className="speed_arrows">*/}
                            {/*    <div className="arrow" id="rearDirTowards" />*/}
                            {/*    <div className="arrow arrow_down" id="rearDirAway" />*/}
                            {/*</div>*/}
                        </div>

                        <div className="modes_container">
                            <div className="modes fast_top">
                                <p id="frontFastLabel"  className={this.getValue('fs') && this.getValue('fl') && this.getValue('fs') >= this.getValue('fl') ? 'active' : ''}>FAST</p>
                                <p id="frontFastLockLabel" className={this.getValue('fl') ? 'active' : ''}>LOCK</p>
                            </div>

                            <div className="modes fast_bottom">
                                <p id="rearFastLabel" className={this.getValue('rs') && this.getValue('rl') && this.getValue('rs') >= this.getValue('rl') ? 'active' : ''}>FAST</p>
                                <p id="rearFastLockLabel" className={this.getValue('rl') ? 'active' : ''}>LOCK</p>
                            </div>
                        </div>

                        <div className="speeds_container">
                            <div className="display fast fast_top">
                                <p className="fast_ghost_speed" />
                                <p className="fast_speed" id="frontFastSpeed">{this.getValue('fl') || (this.getValue('fl') === null ? '' : 'OFF')}</p>
                            </div>

                            <div className="display fast fast_bottom">
                                <p className="fast_ghost_speed" />
                                <p className="fast_speed" id="rearFastSpeed">{this.getValue('rl') || (this.getValue('rl') === null ? '' : 'OFF')}</p>
                            </div>
                        </div>

                        <div className="speed_arrows_container">
                            {/*<div className="speed_arrows fast_top">*/}
                            {/*    <div className="arrow" id="frontFastDirAway" />*/}
                            {/*    <div className="arrow arrow_down" id="frontFastDirTowards" />*/}
                            {/*</div>*/}

                            {/*<div className="speed_arrows fast_bottom">*/}
                            {/*    <div className="arrow" id="rearFastDirTowards" />*/}
                            {/*    <div className="arrow arrow_down" id="rearFastDirAway" />*/}
                            {/*</div>*/}
                        </div>

                        <div className="patrol_and_logo_container">
                            <div className="logo"><span className="name">Wraith</span> ARS 2X</div>

                            <div className="speeds_container">
                                <div className="display fast">
                                    <p className="patrol_ghost_speed" />
                                    <p className="patrol_speed" id="patrolSpeed">{this.getValue('s')}</p>
                                </div>
                            </div>

                            <div className="speed_label">PATROL SPEED</div>
                        </div>

                        {/*<div className="label label_bottom">ЗАДНИЙ РАДАР</div>*/}
                    </div>

                    <div className="panel_side panel_right" />
                </div>
            </div>
        </div>;
    }
}
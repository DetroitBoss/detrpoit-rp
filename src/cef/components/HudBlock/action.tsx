import './style.less';
//import './../UserMenu/assets/main-menu.less';
import React, {Component} from 'react';
//import svgs from './images/svg/*.svg';
import png from './images/*.png'
import {CustomEvent} from '../../modules/custom.event';
import {CustomEventHandler} from '../../../shared/custom.event';
import '../../assets/less/animate.less';
import '../../assets/less/uikit.less';
import coin from './images/svg/coin.svg';
import {CEF} from "../../modules/CEF";

export class HudActions extends Component<{}, {
    show:boolean,
    actions?: Array<{ type: number, time: number, desc?:string, amount?:number, pic:string }>,
    current: number,
    notShow:boolean
}> {
    ev: CustomEventHandler;
    timer: NodeJS.Timeout;
    constructor(props: any) {
        super(props);

        this.state = {
            show:false,
            notShow: false,
            actions: [
//                {type:0, time: 5, desc: 'Акция действительна с 14:00 до 23:00', amount: 200, pic: 'coins-action' }
//                {type:1, time: 20, desc:'Mercedes W140', pic: 'car-action' }
            ],
            current: 0
        }
        this.ev = CustomEvent.register('hud:actions', (list:  { type: number, time: number, desc?:string, amount?:number, pic:string }[]) => {
            this.setState( { ...this.state, show:true, current: 0,actions: list, notShow: false} );
            CEF.gui.enableCusrsor()
        })
    }

    componentWillUnmount() {
        if (this.ev) this.ev.destroy();
    }
    render() {
        if(this.state.show === false ) return null;
        if( !this.state.actions.length ) return null;
        let cur = this.state.current;
        return <>
            <div className="overflow"> 
            <div className="action-wrapper-box">
                <div className="action-imagebox">
                    <img src={png[this.state.actions[ cur ].pic]} alt=""/>
                </div>
                <div className="action-wrapper-content">
                    <div>
                        <div className="action-title mb24">
                            {this.state.actions[ cur ].type === 0 ? 
                                <p>Отыграй<br />{this.state.actions[ cur ].time} часов и получи<br /><i className="icon-in-text"><img src={coin} alt=""/></i>{this.state.actions[ cur ].amount} коинов</p> : null }
                            {this.state.actions[ cur ].type === 1 ? 
                                <p>Выиграй автомобиль отыграв {this.state.actions[ cur ].time} часов</p> : null }
                        </div>
                            {this.state.actions[ cur ].type === 0 ? 
                                <p className="font18 fontw400 ln-1-4 mb32">{this.state.actions[ cur ].desc}<br />
                                    Время вы можете отследить в главном меню: <strong>M</strong>
                                </p>: null}
                            {this.state.actions[ cur ].type === 1 ? 
                                <p className="font18 fontw400 ln-1-4 mb32">Вы можете получить купон на бесплатный автомобиль <strong>{this.state.actions[ cur ].desc}</strong>! Используйте купон в инвентаре и получите авто!<br />Время вы можете отследить в главном меню: <strong>M</strong></p> : null }
                        <div className="hud-flex-line">
                            <button className="easy-button orange" onClick={()=>{
                                if(this.state.notShow) CustomEvent.triggerServer('wintaskevent:setnotshow', this.state.actions[ cur ].type)
                                if( this.state.actions.length <= cur+1) {
                                    this.setState({show: false});
                                    CEF.gui.disableCusrsor()
                                }
                                else {
                                    this.setState({current: cur + 1, notShow: false});
                                }
                            }}>
                                <p>Закрыть</p>
                            </button>
                            <div className="hud-switch-item">
                                <div className="switch-wrap">
                                    <input type="checkbox" id="switch2" checked={this.state.notShow} onChange={(e)=>{
                                        e.preventDefault();
                                        this.setState( {notShow: !this.state.notShow});
                                    }}/>
                                    <label htmlFor="switch2"></label>
                                </div>
                                <label htmlFor="switch2" className="label-p"><p>Больше не показывать</p></label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </>
    }
}
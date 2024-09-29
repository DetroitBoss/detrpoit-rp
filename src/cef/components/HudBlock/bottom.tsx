import './style.less';
import React, {Component} from 'react';
import svgs from './images/svg/*.svg'
import {CEF} from '../../modules/CEF';
import {CustomEvent} from '../../modules/custom.event';
import {systemUtil} from '../../../shared/system';
import casinochip from "../CasinoRoulette/assets/img/chip.png";
import {system} from "../../modules/system";
import candy from "./images/candy.png";
import lollipop from "./images/lollipop.png"

export class HudBottomClass extends Component<{}, {
    sumChange?: number, zone: string, street: string, customZone1: string, customZone2: string, customZoneIcon?: "ok" | "no",
    hasBankCard: boolean, money: number, bank: number, microphone: boolean, style: React.CSSProperties,
    inSaveZone?:boolean,
    inRedZone?:boolean,
    chips: number,
    inCasino: boolean,
    candyCount?: number,
    lollipopCount?: number
}> {
    constructor(props: any) {
        super(props);

        this.state = { lollipopCount: 0, candyCount: 0, microphone: false, hasBankCard: true, money: 0, bank: 0, chips: 0, zone: 'Зона', street: 'Улица', customZone1: 'Зелёная', customZone2: 'зона', customZoneIcon: "ok", style: null, inCasino: false }

        CustomEvent.register('hud:zone', (zone: string, street: string) => {
            zone = unescape(zone);
            street = unescape(street);
            this.setState({ zone, street });
        })

        CustomEvent.register('hud:incasino', (inCasino: boolean) => {
            this.setState({ inCasino });
        })

        CustomEvent.register('cef:hud:setMoney', (money: number) => {
            this.drawChangeMoney(this.state.money, money)
            CEF.user.money = money;
            this.setState({ money: money });
        });
        CustomEvent.register('cef:hud:setChips', (money: number) => {
            CEF.user.chips = money;
            this.setState({ chips: money });
        });
        CustomEvent.register('cef:hud:setMoneyBank', (money) => {
            this.drawChangeMoney(this.state.bank, money)
            CEF.user.bank = money;
            this.setState({ bank: money });
        });
        CustomEvent.register('cef:hud:hasBankCard', (status) => {
            this.setState({ hasBankCard: status });
        });

        CustomEvent.register('hud:setMicrophone', status => {
            this.setState({ microphone: status });
        })

        CustomEvent.register('hud:updateCandy', (count) => {
            this.setState({ candyCount: count });
        });
        CustomEvent.register('hud:updateLollipops', (count) => {
            this.setState({ lollipopCount: count });
        });

        CustomEvent.register('cef:alert:setSafezoneInfo', (width: number, height: number, left: number, bottom: number) => {
            this.setState({
                style: {
                    bottom: `${bottom}px`,
                    left: `${left + width + 42}px`,
                    display: 'flex',
                    position: 'absolute'
                }
            })
        });

        CustomEvent.register('savezone:set', inSaveZone => {
            this.setState({inSaveZone})
        });
        CustomEvent.register('redzone:set', inRedZone => {
            this.setState({inRedZone})
        })
    }

    drawChangeMoney(old: number, sum: number){
        this.setState({sumChange: sum - old}, () => {
            setTimeout(() => {
                if (this.state.sumChange != (sum - old)) return;
                this.setState({sumChange: null})
            }, 3000)
        })
    }

    render() {
        return <div className="hud-location-wrapper" style={this.state.style}>
            <div className="hud-money-wrapper">
                {this.state.candyCount != null && this.state.candyCount > 0 ?
                    <div className="hud-money-column hud-money-candy">
                        <img src={candy} alt=""/>
                        <span>{this.state.candyCount}</span>
                    </div>
                    : <></>
                }
                <div className="hud-money-column">
                    <div className="money-wrap">
                        <p className="p-big">${systemUtil.numberFormat(this.state.money)}</p>
                        {this.state.bank ? <p className="p-small">${systemUtil.numberFormat(this.state.bank)}</p> : <></>}
                    </div>
                    {this.state.sumChange ? <div className="hud-raised-money up">
                        <p>{this.state.sumChange >= 0 ? '+' : '-'}${systemUtil.numberFormat(Math.abs(this.state.sumChange))}</p>
                        <img src={svgs[this.state.sumChange >= 0 ? 'raise-arrow' : 'arrow-down']} width="24" height="24" />
                    </div> : <></>}
                </div>
            </div>
            <div className="text-wrap">
                {this.state.inSaveZone || this.state.inRedZone ? <div className={"location-area "+(this.state.inRedZone ? 'red-area' : 'green-area')}>
                    <div className="icon-wrap green-area-icon">
                        <img src={svgs['shield-ok']} width="24" height="24" />
                    </div>
                    <div className="icon-wrap red-area-icon">
                        <img src={svgs['shield-no']} width="24" height="24" />
                    </div>
                    <p className="p-red"><span>Красная</span> зона</p>
                    <p className="p-green"><span>Мирная</span> зона</p>
                </div> : <></>}

                <div className="downline">
                    <div className={"mic-wrap "+(this.state.microphone ? 'on' : 'off')}>
                        <div className="icon-wrap mic-on">
                            <img src={svgs['mic-on']} width="24" height="24" />
                        </div>
                        <div className="icon-wrap mic-off">
                            <img src={svgs['mic-off']} width="24" height="24" />
                        </div>
                    </div>
                    <div className="address-wrap">
                        {this.state.inCasino ? <div className="casino-chips small">
                            <img src={casinochip} alt="" />
                            <p>{system.numberFormat(CEF.user.chips)}</p>
                        </div> : <>
                            <img src={svgs['compas']} width="24" height="24" />
                            <div className="text-wrap">
                                <p className="p-big">{this.state.zone}</p>
                                <p className="p-descr">{this.state.street}</p>
                            </div>
                        </>}
                    </div>
                </div>
            </div>
        </div>
    }
};
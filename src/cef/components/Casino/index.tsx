import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import './assets/style.less'
import svg from './assets/*.svg';
import png from './assets/png/*.png';
import {CustomEventHandler} from "../../../shared/custom.event";
import {systemUtil} from '../../../shared/system';
import {CEF} from '../../modules/CEF';
import blink from './assets/blink.gif';
import {CASINO_BUY_CHIPS_INTERFACE, CHIP_COST, CHIP_MIN_SELL, CHIP_SELL_COST} from "../../../shared/casino/main";
import {system} from "../../modules/system";

type CasinoType = {

    buyModal: number,
    sellCoins: number;
    sellPrice: number;
    bet: number;
}


/** Шаг ставки рулетки */
const BET_UP = 100;

export class Casino extends Component<{}, CasinoType> {
    private readonly ev2: CustomEventHandler;
    private readonly ev3: CustomEventHandler;
    constructor(props: any) {
        super(props);
        this.state = {
            buyModal: 0,
            sellCoins: 0,
            sellPrice: 0,
            bet: 0
        };

        this.ev2 = CustomEvent.register('cef:hud:setMoney', (money: number) => this.setState({ ...this.state }));
        this.ev3 = CustomEvent.register('cef:hud:setChips', (money: number) => this.setState({ ...this.state }));

    }

    componentWillUnmount() {
        if (this.ev2) this.ev2.destroy();
        if (this.ev3) this.ev3.destroy();
    }


    buyCoin = ( coins: number ) => {
        this.setState({buyModal: coins})
    }

    buyCoinAccept = ( ) => {
        const coins = this.state.buyModal;
        if(!coins) return this.setState({buyModal: 0});
        const cost = CHIP_COST * coins;
        if(cost > CEF.user.money) return CEF.alert.setAlert('error', 'У вас недостаточно средств для оплаты');
        this.setState({buyModal: 0})
        CustomEvent.callServer( 'casino:chips:buy', coins );
    }

    sellCoin = ( coins: number ) => {
        if(coins > CEF.user.chips) return CEF.alert.setAlert('error', 'У вас недостаточно фишек для продажи');
        if(coins < CHIP_MIN_SELL) return CEF.alert.setAlert('error', `Минимальная сумма для продажи фишек ${CHIP_MIN_SELL}`);
        CustomEvent.callServer( 'casino:chips:sell', coins );
    }
    render() {
        return <section className="casino-game-changer-section animated fadeIn">
            {this.state.buyModal ? <div className="casino-buy-modal">
                <i className="modal-close" onClick={e => {this.buyCoin(0)}}><img src={svg['close-dark']} alt=""/></i>
                <p className="titlecasbuy font24 strong-in fontw400 mb32">Вы уверены, что хотите <strong>приобрести {system.numberFormat(this.state.buyModal)} фишек?</strong></p>
                <div className="flex-line center">
                    <button className="modal-button green mr12" onClick={e => {this.buyCoinAccept()}}>Оплатить<p /></button>
                    <button className="modal-button grey" onClick={e => {this.buyCoin(0)}}>Отмена<p /></button>
                </div>
            </div> : <></>}

            <i className="fly-casino-girl-left animated fadeInLeft"><img src={png['girl']} alt=""/></i>
            <i className="fly-casino-smoke-mid animated fadeInUp"><img src={png['smoke-bottom']} alt=""/></i>
            <div className="cgc-changer-wrapper animated fadeInDown">
                <p className="cgc-title mb50"><strong>Покупка</strong> фишек</p>
                <div className="flex-line left mb50">
                    <p className="casino-mini-font mr12 op4">Покупка</p>
                    <div className="casino-chips small mr50">
                        <img src={png['chip']} alt=""/>
                        <p>1 к ${CHIP_COST}</p>
                    </div>
                    <p className="casino-mini-font mr12 op4">Продажа</p>
                    <div className="casino-chips small">
                        <img src={png['chip']} alt=""/>
                        <p>1 к ${CHIP_SELL_COST}</p>
                    </div>
                </div>
                <div className="cgc-grid-buy">
                    {CASINO_BUY_CHIPS_INTERFACE.map((item, count) => {
                        return <button className={item.class || ''}  onClick={ ()=> this.buyCoin( item.count ) }>
                            <div className="casino-chips large">
                                <img src={png['chip']} alt=""/>
                                <p>{systemUtil.numberFormat( item.count )}</p>
                            </div>
                            <div className="cgc-info-box">
                                <p className="casino-mini-font mb8">Стоимость</p>
                                <p className="cgc-count-buy">${systemUtil.numberFormat( item.count*CHIP_COST )}</p>
                            </div>
                        </button>
                    })}
                </div>
                <p className="cgc-title mb12"><strong>Продажа</strong> фишек</p>
                <p className="casino-mini-font mb32">Введите количество фишек или сумму денег</p>
                <div className="flex-line">
                    <div className="casigno-changer-inputs mr12">
                        <input type="number" value={this.state.sellCoins > 0 ? this.state.sellCoins : ''} placeholder="000 000" className="casino-changer-input cgc-money" onChange={ (e:any) => {
                            if( e.target.valueAsNumber < 0 || e.target.valueAsNumber >= 999999 ) return;
                            if( e.target.valueAsNumber > CEF.user.chips ) e.target.valueAsNumber = CEF.user.chips;
                            this.setState( { sellCoins: e.target.valueAsNumber, sellPrice: e.target.valueAsNumber*CHIP_SELL_COST })
                        }}/>
                        <input type="number" value={this.state.sellPrice > 0 ? this.state.sellPrice : ''} placeholder="000 000" className="casino-changer-input cgc-chips" onChange={ (e:any) => {
                            if( e.target.valueAsNumber < 0 || e.target.valueAsNumber >= 99999999 ) return;
                            if( e.target.valueAsNumber/CHIP_SELL_COST > CEF.user.chips ) e.target.valueAsNumber = CEF.user.chips*CHIP_SELL_COST;
                            //                                let coinsPrice = Math.floor(e.target.valueAsNumber/CHIP_COST) > 0 ? CHIP_COST*Math.floor(e.target.valueAsNumber/CHIP_COST) : e.target.valueAsNumber;
                            this.setState( { sellCoins: Math.floor(e.target.valueAsNumber/CHIP_SELL_COST) , sellPrice: e.target.valueAsNumber })
                        }}/>
                        <div>
                            <img src={png['chip']} alt=""/>
                            <img src={svg['reset']} alt=""/>
                            <img src={svg['icon-cash']} alt=""/>
                        </div>
                    </div>
                    <button className="casino-button-main w100" onClick={ ()=> this.sellCoin( this.state.sellCoins ) }>
                        <p>Продать фишки</p>
                    </button>
                </div>
            </div>
            <div className="casino-balance">
                <p className="casino-mini-font mb24">Баланс</p>
                <div className="casino-chips large mb24">
                    <img src={png['chip']} alt=""/>
                    <p>{systemUtil.numberFormat(CEF.user.chips)}</p>
                </div>
                <p className="cgc-count-buy">${systemUtil.numberFormat(CEF.user.money)}</p>
            </div>
            <i className="cgc-line-left"></i>
        </section>
    }
}

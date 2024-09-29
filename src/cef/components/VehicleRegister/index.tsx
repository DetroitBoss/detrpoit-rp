import React, {Component} from 'react';
import './style.less'
import {systemUtil} from '../../../shared/system';
import {CustomEvent} from '../../modules/custom.event';
import {VEHICLE_REGISTRATION_TARIFS} from '../../../shared/vehicle.registration';
import {DONATE_MONEY_NAMES} from '../../../shared/economy';
import {CEF} from '../../modules/CEF';

export class VehicleRegisterBlock extends Component<{}, {
    openAuction?: boolean,
    openAuctionMenu?: boolean,
    alreadyHave?: boolean;
    id: number,
    numbers: { number: string, name: string, cost: number, seller?: number }[],
    phone_cost: number,
    sim_cost: number,
    loaded: boolean
}>{

    constructor(props: any) {
        super(props);
        this.state = {
            loaded: false,
            alreadyHave: false,
            id: 1,
            numbers: [

            ],
            phone_cost: 10000,
            sim_cost: 500,
        }


        CustomEvent.register('vehicle:register', (alreadyHave: boolean) => {
            this.setState({ alreadyHave, loaded: true})
        })

    }



    render() {
        if(!this.state.loaded) return <></>;
        return <>

            <div className="salon-wrapper">
                <p className="section-fly-title">Окно регистрации #{this.state.id}</p>

                <div className="box-white wide posrev ui-tabs ui-corner-all ui-widget ui-widget-content" id="tabsSalon">
                    {/* <div className="header-menu">
                        <ul className="button-list wide ui-tabs-nav ui-corner-all ui-helper-reset ui-helper-clearfix ui-widget-header" role="tablist">
                            <li className={"ui-tabs-tab ui-corner-top ui-state-default ui-tab " + (!this.state.openAuction ? ' active ui-tabs-active ui-state-active' : '')}><a href="#" className="ui-tabs-anchor" onClick={e => {
                                e.preventDefault();
                                this.setState({ openAuction: false })
                            }}>Услуги</a></li>
                            <li role="tab" className={"ui-tabs-tab ui-corner-top ui-state-default ui-tab" + (this.state.openAuction ? ' active ui-tabs-active ui-state-active' : '')}><a href="#" className="ui-tabs-anchor" onClick={e => {
                                e.preventDefault();
                                this.setState({ openAuction: true })
                            }}>Аукцион</a></li>
                        </ul>
                    </div> */}
                    <div className="box-content">
                        {this.state.openAuction ? <div id="auctionnumbers" className="content-in posrev p20 ui-tabs-panel ui-corner-bottom ui-widget-content" aria-labelledby="ui-id-2" role="tabpanel" aria-hidden="true">
                            {!this.state.openAuctionMenu ? <>

                                <button className="primary-button auction-in wide mininormal mb10" onClick={e => {
                                    e.preventDefault();
                                    this.setState({ openAuctionMenu: true})
                                }}>
                                    <p>Выставить номерной знак на аукцион</p>
                                </button>
                                <div className="auction-th flexbetween">
                                    <p>Номер</p>
                                    <p>Продавец</p>
                                    <p>Цена</p>
                                </div>
                                <div className="list-buy">
                                    
                                    {this.state.numbers ? this.state.numbers.map(phone => {
                                        return <a href="#" className="list-buy-item">
                                            <p>{phone.number}</p>
                                            <p className="mini">{phone.name} {phone.seller ? `(#${phone.seller})` : ''}</p>
                                            <span className="price-bage">${systemUtil.numberFormat(phone.cost)}</span>
                                        </a>
                                    }) : <></>}
                                </div>
                            </> : <>
                                    <button className="primary-button auction-in wide mininormal mb10" onClick={e => {
                                        e.preventDefault();
                                        this.setState({ openAuctionMenu: false })
                                    }}>
                                        <p>Закрыть меню</p>
                                    </button>
                                    <div className="sell-number-info">При выставлении номерного знака на аукцион стоит учитывать следующие моменты:<br/>
                                    - Выставляется тот номер, который находится на вашем текущем ТС<br />
                                    - Отменить процедуру нельзя<br />
                                    - Вы сможете выкупить назад свой номерной знак, если его никто не купил, за 30% от стоимости<br />
                                    - После выставления номерного знака на аукцион ваш ТС останется без него, и вам необходимо получить новый номерной знак для своего транспорта<br />
                                    </div>
                                    <div className="number-sell-input-block">
                                        <p>Укажите стоимость продажи</p>
                                        <input type="number" className='number-sell-input' />
                                    </div>
                            </>}

                        </div> : <div id="numbersphones" className="content-in p20 ui-tabs-panel ui-corner-bottom ui-widget-content" aria-labelledby="ui-id-1" role="tabpanel" aria-hidden="false">
                                <div className="list-buy">
                                    <div className="sell-number-info">Внимание! Покупка нового номерного знака приведёт к замене текущего</div>
                                    {VEHICLE_REGISTRATION_TARIFS.map((item, index) => {
                                        return <a href="#" className="list-buy-item" onClick={e => {
                                            e.preventDefault();
                                            CustomEvent.callServer('vehiclenumber:buy', index)
                                        }}>
                                            <p>{item[0]}</p>
                                            <span className={"price-bage " + (item[2] ? 'donate' : '')}>{item[2] ? '' : '$'}{systemUtil.numberFormat(item[1])} {item[2] ? DONATE_MONEY_NAMES[2] : ''}</span>
                                        </a>
                                    })}
                                    <a href="#" className="list-buy-item close-menu" onClick={e => {
                                       CEF.gui.setGui(null);
                                    }}>
                                        <p>Закрыть</p>
                                    </a>
                                </div>
                            </div>}
                    </div>
                </div>
            </div>

        </>
    }
}
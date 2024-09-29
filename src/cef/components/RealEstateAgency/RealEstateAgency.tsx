import React, {Component} from "react";
import "./style.less";

import png from './assets/*.png'
import svg from "./assets/*.svg"

import streets from "./assets/streets/*.png"
import {CEF} from "../../modules/CEF";
import AgencyStore from "../../stores/Agency";
import {observer} from "mobx-react";
import {cost} from "../../../shared/houses/agency/config";
import {CustomEvent} from "../../modules/custom.event";

@observer
export class RealEstateAgency extends Component<{
    store: AgencyStore
}, {}> {

    store: AgencyStore = this.props.store;

    constructor(props: any) {
        super(props);
    }

    close() {
        CEF.gui.setGui(null);
    }

    choiceHouse(id: number) {
        this.props.store.setState({activeHouse: id})
    }

    componentWillUnmount() {
        this.props.store.setState({activeHouse: null})
    }

    house() {
        return this.store.houses[this.store.activeHouse];
    }

    buy() {
        CustomEvent.triggerServer('agency:setBlip', this.house().id);
        CEF.gui.setGui(null);
    }

    render() {
        return <div className="realtor">

            <img src={svg["background"]} alt="" className="realtor__background"/>
            <img src={png["keyBackground"]} alt="" className="realtor__keyBackground"/>

            <div className="realtor-body">

                <div className="exit" onClick={() => this.close()}>
                    <div className="exit__icon"><img src={svg["closeIcon"]} alt="#"/></div>
                    <div className="exit__title">Закрыть</div>
                </div>

                <div className="realtor-body__background"/>

                <div className="realtor-body-left">

                    <div className="realtor-body-left-head">
                        <div className="realtor-body-left-head__id">#{this.store.id}</div>
                        <div className="realtor-body-left-head__title">Риелторское Агентство</div>
                        <div className="realtor-body-left-head__address">
                            <img src={svg["gpsIcon"]} alt=""/> {this.store.name}
                        </div>
                    </div>

                    <div className="realtor-body-left__waiting">
                        <img src={png["aimCity"]} alt=""/>
                        <span>Ожидайте, когда в списке появится недвижимость, чтобы купить метку на нее</span>
                    </div>

                    <div className="realtor-body-left__listTitle">Список недвижимости</div>

                    <div className="realtor-body-left-list">

                        {this.store.houses.map((el, id) => {
                            return <div
                                className={`realtor-body-left-list-block ${this.store.activeHouse === id ? 'realtor-body-left-list-block-active' : ''}`}
                                onClick={() => this.choiceHouse(id)} key={id}>
                                <div className="realtor-body-left-list-block__id">#{el.id}</div>
                                <div className="realtor-body-left-list-block__title">{el.name}</div>
                                <div className="realtor-body-left-list-block__check">
                                    <div/>
                                </div>
                            </div>
                        })}


                    </div>

                </div>


                {this.store.activeHouse !== null && <div className="realtor-body-right">
                    <div className="realtor-body-right-banner">

                        <img src={streets["michaelHouse"]} alt="" className="realtor-body-right-banner__background"/>
                        <img src={png["licensed"]} alt="" className="realtor-body-right-banner__licensed"/>

                        <div className="realtor-body-right-banner__id">#{this.house().id}</div>
                        <div className="realtor-body-right-banner__title">{this.house().name}</div>

                    </div>

                    <div className="realtor-body-right__category">
                        Основная Информация
                    </div>

                    <div className="realtor-body-right-row">

                        <div className="realtor-body-right-row-block">
                            <img src={svg["storageIcon"]} alt=""/>
                            <div>
                                <h1>Хранилище</h1>
                                <span>{this.house().repository ? 'Есть' : 'Нету'}</span>
                            </div>
                        </div>

                        <div className="realtor-body-right-row-block">
                            <img src={svg["garageIcon"]} alt=""/>
                            <div>
                                <h1>Гараж</h1>
                                <span>{this.house().garageSpaces} ТС</span>
                            </div>
                        </div>

                        <div className="realtor-body-right-row-block">
                            <img src={svg["warehouseIcon"]} alt=""/>
                            <div>
                                <h1>Склад</h1>
                                <span>{this.house().stock ? 'Есть' : 'Нету'}</span>
                            </div>
                        </div>

                    </div>

                    <div className="realtor-body-right__category">
                        Преимущества
                    </div>

                    <div className="realtor-body-right-row">

                        <div className="realtor-body-right-row-block">
                            <img src={svg["interiorIcon"]} alt=""/>
                            <div>
                                <h1>Интерьер</h1>
                                <span>{this.house().interior}</span>
                            </div>
                        </div>

                        {this.house().helicopter && <div className="realtor-body-right-row-block">
                            <img src={svg["helicopterIcon"]} alt=""/>
                            <div>
                                <h1>Вертолетная</h1>
                                <span>площадка</span>
                            </div>
                        </div>}


                    </div>

                    <div className="realtor-body-right-footer">
                        <div className="realtor-body-right-footer__button" onClick={() => this.buy()}>
                            Купить метку на дом
                        </div>
                        <div className="realtor-body-right-footer__price">
                            {cost} $
                        </div>
                    </div>
                </div>}

                {
                    this.store.activeHouse === null && <div className="realtor-body-right-center">
                        <img src={svg["hands"]} alt=""/>
                        <div className="realtor-body-right-center__title">Выберите недвижимость</div>
                        <div className="realtor-body-right-center__text">Здесь появится вся подробная информация</div>
                    </div>
                }

            </div>

        </div>

    }
}
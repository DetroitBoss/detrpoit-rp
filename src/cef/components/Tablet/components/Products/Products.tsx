import React, {Component} from "react";
import "./style.less";

import png from "./assets/*.png";
import svg from "./assets/*.svg";
import {fractionCfg} from "../../../../modules/fractions";
import classNames from "classnames";
import {CEF} from "../../../../modules/CEF";

import {Order} from "./pages/Order";
import {Prices} from "./pages/Prices";
import {Top} from "./pages/Top";
import {Statistics} from "./pages/Statistics";
import {Taxes} from "./pages/Taxes";

import {Basket} from "./components/Basket";
import {BuyList} from "./components/BuyList";
import {PriceControl} from "./components/PriceControl";
import {CustomEvent} from "../../../../modules/custom.event";
import {
    IBaseBusinessInfo, IBusinessCatalogRating, IBusinessTaxLog, ILastSells,
    IOrderCatalogDTO,
    IPricesCatalog,
    ITaxes, IUserBuyerRating
} from "../../../../../shared/tablet/business.config";
import {CustomEventHandler} from "../../../../../shared/custom.event";
import {system} from "../../../../modules/system";

export class Products extends Component<{
    back: Function
}, {
    page: string
    catalog: IOrderCatalogDTO[] | null
    baseInfo: IBaseBusinessInfo | null
    pricesCatalog: IPricesCatalog[] | null
    taxData: ITaxes | null
    weekRating: IUserBuyerRating[] | null
    monthRating: IUserBuyerRating[] | null
    catalogRating: IBusinessCatalogRating[] | null
    lastSells: ILastSells[] | null
}> {
    ev: CustomEventHandler
    ev2: CustomEventHandler

    constructor(props: any) {
        super(props);

        this.state = {
            page: "order",
            catalog: null,
            baseInfo: null,
            pricesCatalog: null,
            taxData: null,
            weekRating: null,
            monthRating: null,
            catalogRating: null,
            lastSells: null
        }

        this.ev = CustomEvent.register('tablet:business:update:pricesCatalog', this.updatePricesCatalog);
        this.ev2 = CustomEvent.register('tablet:business:update:taxData', this.updateTaxData);
    }

    async componentDidMount() {
        const baseInfo = await CustomEvent.callServer('tablet:business:baseInfo');
        const catalog = await CustomEvent.callServer('tablet:business:loadCatalog');
        const pricesCatalog = await CustomEvent.callServer('tablet:business:pricesCatalog');
        const taxData = await CustomEvent.callServer('tablet:business:taxData');
        const weekRating = await CustomEvent.callServer('tablet:business:rating:week');
        const monthRating = await CustomEvent.callServer('tablet:business:rating:month');
        const catalogRating = await CustomEvent.callServer('tablet:business:catalog:rating');
        const lastSells = await CustomEvent.callServer('tablet:business:lastSells');


        this.setState({
            catalog,
            baseInfo,
            pricesCatalog,
            taxData,
            weekRating,
            monthRating,
            catalogRating,
            lastSells
        })
    }

    componentWillUnmount() {
        this.ev.destroy();
        this.ev2.destroy();
    }

    updatePricesCatalog = async () => {
        const pricesCatalog = await CustomEvent.callServer('tablet:business:pricesCatalog');

        this.setState({
            pricesCatalog
        })
    }

    updateTaxData = async () => {
        const taxData = await CustomEvent.callServer('tablet:business:taxData');

        this.setState({
            taxData
        })
    }


    switchPage(el: string) {
        this.setState({page: el})
    }

    render() {
        return <div className="tablet-products">
            <div className="tablet-products-navigation">
                <div className="tablet-products-navigation__back" onClick={() => this.props.back()}>
                    <img src={svg["back"]} alt=""/> Назад
                </div>
                <div className="tablet-products-navigation-list">
                    <div onClick={() => {
                        this.switchPage("order")
                    }} className={classNames(
                        {'tablet-products-navigation-list__active': this.state.page === "order"}
                    )}>Заказ продукции
                    </div>
                    <div onClick={() => {
                        this.switchPage("statistics")
                    }} className={classNames(
                        {'tablet-products-navigation-list__active': this.state.page === "statistics"}
                    )}>Статистика товаров
                    </div>
                    <div onClick={() => {
                        this.switchPage("prices")
                    }} className={classNames(
                        {'tablet-products-navigation-list__active': this.state.page === "prices"}
                    )}>Регулировка цен
                    </div>
                    <div onClick={() => {
                        this.switchPage("top")
                    }} className={classNames(
                        {'tablet-products-navigation-list__active': this.state.page === "top"}
                    )}>Топ покупателей
                    </div>
                    <div onClick={() => {
                        this.switchPage("taxes")
                    }} className={classNames(
                        {'tablet-products-navigation-list__active': this.state.page === "taxes"}
                    )}>Налоги
                    </div>
                </div>

                {this.state.baseInfo !== null && <><div className="tablet-products-navigation__title">
                    {this.state.baseInfo.name}
                </div>

                <div className="tablet-products-navigation__title">
                    {system.numberFormat(this.state.baseInfo.cost)} $
                    <span>Стоимость</span>
                </div>

                <div className="tablet-products-navigation__title">
                    {system.numberFormat(this.state.baseInfo.money)} $
                    <span>Баланс</span>
                </div></>}
            </div>
            <div className="tablet-products-body">

                {/*
                    <Basket/>
                    <BuyList/>
                    <PriceControl/>
                */}

                <div className="tablet-products-body__title">
                    {this.state.page === "order" && <><img src={svg["bag"]} alt=""/>Заказ продукции</>}
                    {this.state.page === "statistics" && <><img src={svg["stats"]} alt=""/>Статистика товаров</>}
                    {this.state.page === "prices" && <><img src={svg["key"]} alt=""/>Регулировка цен</>}
                    {this.state.page === "top" && <><img src={svg["user"]} alt=""/>Топ покупателей</>}
                    {this.state.page === "taxes" && <><img src={svg["document"]} alt=""/>Налоги</>}
                </div>

                {this.state.page === "order" && <Order catalog={this.state.catalog} baseInfo={this.state.baseInfo}
                                                       catalogRating={this.state.catalogRating}/>}
                {this.state.page === "statistics" && <Statistics rating={this.state.catalogRating}/>}
                {this.state.page === "prices" &&
                    <Prices catalog={this.state.pricesCatalog} baseInfo={this.state.baseInfo}/>}
                {this.state.page === "top" &&
                    <Top week={this.state.weekRating} month={this.state.monthRating} lastSells={this.state.lastSells}/>}
                {this.state.page === "taxes" && <Taxes data={this.state.taxData}/>}
            </div>
        </div>
    }
}
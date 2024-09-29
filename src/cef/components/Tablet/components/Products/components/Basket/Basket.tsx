import React, {Component} from "react";
import "../../style.less";

import png from "../../assets/*.png";
import svg from "../../assets/*.svg";
import classNames from "classnames";
import ReactTooltip from 'react-tooltip';
import {IOrderCatalogDTO} from "../../../../../../../shared/tablet/business.config";
import {ORDER_CONFIG} from "../../../../../../../shared/order.system";
import {system} from "../../../../../../modules/system";

export class Basket extends Component<{
    show: (toggle: boolean) => void
    catalog: IOrderCatalogDTO[]
    remove: (item: number) => void
    order: () => void
    discount: () => number
    upgrade: number
}, {}> {
    constructor(props: any) {
        super(props);
    }

    getDeliveryAmount () {
        return Math.floor(((this.getTotalAmount() / 100) * ORDER_CONFIG.COMISSION))
    }

    getTotalAmount () {
        let amount = 0;

        this.props.catalog.forEach(el => {
            amount += el.orderCount * el.price;
        })

        if (this.props.discount() !== 0) {
            return amount - Math.floor(amount / 100 * (this.props.discount()))
        }

        return amount;
    }

    render() {
        return <div className="tp-basket">
            <div className="tp-basket-top">
                <img src={svg["cross"]} className="tp-basket-top__close" alt="" onClick={() => this.props.show(false)} />
                <div className="tp-basket-top__title">Корзина</div>
                <div className="tp-basket-top-list">
                    {
                        this.props.catalog.map((el, key) => {
                            return <div className="tp-basket-top-list-block" key={key}>
                                <div className="tp-basket-top-list-block__name">{el.name}</div>
                                <div className="tp-basket-top-list-block__value">x{el.orderCount}</div>
                                <div className="tp-basket-top-list-block__sum">
                                    {system.numberFormat(el.orderCount * el.price)} $
                                    <img src={svg["trash"]} alt="" onClick={() => this.props.remove(el.item)}/>
                                </div>
                            </div>
                        })
                    }
                </div>
                <div className="tp-basket-top__line"/>
                <div className="tp-basket-top__order">
                    <span>Цена доставки</span>
                    <h1>{this.getDeliveryAmount()} $</h1>
                </div>
            </div>
            <div className="tp-basket-bottom">
                <img src={svg["basketBottom"]} className="tp-basket-bottom__background" alt=""/>
                <h1>Итог</h1>
                {this.props.upgrade > 0 && <h2>С учетом скидки {this.props.upgrade} ур.</h2>}
                <span>{system.numberFormat(this.getTotalAmount() + this.getDeliveryAmount())} $</span>
                <div className="tp-basket-bottom__button" onClick={() => this.props.order()}>Оформить</div>
            </div>
        </div>;
    }
}
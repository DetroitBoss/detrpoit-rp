import React, {ChangeEvent, Component} from "react";
import "../../style.less";

import png from "../../assets/*.png";
import svg from "../../assets/*.svg";
import classNames from "classnames";
import ReactTooltip from 'react-tooltip';
import {IBaseBusinessInfo, IPricesCatalog} from "../../../../../../../shared/tablet/business.config";
import {system} from "../../../../../../modules/system";
import {CustomEvent} from "../../../../../../modules/custom.event";
import {BUSINESS_TYPE} from "../../../../../../../shared/business";

export class PriceControl extends Component<{
    item: IPricesCatalog
    toggleControl: (data?: IPricesCatalog) => void
    baseInfo: IBaseBusinessInfo
}, {
    price: string
}> {
    constructor(props: any) {
        super(props);

        this.state = {
            price: String(this.props.item.price)
        }
    }

    updatePrice() {
        const price = this.state.price === "" ? this.props.item.price : this.state.price;

        CustomEvent.triggerServer('tablet:business:updatePrice', this.props.item.item, price);
        this.props.toggleControl();
    }

    onChangePrice(event: ChangeEvent<HTMLInputElement>) {
        const newValue = event.currentTarget.value;
        let value = Number(newValue);

        if (isNaN(value) && newValue !== "") return;

        if (newValue === "") {
            this.setState({price: newValue});
            return;
        }

        if (value > this.props.item.maxPrice) value = this.props.item.maxPrice;
        if (value <= 0) value = this.props.baseInfo.type === BUSINESS_TYPE.TUNING ? 0.01 : 1;

        this.setState({price: String(value)});
    }

    render() {
        return <div className="tp-pc">
            <img src={svg["cross"]} className="tp-pc__close" alt="" onClick={() => this.props.toggleControl()}/>
            <div className="tp-pc__title">{this.props.item.name}</div>

            <div className="tp-pc-info">
                <div className="tp-pc-info-block">
                    <img src={svg["wallet"]} alt=""/>
                    <span>Макс. стоимость <h1>{system.numberFormat(this.props.item.maxPrice)} {this.props.baseInfo.type === BUSINESS_TYPE.TUNING ? "%" : "$"}</h1></span>
                </div>
                <div className="tp-pc-info-block">
                    <img src={svg["box"]} alt=""/>
                    <span>На складе <h1>{this.props.item.count}/{this.props.item.maxCount}</h1></span>
                </div>
            </div>

            <div className="tp-pc__text">Текущая стоимость</div>

            <div className="tp-pc-row">
                <input type="number" value={this.state.price}
                       onChange={(event) => this.onChangePrice(event)}/>
                <div className="tp-pc-row__button" onClick={() => this.updatePrice()}>Установить</div>
            </div>
        </div>;
    }
}
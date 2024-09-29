import React, {Component} from "react";
import "../../style.less";

import png from "../../assets/*.png";
import svg from "../../assets/*.svg";
import classNames from "classnames";
import {IBusinessTaxLog, ITaxes} from "../../../../../../../shared/tablet/business.config";
import {system} from "../../../../../../modules/system";
import {CustomEvent} from "../../../../../../modules/custom.event";

export class Taxes extends Component<{
    data: ITaxes
}, {
    page: string
    days: number
    taxesHistory: IBusinessTaxLog[]
}> {
    constructor(props: any) {
        super(props);

        this.state = {
            page: "main",
            days: this.getMaxDays(),
            taxesHistory: []
        }
    }

    async componentDidMount() {
        const taxesHistory = await CustomEvent.callServer('tablet:business:taxes:history');

        this.setState({
            taxesHistory
        })
    }

    switchPage(el: string) {
        this.setState({page: el})
    }

    getMaxDays() {
        if (this.props.data === null) return 0;
        const data = this.props.data;
        return Math.trunc((data.max - data.now) / data.day)
    }

    changeDays(plus: boolean) {
        let days = this.state.days;

        if (plus) {
            if (days + 1 > this.getMaxDays()) return;
            days += 1;
        }else{
            if (days - 1 < 0) return;
            days -= 1;
        }

        this.setState({days});
    }

    pay() {
        CustomEvent.triggerServer('tablet:business:payTax', this.state.days);
    }

    render() {
        if (this.props.data === null) return <></>
        return <div className="tp tp-taxes">

            <div className="tp-filter">
                <div onClick={() => {
                    this.switchPage("main")
                }} className={classNames({"tp-filter__active": this.state.page === "main"})}>
                    Оплата налога
                </div>
                <div onClick={() => {
                    this.switchPage("history")
                }} className={classNames({"tp-filter__active": this.state.page === "history"})}>
                    История снятий
                </div>
            </div>

            {this.state.page === "main" && <>
                <div className="tp-taxes-block">

                    <div className="tp-taxes-block-left">
                        <div className="tp-taxes-block-left__text">
                            *Выберите количество дней <br/> оплаты
                        </div>
                        <img src={svg["minus"]} alt="" onClick={() => this.changeDays(false)}/>
                        <div className="tp-taxes-block-left-days">
                            <h1>{this.state.days}</h1>
                            <span>Дней</span>
                        </div>
                        <img src={svg["plus"]} alt="" onClick={() => this.changeDays(true)}/>
                    </div>

                    <div className="tp-taxes-block-right">
                        <div className="tp-taxes-block-right__title">Cумма к оплате</div>
                        <div className="tp-taxes-block-right__value">{system.numberFormat(Math.trunc(this.state.days * this.props.data.day))} $</div>
                        <div className="tp-taxes-block-right__title">Способ оплаты</div>
                        <div className="tp-taxes-block-right__pay"><img src={svg["card"]} alt=""/>По карте</div>
                        <div className="tp-taxes-block-right__button" onClick={() => this.pay()}>Оплатить</div>
                    </div>
                </div>

                <div className="tp-taxes-time">
                    Оплачено до: <span>{this.props.data.end}</span>
                </div>
            </>}

            {this.state.page === "history" && <>
                <div className="tp-cat tp-taxes-grid">
                    <div>Дата</div>
                    <div style={{textAlign: "end"}}>Списание</div>
                </div>
                <div className="tp-list tp-taxes-list">

                    {
                        this.state.taxesHistory.map((el, key) => {
                            return <div className="tp-list-block tp-taxes-grid" key={key}>
                                <div className="tp-taxes-list__date">{el.time}</div>
                                <div className="tp-taxes-list__value">-{system.numberFormat(el.money)}$</div>
                            </div>
                        })
                    }

                </div>
            </>}

        </div>;
    }
}
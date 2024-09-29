import React, {ChangeEvent, Component} from "react";
import "../../style.less";

import png from "../../assets/*.png";
import svg from "../../assets/*.svg";
import classNames from "classnames";
import ReactTooltip from 'react-tooltip';
import {
    IBaseBusinessInfo,
    IBusinessCatalogRating,
    IOrderCatalogDTO
} from "../../../../../../../shared/tablet/business.config";
import {system} from "../../../../../../modules/system";
import {Basket} from "../../components/Basket";
import {CustomEvent} from "../../../../../../modules/custom.event";
import {BUSINESS_TYPE} from "../../../../../../../shared/business";


export class Order extends Component<{
    catalog: IOrderCatalogDTO[] | null
    baseInfo: IBaseBusinessInfo
    catalogRating: IBusinessCatalogRating[]
}, {
    catalog: IOrderCatalogDTO[] | null
    basket: boolean
}> {
    constructor(props: any) {
        super(props);

        this.state = {
            catalog: null,
            basket: false
        }
    }

    componentDidMount() {
        this.setState({
            catalog: this.props.catalog === null ? null : JSON.parse(JSON.stringify(this.props.catalog))
        })
    }

    componentDidUpdate(prevProps: Readonly<{ catalog: IOrderCatalogDTO[] | null }>, prevState: Readonly<{ catalog: IOrderCatalogDTO[] | null; basket: boolean }>, snapshot?: any) {
        if (prevProps.catalog === null && this.props.catalog !== null) {
            this.setState({
                catalog: JSON.parse(JSON.stringify(this.props.catalog))
            })
        }
    }

    changeOrderCount(event: ChangeEvent<HTMLInputElement>, id: number) {
        const catalogCopy = [...this.state.catalog];

        if (!catalogCopy[id]) return;
        if (event.currentTarget.value === "") {
            catalogCopy[id].orderCount = 0;
            return;
        }
        if (!event.currentTarget.value || isNaN(Number(event.currentTarget.value))) return;

        if (catalogCopy[id].max_count - catalogCopy[id].count < Number(event.currentTarget.value)) {
            catalogCopy[id].orderCount = catalogCopy[id].max_count - catalogCopy[id].count;
        }else{
            catalogCopy[id].orderCount = Number(event.currentTarget.value);
        }


        this.setState({catalog: catalogCopy});
    }

    showResult(): boolean {
        if (!this.state.catalog) return false;

        return this.state.catalog.filter(el => el.orderCount && el.orderCount > 0).length !== 0
    }

    getTotalCost(): number {
        let amount = 0;

        this.state.catalog.forEach(el => {
            if (el.orderCount && el.orderCount > 0) {
                amount += el.orderCount * el.price;
            }
        })

        return amount;
    }

    changeBasket = (toggle: boolean) => {
        this.setState({basket: toggle});
    }

    clearItem = (item: number) => {
        const catalogCopy = [...this.state.catalog];

        const index = catalogCopy.findIndex(el => el.item === item);

        if (index === -1) return;

        catalogCopy[index].orderCount = 0;

        this.setState({catalog: catalogCopy});
    }

    openBasket() {
        if (this.getTotalCost() < 10000) return;

        this.changeBasket(true);
    }

    order = () => {
        CustomEvent.triggerServer('tablet:business:orderProducts', this.state.catalog.filter(el => el.orderCount && el.orderCount > 0))
    }

    discount = () => {
        const biz = this.props.baseInfo;
        if (biz.upgrade > 0 && [BUSINESS_TYPE.BAR, BUSINESS_TYPE.ITEM_SHOP, BUSINESS_TYPE.BARBER, BUSINESS_TYPE.TATTOO_SALON, BUSINESS_TYPE.FUEL, BUSINESS_TYPE.DRESS_SHOP, BUSINESS_TYPE.TUNING].includes(biz.type)) {
            return biz.upgrade * 10;
        }

        return 0;
    }

    render() {
        return <div className="tp tp-order">
            <ReactTooltip backgroundColor={"#f5f5f5"} textColor={"#111"} effect={"solid"}/>

            {this.state.basket && <Basket remove={this.clearItem}
                                          catalog={this.state.catalog.filter(el => el.orderCount && el.orderCount > 0)}
                                          show={this.changeBasket}
                                          order={this.order}
                                          discount={this.discount}
                                          upgrade={this.props.baseInfo.upgrade}/>}

            <div className="tp-small-title" style={{marginTop: "2vw"}}>Список товаров</div>

            <div className="tp-cat tp-order-grid tp-order-cat">
                <div>Наименование</div>
                <div>На складе</div>
                <div>Цена за 1 ед.</div>
                <div>Кол-во</div>
                <div style={{textAlign: "end"}}>Итого, $</div>
            </div>

            <div className="tp-list tp-order-list">

                {this.state.catalog !== null && <>{
                    this.state.catalog.map((item, id) => {
                        return <div className="tp-list-block tp-order-grid" key={id}>
                            <div className="tp-order-list__name">{item.name}</div>
                            <div className="tp-order-list__storage">{item.count}/{item.max_count}</div>
                            <div className="tp-order-list__price">{system.numberFormat(item.price)} $</div>
                            <div className="tp-order-list__value">
                                {/*
                               <img src={svg["minus"]} alt="" onClick={() => this.changeOrderCount(id, false)}/>
                                <span>{item.orderCount ? item.orderCount : 0}</span>
                                <img src={svg["plus"]} alt="" onClick={() => this.changeOrderCount(id, true)}/>
                                */}
                                <input type="text" placeholder="Кол-во" value={isNaN(item.orderCount) ? 0 : item.orderCount}
                                       onChange={(target) => this.changeOrderCount(target, id)}/>
                            </div>
                            <div
                                className="tp-order-list__sum">{system.numberFormat((item.orderCount ? item.orderCount : 0) * item.price)}</div>
                            <img src={svg["blockBackground"]} className={"tp-list-block__background"} alt=""/>
                            {this.props.catalogRating.find(el => el.name ===  item.name) !== undefined && <img data-tip="Этот товар входит в топ продаж" src={svg["star"]}
                                 className="tp-order-list__star" alt=""/>}
                        </div>
                    })
                }</>}

            </div>

            {this.showResult() && <div className="tp-order-basket" onClick={() => this.openBasket()}>
                <img src={svg["basket"]} alt=""/>
                <h1>Корзина</h1>
                <div className="tp-order-basket__sum">
                    Итого:
                    <span>{system.numberFormat(this.getTotalCost())} $</span>
                </div>
            </div>}

        </div>

    }
}
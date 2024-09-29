import React, {ChangeEvent, Component} from "react";
import "../../style.less";
import svg from "../../assets/*.svg";
import {IBaseBusinessInfo, IPricesCatalog} from "../../../../../../../shared/tablet/business.config";
import {system} from "../../../../../../modules/system";
import {PriceControl} from "../../components/PriceControl";
import {BUSINESS_TYPE} from "../../../../../../../shared/business";

export class Prices extends Component<{
    catalog: IPricesCatalog[]
    baseInfo: IBaseBusinessInfo
}, {
    showControl: boolean
    item: IPricesCatalog | null
    searchText: string
}> {
    constructor(props: any) {
        super(props);

        this.state = {
            showControl: false,
            item: null,
            searchText: ""
        }
    }

    toggleControl = (data?: IPricesCatalog) => {
        if (!data) {
            this.setState({item: null});
            return;
        }

        this.setState({item: data});
    }

    onChangeSearch(event: ChangeEvent<HTMLInputElement>) {
        this.setState({
            searchText: event.currentTarget.value
        })
    }

    filtering() {
        if (this.state.searchText === "") return this.props.catalog;

        return this.props.catalog.filter(el => el.name.includes(this.state.searchText))
    }

    render() {
        if (!this.props.catalog) return <></>;
        return <div className="tp tp-prices">
            {this.state.item !== null && <PriceControl item={this.state.item} toggleControl={this.toggleControl}
                baseInfo={this.props.baseInfo}/>}
            <div className="tp-search">
                <input type="text" placeholder="Поиск" value={this.state.searchText}
                       onChange={(event) => this.onChangeSearch(event)}/>
                <img src={svg["search"]} alt=""/>
            </div>
            <div className="tp-small-title">Список товаров</div>
            <div className="tp-cat tp-prices-grid">
                <div>Наименование</div>
                <div>Кол-во на складе</div>
                <div>Цена</div>
                <div/>
            </div>
            <div className="tp-list tp-prices-list">

                {
                    this.filtering().map((el, key) => {
                        return <div className="tp-list-block tp-prices-grid" key={key}>
                            <div className="tp-prices-list__name">{el.name}</div>
                            <div className="tp-prices-list__value">{el.count}/{el.maxCount}</div>
                            <div className="tp-prices-list__price">{system.numberFormat(el.price)}{this.props.baseInfo.type === BUSINESS_TYPE.TUNING ? "%" : "$"}</div>
                            <div className="tp-prices-list__button" onClick={() => this.toggleControl(el)}>Управлять</div>
                        </div>
                    })
                }

            </div>
        </div>;
    }
}
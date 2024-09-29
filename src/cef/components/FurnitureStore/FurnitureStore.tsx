import React, {Component} from "react";
import "./style.less";

import png from "./assets/*.png"
import svg from "./assets/*.svg"
import FurnitureShopStore from "../../stores/FurnitureShopStore";
import {
    FurnitureAllCategories,
    FurnitureCategory,
    FurnitureCategoryNames, furnitureList
} from "../../../shared/houses/furniture/furniture.config";
import classNames from "classnames";
import {observer} from "mobx-react";
import {CEF} from "../../modules/CEF";
import {CustomEvent} from "../../modules/custom.event";
import {CloseButton} from "../CloseButton";

@observer export class FurnitureStore extends Component<{
    store: FurnitureShopStore
}, {}> {

    store: FurnitureShopStore = this.props.store;

    constructor(props: any) {
        super(props);
    }

    getCategoryName(cat: FurnitureCategory) {
        return FurnitureCategoryNames[cat] ? FurnitureCategoryNames[cat] : '';
    }

    setCategory(cat: FurnitureCategory) {
        this.store.setState({
            cat,
            item: null
        });
    }

    setItem(id: number) {
        CustomEvent.triggerClient('furnitureShop:select', id);
        this.store.setState({
            item: id
        })
    }

    getItemsByCategory(cat: FurnitureCategory) {
        return furnitureList.filter(el => el.cat === cat);
    }

    getCurrentItem() {
        return furnitureList.find(item => item.id === this.store.item)
    }

    close = () => {
        CustomEvent.triggerClient('furnitureShop:close');
        CEF.gui.setGui(null);
    }

    buy() {
        if (this.store.item === null) return;
        CustomEvent.triggerServer('furniture:buy', this.store.item)
    }

    zoom(toggle: boolean) {
        CustomEvent.triggerClient('furnitureShop:zoomToggle', toggle);
    }

    componentWillUnmount() {
        this.store.setState({
            cat: 'wardrobe',
            item: null
        })
    }

    render() {
        return <div className="furnitureStore">

            <CloseButton onClickAction={this.close} />

            <div className="furnitureStore-left" onMouseEnter={() => this.zoom(false)} onMouseLeave={() => this.zoom(true)}>

                <div className="furnitureStore-left-catalog">

                    <div className="furnitureStore-left-catalog__title">
                        Каталог
                    </div>

                    <div className="furnitureStore-left-catalog-list">
                        {
                            FurnitureAllCategories.map((cat, key) => {
                                return <div
                                    className={classNames({'furnitureStore-left-catalog-list-active': this.store.cat === cat})}
                                    key={key}
                                onClick={() => this.setCategory(cat)}>
                                    <img src={svg[cat]} alt=""/>
                                </div>
                            })
                        }
                    </div>

                </div>

                <div className="furnitureStore-left-items">

                    <div className="furnitureStore-left-items-name">
                        <h1>Категория</h1>
                        <span>{this.getCategoryName(this.store.cat)}</span>
                    </div>

                    <div className="furnitureStore-left-items-list">
                        {
                            this.getItemsByCategory(this.store.cat).map((item, key) => {
                                return <div
                                    className={classNames('furnitureStore-left-items-list-block', {
                                        'furnitureStore-left-items-list-block-active': this.store.item === item.id
                                    })}
                                key={key}
                                onClick={() => this.setItem(item.id)}>
                                    <span>{item.name}</span>
                                    <h1>{item.cost}$</h1>
                                </div>
                            })
                        }

                    </div>

                </div>
            </div>

            <div className="furnitureStore-center">

                <div className="furnitureStore-center__name">Магазин мебели</div>
                <div className="furnitureStore-center__title">Предпросмотр предмета</div>

                <div className="furnitureStore-center-description">
                    <div className="furnitureStore-center-description__image"><img src={svg["move"]} alt=""/></div>
                    <span>Двигай предмет, чтобы рассмотреть его со всех сторон</span>
                </div>

            </div>

            {this.store.item !== null && <div className="furnitureStore-right">
                <div className="furnitureStore-right__name">{this.getCurrentItem().name}</div>
                <div className="furnitureStore-right__price">{this.getCurrentItem().cost}$</div>

                <div className="furnitureStore-right__button" onClick={() => this.buy()}>
                    <img src={svg["mark"]} alt=""/>
                    <span>Купить</span>
                </div>
            </div>}

        </div>;
    }
}
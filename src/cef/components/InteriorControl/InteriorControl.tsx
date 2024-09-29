import React, {Component} from "react";
import "./style.less";

import png from "./assets/*.png";
import svg from "./assets/*.svg";

import {CloseButton} from "../CloseButton";

import {CustomEvent} from "../../modules/custom.event";
import {CEF} from "../../modules/CEF";
import classNames from "classnames";
import HomeMenuStore from "../../stores/HomeMenu";
import {observer} from "mobx-react";
import {IInteriorData, ILayout, interiorsData, layoutsData} from "../../../shared/houses/menu/interiors.config";
import {FurnitureCategory, furnitureList} from "../../../shared/houses/furniture/furniture.config";
import {IMyInteriorData} from "../../../shared/houses/menu/menu.web";

@observer
export class InteriorControl extends Component<{
    store: HomeMenuStore
}, {
    currentLayout: number,
    layoutState: number,
    personalLayout: number
}> {

    store: HomeMenuStore;

    constructor(props: any) {
        super(props);

        this.state = {
            currentLayout: null,
            layoutState: 0,
            personalLayout: 0
        }

        this.store = this.props.store;
    }

    close = () => {
        CEF.gui.setGui(null)
    }

    changePage = (page: 'configurator' | 'interior' | 'furniture') => {
        this.store.setState({page});
    }

    changeLayout = (id: number) => {
        this.store.setState({
            layout: id,
            variation: null
        })
    }

    changeVariation = (id: number) => {
        this.store.setState({
            variation: id
        })
    }

    changeFurnitureCategory(cat: FurnitureCategory) {
        this.store.setState({
            category: cat
        })
    }

    changeFurnitureItem(id: number) {
        this.store.setState({furnitureItem: id})
    }

    getCategories() {
        const array: FurnitureCategory[] = [];

        this.store.furniture.forEach(item => {
            const cfg = furnitureList.find(el => el.id === item.cfgId);

            if (!cfg) return;

            if (array.find(el => el === cfg.cat) === undefined) array.push(cfg.cat);
        })

        return array;
    }

    getFurnitureByCategory() {
        return this.store.furniture.filter(el => {
            const cfg = furnitureList.find(item => el.cfgId === item.id);

            if (!cfg) return false;

            return cfg.cat === this.store.category;
        })
    }

    currentFurnitureItemPlaced() {
        const item = this.store.furniture.find(el => el.id === this.store.furnitureItem);

        if (!item) return false;

        return item.placed;
    }

    getSellFurnitureAmount() {
        const item = this.store.furniture.find(el => el.id === this.store.furnitureItem);

        if (!item) return 0;

        const cfg = furnitureList.find(el => item.cfgId === el.id);

        if (!cfg) return 0;

        return cfg.cost * 0.2
    }

    getVariationCost() {
        const cfg = interiorsData.find(el => el.id === this.store.variation);

        if (!cfg) return 0;

        return cfg.cost;
    }

    variationIsDonate() {
        const cfg = interiorsData.find(el => el.id === this.store.variation);

        if (!cfg) return false;

        return cfg.isDonate;
    }

    getCurrentInteriorData(): null | IMyInteriorData {
        if (this.store.interiorId === null) return null;

        const interior: IInteriorData = interiorsData.find(el => el.interiorId === this.store.interiorId);

        if (!interior) return null;

        const layout: ILayout = layoutsData.find(el => el.id === interior.layoutId);

        if (!layout) return null;

        return {
            name: interior.name,
            cost: interior.cost,
            isDonate: interior.isDonate,
            image: interior.img,
            layoutName: layout.name,
            layoutImage: this.getPersonalLayoutImage(layout)
        }
    }

    getPersonalLayoutImage(layout: ILayout) {
        if (typeof layout.img === 'string') return layout.img;
        return layout.img[this.state.personalLayout];
    }

    changePersonalLayoutImage() {
        const interior: IInteriorData = interiorsData.find(el => el.interiorId === this.store.interiorId);

        if (!interior) return;

        const layout: ILayout = layoutsData.find(el => el.id === interior.layoutId);

        if (!layout) return;

        if (typeof layout.img === 'string') return;

        if (layout.img.length - 1 === this.state.personalLayout) {
            this.setState({
                personalLayout: 0
            })
        }else{
            this.setState({
                personalLayout: this.state.personalLayout + 1
            })
        }

    }

    buyInterior() {
        const interior = interiorsData.find(el => el.id === this.store.variation);

        if (!interior) return;

        CustomEvent.triggerServer('homeMenu:buyInterior', interior.interiorId);
        this.close();
    }


    sellFurniture() {
        const id = this.store.furnitureItem;

        CustomEvent.triggerServer('furniture:sell', id);

        this.store.setState({
            furnitureItem: null
        })
    }

    placeFurniture(toggle: boolean) {
        const id = this.store.furnitureItem;

        CustomEvent.triggerServer('furniture:placement', id, toggle);
    }

    getConfiguratorImage() {
        const interior = interiorsData.find(el => el.id === this.store.variation);

        if (!interior) return '';

        return interior.img;
    }

    componentWillUnmount() {
        this.store.setState({
            layout: null,
            variation: null,
            category: null,
            furnitureItem: null
        })
    }

    getImageForShopLayout(item: ILayout) {
        if (typeof item.img === 'string') return item.img;

        if (this.state.layoutState === item.id) {
            return item.img[this.state.currentLayout];
        }else{
            return item.img[0];
        }
    }

    changeImageForShopLayout(item: ILayout) {
        if (typeof item.img === 'string') return;

        if (this.state.layoutState !== item.id) {
            this.setState({
                layoutState: item.id,
                currentLayout: 1
            })
        }else{
            this.setState({
                layoutState: item.id,
                currentLayout: this.state.currentLayout === item.img.length - 1 ? 0 : this.state.currentLayout + 1
            })
        }
    }


    render() {
        return <div className="interiorControl">

            <CloseButton onClickAction={this.close}/>

            <div className="interiorControl-left">

                <div className="interiorControl-left-head">

                    <h1>Управление интерьером</h1>
                    <span>
                        Создай свой кастомный дизайн дома!
                        Выбери план и интерьер дома, а потом добавь любимую мебель.
                    </span>

                    <div className="interiorControl-left-head-navigation">

                        <div onClick={() => this.changePage('configurator')}
                             className={classNames({
                                 "interiorControl-left-head-navigation-active": this.store.page === "configurator"
                             })}>
                            Конфигуратор
                        </div>

                        <div onClick={() => this.changePage('interior')}
                             className={classNames({
                                 "interiorControl-left-head-navigation-active": this.store.page === "interior"
                             })}>
                            Мой интерьер
                        </div>

                        <div onClick={() => this.changePage('furniture')}
                             className={classNames({
                                 "interiorControl-left-head-navigation-active": this.store.page === "furniture"
                             })}>
                            Моя мебель
                        </div>

                    </div>

                </div>

                {this.store.page === "configurator" &&

                <div className="interiorControl-left-configurator">

                    <div className="interiorControl-left-configurator-title">
                        <h1>1 шаг</h1>
                        <span>Выберите план дома</span>
                    </div>

                    {layoutsData.map((el, key) => {
                        return <div className="interiorControl-left-configurator-block" key={key}>

                            <img src={svg[this.getImageForShopLayout(el)]}
                                 className={"interiorControl-left-configurator-block__image"} alt=""
                                 onClick={() => this.changeImageForShopLayout(el)}/>

                            <div className="interiorControl-left-configurator-block__name">
                                <h1>Название</h1>
                                <span>{el.name}</span>
                            </div>

                            {typeof el.img !== 'string' && <span className={"interiorControl-left-configurator-block__description"}>
                                Нажмите на изображение, чтобы просмотреть остальные этажи
                            </span>}

                            <div className={classNames('interiorControl-left-configurator-block__switcher', {
                                'interiorControl-left-configurator-block__switcher-active': this.store.layout === el.id
                            })}
                                 onClick={() => this.changeLayout(el.id)}>
                                <div/>
                            </div>

                        </div>
                    })}

                    {this.store.layout !== null && <>
                        <div className="interiorControl-left-configurator-title">
                            <h1>2 шаг</h1>
                            <span>Выберите интерьер</span>
                        </div>

                        {interiorsData.filter(el => el.layoutId === this.store.layout).map((el, key) => {
                            return <div className="interiorControl-left-configurator-block" key={key}>

                                <img src={png[el.img]}
                                     className={"interiorControl-left-configurator-block__image"} alt=""/>

                                <div className="interiorControl-left-configurator-block__name">
                                    <h1>Название</h1>
                                    <span>{el.name}</span>
                                </div>

                                <div className="interiorControl-left-configurator-block__price">
                                    <h1>Цена</h1>
                                    <span>{el.isDonate ? <img src={svg["coinIcon"]} alt=""/> : '$'} {el.cost}</span>
                                </div>

                                <div className={classNames('interiorControl-left-configurator-block__switcher', {
                                    'interiorControl-left-configurator-block__switcher-active': this.store.variation === el.id
                                })}
                                onClick={() => this.changeVariation(el.id)}>
                                    <div/>
                                </div>

                            </div>
                        })}
                    </>}

                </div>}

                {this.store.page === "interior" &&

                <div className="interiorControl-left-configurator interiorControl-left-margin">

                    {this.getCurrentInteriorData() !== null && <div className="interiorControl-left-configurator-block">

                        <img src={svg[this.getCurrentInteriorData().layoutImage]}
                             className={"interiorControl-left-configurator-block__image"} alt=""
                             onClick={() => this.changePersonalLayoutImage()}/>

                        <div className="interiorControl-left-configurator-block__name">
                            <h1>Название</h1>
                            <span>{this.getCurrentInteriorData().layoutName}</span>
                        </div>

                    </div>}

                    {this.getCurrentInteriorData() !== null && <div className="interiorControl-left-configurator-block">

                        <img src={png[this.getCurrentInteriorData().image]}
                             className={"interiorControl-left-configurator-block__image"} alt=""/>

                        <div className="interiorControl-left-configurator-block__name">
                            <h1>Название</h1>
                            <span>{this.getCurrentInteriorData().name}</span>
                        </div>

                        <div className="interiorControl-left-configurator-block__price">
                            <h1>Цена</h1>
                            <span>
                                {this.getCurrentInteriorData().isDonate ? <img src={svg["coinIcon"]} alt=""/> : '$'}
                                {' '}
                                {this.getCurrentInteriorData().cost}
                            </span>
                        </div>

                    </div>}

                </div>

                }

                {this.store.page === "furniture" &&

                <div className="interiorControl-left-furniture">

                    <div className="interiorControl-left-furniture-categories">

                        {this.getCategories().map((el, key) => {
                            return <div className={classNames({
                                'interiorControl-left-furniture-categories-active': el === this.store.category
                            })} key={key} onClick={() => this.changeFurnitureCategory(el)}>
                                <img src={svg[el]} alt=""/>
                            </div>
                        })}

                    </div>

                    {this.store.category !== null && <div className="interiorControl-left-furniture-list">

                        {this.getFurnitureByCategory().map((el,key) => {
                            const cfg = furnitureList.find(item => item.id === el.cfgId);

                            if (!cfg) return null;

                            return <div className="interiorControl-left-furniture-list-block" key={key}
                                        onClick={() => this.changeFurnitureItem(el.id)}>
                                <div className="interiorControl-left-furniture-list-block__name">
                                    {cfg.name}
                                </div>
                                <div className="interiorControl-left-furniture-list-block__price">
                                    {cfg.cost} $
                                </div>
                            </div>
                        })}

                    </div>}

                </div>

                }

            </div>

            {(this.store.page === "configurator" && this.store.variation !== null) && <div className="interiorControl-center">
                <div className="interiorControl-center-block">
                    <img src={svg["ellipse"]} alt="" className="interiorControl-center-block__background"/>
                    <img src={png[this.getConfiguratorImage()]} alt="" className="interiorControl-center-block__image"/>
                </div>

                <div className="interiorControl-center-eye">
                    <img src={svg["eye"]} alt=""/>
                </div>
            </div>}

            {(this.store.page === "interior" && this.getCurrentInteriorData() !== null) && <div className="interiorControl-center">
                <div className="interiorControl-center-block">
                    <img src={svg["ellipse"]} alt="" className="interiorControl-center-block__background"/>
                    <img src={png[this.getCurrentInteriorData().image]} alt="" className="interiorControl-center-block__image"/>
                </div>

                <div className="interiorControl-center-eye">
                    <img src={svg["eye"]} alt=""/>
                </div>
            </div>}

            {(this.store.page === "furniture" && this.store.furnitureItem !== null) && <div className="interiorControl-center">

                {this.currentFurnitureItemPlaced() && <div className="interiorControl-center__button interiorControl-buttonTransparent"
                onClick={() => this.placeFurniture(false)}>
                    <img src={svg["cross"]} alt=""/>
                    <span>Убрать</span>
                </div>}

                {!this.currentFurnitureItemPlaced() && <div className="interiorControl-center__button"
                                                            onClick={() => this.placeFurniture(true)}>
                    <img src={svg["mark"]} alt=""/>
                    <span>Поставить</span>
                </div>}

            </div>}

            <div className="interiorControl-rightTop">

                <div className="interiorControl-rightTop__cash">
                    $ {this.store.cash}
                </div>
                <div className="interiorControl-rightTop__bank">
                    $ {this.store.wallet}
                </div>
                <div className="interiorControl-rightTop__coins">
                    <img src={svg["coinIcon"]} alt=""/>
                    <span>{this.store.coins}</span>
                </div>

            </div>

            {(this.store.page === 'configurator' && this.store.variation !== null) && <div className="interiorControl-rightBottom">

                <div className="interiorControl-rightBottom__title">Итог</div>

                <div className="interiorControl-rightBottom__price">
                    {this.variationIsDonate() ? <img src={svg["coinIcon"]} alt=""/> : '$'} { ' ' }
                    {this.getVariationCost()}
                </div>

                <div className="interiorControl-rightBottom__button" onClick={() => this.buyInterior()}>
                    <img src={svg["mark"]} alt=""/>
                    <span>Купить</span>
                </div>

            </div>}

            {
                (this.store.page === 'furniture' && this.store.furnitureItem !== null)&& <div className="interiorControl-rightBottom">

                    <div className="interiorControl-rightBottom__percent">-80%</div>
                    <div className="interiorControl-rightBottom__title">Итог</div>

                    <div className="interiorControl-rightBottom__price">{this.getSellFurnitureAmount()}$</div>

                    <div className="interiorControl-rightBottom__button interiorControl-buttonTransparent"
                         onClick={() => this.sellFurniture()}>
                        <span>Продать</span>
                    </div>

                </div>
            }


        </div>;
    }

}
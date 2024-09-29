import React, {Component} from "react";
import "./style.less";

import mafiaImage from "./assets/mafiaImage.png";
import swatImage from "./assets/swatImage.png";
import baton from "./assets/baton.png";
import item from "./assets/item.png";
import revolver from "./assets/revolver.png";
import closeIcon from "./assets/closeIcon.svg";
import minus from "./assets/minus.svg";
import plus from "./assets/plus.svg";
import check from "./assets/check.svg";
import stateText from "./assets/stateText.svg";
import stateImage from "./assets/stateImage.png";
import gangImage from "./assets/gangImage.png";

import iconImages from "../../../shared/icons/*.png";
import {itemConfig, inventoryShared} from "../../../shared/inventory";
import {OrderedItem, OrderItem, OrderMenuStyle} from "../../../shared/chest";
import {CustomEvent} from "../../modules/custom.event";
import {CEF} from "../../modules/CEF";

interface Item extends OrderItem {
    count: number
    active: boolean
}

export class OrderOfGoods extends Component<{}, {
    style: OrderMenuStyle,
    items: Item[],
    cashBalance: number,
    bankBalance: number
}> {
    public itemsList: itemConfig[];

    constructor(props: any) {
        super(props);

        this.state = {
            style: "gang",
            items: [
            ],
            cashBalance: 100000,
            bankBalance: 200000
        }

        this.itemsList = inventoryShared.items;

        CustomEvent.register('orderOfGoods::set', (cashBalance, bankBalance, style: OrderMenuStyle, items: OrderItem[]) => {
            this.setState({
                cashBalance,
                bankBalance,
                style,
                items: items.map<Item>(item => {
                    return {
                        ...item,
                        active: false,
                        count: 0
                    }
                })
            })
        });
    }

    close(): void {
        CEF.gui.close();
    }

    buy(): void {
        CustomEvent.triggerServer('orderOfGoods::buyItems', this.state.items
            .filter(item => item.count > 0)
            .map<OrderedItem>(item => {
                return {
                    ItemId: item.ItemId,
                    Count: item.count
                }
            }));
    }

    changeActive(key: number, toggle: boolean): void {
        let items = this.state.items;
        items[key].active = toggle;
        this.setState({...this.state, items})
    }

    getStatus(key: number): boolean {
        return this.state.items[key].active || this.state.items[key].count > 0;
    }

    getInventoryItem(id: number): itemConfig {
        for (let el in this.itemsList) {
            if (this.itemsList[el].item_id === id) return this.itemsList[el];
        }

        return null;
    }

    moneyDots(value: number): string {
        return `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
    }

    changeCountItem(key: number, toggle: boolean): void {
        let items = this.state.items;
        if (toggle) {
            if (items[key].count === items[key].MaxCount) return;
            items[key].count++;
        } else {
            if (items[key].count === 0) {
                items[key].count = items[key].MaxCount;
            } else {
                items[key].count--;
            }
        }
        this.setState({...this.state, items})
    }

    getTotalPrice(): number {
        let amount = 0;
        this.state.items.forEach(el => {
            amount += el.count * el.Price;
        });
        return amount;
    }

    render() {
        return <div className="OrderOfGoods">

            <div className="exit" onClick={() => this.close()}>
                <div className="exit__icon"><img src={closeIcon} alt="#"/></div>
                <div className="exit__title">Закрыть</div>
            </div>

            {this.state.style === "mafia" && <div className={'OrderOfGoods-mafia'}>
                <img src={revolver} className="OrderOfGoods__weaponImage" alt=""/>
                <div className="OrderOfGoods__title">ТОВАРЫ <span>МАФИИ</span></div>
                <img src={mafiaImage} className="OrderOfGoods__personImage" alt=""/>
            </div>}

            {this.state.style === "PSC" && <div className={'OrderOfGoods-swat'}>
                <img src={baton} className="OrderOfGoods__weaponImage" alt=""/>
                <div className="OrderOfGoods__title">ТОВАРЫ <span>ЧОП</span></div>
                <img src={swatImage} className="OrderOfGoods__personImage" alt=""/>
            </div>}

            {this.state.style === "gov" && <div className={'OrderOfGoods-state'}>
                <img src={baton} className="OrderOfGoods__weaponImage" alt=""/>
                <div className="OrderOfGoods__title">ТОВАРЫ <img src={stateText} alt=""/></div>
                <img src={stateImage} className="OrderOfGoods__personImage" alt=""/>
            </div>}

            {this.state.style === "gang" && <div className={'OrderOfGoods-gang '}>
                    <img src={revolver} className="OrderOfGoods__weaponImage" alt=""/>
                    <div className="OrderOfGoods__title">ТОВАРЫ <span>БАНД</span></div>
                    <img src={gangImage} className="OrderOfGoods__personImage" alt=""/>
                </div>}

            <div className="OrderOfGoods-content">

                <div className="OrderOfGoods-content__head">
                    <div className="OrderOfGoods-content__head__title">КАТАЛОГ</div>
                    <div className="OrderOfGoods-content__head__hr"/>
                    <div className="OrderOfGoods-content__head__balance">
                        <span>БАЛАНС:</span>
                        <div>${`${this.state.cashBalance}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</div>
                        <p>${`${this.state.bankBalance}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</p>
                    </div>
                </div>

                <div className="OrderOfGoods-content-scroll">

                    {
                        this.state.items.map((el, key) => {
                            const item = this.getInventoryItem(el.ItemId);

                            if (item === null) return null;

                            return <div
                                className={`OrderOfGoods-content-scroll-block ${el.IsBlocked ? "OrderOfGoods-content-scroll-block__blocked" : ""} ${this.getStatus(key) ? "OrderOfGoods-active" : ""}`}
                                key={key}
                                onMouseEnter={() => this.changeActive(key, true)}
                                onMouseLeave={() => this.changeActive(key, false)}>

                                <div className="OrderOfGoods-content-scroll-block__ellipse"/>

                                <img src={iconImages[`Item_${el.ItemId}`]}
                                     className="OrderOfGoods-content-scroll-block__item" alt=""/>

                                <div className="OrderOfGoods-content-scroll-block__name">
                                    {item.name}
                                </div>

                                <div className="OrderOfGoods-content-scroll-block__price">
                                    {el.IsBlocked ? "Недоступно" : `$ ${this.moneyDots(el.Price)}`}
                                </div>

                                <div className="OrderOfGoods-content-scroll-block__buttons">
                                    <img src={minus} alt="" onClick={() => this.changeCountItem(key, false)}/>
                                    <span>{el.count} шт</span>
                                    <img src={plus} alt="" onClick={() => this.changeCountItem(key, true)}/>
                                </div>

                            </div>
                        })
                    }

                </div>

            </div>

            <div className="OrderOfGoods-basket">
                <span>ИТОГО:</span>
                <p>${`${this.getTotalPrice()}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</p>
                <div onClick={() => this.buy()}>
                    <img src={check} alt=""/>
                    КУПИТЬ
                </div>
            </div>

            <div className="OrderOfGoods-filter"/>
        </div>
    }
}
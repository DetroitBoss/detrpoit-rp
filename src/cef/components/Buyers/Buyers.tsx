import React, {Component} from "react";

import "./Buyers.less";

import mainBackground from './assets/images/main.svg';

import meatName from './assets/images/meat/name.svg';
import meatPerson from './assets/images/meat/person.svg';
import meatRight from './assets/images/meat/right.svg';

import minerName from './assets/images/miner/name.svg';
import minerPerson from './assets/images/miner/person.png';
import minerRight from './assets/images/miner/right.svg';

import fisherName from './assets/images/fisher/name.svg';
import fisherPerson from './assets/images/fisher/person.png';
import fisherRight from './assets/images/fisher/right.svg';

import tallymanName from './assets/images/tallyman/name.svg';
import tallymanPerson from './assets/images/tallyman/person.png';
import tallymanRight from './assets/images/tallyman/right.png';

import pirateName from './assets/images/pirate/name.svg';
import piratePerson from './assets/images/pirate/person.png';
import pirateRight from './assets/images/pirate/right.png';

import farmerName from './assets/images/farmer/name.svg';
import farmerPerson from './assets/images/farmer/farmer.png';
import farmerRight from './assets/images/farmer/right.png';

import itemImages from '../../../shared/icons/*.png';

import {itemConfig, inventoryShared} from "../../../shared/inventory";
import {CustomEventHandler} from "../../../shared/custom.event";
import {CustomEvent} from "../../modules/custom.event";
import {NpcItemDto, NpcMenuBackground} from "../../../shared/npc.customer";

interface SellItemDto extends NpcItemDto {
    countForSell: number
}

export class Buyers extends Component<{}, {
    background: NpcMenuBackground,
    items: SellItemDto[]
}>{
    public itemsList: itemConfig[];
    dataEvent: CustomEventHandler;

    constructor(props: any) {
        super(props);

        this.state = {
            background: "pirate", // fisher miner meat sellman pirate
            items: []
        };

        this.itemsList = inventoryShared.items;

        this.dataEvent = CustomEvent.register('buyes:setData',
            (data: NpcItemDto[], background: NpcMenuBackground) => {
            const items : SellItemDto[] = data
                .map(i => {
                    return {
                        ...i,
                        countForSell: 0
                    }
                });

            this.setState({ items, background })
        });
    }

    getInventoryItem(id: number): itemConfig {
        for (let el in this.itemsList) {
            if (this.itemsList[el].item_id === id) return this.itemsList[el];
        }

        return null;
    }

    normalizeMoney(count: number): string {
        return `${count}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ");
    }

    componentWillUnmount = () => {
        if(this.dataEvent) this.dataEvent.destroy();
    }

    updateCountForSell(toggle: boolean, key: number): void {
        let items = this.state.items;
        if (toggle) {
            if (items[key].countForSell === items[key].playerHasCount) return;
            items[key].countForSell++;
            this.setState({items});
        }else{
            if (items[key].countForSell === 0) return;
            items[key].countForSell--;
            this.setState({items});
        }
    }

    getCostForAll(): number {
        let cost = 0;

        for (let item of this.state.items) {
            cost += item.playerHasCount * item.price;
        }

        return cost;
    }

    sellAllItems = async () => {
        const money = this.getCostForAll();
        if (money === 0) {
            return;
        }

        const sellItems = this.state.items;
        const notSoldItems : number[] = await CustomEvent.callServer('npc::customer::sellAll',
            JSON.stringify(sellItems.filter(i => i.playerHasCount > 0).map(i => i.id)));
        if (notSoldItems == null) {
            return;
        }

        for (let item of sellItems.filter(i => !notSoldItems.includes(i.id))) {
            item.countForSell = 0;
            item.playerHasCount = 0;
        }

        this.setState({items: sellItems});
    }

    sellItem = async (key: number) => {
        let sellItems = this.state.items,
            itemInfo = this.getInventoryItem(this.state.items[key].id);
        if (itemInfo === null) return;

        const item = sellItems[key];

        const success = await CustomEvent.callServer('npc::customer::sell', item.id, item.countForSell);
        if (!success) {
            return;
        }

        sellItems[key].playerHasCount -= sellItems[key].countForSell;
        sellItems[key].countForSell = 0;

        this.setState({items: sellItems});
    }

    render() {
        return <div className='buyers'>
            <div className="buyers-content">

                <div className="buyers-content__title">
                    <h1>— ПРИВЕТ!</h1>
                    <h2>ЧТО У ТЕБЯ ЕСТЬ?</h2>
                </div>

                <div className="buyers-content-status">
                    <h1>ВАШИ ТОВАРЫ</h1>
                    <div className="buyers-content-status-right">
                        <h2> $ {this.normalizeMoney(this.getCostForAll())} </h2>
                        <div className="buyers-content-status-right-button" onClick={() => this.sellAllItems()}>
                            ПРОДАТЬ ВСЕ
                        </div>
                    </div>
                </div>

                <hr/>

                <div className="buyers-content-footer">


                    {this.state.items.map((item, key) => {
                        const itemInfo = this.getInventoryItem(item.id);


                        if (itemInfo === null) return <React.Fragment key={key}/>;

                        return <div className="buyers-content-footer-goods" key={key}>
                            <div className="buyers-content-footer-goods-left">
                                <div className="buyers-content-footer-goods-left-icon">
                                    <img src={itemImages[`Item_${item.id}`]} alt="#"/>
                                    <span> { item.playerHasCount } </span>
                                </div>
                                <h1>{ itemInfo.name }</h1>
                            </div>
                            <div className="buyers-content-footer-goods-right">
                                <div className="buyers-content-footer-goods-right-quantity">
                                    <div className="buyers-content-footer-goods-right-quantity__button" onClick={() => this.updateCountForSell(false, key)}>
                                        —
                                    </div>
                                    <span> { item.countForSell } шт </span>
                                    <div className="buyers-content-footer-goods-right-quantity__button" onClick={() => this.updateCountForSell(true, key)}>
                                        +
                                    </div>
                                </div>
                                <div className="buyers-content-footer-goods-right__sell" onClick={() => this.sellItem(key)}>
                                    ПРОДАТЬ
                                </div>
                                <div className="buyers-content-footer-goods-right__price">
                                    $ {this.normalizeMoney(item.countForSell * item.price)}
                                </div>
                            </div>
                        </div>
                    })}

                </div>
            </div>

            <div className='buyers-background'>

                <img src={mainBackground} className="buyers-background__main" alt="#"/>


                {this.state.background === "meat" &&
                <div className='buyers-background-meat'>
                    <img src={meatName} className="buyers-background__name" alt="#"/>
                    <img src={meatPerson} className="buyers-background__person" alt="#"/>
                    <img src={meatRight} className="buyers-background__right" alt="#"/>
                </div>
                }

                {this.state.background === "miner" &&
                <div className='buyers-background-miner'>
                    <img src={minerName} className="buyers-background__name" alt="#"/>
                    <img src={minerPerson} className="buyers-background__person" alt="#"/>
                    <img src={minerRight} className="buyers-background__right" alt="#"/>
                </div>
                }

                {this.state.background === "fisher" &&
                <div className='buyers-background-fisher'>
                    <img src={fisherName} className="buyers-background__name" alt="#"/>
                    <img src={fisherPerson} className="buyers-background__person" alt="#"/>
                    <img src={fisherRight} className="buyers-background__right" alt="#"/>
                </div>
                }

                {this.state.background === "sellman" &&
                <div className='buyers-background-tallyman'>
                    <img src={tallymanName} className="buyers-background__name" alt="#"/>
                    <img src={tallymanPerson} className="buyers-background__person" alt="#"/>
                    <img src={tallymanRight} className="buyers-background__right" alt="#"/>
                </div>
                }

                {this.state.background === "farmer" &&
                <div className='buyers-background-tallyman'>
                    <img src={farmerName} className="buyers-background__name" alt="#"/>
                    <img src={farmerPerson} className="buyers-background__person" alt="#"/>
                    <img src={farmerRight} className="buyers-background__right" alt="#"/>
                </div>
                }

                {
                    this.state.background === "pirate" &&
                    <div className='buyers-background-tallyman'>
                        <img src={pirateName} className="buyers-background__name" alt="#"/>
                        <img src={piratePerson} className="buyers-background__person" alt="#"/>
                        <img src={pirateRight} className="buyers-background__right" alt="#"/>
                    </div>
                }
            </div>
        </div>
    }
}
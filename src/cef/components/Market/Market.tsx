import React, {Component} from "react";
import {itemConfig, inventoryShared, ITEM_TYPE} from "../../../shared/inventory";
import iconImages from "../../../shared/icons/*.png";
import "./style.less";
import png from './assets/*.png'
import svg from "./assets/*.svg"
import {CustomEvent} from "../../modules/custom.event";
import {MarketDto} from "../../../shared/market/dtos/marketDto";
import {MarketItemChangesDto} from "../../../shared/market/dtos/marketItemChangesDto";
import {systemUtil} from "../../../shared/system";
import {getMarketRentCompensation, MAX_RENT_TIME_MINUTES, RENT_TICK_MINUTES} from "../../../shared/market/config";
import {MarketHistoryItemDto} from "../../../shared/market/dtos/marketHistoryItemDto";

interface itemForCustomer {
    itemId: number,
    itemConfigId: number,
    price: number,
    priceView: number,
    countToBuy: number,
    onStockCount: number,
    name: string,
}

interface itemForSeller {
    activeDump: boolean,
    active: boolean,
    itemId: number,
    itemConfigId: number,
    priceDump: number,
    price: number,
    countForSellDump: number,
    countForSell: number,
    inventoryCount: number,
    name: string,
}

interface itemInHistory {
    configId: number,
    buyer: string,
    proceeds: number,
    amount: number,
    itemName: string,
}

interface sellerPanel {
    endTime: string,
    backMoney: number
}


export class Market extends Component<{}, {
    tentId: number,
    attentionShow: boolean,
    attentionBoldText: string,
    attentionBasicText: string,
    type: "seller" | "customer",
    sellerName?: string,
    itemsForCustomer?: itemForCustomer[],
    itemsInHistory?: MarketHistoryItemDto[],
    itemsForSeller?: itemForSeller[],
    sellerPanel?: sellerPanel,
    attentionRent: boolean,
    attentionRentValue: number,
    isPolice?: boolean,
}> {
    public itemsList: itemConfig[];
    private rentTimeInterval: number;
    private rentTimeSeconds: number;
    private attentionInputRef: React.RefObject<any>;


    constructor(props: any) {
        super(props);
        console.log('market:init console check 0');


        this.state = {
            tentId: 0,
            attentionShow: false,
            attentionBoldText: "Проданы все выставленные товары,",
            attentionBasicText: "хотите продать что-то еще?",
            type: "seller",
            sellerName: "Kevin Mackalister",
            itemsForCustomer: [],
            itemsInHistory: [],
            itemsForSeller: [],
            sellerPanel: {
                endTime: "00:45",
                backMoney: 1200
            },
            attentionRent: false,
            attentionRentValue: 1,
        }

        this.itemsList = inventoryShared.items;

        CustomEvent.register('market:init', (dto: MarketDto) => {
            console.log('market:init console check ' + dto);

            if (dto.rentTimeS) {
                this.setState({
                    tentId: dto.id,
                    type: 'seller',
                    sellerName: dto.ownerName,
                    itemsForSeller: dto.marketItems.map(marketItem => {
                        const isActive = marketItem.count > 0;

                        return {
                            activeDump: isActive,
                            active: isActive,
                            itemId: marketItem.itemId,
                            itemConfigId: marketItem.itemConfigId,
                            priceDump: marketItem.price,
                            price: marketItem.price,
                            countForSell: marketItem.count,
                            countForSellDump: marketItem.count,
                            inventoryCount: marketItem.inventoryCount,
                            name: marketItem.itemName
                        }
                    }),
                    itemsInHistory: dto.history
                });

                this.rentTimeSeconds = dto.rentTimeS;
                this.rentTimeInterval = setInterval(this.updateRentTime.bind(this), 1000);
            } else {
                this.setState({
                    tentId: dto.id,
                    type: 'customer',
                    sellerName: dto.ownerName,
                    itemsForCustomer: dto.marketItems.map(marketItem => {
                        return {
                            itemId: marketItem.itemId,
                            itemConfigId: marketItem.itemConfigId,
                            price: marketItem.price,
                            priceView: marketItem.price,
                            countToBuy: 1,
                            onStockCount: marketItem.count,
                            name: marketItem.itemName
                        }
                    }),
                    isPolice: dto.isPolice,
                })
            }
        });
    }

    updateRentTime() {
        this.rentTimeSeconds--;

        const sellerPanel = this.state.sellerPanel;
        sellerPanel.endTime = systemUtil.formatTime(this.rentTimeSeconds);
        sellerPanel.backMoney = getMarketRentCompensation(this.rentTimeSeconds);

        this.setState({
            sellerPanel: this.state.sellerPanel
        })
    }

    getInventoryItem(id: number): itemConfig {
        for (let el in this.itemsList) {
            if (this.itemsList[el].item_id === id) return this.itemsList[el];
        }

        return null;
    }

    previewItem(key: number) {
        const item: itemForCustomer = this.state.itemsForCustomer[key];
        CustomEvent.triggerServer('market::clothPreview', this.state.tentId, item.itemId);
    }

    buyItem(key: number) {
        const item: itemForCustomer = this.state.itemsForCustomer[key];
        if (item.countToBuy === 0) return;

        CustomEvent.triggerServer('market::purchase', this.state.tentId, item.itemId, item.countToBuy);
    }

    applySellerChanges() {
        const changes = this.state.itemsForSeller
            .map<MarketItemChangesDto>((item) => {
                if (!item.activeDump && !item.active) {
                    return null;
                }

                return {
                    itemId: item.itemId,
                    itemConfigId: item.itemConfigId,
                    oldActive: item.activeDump,
                    newActive: item.active,
                    oldPrice: item.priceDump,
                    newPrice: item.price,
                    oldCount: item.countForSellDump,
                    newCount: item.countForSell
                }
            })
            .filter((item) => item);

        CustomEvent.triggerServer('market::applyChanges', changes);
    }

    hireSeller() {

        // client
    }

    extendRent() {
        this.setState({attentionRent: true, attentionRentValue: 0});
    }

    finishRent() {
        CustomEvent.triggerServer('market::finishRent');
    }

    previewForSeller(key: number) {
        const item: itemForSeller = this.state.itemsForSeller[key];
        CustomEvent.triggerServer('market::clothPreview', this.state.tentId, item.itemId);
    }

    onClickAttention(toggle: boolean) {
        // client
    }

    showAttention(boldText: string, basicText: string) {
        this.setState({attentionShow: true, attentionBoldText: boldText, attentionBasicText: basicText});
    }

    closeAttention() {
        this.setState({attentionShow: false});
    }

    customerChangeCount(key: number, value: string) {
        let items = [...this.state.itemsForCustomer];
        let count = Math.trunc(Number(value));
        if (isNaN(count))
            count = 0
        if (count < 0) {
            return;
        }

        items[key].priceView = items[key].price * count;
        items[key].countToBuy = count;
        this.setState({...this.state, itemsForCustomer: items});
    }

    sellerChangeCount(key: number, value: string) {
        let items = [...this.state.itemsForSeller];
        let count = Math.trunc(Number(value));
        if (isNaN(count))
            count = 0
        if (count < 0) {
            return;
        }

        const item = items[key];
        // if (item.countForSell > item.countForSellDump
        //     && item.countForSell - item.countForSellDump < item.inventoryCount) {
        //     return;
        // }

        item.countForSell = count;
        this.setState({...this.state, itemsForSeller: items});
    }

    sellerChangePrice(key: number, value: string) {
        let items = [...this.state.itemsForSeller];
        const price = Number(value);
        if (price < 0) {
            return;
        }

        items[key].price = price;
        this.setState({...this.state, itemsForSeller: items});
    }

    changeActive(key: number) {
        let items = this.state.itemsForSeller;
        items[key].active = !this.state.itemsForSeller[key].active;
        this.setState({...this.state, itemsForSeller: items})
    }

    componentDidMount() {
        this.attentionInputRef = React.createRef();
        if (this.attentionInputRef.current) {
            this.attentionInputRef.current.value = this.state.attentionRentValue;
        }
    }

    attentionInputChange(event: any) {
        this.setState({attentionRentValue: event.target.value})
    }

    closeAttentionRent() {
        this.setState({attentionRent: false});
    }

    extendClick() {
        const minutes = this.state.attentionRentValue * RENT_TICK_MINUTES;
        this.setState({attentionRent: false, attentionRentValue: 0});

        if (minutes <= 0) {
            return;
        }

        CustomEvent.triggerServer('market::expandRent', minutes);
    }

    getMaxExtendValue(): number {
        const rentMinutesLeft = Math.floor(this.rentTimeSeconds / 60);
        const availableRentMinutes = MAX_RENT_TIME_MINUTES - rentMinutesLeft;

        return Math.floor(availableRentMinutes / RENT_TICK_MINUTES);
    }

    callSeller() {
        CustomEvent.triggerServer('market::callSeller', this.state.tentId);
    }

    render() {
        return <div className={`market market-${this.state.type}`}>

            {
                this.state.attentionRent && <div className="market-attention">
                    <img src={svg['closeIcon']} className="market-attention__close" alt="" onClick={() => this.closeAttentionRent()}/>

                    <div className="market-attention__text market-attention__bold">Укажите, на сколько</div>
                    <div className="market-attention__text">Вы хотите продлить аренду.</div>

                    <input type="range" ref={this.attentionInputRef} min="0" max={this.getMaxExtendValue()} onClick={(event) => this.attentionInputChange(event)}/>

                    <div className="market-attention__rangeTest">{this.state.attentionRentValue * RENT_TICK_MINUTES} мин</div>

                    <div className="market-attention-buttons">
                        <div className="market-attention-buttons__green" onClick={() => this.extendClick()}>
                            Продлить
                        </div>
                    </div>
                </div>
            }

            {this.state.attentionShow && <div className="market-attention">
                <img src={svg['closeIcon']} className="market-attention__close" alt=""
                     onClick={() => this.closeAttention()}/>

                <div className="market-attention__icon">
                    <img src={png['pizza']} alt=""/>
                </div>

                <div className="market-attention__text market-attention__bold">{ this.state.attentionBoldText }</div>
                <div className="market-attention__text">{ this.state.attentionBasicText }</div>

                <div className="market-attention-buttons">
                    <div className="market-attention-buttons__green" onClick={() => this.onClickAttention(true)}>
                        ОПЛАТИТЬ
                    </div>
                    <div className="market-attention-buttons__gray" onClick={() => this.onClickAttention(false)}>
                        ОТМЕНА
                    </div>
                </div>

            </div>}

            {this.state.type === "seller" && <div className="market-timer market-customer__hidden">
                <div>
                    <img src={svg['clock']} alt=""/>
                </div>
                <div>
                    <span>{this.state.sellerPanel.endTime}</span>
                    до конца аренды
                </div>
            </div>}

            <div className="market-left">

                {this.state.type === "customer" && <div className="market-left__name market-seller__hidden">
                    <img src={svg['marketIcon']} alt=""/>
                    <div>
                        Лавка
                        <span>
                            Продавец
                            <span>{this.state.sellerName}</span>
                        </span>
                    </div>
                </div>}

                {this.state.type === "seller" && <div className="market-left__name market-customer__hidden">
                    <img src={svg['marketIcon']} alt=""/>
                    <div>
                        Торговать
                        <p>на рынке</p>
                    </div>
                </div>}


                {this.state.type === "seller" && <>
                    <div className="market-left__description market-customer__hidden">
                        Выберите товары на продажу, <br/> назначьте им цену и начинайте торговлю!
                    </div>

                    <div className="market-left__title  market-customer__hidden">
                        История:
                    </div>

                    <div className="market-left-scroll  market-customer__hidden">

                        {
                            this.state.itemsInHistory.map((el, key) => {
                                const item = this.getInventoryItem(el.itemConfigId);
                                if (item === null) return item;

                                return <div className="market-left-scroll-block" key={key}>

                                    <div className="market-left-scroll-block__icon">
                                        <img src={iconImages[`Item_${el.itemConfigId}`]} alt=""/>
                                        <span>{el.amount === 1 ? "" : el.amount}</span>
                                    </div>

                                    <div className="market-left-scroll-block__text">
                                        <div>{el.itemName}</div>
                                        <span>Покупатель {el.buyerName}</span>
                                    </div>

                                    <div className="market-left-scroll-block__quantity">
                                        +{el.moneyIncome.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}
                                    </div>

                                </div>
                            })
                        }

                    </div>
                </>}

                {
                    this.state.isPolice && <div className="market-left__closeButton" onClick={() => this.callSeller()}>
                        <img src={svg["null"]} alt=""/>
                        подозвать владельца
                    </div>
                }

            </div>

            <div className="market-right">
                {this.state.type === "seller" && <div className="market-right__row">

                    <div className="market-right-button market-customer__hidden" onClick={() => this.applySellerChanges()}>
                        <img src={svg["cart"]} alt=""/>
                        ПРИМЕНИТЬ ИЗМЕНЕНИЯ
                    </div>

                    <div className="market-right-button market-right-button__blue market-customer__hidden"
                          onClick={() => this.hireSeller()}>
                        <img src={svg["add"]} alt=""/>
                        Нанять продавца
                    </div>

                    <div className="market-right-button market-right-button__purple market-customer__hidden" onClick={() => this.extendRent()}>
                        <img src={svg["calendar"]} alt=""/>
                        Продлить аренду
                    </div>

                    <div className="market-right-button market-right-button__red  market-customer__hidden" onClick={() => this.finishRent()}>
                        <img src={svg["null"]} alt=""/>
                        Завершить аренду
                    </div>


                    <div className="market-right-moneyBack  market-customer__hidden">
                        Вернется
                        <span>$ {this.state.sellerPanel.backMoney.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</span>
                    </div>

                </div>}

                {this.state.type === "customer" && <div className="market-right-scroll">

                    {
                        this.state.itemsForCustomer.map((el, key) => {
                            const item = this.getInventoryItem(el.itemConfigId);
                            if (item === null) return item;

                            return <div className="market-right-scroll-block" key={key}>

                                <div className="market-part">

                                    <div
                                        className={`market-right-scroll-block__mark  market-customer__hidden market-active`}>
                                        <img src={svg['mark']} alt=""/>
                                    </div>

                                    <div className="market-right-scroll-block__icon">
                                        <img src={iconImages[`Item_${el.itemConfigId}`]} alt=""/>
                                        <span>{el.onStockCount === 1 ? "" : el.onStockCount}</span>
                                    </div>
                                    <div className="market-right-scroll-block__text">
                                        {el.name}
                                    </div>
                                </div>

                                <div className="market-part market-seller__hidden">

                                    {item.type === ITEM_TYPE.CLOTH &&
                                    <img className="market-right-scroll-block__reviewButton" src={svg["reviewButton"]}
                                         alt="" onClick={() => this.previewItem(key)}/>}

                                    <div className="market-right-scroll-block__inputs">
                                        <p>{(el.priceView).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}$</p>
                                        <div>
                                            <input type="number"
                                                   defaultValue={el.countToBuy}
                                                   value={el.countToBuy}
                                                   onChange={(e) => this.customerChangeCount(key, e.target.value)}/>
                                            <span>КОЛИЧЕСТВО</span>
                                        </div>
                                    </div>
                                    <div
                                        className={`market-right-scroll-block__buyButton ${el.countToBuy > 0 ? "market-active-buyButton" : ""}`}
                                        onClick={() => this.buyItem(key)}>
                                        <img src={svg['cart']} alt=""/>
                                        <span>КУПИТЬ</span>
                                    </div>
                                </div>
                            </div>
                        })
                    }

                </div>}

                {this.state.type === "seller" && <div className="market-right-scroll">

                    {
                        this.state.itemsForSeller.map((el, key) => {
                            const itemConfig = inventoryShared.get(el.itemConfigId);
                            if (itemConfig === null) return itemConfig;

                            return <div className="market-right-scroll-block" key={key}>

                                <div className="market-part">

                                    <div
                                        className={`market-right-scroll-block__mark  market-customer__hidden ${el.active ? "market-mark-active" : ""}`}
                                        onClick={() => this.changeActive(key)}>
                                        <img src={svg['mark']} alt=""/>
                                    </div>

                                    <div className="market-right-scroll-block__icon">
                                        <img src={iconImages[`Item_${el.itemConfigId}`]} alt=""/>
                                        <span>{el.inventoryCount === 1 ? "" : el.inventoryCount}</span>
                                    </div>
                                    <div className="market-right-scroll-block__text">
                                        {el.name}
                                    </div>
                                </div>

                                <div
                                    className={`market-part market-customer__hidden ${el.active ? "market-active" : ""}`}>

                                    {itemConfig.type === ITEM_TYPE.CLOTH &&
                                    <img className="market-right-scroll-block__reviewButton market-deActive"
                                         src={svg["reviewButton"]} alt="" onClick={() => this.previewForSeller(key)}/>}

                                    <div className="market-right-scroll-block__inputs">
                                        <div className="market-deActive">
                                            <input type="number"
                                                   defaultValue={el.price}
                                                   value={el.price}
                                                   onChange={(e) => this.sellerChangePrice(key, e.target.value)}/>
                                            <span>СТОИМОСТЬ</span>
                                        </div>
                                        <div className="market-deActive">
                                            <input type="number"
                                                   defaultValue={el.countForSell}
                                                   value={el.countForSell}
                                                   onChange={(e) => this.sellerChangeCount(key, e.target.value)}/>
                                            <span>КОЛИЧЕСТВО</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        })
                    }

                </div>}

            </div>

        </div>
    }
}
import React, {Component} from "react";

// @ts-ignore
import png from './assets/*.png'
// @ts-ignore
import svg from "./assets/*.svg"

//@ts-ignore
import productImages from '../../../../../shared/icons/*.png'
import { CustomEvent } from '../../../../modules/custom.event'
import { CustomEventHandler } from '../../../../../shared/custom.event'
import { CEF } from '../../../../modules/CEF'
import { inventoryShared } from '../../../../../shared/inventory'
import { FEED_LIST, SUPPLIES_LIST } from '../../../../../shared/farm/config'
import { PayBox } from '../../../PayBox/PayBox'
import check from '../../../ClothShop/assets/check.svg'

type category = "seeds" | "feed";
type subCat = "field" | "greenhouse";

interface Product { 
    item_id: number, 
    count: number, 
    price: number, 
    inCart?: number
}

export class Shop extends Component<{}, {
    name?: string,
    shopId?: number,
    items?: Product[],
    donate?: number,
    showPay?: boolean,

    cat: category,
    subCat: subCat
    basket: Product[]
}> {
    _child: React.RefObject<PayBox>;
    initEvent: CustomEventHandler;
    constructor(props: any) {
        super(props);

        this.state = {
            items: CEF.test ? [...inventoryShared.items.map(q => {
                return {
                    item_id: q.item_id,
                    count: 10,
                    price: q.defaultCost || 1000
                }
            })] : [] ,
            
            cat: "seeds",
            subCat: "greenhouse",
            basket: []
        }

        this._child = React.createRef<PayBox>();

        this.initEvent = CustomEvent.register('cef:item_shop:init', 
            (
                shopId: number, 
                shopName: string, 
                items: Product[], 
                donate: number, 
                _: number, 
                __: number) => {
            this.setState({ 
                shopId, 
                items, 
                donate
            });
        });
    }

    componentDidMount = () => {
        document.addEventListener('keydown', this.handleKeyDown);
    }
    
    componentWillUnmount = () => {
        if (this.initEvent) 
            this.initEvent.destroy();
        document.removeEventListener('keydown', this.handleKeyDown);
    }
    handleKeyDown = (e:any) => {
        switch(e.keyCode) {
            case 27: {
                if (this.state.showPay && this.state.showPay === true ) 
                    this.setState({...this.state, showPay:false});
                return;
            }
        }
    }
    buy() {
        let result = this._child.current.canPay(this.getTotalAmount());
        if (!result) return;
        let data = [...this.state.basket].filter(q => q.count > 0).map(q => {
            return [q.item_id, q.count];
        })
        
        if (data.length === 0) return;
        this.setState({showPay: false});
        
        CustomEvent.triggerServer('server:item_shop:buy_item', this.state.shopId, data, result.paytype, result.pin);
    }

    setCat(cat: category) {
        this.setState({...this.state, cat});
    }

    setSubCat(subCat: subCat) {
        this.setState({...this.state, subCat});
    }

    getCurrentShop(): Product[] {
        if (this.state.cat === "seeds") {
            if (this.state.subCat === "greenhouse") {
                return this.state.items.filter(i => {
                    const supply = SUPPLIES_LIST.find(s => s.inventoryItemId == i.item_id)
                    if (!supply) return false
                    return supply.type == 'greenhouse' || supply.type == 'all'
                });
            } else {
                return this.state.items.filter(i => {
                    const supply = SUPPLIES_LIST.find(s => s.inventoryItemId == i.item_id)
                    if (!supply) return false
                    return supply.type == 'field' || supply.type == 'all'
                });
            }
        } else {
            return this.state.items.filter(i => {
                const supply = FEED_LIST.find(s => s.inventoryItemId == i.item_id)
                return !!supply
            })
        }
    }

    addToBasket(key: number) {
        const obj = {...this.getCurrentShop()[key]},
            basket = [...this.state.basket];

        obj.count = 1;
        obj.inCart = obj.inCart ? obj.inCart + 1 : 1
        
        basket.push(obj);
        this.setState({...this.state, basket});
    }

    changeBasketCount(toggle: boolean, key: number) {
        let basket = [...this.state.basket];
        let el: Product = basket[key];

        if (toggle) {
            if (el.count === 50) {
                el.count = 0;
            }else{
                el.count++;
            }
        }else{
            if (el.count === 0) {
                el.count = 50;
            }else{
                el.count--;
            }
        }

        this.setState({...this.state, basket});
    }

    getTotalAmount(): number {
        let amount = 0;

        this.state.basket.forEach(el => {
           amount += el.price * el.count;
        });

        return amount;
    }


    render() {
        return <div className="farm-shop">

            <img src={png["logo"]} className="farm-shop__logo" alt=""/>
            { this.state.showPay && this.state.showPay === true ?
                <div className="shop_paybox">
                    <div className="shop_paybox_box">
                        <PayBox ref={this._child} />
                        <div className="shop_buy" onClick={() => this.buy()} >
                            <img src={check}/>Оплатить
                        </div>
                    </div>
                </div>
                : null }
            <div className="farm-shop-left">

                <div className={`farm-shop-left__button ${this.state.cat === "seeds" ? "farm-active" : null}`} onClick={() => this.setCat("seeds")}>
                    <img src={svg["seeds"]} alt=""/>
                    СЕМЕНА
                </div>

                <div className={`farm-shop-left__button ${this.state.cat === "feed" ? "farm-active" : null}`} onClick={() => this.setCat("feed")}>
                    <img src={svg["box"]} alt=""/>
                    КОРМ
                </div>
            </div>

            <div className="farm-shop-middle">

                {this.state.cat === "seeds" && <div className="farm-shop-middle__nav">
                    <div className={`${this.state.subCat === "greenhouse" ? "farm-active" : null}`} onClick={() => this.setSubCat("greenhouse")}>
                        <span>Теплица</span>
                    </div>
                    <div className={`${this.state.subCat === "field" ? "farm-active" : null}`} onClick={() => this.setSubCat("field")}>
                        <span>Поле</span>
                    </div>
                </div>}

                <div className="farm-shop-middle-scroll">

                    {
                        this.getCurrentShop().map((el, key) => {
                            return <div className="farm-shop-middle-scroll-block" key={key}>
                                <img src={productImages['Item_' + el.item_id]} className="farm-shop-middle-scroll-block__image" alt=""/>
                                <div className="farm-shop-middle-scroll-block-inform">
                                    <div className="farm-shop-middle-scroll-block-inform__name">{ inventoryShared.get(el.item_id).name }</div>
                                    <div className="farm-shop-middle-scroll-block-inform__price">$ { el.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ") }</div>
                                    <div className="farm-shop-middle-scroll-block-inform__button" onClick={() => this.addToBasket(key)}>
                                        <img src={svg["cart"]} alt=""/>
                                        <span>В корзину</span>
                                    </div>
                                </div>
                            </div>
                        })
                    }

                </div>

            </div>

            <div className="farm-shop-right">

                <div className="farm-shop-right-top">

                    <div className="farm-shop-right-top__balance">
                        <div>БАЛАНС:</div>
                        <span>$ {CEF.user.money.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</span>
                        <p>$ {CEF.user.bank.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</p>
                    </div>

                    <div className="farm-shop-right-top__result">
                        <div>ИТОГ:</div>
                        <span>$ {this.getTotalAmount().toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</span>
                    </div>

                    <div className="farm-shop-right-top__button" onClick={() => {
                        this.setState({
                            ...this.state,
                            showPay: true
                        })
                    }}>
                        <img src={svg["mark"]} alt=""/>
                        <span>КУПИТЬ</span>
                    </div>

                </div>

                <div className="farm-shop-right__title">
                    <img src={svg["cart"]} alt=""/>
                    ВАША <span>КОРЗИНА</span>
                </div>

                <div className="farm-shop-right-scroll">

                    {
                        this.state.basket.map((el, key) => {

                            return <div className="farm-shop-right-scroll-block" key={key}>

                                <img src={productImages['Item_' + el.item_id]} className="farm-shop-right-scroll-block__image" alt=""/>

                                <div className="farm-shop-right-scroll-block-right">

                                    <div className="farm-shop-right-scroll-block-right__price">
                                        $ {(el.price * el.count).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}
                                    </div>

                                    <div className="farm-shop-right-scroll-block-right__name">
                                        { inventoryShared.get(el.item_id).name }
                                    </div>

                                    <div className="farm-shop-right-scroll-block-right__quantity">
                                        <img src={svg["plus"]} alt="" onClick={() => this.changeBasketCount(true, key)}/>
                                        <span>{el.count}</span>
                                        <img src={svg["minus"]} alt="" onClick={() => this.changeBasketCount(false, key)}/>
                                    </div>

                                </div>
                            </div>
                        })
                    }


                </div>

            </div>

        </div>
    }
}
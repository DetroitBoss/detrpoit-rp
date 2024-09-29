import React, {Component} from 'react';
import icons from '../../../shared/icons/*.png'
import './style.less'
import {CustomEvent} from '../../modules/custom.event';
import {getBaseItemNameById, getItemDesc, inventoryShared, ITEM_TYPE, ITEM_TYPE_ARRAY} from '../../../shared/inventory';
import {BUSINESS_SUBTYPE_NAMES} from '../../../shared/business';
import {DONATE_MONEY_NAMES} from '../../../shared/economy';
import bg from './../Fuel/assets/bg.svg';
import check from './../ClothShop/assets/check.svg';
import cart from './assets/cart.svg';
import plus from './assets/plus.svg';
import minus from './assets/minus.svg';
import coin from './assets/coin.svg';
import {PayBox} from '../PayBox/PayBox';
import {CEF} from "../../modules/CEF";
import {TooltipClass} from "../Tooltip";
import close from '../HudBlock/images/svg/close.svg';
import {system} from "../../modules/system";

export class ShopBlock extends Component<{}, {
    active?: boolean,
    name?: string,
    shopId?: number,
    items?: { item_id: number, count: number, price: number, inCart?: number }[],
    donate?: number,
    shopType: Array<number>,
    /** Выбранный раздел */
    selectType: number,
    selectItem: number,
    showPay?:boolean,
}> {
    initEvent: import("../../../shared/custom.event").CustomEventHandler;
    _child: React.RefObject<PayBox>;
    constructor(props: any) {
        super(props);

        this.state = {
            active: true,
            name: 'Premium Deluxe Shoper',
            items: CEF.test ? [...inventoryShared.items.map(q => {
                return {
                    item_id: q.item_id,
                    count: 10,
                    price: q.defaultCost || 1000
                }
            })] : [] ,
            shopType: [2,0],
            selectType: 0,
            selectItem: -1
        };
        this._child = React.createRef<PayBox>();

        this.initEvent = CustomEvent.register('cef:item_shop:init', (shopId: number, shopName: string, items: { item_id: number, count: number, price: number }[], donate: number, shopType: number, shopCategory: number) => {
            this.setState({ shopId, name: shopName, items, donate, active: true, shopType: [shopType, shopCategory], showPay: false });
        });
    }
    componentDidMount = () => {
        document.addEventListener('keydown', this.handleKeyDown);
    }
    componentWillUnmount = () => {
        if (this.initEvent) this.initEvent.destroy();
        document.removeEventListener('keydown', this.handleKeyDown);
    }
    handleKeyDown = (e:any) => {
        switch( e.keyCode ) {
            case 27: {
                CustomEvent.triggerClient('shop::closeButton');
                if(this.state.showPay && this.state.showPay === true ) this.setState({...this.state, showPay:false});
                else this.setState({...this.state, active:false});
                return;
            }
        }
    }
    buyItem = () => {
        let result = this.state.donate ? {paytype: 150, pin: ""} : this._child.current.canPay(this.getAllPrice());
        if (!result) return;
        let data = [...this.state.items].filter(q => q.inCart > 0).map(q => {
            return [q.item_id, q.inCart];
        })
        if(data.length === 0) return;
        // Переделать, брать из items где есть в корзине ( inCart )
        this.setState({showPay: false});
        CustomEvent.triggerServer('server:item_shop:buy_item', this.state.shopId, data, result.paytype, result.pin);
    }
    selectType = (type:number) => {
        this.setState({...this.state, selectType:type});
    }
    putInCart = (itemid:number, ammount:number) => {
        if(ammount > 0){
            const current = this.state.items.find(item => item.item_id === itemid).count;
            let inCurrent = this.state.items.find(item => item.item_id === itemid).inCart || 0;
            if(current <= inCurrent) return;
        }
        const items = this.state.items.map( obj=> {
            if(obj.item_id === itemid)
                return {...obj, inCart: (obj.inCart ? obj.inCart+ammount : ammount)};
            return obj;
        });
        this.setState({...this.state, items})
    }
    getAllPrice = () => {
        let allprice = 0;
        this.state.items.map( obj=> {
            if(obj.inCart) allprice += obj.inCart * obj.price;
        });
        return allprice;
    }
    getCategorys = () => {
        let categorys:Array<{index:number,name:string}> = [];
        this.state.items.map( obj=> {
            const cfg = inventoryShared.get(obj.item_id);
            if(!cfg) return console.log('getCategorys ITEM SHOP WRONG ITEM');
            if( categorys.some(data => data.name === ITEM_TYPE_ARRAY[ cfg.type ] ) === false)
                categorys.push( {index:cfg.type, name:ITEM_TYPE_ARRAY[ cfg.type ] } );
        });
        return categorys;
    }

    render = () => {
        const { active, name } = this.state,
              inCart = this.state.items ? this.state.items.filter(data => data.inCart && data.inCart > 0) : [],
              category = this.getCategorys(),
              items = this.state.items
                  ? this.state.items.filter(data =>
                      inventoryShared.get(data.item_id)
                      && inventoryShared.get(data.item_id).type == category[this.state.selectType].index)
                  : []
        if (!active) return <></>;
        return <div className="shop_browser">
                    <div className="shop_grid" />
                    <div className="shop_bg">
                        <img src={bg} />
                    </div>
                    <div className="shop_blur" />
                    { this.state.showPay && this.state.showPay === true ?
                        <div className="shop_paybox">
                            <div className="shop_paybox_box">
                                <PayBox ref={this._child} />
                                <div className="shop_buy" onClick={this.buyItem} >
                                    <img src={check}/>Оплатить
                                </div>
                            </div>
                        </div>
                    : null }
                    <div className="shop_main">
                        <button className="all-close" onClick={e => {
                            CustomEvent.triggerClient('shop::closeButton');
                            CEF.gui.setGui(null);
                        }}>
                            <div><img src={close} alt="" /></div>
                            <p>Закрыть</p>
                        </button>
                        <h1>{BUSINESS_SUBTYPE_NAMES[this.state.shopType[0]][this.state.shopType[1]]}</h1>
                        <h2>{this.state.name}</h2>
                        <div className="shop_box">
                            <div className="shop_left">
                                <div className="shop_types">
                                {category.length > 1 && category.map((data, index) => {
                                    return <div key={index} className={`shop_type ${index == this.state.selectType ? "shop_type_select":""}`}
                                                onClick={()=>this.selectType(index)}>{data.name}</div>
                                })}
                                </div>
                            </div>
                            <div className="shop_center">
                                {items.map((data,index) => {
                                    const desc = getItemDesc(data.item_id)
                                            const cfg = inventoryShared.get(data.item_id),
                                                  cfgWeapon = ITEM_TYPE.WEAPON == cfg.type ? inventoryShared.getWeaponConfigByItemId(data.item_id) :
                                                  ITEM_TYPE.WEAPON_MAGAZINE == cfg.type ? inventoryShared.getWeaponConfigByMagazine(data.item_id) : null;
                                    const content = <div key={index} className={`shop_item ${index == this.state.selectType ? "shop_item_select":""}`}
                                                         onMouseEnter={()=>this.setState({...this.state, selectItem: index})}
                                                         onMouseLeave={()=>this.setState({...this.state, selectItem: -1})}
                                                         onClick={()=>this.putInCart(data.item_id, 1)}>
                                        <div><img src={icons['Item_' + data.item_id]} alt="" /></div>
                                        <p>{getBaseItemNameById(data.item_id)}</p>
                                        {[ITEM_TYPE.WATER, ITEM_TYPE.FOOD].includes(cfg.type) ? <p className={'desc'}>Объём: {cfg.default_count} {cfg.type == ITEM_TYPE.WATER ? "мл" : "гр"}</p> : <></>}
                                        <h3>{this.state.donate ? <img className={"shop-logo__coin"} src={coin}/> : "$"}{data.price}</h3>

                                        {cfg.type === ITEM_TYPE.BAGS && <div className="shop_item_button" onClick={(e) => {
                                                e.stopPropagation();
                                                CustomEvent.triggerClient('shop::tryOnBackpack', data.item_id);
                                            }
                                        }>
                                            <p>Примерить</p>
                                        </div>
                                        }
                                    </div>

                                    if(desc){
                                        return <TooltipClass text={desc} html={true} effect={'solid'}>{content}</TooltipClass>
                                    } else {
                                        return content
                                    }
                                })}
                            </div>
                            <div className="shop_right">
                                <h6>Баланс:</h6>
                                <div className="money-wrap-shop mb12">
                                    <p className="p-big">${system.numberFormat(CEF.user.money)}</p>
                                    <p className="p-small">${system.numberFormat(CEF.user.bank)}</p>
                                </div>
                                <h6>Итого:</h6>
                                {this.getAllPrice() ? <>
                                    <h5>${this.getAllPrice()}</h5>
                                    <div className="shop_buy" onClick={(e)=>{
                                        e.preventDefault();
                                        if(this.state.donate){
                                            this.buyItem()
                                        } else {
                                            this.setState( {...this.state, showPay:true})
                                        }
                                    }} >
                                        <img src={check}/>Купить
                                    </div>
                                </>: <h5>{this.state.donate ? <img className={"shop-logo__coin"} src={coin}/> : '$'}0</h5>}
                                <div className="shop_buyinfo"><img src={cart}></img><h6>Ваша <strong>корзина</strong></h6></div>
                                <div className="shop_buyitems">
                                    {inCart.map((data,index) => {
                                        return <div key={index} className={`shop_buyitem`}>
                                            <div className="shop_buyitempic"><img src={icons['Item_' + data.item_id]} alt="" /></div>
                                            <span>
                                                <div className="shop_buyitemup">
                                                    <p>{getBaseItemNameById(data.item_id)}</p>
                                                    <h3>{this.state.donate ? <img className={"shop-logo__coin"} src={coin}/> : '$'}{data.price}</h3>
                                                </div>
                                                <div className="shop_buyitemdown">
                                                    <img src={plus} onClick={()=>this.putInCart(data.item_id, 1)}/>
                                                    <h3>{data.inCart}</h3>
                                                    <img src={minus} onClick={()=>this.putInCart(data.item_id, -1)}/>
                                                </div>
                                            </span>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>;
    }
}
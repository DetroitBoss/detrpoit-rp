import './style.less';
import React, {Component} from 'react';
import {systemUtil} from '../../../shared/system';
import {CustomEvent} from '../../modules/custom.event';
import {ClothData, dressShopPartsList, GloveClothData, partsList} from '../../../shared/cloth';
import {CEF, dressCfg} from '../../modules/CEF';
import bg from './../Fuel/assets/bg.svg';
import blur from './assets/lblur.png';
import icons from './assets/*.svg'
import left from './assets/left.svg';
import check from './assets/check.svg';
import {BUSINESS_SUBTYPE_NAMES, BUSINESS_TYPE} from '../../../shared/business';
import {InventoryEquipList} from '../../../shared/inventory';
import coins from '../../components/UserMenu/assets/svg/player-stop-white.svg';

export let dressData: InventoryEquipList;


export class ClothShop extends Component<{ test?: boolean }, {
  name: string;
  id?: number;
  type?: number;
  selectedSector?: number;
  selectedItem?: number;
  selectedPage?: number;
  selectedVariation: number;
  data?: {
    item_id: number;
    count: number;
    price: number;
    name: string;
    params: ClothData[] | GloveClothData[];
  }[];
  donate?: number;
  show: boolean;
}> {
  ev: import("../../../shared/custom.event").CustomEventHandler;
  constructor(props: any) {
    super(props);
    this.state = {
      show: CEF.test,
      name: "",
      type: 0,
      selectedVariation: 0,
      selectedPage: 0,
      selectedSector: 1,
      selectedItem: 1,
      data: CEF.test ? [
        { item_id: 1, count: 2, price: 10000, name: "Test", params: [[{ component: 1, drawable: 1, texture: 1, name: "Чёрный тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Белый тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Серый тестовый" }],] },
        { item_id: 2, count: 2, price: 10000, name: "Test", params: [[{ component: 1, drawable: 1, texture: 1, name: "Чёрный тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Белый тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Серый тестовый" }],] },
        { item_id: 3, count: 2, price: 10000, name: "Test", params: [[{ component: 1, drawable: 1, texture: 1, name: "Чёрный тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Белый тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Серый тестовый" }],] },
        { item_id: 4, count: 2, price: 10000, name: "Test", params: [[{ component: 1, drawable: 1, texture: 1, name: "Чёрный тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Белый тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Серый тестовый" }],] },
        { item_id: 5, count: 2, price: 10000, name: "Test", params: [[{ component: 1, drawable: 1, texture: 1, name: "Чёрный тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Белый тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Серый тестовый" }],] },
        { item_id: 6, count: 2, price: 10000, name: "Test", params: [[{ component: 1, drawable: 1, texture: 1, name: "Чёрный тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Белый тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Серый тестовый" }],] },
        { item_id: 7, count: 2, price: 10000, name: "Test", params: [[{ component: 1, drawable: 1, texture: 1, name: "Чёрный тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Белый тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Серый тестовый" }],] },
        { item_id: 8, count: 2, price: 10000, name: "Test", params: [[{ component: 1, drawable: 1, texture: 1, name: "Чёрный тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Белый тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Серый тестовый" }],] },
        { item_id: 9, count: 2, price: 10000, name: "Test", params: [[{ component: 1, drawable: 1, texture: 1, name: "Чёрный тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Белый тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Серый тестовый" }],] },
        { item_id: 10, count: 2, price: 10000, name: "Test", params: [[{ component: 1, drawable: 1, texture: 1, name: "Чёрный тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Белый тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Серый тестовый" }],] },
        { item_id: 11, count: 2, price: 10000, name: "Test", params: [[{ component: 1, drawable: 1, texture: 1, name: "Чёрный тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Белый тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Серый тестовый" }],] },
        { item_id: 12, count: 2, price: 10000, name: "Test", params: [[{ component: 1, drawable: 1, texture: 1, name: "Чёрный тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Белый тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Серый тестовый" }],] },
        { item_id: 13, count: 2, price: 10000, name: "Test", params: [[{ component: 1, drawable: 1, texture: 1, name: "Чёрный тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Белый тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Серый тестовый" }],] },
        { item_id: 14, count: 2, price: 10000, name: "Test", params: [[{ component: 1, drawable: 1, texture: 1, name: "Чёрный тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Белый тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Серый тестовый" }],] },
        { item_id: 15, count: 2, price: 10000, name: "Test", params: [[{ component: 1, drawable: 1, texture: 1, name: "Чёрный тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Белый тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Серый тестовый" }],] },
        { item_id: 16, count: 2, price: 10000, name: "Test", params: [[{ component: 1, drawable: 1, texture: 1, name: "Чёрный тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Белый тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Серый тестовый" }],] },
        { item_id: 17, count: 2, price: 10000, name: "Test", params: [[{ component: 1, drawable: 1, texture: 1, name: "Чёрный тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Белый тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Серый тестовый" }],] },
        { item_id: 18, count: 2, price: 10000, name: "Test", params: [[{ component: 1, drawable: 1, texture: 1, name: "Чёрный тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Белый тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Серый тестовый" }],] },
        { item_id: 19, count: 2, price: 10000, name: "Test", params: [[{ component: 1, drawable: 1, texture: 1, name: "Чёрный тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Белый тестовый" }],[{ component: 1, drawable: 1, texture: 1, name: "Серый тестовый" }],] },
      ] : []
    }
    this.ev = CustomEvent.register('cef:cloth_shop:init', async (id: number, name: string, type: number, dataIdss: string, donate: number) => {
      const dataIds = JSON.parse(dataIdss);
      let datas: {
        item_id: number;
        count: number;
        price: number;
        name: string;
        params: ClothData[] | GloveClothData[];
      }[] = [];
      const catalog = await CEF.getCatalog(id);
      if (!catalog) return;
      const data = catalog.filter(q => dataIds.includes(q.item)).map(q => {
        return [q.item, q.price, q.count]
      });
      data.map((item) => {
        const cfg = dressCfg.find(q => q.id == item[0]);
        if (!cfg) return;
        const { name, data } = cfg
        datas.push({ item_id: item[0], count: item[2], price: item[1], name, params: data });
      })
      this.setState({ show: true, id, name, type, data: datas, donate })
    })
  }
  handleKeyDown = (e:any) => {
    if (e.keyCode == 27 ) this.close();
  }
  componentDidMount = () => {
    document.addEventListener('keydown', this.handleKeyDown);
  }
  componentWillUnmount = () => {
    if (this.ev) this.ev.destroy();
    document.removeEventListener('keydown', this.handleKeyDown);
  }
  selectCloth = (id: number) => {
    this.setState({ selectedItem: id, selectedVariation: 0 }, () => {
      this.selectVariation(0);
    })
  }
  selectVariation = (id: number) => {
    this.setState({ selectedVariation: id })
    CustomEvent.triggerClient('cloth:preview', JSON.stringify(this.state.selectedItem
        ? this.state.data.find(q => q.item_id == this.state.selectedItem).params[id]
        : []), id
    )
  }
  selectCategory = (id: number) => {
    this.setState({ selectedSector: id })
    this.selectCloth(0)
    CustomEvent.triggerClient('cloth:category', id)
  }
  close = () => {
    CustomEvent.triggerClient('cloth:exit')
  }
  toggleCameraZoom = (enableZoom: boolean) => {
    CustomEvent.triggerClient('cloth:toggleCameraZoom', enableZoom);
  }
  getCurrent = () => {
    if (!this.state.selectedItem) return;
    return this.state.data.find(q => q.item_id == this.state.selectedItem)
  }

  getName = (data: ClothData | GloveClothData) => {
      if (data.hasOwnProperty('texture')) {
        return (data as GloveClothData).name;
      } else {
        return (data as ClothData)[0].name;
      }
  }

  render() {
    if (!this.state.data) return <></>;
    if (!this.state.show) return <></>;
    let items = this.state.data
        ? this.state.data.filter(
            q => q.params[0].hasOwnProperty('texture')
                ? this.state.selectedSector === 1000
                : (q.params[0] as ClothData)[0].component == this.state.selectedSector)
        : []

    return <div className="clothes_browser">
            <div className="clothes_grid" />
            <img src={blur} style={{position:'absolute',left:0, width:'35vw', height:'100vh'}}/>
            <img src={blur} style={{transform:'rotate(180deg)', position:'absolute',right:0, width:'35vw', height:'100vh'}}/>
            <div className="clothes_bg">
              <img src={bg} />
            </div>

            <div className="clothes_main">
               <div className="clothes_left"
                    onMouseEnter={() => this.toggleCameraZoom(false)}
                    onMouseLeave={() => this.toggleCameraZoom(true)}
               >
                 {/* <h1>Магазин одежды</h1> */}
                 <h1>{BUSINESS_SUBTYPE_NAMES[BUSINESS_TYPE.DRESS_SHOP][this.state.type]}</h1>
                 <h2>{this.state.name}</h2>
                 <div className="clothes_items">
                   {items.map((data, index) => {
                     return <div key={`cloth_item_${index}`} className={`clothes_item ${data.item_id == this.state.selectedItem ? "clothes_item_select":""}`}
                                onClick={()=>this.selectCloth(data.item_id)}>{data.name}</div>
                   })}
                 </div>
               </div>
               <div className="clothes_center">
                 { this.getCurrent() ? <>
                    <div className="clothes_list">
                      <img src={left} className={this.state.selectedVariation ? "clothes_list_active":""}
                          onClick={()=> { if(!this.state.selectedVariation) return;
                                              this.selectVariation(this.state.selectedVariation-1)} }/>
                      <img src={left} className={this.state.selectedVariation + 1 < this.getCurrent().params.length ? "clothes_list_active":""}
                            style={{transform:'rotate(180deg)'}}
                            onClick={()=> { if (this.state.selectedVariation + 1 >= this.getCurrent().params.length) return;
                                                this.selectVariation(this.state.selectedVariation + 1) }}/>
                    </div>
                    <h1 style={{textShadow: "0px 4px 24px rgba(0, 0, 0, 0.25)"}}>
                      {this.state.donate ? <img src={coins} width={24} height={24}/> : null }
                      {this.state.donate ? ` ` : '$'}{systemUtil.numberFormat(this.getCurrent().price)}
                    </h1>
                    <p style={{color:"#fff", textShadow: "0px 4px 24px rgba(0, 0, 0, 0.25)"}}>
                      {this.getName(this.getCurrent().params[this.state.selectedVariation])}
                    </p>
                    <div className="clothes_buy" 
                         onClick={() => {
                         CustomEvent.triggerServer('cloth:buy', this.state.id, this.state.selectedItem, this.state.selectedVariation)}}>
                        <img src={check}/>Купить
                    </div>
                 </> : null }
               </div>
               <div className="clothes_right">
                 {dressShopPartsList.map( (data, index)=> {
                   if (data[0] === 333) return <></>;
                   return <div key={`cloth_cat_${index}`} className="clothes_parts">
                      {data[1]}
                      <img src={icons[`p${data[0]}`]}
                          className={this.state.selectedSector == data[0] ? "clothes_parts_select":""}
                          onClick={()=>this.selectCategory(data[0])}/>
                   </div>
                 })}
               </div>
            </div>

    </div>;
  }
}


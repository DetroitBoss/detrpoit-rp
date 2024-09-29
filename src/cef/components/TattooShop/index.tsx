import '../ClothShop/style.less';
import React, {Component} from 'react';
import {systemUtil} from '../../../shared/system';
import {CustomEvent} from '../../modules/custom.event';
import {TattooItem, tattoosShared} from '../../../shared/tattoos';
import {DONATE_MONEY_NAMES, tattooRemoveCostMultipler} from '../../../shared/economy';
import {CEF} from '../../modules/CEF';
import bg from './../Fuel/assets/bg.svg';
import blur from '../ClothShop/assets/lblur.png';
import icons from './assets/*.svg'
import check from './../ClothShop/assets/check.svg';

export class TattooShop extends Component<{ test?: boolean }, {
  name: string;
  id?: number;
  type?: number;
  selectedSector?:string;
  selectedItem?:number;
  data?: {
    item_id: number;
    // count: number;
    price: number;
  }[]
  tattoos?: [string, string][];
  donate?: number;
  show: boolean;
}> {
  ev: import("../../../shared/custom.event").CustomEventHandler;
  constructor(props: any) {
    super(props);
    this.state = {
      selectedSector: "ZONE_TORSO",
      selectedItem: 0,
      name: "Партак",
      type: 0,
      tattoos: CEF.test ? [["mpbusiness_overlays", "MP_Buis_M_Chest_001"], ["mpbeach_overlays", "MP_Bea_M_Back_000"]] : null,
      data: CEF.test ? [
        {item_id:1, price:1000000},
        {item_id:2, price:20000},
      ] : null,
      donate: 0,
      show: CEF.test
    }
    this.ev = CustomEvent.register('cef:tattoo_shop:init', (id: number, name: string, type:number, data: {
      item_id: number;
      count: number;
      price: number;
    }[], tattoos: [string, string][], donate) => {
      this.setState({ selectedItem: 0, show: true, id, name, type, data: data || [], tattoos: tattoos || [], donate})
    })
  }
  componentWillUnmount(){
    if(this.ev) this.ev.destroy();
  }
  selectTattoo(id:number){
    this.setState({ selectedItem: id })
    if(id >= 100000){
      const cfg = tattoosShared.findTattoo(this.state.tattoos[id - 100000][0], this.state.tattoos[id - 100000][1])
      CustomEvent.triggerClient('tattoo:preview', JSON.stringify(cfg))
    } else {
      CustomEvent.triggerClient('tattoo:preview', JSON.stringify(id ? tattoosShared.getTattoo(id) : null))
    }
  }
  selectCategory(id:string){
    this.setState({ selectedSector: id })
    this.selectTattoo(0)
    CustomEvent.triggerClient('tattoo:category', id)
  }
  close(){
    CustomEvent.triggerClient('tattoo:exit')
  }
  getCurrent(){
    if (!this.state.selectedItem) return;
    return this.state.data.find(q => q.item_id == this.state.selectedItem)
  }

  currentTattooExists(item?: {
    item_id: number;
    count: number;
    price: number;
    params: TattooItem;
  }){
    const current = item ? item : this.getCurrent();
    if(!current) return false
    const data = tattoosShared.getTattoo(current.item_id)
    return !!this.state.tattoos.find(q => q[0] === data.collection && (q[1] === data.overlay_male || q[1] === data.overlay_female))
  }
  render() {
    if (!this.state.show) return <></>;
    if (!this.state.data) return <></>;
    if (!this.state.tattoos) return <></>;
    const remove = this.currentTattooExists() || this.state.selectedItem >= 100000
    let removePrice = 0;
    if (remove){
      if(this.currentTattooExists()){
        removePrice = this.getCurrent() ? this.getCurrent().price * tattooRemoveCostMultipler : 0
      } else {
        const q = tattoosShared.findTattoo(this.state.tattoos[this.state.selectedItem - 100000][0], this.state.tattoos[this.state.selectedItem - 100000][1])
        if (q) removePrice = q.price * tattooRemoveCostMultipler
      }
    }
    let items = this.state.data ? this.state.data.filter(q => tattoosShared.getTattoo(q.item_id) && tattoosShared.getTattoo(q.item_id).zone == this.state.selectedSector ) : [];
    return <>
        <div className="clothes_browser">
            <div className="clothes_grid" />
            <img src={blur} style={{position:'absolute',left:0, width:'35vw', height:'100vh'}}/>
            <img src={blur} style={{transform:'rotate(180deg)', position:'absolute',right:0, width:'35vw', height:'100vh'}}/>
            <div className="clothes_bg">
              <img src={bg} />
            </div>

            <div className="clothes_main">
               <div className="clothes_left">
                 <h1>Тату салон</h1>
                 <h2>{this.state.name}</h2>
                 <div className="clothes_items">
                   { this.state.selectedSector == 'used' ? this.state.tattoos.map((item, index) => {
                      let cfg = tattoosShared.findTattoo(item[0], item[1]);
                      return <div key={index}
                      className={`clothes_item ${index+100000 == this.state.selectedItem ? "clothes_item_select":""}`}
                      onClick={()=> {
                        this.selectTattoo(index + 100000)}
                      }>{cfg.name}</div>
                    }) :
                items.filter(data => tattoosShared.getTattoo(data.item_id) && !this.state.tattoos.find(s => s[0] === tattoosShared.getTattoo(data.item_id).collection && (s[1] === tattoosShared.getTattoo(data.item_id).overlay_male || s[1] === tattoosShared.getTattoo(data.item_id).overlay_female))).map((data, index) => {
                      return <div key={index}
                                  className={`clothes_item ${data.item_id == this.state.selectedItem ? "clothes_item_select":""}`}
                                  onClick={()=> {
                                    this.selectTattoo(data.item_id)}
                                  }>{tattoosShared.getTattoo(data.item_id) ? tattoosShared.getTattoo(data.item_id).name : "Старая татуировка"}</div>
                   })}
                 </div>
               </div>
               <div className="clothes_center">
                 {this.state.selectedItem ? <>
                   <h1>{this.state.donate ? `${DONATE_MONEY_NAMES[3]} ` : '$'}{systemUtil.numberFormat(remove ? removePrice : (this.getCurrent() ? this.getCurrent().price : 0))}</h1>
                   <p>{remove ?
                     tattoosShared.findTattoo(this.state.tattoos[this.state.selectedItem - 100000][0], this.state.tattoos[this.state.selectedItem - 100000][1]).name
                    : tattoosShared.getTattoo(this.getCurrent().item_id) ? tattoosShared.getTattoo(this.getCurrent().item_id).name : "Старая татуировка" }</p>
                   <div className="clothes_buy" onClick={e => {
                      if (remove){
                        CustomEvent.triggerServer('tattoo:remove', this.state.id, this.state.selectedItem - 100000, removePrice)
                      } else {
                        CustomEvent.triggerServer('tattoo:buy', this.state.id, this.state.selectedItem)
                      }
                    }}>
                      <img src={check}/>
                      {remove ? "Свести" : "Набить"}
                   </div>
                   </>:null}
               </div>
               <div className="clothes_right">
                 {tattoosShared.categorys.map( (data, index) => {
                    return <div key={index} className="clothes_parts">
                    {data[0]}
                    <img src={icons[`p${data[1]}`]}
                        className={this.state.selectedSector == data[1] ? "clothes_parts_select":""}
                        onClick={()=>this.selectCategory(data[1])}/>
                    </div>
                 })}
                    <div className="clothes_parts">
                    {'Набитые тату'}
                    <img src={icons[`tatto`]}
                        className={this.state.selectedSector == 'used' ? "clothes_parts_select":""}
                        onClick={()=>this.selectCategory('used')}/>
                    </div>
               </div>
            </div>
        </div>
    </>;
  }
}
import React, {Component} from 'react';
import './style.less';
import {CEF} from '../../modules/CEF';
import {CustomEvent} from '../../modules/custom.event';
import {AutosalonCarItem} from '../../../shared/autosalon';

import {CustomPicker, HSLColor, RGBColor} from 'react-color';
import bg from './../Fuel/assets/bg.svg';
import blur from './../ClothShop/assets/lblur.png';
import check from './../ClothShop/assets/check.svg';
import {Hue, Saturation} from 'react-color/lib/components/common';
import {systemUtil} from '../../../shared/system';
import {fuelTypeNames} from '../../../shared/vehicles';
import coins from '../../components/UserMenu/assets/svg/player-stop-white.svg';

// '#44b223',
// '#416a34',
// '#346a47',
// '#346a51',
// '#3a346a',
// '#21a7c7',
// '#295cbe',
// '#cc3f6b',
// '#f73535',
// '#cc963f',
// '#c7cc3f',
// '#070606',
// '#ffffff',

interface AutosalonState {
  type: string;
  selectedCar: number;
  selectPause: boolean;
  name?: string;
  cars: AutosalonCarItem[];
  loaded?: boolean;
  primaryColor: {r:number, g:number, b:number};
  secondaryColor: {r:number, g:number, b:number};
  donate?:number,
  canFamilyBuy?: boolean
}



export class Autosalon extends Component<any, AutosalonState> {
  ev: import("../../../shared/custom.event").CustomEventHandler;
  constructor(props: any) {
    super(props);

    this.state = {
      primaryColor: {r: 0, g: 0, b: 0},
      secondaryColor: {r: 255, g: 255, b: 255},
      type: '',
      name: 'Элитного класса',
      selectedCar: 1,
      selectPause: false,
      cars: CEF.test ? [
        {item: 1, count: 110, price: 999990, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 2, count: 10, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 3, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 4, count: 10, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 5, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 6, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 7, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 8, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 9, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 10, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 11, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 12, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 13, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 14, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 15, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 16, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 17, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 18, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 19, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 20, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 21, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 22, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 23, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 24, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 25, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 26, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 27, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 28, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 29, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 30, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 31, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 32, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 33, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 34, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 35, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 36, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 37, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 38, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 39, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 40, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
        {item: 41, count: 0, price: 0, name: "Xa21", fuel_type: 3, fuel_max: 10, fuel_min: 3, model: "xa21", stock: 10},
      ] : [],
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);


    this.ev = CustomEvent.register('autosalon:startAutosalon', (name: string, cars: AutosalonCarItem[], selectedCar: number, donate: number, canFamilyBuy: boolean) => {
      this.setState({ name, cars, selectedCar, donate, loaded: true, canFamilyBuy})
    })


  }
  componentDidMount = () => {
    document.addEventListener('keydown', this.handleKeyDown);
  }
  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.handleKeyDown);
    if(this.ev) this.ev.destroy();
  }

  handleKeyDown = (e: any) => {
    switch( e.keyCode ) {
      case 83: 
      case 40: {
        if (this.state.selectPause) return;
        let idx = this.state.cars.findIndex( data => data.item > this.state.selectedCar);
        if( idx < 0 ) idx = 0;
        this.selectCar(this.state.cars[idx].item);
        return document.querySelector('.autosalon_items div.autosalon_item_select').scrollIntoView({ behavior: 'smooth', block: 'center' });
      } 
      case 87: 
      case 38: {
        if (this.state.selectPause) return;
        let idx = -1;
        this.state.cars.forEach( (data, index) => {
          if( data.item < this.state.selectedCar )  idx = index;     
        });
        if( idx < 0 ) idx = this.state.cars.length - 1;
        this.selectCar(this.state.cars[idx].item);
        return document.querySelector('.autosalon_items div.autosalon_item_select').scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      case 27: return this.closeBuying();
    }
  }

  selectCar = (id: number) => {
    if (this.state.selectPause) return;
    mp.trigger('client:autosalon:changeCar', id);
    this.setState({ selectedCar: id, selectPause: true });
    setTimeout(() => this.setState({ selectPause: false }), 500);
  }

  closeBuying = () => {
    CustomEvent.triggerClient('server:autosalon:stopBuyCar');
    CEF.gui.setGui(null);
  }

  buyCar = () => {
    CustomEvent.triggerClient('autosalon:buyCar')
    this.closeBuying();
  }
  buyFamilyCar = () => {
    CustomEvent.triggerClient('autosalon:buyCar', true);
    this.closeBuying();
  }
  testDrive = () => {
    CustomEvent.triggerClient('client:autosalon:testDrive');
  }

  selectedCar = () => {
    return this.state.cars.find(itm => itm.item == this.state.selectedCar);
  }

  toggleCameraZoom = (enableZoom: boolean) => {
    CustomEvent.triggerClient('autosalon:toggleZoom', enableZoom);
  }

  changeColor = (e:any,type:number) => {
    if( type == 0 ) this.setState({ primaryColor: e.rgb });
    else this.setState({ secondaryColor: e.rgb });
    CustomEvent.triggerClient( type == 0 ?  'autosalon:setPrimaryColor' : 'autosalon:setSecondaryColor', e.rgb.r, e.rgb.g, e.rgb.b)
 }

  render = () => {
    return <div className="autosalon_browser">
              <div className="autosalon_grid" />
              <img src={blur} style={{position:'absolute',left:0, width:'35vw', height:'100vh'}}/>
              <img src={blur} style={{transform:'rotate(180deg)', position:'absolute',right:0, width:'35vw', height:'100vh'}}/>
              <div className="autosalon_bg">
                <img src={bg} />
              </div>

              <div className="autosalon_main">
                  <div className="autosalon_left">
                    <h1>Автосалон</h1>
                    <h2>{this.state.name}</h2>
                    <div className="autosalon_items" onMouseLeave={() => this.toggleCameraZoom(true)} onMouseEnter={() => this.toggleCameraZoom(false)}>
                      {this.state.cars.map((data, index) => {
                        return <div key={index} className={`autosalon_item ${data.item == this.state.selectedCar ? "autosalon_item_select":""}`}
                                    onClick={()=>this.selectCar(data.item)}>{data.name}</div>
                      })}
                    </div>
                  </div>
                  <div className="autosalon_right">
                    {this.selectedCar() ? <>
                      <ColorPickerWrapped color={this.state.primaryColor as (string & RGBColor)} 
                                              onChange={(e:any) => this.changeColor(e,0)} onChangeComplete={(e:any) => this.changeColor(e, 0)}/>
                      <ColorPickerWrapped color={this.state.secondaryColor as (string & RGBColor)} 
                                              onChange={(e:any) => this.changeColor(e,1)} onChangeComplete={(e:any) => this.changeColor(e, 1)}/>
                      <h1>{this.selectedCar().name}</h1>
                      <h3>
                        {this.state.donate ? <img src={coins}/> : null }
                        {this.state.donate ? '' : '$'}{systemUtil.numberFormat(this.selectedCar().price)}
                      </h3>
                      <h4>{fuelTypeNames[this.selectedCar().fuel_type]}</h4>
                      <p>Тип топлива</p>
                      <h4>{this.selectedCar().fuel_max} L</h4>
                      <p>Объем бака</p>
                      <h4>{this.selectedCar().stock}</h4>
                      <p>Багажник</p>
                      { this.selectedCar().count ? 

                          <div className="autosalon_keys">
                            {this.state.type != 'rent' ?
                              <div className="autosalon_key" onClick={this.testDrive}>
                                  Тест-драйв
                              </div> : null }
                            <div className="autosalon_key" onClick={this.buyCar}>
                              <img src={check}/>
                              {this.state.type == 'rent' ? "Арендовать":"Купить"} 
                            </div>
                            { this.state.canFamilyBuy && this.state.type != 'rent' ?
                              <div className="autosalon_key" onClick={this.buyFamilyCar}>
                              <img src={check}/>
                              Купить в семью
                            </div> : null 
                            }
                          </div>   : 
                             <div className="autosalon_keys"><h1>Нет в наличии</h1></div>
                          }                     
                      </>:null } 
                  </div>
              </div>
    </div>
  }
}



class ColorPicker extends React.Component< { hex?:string, hsl?:HSLColor, rgb?:RGBColor, onChange: (e:any) => void } > {
  // handleChange = (data:ColorResult) => {};
  render() {
    return (
      <div className="autosalon_colorpick">
        <div className="autosalon_colorbox">
          <Saturation
            {...this.props}
            onChange={this.props.onChange}
            pointer={()=>Picker(0)}
            color={this.props.rgb}
          />
        </div>
        <div className="autosalon_colorhui" >
          <Hue {...this.props} color={this.props.rgb} onChange={this.props.onChange} pointer={()=>Picker(1)} direction="vertical"/>
        </div>
      </div>
    );
  }
}

const ColorPickerWrapped = CustomPicker(ColorPicker);

const Picker = ( type:number ) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent:'center',
        alignItems:'center',
        width: '0.8vw',
        height: '0.8vw',
        borderRadius: '0.8vw',
        background: "rgba(255,255,255,0.2)",
        border: "1px solid white",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        boxSizing: "border-box",
        marginTop: '-0.4vw',
        marginLeft: type != 1 ? '-0.4vw' : 0
      }}
    />
  );
}
/*
    return (
      <div id="autosalon">
        <div className="color-picker">
          <ChromePicker disableAlpha={true} color={this.state.primaryColor} onChange={e => {
            this.setState({ primaryColor: e.rgb })
            CustomEvent.triggerClient('autosalon:setPrimaryColor', e.rgb.r, e.rgb.g, e.rgb.b)
          }}  />
          <br/>
          <ChromePicker disableAlpha={true} color={this.state.secondaryColor} onChange={e => {
            this.setState({ secondaryColor: e.rgb })
            CustomEvent.triggerClient('autosalon:setSecondaryColor', e.rgb.r, e.rgb.g, e.rgb.b)
          }} />
        </div>
        <i className="close" onClick={() => this.closeBuying()}>
          <img src={close} alt="" />
        </i>
        <i className="shadow-overlay-autosalon"></i>
        <div className="section-view">
          <div className="left-box-screen-autosalon">
            <div>
              <div className="left-box-title">
                <strong>{this.state.name}</strong>
              </div>
              <label className="lbl-form">Выберите авто</label>
            </div>
            <div className="left-box-enter-list">
              {this.state.cars.map((i, id) => (
                <div
                  className={i.item == this.state.selectedCar ? 'active' : ''}
                  onClick={() => this.selectCar(i.item)}
                >
                  {i.name}
                </div>
              ))}
            </div>
          </div>
          <div className="car-info-box">
            <p className="car-name">
              {this.selectedCar()
                ? this.selectedCar().name
                : ''}
            </p>
            <p className="car-class mb30">
              {this.state.donate ? <span className="gold">premium</span> : <></>}
              <img src={fuel} alt="" />
              {this.selectedCar() ? (
                <>{this.selectedCar().fuel_max} L ({this.selectedCar().fuel_min} L)</>
              ) : (
                ''
              )}
              {this.selectedCar() && this.selectedCar().stock ? <>
                <img src={stock} alt="" />
                {Math.floor(this.selectedCar().stock / 1000)} КГ
              </> : <></>}
            </p>
            
          </div>
          <div className="car-buy-box">
            <div>
              <p>
                {this.selectedCar() && this.selectedCar().price && this.selectedCar().count
                ? `стоимость`
                : ''}
              </p>
              <p>
                <strong>
                  
                  {this.selectedCar() && this.selectedCar().price && this.selectedCar().count
                    ? `${this.state.donate ? DONATE_MONEY_NAMES[3] : '$'}${this.selectedCar().price}`
                    : 'Нет в наличии'}
                </strong>
              </p>
            </div>
            {this.selectedCar() && this.selectedCar().price && this.selectedCar().count ? <button className="primary-button" onClick={() => this.buyCar()}>
              {this.state.type == 'rent' ? 'Арендовать' : 'Купить'}
            </button> : <></>}
            {this.state.type != 'rent' ? <button className="primary-button" onClick={() => this.testDrive()}>
              Тест-драйв
            </button> : <></>}
            
            
          </div>
        </div>
      </div>
    );
     */
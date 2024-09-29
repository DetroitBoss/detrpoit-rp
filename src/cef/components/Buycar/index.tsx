import React, {Component} from 'react';
import './style.less';

import {CustomEvent} from '../../modules/custom.event';
import svg from './../LSCnew/assets/*.svg';
import {systemUtil} from '../../../shared/system';
import {fuelTypeNames, VEHICLE_FUEL_TYPE} from '../../../shared/vehicles';
import {CEF} from '../../modules/CEF';


interface LSCState {
    name: string,
    owner: string,
    price: number,
    fuel: number,
    fuelType: VEHICLE_FUEL_TYPE,
    plate: string,
    bag: number,
    tuning: {id: number, name: string}[],
    inputPrice: number,
    pos: number
}

export class BuyCar extends Component<any, LSCState> {
    ev: import("../../../shared/custom.event").CustomEventHandler;
    constructor(props: any) {
      super(props);

      this.state = {
        name: 'BMW 5',
        owner: 'Admin',
        price: 999999,
        fuel: 80,
        fuelType: VEHICLE_FUEL_TYPE.A95,
        plate: 'x779yy',
        bag: 100,
        tuning: [{id: 1, name: 'Спойлер на багажник'}, {id:2, name: 'Икона на панель'}],
          inputPrice: 0,
          pos: 0
      };



      this.ev = CustomEvent.register('buycar:show', ( data:LSCState ) => {
          this.setState({ ...data });
      })
    }
    componentDidMount = () => {
    }
    componentWillUnmount = () => {
      if(this.ev) this.ev.destroy();
    }
   
    buycar = () => {
        if( !this.state.price) {
            CustomEvent.triggerServer('vehicle:sell:place', this.state.pos, this.state.inputPrice)
        } else {
            CustomEvent.triggerServer('vehicle:sell:buy', this.state.pos, this.state.price)
        }
        CEF.gui.setGui(null);
    }

    buycarFamily = () => {
        if( this.state.price) {
            CustomEvent.triggerServer('vehicle:sell:buy', this.state.pos, this.state.price, true)
        }
        CEF.gui.setGui(null);
    }
    
 
    render = () => {
              return <>
                  <section className="buy-car-wrapper animated fadeIn">
                          <div className="lsc-check-list buy-car-check-tuning animated fadeInUp waiteone">
                              <div className="lsc-left-tab-inner-check">
                                <p className="buy-car-tuning-title">Установленный тюнинг</p>
                                  {this.state.tuning.map( (data, idx) => {
                                        return <div className="lsc-list-item" key={idx}>
                                            <div>
                                                <img src={svg[`tuning-item-${data.id}`]} alt=""/>
                                                <p>{data.name}</p>
                                            </div>
                                        </div>
                                  })}
                              </div>
                          </div>
                          <div className="buy-car-info">
                              <p className="buy-car-name">{this.state.name}</p>
                              <div className="buy-car-info-box">
                                  <p className="bci-mini">Владелец</p>
                                  <p className="bci-info">{this.state.owner}</p>
                              </div>
                              <div className="flex-line left">
                                  {
                                      this.state.price ?
                                      <div className="buy-car-info-box">
                                          <p className="bci-mini">Стоимость</p>
                                          <p className="bci-info">${systemUtil.numberFormat( this.state.price )}</p>
                                      </div> : <></>
                                  }

                                  <div className="buy-car-info-box">
                                      <p className="bci-mini">Номерной знак</p>
                                      <p className="bci-info">{this.state.plate ? this.state.plate.toUpperCase() : 'Отсутствует'}</p>
                                  </div>
                              </div>
                              <div className="flex-line left">
                                  <div className="buy-car-info-box">
                                      <p className="bci-mini">Объем бака</p>
                                      <p className="bci-info">{this.state.fuel} { this.state.fuelType === VEHICLE_FUEL_TYPE.ELECTRO? "кВт" : "Л" }</p>
                                  </div>
                                  <div className="buy-car-info-box">
                                      <p className="bci-mini">Тип топлива</p>
                                      <p className="bci-info">{fuelTypeNames[this.state.fuelType]}</p>
                                  </div>
                                  <div className="buy-car-info-box">
                                      <p className="bci-mini">Багажник</p>
                                      <p className="bci-info">{this.state.bag} кг</p>
                                  </div>
                              </div>
                              {!this.state.price ? <p className="font24 fontw600 mb12 fff">Введите стоимость транспорта</p> : <></> }
                                <div className="flex-line">
                                    {
                                        !this.state.price ?
                                        <>
                                        <input type="text" className="buycarinput" placeholder="Цена ТС" value={ this.state.inputPrice ? this.state.inputPrice : ""}
                                               onChange={(e)=> {
                                                   if (/^\d{1,10}$/.test(e.target.value) == true || !e.target.value.length)
                                                       this.setState({...this.state, inputPrice: Number(e.target.value)});
                                               }} />
                                        <button className="lsc-button-orange" onClick={this.buycar}>
                                        <img src={svg['card-add']} alt=""/>
                                        <p>Выставить на продажу</p>
                                        </button>
                                        </> :
                                            <>
                                                <button className="lsc-button-orange mt50" onClick={this.buycar}>
                                                    <img src={svg['card-add']} alt=""/>
                                                    <p>Купить ТС</p>
                                                </button>
                                                <button className="lsc-button-orange mt50 ml8" onClick={this.buycarFamily}>
                                                    <img src={svg['card-add']} alt=""/>
                                                    <p>Купить в семью</p>
                                                </button>
                                            </>
                                    }

                                </div>
                          </div>

                      </section>
              </>
    }
}
 
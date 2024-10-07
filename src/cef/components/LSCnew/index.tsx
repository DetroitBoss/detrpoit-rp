import React, {Component} from 'react';
import './style.less';

import {CEF} from '../../modules/CEF';
import {CustomEvent} from '../../modules/custom.event';
import svg from './assets/*.svg';
import png from './assets/*.png';
import {CustomPicker, HSLColor, RGBColor} from 'react-color';
import check from './../ClothShop/assets/check.svg';
import {Hue, Saturation} from 'react-color/lib/components/common';
import {systemUtil} from '../../../shared/system';
import {PayBox} from '../PayBox/PayBox';
import {
    buyUpgrades, ChipTuningOption,
    convertModCostFromCarCost, HandlingConfig, handlingConfigs,
    LSC_COLOR_MODS,
    LSC_SECTION_TYPES,
    LSC_WHEELS,
    lscUpgrade
} from '../../../shared/lsc';
import {VEHICLE_REPAIR_COST} from "../../../shared/economy";
import Slider, { SliderProps } from "@material-ui/core/Slider";
import { styled } from "@material-ui/styles";

const LscChipSlider = styled(Slider)<SliderProps>(() => ({
    color: "rgb(227, 37, 107)",
    height: 30,
    '& .MuiSlider-thumb': {
        '&:hover, &.Mui-focusVisible': {
            boxShadow: `0px 0px 0px 8px rgba(227, 37, 107, 0.2)`,
        },
        '&.Mui-active': {
            boxShadow: `0px 0px 0px 8px rgba(227, 37, 107, 0.2)`,
        },
    },
}));

enum ChangeInputType {
    Increase,
    Decrease
}

interface LSCitem {
  item: number,
  price: number,
  name: string,
  type: number,
  model: string,
  param?: { speed?:number, velocity?:number, breaked?:number, friction?: number};
  isColor?:boolean;
} 

interface LSCState {
    page: number,
    primaryColor: { r: number, g: number, b: number };
    secondaryColor: { r: number, g: number, b: number };
    selectedType: number;
    selectedTuning: number;
    showPay: boolean;
    repair: number,
    carName: string,
    lscUpgrade: lscUpgrade[],
    buyUpgrades: buyUpgrades,
    colorTime: number,
    shopId: number,
    vehicleId: number,
    vehicleCost: number
    // текущие колеса
    currentWheelsType?: number,
    // текущие колеса
    currentWheelsID?: number,
    // выбраные колеса:
    selectWheels?: [number, number],
    chipTuningData: ChipTuningOption[];
    // колеса для покупки
    buyWheels?: [number, number],
    wheelMultiplier: number,
    refHexInput: React.RefObject<any>
}
enum page {
  REPAIR,
  TUNING,
  BUY,
  TUNING_CHIP
}

const WHEEL_ID = 62;

export class LSC extends Component<any, LSCState> {
    ev: import("../../../shared/custom.event").CustomEventHandler;
    _child: React.RefObject<PayBox>;
    isChipTuning: boolean = false;
    chipTuningCost: number = 0;
    chipConfigStandard: ChipTuningOption[];

    constructor(props: any) {
      super(props);

        this.state = {
            page: page.REPAIR,
            primaryColor: {r: 0, g: 0, b: 0},
            secondaryColor: {r: 255, g: 255, b: 255},
            selectedType: 1,
            selectedTuning: 0,
            showPay: false,
            repair: VEHICLE_REPAIR_COST,
            carName: 'testcar',
            lscUpgrade: [
                {
                    id: 1,
                    name: 'Спойлер',
                    section_type: 1,
                    elements: [{id: 0, name: 'Первый', percent: 1000, isUsed: true}, {
                        id: 1,
                        name: 'Второй',
                        percent: 2000
                    }],
                    color: {r: 0, g: 0, b: 0}
                },
                {
                    id: 2,
                    name: 'Бампер передний',
                    section_type: 1,
                    elements: [{id: 0, name: 'Первый', percent: 1000}, {id: 1, name: 'Второй', percent: 2000}]
                },
                {
                    id: 3,
                    name: 'Бампер задний',
                    section_type: 1,
                    elements: [{id: 0, name: 'Первый', percent: 1000}, {id: 1, name: 'Второй', percent: 2000}],
                    isColor: false,
                    isWheelType: false,
                    isWheelTypeValue: false,
                    isColorMod: false
                },
                {id: 4, name: 'Цвет', section_type: 1, elements: [{id: 0, name: 'Цвет', percent: 1000}], isColor: true},
                {
                    id: 16,
                    name: 'Усиление каркаса',
                    section_type: 1,
                    elements: [{id: 0, name: 'Первый', percent: 1000}, {id: 1, name: 'Второй', percent: 2000}]
                },
                {
                    id: 50,
                    name: 'Тонировка',
                    section_type: 1,
                    elements: [{id: 0, name: 'Первый', percent: 1000}, {id: 1, name: 'Второй', percent: 2000}]
                },

            ],
            buyUpgrades: null,
            colorTime: 0,
            shopId: 0,
            vehicleId: 0,
            vehicleCost: 0,
            selectWheels: [0, 0],
            currentWheelsType: 0,
            currentWheelsID: -1,
            wheelMultiplier: 1,
            refHexInput: React.createRef(),
            chipTuningData: handlingConfigs.map(handlingConfig => {
                return { handlingId: handlingConfig.id, value: handlingConfig.minValue }
            })
        };

      this.handleKeyDown = this.handleKeyDown.bind(this);
      this._child = React.createRef<PayBox>();

      CustomEvent.register('lsc:startChip', (
          carName: string,
          tuningData: ChipTuningOption[],
          standardData: ChipTuningOption[],
          cost: number,
          shopId: number,
          vehicleId: number,
      ) => {
          this.setState({
              page: page.TUNING_CHIP, vehicleId,
              shopId, carName, chipTuningData: tuningData
          });

          this.chipTuningCost = cost;
          this.isChipTuning = true;
          this.chipConfigStandard = standardData;
      });

      this.ev = CustomEvent.register('lsc:start', ( lscUpgrade: lscUpgrade[], carName:string, shopId:number, vehicleId:number, vehicleCost:number,
                                                    currentWheelsType:number, currentWheelsID:number, need_repair:boolean, wheelMultiplier:number ) => {
          lscUpgrade.map(( s, id ) => { 
            return s.elements.map( ( fs, idx ) => { 
              if( fs.isUsed == true) {
                lscUpgrade[id].currentElement = idx;
              } 
            } ) })
          let selectWheels:[number, number] = [currentWheelsType, currentWheelsID],
              selectedTuning = lscUpgrade.findIndex( (data) => data.section_type == 1 );
          this.setState({ lscUpgrade, selectedTuning, carName, shopId, vehicleId, vehicleCost, currentWheelsType, currentWheelsID, selectWheels, repair: need_repair?VEHICLE_REPAIR_COST:-1, wheelMultiplier });
      })
    }
    componentDidMount = () => {
      document.addEventListener('keydown', this.handleKeyDown);
    }
    componentWillUnmount = () => {
      document.removeEventListener('keydown', this.handleKeyDown);
      if(this.ev) this.ev.destroy();
    }
    wheelList = ( add: number ) => {
      let selectWheels = this.state.selectWheels;
      if( add < 0 ) {
        let find = -1;
        LSC_WHEELS.find( (data) => selectWheels[0] == data.type ).elements.forEach( (data,id) => { if( data[1] < selectWheels[1] ) find = id; } )
        selectWheels = [ selectWheels[0], LSC_WHEELS.find( (data) => selectWheels[0] == data.type ).elements[ find >= 0 ? find : LSC_WHEELS.find( (data) => selectWheels[0] == data.type ).elements.length-1 ][1] ];
      } else {
        let find = -1;
        find = LSC_WHEELS.find( (data) => selectWheels[0] == data.type ).elements.findIndex( data => data[1] > selectWheels[1] )
        selectWheels = [ selectWheels[0], LSC_WHEELS.find( (data) => selectWheels[0] == data.type ).elements[ find >= 0 ? find : 0 ][1] ];
      }
      this.setState( { selectWheels });
      CustomEvent.triggerClient('lsc:switchWheel', selectWheels[0], selectWheels[1]);
    }
    wheelListType = ( add: number ) => {
      let selectWheels = this.state.selectWheels;
      if( add < 0 ) {
        let find = -1;
        LSC_WHEELS.forEach( (data, id) => { if( data.type < selectWheels[0] ) find = id; });
        selectWheels = [find >= 0 ? LSC_WHEELS[find].type : LSC_WHEELS[ LSC_WHEELS.length - 1 ].type ,
                        LSC_WHEELS[ find >= 0 ? find : LSC_WHEELS.length - 1].elements[0][1] ];
      }
      else {
        let find = -1;
        find = LSC_WHEELS.findIndex( (data, id) => data.type > selectWheels[0] );
        selectWheels = [find >= 0 ? LSC_WHEELS[find].type : LSC_WHEELS[ 0 ].type ,
                        LSC_WHEELS[ find >= 0 ? find : 0].elements[0][1]  ];
      }
      this.setState( { selectWheels });
      CustomEvent.triggerClient('lsc:switchWheel', selectWheels[0], selectWheels[1]);
    }
    elementList = (id:number, add: number) => {
      let lscUpgrade = this.state.lscUpgrade;
      if( add < 0 ) {
        if( !lscUpgrade[id].currentElement ) lscUpgrade[id].currentElement = 0;
        lscUpgrade[id].currentElement --;
        if( lscUpgrade[id].currentElement < 0 ) lscUpgrade[id].currentElement = lscUpgrade[id].elements.length-1;
      } else {
        if( !lscUpgrade[id].currentElement ) lscUpgrade[id].currentElement = 0;
        lscUpgrade[id].currentElement ++;
        if( lscUpgrade[id].elements.length <= lscUpgrade[id].currentElement ) lscUpgrade[id].currentElement = 0;
      }



      CustomEvent.triggerClient('lsc:switchTuning', lscUpgrade[id].id, lscUpgrade[id].elements[lscUpgrade[id].currentElement].id)

      this.setState({lscUpgrade});
    }
    updateTuning = (id:number, next: number ) => {
      CustomEvent.triggerClient('lsc:switchTuningContain', next,
      this.state.lscUpgrade[ id ].id, this.state.lscUpgrade[ id ].elements[this.state.lscUpgrade[ id ].currentElement | 0].id,
      this.state.lscUpgrade[ id ].isColor && this.state.lscUpgrade[ id ].selectColor ?this.state.lscUpgrade[ id ].selectColor.r:null,
      this.state.lscUpgrade[ id ].isColor && this.state.lscUpgrade[ id ].selectColor ?this.state.lscUpgrade[ id ].selectColor.g:null,
      this.state.lscUpgrade[ id ].isColor && this.state.lscUpgrade[ id ].selectColor ?this.state.lscUpgrade[ id ].selectColor.b:null,
      this.state.lscUpgrade[ id ].isColorMod?this.state.lscUpgrade[ id ].selectColorMod:null)
    }

    updateWheel = (id:number, next: number ) => {
      CustomEvent.triggerClient('lsc:switchTuningContainWheel', next,
      this.state.selectWheels[0], this.state.selectWheels[1] );
    }
    handleKeyDown = (e: any) => {
      if( this.state.page != page.TUNING && e.keyCode != 27 ) return;
      switch( e.keyCode ) {
        case 37: 
          return this.state.selectedTuning == WHEEL_ID ? this.wheelList( -1 ) :  this.elementList( this.state.selectedTuning ? this.state.selectedTuning : 0 , -1);
        case 39: 
          return this.state.selectedTuning == WHEEL_ID ? this.wheelList( 1 ) : this.elementList( this.state.selectedTuning ? this.state.selectedTuning : 0 , 1);
        case 83: 
        case 40:{
              let current = this.state.selectedTuning ? this.state.selectedTuning : 0,
                  lscUpgrade = this.state.lscUpgrade,
                  last = this.state.lscUpgrade.length-1;
                  this.state.lscUpgrade.forEach( (data, id) => { if( data.section_type == this.state.selectedType ) last = id;})
              if( this.state.selectedTuning != WHEEL_ID ) {
                if( !lscUpgrade[ this.state.selectedTuning ].elements.find( data => data.isBuy ) ) {
                  lscUpgrade[ this.state.selectedTuning ].selectColor = lscUpgrade[ this.state.selectedTuning ].color;
                  lscUpgrade[ this.state.selectedTuning ].selectColorMod = lscUpgrade[ this.state.selectedTuning ].colorMod;
                  lscUpgrade[ this.state.selectedTuning ].currentElement = lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isUsed ) >= 0 ? lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isUsed ) : 0;
                } else if( lscUpgrade[ this.state.selectedTuning ].currentElement != lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isBuy ) ) {
                  lscUpgrade[ this.state.selectedTuning ].currentElement = lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isBuy ) >= 0 ? lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isBuy ) : 0;
                }
              }
              if( current != WHEEL_ID && current >= last && this.state.selectedType == 1 ) {
                  this.setState( { selectedTuning: WHEEL_ID });
                  this.updateWheel( current , WHEEL_ID );
              } else if( current == WHEEL_ID  && this.state.selectedType == 1  ) {
                  this.setState( { selectedTuning: this.state.lscUpgrade.findIndex( (data) => data.section_type == this.state.selectedType ), selectWheels: this.state.buyWheels ? this.state.buyWheels : [this.state.currentWheelsType, this.state.currentWheelsID ]  });
                  this.updateWheel( WHEEL_ID, this.state.lscUpgrade[ this.state.lscUpgrade.findIndex( (data) => data.section_type == this.state.selectedType )  ].id );
              } else {
                let next:number;
                this.state.lscUpgrade.forEach( (data,id) => { 
                    if( !next && id > current && data.section_type == this.state.selectedType) 
                      next = id; 
                });

                this.updateTuning( current , this.state.lscUpgrade[ next != undefined ? next : this.state.lscUpgrade.findIndex( (data) => data.section_type == this.state.selectedType )  ].id );
                this.setState( { lscUpgrade, selectedTuning:  next != undefined ? next : this.state.lscUpgrade.findIndex( (data) => data.section_type == this.state.selectedType ) });
              }
              return;
        }
        case 87:
        case 38: {
              let current = this.state.selectedTuning ? this.state.selectedTuning : 0,
                  first = this.state.lscUpgrade.findIndex( (data) => data.section_type == this.state.selectedType ),
                  lscUpgrade = this.state.lscUpgrade;
              if( this.state.selectedTuning != WHEEL_ID ) {
                if( !lscUpgrade[ this.state.selectedTuning ].elements.find( data => data.isBuy ) ) {
                  lscUpgrade[ this.state.selectedTuning ].selectColor = lscUpgrade[ this.state.selectedTuning ].color;
                  lscUpgrade[ this.state.selectedTuning ].selectColorMod = lscUpgrade[ this.state.selectedTuning ].colorMod;
                  lscUpgrade[ this.state.selectedTuning ].currentElement = lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isUsed ) >= 0 ? lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isUsed ) : 0;
                } else if( lscUpgrade[ this.state.selectedTuning ].currentElement != lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isBuy ) ) {
                  lscUpgrade[ this.state.selectedTuning ].currentElement = lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isBuy ) >= 0 ? lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isBuy ) : 0;
                }
              }

              if( current != WHEEL_ID && current <= first && this.state.selectedType == 1 ) {
                  this.setState( { selectedTuning: WHEEL_ID });
                  this.updateTuning( current , WHEEL_ID );
              } else if( current == WHEEL_ID  && this.state.selectedType == 1  ) {
                let last = this.state.lscUpgrade.length-1;
                this.state.lscUpgrade.forEach( (data,id) => { 
                    if( data.section_type == this.state.selectedType )
                      last = id;
                });
                this.setState( { selectedTuning: last, selectWheels: this.state.buyWheels ? this.state.buyWheels : [this.state.currentWheelsType, this.state.currentWheelsID ] });
                  this.updateWheel( WHEEL_ID, this.state.lscUpgrade[last].id );
              } else {
                let next:number,
                    last = this.state.lscUpgrade.length-1;
                this.state.lscUpgrade.forEach( (data,id) => { 
                    if( id < current && data.section_type == this.state.selectedType) 
                      next = id; 
                    else if( data.section_type == this.state.selectedType )
                      last = id;
                    console.log( id, current, next);
                });
                this.updateTuning( current , this.state.lscUpgrade[ next ? next : last ].id );
                this.setState( { lscUpgrade, selectedTuning:  next != undefined ? next : last });
              }
              return;
        }
        case 13: {
            if( this.state.selectedTuning == WHEEL_ID ) {
                if( this.state.selectWheels[0] == this.state.currentWheelsType && this.state.selectWheels[1] == this.state.currentWheelsID ) return;
                if( this.state.buyWheels != undefined && this.state.selectWheels[0] == this.state.buyWheels[0] && this.state.selectWheels[1] == this.state.buyWheels[1] )
                    this.setState( { buyWheels: undefined});
                else
                    this.setState( { buyWheels: this.state.selectWheels});
            }
            else if( this.state.selectedTuning >= 0 ) {
                 if( ( this.state.lscUpgrade[ this.state.selectedTuning ].elements[ this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0 ].isUsed  &&
                   ( this.state.lscUpgrade[ this.state.selectedTuning ].isColorMod == undefined || ( !this.state.lscUpgrade[ this.state.selectedTuning ].selectColorMod || this.state.lscUpgrade[ this.state.selectedTuning ].selectColorMod == this.state.lscUpgrade[ this.state.selectedTuning ].colorMod )) &&
                   ( this.state.lscUpgrade[ this.state.selectedTuning ].isColor == undefined || ( !this.state.lscUpgrade[ this.state.selectedTuning ].selectColor || this.state.lscUpgrade[ this.state.selectedTuning ].selectColor == this.state.lscUpgrade[ this.state.selectedTuning ].color )) ) 
                   || this.state.lscUpgrade[ this.state.selectedTuning ].elements[ this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0 ].isBuy == true )  {

                      if( this.state.lscUpgrade[ this.state.selectedTuning ].elements[ this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0 ].isBuy == true ) { 
                          let lscUpgrade = this.state.lscUpgrade;
                          lscUpgrade[ this.state.selectedTuning ].elements[ this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0 ].isBuy = false
                          this.setState({lscUpgrade});    
                          return;                            
                      } 
                  } else {
                    if(this.state.lscUpgrade[ this.state.selectedTuning ].elements[ this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0 ].isBuy != true ) {
                      let lscUpgrade = this.state.lscUpgrade;
                      lscUpgrade[ this.state.selectedTuning ].elements.map( (_,id) => lscUpgrade[ this.state.selectedTuning ].elements[id].isBuy = ( id == ( this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0 ) ? true : false) );
                      this.setState({lscUpgrade});    
                      return;                            
                    }
                }
            }
            return;              
        }
        // case 27:
        //   return this.state.showPay == true ? this.setState( { showPay: false } ): this.closeBuying(true);
      }
    }

    buyTuning = () => {
      let result = this._child.current.canPay(( this.getAllPrice() ))
      if (!result) return;

      this.setState( { showPay: false } );

      if (this.isChipTuning) {
          CustomEvent.triggerServer('lsc:chip:buy', this.state.shopId, this.state.vehicleId, this.state.chipTuningData, result.paytype, result.pin)
      } else {
          let buyUpgrades:buyUpgrades[] = [];
          this.state.lscUpgrade.map(( s ) => { return s.elements.map( ( fs ) => { if( fs.isBuy == true) {
              buyUpgrades.push({id:s.id, color: s.selectColor ? [s.selectColor.r,s.selectColor.g,s.selectColor.b] : null, colorMod: s.selectColorMod ? s.selectColorMod : null , selectedElementID: fs.id });
          } } ) })
          CustomEvent.callServer('lsc:buyTuning', this.state.shopId, this.state.vehicleId, result.paytype, result.pin, JSON.stringify(buyUpgrades),
              this.state.buyWheels ? this.state.buyWheels[0] : -500 , this.state.buyWheels ? this.state.buyWheels[1] : -500  ).then(status => {
              if (status) this.setState( { showPay: false } ) //this._child.current.getError(status);
              else this.closeBuying();
          })
      }

      return;
    }
    
    closeBuying = (sendServer?:boolean) => {
      CustomEvent.triggerClient('lsc:stop', sendServer);
      CEF.gui.setGui(null);
    }
    getWheelPrice = ( type:number ) => {
      let price = 0;
      if( LSC_WHEELS.find( data => data.type == type ) ) 
        price = convertModCostFromCarCost( LSC_WHEELS.find( data => data.type == type ).percent, this.state.vehicleCost);
      return price;
    }
    getAllPrice = () => {
        if (this.isChipTuning) {
            return this.chipTuningCost;
        }

      let price = 0;
      this.state.lscUpgrade.map(data => data.elements.map( f => { if( f.isBuy == true ) {
          price += convertModCostFromCarCost(f.percent, this.state.vehicleCost)
      } } ))
      if( this.state.buyWheels != undefined ) price += this.getWheelPrice( this.state.buyWheels[0] );
      return price;
    }
    changeColor = (e:any, type?: any) => {
      let lscUpgrade = this.state.lscUpgrade;
      let upgrade = lscUpgrade [ this.state.selectedTuning ]
      lscUpgrade[ this.state.selectedTuning ].elements[ this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0 ].isBuy = false;
      lscUpgrade[ this.state.selectedTuning ? this.state.selectedTuning : 0 ].selectColor = e.rgb;
      let time = new Date().getTime(),
          colorTime = this.state.colorTime;
      if( time > colorTime + 200) {
        CustomEvent.triggerClient('lsc:switchTuningColor', upgrade.id, e.rgb.r, e.rgb.g, e.rgb.b);//upgrade.elements[upgrade.currentElement].id)
        colorTime = time;
      }
      if (!type) this.setHexValue(e.rgb);
      this.setState({lscUpgrade, colorTime});
    }

    setHexValue(rgb: any) {
        let hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
        this.state.refHexInput.current.value = hex;
    }

    onChangeHexInput = () => {
        let rgb = this.hexToRgb(this.state.refHexInput.current.value);

        if (rgb === null) return;

        let e: any = {rgb};

        this.changeColor(e, true);
    }

    hexToRgb(hex: string) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    componentToHex(c: number) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    rgbToHex(r: number, g: number, b: number) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    getHexValue() {
        let rgb = this.state.lscUpgrade[ this.state.selectedTuning ].selectColor ?
            this.state.lscUpgrade[ this.state.selectedTuning ].selectColor : ( this.state.lscUpgrade[ this.state.selectedTuning ].color ? this.state.lscUpgrade[ this.state.selectedTuning ].color : {r: 0, g: 0, b: 0} );

        return this.rgbToHex(rgb.r, rgb.g, rgb.b);
    }

    round(func: (x: number) => number, value: number) {
        return func(value * 100) / 100;
    }

    handleInputChange(newValue: number, handlingId: number) {
        const option = this.state.chipTuningData.find(qOption => qOption.handlingId === handlingId);

        if (newValue === option.value) {
            return;
        }

        option.value = newValue;

        this.setState({
            chipTuningData: this.state.chipTuningData
        });
    }

    resetChipToStandard() {
        this.setState({
            chipTuningData: this.chipConfigStandard.map(config => ({ ...config }))
        });
    }

    render = () => {
        switch( this.state.page) {
          case page.REPAIR:
              return <>
                <div className="lsc-step-zero animated fadeIn">
                    <i className="lsc-fly-smoke animated fadeInUp waiteone"><img src={png['smoke-bottom']} alt=""/></i>
                    <i className="lsc-fly-key animated fadeInLeft waiteone"><img src={png['repair-key']} alt=""/></i>
                    <i className="lsc-fly-turbo animated fadeIn waiteone"><img src={png['tuning-turbo']} alt=""/></i>
                    { this.state.repair < 0 ? 
                      <button className="lsc-repair-car disabled animated fadeInLeft">
                          <h3>Транспорт<br />починен</h3>
                          <p>Вам не требуется ремонт</p>
                      </button> : 
                      <button className="lsc-repair-car animated fadeInLeft" onClick={()=> {
                        /* Ремонт */

                        CustomEvent.callServer('vehicle:lsc:repair', this.state.shopId).then((r) => {
                            if(r) {
                                CustomEvent.triggerClient('lsc:healthed')
                                this.setState( { repair: -1 } );
                            }
                        });
                      }}>
                            <h3>Ремонт<br />транспорта</h3>
                            <p>Почините транспорт прежде чем делать тюнинг</p>
                            <div>${this.state.repair}</div>
                      </button>
                    }

                    <button className={`lsc-repair-car lsc-tuning-car animated fadeInRight${this.state.repair >= 0 ? ' disabled' : ''}`} onClick={()=> {
                      if(this.state.repair < 0) this.setState( { page: page.TUNING } );
                    }}>
                        <h3>Тюнинг</h3>
                    </button>
                </div>
              </>
          case page.TUNING_CHIP:
              return <>
                  <section className="los-santos-customs animated fadeIn">
                      <div className="lsc-left-flexer animated fadeInLeft">
                          <div className="lsc-topline">
                              <div className="lsc-logo"><img src={png['lsc-logo']} alt=""/></div>
                              <button className="lsc-buy-button" onClick={() => this.resetChipToStandard()}>
                                  <p><strong>Сбросить</strong><br />к заводским</p>
                              </button>
                              <button className="lsc-buy-button" onClick={()=> {
                                  this.setState( { page: page.BUY } );
                              }}><img src={svg['price']} alt=""/>
                                  <p><strong>Перейти</strong><br />к оплате</p>
                              </button>
                              <div className="lsc-count-size">
                                  <p>Итого</p>
                                  <p><strong>${systemUtil.numberFormat(this.getAllPrice())}</strong></p>
                              </div>
                          </div>

                          <div className="lsc-left-tabs-content active">
                              <div className="lsc-left-tab-inner">
                              {this.state.chipTuningData
                                  .filter(option => handlingConfigs.some(config => config.id === option.handlingId))
                                  .map(option => {
                                  const handlingConfig = handlingConfigs.find(cfg => cfg.id === option.handlingId);
                                  return <>
                                      <div className="lsc-list-item">
                                          <div>
                                              <p>{handlingConfig.name}</p>
                                          </div>
                                          <div className="lsc-slider">
                                              <LscChipSlider
                                                 min={handlingConfig.minValue}
                                                 max={handlingConfig.maxValue}
                                                 step={handlingConfig.step}
                                                 value={option.value}
                                                 onChange={(event, value: number) => this.handleInputChange(value, option.handlingId)}
                                              />
                                          </div>
                                      </div>
                                  </>
                              })}
                              </div>
                          </div>
                      </div>

                      <div className="lsc-car-stats animated fadeIn waitetwo">
                          <p>{this.state.carName}</p>
                      </div>

                      <div className="lsc-colorizer-wrapper animated fadeIn waitetwo">
                          <div className="lsc-mouse-info">
                              <p><span>Удерживайте ЛКМ</span><br />чтобы вращать камеру</p>
                              <img src={svg['mouse-LKM']} alt=""/>
                          </div>
                          <div className="lsc-mouse-info">
                              <p><span>удерживайте ПКМ</span><br />приблизить или отдалить</p>
                              <img src={svg['mouse-RKM']} alt=""/>
                          </div>
                      </div>
                  </section>
              </>
          case page.TUNING:
//              console.log(  `rgb(${this.state.lscUpgrade[ this.state.selectedTuning ].selectColor.r, this.state.lscUpgrade[ this.state.selectedTuning ].selectColor.g,this.state.lscUpgrade[ this.state.selectedTuning ].selectColor.b})` )
              return <>
                <section className="los-santos-customs animated fadeIn">
                  <div className="lsc-left-flexer animated fadeInLeft">
                    <div className="lsc-topline">
                        <div className="lsc-logo"><img src={png['lsc-logo']} alt=""/></div>
                        <button className="lsc-buy-button" onClick={()=> {
                          if( this.getAllPrice() < 1 ) return;
                          this.setState( { page: page.BUY } );
                        }}><img src={svg['price']} alt=""/>
                            <p><strong>Перейти</strong><br />к оплате</p>
                        </button>
                        <div className="lsc-count-size">
                            <p>Итого</p>
                            <p><strong>${systemUtil.numberFormat(this.getAllPrice())}</strong></p>
                        </div>
                    </div>
                    <ul className="lsc-left-tabs">
                      { LSC_SECTION_TYPES.map( (data, id) => {
                        return <li key={id} className={ data.id == this.state.selectedType ? "active" : ""} aria-label={data.name} data-microtip-position="top" role="tooltip"><a onClick={()=>{
                          if( this.state.selectedType == data.id ) return;
                          if( this.state.selectedTuning == WHEEL_ID ) 
                            this.updateWheel( WHEEL_ID, this.state.lscUpgrade.findIndex( (s) => s.section_type == data.id ) >= 0 ? this.state.lscUpgrade[ this.state.lscUpgrade.findIndex( (s) => s.section_type == data.id ) ].id : null);
                          else if( this.state.selectedTuning >= 0 ) {
                            let lscUpgrade = this.state.lscUpgrade;
                            if( !lscUpgrade[ this.state.selectedTuning ].elements.find( data => data.isBuy ) ) {
                                lscUpgrade[ this.state.selectedTuning ].selectColor = lscUpgrade[ this.state.selectedTuning ].color;
                                lscUpgrade[ this.state.selectedTuning ].selectColorMod = lscUpgrade[ this.state.selectedTuning ].colorMod;
                                lscUpgrade[ this.state.selectedTuning ].currentElement = lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isUsed ) >= 0 ? lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isUsed ) : 0;
                            } else if( lscUpgrade[ this.state.selectedTuning ].currentElement != lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isBuy ) ) {
                                lscUpgrade[ this.state.selectedTuning ].currentElement = lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isBuy ) >= 0 ? lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isBuy ) : 0;
                            }
                            this.updateTuning( this.state.selectedTuning, this.state.lscUpgrade.findIndex( (s) => s.section_type == data.id ) >= 0 ? this.state.lscUpgrade[ this.state.lscUpgrade.findIndex( (s) => s.section_type == data.id ) ].id : null );
                          }
                          this.setState({selectedType:data.id, selectedTuning: this.state.lscUpgrade.findIndex( (s) => s.section_type == data.id ) })
                        }}><img src={svg[data.imgName]} alt=""/></a></li>
                      })} 
                    </ul>
                    <div className="lsc-left-tabs-content active">
                      <div className="lsc-left-tab-inner">
                          {this.state.lscUpgrade.map( (data, id)=> {
                              if( data.section_type != this.state.selectedType ) return;
                              return <div className={`lsc-list-item${ id == this.state.selectedTuning ? " active":""}`} key={id} onClick={()=>{
                                      if( this.state.selectedTuning != id ) { 
                                          let lscUpgrade = this.state.lscUpgrade;
                                          if( this.state.selectedTuning == WHEEL_ID ) {
                                            this.updateWheel( WHEEL_ID, this.state.lscUpgrade[id].id );
                                            this.setState({selectedTuning:id, lscUpgrade, selectWheels: this.state.buyWheels ? this.state.buyWheels : [this.state.currentWheelsType, this.state.currentWheelsID ] });
                                            return;
                                          } else if( !lscUpgrade[ this.state.selectedTuning ].elements.find( data => data.isBuy ) ) {
                                            lscUpgrade[ this.state.selectedTuning ].selectColor = lscUpgrade[ this.state.selectedTuning ].color;
                                            lscUpgrade[ this.state.selectedTuning ].selectColorMod = lscUpgrade[ this.state.selectedTuning ].colorMod;
                                            lscUpgrade[ this.state.selectedTuning ].currentElement = lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isUsed ) >= 0 ? lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isUsed ) : 0;
                                          } else if( lscUpgrade[ this.state.selectedTuning ].currentElement != lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isBuy ) ) {
                                            lscUpgrade[ this.state.selectedTuning ].currentElement = lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isBuy ) >= 0 ? lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isBuy ) : 0;
                                          }
                                          let current = this.state.selectedTuning ? this.state.selectedTuning : 0;
                                          this.updateTuning( current, this.state.lscUpgrade[id].id );
                                          this.setState({selectedTuning:id, lscUpgrade});
                                      }
                                    }}>      
                                <div>
                                    <img src={svg[`tuning-item-${data.id}`]} alt=""/>
                                    <p>{data.name}</p>
                                </div>
                                { data.elements && data.isColor !== true ? 
                                <div className="lsc-slide-enter">
                                    { data.elements.length > 1 ? <div onClick={ ()=> this.elementList(id,-1)}><img src={svg['left-arrow-short']} alt=""/></div> : null }
                                    <p>{data.elements[ this.state.lscUpgrade[id].currentElement? this.state.lscUpgrade[id].currentElement : 0 ].name}
                                       {data.elements[ this.state.lscUpgrade[id].currentElement? this.state.lscUpgrade[id].currentElement : 0 ].isUsed ? <br/> : ""}
                                       {data.elements[ this.state.lscUpgrade[id].currentElement? this.state.lscUpgrade[id].currentElement : 0 ].isUsed ? "Установлен" : ""}</p> 
                                       { data.elements.length > 1 ? <div onClick={ ()=> this.elementList(id, 1)}><img src={svg['right-arrow-short']} alt=""/></div> : null }
                                </div> 
                                :
                                ( data.isColor ? 
                                <div className="lsc-color-right" style={{backgroundColor: ( data.selectColor ? `rgb(${data.selectColor.r},${data.selectColor.g},${data.selectColor.b})` : ( data.color ? `rgb(${data.color.r},${data.color.g},${data.color.b})` : `rgb(0,0,0)` )) }}></div> : null )
                                } 
                            </div>
                          }) }
                          { ( this.state.currentWheelsType == null || this.state.selectedType != 1 ) ? null :
                          <div className={`lsc-list-item${ WHEEL_ID == this.state.selectedTuning ? " active":""}`} key={WHEEL_ID} onClick={()=>{
                            if( this.state.selectedTuning != WHEEL_ID ) { 
                              let lscUpgrade = this.state.lscUpgrade;
                              if( !lscUpgrade[ this.state.selectedTuning ].elements.find( data => data.isBuy ) ) {
                                lscUpgrade[ this.state.selectedTuning ].selectColor = lscUpgrade[ this.state.selectedTuning ].color;
                                lscUpgrade[ this.state.selectedTuning ].selectColorMod = lscUpgrade[ this.state.selectedTuning ].colorMod;
                                lscUpgrade[ this.state.selectedTuning ].currentElement = lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isUsed ) >= 0 ? lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isUsed ) : 0;
                              } else if( lscUpgrade[ this.state.selectedTuning ].currentElement != lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isBuy ) ) {
                                lscUpgrade[ this.state.selectedTuning ].currentElement = lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isBuy ) >= 0 ? lscUpgrade[ this.state.selectedTuning ].elements.findIndex( data => data.isBuy ) : 0;
                              }
                              let current = this.state.selectedTuning ? this.state.selectedTuning : 0;
                              // this.updateWheel( current, WHEEL_ID );
                              this.updateTuning( current, this.state.lscUpgrade[this.state.selectedTuning].id );
                              this.setState({selectedTuning:WHEEL_ID, lscUpgrade});
                            }
                          }}>
                              <div>
                                <img src={svg[`tuning-item-${WHEEL_ID}`]} alt=""/>
                                <p>Колёса</p>
                              </div>
                              <div>
                                <div className="lsc-slide-enter" style={{marginBottom: '0.5vw'}}>
                                    <div onClick={ ()=> this.wheelListType(-1)}><img src={svg['left-arrow-short']} alt=""/></div>
                                    <p>{LSC_WHEELS.find( (data) => data.type == this.state.selectWheels[0] ).name}</p>
                                    <div onClick={ ()=> this.wheelListType(1)}><img src={svg['right-arrow-short']} alt=""/></div>
                                </div>
                                <div className="lsc-slide-enter">
                                    <div onClick={ ()=> this.wheelList(-1)}><img src={svg['left-arrow-short']} alt=""/></div>
                                    <p>{LSC_WHEELS.find( (data) => data.type == this.state.selectWheels[0] ).elements.find( (data) => data[1] == this.state.selectWheels[1] )[0]}</p>
                                    <div onClick={ ()=> this.wheelList(1)}><img src={svg['right-arrow-short']} alt=""/></div>
                                </div>
                              </div>

                          </div> }
                        </div>
                      </div>
                  </div>    
                  {this.state.selectedTuning == WHEEL_ID  ? 
                    <div className="lsc-buy-line-wrapper animated fadeIn waiteone">
                      <div className="lsc-buy-line">
                        {this.state.selectWheels[0] == this.state.currentWheelsType && this.state.selectWheels[1] == this.state.currentWheelsID ?
                          <div className="lsc-count-size">
                            <p><strong>Установлено</strong></p>
                            <p>Колёса</p>
                          </div>
                        :  (
                          <>
                            {this.state.buyWheels != undefined && this.state.selectWheels[0] == this.state.buyWheels[0] && this.state.selectWheels[1] == this.state.buyWheels[1] ?
                            <button className="lsc-button-cube long" onClick={()=> {
                              this.setState( { buyWheels: undefined});
                            } }>
                               <img src={svg['card-delete']} alt=""/>
                               <p>Удалить из корзины</p>
                            </button>:
                            <button className="lsc-button-orange" onClick={()=> {
                              this.setState( { buyWheels: this.state.selectWheels});
                            } }>
                                <img src={svg['card-add']} alt=""/>
                                <p>В корзину</p>
                            </button> }
                            <div className="lsc-count-size">
                              <p><strong>${systemUtil.numberFormat(this.getWheelPrice( this.state.selectWheels[0] ))}</strong></p>
                              <p>Колёса</p>
                            </div> 
                          </>
                          )
                        }
                      </div>
                    </div>
                  : null }         
                  {this.state.selectedTuning >= 0 && this.state.selectedTuning != WHEEL_ID ?  
                    <div className="lsc-buy-line-wrapper animated fadeIn waiteone">
                      <div className="lsc-buy-line">
                         { ( this.state.lscUpgrade[ this.state.selectedTuning ].elements[ this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0 ].isUsed  &&
                           ( this.state.lscUpgrade[ this.state.selectedTuning ].isColorMod == undefined || ( !this.state.lscUpgrade[ this.state.selectedTuning ].selectColorMod || this.state.lscUpgrade[ this.state.selectedTuning ].selectColorMod == this.state.lscUpgrade[ this.state.selectedTuning ].colorMod )) &&
                           ( this.state.lscUpgrade[ this.state.selectedTuning ].isColor == undefined || ( !this.state.lscUpgrade[ this.state.selectedTuning ].selectColor || this.state.lscUpgrade[ this.state.selectedTuning ].selectColor == this.state.lscUpgrade[ this.state.selectedTuning ].color )) ) 
                           || this.state.lscUpgrade[ this.state.selectedTuning ].elements[ this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0 ].isBuy == true 
                           ?
                            ( this.state.lscUpgrade[ this.state.selectedTuning ].elements[ this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0 ].isBuy == true ? 
                            <button className="lsc-button-cube long" onClick={()=> {
                              if(this.state.lscUpgrade[ this.state.selectedTuning ].elements[ this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0 ].isBuy == true ) {
                                let lscUpgrade = this.state.lscUpgrade;
                                lscUpgrade[ this.state.selectedTuning ].elements[ this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0 ].isBuy = false
                                this.setState({lscUpgrade});    
                                return;                            
                              }
                              CustomEvent.triggerClient('lsc:delete', this.state.lscUpgrade[ this.state.selectedTuning ].id );
                            }}>
                                <img src={svg['card-delete']} alt=""/>
                                <p>{ this.state.lscUpgrade[ this.state.selectedTuning ].elements[ this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0 ].isBuy == true  ? "Удалить из корзины" : "Удалить" }</p>
                            </button> : null )
                            : this.state.lscUpgrade[ this.state.selectedTuning ].available
                                ? <button className="lsc-button-orange" onClick={()=> {
                                      if(this.state.lscUpgrade[ this.state.selectedTuning ].elements[ this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0 ].isBuy != true ) {
                                        let lscUpgrade = this.state.lscUpgrade;
                                        lscUpgrade[ this.state.selectedTuning ].elements.map( (_,id) => lscUpgrade[ this.state.selectedTuning ].elements[id].isBuy = ( id == ( this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0 ) ? true : false) );
                                        this.setState({lscUpgrade});
                                        console.log(systemUtil.numberFormat( convertModCostFromCarCost(this.state.lscUpgrade[ this.state.selectedTuning ].elements[ this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0  ].percent, this.state.vehicleCost)))
                                        console.log(this.state.lscUpgrade[ this.state.selectedTuning ].elements[ this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0  ].percent)
                                        console.log(this.state.vehicleCost)
                                        return;
                                      }
                                    }}>
                                    <img src={svg['card-add']} alt=""/>
                                    <p>В корзину</p>
                                </button>
                             : <button className="lsc-button-gray">
                                     <img src={svg['card-add']} alt=""/>
                                     <p>Товар закончился</p>
                             </button>
                          }
                          <div className="lsc-count-size">
                             { ( this.state.lscUpgrade[ this.state.selectedTuning ].elements[ this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0 ].isUsed  &&
                           ( this.state.lscUpgrade[ this.state.selectedTuning ].isColorMod == undefined || ( !this.state.lscUpgrade[ this.state.selectedTuning ].selectColorMod || this.state.lscUpgrade[ this.state.selectedTuning ].selectColorMod == this.state.lscUpgrade[ this.state.selectedTuning ].colorMod )) &&
                           ( this.state.lscUpgrade[ this.state.selectedTuning ].isColor == undefined || ( !this.state.lscUpgrade[ this.state.selectedTuning ].selectColor || this.state.lscUpgrade[ this.state.selectedTuning ].selectColor == this.state.lscUpgrade[ this.state.selectedTuning ].color )) ) ? 
                             <p><strong>Установлено</strong></p>
                             :
                             <p><strong>${systemUtil.numberFormat( convertModCostFromCarCost(this.state.lscUpgrade[ this.state.selectedTuning ].elements[ this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0  ].percent, this.state.vehicleCost))}</strong></p>
                            }
                            <p>{ this.state.lscUpgrade[ this.state.selectedTuning ].elements[ this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0 ].name}</p>
                          </div>
                      </div>
                    </div> : null
                  }
                  <div className="lsc-car-stats animated fadeIn waitetwo">
                      <p>{this.state.carName}</p>
                  </div>

                  <div className="lsc-colorizer-wrapper animated fadeIn waitetwo">
                    <div className="lsc-mouse-info">
                        <p><span>Удерживайте ЛКМ</span><br />чтобы вращать камеру</p>
                        <img src={svg['mouse-LKM']} alt=""/>
                    </div>
                    <div className="lsc-mouse-info">
                        <p><span>удерживайте ПКМ</span><br />приблизить или отдалить</p>
                        <img src={svg['mouse-RKM']} alt=""/>
                    </div>
                    {this.state.selectedTuning >= 0 && this.state.selectedTuning != WHEEL_ID && this.state.lscUpgrade[ this.state.selectedTuning].isColorMod ?
                    <div className="lsc-slide-enter">
                        <div onClick={()=> {
                          let lscUpgrade = this.state.lscUpgrade;
                          let upgrade = lscUpgrade[ this.state.selectedTuning ]
                          if( lscUpgrade[ this.state.selectedTuning ].selectColorMod === undefined ) lscUpgrade[ this.state.selectedTuning ].selectColorMod = lscUpgrade[ this.state.selectedTuning ].colorMod;
                          let idx = LSC_COLOR_MODS.findIndex( (data) => data.index === lscUpgrade[ this.state.selectedTuning ].selectColorMod ),
                              next, 
                              find = -1;
                          LSC_COLOR_MODS.forEach( (_, id) => { if( id < idx ) find = id; });
                          if( find < 0 ) next = LSC_COLOR_MODS[ LSC_COLOR_MODS.length-1 ];
                          else next = LSC_COLOR_MODS[find];
                          lscUpgrade[ this.state.selectedTuning ].elements[ this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0 ].isBuy = false;
//                          lscUpgrade[ this.state.selectedTuning ].selectColorMod = ( next ? next.index : LSC_COLOR_MODS[ LSC_COLOR_MODS.length-1 ].index);
                          lscUpgrade[ this.state.selectedTuning ].selectColorMod  = next.index;
                          console.log( idx, lscUpgrade[ this.state.selectedTuning ].selectColorMod )
                          this.setState({lscUpgrade});
                          CustomEvent.triggerClient('lsc:switchTuningColorMod', upgrade.id, lscUpgrade[ this.state.selectedTuning ].selectColorMod)
                          return; 
                        }}><img src={svg['left-arrow-short']} alt=""/></div>
                        <p>{LSC_COLOR_MODS.find( (data) => data.index === ( this.state.lscUpgrade[ this.state.selectedTuning ].selectColorMod != undefined ? 
                                                                         this.state.lscUpgrade[ this.state.selectedTuning ].selectColorMod : this.state.lscUpgrade[ this.state.selectedTuning].colorMod) ).name}</p>
                        <div onClick={()=> {
                          let lscUpgrade = this.state.lscUpgrade;
                          let upgrade = lscUpgrade[ this.state.selectedTuning]
                          if( lscUpgrade[ this.state.selectedTuning ].selectColorMod === undefined ) lscUpgrade[ this.state.selectedTuning ].selectColorMod = lscUpgrade[ this.state.selectedTuning ].colorMod; 
                          let idx = LSC_COLOR_MODS.findIndex( (data) => data.index === lscUpgrade[ this.state.selectedTuning ].selectColorMod );
                          let next = LSC_COLOR_MODS.find( (_, id) => id > idx );
                          lscUpgrade[ this.state.selectedTuning ].elements[ this.state.lscUpgrade[ this.state.selectedTuning ].currentElement | 0 ].isBuy = false;
                          lscUpgrade[ this.state.selectedTuning ].selectColorMod = ( next ? next.index : LSC_COLOR_MODS[0].index);
                          this.setState({lscUpgrade});
                          CustomEvent.triggerClient('lsc:switchTuningColorMod', upgrade.id, lscUpgrade[ this.state.selectedTuning ].selectColorMod)
                          return; 
                        }}><img src={svg['right-arrow-short']} alt=""/></div>
                    </div> : null }
                    {this.state.selectedTuning >= 0 && this.state.selectedTuning != WHEEL_ID && this.state.lscUpgrade[ this.state.selectedTuning].isColor ?
                      <div className="lsc-rgb-wrap">
                        <ColorPickerWrapped color={ this.state.lscUpgrade[ this.state.selectedTuning ].selectColor ? 
                                                      this.state.lscUpgrade[ this.state.selectedTuning ].selectColor : ( this.state.lscUpgrade[ this.state.selectedTuning ].color ? this.state.lscUpgrade[ this.state.selectedTuning ].color : {r: 0, g: 0, b: 0} ) } 
                                                    onChange={(e:any) => this.changeColor(e)} 
                                                    onChangeComplete={(e:any) => this.changeColor(e)}/>
                          <div className="inputForHex">
                              <span>Впишите номер цвета</span>
                              <input type="text" ref={this.state.refHexInput} onChange={() => this.onChangeHexInput()}/>
                          </div>
                      </div>: null }
                  </div>
                </section>
              </>
          case page.BUY:
            return <>
              <section className="los-santos-customs price-list-background animated fadeIn">
                  { this.state.showPay && this.state.showPay === true ? 
                            <div className="shop_paybox">
                                <div className="shop_paybox_box">
                                    <PayBox ref={this._child} />
                                    <div className="shop_buy" onClick={this.buyTuning} >
                                        <img src={check}/>Оплатить
                                    </div>
                                </div>
                            </div>
                        : null }
                  <div className="lsc-left-flexer animated fadeInLeft waiteone">
                      <div className="lsc-topline">
                          <div className="lsc-logo"><img src={png['lsc-logo']} alt=""/></div>
                      </div>
                  </div>
                  {!this.isChipTuning && <div className="lsc-go-back animated fadeInLeft waiteone">
                      <button className="lsc-button-cube long" onClick={() => {
                          this.setState({page: page.TUNING});
                      }}>
                          <img src={svg['fi_package']} alt=""/>
                          <p>Вернуться к тюнингу</p>
                      </button>
                  </div>}
                  <div className="lsc-check-list animated fadeInUp waiteone">
                      <img src={svg['price']} alt=""/>
                      <div className="lsc-count-size">
                          <p>Итого</p>
                          <p><strong>${systemUtil.numberFormat(this.getAllPrice())}</strong></p>
                      </div>
                      <div className="lsc-left-tab-inner-check">
                        {this.state.lscUpgrade.map((data,id) => { return data.elements.map( (f,idx) => { if( f.isBuy == true ) 
                          return <div className="lsc-list-item" key={id}>
                                    <div>
                                        <img src={svg[`tuning-item-${data.id}`]} alt=""/>
                                        <p>{data.name} {f.name}</p>
                                    </div>
                                    <div className="price-info">
                                        <p>${systemUtil.numberFormat(convertModCostFromCarCost(f.percent, this.state.vehicleCost))}</p>
                                        <button className="lsc-button-cube" onClick={()=> {
                                          let lscUpgrade = this.state.lscUpgrade,
                                              _all = 0;
                                          lscUpgrade[id].elements[idx].isBuy = false;
                                          if( lscUpgrade[id].isColor ) 
                                            lscUpgrade[id].selectColor = ( lscUpgrade[id].color ? lscUpgrade[id].color : {r: 0, g: 0, b: 0} );
                                          else {
                                            let _used: boolean;
                                            lscUpgrade[id].elements.map( ( fs,idx ) => { if( fs.isUsed == true) { _used = true; lscUpgrade[id].currentElement = idx; } } )
                                            if( _used !== true ) lscUpgrade[id].currentElement = 0;
                                          }
                                          lscUpgrade.map(( s ) => { return s.elements.map( ( fs ) => { if( fs.isBuy == true) _all ++ } ) })
                                          this.setState({lscUpgrade, page: ( _all || this.state.buyWheels != undefined ) > 0 ? page.BUY: page.TUNING});  
                                          this.updateTuning( id, lscUpgrade[id].id );
                                        }}>
                                            <img src={svg['card-delete']} alt=""/>
                                        </button>
                                    </div>
                                 </div>
                          } ) } ) }
                          { this.state.buyWheels != undefined ? 
                            <div className="lsc-list-item" key={WHEEL_ID}>
                                <div>
                                    <img src={svg[`tuning-item-${WHEEL_ID}`]} alt=""/>
                                    <p>Колёса {LSC_WHEELS.find( (data) => data.type == this.state.buyWheels[0] ).name} {LSC_WHEELS.find( (data) => data.type == this.state.buyWheels[0] ).elements.find( data => data[1] == this.state.buyWheels[1])[0]}</p>
                                </div>
                                <div className="price-info">
                                  <p>${systemUtil.numberFormat(this.getWheelPrice( this.state.buyWheels[0] ))}</p>
                                  <button className="lsc-button-cube" onClick={()=> {
                                    let lscUpgrade = this.state.lscUpgrade,
                                        _all = 0;
                                    lscUpgrade.map(( s ) => { return s.elements.map( ( fs ) => { if( fs.isBuy == true) _all ++ } ) })
                                    this.setState({lscUpgrade, page: ( _all ) > 0 ? page.BUY: page.TUNING, buyWheels: undefined, selectWheels: [this.state.currentWheelsType, this.state.currentWheelsID ] });  
                                    this.updateWheel( WHEEL_ID, WHEEL_ID );
                                  }}>
                                      <img src={svg['card-delete']} alt=""/>
                                  </button>
                                </div>
                            </div>
                          : null }
                      </div>
                  </div>
                  <div className="lsc-price-end animated fadeInLeft waiteone">
                    <div className="lsc-car-stats">
                        <p>{this.state.carName}</p>
                    </div>
                    <button className="lsc-button-orange" onClick={ ()=> this.setState({showPay:true})}>
                        <img src={svg['card-add']} alt=""/>
                        <p>Оплатить покупку</p>
                    </button>
                </div>

              </section>
            </>
        }
    }
}



export class ColorPicker extends React.Component< { hex?:string, hsl?:HSLColor, rgb?:RGBColor, onChange: (e:any) => void } > {
  render() {
    return (
      <div className="lsc_colorpick">
        <div className="lsc_colorbox">
          <Saturation
            {...this.props}
            onChange={this.props.onChange}
            pointer={()=>Picker(0)}
            color={this.props.rgb}
          />
        </div>
        <div className="lsc_colorhui" >
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
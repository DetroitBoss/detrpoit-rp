import React from 'react';
import './assets/fuel.less';
import bg from './assets/bg.svg';
import bge from './assets/bge.svg';
import filling from './assets/filling.png';
import {createStyles, Slider, withStyles} from '@material-ui/core';
import {PayBox} from '../PayBox/PayBox';
import {CustomEvent} from '../../modules/custom.event';
import {CustomEventHandler} from '../../../shared/custom.event';
import {CEF} from '../../modules/CEF';
import {fuelTypeNames, VEHICLE_FUEL_TYPE} from '../../../shared/vehicles';
import {systemUtil} from '../../../shared/system';


export class Fuel extends React.Component<{}, {
    show: boolean;
    /** Название */
    fuelName: string;
    /** типы из fuelTypeNames */
    fuelTypes: Array<VEHICLE_FUEL_TYPE>;
    /** цена за литр */
    fuelPrice: Array<number>;
    /** Литров */
    fuelFilling: number;
    /** Стоимость */
    fuelCost: number;
    /** Стоимость канистры */
    canisterPrice: number;
    /** Текущее кол-во топлива*/
    fuelMin: number;
    /** Максимальное кол-во топлива*/
    fuelMax: number;

    fuelSelectType: number;
    fuelSelectPay: number;
    /** ИД бизнеса */
    id: number;
    // allowedFuel?: VEHICLE_FUEL_TYPE,
    catalog?: {
        item: VEHICLE_FUEL_TYPE;
        price: number;
        count: number;
        max_count: number;
    }[]
}> {
    ev: CustomEventHandler;
    _child: React.RefObject<PayBox>;
    constructor(props: any) {
        super(props);
        this.state = {
            id: 0,
            show: CEF.test,
            fuelName: 'GASOLINE',
            fuelTypes: CEF.test ? [VEHICLE_FUEL_TYPE.ELECTRO, VEHICLE_FUEL_TYPE.A95, VEHICLE_FUEL_TYPE.A92, VEHICLE_FUEL_TYPE.DISEL] : [],
            fuelPrice: [10, 11, 12, 13],
            fuelFilling: 10,
            fuelCost: 10,
            canisterPrice: 0,
            fuelMin: 25,
            fuelMax: 100,
            fuelSelectType: 0,
            fuelSelectPay: 0
        };
        this.ev = CustomEvent.register('fuel:open', (electro: boolean, catalog: {
            item: VEHICLE_FUEL_TYPE;
            price: number;
            count: number;
            max_count: number;
        }[], id: number, name: string, current: number, max: number) => {
            let qcatalog = catalog.filter(itm => {
                if(electro && itm.item === VEHICLE_FUEL_TYPE.ELECTRO) return true;
                if(!electro && itm.item !== VEHICLE_FUEL_TYPE.ELECTRO) return true;
                return false;
            })
            this.setState({ catalog, show: true, fuelName: name, fuelTypes: qcatalog.map(q => q.item), fuelPrice: qcatalog.map(q => q.price), fuelMin: Math.min(Math.floor(current), max), fuelFilling: Math.min(Math.floor(current), max), fuelMax: max, id}, () => {
                this.setFuel(Math.min(Math.floor(current), max))
            })
        })
        this._child = React.createRef<PayBox>();
    }
    clickPay = () => {
        let result = this._child.current.canPay((this.state.fuelPrice[this.state.fuelSelectType] * this.state.fuelFilling))
        if (!result) return;
        CustomEvent.callServer('fuel:add', this.state.id, this.state.fuelFilling, result.paytype, result.pin, this.isEletro(), this.state.fuelTypes[this.state.fuelSelectType]).then(status => {
            if (status) this._child.current.getError(status);
            else CEF.gui.setGui(null);
        })
    }
    setFuel = (value: number) => {
        value = Math.floor(value);
        if (value < this.state.fuelMin) return 1;
        this.setState({ ...this.state, fuelFilling: (value - this.state.fuelMin) })
    }
    isEletro = () => {
        if (this.state.fuelTypes[0] == VEHICLE_FUEL_TYPE.ELECTRO) return true;
        return false;
    }

    render() {
        if (!this.state.show) return null;
        return <div className="fuel_browser">
            <div className="fuel_blur" />
            <div className="fuel_grid" />
            <div className="fuel_main">
                <div className="fuel_s_left">
                    {AddSlider(this.isEletro(), (this.state.fuelFilling + this.state.fuelMin), this.state.fuelPrice[this.state.fuelSelectType] * this.state.fuelFilling, 1, 0, this.state.fuelMax, this.setFuel)}
                    <div className="fuel_left">
                        <div className={`fuel_water ${this.isEletro() ? "fuel_electro" : ""}`} style={{ top: `${(this.state.fuelMax - (this.state.fuelFilling + this.state.fuelMin))}%` }} />
                        <div className={`fuel_water ${this.isEletro() ? "fuel_electro" : ""}`} style={{ top: `${(this.state.fuelMax - this.state.fuelMin)}%` }}/>
                    </div>
                </div>
                <div className="fuel_center">
                    <div className="fuel_name">
                        <h1>Заправка</h1>
                        <h2>{this.state.fuelName}</h2>
                    </div>
                    {!this.isEletro() ? <>
                        <p>Выберите топливо</p>
                        <div className="fuel_type">
                            {this.state.fuelTypes.map((data, index) => {
                                return <div key={index} className={`fuel_key_type ${this.state.fuelSelectType == index ? "fuel_type_select" : ""}`}
                                    onClick={() => this.setState({ ...this.state, fuelSelectType: index, fuelCost: this.state.catalog.find(q => q.item === data).price })}>{fuelTypeNames[data]}</div>
                            })}
                        </div></> : null
                    }
                    <div className="fuel_pay_info">
                        <h3 className={this.isEletro() ? "fuel_electro" : ""}>${systemUtil.numberFormat(this.state.fuelPrice[this.state.fuelSelectType] * this.state.fuelFilling)}</h3>
                        <h3>${systemUtil.numberFormat(this.state.fuelPrice[this.state.fuelSelectType])}</h3>
                        <h3>{(this.state.fuelFilling).toFixed(2)} {this.isEletro() ? "кВт" : "L"}</h3>
                        <p>Стоимость</p>
                        <p>{this.isEletro() ? "Цена за кВт" : "Цена за литр"}</p>
                        <p>Количество</p>
                    </div>
                    <PayBox ref={this._child} allowCompany={true} />
                    <div onClick={this.clickPay} className={`fuel_pay ${this.isEletro() ? "fuel_electro" : ""}`}>{this.isEletro() ? "Подключить зарядное устройство" : "Заправить"}</div>
                </div>
                {!this.isEletro() && this.state.canisterPrice ?
                    <div className="fuel_right">
                        <div>
                            <h1>Купить</h1>
                            <h2>Канистру</h2>
                            <h3>${this.state.canisterPrice}</h3>
                        </div>
                        <img src={filling} />
                    </div> : null
                }
            </div>
            <div className="fuel_bg">
                <img src={this.isEletro() ? bge : bg} />
            </div>
        </div>;
    }
}

const FormatSlider = (value: number, price: number, isElectro: boolean) => {
    return <div className="fuel_slider">
        <h1>{value}{isElectro ? "кВт" : "L"}</h1><h2>/${systemUtil.numberFormat(price)}</h2>
    </div>
}
export const AddSlider = (isElectro: boolean, value: number, price: number, step: number, min: number, max: number, handler: (newValue: number) => void) => {
    if (isElectro) return <ElectroSlider valueLabelFormat={() => FormatSlider(value, price, isElectro)} orientation="vertical" valueLabelDisplay="on" value={value} step={step ? step : 0.01} min={min} max={max} onChange={(e: any, newValue: number) => handler(newValue)} />
    return <WaterSlider valueLabelFormat={() => FormatSlider(value, price, isElectro)} orientation="vertical" valueLabelDisplay="on" value={value} step={step ? step : 0.01} min={min} max={max} onChange={(e: any, newValue: number) => handler(newValue)} />
};



const WaterStyles = createStyles({
    root: {
        color: '#52af77',
        height: 16,
        '&$vertical': {
            width: 8
        }
    },
    thumb: {
        height: 10,
        width: 30,
        borderRadius: 4,
        backgroundColor: '#6FCF97',
        marginTop: -8,
        '&:focus, &:hover, &$active': {
            boxShadow: '0px 0px 30px #6FCF97'
        }
    },
    active: {},
    valueLabel: {
        left: 0,
        top: 0,
        width: 20,
        color: '#00000000',
    },
    track: {
        height: 16,
        borderRadius: 4,
        boxShadow: '0px 0px 30px #6FCF97'
    },
    rail: {
        backgroundColor: 'rgba(255, 255, 255, 0.1);',
        height: 16,
        borderRadius: 4,
    },
    vertical: {
        '& $rail': {
            width: 8
        },
        '& $track': {
            width: 8
        },
        '& $thumb': {
            marginLeft: -11,
        }
    }
});
const ElectroStyles = {
    ...WaterStyles,
    root: {
        ...WaterStyles.root,
        color: '#56CCF2',
    },
    thumb: {
        ...WaterStyles.thumb,
        backgroundColor: '#56CCF2',
        '&:focus, &:hover, &$active': {
            boxShadow: '0px 0px 30px #56CCF2'
        }
    },
    track: {
        ...WaterStyles.track,
        boxShadow: '0px 0px 30px #56CCF2'
    }
}
const ElectroSlider = withStyles(ElectroStyles)(Slider);
const WaterSlider = withStyles(WaterStyles)(Slider);

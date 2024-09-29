// input не смог потестить
import React, {Component} from 'react';

import "./style.less";
import exitIcon from './assets/images/exitIcon.svg';
import backIcon from './assets/images/backIcon.svg';

import background from './assets/images/registration/background.png';
import leftImage from './assets/images/registration/leftImage.png';
import pointIcon from './assets/images/registration/pointIcon.svg';

import flyingNumbers from "./assets/images/first/flyingNumbers.png";
import leftButton from "./assets/images/first/left.png";
import rightButton from "./assets/images/first/right.png";

import car from "./assets/images/order/car.png";
import table from "./assets/images/order/table.png";
import coin from "./assets/images/order/coin.svg";
import {CustomEvent} from "../../modules/custom.event";
import {CEF} from "../../modules/CEF";
import {systemUtil} from "../../../shared/system";


export class NumberPlate extends Component<{}, {
    frame: number,
    activeType: number,
    numberPlate: string
}> {
    constructor(props: any) {
        super(props);

        this.state = {
            frame: 0,
            activeType: 0,
            numberPlate: ""
        }
        this.formatNumberInput = this.formatNumberInput.bind(this)
    }

    formatNumberInput(e: any): void {
        let value = e.target.value;
        this.setState({
            ...this.state,
            numberPlate: systemUtil.filterInput(value)
        })
    }

    changeFrame(frame: number):void {
        this.setState({frame});
    }

    changeActiveType(activeType: number):void {
        this.setState({activeType})
    }

    exit():void {
        CEF.gui.setGui(null);
    }

    back(): void {
        if (this.state.activeType !== 0) this.changeActiveType(0);
        this.changeFrame(0);
    }

    buyNumber(isDonate: boolean):void {
        if (isDonate) {
            if (this.state.numberPlate.length > 8) return CEF.alert.setAlert("error", "Слишком длинный");
            if (!/^[a-zA-Z0-9 ]{1,8}$/.test(this.state.numberPlate)) 
                return CEF.alert.setAlert("error", "Недопустимые символы в номере");
            CustomEvent.triggerServer('vehiclenumber:buyDonate', this.state.numberPlate)
        }else{
            if (this.state.activeType === 0) return; // не выбрал тип номера
            CustomEvent.triggerServer('vehiclenumber:buy', this.state.activeType - 1)
        }
    }

    render() {
        return <>
            {
                this.state.frame === 0 &&
                <div className='numbers-first'>
                    <img src={flyingNumbers} className="numbers-first__img" alt=""/>
                    <div className="exit" onClick={() => this.exit()}>
                        <div className="exit-icon">
                            <img src={exitIcon} alt="#"/>
                        </div>
                        <div className="exit__title">
                            Закрыть
                        </div>
                    </div>
                    <div className="numbers-first-left" onClick={() => this.changeFrame(1)}>
                        <img src={leftButton} alt=""/>
                        <div className="numbers-first__shadow"/>
                        <span>Выберите вид <br/>номерного знака</span>
                    </div>
                    <div className="numbers-first-right" onClick={() => this.changeFrame(2)}>
                        <img src={rightButton} alt=""/>
                        <div className="numbers-first__shadow"/>
                    </div>
                </div>
            }
            {
                this.state.frame === 1 &&
                <div className='numbers-registration'>
                    <img src={background} className="numbers-registration__background" alt=""/>
                    <img src={leftImage} className="numbers-registration__leftImage" alt=""/>
                    <div className="exit" onClick={() => this.back()}>
                        <div className="exit-icon">
                            <img src={backIcon} alt="#"/>
                        </div>
                        <div className="exit__title">
                            Назад
                        </div>
                    </div>
                    <div className="numbers-registration-content">
                        <h1>ОКНО РЕГИСТРАЦИИ #1</h1>
                        <h2>ОБЫЧНЫЕ НОМЕРНЫЕ ЗНАКИ</h2>
                        <div className={`numbers-registration-content-select ${this.state.activeType === 1 ? "numbers-select-active" : "" }`} onClick={() => this.changeActiveType(1)}>
                            <span>Случайный 8 значный номер </span>
                            <span>$5 000</span>
                        </div>
                        <div className={`numbers-registration-content-select ${this.state.activeType === 2 ? "numbers-select-active" : "" }`} onClick={() => this.changeActiveType(2)}>
                            <span>Случайный 7 значный номер </span>
                            <span>$10 000</span>
                        </div>
                        <div className={`numbers-registration-content-select ${this.state.activeType === 3 ? "numbers-select-active" : "" }`} onClick={() => this.changeActiveType(3)}>
                            <span>Случайный 6 значный номер </span>
                            <span>$15 000</span>
                        </div>
                        <hr/>
                        <div className="numbers-registration-content-description">
                            <img src={pointIcon} alt=""/>
                            <div>Покупка нового номерного знака приведет к замене текущего</div>
                        </div>
                        <div className={`numbers-registration-content__button ${this.state.activeType !== 0 ? "numbers-button-active" : ""}`} onClick={ () => this.buyNumber(false)}>
                            ОФОРМИТЬ
                        </div>
                    </div>
                </div>
            }
            {
                this.state.frame === 2 &&
                <div className='numbers-order' style={{backgroundImage: `url(${background})`}}>
                    <div className="exit" onClick={() => this.back()}>
                        <div className="exit-icon">
                            <img src={backIcon} alt="#"/>
                        </div>
                        <div className="exit__title">
                            Назад
                        </div>
                    </div>
                    <div className="numbers-order-content">
                        <img src={car} className="numbers-order-content__car" alt=""/>
                        <div className="numbers-order-content__title">
                            ЗАКАЗНОЙ НОМЕР
                        </div>
                        <div className="numbers-order-content__description">
                            <img src={pointIcon} alt=""/>
                            Покупка нового номерного знака приведет к замене текущего
                        </div>
                        <div className="numbers-order-content-table">`
                            <img src={table} alt=""/>
                            <input value={this.state.numberPlate} onChange={this.formatNumberInput}/>
                        </div>
                        <div className="numbers-order-content-price">
                            <img src={coin} alt=""/>
                            <span>2 500</span>
                            <div className="numbers-order-content-price__button" onClick={() => this.buyNumber(true)}>
                                ОФОРМИТЬ
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    }
}
import React, {Component} from "react";
import "./style.less";

import png from "./assets/*.png"
import svg from "./assets/*.svg"
import {BUS_LEVELS, JobLevel} from "../../../shared/jobs/busman/config";
import {CustomEvent} from "../../modules/custom.event";
import {CustomEventHandler} from "../../../shared/custom.event";
import {CEF} from "../../modules/CEF";

export class Bus extends Component<{}, {
    exp: number,
    currentType: number | null
}> {
    eventHandler: CustomEventHandler;

    constructor(props: any) {
        super(props);

        this.state = {
            exp: 40,
            currentType: null
        }

        this.eventHandler = CustomEvent.register('busman:employerLoad', (exp: number, type: number | null) => {
            this.setState({...this.state, exp: Math.trunc(exp), currentType: type});
        });
    }

    public componentWillUnmount() {
        if (this.eventHandler) this.eventHandler.destroy();
    }

    close() {
        CEF.gui.setGui(null);
    }

    startWork(type: number) {
        CustomEvent.triggerServer('busman:startWork', type);
        this.close();
    }

    stopWork() {
        CustomEvent.triggerClient('busman:finishWork');
        this.close();
    }

    getButton(el: JobLevel): any {
        if (this.state.currentType === null) {
            if (this.state.exp < el.fromEXP) {
                return <div className="bus-content-boxes-block__accept">
                    <img src={svg["notAvailable"]} alt=""/> НЕДОСТУПЕН
                </div>
            } else {
                return <div className="bus-content-boxes-block__proceed" onClick={() => this.startWork(el.index)}>
                    <img src={svg["helmetIcon"]} alt=""/> ПРИСТУПИТЬ
                </div>
            }
        } else {
            if (this.state.currentType === el.index) {
                return <div className="bus-content-boxes-block__accept" onClick={() => this.stopWork()}>
                    <img src={svg["checkMark"]} alt=""/> УВОЛИТЬСЯ
                </div>
            } else {
                return <div className="bus-content-boxes-block__accept">
                    <img src={svg["notAvailable"]} alt=""/> НЕДОСТУПЕН
                </div>
            }
        }
    }

    render() {
        return <div className="bus">

            <div className="exit" onClick={() => this.close()}>
                <div className="exit__icon"><img src={svg["closeIcon"]} alt="#"/></div>
                <div className="exit__title">Закрыть</div>
            </div>

            <img src={svg["background"]} alt="" className="bus__background"/>

            <img src={png["bus"]} alt="" className="bus__bus"/>

            <div className="bus-content">

                <div className="bus-content__title">
                    Работа <br/>
                    Водитель автобуса
                </div>

                <div className="bus-content__text">
                    Добро пожаловать в автобусное депо!
                    <br/><br/>
                    Для начала выберите любой доступный уровень и приступайте к работе.
                    Не забывайте снижать скорость перед остановкой.
                </div>

                <div className="bus-content__exp">
                    У тебя <span> {this.state.exp} exp</span>
                </div>

                <div className="bus-content-boxes">
                    {
                        BUS_LEVELS.map((el, key) => {
                            return <div className="bus-content-boxes-block bus-active" key={key}>

                                <div className="bus-content-boxes-block__level">
                                    {el.index + 1} уровень <span>(от {el.fromEXP} exp)</span>
                                </div>

                                <div className="bus-content-boxes-block__text">
                                    Маршрут { el.index + 1 } уровня
                                </div>

                                <div className="bus-content-boxes-block__tag">
                                    Оплата {el.payment}$
                                </div>

                                {
                                    this.getButton(el)
                                }

                            </div>
                        })
                    }

                </div>

            </div>


        </div>
    }
}
import React, {Component} from "react";
import "./style.less";
import {ELECTRICIAN_LEVELS, JobLevel, WORK_TYPE} from "../../../shared/jobs/electrician/config";

import png from "./assets/*.png"
import svg from "./assets/*.svg"
import {CustomEvent} from "../../modules/custom.event";
import {CustomEventHandler} from "../../../shared/custom.event";
import {CEF} from "../../modules/CEF";


export class Electrician extends Component<{}, {
    exp: number,
    currentType: WORK_TYPE | null
}> {
    eventHandler: CustomEventHandler;

    constructor(props: any) {
        super(props);

        this.state = {
            exp: 40,
            currentType: null
        }

        this.eventHandler = CustomEvent.register('electrician:employerLoad', (exp: number, type: WORK_TYPE | null) => {
            this.setState({exp: Math.trunc(exp), currentType: type});
        });
    }

    public componentWillUnmount() {
        if (this.eventHandler) this.eventHandler.destroy();
    }

    getButton(el: JobLevel): any {
        if (this.state.currentType === null) {
            if (this.state.exp < el.fromEXP) {
                return <div className="electrician-content-boxes-block__accept">
                    <img src={svg["notAvailable"]} alt=""/> НЕДОСТУПЕН
                </div>
            } else {
                return <div className="electrician-content-boxes-block__proceed"
                            onClick={() => this.startWork(el.index)}>
                    <img src={svg["helmetIcon"]} alt=""/> ПРИСТУПИТЬ
                </div>
            }
        } else {
            if (this.state.currentType === el.index) {
                return <div className="electrician-content-boxes-block__accept" onClick={() => this.stopWork()}>
                    <img src={svg["checkMark"]} alt=""/> УВОЛИТЬСЯ
                </div>
            } else {
                return <div className="electrician-content-boxes-block__accept">
                    <img src={svg["notAvailable"]} alt=""/> НЕДОСТУПЕН
                </div>
            }
        }
    }

    startWork(type: WORK_TYPE) {
        CustomEvent.triggerServer('electrician:check', type);
        this.close();
    }

    stopWork() {
        CustomEvent.triggerClient('electrician:finish');
        this.close();
    }

    close() {
        CEF.gui.setGui(null);
    }


    render() {
        return <div className="electrician">

            <div className="exit" onClick={() => this.close()}>
                <div className="exit__icon"><img src={svg["closeIcon"]} alt="#"/></div>
                <div className="exit__title">Закрыть</div>
            </div>

            <img src={svg["background"]} alt="" className="electrician__background"/>

            <img src={png["person"]} alt="" className="electrician__person"/>

            <img src={svg["blueFlash"]} alt="" className="electrician__flash0"/>
            <img src={svg["blueFlash"]} alt="" className="electrician__flash1"/>
            <img src={svg["blueFlash"]} alt="" className="electrician__flash2"/>

            <div className="electrician-content">

                <img src={svg["title"]} alt="" className="electrician-content__title"/>

                <div className="electrician-content__text">
                    Добро пожаловать на работу электростанцию!
                    <br/><br/>
                    Чтобы начать работу, выберите доступный вам вид работы,
                    прокачивайте EXP для поднятия квалификации и большего заработка.
                </div>

                <div className="electrician-content__exp">
                    У тебя <span> {this.state.exp} exp</span>
                </div>

                <div className="electrician-content-boxes">

                    {ELECTRICIAN_LEVELS.map((el, key) => {
                        return <div className="electrician-content-boxes-block electrician-active" key={key}>

                            <div className="electrician-content-boxes-block__level">
                                {el.index + 1} уровень <span>(от {el.fromEXP} exp)</span>
                            </div>

                            <div className="electrician-content-boxes-block__text">
                                {el.description}
                            </div>

                            <div className="electrician-content-boxes-block__tag">
                                Оплата {el.payment}$
                            </div>

                            {
                                this.getButton(el)
                            }

                        </div>
                    })}
                </div>

            </div>


        </div>
    }
}
import React, {Component} from "react";
import "./style.less";

import png from "./assets/*.png";
import svg from "./assets/*.svg";
import FurnitureHudStore from "../../stores/FurnitureHud";
import { observer } from "mobx-react";
import {CustomEvent} from "../../modules/custom.event";

@observer export class InteriorHud extends Component<{
    store: FurnitureHudStore
}, {}> {

    store: FurnitureHudStore = this.props.store

    constructor(props: any) {
        super(props);

        document.addEventListener('keydown', this.keyDownHandler);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyDownHandler);

        this.store.setState({
            direction: 'x',
            moveType: true
        })
    }

    keyDownHandler = (e: any) => {
        if ([39, 37, 38, 40, 16, 17, 79, 78, 89].find(el => el === e.keyCode) === undefined) return;

        CustomEvent.triggerClient('furniturePlace:onKey', e.keyCode);
    }

    render() {
        return <div className="interiorHud">

            <div className="interiorHud-top-left">

                <div className="interiorHud-top-left-line">
                    <div className="interiorHud-buttonBlock">
                        <img src={svg["arrowLeft"]} alt=""/>
                    </div>
                    <div className="interiorHud-buttonBlock">
                        <img src={svg["arrowRight"]} alt=""/>
                    </div>
                    <div className="interiorHud-top-left-line__text">Выбор направления вектора</div>
                </div>

                <div className="interiorHud-top-left-line">
                    <div className="interiorHud-buttonBlock">
                        <img src={svg["arrowUp"]} alt=""/>
                    </div>
                    <div className="interiorHud-buttonBlock">
                        <img src={svg["arrowDown"]} alt=""/>
                    </div>
                    <div className="interiorHud-top-left-line__text">Движение по направлению <br/> вектора</div>
                </div>

            </div>

            <div className="interiorHud-top-center">

                <div className="interiorHud-buttonBlock">
                    <span>Shift</span>
                </div>
                <div className="interiorHud-top-center__text">Быстрее</div>

                <div className="interiorHud-buttonBlock">
                    <span>Ctrl</span>
                </div>
                <div className="interiorHud-top-center__text">Медленнее</div>

                <div className="interiorHud-buttonBlock">
                    <span>O</span>
                </div>
                <div className="interiorHud-top-center__text">
                    Смена: <span>Вращение/ <br/> Позиционирование</span>
                </div>

            </div>

            <div className="interiorHud-top-right">

                <div className="interiorHud-top-right-line">
                    <div className="interiorHud-top-right-line__text">Выйти</div>
                    <div className="interiorHud-buttonBlock">
                        <span>N</span>
                    </div>
                </div>

                <div className="interiorHud-top-right-line">
                    <div className="interiorHud-top-right-line__text">Сохранить</div>
                    <div className="interiorHud-buttonBlock">
                        <span>Y</span>
                    </div>
                </div>

            </div>

            <div className="interiorHud-bottom-left">

                <img className="interiorHud-bottom-left__image" src={svg[`coordinate${this.store.direction.toUpperCase()}`]} alt=""/>

                <div className="interiorHud-bottom-left-block">
                    <img src={png["move"]} alt=""/>
                    <div>
                        <span>Режим</span>
                        {this.store.moveType ? 'Позиционирование' : 'Вращение'}
                    </div>
                </div>

            </div>

        </div>
    }

}
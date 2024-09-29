import React, {Component} from "react";
import "./style.less";
import png from './assets/*.png'
import svg from "./assets/*.svg"
import {IParkingData, IParkingFloor} from "../../../shared/parking";
import {CEF} from "../../modules/CEF";
import {CustomEvent} from "../../modules/custom.event";
import {CustomEventHandler} from "../../../shared/custom.event";

export class Parking extends Component<{}, {
    id: number,
    name: string,
    exit: [Vector3Mp, number, number] | null,
    floors: IParkingFloor[],
    singlePayment: string,
    dailyPayment: string,
    subType: number
}> {
    ev: CustomEventHandler

    constructor(props: any) {
        super(props);
        this.state = {
            id: 5,
            name: "aaaa",
            exit: null,
            floors: [],
            singlePayment: "a",
            dailyPayment: "a",
            subType: 0
        };

        this.ev = CustomEvent.register('parking:load', (parkingData: IParkingData) => {
            this.setState({...parkingData});
        });
    }

    componentWillUnmount() {
        this.ev.destroy();
    }

    close() {
        CEF.gui.setGui(null);
    }

    exit() {
        if (!this.state.exit) return;
        CustomEvent.triggerServer('parking:exit', this.state.exit[0], this.state.exit[1], this.state.exit[2]);
        this.close();
    }

    toFloor(dimension: number) {
        CustomEvent.triggerServer('parking:toFloor', dimension, this.state.subType);
        this.close();
    }

    isInteger(n: number) {
        return Number(n) === n && n % 1 === 0;
    }

    getCurrentFloor() {
        return this.state.floors.find(el => el.current);
    }

    getCarFloor() {
        return this.state.floors.find(el => el.haveCar);
    }

    render() {
        return <div className="parking">
            <img src={png['lines']} className="parking__lines" alt=""/>
            <div className="exit" onClick={() => this.close()}>
                <div className="exit__icon"><img src={svg["closeIcon"]} alt="#"/></div>
                <div className="exit__title">Закрыть</div>
            </div>

            <div className="parking-block">

                <div className="parking-block-left">
                    <img src={png["parkingMeter"]} className="parking-block-left__parkingMeter" alt=""/>
                    <div className="parking-block-left__location">
                        <img src={svg['gpsIcon']} alt=""/>
                        <span>{this.state.name}</span>
                    </div>
                    <div className="parking-block-left__name">
                        Парковка №{this.state.id}
                    </div>
                    <div className="parking-block-left__price">
                        <img src={svg["infoIcon"]} alt=""/>
                        <div>
                            <span>Единоразовая оплата: <p>${this.state.singlePayment}</p></span>
                            <span>Посуточная оплата: <p>${this.state.dailyPayment}</p></span>
                        </div>
                    </div>

                    {this.state.exit !== null && <div className="parking-block-left__button" onClick={() => this.exit()}>
                        <img src={svg['exitIcon']} alt=""/>
                        Выйти с парковки
                    </div>}

                </div>

                <div className="parking-block-right">

                    <div className="parking-block-right__head">
                        {this.getCurrentFloor() && <div>
                            ПОЛОЖЕНИЕ
                            <span>Вы на {this.getCurrentFloor().serial} этаже</span>
                        </div>}
                        {this.getCarFloor() && <div>
                            Парковочное место
                            <span>Авто на {this.getCarFloor().serial} этаже</span>
                        </div>}
                        <p>Этажи</p>
                    </div>

                    <div className="parking-block-right-content">
                        {
                            this.state.floors.map((floor, key) => {
                                const third = key === 0 || this.isInteger(key / 3);

                                return <div className={`parking-block-right-content-block 
                                ${third ? "parking-line" : null}
                                ${floor.current ? "parking-active" : null}`}
                                            key={key}
                                            onClick={() => this.toFloor(floor.dimension)}>

                                    <div className="parking-block-right-content-block__ellipse"/>
                                    <div className="parking-block-right-content-block__floor">{floor.serial} этаж.</div>
                                    <div className="parking-block-right-content-block__slot">{floor.places}</div>
                                    <div className="parking-block-right-content-block__description">
                                        { floor.freePlaces ? "Свободные места" : "Нет мест" }
                                    </div>

                                    {
                                        floor.haveCar &&
                                        <div className="parking-block-right-content-block__bar">
                                            <img src={svg["marker"]} alt=""/>
                                            <span>Ваше авто <br/> на парковке</span>
                                        </div>
                                    }
                                </div>
                            })
                        }
                    </div>

                </div>

            </div>

        </div>
    }
}
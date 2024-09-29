import React, {Component} from "react";
import "../../style.less";
import png from "../../assets/*.png"
import svg from "../../assets/*.svg"
import {CEF} from "../../../../modules/CEF";
import Draggable from "react-draggable";
import {INSULATOR_GAME, InsulatorGame, lineInsulator} from "../../../../../shared/jobs/electrician/config";
import {CustomEvent} from "../../../../modules/custom.event";


export class Insulator extends Component<{}, {
    totalWatt: number,
    insulators: lineInsulator[],
    pointerOnPosition: null | "right" | "left"
}> {
    constructor(props: any) {
        super(props);

        let gameJSON: string = JSON.stringify(INSULATOR_GAME[Math.floor(Math.random()*INSULATOR_GAME.length)]),
            game: InsulatorGame = JSON.parse(gameJSON);

        this.state = {
            totalWatt: game.totalWatt,
            pointerOnPosition: null,
            insulators: game.insulators
        };
    }

    close() {
        CEF.gui.setGui(null);
    }

    onStartDrag(key: number) {
        let insulators = this.state.insulators;

        insulators[key].isDrag = true;

        this.setState({...this.state, insulators});
    }

    onStopDrag(key: number) {
        let insulators = this.state.insulators;

        insulators[key].isDrag = false;
        if (this.state.pointerOnPosition !== null) {
            const count = this.state.insulators.filter(el => el.onPosition === this.state.pointerOnPosition).length;
            if (count === 0) insulators[key].onPosition = this.state.pointerOnPosition;
        }

        this.setState({...this.state, insulators});

        this.checkOnComplete();
    }

    checkOnComplete() {
        let watt: number = 0,
            count = 0;




        this.state.insulators.forEach(el => {
            if (el.onPosition !== null) {
                watt += el.watt;
                count++;
            }
        });

        if (count !== 2) return;

        if (watt !== this.state.totalWatt) {
            CustomEvent.triggerClient('electrician:gameComplete', false);
        }else{
            CustomEvent.triggerClient('electrician:gameComplete', true);
        }

        this.close();
    }

    pointerEnterPosition(position: "right" | "left") {
        this.setState({...this.state, pointerOnPosition: position});
    }

    pointerLeavePosition() {
        this.setState({...this.state, pointerOnPosition: null});
    }


    render() {
        return <div className="insulator">

            <div className="exit" onClick={() => this.close()}>
                <div className="exit__icon"><img src={svg["closeIcon"]} alt="#"/></div>
                <div className="exit__title">Закрыть</div>
            </div>


            <img src={png["background"]} alt="" className="insulator__background"/>

            <div className="insulator__title">Подбери верную часть</div>

            <div className="insulator__text">изолятор</div>

            <img src={svg["insulatorDescription"]} alt="" className="wires__description"/>

            <div className="insulator-circuit">

                <div className="insulator-circuit-slot insulator-circuit-slot__left" onMouseEnter={() => this.pointerEnterPosition("left")} onMouseLeave={() => this.pointerLeavePosition()}>

                    <img src={svg["leftInsulatorDot"]} className={"insulator-circuit-slot__img"} alt=""/>

                </div>

                <div className="insulator-circuit-slot insulator-circuit-slot__right" onMouseEnter={() => this.pointerEnterPosition("right")} onMouseLeave={() => this.pointerLeavePosition()}>
                    <img src={svg["rightInsulatorDot"]} className={"insulator-circuit-slot__img"} alt=""/>
                </div>

                <img src={png[`circuit`]} className="insulator-circuit__background" alt=""/>

                {/*
                <img src={png["circuitActive"]} className="insulator-circuit__background" alt=""/>
                */}

                <div className="insulator-circuit__target">
                    <img src={svg["blueFlash"]} alt=""/>
                    {this.state.totalWatt}Вт
                </div>

            </div>


            <div className="insulator-slots">

                {this.state.insulators.map((el, key) => {

                    return <Draggable
                    onStart={() => this.onStartDrag(key)}
                    onStop={() => this.onStopDrag(key)} key={key}
                    >
                        <div className={`insulator-slots__${key}`} style={{pointerEvents: el.isDrag ? "none" : "auto"}}>
                        <img src={png["leftInsulator"]} alt="" className="insulator-slots__background"/>
                        <img src={svg["blueFlash"]} alt="" className="insulator-slots__flash"/>
                        <span>{el.watt}Вт</span>
                    </div></Draggable>
                })}


            </div>


        </div>
    }
}
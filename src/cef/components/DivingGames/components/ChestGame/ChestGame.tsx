import React, {Component} from "react";
import "../../style.less";

import png from "./assets/*.png"
import svg from "./assets/*.svg"
import {Rune, RuneManual, runesManual} from "../../../../../shared/diving/minigames.config";
import {shuffle} from "lodash";
import Draggable, {DraggableData} from "react-draggable";
import {CustomEvent} from "../../../../modules/custom.event";

export class ChestGame extends Component<{}, {
    runes: Rune[],
    manual: RuneManual[],
}> {

    constructor(props: any) {
        super(props);

        let runesManualCopy: RuneManual[] = JSON.parse(JSON.stringify(runesManual)),
            runes: Rune[] = [];

        runesManualCopy.map((el) => {
            runes.push({symbol: el.symbol, img: el.img, x: null, isDragging: false});
        });

        runesManualCopy = shuffle(runesManualCopy);
        runes = shuffle(runes);

        if (ChestGame.conformanceTest(runesManualCopy, runes))
            while (ChestGame.conformanceTest(runesManualCopy, runes)) runes = shuffle(runes);


        this.state = {
            runes,
            manual: runesManualCopy
        }
    }

    private static conformanceTest(manual: RuneManual[], runes: Rune[]): boolean {
        let conformance = false;

        manual.map((el, key) => {
            if (el.symbol === runes[key].symbol) conformance = true;
        });

        return conformance;
    }

    private onStartDrag(i: number) {
        let runes = [...this.state.runes];
        runes[i].isDragging = true;
        this.setState({...this.state, runes});
    }

    private onStopDrag(data: DraggableData, i: number) {
        let runes = this.state.runes;
        this.state.runes[i].isDragging = false;
        this.state.runes[i].x = data.node.getBoundingClientRect().left;
        this.setState({...this.state, runes}, () => {
            this.checkOnFinish()
        })
    }


    private checkOnFinish() {
        if (this.state.runes.filter(el => el.x === null).length > 0) return;

        const runes: Rune[] = JSON.parse(JSON.stringify(this.state.runes)),
            sortedRunes = runes.sort((a, b) => {
                if (a.x > b.x) {
                    return 1;
                } else if (a.x < b.x) {
                    return -1;
                } else {
                    return 0;
                }
            });

        let performed = true;

        this.state.manual.map((el, i) => {
            if (el.symbol !== sortedRunes[i].symbol) performed = false;
        })

        CustomEvent.triggerClient('diving:chestGame:finish', true);
    }


    render() {
        return <>

            <div className="divingGame__title">
                Подбери код
            </div>

            <div className="divingGame__text">
                Перетаскивай руны и подбери верный код
            </div>

            <div className="divingGame__instruction">

                <img src={svg["hand"]} alt=""/>

            </div>

            <div className="chestGame">

                <div className="chestGame__chest">
                    <img src={png["chest"]} alt=""/>
                </div>


                <div className="chestGame-runes">
                    {
                        this.state.runes.map((el, key) => {
                            return <Draggable
                                onStart={() => this.onStartDrag(key)}
                                onStop={(e, data) => this.onStopDrag(data, key)}
                                key={key}
                            >
                                <div className="chestGame-runes__stone">
                                    <img src={png[`stone${el.img}`]} alt=""/>
                                </div>
                            </Draggable>
                        })
                    }

                </div>

            </div>

            <div className="chestGame-manual">

                <img src={png["paper"]} alt="" className="chestGame-manual__background"/>

                <div className="chestGame-manual__block">
                    {
                        this.state.manual.map((el, key) => {
                            return <img src={svg[`rune${el.img}`]} key={key} alt=""/>
                        })
                    }
                </div>

            </div>

        </>
    }

}
import React, {Component} from "react";
import {DIVING_LOCK_GAME_MAX_ROT, DIVING_LOCK_GAME_MIN_ROT, Gear} from "../../../../../shared/diving/minigames.config";
import "../../style.less";
import {CustomEvent} from "../../../../modules/custom.event";

import png from "./assets/*.png"
import svg from "./assets/*.svg"


export class LockGame extends Component<{}, {
    gears: Gear[],
    currentGear: number,
    gearRefs: React.RefObject<any>[]
}> {

    private arrowUpPressed: boolean = false;
    private interval: number;

    componentDidMount() {

        document.addEventListener("keydown", this.listenerKeyDown);
        document.addEventListener("keyup", this.listenerKeyUp);

        this.interval = setInterval(() => {
            if (this.arrowUpPressed) {
                const gears = this.state.gears;
                if (gears[this.state.currentGear].rotation !== 720) {
                    gears[this.state.currentGear].rotation += 5;
                    this.state.gearRefs[this.state.currentGear].current.style.transform = `rotate(${gears[this.state.currentGear].rotation}deg)`;
                }

                if (!gears[this.state.currentGear].success && gears[this.state.currentGear].rotation >= gears[this.state.currentGear].neededRotation) {
                    gears[this.state.currentGear].success = true;
                }
                this.setState({...this.state, gears})
            }
        }, 50);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.listenerKeyDown)
        document.removeEventListener("keyup", this.listenerKeyUp)

        clearInterval(this.interval)
    }

    constructor(props: any) {
        super(props);

        this.state = {
            currentGear: 0,
            gears: [
                {
                    id: 0,
                    success: false,
                    rotation: 0,
                    neededRotation: LockGame.getRandomRotation()
                },
                {
                    id: 1,
                    success: false,
                    rotation: 0,
                    neededRotation: LockGame.getRandomRotation()
                },
                {
                    id: 2,
                    success: false,
                    rotation: 0,
                    neededRotation: LockGame.getRandomRotation()
                },
                {
                    id: 3,
                    success: false,
                    rotation: 0,
                    neededRotation: LockGame.getRandomRotation()
                },
                {
                    id: 4,
                    success: false,
                    rotation: 0,
                    neededRotation: LockGame.getRandomRotation()
                },
                {
                    id: 5,
                    success: false,
                    rotation: 0,
                    neededRotation: LockGame.getRandomRotation()
                }
            ],
            gearRefs: [
                React.createRef(),
                React.createRef(),
                React.createRef(),
                React.createRef(),
                React.createRef(),
                React.createRef()
            ]
        }
    }

    private listenerKeyDown = (e: any): void => {
        if (e.keyCode === 38) {
            this.arrowUpPressed = true;
        }

        if (e.keyCode === 32) {
            this.lockGear();
        }
    }

    private listenerKeyUp = (e: any): void => {
        if (e.keyCode === 38) {
            this.arrowUpPressed = false;
        }
    }

    private lockGear() {
        const currGear = this.state.currentGear;

        if (currGear === 5) {
            CustomEvent.triggerClient('diving:chestGame:finish',
                this.state.gears.filter(el => el.success).length === this.state.gears.length)

            return;
        }

        this.setState({...this.state, currentGear: currGear + 1})
    }

    private static getRandomRotation(): number {
        return Math.random() * (DIVING_LOCK_GAME_MAX_ROT - DIVING_LOCK_GAME_MIN_ROT) + DIVING_LOCK_GAME_MIN_ROT;
    }


    render() {
        return <>

            <div className="divingGame__title">
                Взломай замок
            </div>

            <div className="divingGame__text">
                Крути шестеренки, пока они не загорятся зеленым. После - зафиксируй
            </div>

            <div className="divingGame__instruction">

                <div><img src={svg["arrow"]} alt=""/></div>
                <span>Крутить <br/> шестеренку</span>

                <div><span>Пробел</span></div>
                <span>Зафиксирвать <br/> шестеренку</span>

            </div>

            <div className="lockGame">

                <div className="lockGame-gears">
                    {
                        this.state.gears.filter(el => el.id < 3).map((el, i) => {
                            return <div
                                className={`lockGame-gears__block ${this.state.currentGear === el.id ? "lockGame-focus" : ""} ${el.success ? "lockGame-green" : ""}`}
                                key={i}
                                ref={this.state.gearRefs[el.id]}>
                                <img src={png["gear"]} alt=""/>
                            </div>
                        })
                    }
                </div>

                <img src={png["lock"]} alt="" className="lockGame__lock"/>


                <div className="lockGame-gears">
                    {
                        this.state.gears.filter(el => el.id >= 3).map((el, i) => {
                            return <div
                                className={`lockGame-gears__block ${this.state.currentGear === el.id ? "lockGame-focus" : ""} ${el.success ? "lockGame-green" : ""}`}
                                key={i}
                                ref={this.state.gearRefs[el.id]}>
                                <img src={png["gear"]} alt=""/>
                            </div>
                        })
                    }
                </div>

            </div>

        </>
    }

}
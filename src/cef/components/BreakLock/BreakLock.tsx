import React, {Component, LegacyRef} from 'react';

import "./BreakLock.less";
import exitIcon from "./images/exitIcon.svg";
import homeIcon from "./images/homeIcon.svg";
import lockImage from "./images/lockImage.svg";
import lockIconRed from "./images/lockIconRed.svg";
import lockIconGreen from "./images/lockIconGreen.svg";
import key from "./images/key.svg";
import arrowButton from "./images/arrowButton.svg";
import spaceButton from "./images/spaceButton.svg";
import lockXray from "./images/lockXray.svg";
import picklock from "./images/picklock.svg";
import {CustomEvent} from "../../modules/custom.event";


export class BreakLock extends Component<{}, {
    lockHacked: boolean,
    stopped: boolean,
    homeName: string,
    homeAddress: string,
    selectedPicklock: number,
    boosts: number[],
    intervalMs: number,
    picklocks: React.RefObject<any>[],
    cylinders: React.RefObject<any>[],
    values: number[]
}> {
    private arrowUpPressed: boolean = false;

    private listenerKeyDown = (e: any): void => {
        if (e.keyCode === 38) {
            this.arrowUpPressed = true;
        }

        if (e.keyCode === 32) {
            this.changePicklock();
        }
    }

    private listenerKeyUp = (e: any): void => {
        if (e.keyCode === 38) {
            this.arrowUpPressed = false;
        }
    }

    private interval: NodeJS.Timeout;

    constructor(props: any) {
        super(props);

        this.state = {
            lockHacked: false,
            stopped: false,
            homeName: "НАЗВАНИЕ ДОМА ДЛИННОЕ",
            homeAddress: "АДРЕС ДОМА ДЛИННОЕ НАЗВАНИЕ",
            selectedPicklock: 0,
            boosts: [
                0,
                0,
                0,
                0
            ],
            intervalMs: 50,
            picklocks: [
                React.createRef<HTMLImageElement>(),
                React.createRef<HTMLImageElement>(),
                React.createRef<HTMLImageElement>(),
                React.createRef<HTMLImageElement>()
            ],
            cylinders: [
                React.createRef<HTMLDivElement>(),
                React.createRef<HTMLDivElement>(),
                React.createRef<HTMLDivElement>(),
                React.createRef<HTMLDivElement>()
            ],

           values: [
               (Math.floor(Math.random() * (Math.floor(20) - Math.ceil(10) + 1)) + Math.ceil(10)) / 10,
               (Math.floor(Math.random() * (Math.floor(20) - Math.ceil(10) + 1)) + Math.ceil(10)) / 10,
               (Math.floor(Math.random() * (Math.floor(20) - Math.ceil(10) + 1)) + Math.ceil(10)) / 10,
               (Math.floor(Math.random() * (Math.floor(20) - Math.ceil(10) + 1)) + Math.ceil(10)) / 10
           ]
        }
    }

    componentDidMount() {

        document.addEventListener("keydown", this.listenerKeyDown);
        document.addEventListener("keyup", this.listenerKeyUp);

        this.interval = setInterval(() => this.everyTick(), this.state.intervalMs);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.listenerKeyDown)
        document.removeEventListener("keyup", this.listenerKeyUp)

        clearInterval(this.interval);
    }

    everyTick() {
        if (this.state.stopped) return;

        let picklock = this.state.picklocks[this.state.selectedPicklock],
            cylinder = this.state.cylinders[this.state.selectedPicklock],
            boost = this.state.boosts[this.state.selectedPicklock],
            value = this.state.values[this.state.selectedPicklock];

        if (this.arrowUpPressed) {
            let newBoost = this.state.boosts;

            newBoost[this.state.selectedPicklock] = 2.6;

            this.setState({boosts: newBoost})

            cylinder.current.style.background = "linear-gradient(180deg, #E3256B, rgba(190, 22, 34, 0)), linear-gradient(90deg, #393939, #727171, #232323)";
        }else{
            let newBoost = this.state.boosts;

            if (boost - .1 <= 0) {
                newBoost[this.state.selectedPicklock] = 0;
            }else{
                newBoost[this.state.selectedPicklock] -= .05;
            }

            this.setState({boosts: newBoost})

            if (newBoost[this.state.selectedPicklock] < value) {
                cylinder.current.style.background = "linear-gradient(90deg, #232323 0%, #5B5B5B 49.48%, #232323 100%)";
            }else if (newBoost[this.state.selectedPicklock] >= value && boost <= value + .4) {
                cylinder.current.style.background = "linear-gradient(180deg, rgba(154, 192, 0, 0.5) 0%, rgba(154, 192, 0, 0) 100%), linear-gradient(90deg, #393939 0%, #727171 49.48%, #232323 100%)";
            }else if (newBoost[this.state.selectedPicklock] > value) {
                cylinder.current.style.background = "linear-gradient(180deg, #E3256B, rgba(190, 22, 34, 0)), linear-gradient(90deg, #393939, #727171, #232323)";
            }
        }

        picklock.current.style.transform = `translateY(-${boost}em)`;
        cylinder.current.style.transform = `translateY(-${boost}em)`;
    }

    changePicklock() {
        if (this.state.selectedPicklock === 3) {
            this.setState({stopped: true});
            this.checkResult();
        }else{
            this.setState({selectedPicklock: this.state.selectedPicklock + 1});
        }
    }

    checkResult() {
        let i = 0;
        this.state.boosts.forEach((el, index) => {
            if (el >= this.state.values[index] && el <= this.state.values[index] + .4) i++;
        })

        if (i === 4)
            this.setState({lockHacked: true}, () => {
                CustomEvent.triggerClient('jobs::houseCracking::endMinigame', true);
            });
        else
            this.setState({ lockHacked: false }, () => {
                CustomEvent.triggerClient('jobs::houseCracking::endMinigame', false);
            });
    }

    fixNumber(n: number): number {
        n.toFixed(2);
        return Number(n);
    }

    render() {
        return <div className='screen'>
            <div className="exit" onClick={
                () => CustomEvent.triggerClient('jobs::houseCracking::endMinigame', false)
            }>
                <div className="exit-icon">
                    <img src={exitIcon} alt="#"/>
                </div>
                <div className="exit__title">
                    Закрыть
                </div>
            </div>
            <div className="br-lock">
                <div className="br-lock-name">
                    <img src={homeIcon} alt="#"/>
                    <div>
                        <h1>{this.state.homeName}</h1>
                        <h2>{this.state.homeAddress}</h2>
                    </div>
                </div>
                <img src={lockImage} className='br-lock__lockImage' alt=""/>
                <img src={this.state.lockHacked ? lockIconGreen : lockIconRed} className={`br-lock__lockIcon`}
                     alt=""/> {/*lock__lockIconGreen*/}
                <img src={key} className='br-lock__key' alt=""/>
                <div className="br-lock-content">
                    <h1>
                        ВЗЛОМАЙ ЗАМОК
                    </h1>
                    <h2>
                        Поднимай отмычку до тех пор, пока она не станет зеленой
                    </h2>

                    <div className="br-lock-content-keys">
                        <img src={arrowButton} alt=""/>
                        <span>Поднять <br/> отмычку</span>
                        <img src={spaceButton} alt=""/>
                        <span>
                    Зафиксировать <br/> отмычку
                </span>
                    </div>
                    <div className="br-lock-content-xray">
                        <img src={lockXray} className="br-lock-content-xray__background" alt="#"/>

                        <div
                            className={`br-lock-content-xray-picklock ${this.state.selectedPicklock === 0 ? "br-lock-content-xray-active" : ""}`}>
                            <div ref={this.state.cylinders[0]}/>
                            <img ref={this.state.picklocks[0]} src={picklock} alt=""/>
                        </div>
                        <div
                            className={`br-lock-content-xray-picklock ${this.state.selectedPicklock === 1 ? "br-lock-content-xray-active" : ""}`}>
                            <div ref={this.state.cylinders[1]}/>
                            <img ref={this.state.picklocks[1]} src={picklock} alt=""/>
                        </div>
                        <div
                            className={`br-lock-content-xray-picklock ${this.state.selectedPicklock === 2 ? "br-lock-content-xray-active" : ""}`}>
                            <div ref={this.state.cylinders[2]}/>
                            <img ref={this.state.picklocks[2]} src={picklock} alt=""/>
                        </div>
                        <div
                            className={`br-lock-content-xray-picklock ${this.state.selectedPicklock === 3 ? "br-lock-content-xray-active" : ""}`}>
                            <div ref={this.state.cylinders[3]}/>
                            <img ref={this.state.picklocks[3]} src={picklock} alt=""/>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}
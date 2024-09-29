import React, {Component} from "react";
import "./style.less";
import png from './assets/*.png'
import {CustomEvent} from "../../modules/custom.event";
import {CEF} from "../../modules/CEF";
import radioOn from "./radio_on.ogg";
import radioOff from "./radio_off.ogg";
import {systemUtil} from "../../../shared/system";
import WalkieStore from "../../stores/Walkie";
import { observer } from 'mobx-react';
import {CustomEventHandler} from "../../../shared/custom.event";


@observer export class Walkie extends Component<{
    store: WalkieStore
}, {}> {

    store: WalkieStore
    private _ev1: CustomEventHandler

    constructor(props: any) {
        super(props);

        this.store = props.store;

        this._ev1 = CustomEvent.register('radio:sound', (enabled: boolean, volume: number) => {
            this.playSound(enabled, volume);
        });


        setInterval(() => {
            this.randomSpeaker();
            if (this.store.freqInputTimer) this.store.setState({ freqInputTimer: this.store.freqInputTimer - 1 })
            else if (this.store.freqInput) this.store.setState({ freqInput: "" })
        }, 1000)
    }

    componentWillUnmount() {
        this._ev1.destroy();
    }

    openRadio(){
        if (!this.store.opened) CEF.gui.enableCusrsor()
        else CEF.gui.disableCusrsor()
        this.store.setState({ opened: !this.store.opened });
    }
    playSound(enabled: boolean, volume: number){
        const snd = new Audio(enabled ? radioOn : radioOff);
        snd.volume = volume;
        snd.play();
        setTimeout(() => {
            snd.remove();
        }, 3000)
    }
    randomSpeaker(){
        if (this.store.currentSpeakers.length == 0 && this.store.currentSpeakerName) this.store.setState({ currentSpeakerName: "" }), this.playSound(false, 0.4)
        else if (this.store.currentSpeakers.length > 0){
            if (!this.store.currentSpeakers) this.playSound(true, 0.4)
            this.store.setState({ currentSpeakerName: systemUtil.randomArrayElement(this.store.currentSpeakers) })
        }
    }
    get needDisplayMinimal(){
        if (this.store.enabled) return true;
        return this.store.currentSpeakers.length > 0;
    }

    get volume(){
        return this.store.volume
    }

    set volume(value){
        if(value < 0) value = 0
        if(value > 100) value = 100;
        const needRedraw = !this.store.alertVolume;
        this.store.setState({volume: value, alertVolume: true});
        if (!needRedraw) return;
        setTimeout(() => {
            this.store.setState({alertVolume: false});
        }, 3000)
    }

    connectToFreq(){
        const value = this.store.freqInput;
        if (!value) return CustomEvent.triggerServer('radio:connectToFreq', "");
        if(!value.includes('.')) return;
        if (value.split('.').find(q => !q)) return;
        CustomEvent.triggerServer('radio:connectToFreq', value);
        this.store.setState({ freqInput: "", freqInputTimer: 0})
    }

    inputFreq(val:string){
        this.store.setState({ freqInputTimer: 5})
        if (this.store.freqInput && this.store.freqInput.includes('.') && val === ".") return;
        if (this.store.freqInput && !this.store.freqInput.includes('.') && val !== "." && this.store.freqInput.length === 4) return;
        if (this.store.freqInput && this.store.freqInput.includes('.') && this.store.freqInput.split('.')[1].length === 3) return;
        this.store.setState({ freqInput: this.store.freqInput+val});
    }
    minusFreq(){
        if (!this.store.freqInput || this.store.freqInput.length == 1) this.store.setState({ freqInputTimer: 0 })
        else this.store.setState({ freqInputTimer: 5 })
        if (!this.store.freqInput) return;
        this.store.setState({ freqInput: this.store.freqInput.substring(0, this.store.freqInput.length - 1) });
    }

    setVolume(plus:boolean){
        if(plus) this.volume += 5
        else if(!plus) this.volume -= 5
    }
    disableRadio(){

    }



    render() {
        return <div className={`walkie ${this.store.opened ? "walkie-show" : (this.needDisplayMinimal ? 'walkie-talkMode' : '')}`}>

            <img src={png["walkie"]} alt=""/>

            <div
                className="walkie__frequency">{this.store.enabled ? 'BROADCAST' : (this.store.freqInput ? `${this.store.freqInput} mHz` : (this.store.freq ? `${this.store.opened ? this.store.freq : '***.***'} mHz` : 'DISABLED'))}</div>

            <div className="walkie__redButton" onClick={() => {
                if (this.store.enabled) return;
                if (this.store.freqInputTimer) {
                    return this.store.setState({freqInputTimer: 0, freqInput: ""})
                }
                if (this.store.freq) return this.store.setState({freq: ""}, () => {
                    this.connectToFreq();
                })
            }}/>
            <div className="walkie__greenButton" onClick={() => {
                this.connectToFreq()
            }}/>

            <div className="walkie__buttons">
                <div onClick={() => this.inputFreq(`1`)}><span>1</span> <img src={png["button"]} alt=""/></div>
                <div onClick={() => this.inputFreq(`2`)}><span>2</span> <img src={png["button"]} alt=""/></div>
                <div onClick={() => this.inputFreq(`3`)}><span>3</span> <img src={png["button"]} alt=""/></div>
                <div onClick={() => this.inputFreq(`4`)}><span>4</span> <img src={png["button"]} alt=""/></div>
                <div onClick={() => this.inputFreq(`5`)}><span>5</span> <img src={png["button"]} alt=""/></div>
                <div onClick={() => this.inputFreq(`6`)}><span>6</span> <img src={png["button"]} alt=""/></div>
                <div onClick={() => this.inputFreq(`7`)}><span>7</span> <img src={png["button"]} alt=""/></div>
                <div onClick={() => this.inputFreq(`8`)}><span>8</span> <img src={png["button"]} alt=""/></div>
                <div onClick={() => this.inputFreq(`9`)}><span>9</span> <img src={png["button"]} alt=""/></div>
                <div onClick={() => this.inputFreq(`.`)}><span>.</span><img src={png["button"]} alt=""/></div>
                <div onClick={() => this.inputFreq(`0`)}><span>0</span> <img src={png["button"]} alt=""/></div>
                <div onClick={() => this.minusFreq()}><span>-</span> <img src={png["button"]} alt=""/></div>
            </div>

        </div>
    }
}

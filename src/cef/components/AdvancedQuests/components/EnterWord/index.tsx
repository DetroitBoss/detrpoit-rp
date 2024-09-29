import {Component} from "react";
import React from "react";

import "./style.less"

import svg from "./assets/*.svg"
import png from "./assets/*.png"
import {CEF} from "../../../../modules/CEF";
import {CustomEvent} from "../../../../modules/custom.event";

export class EnterWord extends Component<{}, {
    inputRef: React.RefObject<any>
}> {
    constructor(props: any) {
        super(props);

        this.state = {
            inputRef: React.createRef()
        }
    }

    exit() {
        CEF.gui.setGui(null);
    }

    send() {
        const value = this.state.inputRef.current.value ? this.state.inputRef.current.value : '';
        CustomEvent.triggerServer('advancedQuests:enterWord', value);
        CEF.gui.setGui(null);
    }

    render() {
        return <div className="inputScreen">

            <img src={svg["background"]} alt="" className="inputScreen__background"/>
            <img src={png["ellipse"]} alt="" className="inputScreen__ellipse"/>

            <div className="inputScreen__blur"/>

            <div className="inputScreen__title">Введите слово</div>



            <input ref={this.state.inputRef} type="text" className="inputScreen__input"/>

            <div className="inputScreen__buttons">
                <div onClick={() => this.send()}>Подтвердить</div>
                <div onClick={() => this.exit()}>Отмена</div>
            </div>


        </div>
    }
}
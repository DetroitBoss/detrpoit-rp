import React, {Component} from "react";
import "./style.less";

import png from "./assets/*.png"
import svg from "./assets/*.svg"

import {LockGame} from "./components/LockGame"
import {ChestGame} from "./components/ChestGame"
import {NetGame} from "./components/NetGame"
import {CEF} from "../../modules/CEF";
import {DivingGameComponent} from "../../../shared/diving/minigames.config";
import {CustomEvent} from "../../modules/custom.event";
import {CustomEventHandler} from "../../../shared/custom.event";


export class DivingGames extends Component<{}, {
    component: DivingGameComponent
}> {
    ev: CustomEventHandler

    constructor(props: any) {
        super(props);

        this.state = {
            component: null
        }

        this.ev = CustomEvent.register('divingGame:setComponent',
            (component: DivingGameComponent) => this.setState({...this.state, component}));
    }

    componentWillUnmount() {
        this.ev.destroy();
    }

    private static close() {
        CEF.gui.setGui(null);
        CustomEvent.triggerClient('diving:unfreeze');
    }

    render() {
        return <div className="divingGame">

            {this.state.component !== null && <>
                <img src={svg["background"]} alt="" className="divingGame__background"/>

                <div className="exit" onClick={() => DivingGames.close()}>
                    <div className="exit__icon"><img src={svg["closeIcon"]} alt="#"/></div>
                    <div className="exit__title">Закрыть</div>
                </div>
            </>}

            {this.state.component === "lock" && <LockGame/>}
            {this.state.component === "chest" && <ChestGame/>}
            {this.state.component === "net" && <NetGame/>}

        </div>
    }

}
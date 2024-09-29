import {Insulator} from "./components/Insulator"
import {Wires} from "./components/Wires"
import {Diagram} from "./components/Diagram"

import React, {Component} from "react";
import "./style.less";
import {CustomEvent} from "../../modules/custom.event";
import {CustomEventHandler} from "../../../shared/custom.event";

import {GameComponent} from "../../../shared/jobs/electrician/config";

export class ElectricianGames extends Component<{}, {
    component: GameComponent
}> {

    ev: CustomEventHandler
    constructor(props: any) {
        super(props);

        this.state = {
            component: "wires"
        }

        this.ev = CustomEvent.register("electricianGames:setComponent", (component: GameComponent) => {
            this.setState({component});
        });
    }

    componentWillUnmount() {
        if (this.ev) this.ev.destroy();
    }


    render() {
        return <>
            {this.state.component === "insulator" && <Insulator/>}
            {this.state.component === "wires" && <Wires/>}
            {this.state.component === "diagram" && <Diagram />}
        </>
    }
}
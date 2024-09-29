import {Shop} from "./components/Shop"
import {Entrance} from "./components/Entrance";
import {Dots} from "./components/Dots";

import React, {Component} from "react";
import "./style.less";

// @ts-ignore
import png from './assets/*.png'
// @ts-ignore
import svg from "./assets/*.svg"
import { CustomEvent } from '../../modules/custom.event'
import { FarmUiComponent } from '../../../shared/farm/dtos'
import { CustomEventHandler } from '../../../shared/custom.event'
import { Statistic } from './components/Statistic'
import { Rating } from './components/Rating'
import { Can } from './components/Game/Can'
import { Milk } from './components/Game/Milk'
import { Best } from './components/Best'

export class Farm extends Component<{}, {
    component: FarmUiComponent
}> {
    ev: CustomEventHandler;
    constructor(props: any) {
        super(props);

        this.state = {
            component: "dots"
        }
        this.ev = CustomEvent.register('farm:setComponent', (component: FarmUiComponent) => {
            this.setState({
                component
            })
        })
    }

    componentWillUnmount = () => {
        if (this.ev)
            this.ev.destroy();
    }

    render() {
        return <div className="farm">
            {this.state.component === "shop" && <Shop/>}
            {this.state.component === "entrance" && <Entrance/>}
            {this.state.component === "dots" && <Dots/>}
            {this.state.component === "statistic" && <Statistic/>}
            {this.state.component === "rating" && <Rating/>}
            {this.state.component === "milk" && <Milk/>}
            {this.state.component === "can" && <Can/>}
            {this.state.component === "best" && <Best/>}
        </div>
    }
}
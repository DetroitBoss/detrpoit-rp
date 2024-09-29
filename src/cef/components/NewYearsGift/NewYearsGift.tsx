import React, {Component} from "react";
import "./style.less"

import {SendGift} from "./components/SendGift";
import { GetGift } from './components/GetGift'

export type GiftUiComponent = "send" | "get";

export class NewYearsGift extends Component<{}, {
    component: GiftUiComponent
}> {
    constructor(props: any) {
        super(props);

        this.state = {
            component: "get" // send && get
        }
    }

    render() {
        return <>
            {this.state.component === "send" && <SendGift />}
            {this.state.component === "get" && <GetGift />}
        </>
    }

}
import React from "react";
import "./style.less";

import {Radar} from "./components/Radar";
import {Dispatching} from "./components/Dispatching";
import {Citizens} from "./components/Citizens";
import {Transport} from "./components/Transport";
import {Wanted} from "./components/Wanted";

import png from "../../assets/*.png";
import svg from "../../assets/*.svg";
import classNames from "classnames";
import {IFractionData} from "../../../../../../../shared/fractions/ranks";
import {fractionCfg} from "../../../../../../modules/fractions";

export class Government extends React.Component<{
    fractionData: IFractionData
    activateTrack: Function
}, {
    page: string
}> {

    constructor(props: any) {
        super(props);

        this.state = {
            page: "radar"
        }
    }

    switchPage(el: string) {
        this.setState({page: el})
    }

    render() {
        return <div className="government">

            <div className="government-navigation">
                <div onClick={() => {
                    this.switchPage("radar")
                }} className={classNames(
                    {'government-navigation__active': this.state.page === "radar"}
                )}>GPS маяк
                </div>

                <div onClick={() => {
                    this.switchPage("dispatching")
                }} className={classNames(
                    {'government-navigation__active': this.state.page === "dispatching"}
                )}>Диспетчерская
                </div>

                {fractionCfg.getFraction(this.props.fractionData.id).police && <><div onClick={() => {
                    this.switchPage("citizens")
                }} className={classNames(
                    {'government-navigation__active': this.state.page === "citizens"}
                )}>База граждан
                </div>

                <div onClick={() => {
                    this.switchPage("transport")
                }} className={classNames(
                    {'government-navigation__active': this.state.page === "transport"}
                )}>База транспорта
                </div></>}

                <div onClick={() => {
                    this.switchPage("wanted")
                }} className={classNames(
                    {'government-navigation__active': this.state.page === "wanted"}
                )}>В розыске</div>

            </div>

            {this.state.page === "radar" && <Radar fractionData={this.props.fractionData}
                                                   activateTrack={this.props.activateTrack}/>}
            {this.state.page === "dispatching" && <Dispatching fractionData={this.props.fractionData}/>}
            {this.state.page === "citizens" && <Citizens fractionData={this.props.fractionData}/>}
            {this.state.page === "transport" && <Transport/>}
            {this.state.page === "wanted" && <Wanted/>}
        </div>
    }
}
import React, {Component} from 'react';
import ReactTooltip from 'react-tooltip';
import {systemUtil} from "../../../shared/system";

export class TooltipClass extends Component<{ text: string, place?: "top"|"right"|"bottom"|"left", type?:"dark"|"success"|"warning"|"error"|"info"|"light", effect?:"float"|"solid", html?:boolean }, {
    id: string
}> {

    constructor(props: any) {
        super(props);
        this.state = {
            id: systemUtil.randomStr(10)
        }
    }

    get id(){
        return this.state.id
    }

    get place(){
        return this.props.place || "top"
    }

    get type(){
        return this.props.type || "dark"
    }

    get effect(){
        return this.props.effect || "float"
    }

    get html(){
        return typeof this.props.html === "boolean" ? this.props.html : false
    }

    render() {
        return <>
            <section data-tip data-for={this.id}>{this.props.children}</section>
            <ReactTooltip className={'tippy-box'} id={this.id} place={this.place} type={this.type} effect={this.effect} html={this.html}>{this.props.text}</ReactTooltip>
        </>;
    }
}
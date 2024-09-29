import React, {Component, createRef} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import {CustomEventSocket} from "../../modules/socket.io";
import $ from 'jquery';

export class AnimateNumber extends Component<{
    number: number,
    speed: number
}, {number: number}> {
    int: any;
    constructor(props: any) {
        super(props);
        this.state = {
            number: 0
        }
        this.int = setInterval(() => {
            if(this.state.number < this.props.number) return this.setState({number: Math.min(this.state.number + 1, this.props.number)})
            if(this.state.number > this.props.number) return this.setState({number: Math.max(this.state.number - 1, this.props.number)})
        }, this.props.speed)
    }
    componentWillUnmount(){
        if(this.int) clearInterval(this.int);
        this.int = null;
    }
    render() {
        return <>{this.state.number}</>;
    }
}
import './style.less';
import React, {Component} from 'react';
import $ from 'jquery';
import {CustomEvent} from '../../modules/custom.event';
import {CustomEventHandler} from '../../../shared/custom.event';

// @ts-ignore
import ProgressBar from 'progressbar.js';

export class HudInteractClass extends Component<{}, {
    key: string,
    text: string,
}> {
    ev: CustomEventHandler;
    ev2: CustomEventHandler;
    progress: any;
    up = false;
    constructor(props: any) {
        super(props);

        this.state = {
            key: null,
            text: null,
        }

        this.ev = CustomEvent.register('cef:alert:setHelpKey', (key, text) => {
            this.setState({key, text});
        });
        this.ev2 = CustomEvent.register('cef:alert:removeHelpKey', () => {
            this.setState({key: null});
        });
        
        setInterval(() => {
            if(!this.progress) return;
            this.progress.animate(this.up ? 1.0 : 0.0);
            this.up = !this.up;
        }, 1401)
    }

    componentWillUnmount(){
        if(this.ev) this.ev.destroy();
        if(this.ev2) this.ev2.destroy();
    }
    componentDidUpdate(){
        if (!this.progress && $(`#interactionprogress`)) {
            this.progress = new ProgressBar.Circle(`#interactionprogress`, {
                strokeWidth: 2,
                easing: 'easeInOut',
                duration: 1400,
                color: '#ffffff',
                trailColor: 'rgba(255, 255, 255, 0)',
                trailWidth: 2,
                svgStyle: null
            })
        }
    }


    render() {
        return <div className="hud-interaction-wrapper" style={{ display: this.state.key ? 'flex' : 'none'}}>
            <div className="circle-wrap">
                <div id="interactionprogress" className="rotationer"></div>
                <div className="circle-small"></div>
                <p>{this.state.key}</p>
            </div>
            <p className="p-value">{this.state.text}</p>
        </div>
    }
};
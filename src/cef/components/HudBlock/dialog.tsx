import './style.less';
import React, {Component} from 'react';

import {CustomEvent} from '../../modules/custom.event';

export class HudDialogClass extends Component<{}, {
    id?: number, text?: string, time?: number, accept?: string, cancel?: string, activeButton: number
}> {
    int: NodeJS.Timeout;
    constructor(props: any) {
        super(props);

        this.state = {
            activeButton: 1
        }

        CustomEvent.register('dialog:accept', (id: number, type: "big" | "small", text: string, time: number = 5000, accept: string = "Да", cancel: string = "Нет") => {
            if(type !== "big") return;
            this.setState({ id, text, time, accept, cancel });
            //document.addEventListener("keypress", this.handleKeyUp)
            if(this.int){
                clearTimeout(this.int)
                this.int = null;
            }
            this.int = setTimeout(() => {
                CustomEvent.triggerClient('dialog:accept:status', id, false)
            }, time)
        })
        CustomEvent.register('dialog:accept:destroyBig', this.destroy)
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.destroy = this.destroy.bind(this);
    }
    
    destroy() {
        this.setState({ id: null, activeButton: 1 })
        if (this.int) {
            clearTimeout(this.int)
            this.int = null;
        }
        CustomEvent.trigger('dialog:accept:closed')
        //document.removeEventListener("keyup", this.handleKeyUp)
    }
    
    handleKeyUp = (e: any) => {
        if (this.state.id === null) return;
        e.preventDefault();
        if (e.keyCode == 37) {
            this.setState({activeButton: 1});
        }
        else if (e.keyCode == 39) {
            this.setState({activeButton: 0});
        }
        else if (e.keyCode == 13) {
            CustomEvent.triggerClient('dialog:accept:status', this.state.id, !!this.state.activeButton)
            this.destroy()
        }
    }
    componentDidMount() {
       document.addEventListener("keydown", this.handleKeyUp)
    }

    componentWillUnmount() {
       document.removeEventListener("keydown", this.handleKeyUp)
    }

    render() {
        if (!this.state.id) return <></>;
        return <div className="hud-big-dialog">
            {this.state.id ? <div className="big-dialog-wrapper">
                <div className="bg-blur-smal-dialog"></div>
                <div className="big-dialog-wrap">
                    <p className="p-title">{this.state.text}</p>
                    <div className="button-wrap">
                        {this.state.accept ? <button className={this.state.activeButton === 1 
                            ?'hud-dialog-btn' : 'btn-white-transparent'} onClick={e => {
                            e.preventDefault();
                            CustomEvent.triggerClient('dialog:accept:status', this.state.id, true)
                            this.destroy()
                        }}>
                            <p>{this.state.accept}</p>
                        </button> : <></>}
                        {this.state.cancel ? <button className={this.state.activeButton === 0 
                            ? 'hud-dialog-btn' : 'btn-white-transparent'} onClick={e => {
                            e.preventDefault();
                            CustomEvent.triggerClient('dialog:accept:status', this.state.id, false)
                            this.destroy()
                        }}>
                            <p>{this.state.cancel}</p>
                        </button> : <></>}
                        
                    </div>
                </div>
            </div> : <></>}

        </div>
    }
};
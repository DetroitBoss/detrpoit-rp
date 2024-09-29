import './style.less';
import React, {Component} from 'react';
import svgs from './images/svg/*.svg'
import {CustomEventHandler} from '../../../shared/custom.event';
import {CustomEvent} from "../../modules/custom.event";
import {defaultHotkeys, getKeyName} from "../../../shared/hotkeys";

export class HudHotkeysClass extends Component<{}, { keys:Array<{key:keyof typeof defaultHotkeys, pic:string}>, data?: typeof defaultHotkeys, show: boolean }> {
    ev: CustomEventHandler;
    constructor(props: any) {
        super(props);

        this.state = {
            show: true,
            keys: [ {key:"voice", pic:"hot_voice"},
                    {key:"gpress", pic:"hot_inter"},
                    {key:"mmenu", pic:"hot_menu"},
                    {key:"invopen", pic:"hot_inv"},
                    {key:"cursor", pic:"hot_cursor"}]
        };

        this.ev = CustomEvent.register('currentHotkeys', ((data: typeof defaultHotkeys, show = true) => {
            this.setState({data, show})
        }))


    }

    componentWillUnmount(){
        if(this.ev) this.ev.destroy();
    }



    render() {
        if(!this.state.data) return <></>
        if(!this.state.show) return <></>
        return <div className="value-key-location-wrap">
            <div className="bg-blur-value-key-location"></div>
            {this.state.keys.map( (data) => {
                return <div className="value-key-location-item" key={`hotkey_help_${data.key}`}>
                    <p className="p-value">{getKeyName(this.state.data[data.key])}</p>
                    <div className="icon-wrap">
                        <img src={svgs[data.pic]} width="24" height="24" />
                    </div>
                </div>
            })}
        </div>
    }
};
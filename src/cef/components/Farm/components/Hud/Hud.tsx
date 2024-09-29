import React, {Component} from "react";

// @ts-ignore
import png from './assets/*.png'
// @ts-ignore
import svg from "./assets/*.svg"
import { CustomEventHandler } from '../../../../../shared/custom.event'
import { CustomEvent } from '../../../../modules/custom.event'
import { ActivityType, FieldStage } from '../../../../../shared/farm/config'


export class Hud extends Component<{}, {
    show: boolean
    stage: 0 | 1 | 2
    activity: string
}> {
    _ev: CustomEventHandler
    _ev2: CustomEventHandler
    constructor(props: any) {
        super(props);

        this.state = {
            stage: 2,
            show: false,
            activity: 'Greenhouse'
        }
        
        this._ev = CustomEvent.register('farmHud:show', (activity: ActivityType, stage: FieldStage) => {
            this.setState({
                show: true,
                stage: stage,
                activity: ActivityType[activity].toString()
            })
        })
        this._ev2 = CustomEvent.register('farmHud:hide', () => {
            this.setState({
                show: false
            })
        })
    }

    public componentWillUnmount() {
        if (this._ev) this._ev.destroy
        if (this._ev2) this._ev2.destroy
    }

    render() {
        if( !this.state.show ) return null;
        return <div className="farm-hud">
            <img src={svg[`${this.state.activity + this.state.stage}`]} className="farm-hud__stage" alt=""/>
        </div>
    }
}
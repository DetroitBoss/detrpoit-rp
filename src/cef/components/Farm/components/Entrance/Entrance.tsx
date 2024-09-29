import React, { Component } from "react";

import { FieldOwner } from './components/FieldOwner'
import { GreenhouseOwner } from './components/GreenhouseOwner'
import { CattleOwner } from './components/CattleOwner'

import { FieldWorker } from './components/FieldWorker'
import { GreenhouseWorker } from './components/GreenhouseWorker'
import { CattleWorker } from './components/CattleWorker'

// @ts-ignore
import png from './assets/*.png'
// @ts-ignore
import svg from "./assets/*.svg"

import "../../style.less";
import { CustomEvent } from '../../../../modules/custom.event'
import { EntranceComponent } from '../../../../../shared/farm/dtos'
import { ACTIVITY_RENT_TIME_IN_HOURS, FarmerLevel } from '../../../../../shared/farm/progress.config'
import { systemUtil } from '../../../../../shared/system'
import { GreenhouseReady } from './components/GreenhouseReady'
import { CattleReady } from './components/CattleReady'
import { FieldReady } from './components/FieldReady'
import { CustomEventHandler } from '../../../../../shared/custom.event'

export interface IEntranceWorkerData {
    id: number
    ownerName: string
    level: FarmerLevel
    rentTime: [number, number]
    salary: number
}

export class Entrance extends Component<{}, {
    id?: number
    component: EntranceComponent
    workerData: IEntranceWorkerData
}> {
    _ev1: CustomEventHandler
    _ev2: CustomEventHandler
    constructor(props: any) {
        super(props);

        this.state = {
            workerData: {
                id: 0,
                ownerName: 'Kirill Perchik',
                level: FarmerLevel.First,
                rentTime: [1, 20],
                salary: 500
            },
            component: "CattleOwner"
        }

        this._ev1 = CustomEvent.register('farm:entrance:rent', (component: EntranceComponent, id: number) => {
            this.setState({
                component,
                id
            })
        })
        
        this._ev2 = CustomEvent.register('farm:entrance:worker', (
            component: EntranceComponent,
            id: number,
            ownerName: string,
            rentedAt: number,
            salary,
            level: FarmerLevel) => {
            this.setState({
                component,
                workerData: {
                    id,
                    level,
                    rentTime: [Math.floor(((rentedAt + ACTIVITY_RENT_TIME_IN_HOURS * 3600) - systemUtil.timestamp) / 3600),
                        Math.floor(((rentedAt + ACTIVITY_RENT_TIME_IN_HOURS * 3600) - systemUtil.timestamp) % 3600 / 60)],
                    ownerName,
                    salary
                }
            })
        })
    }

    public componentWillUnmount() {
        if (this._ev2) this._ev2.destroy
        if (this._ev1) this._ev1.destroy
    }

    render() {
        return <div className="farm-entrance">

            <img src={png["logo"]} className="farm-entrance__logo" alt=""/>
            <img src={png["dot"]} className="farm-entrance__dot" alt=""/>

            <div className="farm-entrance-block">
                <img src={svg["block"]} className="farm-entrance-block__background" alt=""/>

                {this.state.component === "FieldOwner" && <FieldOwner id={this.state.id}/>}
                {this.state.component === "GreenhouseOwner" && <GreenhouseOwner id={this.state.id}/>}
                {this.state.component === "CattleOwner" && <CattleOwner id={this.state.id}/>}
                
                {this.state.component === "FieldWorker" && <FieldWorker data={this.state.workerData}/>}
                {this.state.component === "GreenhouseWorker" && <GreenhouseWorker data={this.state.workerData}/>}
                {this.state.component === "CattleWorker" && <CattleWorker data={this.state.workerData}/>}

                {this.state.component === "FieldReady" && <FieldReady/>}
                {this.state.component === "CattleReady" && <CattleReady/>}
                {this.state.component === "GreenhouseReady" && <GreenhouseReady/>}
            </div>
        </div>
    }
}
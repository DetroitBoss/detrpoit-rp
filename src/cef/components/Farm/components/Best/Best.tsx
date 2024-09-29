import React, {Component} from "react";

// @ts-ignore
import png from './assets/*.png'
// @ts-ignore
import svg from "./assets/*.svg"

import "../../style.less";
import { CEF } from '../../../../modules/CEF'
import { IBestFarmer } from '../../../../../shared/farm/dtos'
import { CustomEventHandler } from '../../../../../shared/custom.event'
import { CustomEvent } from '../../../../modules/custom.event'

export class Best extends Component<{}, {
    bestFarmers: IBestFarmer[]
}> {
    _ev: CustomEventHandler
    constructor(props: any) {
        super(props);
        
        this.state = {
            bestFarmers: [
                {
                    id: 1,
                    name: 'TEst Test',
                    exp: 12
                },
                {
                    id: 1,
                    name: 'TEst Test',
                    exp: 12
                },
                {
                    id: 1,
                    name: 'TEst Test',
                    exp: 12
                },
            ]
        }
        
        this._ev = CustomEvent.register('farm:best:init', (data: IBestFarmer[]) => {
            this.setState({
                bestFarmers: data
            })
        })
    }

    close() {
        CEF.gui.setGui(null)
    }

    render() {
        return <div className="farm-best">

            <div className="exit" onClick={() => this.close()}>
                <div className="exit__icon"><img src={svg["closeIcon"]} alt="#"/></div>
                <div className="exit__title">Закрыть</div>
            </div>

            <div className="farm-best-content">

                <img src={png["background"]} alt="" className="farm-best-content__background"/>

                <div className="farm-best-content-block farm-best-content-block_0">

                    <div className="farm-best-content-block__id">ID: {this.state.bestFarmers[0].id}</div>
                    <div className="farm-best-content-block__name">{this.state.bestFarmers[0].name}</div>
                    <div className="farm-best-content-block__exp">{this.state.bestFarmers[0].exp}<span>exp</span></div>

                </div>

                <div className="farm-best-content-block farm-best-content-block_1">

                    <div className="farm-best-content-block__id">ID: {this.state.bestFarmers[1].id}</div>
                    <div className="farm-best-content-block__name">{this.state.bestFarmers[1].name}</div>
                    <div className="farm-best-content-block__exp">{this.state.bestFarmers[1].exp}<span>exp</span></div>
                </div>

                <div className="farm-best-content-block farm-best-content-block_2">

                    <div className="farm-best-content-block__id">ID: {this.state.bestFarmers[2].id}</div>
                    <div className="farm-best-content-block__name">{this.state.bestFarmers[2].name}</div>
                    <div className="farm-best-content-block__exp">{this.state.bestFarmers[2].exp}<span>exp</span></div>
                </div>

            </div>


        </div>
    }
}
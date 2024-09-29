import React, {Component} from "react";
import "./style.less";

import fishIcon from "../assets/images/fishIcon.png";
import { CustomEvent } from '../../../modules/custom.event'
import { FISHER_LEVEL, FISHER_LEVELS_EXP_TO_ACHIEVE, FISHES } from '../../../../shared/fish'
import { inventoryShared } from '../../../../shared/inventory'

interface IFish {
    id: number
    name: string,
    value: number
}

export class FishStats extends Component<{}, {
    show: boolean,
    lvl: number,
    exp: number,
    maxExp: number,
    fishes: IFish[]
}> {
    constructor(props: any) {
        super(props);

        this.state = {
            show: false,
            lvl: 0,
            exp: 0,
            maxExp: 0,
            fishes: FISHES.map(f => {
                return {
                    id: f.itemId,
                    name: inventoryShared.get(f.itemId).name,
                    value: 0
                }
            })
            
        }
        
        CustomEvent.register('fish:stats:enable', (level: FISHER_LEVEL, exp: number, stats: {[p: number]: number}) => {
            const fishesTemp = this.state.fishes
            fishesTemp.map(f => {
                f.value = stats[f.id] ?? 0
            })
            
            this.setState({
                show: true,
                lvl: level,
                exp: exp,
                fishes: fishesTemp,
                maxExp: FISHER_LEVELS_EXP_TO_ACHIEVE.find(el => el[0] == level + 1)[1]
            })
        })

        CustomEvent.register('fish:stats:disable', () => {
            this.setState({
                show: false,
            })
        })
    }

    render() {
        return <div className="fishStats" style={{display: this.state.show ? null : 'none'}}>

            <div className="fishStats__level">
                {this.state.lvl} lvl <div>{this.state.exp}/{this.state.maxExp}exp</div>
            </div>

            <div className="fishStats__br"/>

            {this.state.fishes.map((fish, key) => {
                return <div className="fishStats__fish" key={key} style={{opacity: fish.value <1 ? 0.6 : null}}>
                    <div>{fish.name}</div>
                    <div>{fish.value} <img src={fishIcon} alt=""/></div>
                </div>
            })}

        </div>
    }
}
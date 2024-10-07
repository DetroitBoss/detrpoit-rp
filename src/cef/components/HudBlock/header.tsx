import './style.less';
import React, {Component} from 'react';
import svgs from './images/svg/*.svg'
import {HudQuestClass} from './quest';
import {CEF} from '../../modules/CEF';
import {CustomEvent} from '../../modules/custom.event';
import iconsItems from '../../../shared/icons/*.png';
import {system} from "../../modules/system";
import {JailMission} from "./JailMission"
import { StorageAlertData } from '../../../shared/alertsSettings'

export class HudHeaderClass extends Component<{
    alertsData: StorageAlertData
}, {
    date?: string
    online?: number
    isAdmin?: boolean
    realHour?: number
    realMinutes?: number
    weapon?: {
        magazines: number[],
        weapon: number,
        ammo: number,
        maxMagazine: number
    }
}> {
    constructor(props: any) {
        super(props);

        this.state = {}

        CustomEvent.register('hud:data', (date: string, time1: string, time2: string, online: number, isAdmin: boolean, id: number, realHour: number, realMinutes: number) => {
            this.setState({ date, online, isAdmin, realHour, realMinutes });
            CEF.setId(id);
            CEF.setAdmin(isAdmin);
        });

        CustomEvent.register('hud:weapon', (weapon: {
            magazines: number[],
            weapon: number,
            ammo: number,
            maxMagazine: number
        }) => {
            this.setState({weapon});
        })

        CustomEvent.register('hud:ammo', (ammo: number) => {
            if(!this.state.weapon) return;
            this.setState({weapon: {...this.state.weapon, ammo}});
        })
    }


    get totalMagazineAmmo(){
        if(!this.state.weapon) return 0;
        let sum = 0;
        this.state.weapon.magazines.map(q => sum += q);
        return sum
    }
    render() {
        return <div className="hud-top-right">


            <div className="hud-main-info">
            {this.state.isAdmin ? <div className="hud-main-info-admin">
            <p className="p-admin">admin</p>
            {/* <p className="p-admin">admin</p> */}
                </div> : <></>}
                <div className="hud-main-info-date">
                    <p className="p-date">{this.state.date} {this.state.realHour < 10 ? '   0' : ''}{this.state.realHour}:{this.state.realMinutes < 10 ? '0' : ''}{this.state.realMinutes}</p>
                </div>
                <div className="hud-main-info-extra">
                    <div className="hud-mount-user">
                        <img src={svgs['user-hud']} width="24" height="24" />
                        <div className="text-wrap">
                            <p>{this.state.online}</p>
                            <p>1 500</p>
                        </div>
                    </div>
                    <p className="p-id">id <span>{CEF.id}</span></p>
                    <div className="mini-logo">
                        <img src={svgs['mini-logo']} width="36" height="36" />
                    </div>
                </div>
            </div>
            {this.state.weapon ? <div className="magazine-gun">
                {/* <div className="fullness-magazine-wrap">*/}
                {/*    {system.sortArray([...this.state.weapon.magazines], "ASC").map(magazine => {*/}
                {/*        if(!magazine) return <div className="fullness-magazine-item empty" />*/}
                {/*        if(magazine === this.state.weapon.maxMagazine) return <div className="fullness-magazine-item full" />*/}
                {/*        return <div className="fullness-magazine-item half" />*/}
                {/*    })}*/}
                {/*</div> */}
                <div className="magazine-wrapper">
                    <div className="bullets-wrap">
                        <img src={svgs['bullets']} width="24" height="24" />
                    </div>
                    <div className="nums-wrap">
                        <p className="p-big">{this.state.weapon.ammo}</p>
                        <p className="p-of">{this.totalMagazineAmmo}</p>
                    </div>
                    <div className="img-gun-wrap">
                        <img src={iconsItems['Item_'+this.state.weapon.weapon]} width="24" height="24" />
                    </div>
                </div>
            </div> : <></>}
            <JailMission/>
            <HudQuestClass alertsData={this.props.alertsData} />
        </div>
    }
};
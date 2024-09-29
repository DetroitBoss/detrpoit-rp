import './style.less';
import React, {Component} from 'react';
import svgs from './images/svg/*.svg'
import {HudHeaderClass} from './header';
import {HudSpeedometerClass} from './speedometer';
import {HudBottomClass} from './bottom';
import {HudInteractClass} from './interact';
import {HudAlertsClass} from './alerts';
import {HudChatClass} from './chat';
import {CEF} from '../../modules/CEF';
import {CustomEvent} from '../../modules/custom.event';
import {HudHotkeysClass} from './hotkeys';
import {HudDialogClass} from './dialog';
import {HudMoneyGame} from './boxgame';
import {HudPayDay} from './payday';
import {HudFamily} from './family';
import {HudActions} from './action';
import { HudIslandBattle } from './hudIslandBattle';

import {TimerClass} from "./barblocks";
import {FlatHud} from './flat';
import { FarmJobHud } from './farmJob'
import { Hud } from '../Farm/components/Hud'
import { FishCatching } from '../Fishing/catching/catch'
import { FishThrowing } from '../Fishing/throwing/throwing'
import { HudCrosshair } from './crosshair/crosshair'
import { FishPulling } from '../Fishing/pulling/pulling'
import { FishStats } from '../Fishing/hud/stats'
import { HudGunGame } from './hudGunGame'
import { DeathPopUp } from './DeathPopUp';
import CrosshairStore from "../../stores/Crosshair";
import HudGunGameStore from '../../stores/HudGunGame';
import { HudOxygen } from './hudOxygen';
import { HudSnowWar } from './hudSnowWar';
import { StorageAlertData } from '../../../shared/alertsSettings'
import IslandBattleStore from "../../stores/IslandBattle";
import {observer} from "mobx-react";
import {JailMission} from "./JailMission";

@observer export class HudClass extends Component<{
    alertsData: StorageAlertData,
    CrosshairStore: CrosshairStore,
    HudGunGameStore: HudGunGameStore,
    IslandBattleStore: IslandBattleStore
}, { showHud: boolean, style: React.CSSProperties, showHelp?: string, bigAlert?: [string, string],
    showDeathPopUp: boolean
}> {
    constructor(props: any) {
        super(props);

        this.state = {
            showDeathPopUp: false,
            style: {},
            showHud: CEF.test && (location.href.includes("=hud"))
        }
        CEF.hud.showHud = (show: boolean) => {
            this.setState({showHud: show});
        };


        CustomEvent.register('cef:hud:showHud', (show: boolean) => {
            this.setState({showHud: show});
        });

        CustomEvent.register('cef:alert:setSafezoneInfo', (width: number, height: number, left: number, bottom: number) => {
            this.setState({
                style: {
                    width: `${width}px`,
                    bottom: `${height + bottom + 25}px`,
                    left: `${left}px`,
                    display: 'block',
                    position: 'absolute'
                }
            })
        });


        CustomEvent.register('cef:showHelp', (text: string) => {
            this.setState({showHelp: text})
        })
        CustomEvent.register('cef:notifyBig', (title: string, text: string, time: number) => {
            this.setState({bigAlert: [title, text]}, () => {
                setTimeout(() => {
                    if (!this.state.bigAlert || this.state.bigAlert[0] !== title || this.state.bigAlert[1] !== text) return;
                    this.setState({bigAlert: null})
                }, time)
            })
        })

        CustomEvent.register('deathpopup:show', (show: boolean) => {
            this.setState({showDeathPopUp: show});
        });
    }

    render() {
        return <>
            <div style={this.state.style} className="hud-advice-wrap">
                <HudAlertsClass/>
            </div>
            <section className="hud"
                     style={{opacity: this.state.showHud ? 1 : 0, display: this.state.showHud ? 'block' : 'none'}}>
                <HudMoneyGame/>
                <HudFamily/>
                <HudPayDay/>
                <FlatHud/>
                <FarmJobHud/>
                <HudActions/>
                <Hud/>
                {this.state.showDeathPopUp && <DeathPopUp/>}

                <div className="bg-radial-top-left-hud"/>
                <div className="bg-radial-top-right-hud"/>
                <div className="bg-radial-bottom-right-hud"/>

                <div className="hud-top-left">
                    <HudChatClass alertsData={this.props.alertsData}/>
                </div>

                <HudCrosshair store={this.props.CrosshairStore}/>
                <FishThrowing/>
                <FishCatching/>
                <FishPulling/>
                <FishStats/>

                <HudBottomClass/>
                <HudInteractClass/>
                <HudHeaderClass alertsData={this.props.alertsData}/>
                <HudDialogClass/>

                <HudGunGame store={this.props.HudGunGameStore}/>
                
                <HudOxygen/>
                {this.props.IslandBattleStore.show && <HudIslandBattle store={this.props.IslandBattleStore}/>}


                <HudSnowWar/>

                <div className="hud-right-bottom">
                    <HudHotkeysClass/>
                    <TimerClass/>
                    <HudSpeedometerClass/>
                </div>

                {this.state.showHelp ? <div className="hud-notification-info-short">
                    <img src={svgs['info']} width="24" height="24" alt=""/>
                    <p>{this.state.showHelp}</p>
                </div> : <></>}
                {this.state.bigAlert ? <div className="hud-notification-info-big">
                    <p className="p-big">{this.state.bigAlert[0]}</p>
                    <p className="p-descr">{this.state.bigAlert[1]}</p>
                </div> : <></>}

            </section>
        </>
    }
}
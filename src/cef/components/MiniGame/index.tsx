import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import {MINIGAME_TYPE} from "../../../shared/minigame";
import {BoxGame} from "./Box";
import {BabloGame} from "./Bablo";
import {DrillGame} from "./Drill";
import {ProvodaGame} from "./Provoda";
import {SvarkaGame} from "./Svarka";
import {OrangeGame} from "./Orange";
import {ClipsGame} from "./Clips";
import {WaterGame} from './Water';
import {WindowGame} from './Window';
import {HammerGame} from './Hammer';
import {CollectGame} from "./CollectGame";
import {JailHammer} from "./JailHammer";
import {JailSewing} from "./JailSewing";
import {JailWashing} from "./JailWashing";
import {JailCooking} from "./JailCooking";
import {JailToilet} from "./JailToilet";

export class MiniGame extends Component<{}, {
    game?: MINIGAME_TYPE,
    id?:number,
    secondLimit?: number,
    ended: boolean
}> {
    timeout: any = null;

    get game(){
        return this.state.game
    }
    constructor(props: any) {
        super(props);
        this.state = {
            // game: MINIGAME_TYPE.GRASS,
            ended: true,
            game: null
        }
        CustomEvent.register('minigame:play', (game: MINIGAME_TYPE, id: number, secondLimit: number = 0) => {
            this.setState({game, id, secondLimit, ended: false}, () => {
                if(secondLimit){
                    this.timeout = setTimeout(() => {
                        if(this.state.id !== id) return;
                        this.sendStatus(false);
                    }, secondLimit * 1000)
                }
            })
        })
        CustomEvent.register('minigame:stop', () => {
            this.sendStatus(false)
        })
    }

    sendStatus(status: boolean){
        if(this.state.ended) return;
        if(this.timeout) {
            clearInterval(this.timeout);
            this.timeout = null;
        }
        this.setState({ended: true});
        setTimeout(() => {
            CustomEvent.triggerClient('minigame:status', this.state.id, status);
            this.setState({game: null, id: null, secondLimit: null});
        }, 100)
    }

    componentWillUnmount(){
        if (this.state.ended) return;
        if (this.timeout) {
            clearInterval(this.timeout);
            this.timeout = null;
        }
        CustomEvent.triggerClient('minigame:status', this.state.id, false);
    }

    render() {
        if(!this.game) return <></>;
        return <>
            {this.game === MINIGAME_TYPE.MONEY ? <BabloGame status={this.sendStatus.bind(this)} /> : <></>}
            {this.game === MINIGAME_TYPE.BOX ? <BoxGame status={this.sendStatus.bind(this)} /> : <></>}
            {this.game === MINIGAME_TYPE.DRILL ? <DrillGame status={this.sendStatus.bind(this)} /> : <></>}
            {this.game === MINIGAME_TYPE.WIRES ? <ProvodaGame status={this.sendStatus.bind(this)} /> : <></>}
            {this.game === MINIGAME_TYPE.SVARKA ? <SvarkaGame status={this.sendStatus.bind(this)} /> : <></>}
            {this.game === MINIGAME_TYPE.HAMMER ? <HammerGame status={this.sendStatus.bind(this)} /> : <></>}
            {this.game === MINIGAME_TYPE.ORANGE ? <OrangeGame status={this.sendStatus.bind(this)} /> : <></>}
            {this.game === MINIGAME_TYPE.SCISSORS ? <ClipsGame status={this.sendStatus.bind(this)} /> : <></>}
            {this.game === MINIGAME_TYPE.WATERPOT ? <WaterGame status={this.sendStatus.bind(this)} /> : <></>}
            {this.game === MINIGAME_TYPE.WINDOW ? <WindowGame status={this.sendStatus.bind(this)} /> : <></>}
            {this.game === MINIGAME_TYPE.BOX_GRASS ? <BoxGame status={this.sendStatus.bind(this)} type={1}/> : <></>}
            {this.game === MINIGAME_TYPE.SCISSORS_GRASS ? <ClipsGame status={this.sendStatus.bind(this)} type={1}/> : <></>}
            {this.game === MINIGAME_TYPE.GRASS ? <OrangeGame status={this.sendStatus.bind(this)} type={1}/> : <></>}
            {this.game === MINIGAME_TYPE.COLLECT_GAME ? <CollectGame status={this.sendStatus.bind(this)}/> : <></>}
            {this.game === MINIGAME_TYPE.JAILHAMMER ? <JailHammer status={this.sendStatus.bind(this)}/> : <></>}
            {this.game === MINIGAME_TYPE.JAILSEWING ? <JailSewing status={this.sendStatus.bind(this)}/> : <></>}
            {this.game === MINIGAME_TYPE.JAILWASHING ? <JailWashing status={this.sendStatus.bind(this)}/> : <></>}
            {this.game === MINIGAME_TYPE.JAILCOOKING ? <JailCooking status={this.sendStatus.bind(this)}/> : <></>}
            {this.game === MINIGAME_TYPE.JAILTOILET ? <JailToilet status={this.sendStatus.bind(this)} /> : <></>}
        </>;
    }
}


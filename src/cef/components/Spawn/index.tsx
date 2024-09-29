import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import './style.less'
import svg from './*.svg';
import png from './*.png';
import {CEF} from "../../modules/CEF";
import {CustomEventHandler} from "../../../shared/custom.event";
import { fractionCfg } from '../../modules/fractions';

export class SpawnScreen extends Component<{}, {
    select: number,
    show: boolean,
    canSpawnHouse: boolean,
    haveHouse: boolean,
    haveFamily: boolean,
    haveFamilyHouse: boolean,
    fraction: number,
    nextSpawnTime: number,
}> {
    private ev: CustomEventHandler;
    constructor(props: any) {
        super(props);
        this.state = {
            select: 0,
            show: CEF.test,
            canSpawnHouse: CEF.test,
            haveHouse: CEF.test,
            haveFamily: CEF.test,
            haveFamilyHouse: false,
            fraction: 0,
            nextSpawnTime: 0,
        }


        this.ev = CustomEvent.register('spawn:select', (
            canSpawnHouse: boolean,
            haveHouse: boolean,
            haveFamily: boolean,
            haveFamilyHouse: boolean,
            fraction: number,
            nextSpawnTime: number,
        ) => {
            this.setState({ canSpawnHouse, haveHouse, haveFamily, haveFamilyHouse, fraction, nextSpawnTime, show: true})
        })



    }

    componentWillUnmount(){
        if(this.ev) this.ev.destroy();
    }

    select(type: number){
        CustomEvent.triggerServer('spawn:select', type);
        CEF.gui.setGui(null)
    }

    get canHouse(){
        return this.state.canSpawnHouse && this.state.haveHouse
    }

    get canFamily(){
        return this.state.canSpawnHouse && this.state.haveFamily && this.state.haveFamilyHouse
    }

    get canFraction(){
        return this.state.canSpawnHouse && this.state.fraction && fractionCfg.getFraction(this.state.fraction).spawn
    }

    get rejectTimeText(){
        return `Будет доступно через ${this.state.nextSpawnTime} мин.`
    }

    render() {
        if(!this.state.show) return <></>;
        return <div className="overflow" style={{zIndex: 999999}}>
            <div className="spawn-grid">
                {/* {!this.state.home ? null: */}
                <div className={"spawn-item "+(this.state.select !== 0 ? '' : 'active')+(this.canHouse ? '' : 'disabled')} onMouseEnter={e => {
                    if(!this.canHouse) return;
                    this.setState({select: 0});
                }} onClick={e => {
                    if(!this.canHouse) return;
                    this.select(0)
                }}>
                    <i className="spawn-bg"><img src={png['spawn-1']} alt=""/></i>
                    <div className="bg-dark" />
                    <div className="spawn-content">
                        <div className="icon-wrap">
                            <img src={svg['home']} />
                        </div>
                        <p className="big mb32" style={{opacity: !this.canHouse ? 0.8 : 1.0 }}><span>Появиться</span> Дома</p>
                        {!this.canHouse ? <p className="big-info">{!this.state.haveHouse ? 'У вас нет дома' : this.rejectTimeText}</p> : <></>}
                    </div>
                    <div className="line-spawn" />
                </div>
                {/* } */}
                { !this.state.fraction ? null :
                <div className={"spawn-item "+(this.state.select !== 1 ? '' : 'active')+(this.canFraction ? '' : 'disabled')} onMouseEnter={e => {
                    if(!this.canFraction) return;
                    this.setState({select: 1});
                }} onClick={e => {
                    if(!this.canFraction) return;
                    this.select(1)
                }}>
                    <i className="spawn-bg"><img src={png['spawn-2']} alt=""/></i>
                    <div className="bg-dark" />
                    <div className="spawn-content">
                        <div className="icon-wrap">
                            <img src={svg['work']} />
                        </div>
                        <p className="big mb32" style={{opacity: !this.canFraction ? 0.8 : 1.0 }}><span>Появиться</span> в Организации</p>
                        {!this.canFraction ? <p className="big-info">{!(this.state.fraction && fractionCfg.getFraction(this.state.fraction).spawn) ? 'У вашей огранизации нет места спавна' : this.rejectTimeText}</p> : <></>}
                    </div>
                    <div className="line-spawn" />
                </div>}
                { !this.state.haveFamily ? null :
                <div className={"spawn-item "+(this.state.select !== 2 ? '' : 'active')+(this.canFamily ? '' : 'disabled')} onMouseEnter={e => {
                    if(!this.canFamily) return;
                    this.setState({select: 2});
                }} onClick={e => {
                    if(!this.canFamily) return;
                    this.select(2)
                }}>
                    <i className="spawn-bg"><img src={png['spawn-3']} alt=""/></i>
                    <div className="bg-dark" />
                    <div className="spawn-content">
                        <div className="icon-wrap">
                            <img src={svg['fam-fist']} />
                        </div>
                        <p className="big mb32" style={{opacity: !this.canFamily ? 0.8 : 1.0 }}><span>Появиться</span> в доме семьи</p>
                        {!this.canFamily ? <p className="big-info">{!this.state.haveFamilyHouse ? 'У вашей семьи нет дома' : this.rejectTimeText}</p> : <></>}
                    </div>
                    <div className="line-spawn" />
                </div>
                }
                <div className={"spawn-item "+(this.state.select !== 3 ? '' : 'active')} onMouseEnter={e => {
                    this.setState({select: 3});
                }}  onClick={e => {
                    this.select(3)
                }}>
                    <i className="spawn-bg"><img src={png['spawn-4']} alt=""/></i>
                    <div className="bg-dark" />
                    <div className="spawn-content">
                        <div className="icon-wrap">
                            <img src={svg['location']} />
                        </div>
                        <p className="big"><span>Появиться в</span> месте выхода</p>
                    </div>
                    <div className="line-spawn" />
                </div>
            </div>
        </div>
    }





}

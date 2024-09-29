import './style.less';
import React, {Component} from 'react';
import svgs from './images/svg/*.svg'
import {CustomEvent} from '../../modules/custom.event';
import {CustomEventHandler} from '../../../shared/custom.event';
import {systemUtil} from '../../../shared/system';


enum GameBoxType {
    START = 1,
    GET,
    FINISH
}

export class HudMoneyGame extends Component<{}, {
    type: GameBoxType, 
    player?: string, 
    time?: number
}> {
    ev: CustomEventHandler;
    mgTime: NodeJS.Timeout;
    constructor(props: any) {
        super(props);

        this.state = {
            type: null,//GameBoxType.FINISH,
//            time: 600,
//            player: 'Player Name'
        }
        this.ev = CustomEvent.register('hud:gamebox', (type: GameBoxType, player?: string, time?: number) => {
            this.setState( { ...this.state, type, player, time} );
            this.updateGameBox( type );
        })
//        this.updateGameBox( this.state.type );
    }

    updateGameBox = ( type: GameBoxType ) => {
        if( type == GameBoxType.START ) {
            if (this.mgTime) clearInterval(this.mgTime);
            this.mgTime = setInterval(() => {
                if (this.state.time > 0 )
                    this.setState( { ...this.state, time: this.state.time - 1 } );
                else 
                    this.hideGame();
            }, 1000);
        } 
        else if( type == GameBoxType.FINISH ) {
            if (this.mgTime) clearInterval(this.mgTime);
            setTimeout( () => {
                this.hideGame();
            }, 5000 );
        }
    }

    componentWillUnmount() {
        if (this.ev) this.ev.destroy();
        if (this.mgTime) clearInterval(this.mgTime);
    }
    hideGame = () => {
        if (this.mgTime) clearInterval(this.mgTime);
        this.setState( { time: 0,  type: null } );
    }
    render() {
        switch( this.state.type ) {
            case GameBoxType.START: {
                return <>
                    <div className="bonus-sumka">
                            <p><strong>доставьте сумку</strong></p>
                            <p><span>метка На карте</span></p>
                            <p className="time">{systemUtil.secondsToString(this.state.time)}</p>
                            <button className="bonus-close" onClick={this.hideGame}><img src={svgs['close']} alt="" /></button>
                    </div>
                </>
            }
            case GameBoxType.GET: {
                return <>
                    <div className="bonus-sumka dark">
                        <p><strong>сумка подобрана</strong></p>
                        <p>{this.state.player}</p>
                        <p className="time">{systemUtil.secondsToString(this.state.time)}</p>
                        <button className="bonus-close" onClick={this.hideGame}><img src={svgs['close']} alt="" /></button>
                    </div>
                </>
            }
            case GameBoxType.FINISH: {
                return <>
                    <div className="bonus-sumka green">
                        <p><strong>{this.state.player}</strong></p>
                        <p>доставил посылку</p>
                        <button className="bonus-close" onClick={this.hideGame}><img src={svgs['close']} alt="" /></button>
                    </div>
                </>
            }
            default: return null;
        }
    }

}
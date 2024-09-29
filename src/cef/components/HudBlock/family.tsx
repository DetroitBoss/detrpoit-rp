import './style.less';
import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import {CustomEventHandler} from '../../../shared/custom.event';


export class HudFamily extends Component<{}, {
    show: boolean, 
    name?: string, 
    points?: number,
    timer: number
}> {
    ev: CustomEventHandler;
    mgTime: NodeJS.Timeout;
    constructor(props: any) {
        super(props);

        this.state = {
            show: false, 
            points: 0,
            name: 'Family',
            timer: 1000
        }
        this.ev = CustomEvent.register('hud:cargoBattle', (show: boolean, name?: string, points?: number, tickTime?:number) => {
            this.setState( { ...this.state, show, name, points, timer:(typeof tickTime == 'number')?tickTime:1000} );
            this.updateFamilyGame( );
        })
//        this.updateFamilyGame( );
    }

    updateFamilyGame = ( ) => {
        if (this.mgTime) clearInterval(this.mgTime);
        if(this.state.timer <= 0) return;
        this.mgTime = setInterval(() => {
            if (this.state.points < 100 )
                this.setState( { ...this.state, points: this.state.points + 1 } );
            else 
                this.hideGame();
        }, this.state.timer);
    }

    componentWillUnmount() {
        if (this.ev) this.ev.destroy();
        if (this.mgTime) clearInterval(this.mgTime);
    }
    hideGame = () => {
        if (this.mgTime) clearInterval(this.mgTime);
        this.setState( { points: 0,  show: false } );
    }
    render() {
        if( !this.state.show ) return null;
        return <section className="fam-battle-hud animated waiteone fadeInDown">
            <i className="bg-fam-battle-hud"></i>
            <i className="fam-circle-rotate"></i>
            <div className="fam-battle-hud-wrap tc">
                <p className="font32 fontw600 mb8">{this.state.name}</p>
                <p className="info-p font20 upper op4 mb12">удержание зоны</p>
                <div className={`progress-line ${this.state.timer === 0 ? 'stopit ' : ''}mb12`}><i style={{width: `${this.state.points}%`}}></i></div>
                <div className="count-battle"><p className="font32 fontw600">{this.state.points}</p><p className="op4">
                    <sup>/ 100</sup>
                </p></div>
            </div>
        </section>
    }

}
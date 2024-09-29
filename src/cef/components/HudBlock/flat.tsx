import './style.less';
import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import progress from '../Flat/assets/svg/progress-repair.svg';

export class FlatHud extends Component<{}, {
    show: boolean;
    time: number;
    height: number;
}> {
    private timer: NodeJS.Timeout;
    constructor(props: any) {
        super(props);

        this.state = {
            show: false,
            time: 0,
            height: 0
        }

        CustomEvent.register('hud:flatStart', (seconds:number) => {
            if(this.timer) clearInterval(this.timer)
            this.setState({height: 0, show: true})
            const tick = 100 / seconds
            this.timer = setInterval(() => {
                this.setState({height: this.state.height + tick})
                seconds--;
                if(seconds <= 0) {
                    clearInterval(this.timer)
                    this.timer = null;
                    setTimeout(() => {
                        if(!this.timer) this.setState({height: 0, show: false})
                    }, 1000)
                }
            }, 1000)
        });

        CustomEvent.register('hud:flatStop', () => {
            if(this.timer) clearInterval(this.timer)
            this.timer = null;
            this.setState({height: 0})
            setTimeout(() => {
                if(!this.timer) this.setState({height: 0, show: false})
            }, 1000)
        });
        
    }

    render() {
        if( !this.state.show ) return null;
        return <>
            <section className="section-repair-flat-progress animated fadeIn">
                <div className={`progress-icon-box${ this.state.time > 0 ? " active": ""}`} >
                    <img src={progress} alt=""/>
                    <div style={{transition: `height ease-in-out 0.3s`, height: this.state.height+'%'}} >
                        <img src={progress} alt=""/>
                    </div>
                </div>
            </section>

        </>
    }

}
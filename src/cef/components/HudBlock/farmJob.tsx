import './style.less';
import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import progress from '../HudBlock/images/svg/agronomy.svg';

export class FarmJobHud extends Component<{}, {
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

        CustomEvent.register('hud:farmJobStart', (seconds:number) => {
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

        CustomEvent.register('hud:farmJobStop', () => {
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
            <section className="section-farm-progress animated fadeIn">
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
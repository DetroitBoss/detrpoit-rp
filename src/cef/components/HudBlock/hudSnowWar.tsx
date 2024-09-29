import './style.less';
import React, {Component} from 'react';

import alarm from './images/alarm.svg';
import snowball from './images/snowball.png';
import scull from './images/svg/scull.svg'
import cup from './images/cup.png'
import {HudUpdateDTO, SnowWarRating} from "../../../shared/snowWar/dtos";
import {CustomEventHandler} from "../../../shared/custom.event";
import {CustomEvent} from "../../modules/custom.event";


export class HudSnowWar extends Component<{}, {
    show: boolean,
    rating: SnowWarRating[],
    kills: number,
    time: number,
    health: number
}> {

    ev: CustomEventHandler
    ev1: CustomEventHandler

    constructor(props: any) {
        super(props);

        this.state = {
            show: false,
            rating: [
                {name: 'Vasya', kills: 3},
                {name: 'Vasya', kills: 2},
                {name: 'Vasya', kills: 1},
            ],
            kills: 1,
            time: 100,
            health: 3
        }

        this.ev = CustomEvent.register('snowwar:hud:show', (toggle: boolean) => {
            this.setState({...this.state, show: toggle});
        })

        this.ev1 = CustomEvent.register('snowwar:hud:update', (DTO: HudUpdateDTO) => {
            this.setState({rating: DTO.rating, kills: DTO.kills, time: DTO.time, health: DTO.health, show: true});
        })
    }

    componentWillUnmount() {
        this.ev.destroy();
        this.ev1.destroy();
    }

    getTimer(): string {
        let timer = this.state.time,
            minutes: string | number = Math.floor(timer / 60),
            seconds: string | number;

        if (minutes > 0) {
            seconds = timer - (minutes * 60)
        } else {
            seconds = timer;
        }

        if (minutes < 10) {
            minutes = `0${minutes}`
        }

        if (seconds < 10) {
            seconds = `0${seconds}`
        }

        return `${minutes}:${seconds}`
    }

    render() {
        return <>
            {this.state.show && <><div className="hudSnowWar__time">
                <div>до конца <br/> осталось</div>
                <img src={alarm} alt=""/>
                <span>{this.getTimer()}</span>
            </div>

            <div className={`hudGunGame hudSnowWar__kills`}>

                {this.state.rating.map((player, index) => {
                    return <div className="hudGunGame-block" key={index}>

                        {index === 0 && <img src={cup} className="hudGunGame-block__cup" alt=""/>}

                        <div className="hudGunGame-block__left">
                            {player.name}
                        </div>
                        <div className="hudGunGame-block__right">
                            {player.kills}
                            <img src={scull} alt=""/>
                        </div>
                    </div>
                })}

                <div className="hudGunGame-block hudGunGame-block__bottom">
                    <div className="hudGunGame-block__left">
                        Ваша статистика
                    </div>
                    <div className="hudGunGame-block__right">
                        {this.state.kills}
                        <img src={scull} alt=""/>
                    </div>
                </div>

            </div>

            <div className="hudSnowWar__hp">

                <img src={snowball} className={`${this.state.health <= 2 ? "hudSnowWar__transparent" : null}`} alt=""/>
                <img src={snowball} className={`${this.state.health <= 1 ? "hudSnowWar__transparent" : null}`} alt=""/>
                <img src={snowball} className={`${this.state.health <= 0 ? "hudSnowWar__transparent" : null}`} alt=""/>

                <div>HP</div>
            </div>
            </>}
        </>
    }

}
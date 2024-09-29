import React, {Component} from "react";

// @ts-ignore
import png from './assets/*.png'
// @ts-ignore
import svg from "./assets/*.svg"
import { CustomEvent } from '../../../../modules/custom.event'
import {
    ACTIVITY_RENT_TIME_IN_HOURS, ANIMATION_FACTOR_FROM_PROGRESS,
    DEFAULT_LANDING_TIME,
    FARMER_LEVELS
} from '../../../../../shared/farm/progress.config'
import { systemUtil } from '../../../../../shared/system'
import { getFarmerLevelByExp, getLandingTime } from '../../../../../shared/farm/helpers'
import { CEF } from '../../../../modules/CEF'

interface farmLevel {
    currentLevel: number,
    currentEXP: number,
    totalEXP: number,
    rating: number,
    percent: number
}

export class Statistic extends Component<{}, {
    owner: string,
    ownerEXP: number,
    workPlace: string,
    money: number,
    rentTime: [number, number],
    farmLevel: farmLevel
}> {
    constructor(props: any) {
        super(props);

        this.state = {
            owner: "Borz_Borz",
            ownerEXP: 228,
            workPlace: "ТЕПЛИЦА",
            money: 2000,
            rentTime: [0, 0],
            farmLevel: {
                currentLevel: 5,
                currentEXP: 23,
                totalEXP: 126,
                rating: 100,
                percent: 70
            }
        }
        
        CustomEvent.register('farm:stats:open', (
            ownerName: string, 
            ownerExp: number, 
            activityName: string, 
            totalEarned: number, 
            rentedAt: number, 
            farmerExp: number
        ) => {
            this.setState({
                rentTime: [Math.floor(((rentedAt + ACTIVITY_RENT_TIME_IN_HOURS * 3600) - systemUtil.timestamp) / 3600),
                    Math.floor(((rentedAt + ACTIVITY_RENT_TIME_IN_HOURS * 3600) - systemUtil.timestamp) % 3600 / 60)],
                owner: ownerName,
                ownerEXP: ownerExp,
                workPlace: activityName,
                money: totalEarned,
                farmLevel: {
                    currentLevel: getFarmerLevelByExp(farmerExp),
                    currentEXP: farmerExp,
                    totalEXP: FARMER_LEVELS[getFarmerLevelByExp(farmerExp)]?.requiredExp ?? FARMER_LEVELS[FARMER_LEVELS.length - 1].requiredExp,
                    percent: farmerExp / FARMER_LEVELS[getFarmerLevelByExp(farmerExp)]?.requiredExp * 100,
                    rating: 10000
                }
            })
        })
    }

    close() {
        CEF.gui.setGui(null)
    }

    leave() {
        CustomEvent.triggerServer('farm:work:leave')
        CEF.gui.setGui(null)
    }

    zeroNumber(value: number) {
        if (value < 10) return `0${value}`;
        return value.toString();
    }

    render() {


        return <div className="farm-statistic">

            <div className="exit" onClick={() => this.close()}>
                <div className="exit__icon"><img src={svg["closeIcon"]} alt="#"/></div>
                <div className="exit__title">Закрыть</div>
            </div>

            <img src={png["logo"]} className="farm-entrance__logo" alt=""/>
            <img src={png["dot"]} className="farm-entrance__dot" alt=""/>

            <img src={svg["block"]} alt="" className="farm-statistic__block"/>
            <img src={png["shovel"]} alt="" className="farm-statistic__shovel"/>

            <div className="farm-statistic-body">

                <img src={svg["statTitle"]} className="farm-statistic-body__statTitle" alt=""/>

                <div className="farm-statistic-body-owner">
                    <span>Главный фермер <div> { this.state.ownerEXP } exp </div></span>
                    <p>{ this.state.owner }</p>
                </div>

                <div className="farm-statistic-body-information">
                    <div>
                        <span>Место работы</span>
                        <p>{ this.state.workPlace }</p>
                    </div>
                    <hr/>
                    <img src={svg["coin"]} alt=""/>
                    <div>
                        <span>Заработано</span>
                        <p>{ systemUtil.numberFormat(this.state.money) } $</p>
                    </div>
                    <img src={svg["timer"]} alt=""/>
                    <div>
                        <span>Время до конца аренды</span>
                        <p>{this.state.rentTime[0]} час {this.state.rentTime[1]} мин</p>
                    </div>
                </div>

                <div className="farm-statistic-body__button" onClick={() => this.leave()}>УВОЛИТЬСЯ</div>

                <img src={png["dotted"]} className="farm-statistic-body__dotted" alt=""/>

                <div className="farm-statistic-body__title">ТВОЙ УРОВЕНЬ</div>

                <div className="farm-statistic-body-level">

                    <div className="farm-statistic-body-level__lvl">
                        <span>{ this.zeroNumber(this.state.farmLevel.currentLevel) }</span>
                        lvl
                    </div>

                    <div className="farm-statistic-body-level-rate">
                        <img src={svg["stat"]} alt=""/>
                        <span>
                            {this.state.farmLevel.rating} место
                            <p>в общем рейтинге</p>
                        </span>
                    </div>

                    <div className="farm-statistic-body-level__bar">
                        <div style={{width: `${this.state.farmLevel.percent}%`}}/>
                    </div>

                    <img src={svg["ellipse"]} alt="" className="farm-statistic-body-level__ellipse0"/>

                    <div className="farm-statistic-body-level__exp0">{this.state.farmLevel.currentEXP} exp</div>

                    <div className="farm-statistic-body-level-description0">
                        <div className="farm-statistic-body-level-description0__lvl">
                            <span>{ this.state.farmLevel.currentLevel } lvl</span>
                        </div>
                        <div className="farm-statistic-body-level-description0__mission">Сбор урожая в { 20 - (this.state.farmLevel.currentLevel * 2) } кликов</div>
                        <div className="farm-statistic-body-level-description0__mission">Время посадки { getLandingTime(this.state.farmLevel.currentLevel) } сек</div>
                    </div>


                    <img src={svg["ellipse"]} alt="" className="farm-statistic-body-level__ellipse1"/>

                    <div className="farm-statistic-body-level__exp1">{ this.state.farmLevel.totalEXP } exp</div>

                    <div className="farm-statistic-body-level-description1">
                        <div className="farm-statistic-body-level-description0__lvl">
                            <span>{ this.state.farmLevel.currentLevel == 5 ? 5 : this.state.farmLevel.currentLevel + 1 } lvl</span>
                        </div>
                        <div className="farm-statistic-body-level-description0__mission">Сбор урожая в { 20 - ((this.state.farmLevel.currentLevel + 1) * 2) } кликов</div>
                        <div className="farm-statistic-body-level-description0__mission">Время посадки { getLandingTime(this.state.farmLevel.currentLevel == 5 ? 5 : this.state.farmLevel.currentLevel + 1) } сек</div>
                    </div>


                </div>


            </div>


        </div>
    }
}
import React, {Component} from "react";
import "./style.less";
import png from "./assets/*.png";
import items from "./components/List/assets/items/*.png";
import svg from "./assets/*.svg"

import {List} from "./components/List"
import {BATTLE_PASS_SEASON} from "../../../../../shared/battlePass/main";
import {RewardRarity} from "../../../../../shared/battlePass/rewards";


export class Main extends Component<{
    receivedRewards: number[]
    exp: number
}, {
    currentSuperPrize: number,
    lastScroll: number
}> {
    interval: number

    constructor(props: any) {
        super(props);

        this.state = {
            currentSuperPrize: 0,
            lastScroll: 0
        }

        this.interval = setInterval(() => {
            if (this.state.lastScroll > Math.floor(new Date().getTime() / 1000)) return;
            this.changeSuperPrize(true, true);
        }, 5000);
    }

    componentWillUnmount() {
        if (this.interval) clearInterval(this.interval);
    }

    getLevelFromExp(exp: number): number[] {
        const level = Math.trunc(exp / BATTLE_PASS_SEASON.levelExp);


        if (level < 1) return [0, exp];

        const levelExp = exp - level * BATTLE_PASS_SEASON.levelExp;
        return [level, levelExp];
    }

    changeSuperPrize(toggle: boolean, isAuto: boolean = false) {
        let index = this.state.currentSuperPrize;

        if (toggle) {
            if (index === BATTLE_PASS_SEASON.rewards.filter(el => el.isSuperPrize).length - 1) {
                index = 0;
            } else {
                index++;
            }
        } else {
            if (index === 0) {
                index = BATTLE_PASS_SEASON.rewards.filter(el => el.isSuperPrize).length - 1;
            } else {
                index--;
            }
        }

        if (isAuto) {
            this.setState({...this.state, currentSuperPrize: index})
        } else {
            this.setState({
                ...this.state,
                lastScroll: Math.floor(new Date().getTime() / 1000) + 5,
                currentSuperPrize: index
            })
        }
    }

    backgroundByRarity(rarity: RewardRarity) {
        if (rarity === RewardRarity.LEGENDARY) {
            return 'prizeOrange';
        } else if (rarity === RewardRarity.RARE) {
            return 'prizePurple';
        } else {
            return 'prizeBlue';
        }
    }

    render() {
        return <div className="main">

            <img src={png["topLeftImage"]} alt="" className="main__rainbow"/>*

            <div className="main-prize">

                <img src={png["prizeBackground"]} alt="" className="main-prize__background"/>
                <img src={png[this.backgroundByRarity(
                    BATTLE_PASS_SEASON.rewards.filter(el => el.isSuperPrize)[this.state.currentSuperPrize].rarity
                )]} alt="" className="main-prize__light"/>

                <div className="main-prize__text">
                    Главные <br/> призы
                </div>

                <img
                    src={items[BATTLE_PASS_SEASON.rewards.filter(el => el.isSuperPrize)[this.state.currentSuperPrize].image]}
                    alt="" className="main-prize__image"/>

                <div className="main-prize__button" onClick={() => this.changeSuperPrize(false)}>
                    <img src={svg["arrowLeft"]} alt=""/>
                </div>

                <div className="main-prize__button main-prize__buttonRight" onClick={() => this.changeSuperPrize(true)}>
                    <img src={svg["arrowRight"]} alt=""/>
                </div>

                <div className="main-prize-points">
                    {
                        BATTLE_PASS_SEASON.rewards.filter(el => el.isSuperPrize).map((el, index) => {
                            return <div
                                className={`${index === this.state.currentSuperPrize ? 'main-prize-points__active' : null}`}
                                key={index}/>
                        })
                    }
                </div>

            </div>

            <div className="battlePass-center">


                <div className="main-information">

                    <div className="main-information__title">
                        Battle Pass
                        {/*<img src={png["fairy"]} alt=""/>*/}
                    </div>

                    <div className="main-information__text">
                        BATTLE PASS - это уникальная система призов. Купи пропуск, чтобы получить доступ к эксклюзивным
                        айтемам: кастомные машины, фирменные костюмы, маски, уникальные бонусы и многое другое. С каждым
                        новым уровнем ты становишься ближе к супер призу. Пройди всю цепочку раньше всех и возглавь
                        рейтинг лидеров!
                    </div>

                    <div className="main-information-progress">

                        <div className="main-information-progress__level">
                            <img src={svg["shield"]} alt=""/>
                            <span>{this.getLevelFromExp(this.props.exp)[0]}</span>
                        </div>

                        <div className="main-information-progress-bar">

                            <div className="main-information-progress-bar__block">
                                <div
                                    style={{width: `${Math.trunc(this.getLevelFromExp(this.props.exp)[1] * 100 / 1500)}%`}}>
                                    <img src={svg["star"]} alt="" className="main-progress__star"/>
                                    <img src={svg["star"]} alt="" className="main-progress__star"/>
                                    <img src={svg["star"]} alt="" className="main-progress__star"/>
                                    <img src={svg["star"]} alt="" className="main-progress__star"/>
                                    <img src={svg["star"]} alt="" className="main-progress__star"/>
                                    <img src={svg["star"]} alt="" className="main-progress__star"/>
                                    <img src={svg["star"]} alt="" className="main-progress__star"/>
                                    <img src={svg["star"]} alt="" className="main-progress__star"/>
                                    <img src={svg["star"]} alt="" className="main-progress__star"/>
                                    <img src={svg["star"]} alt="" className="main-progress__star"/>
                                </div>
                            </div>

                            <div className="main-information-progress-bar__text">
                                <span>{BATTLE_PASS_SEASON.levelExp - this.getLevelFromExp(this.props.exp)[1]} опыта до следующего уровня</span>
                                <span>{this.getLevelFromExp(this.props.exp)[0] + 1} уровень</span>
                            </div>

                        </div>

                    </div>

                </div>

                <List receivedRewards={this.props.receivedRewards} exp={this.props.exp}/>
            </div>
        </div>
    }
}
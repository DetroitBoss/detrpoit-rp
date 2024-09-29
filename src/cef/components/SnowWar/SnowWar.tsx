import React, {Component} from "react";
import {SNOW_WAR_MAX_PLAYERS} from "../../../shared/snowWar/main.config";
import "./style.less"

import png from "./assets/*.png"
import svg from "./assets/*.svg"
import {CustomEventHandler} from "../../../shared/custom.event";
import {CustomEvent} from "../../modules/custom.event";
import {RegistrationDTO} from "../../../shared/snowWar/dtos";
import {CEF} from "../../modules/CEF";

export class SnowWar extends Component<{}, {
    players: number,
    maxPlayers: number,
    joined: boolean,
    battleStarted: boolean,
    time: number
}> {

    ev: CustomEventHandler
    ev1: CustomEventHandler

    constructor(props: any) {
        super(props);

        this.state = {
            battleStarted: true,
            joined: true,
            players: 50,
            maxPlayers: SNOW_WAR_MAX_PLAYERS,
            time: 350
        }

        this.ev = CustomEvent.register('snowwar:registration:update', (DTO: RegistrationDTO) => {
            this.setState({
                ...this.state,
                players: DTO.playersQueueLength,
                battleStarted: DTO.battleInProgress,
                time: DTO.timer
            });
        })

        this.ev1 = CustomEvent.register('snowwar:registration:setJoined', (toggle: boolean) => {
            this.setState({...this.state, joined: toggle})
        })
    }

    componentWillUnmount() {
        this.ev.destroy();
        this.ev1.destroy();
    }

    register() {
        CustomEvent.triggerServer('snowwar:registerPlayer');
    }

    unregister() {
        CustomEvent.triggerServer('snowwar:unregisterPlayer');
    }

    close() {
        CustomEvent.triggerServer('snowwar:registrationClose');
        CEF.gui.setGui(null);
    }

    getRegisterButton() {
        if (this.state.battleStarted) {
            return <div className="snowWar-block-footer__button snowWar-block-footer__buttonTransparent">
                Принять участие
            </div>
        } else {
            if (this.state.joined) {
                return <div className="snowWar-block-footer__button snowWar-block-footer__buttonTransparent"
                            onClick={() => this.unregister()}>
                    <img src={svg["closeCircle"]} alt=""/>отменить участие
                </div>
            }else{
                return <div className="snowWar-block-footer__button" onClick={() => this.register()}>
                    Принять участие
                </div>
            }
        }
    }

    getTimer(): string {
        let timer = this.state.time,
            minutes: string | number = Math.floor(timer / 60),
            seconds: string | number;

        if (minutes > 0) {
            seconds = timer - (minutes * 60)
        }else{
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
        return <div className="snowWar">

            <img src={png["background"]} className="snowWar__background" alt=""/>
            <img src={png["body"]} className="snowWar__body" alt=""/>

            <div className="exit" onClick={() => this.close()}>
                <div className="exit__icon"><img src={svg["closeIcon"]} alt="#"/></div>
                <div className="exit__title">Закрыть</div>
            </div>

            <div className="snowWar-block">


                <div className="snowWar-block__title">
                    ВОЙНА СНЕЖКАМИ
                </div>

                <div className="snowWar-block__text">
                    <span>Правила</span>
                    Битва снежками это зимнее развлечение, в котором люди делятся на две команды и в течении 10-ти минут ведут противоборство, победит та команда, которая наберет большее количество очков.
                </div>

                <div className="snowWar-block__hr"/>

                <div className="snowWar-block-footer">

                    <div className="snowWar-block-footer__left">
                        <span>Кол-во участников</span>
                        <div>
                            <img src={svg["personsIcon"]} alt=""/>
                            {this.state.players}/{this.state.maxPlayers}
                        </div>
                    </div>


                    {this.getRegisterButton()}

                </div>

                <div className="snowWar-block-timer">

                    <img src={svg["alarm"]} alt=""/>

                    <div className="snowWar-block-timer__time">{this.getTimer()}</div>

                    <div className="snowWar-block-timer__hr"/>

                    <div className="snowWar-block-timer__text">
                        {this.state.battleStarted ? "Регистрация начнётся" : "Игра начнется"} через
                    </div>

                </div>

            </div>

        </div>

    }
}
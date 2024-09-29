import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import './style.less'
import {CEF} from '../../modules/CEF';
import {observer} from "mobx-react";
import LoadScreenJoinStore from "../../stores/LoadScreenJoin";
import {alertsEnable, setInit} from '../../App';
import Logo from './img/logo.svg'
import vk from './img/vk.svg'
import tg from './img/tg.svg'
import ds from './img/ds.svg'
import enterButton from './img/enterButton.svg'
import textLogo from './img/textLogo.svg'

@observer
export class LoadScreenJoin extends Component<{
    LoadScreenJoinStore: LoadScreenJoinStore
}, {}> {
    store: LoadScreenJoinStore

    constructor(props: any) {
        super(props);
        this.store = this.props.LoadScreenJoinStore

        setTimeout((): void => {
            this.store.setState({loadingScreenStart: true});
            setTimeout((): void => {
                this.store.setState({allowEnter: true})
            }, 1000)
        }, 1500)
    }

    componentDidMount(): void {
        document.addEventListener("keyup", this.handleKeyUp, false);
        setTimeout((): void => {
            if (alertsEnable.startVoice) CEF.playSound('enteronyx');
        }, 300)
    }

    componentWillUnmount = (): void => {
        document.removeEventListener("keyup", this.handleKeyUp, false);
    }

    handleEnterAction = (): void => {
        // Проверяем условия, как в handleKeyUp
        if (!this.store.allowEnter) return;
        if (!this.store.introScene) return;
        
        // Останавливаем звук и запускаем дальнейшие действия
        CEF.stopSound();
        CustomEvent.triggerClient('fractionCfg:cefReady');
        
        if (!alertsEnable.enableIntro) {
            CustomEvent.triggerClient('loadingscreen:load');
            setTimeout((): void => {
                setInit();
            }, 1000);
            return;
        }
    
        this.store.setState({introScene: false, showVideo: true}, (): void => {
            setTimeout((): void => {
                this.store.setState({videoRun: true, loadingScreenStart: false});
                setTimeout((): void => {
                    CustomEvent.triggerClient('loadingscreen:load');
                }, 2000);
            }, 1000);
        });
    };

    handleKeyUp = (e: KeyboardEvent): void => {
        if (e.keyCode !== 13) return;
        this.handleEnterAction();
    }

    render(): JSX.Element {
        return <>
            <div className={"loadingScreenStart " + (this.store.loadingScreenStart ? 'show' : '')}>
                <div className='backbox'>
                    <img className='logobox' src={Logo} alt="" />
                    <img className='logotext' src={textLogo} alt="" />
                    <div className='subtext'>🎉 Добро пожаловать на сервер! 🎉
                        Мы безумно рады, что ты с нами! 🎮
                        Наш проект — это не просто место для игры, это целый мир, где каждый день наполнен новыми впечатлениями и яркими моментами. 🌟

                        Мы работаем, чтобы сделать каждый день для наших игроков незабываемым!

                        Спасибо, что выбрал нас.
                        Погружайся в игру и наслаждайся каждым мгновением! 🚀💥</div>
                    <div className='box_social'>
                        <div className='box_stats'><img className='icon' src={vk}/> <span>vk.com/detroitgta5</span> </div>
                        <div className='box_stats'><img className='icon' src={ds}/> <span>discord.gg/EYYBeYxRV5</span> </div>
                        <div className='box_stats'><img className='icon' src={tg}/> <span>t.me/detroitgta5</span> </div>
                    </div>
                    <button className="button" onClick={this.handleEnterAction}>Начать игру <img src={enterButton} alt="Enter Button" /></button>
                    <div className="text">Если у вас не появляется курсор, нажмите  ~ (Ё)</div>
                </div>
            </div>
        </>;
    }
}

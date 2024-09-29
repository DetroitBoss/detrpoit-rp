import React, {Component} from "react";
import "./style.less";

import closeIcon from './assets/closeIcon.svg'

import ammunition from './assets/matchList/ammunition.png'
import bigRevolver from './assets/matchList/bigRevolver.png'
import bigRevolverBlur from './assets/matchList/bigRevolverBlur.png'
import bigRifle from './assets/matchList/bigRifle.png'
import clock from './assets/matchList/clock.svg'
import deathmatch from './assets/matchList/deathmatch.svg'
import fire from './assets/matchList/fire.svg'
import gps from './assets/matchList/gps.svg'
import gungame from './assets/matchList/gungame.svg'
import player from './assets/matchList/player.svg'
import randomgun from './assets/matchList/randomgun.svg'
import revolver from './assets/matchList/revolver.png'
import rifle from './assets/matchList/rifle.png'


import info from './assets/matchCreate/info.svg'
import arrow from './assets/matchCreate/arrow.svg'

import acceptImage from './assets/accept.svg';
import deleteImage from './assets/delete.svg';
import backIcon from './assets/backIcon.svg';
import imgPlaces from "./assets/places/*.png";
import imgLocations from "./assets/locations/*.png";
import iconsItems from '../../../shared/icons/*.png';

import weapons_images from "./assets/weapons/*.png";
import { CustomEvent } from '../../modules/custom.event'
import { IGunGameLobbySettings, IGunGameSession } from '../../../shared/gungame'
import { CEF } from '../../modules/CEF'
import { weapon_list } from '../../../shared/inventory'
import { systemUtil } from '../../../shared/system'

type sessionType =  "deathmatch" | "gungame" | "teamfight"

export class GunGame extends Component<{}, {
    component: "select" | "create" | "enterPass",
    sessions: IGunGameSession[],

    createType: sessionType,
    createLocation: number,
    createFreeEnter: boolean,
    refRoomName: React.RefObject<any>,
    refRoomPass: React.RefObject<any>,
    refRoomPrice: React.RefObject<any>,
    selectedSession: number,
    selectedSessionName: string,
    refPassInput: React.RefObject<any>,
    selectedGun: number,
    useArmour: boolean,
    rebornAfterDeath: boolean,
    refKillsForEnd: React.RefObject<any>
}> {
    description: any = {
        "deathmatch": "Бой насмерть в котором основная цель это непосредственное уничтожение всех противников.\n",
        "gungame": "Интересный режим, в котором вы сможете не только развлечься, но еще и потренировать свои навыки стрельбы.\n",
        "teamfight": "Режим в котором вы сможете сразиться вместе со своей командой против команды противника.\n"
    }

    places: any = [
        {
            name: "Лагерь альтруистов",
            imgPlace: imgPlaces["lager"],
            imgLocation: imgLocations["lager"]
        },
        {
            name: "Свалка самолётов",
            imgPlace: imgPlaces["svalka"],
            imgLocation: imgLocations["svalka"]
        },
        {
            name: "Бараки в Сенди Шорс",
            imgPlace: imgPlaces["baraki"],
            imgLocation: imgLocations["baraki"]
        },
        {
            name: "Фонтан (Быстрая карта)",
            imgPlace: imgPlaces["fontan"],
            imgLocation: imgLocations["fontan"]
        }
    ]

    DM_WEAPONS:{
        /** Модель оружия. {@link DUELS_WEAPON Пример} есть в файле <b>/duels.ts</b>*/
        weapon: string,
        /** Название оружия */
        name: string,
        img: string
    }[] = [
        {weapon: 'weapon_machinepistol', name: 'Machine Pistol', img: "item"},
        {weapon: 'weapon_combatpdw', name: 'Combat PDW', img: "item"},
        {weapon: 'weapon_smg', name: 'MP5K', img: "item"},
        {weapon: 'weapon_musket', name: 'Musket', img: "item"},
        {weapon: 'weapon_dbshotgun', name: 'Double Barrel Shotgun', img: "item"},
        {weapon: 'weapon_heavyshotgun', name: 'Сайга', img: "item"},
        {weapon: 'weapon_bullpuprifle_mk2', name: 'Bullpup Rifle Mk II', img: "item"},
        {weapon: 'weapon_militaryrifle', name: 'Military Rifle', img: "item"},
        {weapon: 'weapon_carbinerifle', name: 'HK-416', img: "item"},
        {weapon: 'weapon_assaultrifle_mk2', name: 'Assault Rifle Mk II', img: "item"},
        {weapon: 'weapon_sniperrifle', name: 'Sniper Rifle', img: "item"},
        {weapon: 'weapon_mg', name: 'Печенег', img: "item"},
        {weapon: 'weapon_combatmg_mk2', name: 'Combat MG Mk II', img: "item"},
        {weapon: 'weapon_pistol50', name: 'Pistol .50', img: "item"},
        {weapon: 'weapon_revolver', name: 'Револьвер', img: "item"},
    ]

    mapTypeToMode: Map<sessionType, number> = new Map<sessionType, number>([
            ['deathmatch', 0],
            ['gungame', 1],
            ['teamfight', 3],
        ])
    
    constructor(props: any) {
        super(props);

        this.state = {
            component: "select",
            sessions: [
                {
                    id: 228,
                    name: "Комната #1",
                    type: "deathmatch",
                    place: 0,
                    btnType: "connect",
                    online: 5,
                    maxPlayers: 40,
                    price: 22000,
                    time: "04:20",
                    password: false
                }
            ],
            createType: "deathmatch",
            createLocation: 0,
            createFreeEnter: false,
            refRoomName: React.createRef(),
            refRoomPass: React.createRef(),
            refRoomPrice: React.createRef(),
            selectedSession: null,
            selectedSessionName: "",
            refPassInput: React.createRef(),
            selectedGun: 0,
            useArmour: false,
            rebornAfterDeath: false,
            refKillsForEnd: React.createRef()
        }
        
        CustomEvent.register('gg:init', (sessions: IGunGameSession[]) => {
            this.setState({
                ...this.state,
                component: 'select',
                sessions
            })
        })
    }

    setComponent(component: any): void {
        this.setState({
            ...this.state,
            component
        });
    }


    close(): void {
        CEF.gui.setGui(null)
    }

    setUseArmour(toggle: boolean) {
        this.setState({...this.state, useArmour: toggle});
    }

    setRebornAfterDeath(toggle: boolean) {
        this.setState({...this.state, rebornAfterDeath: toggle});
    }

    sessionAction(key: number): void {
        const session = this.state.sessions.find(s => s.id == key)
        if (session.password && session.btnType === 'connect') {
            this.setState({
                ...this.state,
                selectedSession: key,
                selectedSessionName: session.name,
                component: "enterPass"
            });
        } else if (session.btnType === 'cancel') {
            CustomEvent.triggerServer('gg:leave')
        } else if (session.btnType === 'create') {
            CustomEvent.triggerServer('gg:start')
        } else {
            CustomEvent.triggerServer('gg:join', key, '')
        }
    }

    changeCreateType(type: any): void {
        this.setState({...this.state, createType: type});
    }

    changeCreateLocation(toggle: boolean): void {
        if (toggle) {
            if (this.state.createLocation === this.places.length - 1) {
                this.setState({...this.state, createLocation: 0})
            } else {
                this.setState({...this.state, createLocation: this.state.createLocation + 1})
            }
        } else {
            if (this.state.createLocation === 0) {
                this.setState({...this.state, createLocation: this.places.length - 1})
            } else {
                this.setState({...this.state, createLocation: this.state.createLocation - 1})
            }
        }
    }

    changeCreateFreeEnter(): void {
        if (!this.state.createFreeEnter) this.state.refRoomPass.current.value = "";

        this.setState({...this.state, createFreeEnter: !this.state.createFreeEnter});
    }

    createMatch(): void {
        const name = this.state.refRoomName.current.value,
            freeEnter = this.state.createFreeEnter,
            pass = this.state.refRoomPass.current.value,
            price = this.state.refRoomPrice.current.value,
            type = this.state.createType,
            location = this.state.createLocation,
            useArmour = this.state.useArmour,
            reborn = this.state.rebornAfterDeath

        if (!name) return CEF.alert.setAlert('error', 'Укажите название')
        if (type === "deathmatch") {
            const selectedGun = this.state.selectedGun;
        }

        const killsForEnd = this.state.refKillsForEnd.current.value;

        if (killsForEnd < 5 || killsForEnd > 100) {
            return CEF.alert.setAlert('error', 'Количество убийств указано неверно')
        }
        
        if (price > 50000) 
            return CEF.alert.setAlert('error', `Максимальная ставка ${systemUtil.numberFormat(50000)}$`)

        const settings: IGunGameLobbySettings = {
            map: location,
            bet: price,
            password: pass,
            mode: this.mapTypeToMode.get(type),
            armour: useArmour,
            kills: killsForEnd,
            weapon: this.state.selectedGun,
            regen: reborn,
            name: systemUtil.filterInput(name)
        }
        
        CustomEvent.triggerServer('gg:create', settings)
    }

    addSymbolToPassword(value: number): void {
        if (this.state.refPassInput.current.value.length >= 6) return;
        this.state.refPassInput.current.value += `${value}`;
    }

    deleteLastSymbol(): void {
        if (this.state.refPassInput.current.value.length === 0) return;

        this.state.refPassInput.current.value = this.state.refPassInput.current.value.substring(
            0,
            this.state.refPassInput.current.value.length - 1
        )
    }

    afterEnterPassword(): void {
        const sessionId = this.state.selectedSession,
            password = this.state.refPassInput.current.value;

        CustomEvent.triggerServer('gg:join', sessionId, password.toString())
    }

    changePasswordInput(): void {
        if (this.state.refPassInput.current.value.length > 6)
            this.state.refPassInput.current.value = this.state.refPassInput.current.value.substring(
                0,
                6
            )
        this.state.refPassInput.current.value = this.state.refPassInput.current.value.replaceAll(/[^0-9.]/g, '');
    }

    changeSelectedGun(toggle: boolean) {
        let state: number;

        if (toggle) {
            if (this.state.selectedGun === this.DM_WEAPONS.length - 1) {
                state = 0;
            } else {
                state = this.state.selectedGun + 1;
            }
        } else {
            if (this.state.selectedGun === 0) {
                state = this.DM_WEAPONS.length - 1;
            } else {
                state = this.state.selectedGun - 1;
            }
        }

        this.setState({...this.state, selectedGun: state})
    }

    render() {
        return <>
            {
                this.state.component === "enterPass" && <div className='gunGame-password'>

                    <div className="exit" onClick={() => {
                        this.setState({...this.state, component: "select"});
                        this.state.refPassInput.current.value = "";
                    }}>
                        <div className="exit__icon"><img src={backIcon} alt="#"/></div>
                        <div className="exit__title">Назад</div>
                    </div>

                    <img src={bigRevolver} className="gunGame-password__bigRevolver" alt=""/>
                    <img src={bigRevolverBlur} className="gunGame-password__bigRevolverBlur" alt=""/>

                    <div className="gunGame-password__title">
                        Вход в лобби
                        <div>{this.state.selectedSessionName}</div>
                    </div>

                    <div className={'gunGame-password-content'}>

                        <div className="gunGame-password-content-row">
                            <input spellCheck="false" type="password" ref={this.state.refPassInput}
                                   onChange={() => this.changePasswordInput()}/>
                            <div className="gunGame-password-content-row__placeholder">Пароль от комнаты</div>
                        </div>

                        <div className="gunGame-password-content-buttons">
                            <div onClick={() => this.addSymbolToPassword(1)}>1</div>
                            <div onClick={() => this.addSymbolToPassword(2)}>2</div>
                            <div onClick={() => this.addSymbolToPassword(3)}>3</div>
                            <div onClick={() => this.addSymbolToPassword(4)}>4</div>
                            <div onClick={() => this.addSymbolToPassword(5)}>5</div>
                            <div onClick={() => this.addSymbolToPassword(6)}>6</div>
                            <div onClick={() => this.addSymbolToPassword(7)}>7</div>
                            <div onClick={() => this.addSymbolToPassword(8)}>8</div>
                            <div onClick={() => this.addSymbolToPassword(9)}>9</div>
                            <div onClick={() => this.deleteLastSymbol()}><img src={deleteImage} alt=""/></div>
                            <div onClick={() => this.addSymbolToPassword(0)}>0</div>
                            <div onClick={() => this.afterEnterPassword()}><img src={acceptImage} alt=""/></div>
                        </div>

                    </div>

                </div>
            }


            {(this.state.component === "select" || this.state.component === "enterPass") &&
            <div className='gunGame-matchList'>

                {this.state.component === "select" && <div className="exit" onClick={() => this.close()}>
                    <div className="exit__icon"><img src={closeIcon} alt="#"/></div>
                    <div className="exit__title">Закрыть</div>
                </div>}


                <div className="gunGame-matchList-body">

                    <img src={bigRifle} className="gunGame-matchList-body__bigRifle" alt=""/>
                    <img src={bigRevolver} className="gunGame-matchList-body__bigRevolver" alt=""/>
                    <img src={bigRevolverBlur} className="gunGame-matchList-body__bigRevolverBlur" alt=""/>

                    <div className="gunGame-matchList-body__shadow"/>

                    <div className="gunGame-matchList-body-head">
                        <div className="gunGame-matchList-body-head__title">
                            GunGame
                            <span>Активные сессии</span>
                        </div>
                        <div className="gunGame-matchList-body-head__button"
                             onClick={() => this.setComponent("create")}>
                            <img src={fire} alt=""/>
                            Создать матч
                        </div>
                    </div>

                    <div className="gunGame-matchList-body-content">

                        {
                            this.state.sessions.map((el, key) => {

                                return <div
                                    className={`gunGame-matchList-body-content-block
                                        ${el.type === "deathmatch" ? "gunGame-mode-deathmatch" : ""}
                                        ${el.type === "gungame" ? "gunGame-mode-gungame" : ""}
                                        ${el.type === "teamfight" ? "gunGame-mode-randomgun" : 0}
                                    `} key={key}>

                                    <div className="gunGame-matchList-body-content-block-left">
                                        <img src={this.places[el.place].imgPlace} alt=""
                                             className="gunGame-matchList-body-content-block-left__map"/>
                                        <img src={revolver} alt=""
                                             className="gunGame-matchList-body-content-block-left__weapon gunGame-deathmatch"/>
                                        <img src={rifle} alt=""
                                             className="gunGame-matchList-body-content-block-left__weapon gunGame-gungame"/>
                                        <img src={ammunition} alt=""
                                             className="gunGame-matchList-body-content-block-left__weapon gunGame-randomgun"/>
                                    </div>

                                    <div className="gunGame-matchList-body-content-block-right">

                                        <div className="gunGame-matchList-body-content-block-right-row">
                                            <div
                                                className="gunGame-matchList-body-content-block-right-row__name">
                                                {el.name}
                                            </div>
                                        </div>

                                        <div className="gunGame-matchList-body-content-block-right-row">
                                            <div className="gunGame-matchList-body-content-block-right-row__mode">

                                                <img src={deathmatch} alt="" className="gunGame-deathmatch"/>
                                                <img src={gungame} alt="" className="gunGame-gungame"/>
                                                <img src={randomgun} alt="" className=" gunGame-randomgun"/>

                                                <p className="gunGame-deathmatch">DEATHMATCH</p>
                                                <p className="gunGame-gungame">GUNGAME</p>
                                                <p className="gunGame-randomgun">TEAM FIGHT</p>

                                                <span
                                                    className="gunGame-matchList-body-content-block-right-row__mode__help">
                                                    {this.description[el.type]}
                                                    <div/>
                                </span>

                                            </div>


                                            <div className="gunGame-matchList-body-content-block-right-row__location">
                                                <img src={gps} alt=""/>
                                                {this.places[el.place].name}
                                            </div>
                                        </div>


                                        <div className="gunGame-matchList-body-content-block-right-row">

                                            <div className="gunGame-matchList-body-content-block-right-row-counter">
                                                <img src={player} alt=""/>
                                                <div>{el.online} <span>/{el.maxPlayers}</span></div>
                                            </div>

                                            <div className="gunGame-matchList-body-content-block-right-row-counter">
                                                <img src={clock} alt=""/>
                                                <div>{el.time}</div>
                                            </div>

                                        </div>

                                        <div
                                            className={`gunGame-matchList-body-content-block-right-row
                                                ${el.btnType === "cancel" ? "gunGame-button__cancel" : ""}
                                                ${el.btnType === "create" ? "gunGame-button__create" : ""}
                                                ${el.btnType === "connect" ? "gunGame-button__connect" : ""}
                                            `}>
                                            <div className="gunGame-matchList-body-content-block-right-row__button"
                                                 onClick={() => this.sessionAction(el.id)}>
                                                <img src={closeIcon}
                                                     className="gunGame-button__connect gunGame-button__cancel" alt=""/>
                                                <img src={fire} className="gunGame-button__create" alt=""/>
                                                <div className="gunGame__cancel">Отмена</div>
                                                <div className="gunGame__connect">Присоединится</div>
                                                <div className="gunGame__create">Начать игру</div>
                                            </div>
                                            <div className="gunGame-matchList-body-content-block-right-row__price">
                                                <span className="gunGame__connect">Стоимость участия</span>
                                                <span className="gunGame__create">Бесплатно</span>
                                                <div>${`${el.price}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            })
                        }


                    </div>

                </div>

            </div>}

            {this.state.component === "create" && <div className='gunGame-matchCreate'>

                <div className="exit" onClick={() => this.close()}>
                    <div className="exit__icon"><img src={closeIcon} alt="#"/></div>
                    <div className="exit__title">Закрыть</div>
                </div>

                <img src={bigRifle} className="gunGame-matchCreate__bigRifle" alt=""/>
                <img src={bigRevolver} className="gunGame-matchCreate__bigRevolver" alt=""/>
                <img src={bigRevolverBlur} className="gunGame-matchCreate__bigRevolverBlur" alt=""/>

                <div className="gunGame-matchCreate__title">
                    Создание
                    <div>матча</div>
                </div>

                <div className={`gunGame-matchCreate-content
                    ${this.state.createType === "deathmatch" ? "gunGame-matchCreate-deathmatch" : ""}
                    ${this.state.createType === "gungame" ? "gunGame-matchCreate-gungame" : ""}
                    ${this.state.createType === "teamfight" ? "gunGame-matchCreate-randomgun" : ""}
                `}>

                    <div className="gunGame-matchCreate-content-row">
                        <div
                            className={`gunGame-matchCreate-content-row-modeButton ${this.state.createType === "deathmatch" ? "gunGame-matchCreate-modeButton-active" : ""}`}
                            onClick={() => this.changeCreateType("deathmatch")}>
                            <img src={deathmatch} alt=""/>
                            DEATHMATCH
                        </div>
                        <div
                            className={`gunGame-matchCreate-content-row-modeButton ${this.state.createType === "gungame" ? "gunGame-matchCreate-modeButton-active" : ""}`}
                            onClick={() => this.changeCreateType("gungame")}>
                            <img src={gungame} alt=""/>
                            GUNGAME
                        </div>
                        <div
                            className={`gunGame-matchCreate-content-row-modeButton ${this.state.createType === "teamfight" ? "gunGame-matchCreate-modeButton-active" : ""}`}
                            onClick={() => this.changeCreateType("teamfight")}>
                            <img src={randomgun} alt=""/>
                            TEAM FIGHT
                        </div>
                    </div>

                    <div className="gunGame-matchCreate-content-row">
                        <div className="gunGame-matchCreate-content-row__information">
                            <img src={info} alt=""/>
                            <p>{this.description[this.state.createType]}</p>
                        </div>
                    </div>

                    <div className="gunGame-matchCreate-content-row">
                        <div className="gunGame-matchCreate-content-row-textLocation">
                            <div/>
                            <p>Выберите локацию</p>
                            <div/>
                        </div>
                    </div>


                    <div className="gunGame-matchCreate-content-row">
                        <div className="gunGame-matchCreate-content-row-location">
                            <img src={this.places[this.state.createLocation].imgLocation}
                                 className="gunGame-matchCreate-content-row-location__map" alt=""/>
                            <div onClick={() => this.changeCreateLocation(false)}><img src={arrow} alt=""/></div>
                            <p>{this.places[this.state.createLocation].name}</p>
                            <div onClick={() => this.changeCreateLocation(true)}><img src={arrow} alt=""/></div>
                        </div>
                    </div>


                    <div className="gunGame-matchCreate-content-row">
                        <input ref={this.state.refRoomName} spellCheck="false" type="text" defaultValue={CEF.user.name + ' лобби'}/>
                        <div className="gunGame-matchCreate-content-row__placeholder">Название комнаты</div>
                    </div>

                    <div
                        className={`gunGame-matchCreate-content-row ${this.state.createFreeEnter ? "gunGame-matchCreate-active" : ""}`}>
                        <div className="gunGame-matchCreate-content-row__checkbox"
                             onClick={() => this.changeCreateFreeEnter()}>
                            <div/>
                            <span>Свободный вход</span>
                        </div>
                    </div>

                    <div
                        className={`gunGame-matchCreate-content-row ${this.state.createFreeEnter ? "gunGame-matchCreate-deActive" : ""}`}>
                        <input ref={this.state.refRoomPass} spellCheck="false" type="password"/>
                        <div className="gunGame-matchCreate-content-row__placeholder">Пароль</div>
                    </div>

                    <div className="gunGame-matchCreate-content-row">
                        <input ref={this.state.refRoomPrice} spellCheck="false" type="text" defaultValue={0}/>
                        <div className="gunGame-matchCreate-content-row__placeholder">Стоимость участия $ (ставка)</div>
                    </div>

                    <div className="gunGame-matchCreate-content-row">
                        <div className="gunGame-matchCreate-content-row__information">
                            <img src={info} alt=""/>
                            <p>Ставка вносится каждым игроком при присоединении к матчу. Максимальная стоимость - $50
                                000</p>
                        </div>
                    </div>


                </div>

                <div className={`gunGame-matchCreate-content
                    ${this.state.createType === "deathmatch" ? "gunGame-matchCreate-deathmatch" : ""}
                    ${this.state.createType === "gungame" ? "gunGame-matchCreate-gungame" : ""}
                    ${this.state.createType === "teamfight" ? "gunGame-matchCreate-randomgun" : ""}
                `}>

                    <div className="gunGame-matchCreate-content-row2">
                        <div className="gunGame-matchCreate-content-row2__title">
                            Количество убийств для окончания битвы <span>от 5 до 100</span>
                        </div>
                        <div className="gunGame-matchCreate-content-row2-block">
                            <input type="number" ref={this.state.refKillsForEnd} defaultValue={5}/>
                        </div>
                    </div>

                    <div className="gunGame-matchCreate-content-row2">
                        <div className="gunGame-matchCreate-content-row2__title">
                            Использование бронежилетов
                        </div>
                        <div className="gunGame-matchCreate-content-row2-block">
                            <div onClick={() => this.setUseArmour(true)}
                                className={`gunGame-matchCreate-content-row2-block__button ${this.state.useArmour ? "gunGame-matchCreate-content-row2__active" : null}`}>
                                Да
                            </div>
                            <div onClick={() => this.setUseArmour(false)} className={`gunGame-matchCreate-content-row2-block__button ${this.state.useArmour ? null : "gunGame-matchCreate-content-row2__active"}`}>
                                Нет
                            </div>
                        </div>
                    </div>

                    <div className="gunGame-matchCreate-content-row2">
                        <div className="gunGame-matchCreate-content-row2__title">
                            Регенерация при смерти
                        </div>
                        <div className="gunGame-matchCreate-content-row2-block">
                            <div onClick={() => this.setRebornAfterDeath(true)}
                                className={`gunGame-matchCreate-content-row2-block__button ${this.state.rebornAfterDeath ? "gunGame-matchCreate-content-row2__active" : null}`}>
                                Да
                            </div>
                            <div onClick={() => this.setRebornAfterDeath(false)} className={`gunGame-matchCreate-content-row2-block__button ${this.state.rebornAfterDeath ? null : "gunGame-matchCreate-content-row2__active"}`}>
                                Нет
                            </div>
                        </div>
                    </div>

                    {this.state.createType === "deathmatch" && <div className="gunGame-matchCreate-content-row2">
                        <div className="gunGame-matchCreate-content-row2__title">
                            Выберите <br/>
                            оружие
                        </div>
                        <div
                            className="gunGame-matchCreate-content-row2-block gunGame-matchCreate-content-row2-block_big">

                            <div className="gunGame-matchCreate-content-row2-block__arrowLeft" onClick={() => this.changeSelectedGun(false)}>
                                <img src={arrow} alt=""/>
                            </div>

                            <div className="gunGame-matchCreate-content-row2-block__item">
                                <img src={iconsItems['Item_' + weapon_list.find(w => w.hash == this.DM_WEAPONS[this.state.selectedGun].weapon).weapon]} alt=""/>
                            </div>

                            <div className="gunGame-matchCreate-content-row2-block__arrowRight" onClick={() => this.changeSelectedGun(true)}>
                                <img src={arrow} alt=""/>
                            </div>

                        </div>

                    </div>}

                    <div className="gunGame-matchCreate-content-row">
                        <div className="gunGame-matchCreate-content-row__startButton"
                             onClick={() => this.createMatch()}>
                            СОЗДАТЬ МАТЧ
                        </div>
                    </div>

                </div>

            </div>
            }
        </>
    }
}
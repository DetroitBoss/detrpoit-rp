import React, {Component} from 'react';

import "./style.less"
import {ANIM_LIST, getPurchaseableModelForAnim, WALKING_STYLES} from "../../../shared/anim"
import test from "./assets/test.gif"
import anims from "./assets/items/*.gif";


import closeIcon from "./assets/closeIcon.svg";
import statusRed from "./assets/status-red.svg";
import statusGreen from "./assets/status-green.svg";
import favourite from "./assets/favorite.svg";
import social from "./assets/social.svg";
import services from "./assets/services.svg";
import dance from "./assets/dance.svg";
import poses from "./assets/poses.svg";
import sit from "./assets/sit.svg";
import speach from "./assets/speach.svg";
import dances from "./assets/dances.svg";
import joy from "./assets/joy.svg";
import searchIcon from "./assets/searchIcon.svg";
import noneFavourite from "./assets/favoriteO.svg";
import {CustomEvent} from "../../modules/custom.event";
import {CEF} from "../../modules/CEF";
import classNames from "classnames";


export class Animations extends Component<{}, {
    activeCat: number,
    catName: string,
    array: any[],
    favourite: { name: string, category: string }[]
    purchased: number[]
}> {
    input: any = React.createRef();

    constructor(props: any) {
        super(props);

        this.state = {
            activeCat: 1,
            catName: "Социальные",
            array: [],
            favourite: [{name: "Играть в гольф", category: "Развлечение"}],
            purchased: []
        }

        CustomEvent.register('anim:setFavourite', (favourite: { name: string, category: string }[]) => {
            this.setState({...this.state, favourite})
        })

        CustomEvent.callServer("anim:getPurchased").then((purchased: number[]) => {
            if (!purchased) return
            this.setState({
                purchased
            })
        })
    }

    componentDidMount() {
        this.getList();
    }

    changeCat(id: number, name: string) {
        this.setState({activeCat: id, catName: name});

        if (id === 8) {
            return;
        }

        this.getList(name);
    }

    getList(name: string = undefined) {
        let arr: any[] = [],
            cat: string = name === undefined ? this.state.catName : name;

        if (cat === 'Избранное') {
            this.state.favourite.map(item => {
                if (this.isFavourite(item.name))
                    arr.push({key: item.name, value: item.category});
            })
        } else if (this.input.current.value === "") {
            for (const [key, value] of Object.entries(ANIM_LIST[cat])) {
                arr.push({key, value});
            }
        } else {
            for (let item in ANIM_LIST) {
                for (let item2 in ANIM_LIST[item]) {
                    arr.push({key: item2, value: ANIM_LIST[item][item2]});
                }
            }

            arr = arr.filter((el) => el.key.toLowerCase().includes(this.input.current.value.toLowerCase()))
        }

        this.setState({array: arr});
    }

    startAnim(value: any) {
        const favourite = this.state.favourite.find(item => item.name === value);
        if (favourite) CustomEvent.triggerClient('anim:play', favourite.category, value)
        else CustomEvent.triggerClient('anim:play', this.state.catName, value)
    }

    changeWalkingStyle(styleIndex: number) {
        CustomEvent.triggerServer('anim:changeWalkingStyle', styleIndex);
    }

    setFavourite(animName: string) {
        CustomEvent.triggerClient('anim:switchFavourite', this.state.catName, animName)
    }

    close() {
        CEF.gui.setGui(null);
    }

    stopAnim() {
        CustomEvent.triggerClient('anim:stopPlaying')
    }

    isFavourite(name: string): boolean {
        const purchaseableModel = getPurchaseableModelForAnim(name)
        if (purchaseableModel) {
            return this.state.favourite.some(item => item.name === name) && this.state.purchased.includes(purchaseableModel.id)
        }
        return this.state.favourite.some(item => item.name === name)
    }

    isAnimAvailable(name: string): boolean {
        const purchaseableModel = getPurchaseableModelForAnim(name)
        if (purchaseableModel) {
            return this.state.purchased.includes(purchaseableModel.id)
        }
        return true
    }

    getAnimationsPage() {
        return <>
            <div className="animation-right__search">
                <img src={searchIcon} alt=""/>
                <input type="text" ref={this.input} onChange={() => this.getList()} placeholder="Поиск ..."/>
            </div>
            <div className="animation-right-content">
                {
                    this.state.array.map((el, key) => {
                        return <div className={classNames("animation-right-content-block",
                            {"animation-right-content-block__blocked": !this.isAnimAvailable(el.key)}
                        )} key={key}
                        >
                            {!this.isAnimAvailable(el.key) &&
                                <div className="animation-right-content-block__blocked-text">Анимация доступна в боевом пропуске</div>
                            }
                            <img src={CEF.getAnimsURL(el.key)}
                                 alt=""
                                 loading="lazy"
                                 className="animation-right-content-block__stop"
                                 onClick={() => this.startAnim(el.key)}
                                 style={{"pointerEvents": "all"}}
                            />
                            <img
                                src={this.isFavourite(el.key) ? favourite : noneFavourite}
                                alt=""
                                style={{"pointerEvents": "all"}}
                                onClick={() => this.setFavourite(el.key)}/>
                            <span>{el.key}</span>
                        </div>
                    })
                }
            </div>
        </>
    }

    getWalkingStylesPage() {
        return <>
            <div className="animation-right-content">
                {
                    WALKING_STYLES.map((el, index) => {
                        return <div className="animation-right-content-block" key={index}
                        >
                            <img src={CEF.getAnimsURL(el.name)}
                                 alt=""
                                 loading="lazy"
                                 className="animation-right-content-block__stop"
                                 onClick={() => this.changeWalkingStyle(index)}
                                 style={{"pointerEvents": "all"}}
                            />
                            <span>{el.name}</span>
                        </div>
                    })
                }
            </div>
        </>
    }

    render() {
        return <div className='animation'>

            <div className="closeButton" onClick={() => this.close()}>
                <div>
                    <img src={closeIcon} alt=""/>
                </div>
                Закрыть
            </div>

            <div className="stopButton" onClick={() => this.stopAnim()}>
                <div>
                    F10
                </div>
                Остановить анимацию
            </div>

            <div className="animation-left">
                <div className={`animation-left__button ${this.state.activeCat === 0 ? "animation-active" : ""}`}
                     onClick={() => this.changeCat(0, "Избранное")}>
                    <img src={favourite} alt=""/>
                    Избранное
                </div>
                <div className={`animation-left__button ${this.state.activeCat === 1 ? "animation-active" : ""}`}
                     onClick={() => this.changeCat(1, "Социальные")}>
                    <img src={social} alt=""/>
                    Социальные
                </div>
                <div className={`animation-left__button ${this.state.activeCat === 2 ? "animation-active" : ""}`}
                     onClick={() => this.changeCat(2, "Служебные")}>
                    <img src={services} alt=""/>
                    Служебные
                </div>
                <div className={`animation-left__button ${this.state.activeCat === 3 ? "animation-active" : ""}`}
                     onClick={() => this.changeCat(3, "Танцы")}>
                    <img src={dance} alt=""/>
                    Танцы
                </div>
                <div className={`animation-left__button ${this.state.activeCat === 4 ? "animation-active" : ""}`}
                     onClick={() => this.changeCat(4, "Позы")}>
                    <img src={poses} alt=""/>
                    Позы
                </div>
                <div className={`animation-left__button ${this.state.activeCat === 5 ? "animation-active" : ""}`}
                     onClick={() => this.changeCat(5, "Сидеть")}>
                    <img src={sit} alt=""/>
                    Сидеть
                </div>
                <div className={`animation-left__button ${this.state.activeCat === 6 ? "animation-active" : ""}`}
                     onClick={() => this.changeCat(6, "Монологи")}>
                    <img src={speach} alt=""/>
                    Монологи
                </div>
                <div className={`animation-left__button ${this.state.activeCat === 7 ? "animation-active" : ""}`}
                     onClick={() => this.changeCat(7, "Развлечение")}>
                    <img src={joy} alt=""/>
                    Развлечение
                </div>
                <div className={`animation-left__button ${this.state.activeCat === 8 ? "animation-active" : ""}`}
                     onClick={() => this.changeCat(8, "Стили походок")}>
                    <img src={poses} alt=""/>
                    Стили походок
                </div>
            </div>

            <div className="animation-right">

                {this.state.activeCat === 8
                    ? this.getWalkingStylesPage()
                    : this.getAnimationsPage()
                }
            </div>

        </div>
    }
}
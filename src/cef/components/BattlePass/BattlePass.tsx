import React, {Component} from "react";
import "./style.less";

import {Enter} from "./Pages/Enter"
import {Main} from "./Pages/Main"
import {Quests} from "./Pages/Quests"
import {Rating} from "./Pages/Rating"
import {Storage} from "./Pages/Storage"

import {GiftBlock} from "./components/GiftBlock"
import {LevelBlock} from "./components/LevelBlock"
import {LevelGiftBlock} from "./components/LevelGiftBlock"
import {NavigationBar} from "./components/NavigationBar"
import {Footer} from "./components/Footer"

import png from "./assets/*.png";
import svg from "./assets/*.svg"
import {CustomEventHandler} from "../../../shared/custom.event";
import {CustomEvent} from "../../modules/custom.event";
import {CEF} from "../../modules/CEF";
import {BattlePassDTO, BattlePassTasksDTO, RatingDTO, TaskDTO} from "../../../shared/battlePass/DTOs";
import BattlePassStorageStore from "../../stores/BattlePassStorage";

export type component = 'purchase' | 'main' | 'tasks' | 'rating' | 'storage' | 'purchase-storage';

export class BattlePass extends Component<{
    storageStore: BattlePassStorageStore
}, {
    component: component
    exp: number
    receivedRewards: number[]
    rating: RatingDTO[]
    expires: string
    globalExist: boolean
    global: TaskDTO
    basic: TaskDTO[]
    showGiftBlock: boolean
    showLevelBlock: boolean
    showGiftLevelBlock: boolean
    coins: number
    discountActive: boolean
    everyDayExp: string
}> {

    ev: CustomEventHandler
    ev1: CustomEventHandler
    ev2: CustomEventHandler
    ev3: CustomEventHandler
    ev4: CustomEventHandler
    ev5: CustomEventHandler

    constructor(props: any) {
        super(props);

        this.state = {
            component: 'purchase',
            exp: 0,
            receivedRewards: [],
            rating: [],
            expires: '26.04.2022 12:00',
            globalExist: false,
            global: {
                exp: 400,
                name: 'Test data',
                desc: 'Test data',
                progress: 0,
                goal: 1
            },
            basic: [],
            showGiftBlock: false,
            showLevelBlock: false,
            showGiftLevelBlock: false,
            coins: 0,
            discountActive: false,
            everyDayExp: 'Получен'
        }

        this.ev = CustomEvent.register('battlePass:setComponent', (component: component) => {
            this.setComponent(component);
        });

        this.ev1 = CustomEvent.register('battlePass:setData', (DTO: BattlePassDTO) => {
            this.setState({
                ...this.state,
                exp: DTO.exp,
                receivedRewards: DTO.receivedRewards,
                expires: DTO.battlePassExpires,
                coins: DTO.coins,
                discountActive: DTO.discountActive,
                everyDayExp: DTO.everyDayExp
            })
        })

        this.ev2 = CustomEvent.register('battlePass:setTasksData', (DTO: BattlePassTasksDTO) => {
            if (DTO.global) {
                this.setState({...this.state, basic: DTO.basic, global: DTO.global, globalExist: true});
            }else{
                this.setState({...this.state, basic: DTO.basic, globalExist: false});
            }
        })

        this.ev3 = CustomEvent.register('battlePass:updateReceivedRewards', (data: number[]) => {
            this.setState({
                ...this.state,
                receivedRewards: data
            })
        });

        this.ev4 = CustomEvent.register('battlePass:updateExp', (exp: number) => {
            this.setState({
                ...this.state,
                exp
            })
        })

        this.ev5 = CustomEvent.register('battlePass:setRating', (rating: RatingDTO[]) => {
            this.setState({
                ...this.state,
                rating
            })
        })
    }

    setComponent = (component: component) => {
        this.setState({...this.state, component});
    }

    exit() {
        CEF.gui.setGui(null)
    }

    componentWillUnmount() {
        this.ev.destroy();
        this.ev1.destroy();
        this.ev2.destroy();
        this.ev3.destroy();
        this.ev4.destroy();
        this.ev5.destroy();
    }

    changeShowGiftBlock = (toggle: boolean) => {
        this.setState({...this.state, showGiftBlock: toggle});
    }

    changeShowLevelBlock = (toggle: boolean) => {
        this.setState({...this.state, showLevelBlock: toggle});
    }

    changeDiscountActiveState = (toggle: boolean) => {
        this.setState({...this.state, discountActive: toggle});
    }

    changeShowGiftLevelBlock = (toggle: boolean) => {
        this.setState({...this.state, showGiftLevelBlock: toggle});
    }

    setCoins = (count: number) => {
        this.setState({...this.state, coins: count});
    }

    render() {
        return <div className="battlePass">

            <div className="exit" onClick={() => this.exit()}>
                <div className="exit__icon"><img src={svg["closeIcon"]} alt="#"/></div>
                <div className="exit__title">Закрыть</div>
            </div>

            {this.state.component === 'purchase' && <Enter changeShowBlock={this.changeShowGiftBlock}
                                                           changeDiscountActiveState={this.changeDiscountActiveState}
                                                           setCoins={this.setCoins}
                                                            setComponent={this.setComponent}/>}

            {(this.state.component !== 'purchase' && this.state.component !== 'purchase-storage') && <NavigationBar component={this.state.component}/>}
            {(this.state.component !== 'purchase' && this.state.component !== 'purchase-storage') &&
            <Footer expires={this.state.expires} changeShowGiftBlock={this.changeShowGiftBlock}
                    changeShowLevelBlock={this.changeShowLevelBlock}
                    changeShowGiftLevelBlock={this.changeShowGiftLevelBlock}
                    everyDayExp={this.state.everyDayExp}/>}
            {this.state.component === 'main' &&
            <Main exp={this.state.exp} receivedRewards={this.state.receivedRewards}/>}
            {this.state.component === 'tasks' && <Quests global={this.state.global} basic={this.state.basic}
                                                         globalExist={this.state.globalExist}/>}
            {this.state.component === 'rating' && <Rating rating={this.state.rating}/>}
            {(this.state.component === 'storage' || this.state.component === 'purchase-storage')
                && <Storage store={this.props.storageStore}/>}


            {this.state.showGiftBlock &&
            <GiftBlock changeShowBlock={this.changeShowGiftBlock} coins={this.state.coins}
                       discountActive={this.state.discountActive}/>}
            {this.state.showLevelBlock &&
            <LevelBlock changeShowBlock={this.changeShowLevelBlock} coins={this.state.coins}/>}
            {this.state.showGiftLevelBlock &&
            <LevelGiftBlock changeShowBlock={this.changeShowGiftLevelBlock} coins={this.state.coins}/>}

            <img src={png["background"]} alt="" className="battlePass__background"/>
        </div>;
    }
}
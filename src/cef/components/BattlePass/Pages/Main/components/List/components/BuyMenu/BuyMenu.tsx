import React, {Component, CSSProperties} from "react";
import "./style.less";

import svg from "./assets/*.svg"
import {ITakeMenu} from "../../../../../../../../../shared/battlePass/DTOs";
import {RewardRarity} from "../../../../../../../../../shared/battlePass/rewards";
import {CustomEvent} from "../../../../../../../../modules/custom.event";


export class BuyMenu extends Component<{
    styles: CSSProperties
    data: ITakeMenu
}, {
}> {

    constructor(props: any) {
        super(props);
    }

    buttonTake(): boolean {
        if (!this.props.data.isOpened) return false;
        return this.props.data.canTake;

    }

    render() {
        return <div className="buyMenu" style={this.props.styles} onClick={() => CustomEvent.trigger('battlePass:closeTakeMenu')}>

            {!this.props.data.isOpened && <div className="buyMenu__close">
                <img src={svg["lock"]} alt=""/>
                Закрыто
            </div>}

            <div className="buyMenu__name">
                <span style={{fontFamily: "Gilroy ExtraBold"}}>
                    {this.props.data.name}
                </span>
            </div>

            {this.props.data.rarity === RewardRarity.LEGENDARY && <div className="buyMenu-rarity buyMenu-rarity__orange">
                <img src={svg["orangeStar"]} alt=""/>
                Легендарный
            </div>}

            {this.props.data.rarity === RewardRarity.COMMON && <div className="buyMenu-rarity buyMenu-rarity__blue">
                <img src={svg["blueStar"]} alt=""/>
                Обычный
            </div>}

            {this.props.data.rarity === RewardRarity.RARE && <div className="buyMenu-rarity buyMenu-rarity__purple">
                <img src={svg["purpleStar"]} alt=""/>
                Редкий
            </div>}

            {!this.props.data.isOpened && <div className="buyMenu-rarity buyMenu-rarity__gray">
                <img src={svg["grayStar"]} alt=""/>
                Откройте данный уровень
            </div>}

            {this.buttonTake() && <div className="buyMenu-button"
                                       onClick={() => CustomEvent.triggerServer('battlePass:takeReward', this.props.data.level)}>
                Забрать
            </div>}

        </div>
    }
}
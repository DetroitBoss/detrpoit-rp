import React, {Component} from "react";
import "./style.less";

import png from "./assets/*.png";
import svg from "./assets/*.svg"
import {BATTLE_PASS_SEASON} from "../../../../../shared/battlePass/main";
import {CustomEvent} from "../../../../modules/custom.event";

export class GiftBlock extends Component<{
    changeShowBlock: Function
    coins: number
    discountActive: boolean
}, {}> {

    ref: React.RefObject<any> = React.createRef()

    constructor(props: any) {
        super(props);
    }

    sendPresent() {
        const value = this.ref.current.value;
        if (value === "") return;
        if (value.length > 7) return;

        CustomEvent.triggerServer('battlePass:sendGiftPass', Number(value));
        this.props.changeShowBlock(false);
    }

    render() {
        return <div className="giftBlock">

            <div className="giftBlock-body">

                <div className="giftBlock-body__balance">
                    Ваш баланс
                    <img src={svg["coin"]} alt=""/>
                    <span>{this.props.coins}</span>
                </div>

                <div className="giftBlock-body-block">

                    <img src={png["caseImage"]} className="giftBlock-body-block__logo3" alt=""/>

                    <div className="giftBlock-body-block__close" onClick={() => this.props.changeShowBlock(false)}>
                        <img src={svg["closeIcon"]} alt=""/>
                    </div>

                    <div className="giftBlock-body-block__title">
                        Играй вместе!
                    </div>

                    <div className="giftBlock-body-block__text">
                        Подари своим друзьям военный билет!
                    </div>

                    <input type="number" placeholder="Введи ID друга" ref={this.ref}/>

                    {<div className="enter-bottom-price">
                        <img src={svg["coin"]} alt=""/>
                        {this.props.discountActive ?
                            BATTLE_PASS_SEASON.discount.specialPrice : BATTLE_PASS_SEASON.battlePassCost}
                        {this.props.discountActive && <div className="enter-bottom-price__through">
                            <img src={svg["coin"]} alt=""/>
                            {BATTLE_PASS_SEASON.battlePassCost}
                        </div>}
                    </div>}

                    <div className="giftBlock-body-block__button" onClick={() => this.sendPresent()}>
                        <img src={svg["gift"]} alt=""/>
                        ПОДАРИТЬ
                    </div>

                </div>

            </div>

        </div>
    }
}
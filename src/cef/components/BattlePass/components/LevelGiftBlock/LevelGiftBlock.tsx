import React, {Component} from "react";
import "../GiftBlock/style.less";

import png from "./assets/*.png";
import svg from "./assets/*.svg"
import {CustomEvent} from "../../../../modules/custom.event";
import {BATTLE_PASS_SEASON} from "../../../../../shared/battlePass/main";

export class LevelGiftBlock extends Component<{
    changeShowBlock: Function
    coins: number
}, {
    levels: number
}> {
    ref: React.RefObject<any> = React.createRef()

    constructor(props: any) {
        super(props);

        this.state = {
            levels: 1
        }
    }

    changeLevels(toggle: boolean, count: number) {
        if (toggle) {
            if (this.state.levels + count > 1000) return;
            this.setState({...this.state, levels: this.state.levels + count});
        }else{
            if (this.state.levels - count < 1) return;
            this.setState({...this.state, levels: this.state.levels - count});
        }
    }

    send() {
        const value = this.ref.current.value;
        if (value === "") return;
        if (value.length > 7) return;
        this.props.changeShowBlock(false);
        CustomEvent.triggerServer('battlePass:sendGiftLevels', Number(value), this.state.levels);
    }


    render() {
        return <div className="giftBlock">

            <div className="giftBlock-body">

                <div className="giftBlock-body__balance">
                    Ваш баланс
                    <img src={svg["coin"]} alt=""/>
                    <span> {this.props.coins}</span>
                </div>

                <div className="giftBlock-body-block">

                    <img src={png["starImage"]} className="giftBlock-body-block__logo" alt=""/>

                    <div className="giftBlock-body-block__close" onClick={() => this.props.changeShowBlock(false)}>
                        <img src={svg["closeIcon"]} alt=""/>
                    </div>

                    <div className="giftBlock-body-block__title">
                        Подарите возможности!
                    </div>

                    <div className="giftBlock-body-block__text">
                        Выберите количество уровней, которые вы хотите подарить
                    </div>

                     <input type="number" placeholder="Введи ID друга" ref={this.ref}/>

                    <div className="giftBlock-body-block-level">

                        <div className="giftBlock-body-block-level__button" onClick={() => this.changeLevels(false, 10)}>
                            -10
                        </div>

                        <div className="giftBlock-body-block-level-bar">
                            <div className="giftBlock-body-block-level__button" onClick={() => this.changeLevels(false, 1)}>
                                -
                            </div>
                            <span>{this.state.levels} уровней</span>
                            <div className="giftBlock-body-block-level__button" onClick={() => this.changeLevels(true, 1)}>
                                +
                            </div>
                        </div>

                        <div className="giftBlock-body-block-level__button" onClick={() => this.changeLevels(true, 10)}>
                            +10
                        </div>

                    </div>

                    <div className="enter-bottom-price">
                        <img src={svg["coin"]} alt=""/>
                        {this.state.levels * BATTLE_PASS_SEASON.levelPrice}
                        {/*<div className="enter-bottom-price__through">*/}
                        {/*    <img src={svg["coin"]} alt=""/>*/}
                        {/*    300*/}
                        {/*</div>*/}
                    </div>

                    <div className="giftBlock-body-block__button" onClick={() => this.send()}>
                        <img src={svg["gift"]} alt=""/>
                        ПОДАРИТЬ
                    </div>

                </div>

            </div>

        </div>
    }
}
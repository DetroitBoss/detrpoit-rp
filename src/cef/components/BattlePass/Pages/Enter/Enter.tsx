import React, {Component} from "react";
import "./style.less";

import png from "./assets/*.png";
import svg from "./assets/*.svg"

import {CustomEventHandler} from "../../../../../shared/custom.event";
import {CustomEvent} from "../../../../modules/custom.event";
import {PurchaseDTO} from "../../../../../shared/battlePass/DTOs";


export class Enter extends Component<{
    changeShowBlock: Function
    changeDiscountActiveState: Function
    setCoins: Function
    setComponent: Function
}, {
    discountActive: boolean
    expires: number
    price: number
    discountPrice: number
}> {

    ev: CustomEventHandler
    interval: number

    constructor(props: any) {
        super(props);

        this.state = {
            discountActive: true,
            price: 300,
            expires: 10,
            discountPrice: 200
        }

        this.ev = CustomEvent.register('battlePass:purchase', (DTO: PurchaseDTO) => {
            this.props.changeDiscountActiveState(DTO.discountActive);
            this.props.setCoins(DTO.coins);
            if (DTO.discountActive) {
                this.setState({
                    discountActive: true,
                    price: DTO.price,
                    expires: DTO.expires,
                    discountPrice: DTO.discountPrice
                })
            } else {
                this.setState({
                    discountActive: false,
                    price: DTO.price
                })
            }
        })

        this.interval = setInterval(() => {
            if (this.state.expires <= 0) return;
            if (this.state.discountActive && this.state.expires === 1) {
                this.setState({...this.state, discountActive: false, expires: this.state.expires - 1});
            } else {
                this.setState({...this.state, expires: this.state.expires - 1});
            }
        }, 1000);
    }

    convertSecondsToTime(seconds: number): string {
        if (seconds > 86400) {
            const days: number = Math.trunc(seconds / 86400);
            let word: string = 'дней';
            if (days === 1) word = 'день';
            if (days >= 2 && days <= 4) word = 'дня';
            return `${days} ${word}`;
        } else {
            return new Date(seconds * 1000).toISOString().substr(11, 8);
        }
    }

    componentWillUnmount() {
        if (this.ev) this.ev.destroy();
        if (this.interval) clearInterval(this.interval);
    }

    render() {
        return <div className="enter">

            {/*<img src={png["star"]} alt="" className="enter__star"/>*/}
            <img src={png["background"]} className="enter__background" alt=""/>


            {/*<img src={png["rightImage"]}  className="enter__right-image" alt=""/>*/}
            {/*<img src={png["leftImage"]}  className="enter__left-image" alt=""/>*/}
            <img src={png["summerEdition"]} className="enter__summer" alt=""/>

            {/* <div className="enter__title">
                    Battle Pass
                </div>*/}

            <div className="enter__text">
                Пройди всю
                <div/>
                цепочку призов!
            </div>

            {/*<img src={png["leprechaun"]} className="enter__leprechaun" alt=""/>*/}

            <div className="enter-bottom">

                <div className="enter-bottom__text">
                    <span>Описание</span>
                    BATTLE PASS - это уникальная система призов. Купи пропуск, чтобы получить доступ к эксклюзивным
                    айтемам: кастомные машины, фирменные костюмы, маски, уникальные бонусы и многое другое. С каждым
                    новым уровнем ты становишься ближе к супер призу. Пройди всю цепочку раньше всех и возглавь
                    рейтинг лидеров!
                </div>

                {this.state.discountActive && <>
                    <div className="enter-bottom-time">
                        <img src={svg["time"]} alt=""/>
                        <div className="enter-bottom-time__text">
                            Конец скидки через:
                            <span>{this.convertSecondsToTime(this.state.expires)}</span>
                        </div>
                    </div>

                    <div className="enter-bottom__line"/>
                </>}

                <div className="enter-bottom-price">
                    <img src={svg["coin"]} alt=""/>
                    {this.state.discountActive ? this.state.discountPrice : this.state.price}
                    {this.state.discountActive && <div className="enter-bottom-price__through">
                        <img src={svg["coin"]} alt=""/>
                        {this.state.price}
                    </div>}
                </div>

                <div className="footer-button" onClick={() => CustomEvent.triggerServer('battlePass:buy')}>
                    <img src={svg["cart"]} alt="" className="footer-button__icon"/>
                    <img src={svg["star"]} alt="" className="footer-button__star"/>
                    <img src={svg["star"]} alt="" className="footer-button__star"/>
                    <img src={svg["star"]} alt="" className="footer-button__star"/>
                    <img src={svg["star"]} alt="" className="footer-button__star"/>
                    <img src={svg["star"]} alt="" className="footer-button__star"/>
                    <img src={svg["star"]} alt="" className="footer-button__star"/>
                    <img src={svg["star"]} alt="" className="footer-button__star"/>
                    <img src={svg["star"]} alt="" className="footer-button__star"/>
                    <img src={svg["star"]} alt="" className="footer-button__star"/>
                    <img src={svg["star"]} alt="" className="footer-button__star"/>
                    Оформить подписку
                </div>

                <div className="footer-button footer-buttonTransparent"
                     onClick={() => this.props.changeShowBlock(true)}>
                    <img src={svg["gift"]} alt="" className="footer-button__icon"/>
                    Подарить другу
                </div>

                <div className="footer-button footer-buttonTransparent"
                     onClick={() => this.props.setComponent('purchase-storage')}>
                    <img src={svg["package"]} alt=""/>
                </div>

            </div>


        </div>;
    }
}
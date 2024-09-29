import React, {Component} from "react";
import "./style.less";

import png from "./assets/*.png";
import svg from "./assets/*.svg"

export class Footer extends Component<{
    expires: string,
    changeShowLevelBlock: Function
    changeShowGiftBlock: Function
    changeShowGiftLevelBlock: Function
    everyDayExp: string
}, {}> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return <div className="footer">

            <div className="footer__leftText">
                <span>
                    Battle pass закончится
                </span>
                {this.props.expires}
            </div>

            <div className="footer-button" onClick={() => this.props.changeShowLevelBlock(true)}>
                <img src={svg["cart"]} alt="" className="footer-button__icon"/>
                <img src={svg["star"]} alt="" className="footer-button__star"/>
                <img src={svg["star"]} alt="" className="footer-button__star"/>
                <img src={svg["star"]} alt="" className="footer-button__star"/>
                <img src={svg["star"]} alt="" className="footer-button__star"/>
                <img src={svg["star"]} alt="" className="footer-button__star"/>
                <img src={svg["star"]} alt="" className="footer-button__star"/>
                <img src={svg["star"]} alt="" className="footer-button__star"/>
                Купить уровни
            </div>

            <div className="footer-button footer-buttonTransparent"
            onClick={() => this.props.changeShowGiftLevelBlock(true)}>
                <img src={svg["gift"]} alt="" className="footer-button__icon"/>
                Подарить уровни
            </div>

            <div className="footer-button footer-buttonTransparent"
                 onClick={() => this.props.changeShowGiftBlock(true)}>
                <img src={svg["gift"]} alt="" className="footer-button__icon"/>
                Подарить пропуск
            </div>


            <div className="footer__rightText">
                <div>
                    <span>
                        До получения <br/> ежедневного опыта
                    </span>
                    {this.props.everyDayExp}
                </div>
                <img src={svg["flash"]} alt=""/>
            </div>

        </div>
    }
}
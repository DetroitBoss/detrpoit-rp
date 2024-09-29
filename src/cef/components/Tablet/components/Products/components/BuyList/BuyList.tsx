import React, {Component} from "react";
import "../../style.less";

import png from "../../assets/*.png";
import svg from "../../assets/*.svg";
import classNames from "classnames";
import ReactTooltip from 'react-tooltip';

export class BuyList extends Component<{}, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return <div className="tp-basket">
            <div className="tp-basket-top">
                <img src={svg["cross"]} className="tp-basket-top__close" alt=""/>
                <div className="tp-basket-top__title">Список <br/>покупок</div>
                <div className="tp-basket-top-list">
                    <div className="tp-basket-top-list-block">
                        <div className="tp-basket-top-list-block__name">Kevin</div>
                        <div className="tp-basket-top-list-block__value">x2</div>
                        <div className="tp-basket-top-list-block__sum">
                            120$
                            <img src={svg["trash"]} alt=""/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tp-basket-bottom">
                <img src={svg["basketBottom"]} className="tp-basket-bottom__background" alt=""/>
                <h1>Итог</h1>
                <span>3 000$</span>
                <div className="tp-basket-bottom__button">Оформить</div>
            </div>
        </div>;
    }
}
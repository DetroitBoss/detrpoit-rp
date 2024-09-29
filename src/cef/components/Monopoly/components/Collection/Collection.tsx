import React from "react";
import "./style.less";

import svg from "../../assets/*.svg";
import brands from "../../assets/brands/*.png";
import bigBrands from "../../assets/bigBrands/*.png";
import png from "../../assets/*.png";
import {FIRM_ID_TO_BRAND_IMAGE, FIRM_ID_TO_COST} from "../../config";

const Collection = (props: {firmIds: number[], hide: () => void}) => {
    return <div className="monopoly-dropCard" onClick={props.hide}>

        <div className="monopoly-dropCard-gradient monopoly-dropCard-gradient__top"/>
        <div className="monopoly-dropCard-gradient monopoly-dropCard-gradient__bottom"/>

        <img src={svg["arrows"]} className="monopoly-dropCard__arrows" alt=""/>

        <div className="monopoly-dropCard__title">Вы собрали Улицу!</div>
        <div className="monopoly-dropCard__text">Теперь налог на бренды увеличился в два раза</div>
        <div className="monopoly-dropCard__bonus">X2</div>

       <div className="monopoly-dropCard-list">

           {props.firmIds.map(id => {
                return <div className="monopoly-dropCard-card">
                    <div className="monopoly-dropCard-card__price">
                        <img src={svg["tax"]} alt=""/>
                        <div className="monopoly-dropCard-card__price-block">
                            <div>$ {FIRM_ID_TO_COST.get(id)}</div>
                            <span>$ {FIRM_ID_TO_COST.get(id) * 2}</span>
                        </div>
                    </div>
                    <div className="monopoly-dropCard-card__brand">
                        <img src={bigBrands[`${FIRM_ID_TO_BRAND_IMAGE.get(id)}`]} alt=""/>
                    </div>
                    <img src={png["card"]} className="monopoly-dropCard-card__background" alt=""/>
                </div>
           })}
       </div>

        <div className="monopoly-dropCard__description">
            Нажмите в любое место, <br/>чтобы продолжить
        </div>

    </div>
}

export default Collection;
import React from "react";
import "./style.less";

import svg from "../../assets/*.svg";
import brands from "../../assets/brands/*.png";
import bigBrands from "../../assets/bigBrands/*.png";
import png from "../../assets/*.png";
import {FIRM_ID_TO_BRAND_IMAGE} from "../../config";

const DropCard = (props: {firmId: number, hide: () => void}) => {
    return <div className="monopoly-dropCard" onClick={props.hide}>

        <div className="monopoly-dropCard-gradient monopoly-dropCard-gradient__top"/>
        <div className="monopoly-dropCard-gradient monopoly-dropCard-gradient__bottom"/>

        <img src={svg["arrows"]} className="monopoly-dropCard__arrows" alt=""/>

        <div className="monopoly-dropCard__title">Вы получили Карточку!</div>


       <div className="monopoly-dropCard-list">
           <div className="monopoly-dropCard-card">
               <div className="monopoly-dropCard-card__price">
                   <img src={svg["new"]} alt=""/>
               </div>
               <div className="monopoly-dropCard-card__brand">
                   <img src={bigBrands[`${FIRM_ID_TO_BRAND_IMAGE.get(props.firmId)}`]} alt=""/>
               </div>
               <img src={png["card"]} className="monopoly-dropCard-card__background" alt=""/>
           </div>
       </div>


        <div className="monopoly-dropCard__description">
            Нажмите в любое место, <br/>чтобы продолжить
        </div>

    </div>
}

export default DropCard;
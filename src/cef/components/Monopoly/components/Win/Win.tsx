import React from "react";
import "./style.less";

import svg from "../../assets/*.svg";
import brands from "../../assets/brands/*.png";
import bigBrands from "../../assets/bigBrands/*.png";
import png from "../../assets/*.png";
import {CEF} from "../../../../modules/CEF";

const Win = () => {
    return <div className="monopoly-dropCard" onClick={() => CEF.gui.setGui(null)}>

        <div className="monopoly-dropCard-gradient monopoly-dropCard-gradient__top"/>
        <div className="monopoly-dropCard-gradient monopoly-dropCard-gradient__bottom"/>

        <img src={svg["arrows"]} className="monopoly-dropCard__arrows" alt=""/>

        <div className="monopoly-dropCard__title">Вы выиграли!</div>
        <div className="monopoly-dropCard__text">Теперь вы монополист!</div>

       <div className="monopoly-dropCard-list">

           <div className="monopoly-dropCard-card">
               <div className="monopoly-dropCard-card__price">
                   <img src={svg["win"]} alt=""/>
               </div>
               <div className="monopoly-dropCard-card__brand">
                   <img src={png["person"]} alt=""/>
               </div>
               <img src={png["card"]} className="monopoly-dropCard-card__background" alt=""/>
           </div>

       </div>

        <div className="monopoly-dropCard__description">
            Нажмите в любое место, <br/>чтобы продолжить
        </div>

    </div>
}

export default Win;
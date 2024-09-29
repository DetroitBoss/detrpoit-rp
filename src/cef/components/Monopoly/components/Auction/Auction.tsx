import React from "react";
import "./style.less"

import bigBrands from "../../assets/bigBrands/*.png";

const Auction = () => {
    return <div className="monopoly-auction">
        <div className="monopoly-auction-image">
            <img src={bigBrands["chanel"]} alt=""/>
            <div className="monopoly-auction-image__title">Аукцион!</div>
        </div>
        <hr/>
        <div className="monopoly-auction__title">
            <div>Ставка</div>
            $ 1200
        </div>
        <div className="monopoly-auction__button monopoly-auction__button-orange">Повысить ставку на 100$</div>
        <div className="monopoly-auction__button">Пропустить ход</div>
    </div>
}

export default Auction;
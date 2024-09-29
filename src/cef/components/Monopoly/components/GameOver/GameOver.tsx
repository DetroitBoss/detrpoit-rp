import React from "react";
import "./style.less";

import svg from "../../assets/*.svg";

const GameOver = () => {
    return <div className="monopoly-gameOver">

        <div className="monopoly-gameOver-gradient gameOver-gradient__top"/>
        <div className="monopoly-gameOver-gradient gameOver-gradient__bottom"/>

        <img src={svg["arrows"]} className="monopoly-gameOver__arrows" alt=""/>

        <div className="monopoly-gameOver__title">Игра закончена!</div>
        <div className="monopoly-gameOver__text">
            У вас закончились деньги. <br/>
            Вы можете остаться, чтобы досмотреть игру или выйти
        </div>

        <div className="monopoly-gameOver-buttons">
            <div className="monopoly-gameOver-buttons__left">Остаться</div>
            <div className="monopoly-gameOver-buttons__right">Выйти</div>
        </div>


    </div>
}

export default GameOver;
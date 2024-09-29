import React from "react";
import "./style.less";

import png from "../../assets/*.png";
import svg from "../../assets/*.svg";

import bigBrands from "../../assets/bigBrands/*.png";
import brands from "../../assets/brands/*.png";
import bonuses from "../../assets/bonuses/*.svg";
import cards from "../../assets/cards/*.png";
import dice from "../../assets/dice/*.svg";
import figurines from "../../assets/figurines/*.svg"
import {IMonopolyPlayerDTO} from "../../../../../shared/boardGames/monopoly/playerDTO";
import {FIRM_ID_TO_BRAND_IMAGE, FIRM_ID_TO_CARD_COLOR, FIRM_ID_TO_COST, PLAYER_IDX_TO_IMAGE} from "../../config";

const RightSide = (props: {player: IMonopolyPlayerDTO, idx: number, showRules: () => void}) => {
    return <div className="monopoly-rightSide">

        <div className="monopoly-rightSide-rules" onClick={props.showRules}>
            <img src={svg["rules"]} alt=""/>
            Правила
        </div>

        <div className="monopoly-rightSide__title">
            Информация о вас
        </div>

        <div className="monopoly-rightSide-info">
            <div className="monopoly-rightSide-info__image">
                <img src={figurines[`${PLAYER_IDX_TO_IMAGE.get(props.idx)}`]} alt=""/>
            </div>
            <div className="monopoly-rightSide-info-text">
                <div className="monopoly-rightSide-info-text__name">{props.player?.name ?? 'Unknown'}</div>
                <div className="monopoly-rightSide-info-text__balance">
                    <img src={svg["wallet"]} alt=""/>
                    $ {props.player?.balance ?? 0}
                </div>
            </div>
        </div>

        <div className="monopoly-rightSide__title">
            Ваши бизнесы
        </div>

        <div className="monopoly-rightSide-list">
            {props.player?.ownedFirmIds.map(firmId => {
                return <div className="monopoly-rightSide-list-block">
                    <div className={`monopoly-rightSide-list-block__line monopoly-rightSide-list-block__line-${FIRM_ID_TO_CARD_COLOR.get(firmId)}`}/>
                    <img src={brands[`${FIRM_ID_TO_BRAND_IMAGE.get(firmId)}`]} alt="" className="monopoly-rightSide-list-block__logo"/>
                    <img src={svg["tax"]} alt="" className="monopoly-rightSide-list-block__tax"/>
                    <div className="monopoly-rightSide-list-block__money">+$ {FIRM_ID_TO_COST.get(firmId)}</div>
                </div>
            })}

        </div>

    </div>
}

export default RightSide
import React, {useEffect} from "react";
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
import {systemUtil} from "../../../../../shared/system";
import {FIELD_ID_TO_HINT, FIRM_ID_TO_CARD_COLOR, PLAYER_IDX_TO_IMAGE} from "../../config";
import {CEF} from "../../../../modules/CEF";
import {CustomEvent} from "../../../../modules/custom.event";

const LeftSide = (props: { players: IMonopolyPlayerDTO[], currentPlayerId: number, lastFieldId: number }) => {
    const getCurrentPlayer = () => props.players.find(p => p.id == props.currentPlayerId) ?? props.players[0]

    return <div className="monopoly-leftSide">

        <div className="monopoly-leftSide-exit" >
            <div onClick={() => {
                CustomEvent.triggerServer('monopoly:playerLeft')
                CEF.gui.setGui(null)
            }}>ESC</div>
            Уйти
        </div>

        <div className="monopoly-leftSide__title">
            Все участники
            <div>{props.players.length}/4</div>
        </div>

        <div className="monopoly-leftSide-block leftSide-block__red">
            <div className="monopoly-leftSide-block__image">
                <img src={figurines[`${PLAYER_IDX_TO_IMAGE.get(props.players.indexOf(getCurrentPlayer()))}`]} alt=""/>
            </div>
            <div className="monopoly-leftSide-block-information">

                <div className="monopoly-leftSide-block-information-status">
                    <div className="monopoly-leftSide-block-information-status__number">
                        Игрок {props.players.indexOf(getCurrentPlayer()) + 1}
                    </div>
                    <div className="monopoly-leftSide-block-information-status__action">
                        Делает бросок
                    </div>
                </div>

                <div className="monopoly-leftSide-block-information__name">
                    {getCurrentPlayer().name}
                </div>

                <div className="monopoly-leftSide-block-information__money">
                    <img src={svg["wallet"]} alt=""/>
                    {systemUtil.numberFormat(getCurrentPlayer().balance)}
                </div>

            </div>
        </div>
        {props.lastFieldId != 0 && <div>
            <div className="monopoly-leftSide__title">
                Попал на:
            </div>

            <div className="monopoly-leftSide-position">
                <div className="monopoly-leftSide-position-left monopoly-leftSide-position-left">
                    <div className="monopoly-leftSide-position-left__block">
                        <div/>
                    </div>
                    {FIELD_ID_TO_HINT.get(props.lastFieldId)?.title ?? 'Firm'}
                </div>
                <div className="monopoly-leftSide-position-text">
                    {FIELD_ID_TO_HINT.get(props.lastFieldId)?.desc ?? 'Получает возможность приобрести фирму'}
                </div>
            </div>
        </div>}


        <hr/>

        <div className="monopoly-leftSide-list">

            {props.players.map((p, idx) => {
                return <div className="monopoly-leftSide-block">
                    <div className="monopoly-leftSide-block__image">
                        <img src={figurines[`${PLAYER_IDX_TO_IMAGE.get(idx)}`]} alt=""/>
                    </div>
                    <div className="monopoly-leftSide-block-information">

                        <div className="monopoly-leftSide-block-information-status">
                            <div className="monopoly-leftSide-block-information-status__number">
                                Игрок {idx + 1}
                            </div>
                            <div className="monopoly-leftSide-block-information-status__action">
                                {p.id == props.currentPlayerId ? 'Делает бросок' : 'Ожидает хода'}
                            </div>
                        </div>

                        <div className="monopoly-leftSide-block-information__name">
                            {p.name}
                        </div>

                        <div className="monopoly-leftSide-block-information__money">
                            <img src={svg["wallet"]} alt=""/>
                            ${systemUtil.numberFormat(p.balance)}
                        </div>

                    </div>

                    <hr/>

                    <div className="monopoly-leftSide-block-cards">
                        Карточки:
                        {p.ownedFirmIds.map(id => {
                            return <div className={`monopoly-leftSide-block-cards-${FIRM_ID_TO_CARD_COLOR.get(id)}`}/>
                        })}
                    </div>
                </div>

            })}

        </div>

    </div>
}

export default LeftSide
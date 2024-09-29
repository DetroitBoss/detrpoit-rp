import React, {useCallback, useEffect} from "react";
import "./style.less";

import svg from "../../assets/*.svg";
import png from "../../assets/*.png";
import bigBrands from "../../assets/bigBrands/*.png"
import {FIRM_ID_TO_BRAND_IMAGE, FIRM_ID_TO_COST} from "../../config";
import {CustomEvent} from "../../../../modules/custom.event";
import {CEF} from "../../../../modules/CEF";

const Sell = (props: {firmIds: number[], hide: () => void, type: 'buyFirm' | 'payTax'}) => {
    const onSell = useCallback((id: number) => {
        CustomEvent.triggerServer('monopoly:sell', id)
    }, [])

    const reject = useCallback(() => {
        if (props.type == 'buyFirm')
            CustomEvent.triggerServer('monopoly:buy:reject')
        props.hide()
    }, [])

    useEffect(() =>  {
        const t = setTimeout(reject , 20000)
        return () => clearTimeout(t)
    }, [])

    return <div className="monopoly-sell">

        <div className="monopoly-sell-gradient monopoly-sell-gradient__top"/>
        <div className="monopoly-sell-gradient monopoly-sell-gradient__bottom"/>

        <div className="monopoly-sell-header">
            <div className="monopoly-sell-header__title">
                Продажа бизнеса
            </div>
            <div className="monopoly-sell-header-close" onClick={reject}>
                <div>Закрыть</div>
                <img src={svg["close"]} alt=""/>
            </div>
        </div>

        <div className="monopoly-sell-list">
            {props.firmIds.map(id => {
                return <div className="monopoly-sell-list-block">
                    <div className="monopoly-sell-list-block-card">
                        <div className="monopoly-sell-list-block-card__price">$ {Math.floor(FIRM_ID_TO_COST.get(id) / 2)}</div>
                        <div className="monopoly-sell-list-block-card__brand">
                            <img src={bigBrands[`${FIRM_ID_TO_BRAND_IMAGE.get(id)}`]} alt=""/>
                        </div>
                        <img src={png["card"]} className="monopoly-sell-list-block-card__background" alt=""/>
                    </div>
                    <div className="monopoly-sell-list-block__button" onClick={() => onSell(id)}>Продать</div>
                </div>
            })}
        </div>
    </div>
}

export default Sell;
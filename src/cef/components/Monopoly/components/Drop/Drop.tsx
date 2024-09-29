import React, {useCallback, useEffect} from "react";
import "./style.less";

import svg from "../../assets/*.svg";
import brands from "../../assets/brands/*.png";
import {FIRM_ID_TO_BRAND_IMAGE, FIRM_ID_TO_COST} from "../../config";
import {CustomEvent} from "../../../../modules/custom.event";

const Drop = (props: {fieldId: number, hide: () => void}) => {
    const reject = useCallback(() => {
        CustomEvent.triggerServer('monopoly:buy:reject')
        props.hide()
    }, [])

    const confirm = useCallback(() => {
        CustomEvent.triggerServer('monopoly:buy:confirm')
        props.hide()
    }, [])

    useEffect(() =>  {
        const t = setTimeout(reject, 20000)
        return () => clearTimeout(t)
    }, [])

    return <div className="monopoly-drop">

        <div className="monopoly-drop-gradient monopoly-drop-gradient__top"/>
        <div className="monopoly-drop-gradient monopoly-drop-gradient__bottom"/>

        <img src={svg["arrows"]} className="monopoly-drop__arrows" alt=""/>

        <div className="monopoly-drop__title">Вам выпало</div>
        <img src={brands[`${FIRM_ID_TO_BRAND_IMAGE.get(props.fieldId)}`]} className={"monopoly-drop__image"} alt=""/>
        <div className="monopoly-drop__title">Покупаешь?</div>
        <div className="monopoly-drop__text">
            Если вы откажитесь от покупки, то поле смогут купить <br/> другие игроки
        </div>

        <div className="monopoly-drop-buttons">
            <div className="monopoly-drop-buttons__left" onClick={confirm}>купить за {FIRM_ID_TO_COST.get(props.fieldId)}</div>
            <div className="monopoly-drop-buttons__right" onClick={reject}>Отказаться</div>
        </div>
    </div>
}

export default Drop;
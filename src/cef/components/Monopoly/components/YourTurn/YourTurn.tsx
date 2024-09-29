import React, {useCallback, useEffect} from "react";
import "./style.less"
import {CustomEvent} from "../../../../modules/custom.event";
import {CEF} from "../../../../modules/CEF";

const YourTurn = (props: {hide: () => void, showSell: () => void, type: 'buyFirm' | 'payTax'}) => {
    const onLose = useCallback(() => {
        CustomEvent.triggerServer('monopoly:playerLeft')
        CEF.gui.setGui(null)
    }, [])

    const onSkip = useCallback(() => {
        CustomEvent.triggerServer('monopoly:buy:reject')
        props.hide()
    }, [])

    const onSell = useCallback(() => {
        if (props.type == 'buyFirm')
            props.hide()
        props.showSell()
    }, [])

    useEffect(() =>  {
        const t = setTimeout(props.type == 'buyFirm' ? onSkip : onLose, 30000)
        return () => clearTimeout(t)
    }, [])

    return <div className="monopoly-yourTurn">
        <div className="monopoly-yourTurn__title">Недостаточно средств!</div>
        {props.type == 'buyFirm' &&
            <div className="monopoly-yourTurn__button monopoly-yourTurn__button-orange" onClick={onSkip}>Пропустить</div>}
        {props.type == 'payTax' &&
            <div className="monopoly-yourTurn__button monopoly-yourTurn__button-orange" onClick={onLose}>Сдаться</div>}
        <div className="monopoly-yourTurn__button" onClick={onSell}>Продать бизнес</div>
    </div>
}

export default YourTurn;
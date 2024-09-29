import React, {Component} from "react";

// @ts-ignore
import png from '../../assets/*.png'
// @ts-ignore
import svg from "../../assets/*.svg"
import { systemUtil } from '../../../../../../../shared/system'
import { CEF } from '../../../../../../modules/CEF'
import { CustomEvent } from '../../../../../../modules/custom.event'

export class CattleReady extends Component<{}, {
    amountRef: React.RefObject<any>
}> {
    constructor(props: any) {
        super(props);

        this.state = {
            amountRef: React.createRef()
        }
    }

    startRent(): void {
        const value = Number(systemUtil.filterInput(this.state.amountRef.current.value))

        if (isNaN(value) || value <= 0 || value > 999999)
            return CEF.alert.setAlert('error', 'Сумма введена неверно')

        CustomEvent.triggerServer('farm:capital:add', value)
    }

    render() {
        return <div className="farm-entrance-block-content">

            <img src={png['cow']} className="farm-entrance-block-content__cow"  alt=""/>

            <div className="farm-entrance-block-content__bigName">
                СКОТ
            </div>

            <div className="farm-entrance-block-content__name farm__readyTitle">
                <div>Вы успешно</div>
                <span> арендовали скот!</span>
            </div>

            <div className="farm-entrance-block-content__title">
                Перед началом работы внесите уставной капитал. <br/>
                Эта сумма пойдет на оплату заработной платы вашим сотрудникам
            </div>


            <div className="farm-entrance-block-content-input">
                <div>$</div>
                <input ref={this.state.amountRef} type="number" placeholder="Введите сумму"/>
            </div>

            <div className="farm-entrance-block-content__button" onClick={() => this.startRent()}>
                <div className="farm__bigButton">
                    ВНЕСТИ
                </div>
            </div>


        </div>
    }
}
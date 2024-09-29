import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import './style.less'
import {CustomEventHandler} from "../../../shared/custom.event";
import {PayBox} from "./PayBox";
import {system} from "../../modules/system";
import check from "../ClothShop/assets/check.svg";
import close from "../HudBlock/images/svg/close.svg";
import {CEF} from "../../modules/CEF";

import PayBlockStore from "../../stores/PayBlock";
import { observer } from 'mobx-react'

@observer
export class PayBlockComponent extends Component<{
    store: PayBlockStore
}, {

}> {
    /** Это наш ивент, через который интерфейс может получать данные от клиента или сервера */
    private _child = React.createRef<PayBox>();
    store: PayBlockStore

    get payBox(){
        return this._child.current
    }

    constructor(props: any) {
        super(props);
        this.store = this.props.store
        // Если необходимо - можно объявить ивент для получения данных от клиента или сервера.
    }

    render() {
        // Пока мы не получили данные через ивент (либо мы не тестируем интерфейс через браузер) мы не будем отображать интерфейс
        if (!this.store.sum) return <></>;
        // Тут уже идёт return самого интерфейса (с примером некоторых данных об игроке, которые уже хранятся в интерфейсах без необходимости их дополнительного получения через ивенты)
        return <div className="shop_paybox">
            <div className="shop_paybox_box">
                <div className="paybox-title">
                    <p className="t-c font16">{this.store.name}</p>
                    <PayBox ref={this._child} sum={this.store.sum}/>
                </div>
                
                <div className={'payBoxButtons flex-line'}>
                    <button className="easy-button green shop_buy" onClick={e => {
                        const can = this.payBox.canPay(this.store.sum);
                        if(!can) return;
                        console.log(can)
                        CustomEvent.triggerClient('server:payment:res', this.store.id, JSON.stringify(can))
                        this.store.setState({sum: 0, id: 0})
                    }}><img src={check} />Оплатить</button>
                    <span className="easy-button shop_cancel" onClick={e => {
                        CustomEvent.triggerClient('server:payment:res', this.store.id, null)
                        this.store.setState({sum: 0, id: 0})
                    }}><img src={close} />Отмена</span>
                </div>
            </div>
        </div>

    }
}
import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import './style.less'
import {CEF} from '../../modules/CEF';
import {CustomEventHandler} from "../../../shared/custom.event";
import {system} from "../../modules/system";

// Это пример компонента под реакт для быстрого создания уже рабочего экземпляра.
export class ExampleReactComponent extends Component<{}, {
    /** Определяет статус отображения. Полезно если для отображения компонента необходимо не только его включить, а так же и получить какие то данные от клиента или сервера */
    show: boolean,
    /** Пример каких либо данных */
    exampleVal: number
}> {
    /** Это наш ивент, через который интерфейс может получать данные от клиента или сервера */
    private ev: CustomEventHandler;
    constructor(props: any) {
        super(props);
        this.state = {
            /** По умолчанию используется значение CEF.test. true будет если мы в браузере проверяем интерфейс.*/
            show: CEF.test,
            exampleVal: 10
        }
        // Если необходимо - можно объявить ивент для получения данных от клиента или сервера.
        this.ev = CustomEvent.register('eventName', (data: any) => {
            this.setState({
                /** Применяем наши данные, пришедшие от ивента */
                exampleVal: data,
                /** Поскольку мы получили необходимые данные от клиента или сервера - можно начать отображать интерфейс */
                show: true,
            })
        })
    }

    componentWillUnmount(){
        // Удаляем ивент при выгрузке компонента, при новом вызове этого компонента ивент будет создан повторно
        if(this.ev) this.ev.destroy()
    }

    render() {
        // Пока мы не получили данные через ивент (либо мы не тестируем интерфейс через браузер) мы не будем отображать интерфейс
        if(!this.state.show) return <></>;
        // Тут уже идёт return самого интерфейса (с примером некоторых данных об игроке, которые уже хранятся в интерфейсах без необходимости их дополнительного получения через ивенты)
        return <div>
            Пример данных: {this.state.exampleVal}<br/>
            Имя игрока {CEF.user.name}<br/>
            Баланс игрока: Наличные {system.numberFormat(CEF.user.money)} / Банк {system.numberFormat(CEF.user.bank)} / Фишки казино {system.numberFormat(CEF.user.chips)}<br/>
            Фракция: {CEF.user.fraction}
        </div>;
    }
}
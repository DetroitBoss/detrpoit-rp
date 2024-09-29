import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import './style.less'
import Draggable from 'react-draggable';
import {RACE_TYPE} from '../../../shared/race';
import {CEF} from "../../modules/CEF";
import close from '../UserMenu/assets/svg/close.svg'
import {SocketSync} from "../SocketSync";
import {CustomEventHandler} from "../../../shared/custom.event";
import {system} from "../../modules/system";

export class LogsBlock extends Component<{}, {
    name: string,
    id: string,
    data: {who: string, time: number, text: string}[],
    loaded: boolean
}> {
    ev: CustomEventHandler;

    constructor(props: any) {
        super(props);
        this.state = {
            name: "Test",
            id: "1",
            loaded: CEF.test,
            data: CEF.test ? new Array(50).fill({who: "Test", time: 10000000, text: 'Тестовая строка которая довольно длинная и может содержать длинный текст'}) : []
        }

        this.ev = CustomEvent.register('logs:open', (id: string, title: string, data: {who: string, time: number, text: string}[]) => {
            this.setState({ loaded: true, id, name: title, data })
        })

    }

    componentWillUnmount() {
        if (this.ev) this.ev.destroy();
    }



    render() {
        if(!this.state.loaded) return <></>;
        return <SocketSync path={`log_${this.state.id}`} data={e => {
            const q = JSON.parse(e);
            this.setState({data: q})
        }}><div className="seciton-information-middle">
            <div className="table-information-wrapper">
                <i className="driftmod-box-close-button right-close" onClick={e => {
                    e.preventDefault();
                    CEF.gui.setGui(null);
                }}><img src={close} alt="" /></i>
                <p className="font32 mb24 fontw600">{this.state.name}</p>
                <div className="table-information-overflow">
                    <table className="table-main-information">
                        <tr>
                            <th>Имя</th>
                            <th>Время</th>
                            <th>Действие</th>
                        </tr>
                        {this.state.data.map((item, i) => {
                          return <tr key={`log_${i}`}>
                              <td>{item.who}</td>
                              <td>{system.timeStampString(item.time)}</td>
                              <td>{item.text}</td>
                          </tr>
                        })}
                    </table>
                </div>
            </div>
        </div></SocketSync>;
    }
}


import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import './style.less'
import Draggable from 'react-draggable';
import {RACE_TYPE} from '../../../shared/race';
import {CEF} from "../../modules/CEF";


export class RaceEditBlock extends Component<{}, {
    name: string,
    id: number,
    opened: boolean,
    checkCount: number,
    posCount: number,
    type: RACE_TYPE,
    cars: string[],
}> {
    ev: import("../../../shared/custom.event").CustomEventHandler;
    ev2: import("../../../shared/custom.event").CustomEventHandler;

    constructor(props: any) {
        super(props);
        this.state = {
            name: "Test",
            id: 1,
            opened: false,
            checkCount: 5,
            posCount: 5,
            type: null,
            cars: []
        }

        this.ev = CustomEvent.register('raceedit:open', (id: number, name: string, checkCount: number, posCount: number, type: RACE_TYPE, cars: string[]) => {
            this.setState({ opened: true, id, name, checkCount, posCount, type, cars })
        })

        this.ev2 = CustomEvent.register('raceedit:close', () => {
            this.setState({ opened: false })
        })
    }

    componentWillUnmount() {
        if (this.ev) this.ev.destroy();
        if (this.ev2) this.ev2.destroy();
    }



    render() {
        if (!this.state.opened) return <></>;
        if (CEF.gui.currentGui) return <></>;
        let checks: number[] = [];
        for (let id = 0; id < this.state.checkCount; id++) checks.push(id);
        let poss: number[] = [];
        for (let id = 0; id < this.state.posCount; id++) poss.push(id);
        return <Draggable key={`race_edit`}>
            <div className="race-edit">
                <div className="name">{this.state.name} #{this.state.id}</div>
                <div className="item">
                    {this.state.cars.map(car => {
                        return <button onClick={e => {
                            e.preventDefault();
                            CustomEvent.triggerClient('raceedit:spawnCar', car)
                        }}>Спавн {car}</button>
                    })}
                </div>
                <button onClick={e => {
                    CustomEvent.triggerClient('raceedit:newCheck')
                }}>Добавть чекпоинт</button>
                <button onClick={e => {
                    CustomEvent.triggerClient('raceedit:newSpawn')
                }}>Добавить точку спавна</button>
                <button onClick={e => {
                    CustomEvent.triggerClient('raceedit:changeType')
                    this.setState({ type: this.state.type === "circle" ? "line" : "circle"})
                }}>Тип: {this.state.type === "circle" ? "Кольцо" : "Спринт"}</button>

                {poss.length > 0 ? <div className="list">
                    {poss.map(id => {
                        return <div className="item" key={`spawn_${id}`}>
                            <div className="title">Спавн #{id}</div>
                            <div className="job">
                                <button className="del" onClick={e => {
                                    e.preventDefault();
                                    CustomEvent.triggerClient('raceedit:spawnDel', id)
                                }}>X</button>
                                <button className="tp" onClick={e => {
                                    e.preventDefault();
                                    CustomEvent.triggerClient('raceedit:spawnTp', id)
                                }}>TP</button>
                            </div>
                        </div>
                    })}
                </div> : <></>}
                {checks.length > 0 ? <div className="list">
                    {checks.map(id => {
                        return <div className="item" key={`check_${id}`}>
                            <div className="title">Чекпоинт #{id}</div>
                            <div className="job">
                                <button className="del" onClick={e => {
                                    e.preventDefault();
                                    CustomEvent.triggerClient('raceedit:checkDel', id)
                                }}>X</button>
                                <button className="tp" onClick={e => {
                                    e.preventDefault();
                                    CustomEvent.triggerClient('raceedit:checkTp', id)
                                }}>TP</button>
                            </div>
                        </div>
                    })}
                </div> : <></>}

                <div className="control">
                    <button className="no" onClick={e => {
                        e.preventDefault();
                        this.setState({opened: false})
                        CustomEvent.triggerClient('raceedit:save', false)
                    }}>Отменить</button>
                    <button className="yes" onClick={e => {
                        e.preventDefault();
                        this.setState({ opened: false })
                        CustomEvent.triggerClient('raceedit:save', true)
                    }}>Сохранить</button>
                </div>

            </div>
        </Draggable>;
    }
}


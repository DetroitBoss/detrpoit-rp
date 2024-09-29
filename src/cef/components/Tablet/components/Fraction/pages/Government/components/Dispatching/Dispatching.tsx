import React from "react";

import png from "../../../../assets/*.png";
import svg from "../../../../assets/*.svg";
import classNames from "classnames";
import {TENCODES_LIST} from "../../../../../../../../../shared/fractions";
import {CustomEvent} from "../../../../../../../../modules/custom.event";
import {IFractionData} from "../../../../../../../../../shared/fractions/ranks";
import {systemUtil} from "../../../../../../../../../shared/system";
import {CEF} from "../../../../../../../../modules/CEF";

export class Dispatching extends React.Component<{
    fractionData: IFractionData
}, {
    isDepartment: boolean
    selectActive: boolean
    tenCode: number
}> {

    constructor(props: any) {
        super(props);

        this.state = {
            isDepartment: true,
            selectActive: false,
            tenCode: 0
        }
    }

    render() {
        return <>
            <div className="government__title">
                <img src={svg["rudder"]} alt=""/>
                Диспетчерская
            </div>
            <div className="government-dispatching">

                <div className="government-dispatching-navigation">
                    <div className={classNames({"government-dispatching-navigation-active": this.state.isDepartment})}
                    onClick={() => this.setState({isDepartment: true})}>
                        Департамент
                    </div>
                    <div className={classNames({"government-dispatching-navigation-active": !this.state.isDepartment})}
                         onClick={() => this.setState({isDepartment: false})}>
                        Внутренний
                    </div>
                </div>

                <div className="government-dispatching-code">

                    <div className={classNames("government-dispatching-code-rank", {
                        "government-dispatching-code-rank__active": this.state.selectActive
                    })} onClick={() => {
                        if (!this.state.selectActive) this.setState({selectActive: true});
                    }}>
                        {TENCODES_LIST[this.state.tenCode][0]} - {TENCODES_LIST[this.state.tenCode][1]}
                        <img src={svg["back"]} alt=""/>
                        <div className="government-dispatching-code-rank-list">
                            {
                                TENCODES_LIST.map(([codeName, codeDesc], codeID) => {
                                    return <div key={codeID} onClick={() => {
                                        this.setState({tenCode: codeID, selectActive: false})
                                    }}>
                                        {codeName} - {codeDesc}
                                    </div>
                                })
                            }
                        </div>
                    </div>

                    <div className="government-dispatching-code__button" onClick={() => {
                        CustomEvent.triggerServer('dispatch:tencode', Number(this.state.tenCode || 0), !this.state.isDepartment)
                    }}>
                        Отправить код
                    </div>

                </div>

                <div className="government-dispatching-list">

                    {
                        this.props.fractionData.alerts.sort((a, b) => b.id - a.id).map(gosData => {
                            if (gosData.type === 0 && this.state.isDepartment) {
                                return <div className="government-dispatching-list-block">
                                    <div className="government-dispatching-list-block-left">
                                        <div className="government-dispatching-list-block-left__name">
                                            Kasumi More
                                        </div>
                                        <div className="government-dispatching-list-block-left__status">
                                            Поступил вызов из департамента
                                        </div>
                                        <div className="government-dispatching-list-block-left__information">
                                            #{gosData.id} | {systemUtil.timeStampString(gosData.timestamp)} {gosData.pos[0] ? ` | ${Math.round(systemUtil.distanceToPos2D({
                                            x: gosData.pos[0],
                                            y: gosData.pos[1]
                                        }, {
                                            x: this.props.fractionData.playerPosition.x,
                                            y: this.props.fractionData.playerPosition.y
                                        }))} м.` : ''}
                                        </div>
                                    </div>
                                    <div className="government-dispatching-list-block-right">
                                        {gosData.callAnswered ?
                                            <div className="government-dispatching-list-block-right__accept">
                                                Принял <div>{String(gosData.callAnswered)}</div>
                                            </div> : <></>}
                                        {!gosData.actual ?
                                            <div className="government-dispatching-list-block-right__time">
                                                Вызов истек
                                            </div> : <div className="government-dispatching-code__button"
                                                          onClick={() => CustomEvent.triggerServer('dispatch:answer', gosData.id)}>
                                                Принять вызов
                                            </div>}
                                    </div>
                                </div>
                            }

                            if (gosData.type === 1) {
                                if ((gosData.isGlobal && !this.state.isDepartment) || (!gosData.isGlobal && this.state.isDepartment)) return <></>

                                let tenCode = TENCODES_LIST[gosData.code];

                                return tenCode ? <div className="government-dispatching-list-block">
                                    <div className="government-dispatching-list-block-left">
                                        <div className="government-dispatching-list-block-left__name">
                                            {tenCode[0]} - {tenCode[1]}
                                        </div>
                                        <div className="government-dispatching-list-block-left__status">
                                            Поступил внутренний вызов
                                        </div>
                                        <div className="government-dispatching-list-block-left__information">
                                            #{gosData.id} | {systemUtil.timeStampString(gosData.timestamp)} {gosData.pos[0] ? ` | ${Math.round(systemUtil.distanceToPos2D({
                                            x: gosData.pos[0],
                                            y: gosData.pos[1]
                                        }, {
                                            x: this.props.fractionData.playerPosition.x,
                                            y: this.props.fractionData.playerPosition.y
                                        }))} м.` : ''}
                                        </div>
                                    </div>
                                    <div className="government-dispatching-list-block-right">
                                        <div className="government-dispatching-code__button"
                                             onClick={() => CEF.setGPS(gosData.pos[0], gosData.pos[1])}>
                                            GPS - метка
                                        </div>
                                    </div>
                                </div> : <></>
                            }
                        })
                    }

                </div>
            </div>
        </>;
    }
}
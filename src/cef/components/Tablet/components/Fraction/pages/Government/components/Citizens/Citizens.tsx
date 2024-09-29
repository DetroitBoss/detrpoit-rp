import React from "react";

import png from "../../../../assets/*.png";
import svg from "../../../../assets/*.svg";
import {CustomEvent} from "../../../../../../../../modules/custom.event";
import {CEF} from "../../../../../../../../modules/CEF";
import {LicenceType, LicenseName, REMOVE_LICENSE_RANK} from "../../../../../../../../../shared/licence";
import {SocketSync} from "../../../../../../../SocketSync";
import {fractionCfg} from "../../../../../../../../modules/fractions";
import {MAX_WANTED_LEVEL} from "../../../../../../../../../shared/jail";
import svgs from "../../../../../../images/svg/tablet/*.svg";
import {system} from "../../../../../../../../modules/system";
import {IFractionData} from "../../../../../../../../../shared/fractions/ranks";
import '../../style.less';
import "./style.less";


export class Citizens extends React.Component<{
    fractionData: IFractionData
}, {
    searchData: { id: number, name: string }[]
    gosSearchItem?: {
        id: number, name: string, bank: string, social: string, house: string, vehs: {
            id: number;
            model: string;
            name: string;
            number: string;
        }[],
        wanted_level?: number;
        wanted_level_new?: number;
        wanted_reason?: string;
        wanted_reason_new?: string;
        licenses?: [LicenceType, number, string][],
        history?: { text: string, time: number }[]
    }
}> {

    nameRef: React.RefObject<HTMLInputElement> = React.createRef();
    documentRef: React.RefObject<HTMLInputElement> = React.createRef();
    bankRef: React.RefObject<HTMLInputElement> = React.createRef();

    constructor(props: any) {
        super(props);

        this.state = {
            searchData: []
        }
    }

    search() {
        const id = parseInt(this.nameRef.current.value as string);
        const name = String(id) == this.nameRef.current.value ? null : this.nameRef.current.value as string;
        const social = this.documentRef.current.value;
        const bank = this.bankRef.current.value;

        CustomEvent.callServer('faction:database:search', id, name, social, bank, null).then((res: { status?: string, data?: { id: number, name: string }[] }) => {
            if (res.status) return CEF.alert.setAlert('error', res.status);
            this.setState({searchData: res.data})
        })
    }

    getGosSearch() {
        return <>{this.state.gosSearchItem ?
            <div className="in-results-wrapper-2"><SocketSync
                path={`tablet_gosSearchItem_${this.state.gosSearchItem.id}`} data={(data: string) => {
                const d = JSON.parse(data)
                this.setState({gosSearchItem: d});
            }}>
                <div className="in-results-wrap-2">
                    <button className="close-2" onClick={e => {
                        e.preventDefault();
                        this.setState({gosSearchItem: null});
                    }}>
                                            <span className="icon-wrap-2">
                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <g id="24 / basic / plus">
                                                        <path id="icon" fillRule="evenodd" clipRule="evenodd"
                                                              d="M14.9996 13.5858L21.3635 7.22183L22.7777 8.63604L16.4138 15L22.7777 21.364L21.3635 22.7782L14.9996 16.4142L8.6356 22.7782L7.22138 21.364L13.5853 15L7.22138 8.63604L8.6356 7.22183L14.9996 13.5858Z"
                                                              fill="#fff"></path>
                                                    </g>
                                                </svg>
                                            </span>
                    </button>
                    <p className="title-big-2">{this.state.gosSearchItem.name} #{this.state.gosSearchItem.id}</p>
                    <div className="info-user-wrap-2">
                        <div className={"info-user-wanted-info-2"}>
                            <div>
                                <span className={"title-2"}>Уровень розыска</span>
                                <button className={"clear-2"} onClick={e => {
                                    e.preventDefault();
                                    if (!fractionCfg.getFraction(this.props.fractionData.id).police) return;
                                    this.state.gosSearchItem.wanted_level = null;
                                    this.state.gosSearchItem.wanted_reason = "";
                                    this.state.gosSearchItem.wanted_level_new = null;
                                    this.state.gosSearchItem.wanted_reason_new = "";
                                    this.setState({gosSearchItem: this.state.gosSearchItem})
                                    CustomEvent.triggerServer('tablet:clearWanted', this.state.gosSearchItem.id)
                                }}>Очистить
                                </button>
                            </div>
                            <div className={"stars-2"}>
                                {[...Array(MAX_WANTED_LEVEL)].map((x, iq) => {
                                        const i = iq + 1;
                                        let displayLevel = this.state.gosSearchItem.wanted_level;
                                        if (typeof this.state.gosSearchItem.wanted_level_new == "number") displayLevel = this.state.gosSearchItem.wanted_level_new;
                                        return <img src={svgs[displayLevel >= i ? 'star_on' : 'star_off']} onClick={e => {
                                            e.preventDefault();
                                            if (!fractionCfg.getFraction(this.props.fractionData.id).police) return;
                                            this.state.gosSearchItem.wanted_level_new = i;
                                            if (this.state.gosSearchItem.wanted_level_new === this.state.gosSearchItem.wanted_level) this.state.gosSearchItem.wanted_level_new = null;
                                            this.setState({gosSearchItem: this.state.gosSearchItem})
                                        }}/>
                                    }
                                )}
                            </div>
                        </div>
                        {typeof this.state.gosSearchItem.wanted_level_new == "number" ?
                            <div className={"info-user-wanted-info input-2"}>
                                <div>
                                    <input maxLength={100} placeholder={"Причина розыска"}
                                           value={this.state.gosSearchItem.wanted_reason_new || ""} onChange={e => {
                                        e.preventDefault();
                                        if (!fractionCfg.getFraction(this.props.fractionData.id).police) return;
                                        this.state.gosSearchItem.wanted_reason_new = e.currentTarget.value;
                                        this.setState({gosSearchItem: this.state.gosSearchItem})
                                    }}/>
                                    <button onClick={e => {
                                        e.preventDefault();
                                        if (!fractionCfg.getFraction(this.props.fractionData.id).police) return;
                                        CustomEvent.triggerServer('tablet:setWanted', this.state.gosSearchItem.id, this.state.gosSearchItem.wanted_level_new, this.state.gosSearchItem.wanted_reason_new);
                                        this.state.gosSearchItem.wanted_level = this.state.gosSearchItem.wanted_level_new;
                                        this.state.gosSearchItem.wanted_reason = this.state.gosSearchItem.wanted_reason_new;
                                        this.state.gosSearchItem.wanted_level_new = null;
                                        this.state.gosSearchItem.wanted_reason_new = "";
                                        this.setState({gosSearchItem: this.state.gosSearchItem})
                                    }}><img src={svgs['ok_button']}/></button>
                                </div>
                            </div> : <></>}

                    </div>
                    <div className="info-user-wrap-2">
                        {this.state.gosSearchItem.wanted_reason && this.state.gosSearchItem.wanted_level ?
                            <div className="info-user-item-2">
                                <p className="mini-title-2">Причина текущего розыска</p>
                                <p className="name-2">{this.state.gosSearchItem.wanted_reason}</p>
                            </div> : <></>}
                        <div className="info-user-item-2">
                            <p className="mini-title-2">Номер банковского счета</p>
                            <p className="name-2">{this.state.gosSearchItem.bank || "Нет банковского счёта"}</p>
                        </div>
                        <div className="info-user-item-2">
                            <p className="mini-title-2">Номер регистрации</p>
                            <p className="name-2">{this.state.gosSearchItem.social || "Нет регистрации"}</p>
                        </div>
                        <div className="info-user-item-2">
                            <p className="mini-title-2">Дом</p>
                            <p className="nam-2e">{this.state.gosSearchItem.house || "Нет недвижимости"}</p>
                        </div>
                    </div>
                    <div className="info-transport-wrapper-2">
                        <div className="info-transport-wrap-2">
                            <p className="mini-title-2">Транспорт</p>
                            {this.state.gosSearchItem.vehs.map(veh => {
                                return <div className="info-transport-item-2">
                                    <div className="text-wrap-2">
                                        <p className="title-big-2">{veh.name}</p>
                                    </div>
                                    <div className="bage-gps-2"><p>{veh.number || "Нет номера"}</p></div>
                                </div>
                            })}
                        </div>
                    </div>
                    {this.state.gosSearchItem.licenses ? <div className="info-transport-wrapper-2">
                        <div className="info-transport-wrap-2">
                            <p className="mini-title-2">Лицензии</p>
                            {this.state.gosSearchItem.licenses.map((license, index) => {
                                return <div className="info-transport-item-2">
                                    <div className="text-wrap-2">
                                        <p>{LicenseName[license[0]]} до {system.timeStampString(license[1])}</p>
                                    </div>
                                    <div className="bage-gps-2 bage-white-2" onClick={e => {
                                        e.preventDefault();
                                        if (CEF.user.rank < REMOVE_LICENSE_RANK) return CEF.alert.setAlert('error', 'У вас нет доступа чтобы изымать лицензию');
                                        CustomEvent.triggerServer('faction:removeLicense', this.state.gosSearchItem.id, license[0]);
                                        // this.state.gosSearchItem.licenses.splice(index, 1);
                                        // this.setState({gosSearchItem: this.state.gosSearchItem});
                                    }}><p>Изъять лицензию</p></div>
                                </div>
                            })}
                        </div>
                    </div> : <></>}
                    {this.state.gosSearchItem.history ? <div className="info-transport-wrapper">
                        <div className="info-transport-wrap-2">
                            <p className="mini-title-2">История персонажа</p>
                            {this.state.gosSearchItem.history.map((item, index) => {
                                return <div className="info-transport-item-2">
                                    <div className="text-wrap-2">
                                        <p>{item.text}</p>
                                    </div>
                                    <div className="bage-gps-2 "><p>{system.timeStampString(item.time)}</p>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div> : <></>}
                </div>
            </SocketSync></div> : <></>}</>
    }

    render() {
        return this.state.gosSearchItem ? this.getGosSearch() : <>
            <div className="government__title">
                <img src={svg["user"]} alt=""/>
                База граждан
            </div>

            <div className="government-citizens">

                <div className="government-citizens-find">
                    <input ref={this.nameRef} type="text" placeholder="Введите имя или ID" onKeyDown={(e) => {
                        if (e.keyCode !== 13) return;
                        this.search();
                    }}/>
                    <img src={svg["search"]} alt="" onClick={() => this.search()}/>
                </div>
                <div className="government-citizens-find">
                    <input ref={this.documentRef} type="text" placeholder="Введите номер документа" onKeyDown={(e) => {
                        if (e.keyCode !== 13) return;
                        this.search();
                    }}/>
                    <img src={svg["search"]} alt="" onClick={() => this.search()} />
                </div>
                <div className="government-citizens-find">
                    <input ref={this.bankRef} type="text" placeholder="Введите номер банковского счёта" onKeyDown={(e) => {
                        if (e.keyCode !== 13) return;
                        this.search();
                    }}/>
                    <img src={svg["search"]} alt="" onClick={() => this.search()}/>
                </div>

                {this.state.searchData.length !== 0 && <div className="government-citizens-columns">
                    <div>ID</div>
                    <div>Имя</div>
                </div>}

                <div className="government-citizens-list">
                    {
                        this.state.searchData.map((el, key) => {
                            return <div className="government-citizens-list-block" key={key} onClick={() => {
                                CustomEvent.callServer('faction:database:data', el.id).then(status => {
                                    if (!status) return;
                                    this.setState({gosSearchItem: status})
                                })
                            }}>
                                <div className="government-citizens-list-block__id">#{el.id}</div>
                                <div className="government-citizens-list-block__name">{el.name}</div>
                            </div>
                        })
                    }
                </div>
            </div>

        </>;
    }
}
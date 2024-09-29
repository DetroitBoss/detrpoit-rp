import React from "react";
import png from "../../../../assets/*.png";
import svg from "../../../../assets/*.svg";
import {CustomEvent} from "../../../../../../../../modules/custom.event";
import {CEF} from "../../../../../../../../modules/CEF";


export class Transport extends React.Component<{}, {
    searchData: {  model: string, name: string, number: string, owner: number, ownername: string }[]
}> {

    textRef: React.RefObject<HTMLInputElement> = React.createRef();

    constructor(props: any) {
        super(props);

        this.state = {
            searchData: []
        }
    }

    search() {
        const text = this.textRef.current.value;

        CustomEvent.callServer('faction:database:searchvehicle', text).then(data => {
            if (!data) return;
            this.setState({ searchData: data });
        })
    }

    render() {
        return <>
            <div className="government__title">
                <img src={svg["rudder"]} alt=""/>
                База транспорта
            </div>
            <div className="government-transport">
                <div className="government-transport-find">
                    <input ref={this.textRef} type="text" placeholder="Введите имя или номер для поиска" onKeyDown={(e) => {
                        if (e.keyCode !== 13) return;
                        this.search();
                    }}/>
                    <img src={svg["search"]} alt="" onClick={() => this.search()}/>
                </div>

                <div className="government-transport-list">

                    {
                        this.state.searchData.map((veh, key) => {
                            return <div className="government-transport-list-block" key={key}>
                                <div className="government-transport-list-block-image">
                                    <div className="government-transport-list-block-image__number">
                                        {veh.number || "Нет номера"}
                                    </div>
                                    <img src={CEF.getVehicleURL(veh.model)} alt=""/>
                                </div>
                                <div className="government-transport-list-block__title">{veh.name}</div>
                                <div className="government-transport-list-block__text">Владелец</div>
                                <div className="government-transport-list-block__name">{veh.ownername} #{veh.owner}</div>
                            </div>
                        })
                    }
                </div>
            </div>
        </>;
    }
}
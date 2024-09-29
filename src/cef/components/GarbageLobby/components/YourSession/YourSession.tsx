import React, {useCallback, useEffect, useLayoutEffect, useState} from "react";
import "../../style.less"

import svg from "../../assets/*.svg";
import {CustomEvent} from "../../../../modules/custom.event";
import {IMyLobbyDTO} from "../../../../../shared/jobs/sanitation/dto";
import classNames from "classnames";

const YourSession: React.FC = () => {
    const [lobby, setLobby] = useState<IMyLobbyDTO>({
        id: -1,
        players: ["Zaz", "raz"],
        ownerName: "Zaz"
    });


    useLayoutEffect(() => {
        const ev = CustomEvent.register('sanitation:setMyLobby', (data: IMyLobbyDTO) => {
            setLobby(data)
        })

        return () => ev.destroy();
    }, []);

    const leave = useCallback(() => {
        CustomEvent.triggerServer('sanitation:leaveSquad');
    }, []);

    return <>

        <div className="garbageLobby__title">
            <span>Ваша сессия</span> #{lobby.id}
        </div>

        {
            lobby.players.map((el, key) => {

                return <div className={classNames('garbageLobby-player',
                    {"garbageLobby-player__crown": lobby.ownerName === el})} key={key}>
                    {el}
                    <img src={svg["crown"]} alt=""/>
                    <img src={svg["mark"]} alt=""/>
                </div>
            })
        }

        <div className="garbageLobby-greenButton" onClick={() => leave()}>
            Покинуть лобби
        </div>
    </>
}

export default YourSession
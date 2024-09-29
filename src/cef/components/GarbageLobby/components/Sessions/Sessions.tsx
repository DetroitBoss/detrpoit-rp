import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import "../../style.less"
import {CustomEvent} from "../../../../modules/custom.event";

import svg from "../../assets/*.svg";
import png from "../../assets/*.png";
import {ILobbyDTO} from "../../../../../shared/jobs/sanitation/dto";

const Sessions: React.FC = () => {
    useLayoutEffect(() => {
        const ev = CustomEvent.register('sanitation:setSessions', (data: ILobbyDTO[]) => {
            setLobbies(data);
        })

        return () => ev.destroy();
    }, []);

    const [selected, setSelected] = useState<number>(-1);
    const [lobbies, setLobbies] = useState<ILobbyDTO[]>([
    ]);

    const inputRef = useRef(null);

    const connect = useCallback(() => {
        if (selected === -1) return;

        const lobby = lobbies.find(el => el.id === selected);

        if (lobby === undefined) return;

        CustomEvent.triggerServer(
            'sanitation:joinSquad',
            selected,
            lobby.isPublic ? null : inputRef.current.value
        )
    }, [selected, lobbies]);


    return <>

        <div className="garbageLobby__title">
            <span> Выберите </span>сессию
        </div>

        {
            lobbies.map((el, key) => {

                return <React.Fragment key={key}>
                    <div className="garbageLobby-session" onClick={() => setSelected(el.id)}>
                        {el.name}
                    </div>

                    {(!el.isPublic && selected === el.id) && <div className="garbageLobby-sessionInput">
                        <span>Пароль</span>
                        <input type="password" ref={inputRef}/>
                    </div>}
                </React.Fragment>
            })
        }

        <div className="garbageLobby-redButton garbageLobby-mt">
            <div className="garbageLobby-redButton__button" onClick={() => connect()}>
                Присоединиться
            </div>
        </div>

    </>
}

export default Sessions
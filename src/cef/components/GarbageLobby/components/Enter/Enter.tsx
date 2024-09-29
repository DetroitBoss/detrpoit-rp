import React, {useCallback, useState} from "react";
import "../../style.less"

import svg from "../../assets/*.svg";
import png from "../../assets/*.png";
import classNames from "classnames";
import {CustomEvent} from "../../../../modules/custom.event";

const Enter: React.FC = () => {
    const [password, setPassword] = useState(true);

    const createSession = useCallback(() => {
        CustomEvent.triggerServer('sanitation:createSquad', !password);
    }, []);

    const getSessions = useCallback(() => {
        CustomEvent.triggerServer('sanitation:getSessions');
    }, []);

    return <>

        <div className="garbageLobby__title">Организация <br/> <span>по сбору мусора</span></div>

        <div className="garbageLobby__text">
            Организуйте вашу работу по сбору мусора с друзьями, перемещайтесь на выданном вам транспорте, собирайте мусор по всему штату и зарабатывайте хорошие денежные средства.
        </div>

        <div className="garbageLobby-images">
            <div className="garbageLobby-images__block">
                <img src={png["cash"]} alt=""/>
                <p>За рабочую смену</p>
                <div>до $80 000</div>
                <span>от 2 участников</span>
            </div>
            <div className="garbageLobby-images__block">
                <img src={png["flag"]} alt=""/>
                <div>Вклад в развитие</div>
                <p>штата</p>
            </div>
            <div className="garbageLobby-images__block">
                <img src={png["garbage"]} alt=""/>
                <p>Работай</p>
                <div>с другом</div>
            </div>
        </div>

        <div className="garbageLobby-redButton">
            <div className="garbageLobby-redButton__button" onClick={() => createSession()}>
                Создать сессию
            </div>
            <div className={classNames('garbageLobby-redButton__switcher',
                {"garbageLobby-redButton__switcher-active": password})}
            onClick={() => setPassword(!password)}><div/></div>
            <span>С паролем</span>
        </div>

        <div className="garbageLobby-button" onClick={() => getSessions()}>
            Присоединиться к сессии
        </div>

    </>
}

export default Enter
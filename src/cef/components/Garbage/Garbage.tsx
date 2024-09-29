import React, {useCallback, useLayoutEffect, useState} from "react";
import "./style.less";
import svg from "./assets/*.svg";
import png from "./assets/*.png";
import {CustomEvent} from "../../modules/custom.event";
import {CEF} from "../../modules/CEF";

const Garbage = () => {

    const [working, setWorking] = useState<boolean>(false);

    useLayoutEffect(() => {
        const event = CustomEvent.register('sanitation:sort:hiring', (data: boolean) => {
            setWorking(data);
        })

        return () => event.destroy();
    }, []);

    const join = useCallback(() => {
        CustomEvent.triggerServer('sanitation:sort:join');
    }, []);

    const leave = useCallback(() => {
        CustomEvent.triggerServer('sanitation:sort:leave');
    }, []);

    return <div className="garbage">

        <div className="exit" onClick={() => CEF.gui.setGui(null)}>
            <div className="exit__icon"><img src={svg["closeIcon"]} alt="#"/></div>
            <div className="exit__title">Закрыть</div>
        </div>

        <img src={svg["background"]} alt="" className="garbage__background"/>

        <img src={png["car"]} alt="" className="garbage__car"/>

        <div className="garbage-content">

            <div className="garbage-content__title">
                Работа:
                <span>Сортировщик мусора</span>
            </div>

            <div className="garbage-content__text">
                Добро пожаловать на свалку!
                <br/><br/>
                Работайте на свалке, сортируйте различные виды мусора, тем самым очищая штат и зарабатывайте хорошие денежные средства.
            </div>

            <div className="garbage-content-boxes">


                <div className="garbage-content-boxes-block garbage-active">

                    <div className="garbage-content-boxes-block__tag">
                        Оплата 20$
                    </div>

                    {
                        working ? <div className="garbage-content-boxes-block__accept" onClick={() => leave()}>
                                <img src={svg["checkMark"]} alt=""/> УВОЛИТЬСЯ
                            </div>
                            :
                            <div className="garbage-content-boxes-block__proceed" onClick={() => join()}>
                                <img src={svg["helmetIcon"]} alt=""/> ПРИСТУПИТЬ
                            </div>
                    }


                </div>

            </div>

        </div>


    </div>

}

export default Garbage

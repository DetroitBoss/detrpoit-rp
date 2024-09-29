import React, {Component} from "react";
import "./style.less";

// @ts-ignore
import png from "./assets/*.png"
// @ts-ignore
import svg from './assets/*.svg'
import {CustomEventHandler} from "../../../shared/custom.event";
import {CustomEvent} from "../../modules/custom.event";
import {CEF} from '../../modules/CEF';

export class DivingEmployer extends Component<{}, {
    isWorking: boolean
}> {

    ev: CustomEventHandler

    constructor(props: any) {
        super(props);

        this.state = {
            isWorking: false
        }

        this.ev = CustomEvent.register('divingEmployer:setIsWorking', (isWorking: boolean) => {
            this.setState({isWorking});
        })
    }

    componentWillUnmount() {
        this.ev.destroy();
    }

    onClickHandle() {
        CustomEvent.triggerClient('diving:switcher');
        CEF.gui.setGui(null);
    }


    render() {
        return <div className="divingEmployer">

            <img src={svg["background"]} alt="" className="divingEmployer__background"/>
            <img src={png["chest"]} alt="" className="divingEmployer__chest"/>

            <div className="exit" onClick={() => CEF.gui.setGui(null)}>
                <div className="exit__icon"><img src={svg["closeIcon"]} alt="#"/></div>
                <div className="exit__title">Закрыть</div>
            </div>

            <div className="divingEmployer-block">

                <img src={png["block"]} alt="" className="divingEmployer-block__background"/>

                <div className="divingEmployer-block__title">
                    РАБОТА <br/> ВОДОЛАЗА
                </div>

                <div className="divingEmployer-block__text">
                    Добро пожаловать на работу водолаза!
                    <br/><br/>
                    Чтобы полностью ощутить работу водолаза, нужно любить море, ну и акул...
                </div>

                {
                    this.state.isWorking ?
                        <div className="divingEmployer-block__button divingEmployer-block__buttonTransparent" onClick={() => this.onClickHandle()}>
                            УВОЛИТЬСЯ
                        </div>
                        :
                        <div className="divingEmployer-block__button" onClick={() => this.onClickHandle()}>
                            ПРИСТУПИТЬ
                        </div>
                }
            </div>

        </div>
    }

}
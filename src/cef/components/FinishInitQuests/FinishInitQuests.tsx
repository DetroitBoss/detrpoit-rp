import React, {Component} from "react";
import "./style.less";
import components from './assets/components.png'


export class FinishInitQuests extends Component<{}, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return <div className="chooseLocation">

            <div className="chooseLocation-content">

                <div>
                    Вы выполнили <br/> все начальные задания!
                    <span>
                        Теперь перед вами открыты
                        огромные возможности, выберите
                        куда вы бы хотели пойти сейчас
                    </span>
                </div>

                <img src={components} className="chooseLocation-content__components" alt=""/>

            </div>

        </div>
    }
}
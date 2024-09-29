import React, {Component} from "react";
import "./style.less"

import svg from "./assets/*.svg"
import {CEF} from "../../../../modules/CEF";
import { CustomEvent } from '../../../../modules/custom.event'
import { systemUtil } from '../../../../../shared/system'

export class Tickets extends Component<{}, {
    userMessages: string[],
    inputMessage?: string
}> {

    inputRef: React.RefObject<any> = React.createRef()
    constructor(props: any) {
        super(props);

        this.state = {
            userMessages: [],
        }
    }

    sendMessage() {
        if (this.state.inputMessage === "") return CEF.alert.setAlert(
            "error",
            "Введите текст вопроса"
        )
        CustomEvent.triggerServer("ticket:create", systemUtil.filterInput(this.state.inputMessage))

        this.setState({inputMessage: ""})
        this.inputRef.current.value = ""
        console.log('triggered')
    }

    render() {
        return <div className="mainMenu">
            <div className="tickets">

                <div className="tickets-input">
                    <input
                        ref={this.inputRef}
                        onChange={(el) => {
                            this.setState({inputMessage: el.currentTarget.value})
                        }}
                        onKeyPress={(el) => {
                            if (el.key !== "Enter") return
                            this.sendMessage()
                        }}
                        type="text" placeholder="Напишите сообщение . . ."
                    />
                    <img onClick={() => {
                        this.sendMessage()
                    }} src={svg["send"]} alt=""/>
                </div>

                <div className={`tickets-leftMessage showMessage`}>
                    <div className="tickets__name">Система</div>
                    <div className="tickets__message">
                        Жалоба/вопрос должны быть максимально корректными и максимально подробными. <br/>
                        При подаче жалобы на нарушителя указывайте его ID и нарушение, пример: 12 DM. <br/>
                        После отправления сообщения, тикет будет передан администрации.
                    </div>
                </div>


                {this.state.userMessages.map((el, key) => {
                    return <div className="tickets-rightMessage showMessage" key={key}>
                        <div className="tickets__message">
                            {this.state.userMessages[key]}
                        </div>
                    </div>
                })
                }
            </div>
        </div>
    }

}
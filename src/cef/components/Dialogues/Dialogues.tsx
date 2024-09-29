import React, {Component} from "react";
import "./style.less";
import {DialogNodeDto} from "../../../shared/dialogs/dtos/DialogNodeDto";
import {CustomEvent} from "../../modules/custom.event";

interface DialoguesState {
    characterName: string,
    node: DialogNodeDto,
    currentReplyIndex: number
}

const VK_SPACE_CODE = 32;

export class Dialogues extends Component<{}, DialoguesState> {
    constructor(props: any) {
        super(props);

        this.state = {
            characterName: 'Тест',
            node: {
                id: 0,
                npcReplies: [
                    {text: 'Этот бот что-то говорит в тестовом режиме, не обращайте внимания'},
                    {text: 'А это продолжение того, что бот говорит в тестовом режиме. Поэтому также не обращайте внимания. Скоро всё закончится'},
                ],
                answers: ['тест ответ']
            },
            currentReplyIndex: 0
        };

        CustomEvent.register('dialogs::setDialog', (
            characterName: string,
            dialogNode: DialogNodeDto
        ) => {
            this.setState({
                characterName,
                node: dialogNode,
                currentReplyIndex: 0
            })
        });

        CustomEvent.register('dialogs::setNode', (
            node: DialogNodeDto
        ) => {
            this.setState({
                node,
                currentReplyIndex: 0
            })
        });
    }

    private keyPressHandler = (ev: KeyboardEvent) => {
        if (ev.keyCode !== VK_SPACE_CODE) {
            return;
        }

        if (this.state.currentReplyIndex >= this.state.node.npcReplies.length - 1) {
            return;
        }

        this.setState({
            currentReplyIndex: this.state.currentReplyIndex + 1
        });
    }

    componentDidMount() {
        addEventListener('keypress', this.keyPressHandler);
    }

    componentWillUnmount() {
        removeEventListener('keypress', this.keyPressHandler);
    }

    render() {
        return <div className="dialogues">


            {this.state.currentReplyIndex < this.state.node.npcReplies.length - 1 ?
                null

                : <div className="dialogues-buttons">
                    {this.state.node.answers.map((answer, index) =>
                        <div onClick={() => {
                            CustomEvent.triggerServer('dialogs:answer', this.state.node.id, index);
                        }}>
                            <span>{index + 1}.</span>
                            {answer}
                        </div>
                    )}
                </div>
            }


            <div className="dialogues__topName">
                <span>Вы ведете диалог</span>
                {this.state.characterName}
            </div>


            <div className="dialogues__name">
                {this.state.characterName} ГОВОРИТ
            </div>

            <div className="dialogues__message">
                {this.state.node.npcReplies[this.state.currentReplyIndex].text}
            </div>


            <div
                className={`dialogues__prompt ${this.state.currentReplyIndex < this.state.node.npcReplies.length - 1 ? "" : "dialogues__opacity"}`}>
                Нажми <div>ПРОБЕЛ</div> чтобы продолжить
            </div>


        </div>
    }
}
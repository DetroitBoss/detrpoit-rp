import React, {Component} from "react";
import {Chat} from "./interfaces/chat.interface";
import photo from "./assets/*.png"
import "./messenger.less"
import {MessengerPages} from "./enums/messenger.enums"
import {MessengerChat} from "./components/MessengerChat"
import classNames from "classnames";
import {CEF} from "../../../../modules/CEF";
import {CustomEvent} from "../../../../modules/custom.event";
import {IPhoneMessengerDialogDTO} from "../../../../../shared/phone";
import {systemUtil} from "../../../../../shared/system";
import svg from "./assets/*.svg";

export class Messenger extends Component<{
    phoneNumber: number
    phoneId: number
    targetNumber: number
    targetName: string
},
    {
        page: MessengerPages;
        chatList: Chat[];
        selectChat: number
    }> {

    constructor(props: any) {
        super(props);

        this.state = {
            page: props.targetNumber ? MessengerPages.CHAT : MessengerPages.MAIN,
            chatList: CEF.test ? [
                {
                    userName: "Steve Jobs",
                    lastMessage: "Под айфон косите?",
                    unreadMessages: true,
                    time: "09:41",
                    number: 2222
                },
                {
                    userName: "Jony Ive",
                    lastMessage: "За дизайны нужно платить!",
                    unreadMessages: true,
                    time: "09:41",
                    number: 2222
                },
                {
                    userName: "Sanya",
                    lastMessage: "За что уволили?",
                    unreadMessages: false,
                    time: "22:45",
                    number: 2222
                }
            ] : [],
            selectChat: 0
        };

        if (!this.props.targetNumber) {
            this.getDialogsFromServer()
        } else {
            this.setState({ page: MessengerPages.CHAT })
        }
    }

    getDialogsFromServer = () => {
        CustomEvent.callServer('phone:messenger:getDialogs', this.props.phoneId, this.props.phoneNumber)
            .then((data: IPhoneMessengerDialogDTO[]) => {
                this.setState({
                    chatList: data.map(el => { return {
                        number: el.number,
                        photo: undefined,
                        time: systemUtil.timeStampStringTime(el.time),
                        lastMessage: el.lastMessage,
                        unreadMessages: el.unreadMessages,
                        userName: el.contactName
                    } })
                })
            })
    }

    closeChat = () => {
        this.getDialogsFromServer()

        this.setState({
            page: MessengerPages.MAIN,
            selectChat: 0
        })
    }

    render() {
        return <>
            {this.state.page === MessengerPages.MAIN &&
                <div className="np-component">
                    <div className="np-messenger">
                        <div className="np-messenger-title-wrap">
                            <div className="np-messenger-title">
                                Сообщения
                            </div>
                        </div>
                        <div className="np-messenger-search-bar">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M21.4073 19.7527L16.9969 15.3422C18.0587 13.9286 18.6319 12.208 18.63 10.44C18.63 5.92406 14.9559 2.25 10.44 2.25C5.92406 2.25 2.25 5.92406 2.25 10.44C2.25 14.9559 5.92406 18.63 10.44 18.63C12.208 18.6319 13.9286 18.0587 15.3422 16.9969L19.7527 21.4073C19.9759 21.6069 20.2671 21.7135 20.5664 21.7051C20.8658 21.6967 21.1506 21.574 21.3623 21.3623C21.574 21.1506 21.6967 20.8658 21.7051 20.5664C21.7135 20.2671 21.6069 19.9759 21.4073 19.7527ZM4.59 10.44C4.59 9.28298 4.9331 8.15194 5.5759 7.18991C6.21871 6.22789 7.13235 5.47808 8.2013 5.03531C9.27025 4.59253 10.4465 4.47668 11.5813 4.70241C12.7161 4.92813 13.7584 5.48529 14.5766 6.30343C15.3947 7.12156 15.9519 8.16393 16.1776 9.29872C16.4033 10.4335 16.2875 11.6098 15.8447 12.6787C15.4019 13.7476 14.6521 14.6613 13.6901 15.3041C12.7281 15.9469 11.597 16.29 10.44 16.29C8.88906 16.2881 7.40217 15.6712 6.30548 14.5745C5.2088 13.4778 4.59186 11.9909 4.59 10.44Z"
                                    fill="#343435"
                                    fillOpacity="0.4"
                                />
                            </svg>
                            <input type="text" placeholder="Поиск"/>
                        </div>
                        <div className="np-messenger-chat-list">
                            {this.state.chatList.map((el, key) => {
                                return (
                                    <div
                                        onClick={() => {
                                            this.setState({page: MessengerPages.CHAT, selectChat: key},)
                                        }}
                                        className={classNames("np-messenger-chat", {
                                            "np-messenger-chat-active": el.unreadMessages
                                        })}
                                        key={key}>
                                        <div className="np-messenger-chat-photo">
                                            <img src={photo["empty"]} alt=""/>
                                        </div>
                                        <div className="np-messenger-chat-info">
                                            <div className="np-messenger-chat-name">
                                                {el.userName}
                                                <div className="np-messenger-chat-name__new"/>
                                                <div className="np-messenger-chat-name-time">
                                                    {el.time}
                                                </div>
                                            </div>
                                            <div className="np-messenger-chat-last-message">
                                                {el.lastMessage}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>}

            {this.state.page === MessengerPages.CHAT && <MessengerChat
                returnBack={this.closeChat}
                myNumber={this.props.phoneNumber}
                myPhoneId={this.props.phoneId}
                targetName={this.props.targetNumber ? this.props.targetName : this.state.chatList[this.state.selectChat].userName}
                targetNumber={this.props.targetNumber ? this.props.targetNumber : this.state.chatList[this.state.selectChat].number}
            />}
        </>
    }
}

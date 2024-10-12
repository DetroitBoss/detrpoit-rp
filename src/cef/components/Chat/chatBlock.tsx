import React, {Component} from 'react';
import {CustomEventHandler} from 'shared/custom.event';
import {CEF} from '../../modules/CEF';
import {CustomEvent} from '../../modules/custom.event';
import './chatdialog.less';
import {system} from '../../modules/system';
import {chatDialogMessage} from "../../../shared/chat";
import route from "../UserMenu/assets/svg/route.svg";

export class RenderChatBlockClass extends Component<{id: string}, {}> {
    render() {
        return <div className="chat_render">
            {/* <button className="closeButton">
                <img src={closeIcon} /> Закрыть
            </button> */}
            <ChatDialogClass id={this.props.id} />
            </div>;
    }
}

export class ChatDialogClass extends Component<{
    id: string;
}, {
    messages: chatDialogMessage[],
    chatText: string,
    blockSend?: boolean
}>{
    eventNewMessage: CustomEventHandler;
    get id(){
        return this.props.id
    }
    constructor(props:any){
        super(props);
        this.state = {
            messages: CEF.test ? [
                {
                    name: 'Я',
                    id: CEF.id,
                    time: system.timestamp,
                    text: 'Текст сообщения'
                },
                {
                    name: 'Не я',
                    id: CEF.id + 100,
                    time: system.timestamp,
                    text: 'Текст сообщения'
                },
            ] : [],
            chatText: ""
        }

        this.enterChat();
        
    }
    leaveChat(id: string){
        if (this.eventNewMessage) this.eventNewMessage.destroy();
        CustomEvent.triggerServer('dialogchat:leavechat', id)
    }
    enterChat(){
        this.eventNewMessage = CustomEvent.register('dialogchat:newmessage', (id: string, data: { name: string, id: number, time: number, text: string }) => {
            if (this.id !== id) return;
            this.pushMessage(data);
        })
        CustomEvent.callServer('dialogchat:enterchat', this.props.id).then((datas:any[]) => {
            this.setState({messages: []}, () => {
                if (!datas) return;
                this.pushMessage(...datas.reverse())
            })
        })
    }
    pushMessage(...data: { name: string, id: number, time: number, text: string }[]){
        this.setState({ messages: [...data, ...this.state.messages] });
    }
    sendMessage(){
        if (!this.state.chatText) return;
        if (this.state.blockSend) return;
        CustomEvent.triggerServer('dialogchat:sendmessage', this.id, system.filterInput(this.state.chatText))
        if (CEF.test) this.pushMessage({ name: 'Я', id: CEF.id, time: system.timestamp, text: this.state.chatText})
        this.setState({ chatText: "", blockSend: true }, () => {
            setTimeout(() => {
                this.setState({ blockSend: false});
            }, 1000)
        });
    }
    componentDidUpdate(prevProps: any){
        if(this.id !== prevProps.id){
            this.leaveChat(this.id);
            this.enterChat();
        }
    }
    componentWillUnmount(){
        this.leaveChat(this.id)   
    }
    render(){
        return <div className="chat-wrapper" style={{background: 'rgba(21,21,21, 0.9)'}} tabIndex={-1}>
            <div className="chat-wrap" tabIndex={-1}>
                {this.state.messages.map((message, id) => {
                    return <div key={`dialog_message_${message.id}_${id}`} className={"chat-item " + (CEF.id === message.id ? 'me' : '')}>
                        {message.pos ? 
                            <div className="ems-location">
                                <button className="placemark" onClick={()=> {
                                    CEF.setGPS(message.pos.x, message.pos.y);
                                }}>
                                    <img src={route} alt=""/>
                                </button>
                            </div> : null
                        }
                        {CEF.id !== message.id ? <p className="name">{message.name} #{message.id}</p> : <></>}
                        <p className="message">{message.text}</p>
                    </div>
                })}
            </div>
            <div className="write-message-wrap">
                <input type="text" placeholder="Напишите сообщение . . ." value={this.state.chatText} onChange={e => {
                    e.preventDefault();
                    this.setState({ chatText: e.currentTarget.value });
                }} onKeyPress={e => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        this.sendMessage();
                    }
                }} />
                <button className="send-wrap" onClick={e => {
                    e.preventDefault();
                    this.sendMessage();
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="24 / basic / send" opacity="0.5">
                            <path id="icon" fillRule="evenodd" clipRule="evenodd" d="M2.74023 2.25204L4.10524 11.8071L4.87699 12L4.10524 12.1929L2.74023 21.748L22.2362 12L2.74023 2.25204ZM5.89495 10.1929L5.25996 5.74797L17.764 12L5.25996 18.252L5.89495 13.8071L13.1232 12L5.89495 10.1929Z" fill="white"></path>
                        </g>
                    </svg>
                </button>
            </div>
        </div>
    }
}
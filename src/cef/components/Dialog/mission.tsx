import {CustomEvent} from '../../modules/custom.event';
import React from 'react';
import './assets/mission.less';
import {CEF} from '../../modules/CEF';
import {CustomEventHandler} from '../../../shared/custom.event';
import {systemUtil} from '../../../shared/system';


/** Тип сообщения */
const enum MessageType {
    /** Бот, с которым ведём диалог */
    NPC = 0,
    /** Игрок */
    PLAYER = 1,
}

interface MissionMessage {
    /** Тип сообщения, игрок или НПЦ */
    messageSender: MessageType;
    /** Текст сообщения */
    messageText: string;
}
interface MissionState {
    show: boolean,  // показать
    send: boolean,  // нажал на отправку или нет
    npcName: string,    // имя
    npcInfo:string;     // описание
    npcMessages: MissionMessage[]; // сообщения
    npcKeys: string[];                  // кнопки
}
export class Mission extends React.Component<{}, MissionState> {
    ev: CustomEventHandler;
    constructor(props: any) {
        super(props);
    
        this.state = {
            show: false,
            send: false,
            npcName: null,
            npcInfo: null,
            npcMessages: [],
            npcKeys: []
        };
        (window as any).showDialog = ( npcName:string, npcInfo: string, npcKeys:Array<string> , npcMessages?: Array<MissionMessage> ) => {
            this.showDialog(  npcName, npcInfo, npcKeys, npcMessages );
        };
        (window as any).showMessage = ( show: boolean, message: string, npcKeys:Array<string> ) =>  this.showMessage(show,message, npcKeys);

        this.ev = CustomEvent.register('bot:dialog:load', (message: string, npcKeys: string[], npcName: string, npcInfo: string) => {
            const npcMessages = [...this.state.npcMessages];
            if(message) npcMessages.unshift({ messageSender: MessageType.NPC, messageText: message});
            this.setState({ show: true, send: false, npcMessages, npcKeys, npcName: npcName || this.state.npcName, npcInfo: npcInfo || this.state.npcInfo});
        })
    }

    // показать диалог - имя, описание, кнопки. первое сообщение ( не обязательно )
    showDialog = (npcName:string, npcInfo: string, npcKeys:Array<string>, npcMessages?: Array<MissionMessage>) => {
        this.setState( {...this.state, show: true , npcName:npcName, npcInfo:npcInfo, npcKeys:npcKeys,  npcMessages: npcMessages ? npcMessages : this.state.npcMessages });
    }
    // получить новый ответ  - show: false - закрыть
    showMessage = (show: boolean, message:string , npcKeys:Array<string>  ) => {
        if( !show ) return this.setState( {...this.state, show: show });
        this.setState( {...this.state, send: false,  npcKeys:npcKeys, npcMessages: [ {messageSender: MessageType.NPC, messageText: message}, ...this.state.npcMessages]  } );
    }

    clickKey = (id:number) => { // Ответ на кнопку ( id ), -1 если нажатие на esc
        if( id < 0 || this.state.send ) return;
        this.setState( {...this.state, send: true, npcMessages: [ {messageSender: MessageType.PLAYER, messageText: this.state.npcKeys[id]}, ...this.state.npcMessages] } );
        setTimeout(() => {
            CustomEvent.triggerClient('bot:dialog:answer', id)
        }, systemUtil.getRandomInt(700, 1653))
        return;
    }

    componentDidMount = () => {
        document.addEventListener("keyup", this.handleKeyUp, false);    
    }
    componentWillUnmount = () => {
      document.removeEventListener("keyup", this.handleKeyUp, false);    
    }
    
    handleKeyUp = (e: KeyboardEvent) => {
        if (e.keyCode == 27) {
            this.setState( { ...this.state, show: false });
            this.clickKey( -1 );
            CEF.gui.setGui(null);
        }
    }

    render() {
        const { show, npcName, npcInfo, npcMessages, npcKeys } = this.state;
        if( !show ) return null;
        return <div className="mission_main">
            <div className="mission_npcinfo">
                <h1>{npcName}</h1>
                <p>{npcInfo}</p>
            </div>
            <div className="mission_block">
                <div className="message_block">
                    {npcMessages && npcMessages.length ? MessagesBlock( npcMessages ):null}
                </div>
                <div className="keys_block">
                    {KeysBlock( npcKeys , this.clickKey )}
                </div>
            </div>
        </div>
    }
}


const MessagesBlock = ( npcMessages: Array<MissionMessage> ) => {
    return npcMessages.map( (data:MissionMessage, index:number ) => {
        return <div key={index} className={`mission_message + ${data.messageSender == MessageType.NPC ? " mission_server" : " mission_player"}`}>
                    {data.messageText}
               </div>;   
    })
}


const KeysBlock = ( npcKeys: Array<string>, clickKey: (id:number) => void ) => {
    return npcKeys.map( (data:string, index:number ) => { 
        return <div key={index} className={`mission_key`} onClick={() => clickKey(index)}>
                    {data}
              </div>
    })
}
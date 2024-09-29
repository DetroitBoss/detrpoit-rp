import './style.less';
import React, {Component, createRef} from 'react';
import svgs from './images/svg/*.svg'
import {CustomEvent} from '../../modules/custom.event';
import {CustomEventHandler} from '../../../shared/custom.event';
import {CEF} from '../../modules/CEF';
import {StorageAlertData} from "../../../shared/alertsSettings";
import { alertsEnable } from '../App'

export class HudChatClass extends Component<{
    alertsData: StorageAlertData
}, {inpubg?:boolean, input: string, history: string[], historyIndex: number, messages: [string, string, string][], currentTime: string, active: boolean, enable: boolean, show: boolean, showHud: boolean, fullshowtimer: number }> {
    ev: CustomEventHandler;
    ev2: CustomEventHandler;
    ev3: CustomEventHandler;
    commands: [string, string, string][] = [
        // '/me ', '/do ', '/try '
        ['me', '/me', 'Опишите состояние'],
        ['do', '/do', 'Опишите состояние'],
        ['try', '/try', 'Опишите предмет случайности'],
        ['b', 'OOC чат', 'Напишите сообщение'],
    ]
    messagesBlock: React.RefObject<HTMLDivElement>;
    int: any;
    constructor(props: any) {
        super(props);

        this.state = {
            fullshowtimer: 0,
            input: "",
            messages: [],
            history: [],
            historyIndex: 0,
            currentTime: '00:00',
            active: false,
            show: true,
            showHud: false,
            enable: true
        };


        CustomEvent.register('cef:hud:showHud', (show: boolean) => {
            this.setState({ showHud: show }, () => {
                if(show && this.messagesBlock && this.messagesBlock.current) this.messagesBlock.current.scrollTo({top: this.messagesBlock.current.scrollHeight});
            });
        });

        // CustomEvent.register('alerts:enable', (alertsData: StorageAlertData) => {
        //     this.setState({alertsData});
        // })



        this.messagesBlock = createRef();

        if (!window.chatAPI) {
            Object.defineProperty(window, "chatAPI", {
                writable: true
            })
            window.chatAPI = {}
        }
        CustomEvent.register('outputChatBox', (text: string) => {
            window.chatAPI.push(text)
        })
        CustomEvent.register('hud:data', (date: string, time1: string, time2: string, online: number, isAdmin: boolean) => {
            this.setState({ currentTime: time1 })
        })

        CustomEvent.register("alerts:enable", (alerts: StorageAlertData) => {
            this.setState({ enable: alerts.enableChat });
        });

        setInterval(() => {
            if(!this.state.fullshowtimer) return;
            this.setState({fullshowtimer: this.state.fullshowtimer - 1})
        }, 1000)

        window.chatAPI.push = this.insertMessage.bind(this);
        window.chatAPI.clear = this.clearChat.bind(this);
        window.chatAPI.show = this.showChat.bind(this);
        window.chatAPI.activate = this.activeInput.bind(this);
        window.chatAPI.send = this.sendMessage.bind(this);
        window.chatAPI.value = this.valueInput.bind(this);
        if(CEF.test){
            let q = 0
            this.int = setInterval(() => {
                q++
                this.insertMessage('Случайное сообщение которое СлучайноесообщениекотороеСлучайноесообщениекотороеСлучайноесообщениекотороСлучайноесообщениекоторое  '+q, 'Дядя Петя')
            }, 300)
        }

        CustomEvent.register('cef:chat:message', (message: string) => {
            this.insertMessage(message)
        })

        CustomEvent.register('hud:pubg', () => {
            this.setState({inpubg: true});
        })
        CustomEvent.register('hud:pubghide', () => {
            this.setState({inpubg: false});
        })
    }
    valueInput(input: string) {
        this.setState({
            input,
        });
    }
    clearChat(){
        this.setState({messages: []})
    }
    showChat(show: boolean) {
        this.setState({ show });
    }

    sendMessage() {
        let value = this.state.input
        value = value.trim();
        if (value.length >= 350) return
        if (value.length > 0) {
            // this.addHistoryMessage(value);
            if (value[0] === '/') {
                value = value.substr(1);
                if (value.length > 0) {
                    let args = value.split(' ');
                    if (args.length >= 1) {
                        CEF.triggerChatCommand(...args)
                    }
                    this.setState({ history: ['/'+value, ...this.state.history]});
                }
            } else {
                mp.trigger('chatMessage', value);
                this.setState({ history: [value, ...this.state.history]});
            }

        }
        this.valueInput('');
    }

    activeInput(active: boolean) {
        mp.trigger('setChatActiveInput', active ? true : false);
        mp.trigger('cef:setCursor', active);
        if (this.state.active !== active) {
            mp.invoke('focus', active);
        }
        // this.props.setChatActive(active);
        this.setState({
            active
        });
    }
    insertMessage(text: string, who?: string){
        let messages = [...this.state.messages];
        const needScrool = this.messagesBlock && this.messagesBlock.current && this.messagesBlock.current.scrollHeight == (this.messagesBlock.current.scrollTop + this.messagesBlock.current.clientHeight);
        messages.push([this.state.currentTime, who, text])
        this.setState({messages, fullshowtimer: 20}, () => {
            if (needScrool) this.messagesBlock.current.scrollTo({top: this.messagesBlock.current.scrollHeight});
        });
    }


    handleKeyDown(event: any) {
        if (!this.state.showHud) return;
        if (CEF.gui.currentGui && CEF.gui.currentGui != 'hud' as any && CEF.gui.currentGui != 'init') return;
        if (!CEF.focusInput && !this.state.active && this.state.showHud && event.keyCode == 84) {
            event.preventDefault();
            this.activeInput(true);
            return;
        }
        if (!this.state.active) return;
        if ([13, 27].includes(event.keyCode) && this.state.active) {
            event.preventDefault();
            this.sendMessage();
            this.activeInput(false);
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', (ev) => {
            this.handleKeyDown(ev)
        });
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', (ev) => {
            this.handleKeyDown(ev)
        });
        if (this.int) clearInterval(this.int)
    }


    get currentCommand(){
        return this.getStringCommand(this.state.input);
    }
    getStringCommand(str: string){
        if (!str) return null;
        let com: string = null;
        this.commands.map(data => {
            if (str.indexOf("/" + data[0] + " ") === 0) {
                com = data[0];
            }
        })
         return com;
    }
    formatMessage(str: string){
        str = unescape(str);
        str = str.replace(/\n/g, " ")
        const entityMap: {
            [x: string]: string;
        } = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };

        let textResult = String(str).replace(/[&<>"'`=\/]/gi, (s) => {
            return entityMap[s];
        }).split('').reduce((str, s) => {
            return str + (/[a-zA-z0-9а-яА-ЯЁё\!\@\#\$\%\^\&\*\(\)\{\}\,\.\/\_\+\№\;\:\?\\\<\>\`\-]/gi.test(s) ? s : ' ');
        }, '');

        var matchColors = /!\{#\w*\}/gi;
        var match = textResult.match(matchColors);
        if (match !== null) {

            for (let i = 0; i < match.length; i++) {
                let clr = match[i].replace(match[i], match[i].replace('!{', '').replace('}', ''));
                textResult = textResult.replace(match[i], '<span style="color: ' + clr + '">');
            }

            for (let i = 0; i < match.length; i++) {
                textResult += '</span>';
            }
        }

        matchColors = /!\{\w*\}/gi;
        match = textResult.match(matchColors);
        if (match !== null) {

            for (let i = 0; i < match.length; i++) {
                let clr = match[i].replace(match[i], match[i].replace('!{', '').replace('}', ''));
                textResult = textResult.replace(match[i], '<span style="color: #' + clr + '">');
            }

            for (let i = 0; i < match.length; i++) {
                textResult += '</span>';
            }
        }
        return textResult;
    }
    get currentCommandDesc(){
        if (!this.state.input) return 'Напишите сообщение';
        let com: string = 'Напишите сообщение';
        this.commands.map(data => {
            if (this.state.input.indexOf("/" + data[0] + " ") === 0) {
                com = data[2];
            }
        })
         return com;
    }
    clearCommand(callBack?:(str?:string)=>void){
        let str = this.state.input;
        this.commands.map(data => {
            if(str.indexOf("/"+data[0]+" ") === 0){
                str = str.replace("/" + data[0] + " ", '');
            }
        })
        this.setState({input: str}, () => {
            if (callBack) callBack(str);
        });
    }
    setCommand(command: string){
        this.clearCommand(res => {
            this.setState({input: `/${command} ${res}`})
        })
    }

    render() {
        if (!this.state.show) return <></>;
        if (!this.state.showHud) return <></>;
        if (!this.state.enable) return <></>;
        return <div className={"hud-chat "+(this.state.inpubg ? 'battle-royal' : '')} style={{opacity: this.state.fullshowtimer || this.state.active || !this.props.alertsData || !this.props.alertsData.opacityChat ? 1 : 0.1}} tabIndex={-1}>
            <div className="hud-chat-history-wrap" ref={this.messagesBlock} tabIndex={-1}>
                {this.state.messages.map((message, id) => {
                    return <div className="hud-chat-history-item" key={`message_chat_${id}`}>
                        {/* <p className="time">{message[0] || ""}</p> */}
                        <p className="name">{message[1] ? `${message[1]}:` : ''}</p>
                        <p className="message" dangerouslySetInnerHTML={{__html: this.formatMessage(message[2])}} />
                    </div>
                })}
                
            </div>
            {this.state.active ? <>
                <div className="hud-write-message">
                    <input type="text" placeholder={this.currentCommandDesc + " . . ."} value={this.state.input} onChange={e => {
                        e.preventDefault();
                        this.setState({ input: e.currentTarget.value, historyIndex: -1 })
                    }} onKeyDown={e => {
                        if (e.keyCode !== 38 && e.keyCode !== 40) return;
                        const target = e.keyCode === 38 ? this.state.historyIndex + 1 : this.state.historyIndex - 1
                        if (!this.state.history[target]) return;
                        this.setState({ input: this.state.history[target], historyIndex: target })
                        e.preventDefault();
                    }} ref={(input) => {
                        if (input) {
                            input.focus();
                        }
                    }} />
                    <button className="send-wrap" onClick={e => {
                        e.preventDefault();
                        this.sendMessage()
                    }}>
                        <img src={svgs['send']} width="24" height="24" />
                    </button>
                </div>
                <div className="hud-extra-radiobutton-wrap">
                    <div className="hud-extra-radiobutton-item" onClick={e => {
                        e.preventDefault();
                        this.clearCommand()
                    }}>
                        <input type="radio" id="extra1" name="extra-radio" readOnly={true} checked={!this.currentCommand} />
                        <label htmlFor="extra1">Общий чат</label>
                    </div>
                    {this.commands.map(q => {
                        return <div className="hud-extra-radiobutton-item" key={`type_chat_${q[0]}`} onClick={e => {
                            e.preventDefault();
                            this.setCommand(q[0])
                        }}>
                            <input type="radio" id="extra1" name="extra-radio" readOnly={true} checked={this.currentCommand === q[0]} />
                            <label htmlFor="extra1">{q[1]}</label>
                        </div>
                    })}
                </div>
            </> : <></>}
        </div>
    }
};
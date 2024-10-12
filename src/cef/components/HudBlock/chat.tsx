import './style.less';
import React, { Component, createRef } from 'react';
import svgs from './images/svg/*.svg';
import { CustomEvent } from '../../modules/custom.event';
import { CustomEventHandler } from '../../../shared/custom.event';
import { CEF } from '../../modules/CEF';
import { StorageAlertData } from "../../../shared/alertsSettings";

export class HudChatClass extends Component<{
    alertsData: StorageAlertData
}, {
    inpubg?: boolean,
    input: string,
    history: string[],
    historyIndex: number,
    messages: [string, string, string, string?][],
    currentTime: string,
    active: boolean,
    enable: boolean,
    show: boolean,
    showHud: boolean,
    fullshowtimer: number
}> {
    ev: CustomEventHandler;
    ev2: CustomEventHandler;
    ev3: CustomEventHandler;

    // Типы сообщений с префиксами и классами для стилей
    messageTypes: { [key: string]: string } = {
        'ADMIN': 'admin-prefix',
        'GOV': 'gov-prefix',
        'REPORT': 'report-prefix',
        'SERVER': 'mod-prefix',
        'ME': 'me-prefix',
        'DO': 'do-prefix',
        'TRY': 'try-prefix',
        'DICE': 'dice-prefix',
        'NONRP': 'nonrp-prefix',
        'TELEGRAM': 'tg-prefix',
        'DISCORD': 'ds-prefix',
        'АКЦИЯ': 'action-prefix',
        'None': ''  // Тип без префикса
    };

    commands: [string, string, string][] = [
        ['me', '/me', 'Опишите состояние'],
        ['do', '/do', 'Опишите действие'],
        ['try', '/try', 'Опишите предмет случайности'],
        ['b', 'OOC чат', 'Напишите сообщение'],
    ];

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

        this.messagesBlock = createRef();

        // Обработчик показа HUD
        CustomEvent.register('cef:hud:showHud', (show: boolean) => {
            this.setState({ showHud: show }, () => {
                if (show && this.messagesBlock && this.messagesBlock.current) {
                    this.messagesBlock.current.scrollTo({ top: this.messagesBlock.current.scrollHeight });
                }
            });
        });

        // Инициализация window.chatAPI, если не существует
        if (!window.chatAPI) {
            Object.defineProperty(window, "chatAPI", {
                writable: true
            });
            window.chatAPI = {};
        }

        // Обработчики событий чата
        CustomEvent.register('outputChatBox', (text: string, type: string) => {
            window.chatAPI.push(text, type);
        });

        CustomEvent.register('hud:data', (date: string, time1: string, time2: string, online: number, isAdmin: boolean) => {
            this.setState({ currentTime: time1 });
        });

        CustomEvent.register("alerts:enable", (alerts: StorageAlertData) => {
            this.setState({ enable: alerts.enableChat });
        });

        // Таймер для скрытия чата
        setInterval(() => {
            if (!this.state.fullshowtimer) return;
            this.setState({ fullshowtimer: this.state.fullshowtimer - 1 });
        }, 1000);

        // Обновление методов chatAPI
        window.chatAPI.push = this.insertMessage.bind(this);
        window.chatAPI.clear = this.clearChat.bind(this);
        window.chatAPI.show = this.showChat.bind(this);
        window.chatAPI.activate = this.activeInput.bind(this);
        window.chatAPI.send = this.sendMessage.bind(this);
        window.chatAPI.value = this.valueInput.bind(this);

        // Тестовый режим
        if (CEF.test) {
            let q = 0;
            this.int = setInterval(() => {
                q++;
                this.insertMessage('Тестовое сообщение ' + q, 'ADMIN');
                this.insertMessage('Тестовое сообщение ' + q, 'АКЦИЯ');
                this.insertMessage('Тестовое сообщение ' + q, 'ME');
                this.insertMessage('Тестовое сообщение ' + q, 'REPORT');
                this.insertMessage('Тестовое сообщение ' + q, 'DISCORD');
                this.insertMessage('Тестовое сообщение ' + q, 'TELEGRAM');
                this.insertMessage('Тестовое сообщение ' + q, 'SERVER');
                // this.insertMessage('Тестовое сообщение ' + q, 'REPORT');
                // this.insertMessage('Тестовое сообщение ' + q, 'REPORT');
                this.insertMessage('Тестовое сообщение ' + q, 'GOV');
                this.insertMessage('Тестовое сообщение ' + q, 'None'); // Тестовый пример без префикса
            }, 3000);
        }

        // Обработчик приема сообщений с типом
        CustomEvent.register('cef:chat:message', (message: string, type: string = 'None') => {
            this.insertMessage(message, type);
        });

        // Обработчики для режима PUBG
        CustomEvent.register('hud:pubg', () => {
            this.setState({ inpubg: true });
        });
        CustomEvent.register('hud:pubghide', () => {
            this.setState({ inpubg: false });
        });
    }

    // Обновление значения ввода
    valueInput(input: string) {
        this.setState({
            input,
        });
    }

    // Очистка чата
    clearChat() {
        this.setState({ messages: [] });
    }

    // Управление видимостью чата
    showChat(show: boolean) {
        this.setState({ show });
    }

    // Отправка сообщения
    sendMessage() {
        let value = this.state.input.trim();
        if (value.length >= 350) return;
        if (value.length > 0) {
            if (value[0] === '/') {
                value = value.substr(1);
                if (value.length > 0) {
                    let args = value.split(' ');
                    if (args.length >= 1) {
                        CEF.triggerChatCommand(...args);
                    }
                    this.setState({ history: ['/' + value, ...this.state.history] });
                }
            } else {
                mp.trigger('chatMessage', value);
                this.setState({ history: [value, ...this.state.history] });
            }
        }
        this.valueInput('');
    }

    // Активация ввода
    activeInput(active: boolean) {
        mp.trigger('setChatActiveInput', active ? true : false);
        mp.trigger('cef:setCursor', active);
        if (this.state.active !== active) {
            mp.invoke('focus', active);
        }
        this.setState({
            active
        });
    }


    insertMessage(text: string, type: string = 'None') {
        let messages = [...this.state.messages];
        const needScroll = this.messagesBlock && this.messagesBlock.current && this.messagesBlock.current.scrollHeight === (this.messagesBlock.current.scrollTop + this.messagesBlock.current.clientHeight);

        // Определяем класс для типа сообщения
        const messageTypeClass = this.messageTypes[type] || '';  // Если тип None, префикс будет пустым

        // Добавляем сообщение с префиксом и классом
        messages.push([this.state.currentTime, type === 'None' ? '' : type, text, messageTypeClass]);

        this.setState({ messages, fullshowtimer: 20 }, () => {
            if (needScroll && this.messagesBlock.current) {
                this.messagesBlock.current.scrollTo({ top: this.messagesBlock.current.scrollHeight });
            }
        });
    }
    

    // Обработка нажатий клавиш
    handleKeyDown(event: any) {
        if (!this.state.showHud) return;
        if (CEF.gui.currentGui && CEF.gui.currentGui !== 'hud' && CEF.gui.currentGui !== 'init') return;
        if (!CEF.focusInput && !this.state.active && this.state.showHud && event.keyCode === 84) { // 'T' key
            event.preventDefault();
            this.activeInput(true);
            return;
        }
        if (!this.state.active) return;
        if ([13, 27].includes(event.keyCode) && this.state.active) { // Enter или Esc
            event.preventDefault();
            this.sendMessage();
            this.activeInput(false);
        }
    }

    // Добавление обработчика клавиш при монтировании
    componentDidMount() {
        document.addEventListener('keydown', (ev) => {
            this.handleKeyDown(ev);
        });
    }

    // Удаление обработчика клавиш при размонтировании
    componentWillUnmount() {
        document.removeEventListener('keydown', (ev) => {
            this.handleKeyDown(ev);
        });
        if (this.int) clearInterval(this.int);
    }

    // Получение текущей команды
    get currentCommand() {
        return this.getStringCommand(this.state.input);
    }

    // Получение строки команды
    getStringCommand(str: string) {
        if (!str) return null;
        let com: string = null;
        this.commands.map(data => {
            if (str.indexOf("/" + data[0] + " ") === 0) {
                com = data[0];
            }
        });
        return com;
    }

    // Форматирование сообщения (без изменений)
    formatMessage(str: string) {
        str = unescape(str);
        str = str.replace(/\n/g, " ");
        const entityMap: { [x: string]: string } = {
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
        });
    
        // Обрабатываем цвета в формате !{FFFFFF}
        textResult = textResult.replace(/!\{#?([A-Fa-f0-9]{6})\}/g, (match, color) => {
            return `<span style="color: #${color}">`;
        });
    
        // Закрываем все открытые теги span
        const match = textResult.match(/<span/g);
        if (match) {
            for (let i = 0; i < match.length; i++) {
                textResult += '</span>';
            }
        }
    
        return textResult;
    }
    

    // Получение описания текущей команды
    get currentCommandDesc() {
        if (!this.state.input) return 'Напишите сообщение';
        let com: string = 'Напишите сообщение';
        this.commands.map(data => {
            if (this.state.input.indexOf("/" + data[0] + " ") === 0) {
                com = data[2];
            }
        });
        return com;
    }

    // Очистка текущей команды
    clearCommand(callBack?: (str?: string) => void) {
        let str = this.state.input;
        this.commands.map(data => {
            if (str.indexOf("/" + data[0] + " ") === 0) {
                str = str.replace("/" + data[0] + " ", '');
            }
        });
        this.setState({ input: str }, () => {
            if (callBack) callBack(str);
        });
    }

    // Установка команды
    setCommand(command: string) {
        this.clearCommand(res => {
            this.setState({ input: `/${command} ${res}` });
        });
    }

    // Рендер компонента
    render() {
        const { enable, showHud, fullshowtimer, active, show, inpubg } = this.state;
        if (!enable || !show || !showHud) return null;

        return (
            <div className={"hud-chat " + (inpubg ? 'battle-royal' : '')} style={{ opacity: this.state.fullshowtimer || this.state.active || !this.props.alertsData || !this.props.alertsData.opacityChat ? 1 : 0.1 }} tabIndex={-1}>
                <div className="hud-chat-history-wrap" ref={this.messagesBlock} tabIndex={-1}>
                    {this.state.messages.map((message, id) => (
                        <div className="hud-chat-history-item" key={`message_chat_${id}`}>
                            {/* Рендерим префикс только если он есть */}
                            {message[1] && (
                                <span className={`prefix ${message[3]}`}>
                                    {message[1]}
                                </span>
                            )}
                            <p>
                                <span className="message" dangerouslySetInnerHTML={{ __html: this.formatMessage(message[2]) }} />
                            </p>
                        </div>
                    ))}
                </div>
                {active && (
                    <>
                        <div className="hud-write-message">
                            <input
                                type="text"
                                placeholder={this.currentCommandDesc + " . . ."}
                                value={this.state.input}
                                onChange={e => {
                                    e.preventDefault();
                                    this.setState({ input: e.currentTarget.value, historyIndex: -1 });
                                }}
                                onKeyDown={e => {
                                    if (e.keyCode !== 38 && e.keyCode !== 40) return;
                                    const target = e.keyCode === 38 ? this.state.historyIndex + 1 : this.state.historyIndex - 1;
                                    if (!this.state.history[target]) return;
                                    this.setState({ input: this.state.history[target], historyIndex: target });
                                    e.preventDefault();
                                }}
                                ref={input => {
                                    if (input) {
                                        input.focus();
                                    }
                                }}
                            />
                            <button className="send-wrap" onClick={e => {
                                e.preventDefault();
                                this.sendMessage();
                            }}>
                                <img src={svgs['send']} width="24" height="24" alt="Send" />
                            </button>
                        </div>
                        <div className="hud-extra-radiobutton-wrap">
                            <div className="hud-extra-radiobutton-item" onClick={e => {
                                e.preventDefault();
                                this.clearCommand();
                            }}>
                                <input type="radio" id="extra1" name="extra-radio" readOnly={true} checked={!this.currentCommand} />
                                <label htmlFor="extra1">Общий чат</label>
                            </div>
                            {this.commands.map(q => (
                                <div className="hud-extra-radiobutton-item" key={`type_chat_${q[0]}`} onClick={e => {
                                    e.preventDefault();
                                    this.setCommand(q[0]);
                                }}>
                                    <input type="radio" id={`extra_${q[0]}`} name="extra-radio" readOnly={true} checked={this.currentCommand === q[0]} />
                                    <label htmlFor={`extra_${q[0]}`}>{q[1]}</label>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    }
}

export const HudChat = HudChatClass;
export default HudChat;

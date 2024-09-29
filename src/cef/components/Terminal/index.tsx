import React, {Component, createRef} from 'react';
import './style.less'
import {systemUtil} from '../../../shared/system';
import {CustomEvent} from '../../modules/custom.event';
import {CEF} from '../../modules/CEF';


type TerminalLineType = "input" | "output"

export class TerminalBlock extends Component<{}, {
    lines: [TerminalLineType, string][],
    blockInput: boolean
    display: boolean;
}>{
    input: React.RefObject<HTMLInputElement>;
    commands = new Map<string, (...args: string[]) => void>();
    div: React.RefObject<HTMLDivElement>;

    constructor(props: any) {
        super(props);
        this.state = {
            blockInput: false,
            lines: [],
            display: false
        }

        this.input = createRef()
        this.div = createRef()
        this.commands.set('help', () => {
            this.block = true;
            this.insertLine('output', `Список установленных утилит`);
            const commands = [...this.commands].map(q => q[0])
            for (let command in commands) {
                this.insertLine('output', commands[command]);
            }
            this.block = false;
        })
        this.commands.set('time', () => {
            this.insertLine('output', systemUtil.fullDateTime);
        })
        this.commands.set('search', (item) => {
            if (!item) return this.insertLine('output', "В качестве второго аргумента необходимо указать тип устройства");
            if (item === "terminal"){
                this.block = true;
                this.insertLine('output', "Поиск ближайшего терминала");
                setTimeout(() => {
                    CustomEvent.callClient('terminal:search').then(id => {
                        this.block = false;
                        if (!id) return this.insertLine('output', "Ошибка. Терминал не обнаружен");
                        else return this.insertLine('output', `Успешно. Обнаружен терминал поблизости с идентификатором ${id}`);
                    })
                }, systemUtil.getRandomInt(1000, 2000))
                return;
            }

            this.insertLine('output', "Аргумент поиска указан не корректно");
        })
        this.commands.set('bruteforce', async (item, handle) => {
            if (!item) return this.insertLine('output', "В качестве второго аргумента необходимо указать тип устройства");
            if (!handle) return this.insertLine('output', "В качестве третьего аргумента необходимо указать идентификатор устройства");
            if (item === "terminal"){
                this.block = true;
                this.insertLine('output', `Подключение к терминалу ${handle}`);
                await systemUtil.getRandomInt(2000, 3000);
                let valid:boolean = await CustomEvent.callClient('terminal:bruteforce:validterminal', handle)
                if(!valid){
                    this.block = false;
                    this.insertLine('output', `Терминал с идентификатором ${handle} не обнаружен. Учитывайте что радиус беспроводного модуля ограничен несколькими метрами`);
                }
                this.insertLine('output', `Соединение с терминалом ${handle} установлено. Учитывайте что радиус беспроводного модуля ограничен несколькими метрами, чем вы ближе, тем лучше будет сигнал. Дождитесь окончания работы`);
                let text = ['PIN CODE: ' + systemUtil.randomNumber(6)];
                for(let id = 0; id <= 100; id++){
                    text.push(systemUtil.randomStr(10))
                }
                for(let id = (CEF.test ? 90 : 0); id < 100; id++){
                    let ok: number = await CustomEvent.callClient('terminal:bruteforce:validterminal:interact', handle)
                    if(!ok){
                        this.block = false;
                        this.insertLine('output', `Соединение с терминалом ${handle} разорвано`);
                        return;
                    } else {
                        this.block = true;
                        await systemUtil.sleep((20 - ok) * (100))
                        text.splice(systemUtil.getRandomInt(1, text.length), 1)
                        this.insertLine('output', systemUtil.randomStr(text.join('').length));
                        this.insertLine('output', `Обработано ${id} / 100%`);
                    }
                }
                this.block = false;
                this.insertLine('output', `${text[0]}`);
                CustomEvent.triggerClient('terminal:bruteforce:validterminal:done', handle)
                return;
            }

            this.insertLine('output', "Аргумент поиска указан не корректно");
        })
        if(CEF.test) this.load();

        CustomEvent.register("terminal:open", () => {
            this.setState({display: true});
            CEF.gui.enableCusrsor();
            this.load();
            CustomEvent.triggerClient('terminal:opened', true)
        })
        CustomEvent.register("terminal:send", (text: string) => {
            this.insertLine("output", text)
        })
    }

    load() {
        setTimeout(async () => {
            this.clear();
            this.block = true;
            await systemUtil.sleep(1000);
            this.insertLine("output", "Загрузка системы")
            await systemUtil.sleep(1000);
            if(!CEF.test){
                for (let id = 0; id <= 100; id++) {
                    await systemUtil.sleep(systemUtil.getRandomInt(50, 250));
                    if(!this.state.display) return;
                    this.insertLine("output", `Загрузка системы. Состояние - ${id}%`)
                }
            }
            this.insertLine("output", `Cherry Terminal Mini успешно запущен. Операционная система загружена и готова к работе`)
            this.block = false;
        }, 1)
    }

    clear() {
        this.setState({ lines: [] })
    }

    get block() {
        return this.state.blockInput;
    }
    set block(status) {
        this.setState({ blockInput: status });
    }

    insertLine(type: TerminalLineType, text: string) {
        if (!this.state.display) return;
        const lines = [...this.state.lines]
        lines.push([type, text])
        this.setState({ lines }, () => {
            this.div.current.scrollTo({ top: this.div.current.scrollHeight + 100 });
        });
    }

    runCommand(...args: string[]) {
        this.insertLine('input', args.join(' '));
        setTimeout(() => {
            if (!this.commands.has(args[0])) {
                this.insertLine('output', `Команда ${args[0]} не найдена`);
            } else {
                const name = args[0]
                args.splice(0, 1);
                this.commands.get(name)(...args)
            }
        }, 100)
        this.input.current.value = "";
    }

    render() {
        if (!this.state.display) return <></>;
        return <>
            <div className="terminal-block">
                <span className='logo'>Cherry Terminal</span>
                <span className='exit' onClick={e => {
                    e.preventDefault();
                    CEF.gui.disableCusrsor();
                    this.setState({display: false});
                    CustomEvent.triggerClient('terminal:opened', false)
                }}>X</span>
                <div className={"terminal"} ref={this.div}>
                    {this.state.lines.map((item, id) => {
                        return <p key={id} className={item[0]}>{item[1]}</p>
                    })}
                    {this.state.blockInput ? <></> : <p className="input"><input ref={this.input} onKeyUp={e => {
                        if (e.keyCode !== 13) return;
                        e.preventDefault();
                        if (!this.input.current.value) return;
                        this.runCommand(...this.input.current.value.split(' '))
                    }} /></p>}
                </div>
            </div>
        </>
    }
}
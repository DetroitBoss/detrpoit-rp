import React from 'react';
import './assets/pers.less';
import paysvg from './assets/pers_pay.svg';
import newsvg from './assets/pers_new.svg';

import persinfo from './assets/pers_info.webp';
import line_bg1 from './assets/line_bg1.png';
import line_bg2 from './assets/line_bg2.png';
import line_bg3 from './assets/line_bg3.png';

import line_1 from './assets/line_1.png';
import line_2 from './assets/line_2.png';
import line_3 from './assets/line_3.webp';
import {CustomEvent} from '../../modules/custom.event';
import {CEF} from '../../modules/CEF';
import {personageLoginData} from '../../../shared/login.state';
import {systemUtil} from '../../../shared/system';
import {DONATE_SLOT_PERSONAGE_COST} from '../../../shared/economy';

import exitsvg from './../IdCard/assets/exit.svg';
import check from './../ClothShop/assets/check.svg';
import {fractionCfg} from "../../modules/fractions";

const Line = [
    {
        name: "Скользкая дорожка", text: "Честная жизнь по законам других людей подходит не всем.\
                                     Зачем жить так, если можно создать свои законы?\
                                     Если тебе близки эти слова, то данный путь для тебя.\
                                     Играй за выходца из бедных районов, для которого закон - это улицы.\
                                     Заведи знакомства с криминальными шишками, начинай с самых низов и заберись на вершину преступного мира,\
                                      управляя своей бандой, и держа территории под своим контролем", bg: line_bg1, img: line_1
    },
    {
        name: "Американская мечта", text: "Уважаешь честный труд и всего хочешь достигнуть сам?\
                                     Тогда американская мечта для тебя.\
                                     Добейся своими усилиями хорошей работы и управляй своей жизнью сам.\
                                     Труд сделал из обезьяны человека, не забывай про это.\
                                     Поэтому если ты готов преодолевать жизненные сложности и идти к своей мечте, \
                                     соблюдая закон, тогда ты сможешь забраться на самую вершину в правительстве или других государственных структурах", bg: line_bg2, img: line_2
    },
    {
        name: "Красиво жить не запретишь", text: "В жизни так бывает, что хочется чего-то попробовать. \
                                            А так как она у нас одна - то оттягивать не стоит. \
                                            Именно поэтому клубы, развлечения и быстрая скорость созданы для тебя. \
                                            Но у всего есть своя цена и в ходе очередного трипа ты потерял всё. \
                                            Если ты считаешь, что успех у тебя был не случаен и ты хочешь вернуть себе прошлую жизнь с дорогими авто, самыми лучшими бизнесами, \
                                            брендированной одеждой и всем прилагающимся, то пройти путь с самых низов на вершину Олимпа.", bg: line_bg3, img: line_3
    }
];

const PERS_MONEY = -1,  //слот за рубли
    PERS_FREE = 0;   //свободный слот

const SELECT_PERS = 1,
    INFO_LINE = 2,
    SELECT_LINE = 3;




type GetData = {
    page: number;
    show: boolean;
    page_loading: number;
    data: personageLoginData[],
    accept_line: number,
    error: {id:number, text:string},
    selected: number,
}

export default class NewPersonage extends React.Component<{ data: personageLoginData[], donate: number }, GetData> {
    constructor(props: any) {
        super(props);
        this.state = {
            page: SELECT_PERS,
            show: true,
            page_loading: 0,
            accept_line: -1,
            data: this.props.data ? this.props.data: [],//[{id:1,name:"test name", money: 111}],
            error: {id: 0, text: "Ошибка при авторизации"},
            selected: 0
        }
    }
    selectPers = (id: number) => {
        // выбор персонажа
        if(this.state.selected) return;
        this.setState({ selected: this.state.selected + 1 }, () => {
            if(this.state.selected) setTimeout(() => {this.setState({ selected: this.state.selected - 1 })}, 2000);
            CustomEvent.callServer('cef:user:select', id).then(res => {
                if (!res) {
                    this.setState({ ...this.state, page_loading: 0, selected: this.state.selected - 1 });
                    setTimeout(() => this.setState({ ...this.state, show: false }), 1000);
                } else {
                    this.setState( {...this.state, error: {id, text: res}, selected: this.state.selected - 1});
    //                CEF.alert.setAlert('error', res);
                }
            })
        });

    }
    createPers = () => {
        this.setState({ ...this.state, page_loading: -1 });
        setTimeout(() => {
            this.setState({ ...this.state, page: INFO_LINE, page_loading: INFO_LINE });
        }, 1000);
    }
    editPers = (id: number) => {
        // Изменить персонажа
    }
    delPers = (id: number) => {
        // удалить персонажа
    }
    buyPers = () => {
        // Купить слот персонажа
    }
    acceptLine = ( line:number ) => {
        this.setState( {...this.state, accept_line: line });
    }
    selectLine = (line: number) => {
        //Выбор сюжетной линии ( 0 - 2 )
        CustomEvent.callServer('cef:user:create', false, line).then(status => {
            if (!status) return;
            this.setState({ ...this.state, page_loading: 0 });
            setTimeout(() => {
                this.setState({ ...this.state, show: false })
            }, 1000);
        });
    }
    prev_selectLine = () => {
        this.setState({ ...this.state, page_loading: -1 });
        setTimeout(() => {
            CEF.playSound('questonyx')
            this.setState({ ...this.state, page: SELECT_LINE, page_loading: SELECT_LINE });
        }, 1000);
    }

    componentDidMount = () => {
        this.setState({ ...this.state, page_loading: SELECT_PERS });
    }
    render() {
        if (this.state.show === false) return null;
        return <div className={`newpers_main ${this.state.page_loading < 0 ? "newpers_black" : ""}`}>
            {persComponent(this.state, this.state.data, this.acceptLine, this.selectPers, this.buyPers, this.editPers, this.delPers, this.createPers, this.prev_selectLine, this.selectLine, this.props.donate)}
        </div>
    }
}

const persComponent = (state: GetData,
    characters: personageLoginData[],
    acceptLine: ( id:number ) => void,
    selectPers: (id: number) => void,
    buyPers: () => void,
    editPers: (id: number) => void,
    delPers: (id: number) => void,
    createPers: () => void,
    prev_selectLine: () => void,
    selectLine: (line: number) => void, donate: number) => {


    if (characters.length == 0) characters.push({ id: PERS_FREE }, { id: PERS_FREE }, { id: PERS_MONEY })
    else if (characters.length == 1) characters.push({ id: PERS_FREE }, { id: PERS_MONEY })
    else if (characters.length == 2) characters.push({ id: PERS_MONEY })

    switch (state.page) {
        case SELECT_PERS: {
            return <>
                <div className="newpers_blur_test" />
                <div className="newpers_grid" />
                <div className={`newpers_block ${state.page_loading > 0 ? "show" : ""}`}>
                    <div className="newpers_sinfo"><h3>Выберите</h3><h3>Персонажа</h3></div>
                    {characters.map((data: personageLoginData, index: number) =>
                        <div key={index} className={data.id != 0 ? "newpers_box" : "newpers_box newpers_new"}>
                            {persBox(data, selectPers, buyPers, editPers, delPers, createPers, donate, state.error)}
                        </div>
                    )}
                </div>
            </>
        }
        case INFO_LINE: {
            return <>
                <div className="newpers_blur_test" />
                <div className="newpers_grid" />
                <div className={`newpers_create_info newpers_block ${state.page_loading > 0 ? "show" : ""}`}>
                    <img src={persinfo} />
                    <div className="newpers_info">
                        <h1>Самое</h1><br /><h1>ответственное...</h1>
                        <h2>Выбор сюжетной линии</h2>
                        <p>Сейчас вам потребуется выбрать одну из трех сюжетных линий.</p>
                        <p>Вы определяетесь со своей ролью, ваш сюжет будет пересекаться с вашими характерными чертами личности.</p>
                        <div><p>Удачи в игре!</p><div onClick={prev_selectLine}>Спасибо, понятно</div></div>
                    </div>
                </div>
            </>
        }
        case SELECT_LINE: {
            
            return <>
                <div className={`newpers_black ${state.page_loading > 0 ? "show" : ""}`} />
                <div className="newpers_grid" style={{ opacity: `0.2` }} />
                <div className={`newpers_line ${state.page_loading > 0 ? "show" : ""}`}>
                    {Line.map((data, index: number) =>
                        <div key={index} className="line_box" style={{ backgroundImage: `url(${data.bg})` }}>
                            <div className="line_img"><img src={data.img} /></div>
                            <h1>{data.name}</h1>
                            <p>{data.text}</p>
                            {index === 2 ?
                                <div className="newpers_free">
                                    <p>Внимание! Только для опытных пользователей</p>
                                    <p style={{fontWeight: 'normal'}}>В данном выборе у вас не будет сюжетных заданий</p>
                                </div> : null
                            }
                            <div className="line_key" onClick={() => acceptLine(index)}>Выбрать</div>

                        </div>
                    )}
                </div>
                {state.accept_line >= 0 ? 
                    <div className="newpers_modal_select">
                        <div className="newpers_modal_box">
                            <h1>Вы выбрали сюжетную линию</h1>
                            <h1>"{Line[state.accept_line].name}"</h1>
                            <p>Вы уверены?</p>
                            <div className="newpers_modal_keys">
                                <div className="newpers_modal_key" onClick={() => selectLine(state.accept_line)}>
                                    <img src={check} alt={''}/>
                                    Выбрать
                                </div>
                                <div className="newpers_modal_key np_k_cncl" onClick={() => acceptLine(-1)}>
                                    <img src={exitsvg} alt={''}/>
                                    Отмена
                                </div>
                            </div>                                
                        </div>
                    </div>: null 
                }
            </>
        }
        default: return null;
    }
}

const persBox = (data: personageLoginData,
    selectPers: (id: number) => void,
    buyPers: () => void,
    editPers: (id: number) => void,
    delPers: (id: number) => void,
    createPers: () => void, 
    donate: number,
    error: {id:number, text:string}) => {
    switch (data.id) {
        case PERS_MONEY: {
            // Платный
            return <div className="newpers_paybox">
                <img src={paysvg} />
                <h1>Разблокируйте</h1>
                <p>чтобы создать третьего персонажа</p>
                <div className="newpers_paykey" onClick={(e) => {
                    e.preventDefault();
                    if (donate < DONATE_SLOT_PERSONAGE_COST) return;
                    createPers();
                }}><p style={{opacity: donate >= DONATE_SLOT_PERSONAGE_COST ? 1 : 0.5}}>{donate >= DONATE_SLOT_PERSONAGE_COST ? `разблокировать` : `недостаточно коинов`}</p></div>
                <h2>{systemUtil.numberFormat(DONATE_SLOT_PERSONAGE_COST)} РУБ.</h2>
            </div>;
        }
        case PERS_FREE: {
            //пустой
            return <div className="newpers_newbox" onClick={() => createPers()}>
                <img src={newsvg} />
                <p>Создать</p>
                <p>нового персонажа</p>
            </div>;
        }
        default: {
            // Активный
            return <div className="newpers_usebox">
                <div className="newpers_name">
                    <h1>{data.name.replace(" ", "\n")}</h1>
                    <div><h1>{data.level}</h1><p>уровень</p></div>
                </div>
                <div className="newpers_org">
                    <h1>{data.fraction && data.rank ? `${fractionCfg.getFractionName(data.fraction)} ${fractionCfg.getRankName(data.fraction, data.rank)}` : ""}</h1>
                </div>
                <div className="newpers_money">${data.money.toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ')}</div>
                <div className="newpers_keys">
                    <div className="newpers_select" onClick={() => selectPers(data.id)}>Выбрать</div>
                    {/* <div onClick={() => editPers(data.id)}><img src={editsvg} /></div>
                    <div onClick={() => delPers(data.id)}><img src={delsvg} /></div> */}
                </div>
                {error.id === data.id ? 
                    <div className="newpers_err">
                        <p>{error.text}</p>
                    </div> : null }
            </div>;
        }
    }
}
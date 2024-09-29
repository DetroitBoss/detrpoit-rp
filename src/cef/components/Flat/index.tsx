import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
//import '../../assets/less/uikit.less'
import './assets/style.less'
import png from './assets/png/*.png';
import {CEF} from "../../modules/CEF";
import {CustomEventHandler} from "../../../shared/custom.event";
import {
    CONSTRUCTION_HOUSES,
    CONSTRUCTION_MAX,
    CONSTRUCTION_MIN_FOR_START,
    constructionMySessionItem,
    constructionSessionItem
} from "../../../shared/construction";
import {system} from "../../modules/system";


interface constructionSessionItemCef extends constructionSessionItem {
    inputPass?:string
}

type FlatType = { 
    show:boolean;
    page:number;
    createPass:boolean;
    sessions: constructionSessionItemCef[],
    selectSession: number,
    mySession: {id:number, name:string, status:boolean, owner?:boolean}[]
    mySessionPass?: string;
}
export class Flat extends Component<{}, FlatType> {
    private ev: CustomEventHandler;
    private ev2: CustomEventHandler;
    constructor(props: any) {
        super(props);
        this.state = {
            show: CEF.test,
            page: 0,
            createPass:false,
            sessions: [
                {id:1, name:"Player Name", pass:false},
                {id:2, name:"Player Name", pass:true},
            ],
            selectSession: -1,
            mySession: [
                {id: 1, name:'Player Name', status: true, owner: true},
                {id: 2, name:'Player Name2', status: true}
            ]
        };

        this.ev = CustomEvent.register('flat:show', (sessions:constructionSessionItem[]) => {
            this.setState({page: 0, sessions, show: true, mySession: [], mySessionPass: null });
        })
        this.ev2 = CustomEvent.register('flat:showmy', (mySession:constructionMySessionItem[],mySessionPass:string) => {
            this.setState({page: 2, sessions: [], show: true, mySession, mySessionPass });
        })
    }
    componentDidMount = () => {
    }
    componentWillUnmount = () => {
        if(this.ev) this.ev.destroy();
        if(this.ev2) this.ev2.destroy();
    }

    render() {
        if(!this.state.show) return <></>;
        switch( this.state.page ) {
            case 0: {
                return <>
                        <section className="flat-create-wrapper">
                            <i className="fly-ravshan"><img src={png['ravshan']} alt=""/></i>
                            <h2 className="title-main large">Ремонт <span className="thin">квартир</span></h2>
                            <p className="desc-main">Зовите друзей и стройте квартиру быстрее вместе с ними, зарабатывайте большие деньги, собирайте мебель, кладите плитку, красьте стены и многое другое. Выполнив всю работу, каждый участник получает зарплату в зависимости от количества сделанного.</p>
                            <div className="fc-wows">
                                <div>
                                    <img src={png['flat-icon-1']} alt=""/>
                                    <p>За квартиру<br /><span>${system.numberFormat(CONSTRUCTION_HOUSES[0].reward)}</span></p>
                                </div>
                                <div>
                                    <img src={png['flat-icon-2']} alt=""/>
                                    <p>Вклад в разватие<br /><span>штата</span></p>
                                </div>
                                <div>
                                    <img src={png['flat-icon-3']} alt=""/>
                                    <p>Работай<br /><span>с друзьями ({CONSTRUCTION_MIN_FOR_START} - {CONSTRUCTION_MAX} человека)</span></p>
                                </div>
                            </div>
                            <div className="form-create-flat">
                                <div className="flex-line mb24">
                                    <button className="main-but" onClick={()=>{
                                        CustomEvent.triggerServer('flat:create', this.state.createPass)
                                    }}>
                                        <p>Создать сессию</p>
                                    </button>
                                    <div className="switch-wrapper flex-line ml32">
                                        <div className="switch-wrap">
                                            <input type="checkbox" id="switch" onClick={()=>{
                                                this.setState({createPass: !this.state.createPass})
                                            }}/>
                                            <label htmlFor="switch"></label>
                                        </div>
                                        <p className="title ml16" style={{whiteSpace: 'nowrap'}}>
                                            С паролем                                        
                                        </p>
                                    </div>
                                </div>
                                <button className="main-but grey" onClick={()=>{
                                    this.setState( {page: 1})
                                }}>
                                    <p>Присоединиться к сессии</p>
                                </button>
                            </div>

                        </section>
                </>                
            }
            case 1: {
                return <>
                    <section className="flat-create-wrapper">
                        <i className="fly-ravshan"><img src={png['ravshan']} alt=""/></i>
                        <h2 className="title-main large mb50">Выберите <span className="thin">сессию</span></h2>
                        <div className="flat-list mb32">
                            {this.state.sessions.map( (data, id) => {
                                if( data.pass === true ) {
                                    return <button key={id} className={`flat-password-wrap${ this.state.selectSession === id ? ' active': ''}`} onClick={()=>{
                                                this.setState({selectSession:id});
                                            }}>
                                                <div className="flat-password-enter">
                                                    <p className="mr24">{data.name}</p>
                                                    <input type="password" placeholder="****" value={data.inputPass ? data.inputPass : ''} onChange={(e)=>{
                                                        let sessions = this.state.sessions;
                                                        sessions[id].inputPass = e.target.value;
                                                        console.log( e.target.value );
                                                        this.setState( { sessions } );
                                                    }}/>
                                                </div>
                                                <p>{data.name}</p>
                                            </button>
                                }
                                return  <button className={`${ this.state.selectSession === id ? 'active': ''}`} key={id} onClick={()=>{
                                            this.setState({selectSession:id});
                                        }}>
                                            <p>{data.name}</p>
                                        </button>
                            })}
                        </div>
                        <div className="w400">
                            <button className="main-but" onClick={()=>{
                                if(this.state.selectSession < 0 ) return; 
                                CustomEvent.triggerServer('flat:select', this.state.sessions[this.state.selectSession].id, this.state.sessions[this.state.selectSession].inputPass );
                            }}>
                                <p>Присоединиться</p>
                            </button>
                        </div>


                    </section>
                </>                
            }
            case 2: {
                return <>
                    <section className="flat-create-wrapper">
                        <i className="fly-ravshan"><img src={png['ravshan']} alt=""/></i>
                        <h2 className="title-main large mb50">Ваша сессия
                            {/*<span className="thin">#234</span>*/}
                        </h2>
                        {this.state.mySessionPass ? <p className="desc-main">Пароль сессии: {this.state.mySessionPass}</p> : ''}
                        <div className="flat-list mb32">
                            {this.state.mySession.map((data)=> {
                                return <button className={ data.owner ? ( data.status ? "flat-success flat-king" : "flat-king") : ( data.status ? "flat-success" : "") } >
                                            <p>{data.name}</p>
                                        </button>
                            })}
                        </div>
                        <div className="w380">
                            {!this.state.mySession.find( (data) => data.id === CEF.id ).status ?
                                <button className="main-but green" onClick={ ()=> {
                                    let mySession = this.state.mySession;
                                    mySession.find( (data) => data.id === CEF.id ).status = true;
                                    this.setState({mySession});
                                    CustomEvent.triggerServer('flat:ready', true );
                                }}>
                                    <p>Готов</p>
                                </button> :
                                <button className="main-but grey" onClick={ ()=> {
                                    let mySession = this.state.mySession;
                                    mySession.find( (data) => data.id === CEF.id ).status = false;
                                    this.setState({mySession});
                                    CustomEvent.triggerServer('flat:ready', false );
                                }}>
                                    <p>Отменить готовность</p>
                                </button>
                            }
                        </div>
                    </section>
                </>                
            }
        }
    }
}

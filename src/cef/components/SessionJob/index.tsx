import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import './assets/style.less'
import png from './assets/png/*.png';
import {CEF} from "../../modules/CEF";
import {CustomEventHandler} from "../../../shared/custom.event";


import {SessionPlayer, SessionInfo, SessionJobMenuConfig} from "../../../shared/gui/SessionJob";


interface JoiningSessionData extends SessionInfo {
    inputPass?:string
}

type SessionMenuState = {
    config: SessionJobMenuConfig;
    show:boolean;
    page:number;
    createPass:boolean;
    sessions: JoiningSessionData[],
    selectSession: number,
    mySession: SessionPlayer[]
    mySessionPass?: string;
}
export class JobSessions extends Component<{}, SessionMenuState> {
    private readonly ev: CustomEventHandler;
    private readonly ev2: CustomEventHandler;
    constructor(props: any) {
        super(props);

        this.ev = CustomEvent.register('sessions::show', (sessions:SessionInfo[], config: SessionJobMenuConfig) => {
            this.setState({page: 0, sessions, show: true, mySession: [], mySessionPass: null, config });
        });
        this.ev2 = CustomEvent.register('sessions::showmy', (mySession:SessionPlayer[], mySessionPass:string) => {
            this.setState({page: 2, sessions: [], show: true, mySession, mySessionPass });
        });

        this.state = {
            show: CEF.test,
            page: 0,
            createPass:false,
            sessions: [
                { Id: 1, Name: "Player Name", IsProtected: true }
            ],
            selectSession: -1,
            mySession: [
                { Id: 20, Name: "Milt Devovich", IsReady: true, IsOwner: true },
                { Id: 21, Name: "Vadim Devovich", IsReady: false },
                { Id: 22, Name: "Ruslan Configuratovich", IsReady: true },
            ],
            config: null
        };
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
                        <section className="session-create-wrapper">
                            <i className="fly-image"><img src={png[this.state.config.RightImage]} alt=""/></i>
                            <h2 className="title-main large">{this.state.config.NameLarge} <span className="thin">{this.state.config.NameThin}</span></h2>
                            <p className="desc-main">{this.state.config.Description}</p>
                            <div className="fc-wows">
                                {
                                    this.state.config.DescriptionItems.map(descItem => {
                                        return <div>
                                            <img src={png[descItem.Image]} alt=""/>
                                            <p>{descItem.UpperText}<br /><span>{descItem.LowerText}</span></p>
                                        </div>
                                    })
                                }
                            </div>
                            <div className="form-create-session">
                                <div className="flex-line mb24">
                                    <button className="main-but" onClick={()=>{
                                        CustomEvent.triggerServer('sessions::create', this.state.createPass)
                                    }}>
                                        <p>Создать сессию</p>
                                    </button>
                                    <div className="switch-wrapper flex-line ml32">
                                        <div className="switch-wrap">
                                            <input type="checkbox" id="switch" onClick={()=>{
                                                this.setState({createPass: !this.state.createPass})
                                            }}/>
                                            <label htmlFor="switch"/>
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
                    <section className="session-create-wrapper">
                        <i className="fly-image"><img src={png[this.state.config.RightImage]} alt=""/></i>
                        <h2 className="title-main large mb50">Выберите <span className="thin">сессию</span></h2>
                        <div className="session-list mb32">
                            {this.state.sessions.map( (data, id) => {
                                if( data.IsProtected === true ) {
                                    return <button key={id} className={`session-password-wrap${ this.state.selectSession === id ? ' active': ''}`} onClick={()=>{
                                                this.setState({selectSession:id});
                                            }}>
                                        <div className="session-password-enter">
                                            <p className="mr24">{data.Name}</p>
                                            <input type="password" placeholder="****" value={data.inputPass ? data.inputPass : ''} onChange={
                                                (e) => {
                                                let sessions = this.state.sessions;
                                                sessions[id].inputPass = e.target.value;
                                                console.log( e.target.value );
                                                this.setState( { sessions } );
                                            }}/>
                                        </div>
                                        <p>{data.Name}</p>
                                    </button>
                                }
                                return  <button className={`${ this.state.selectSession === id ? 'active': ''}`} key={id} onClick={()=>{
                                            this.setState({selectSession:id});
                                        }}>
                                            <p>{data.Name}</p>
                                        </button>
                            })}
                        </div>
                        <div className="w400">
                            <button className="main-but" onClick={()=>{
                                if(this.state.selectSession < 0 ) return; 
                                CustomEvent.triggerServer('sessions::join',
                                    this.state.sessions[this.state.selectSession].Id,
                                    this.state.sessions[this.state.selectSession].inputPass
                                );
                            }}>
                                <p>Присоединиться</p>
                            </button>
                        </div>


                    </section>
                </>                
            }
            case 2: {
                return <>
                    <section className="session-create-wrapper">
                        <i className="fly-image"><img src={png[this.state.config.RightImage]} alt=""/></i>
                        <h2 className="title-main large mb50">Ваша сессия
                            {/*<span className="thin">#234</span>*/}
                        </h2>
                        {this.state.mySessionPass ? <p className="desc-main">Пароль сессии: {this.state.mySessionPass}</p> : ''}
                        <div className="session-list mb32">
                            {this.state.mySession.map((data)=> {
                                return <button className=
                                        { data.IsOwner ? ( data.IsReady ? "session-success session-king" : "session-king")
                                                    : ( data.IsReady ? "session-success" : "") }>
                                            <p>{data.Name}</p>
                                        </button>
                            })}
                        </div>
                        <div className="w380">
                            {!this.state.mySession.find( (data) => data.Id === CEF.id ).IsReady ?
                                <button className="main-but green" onClick={ ()=> {
                                    let mySession = this.state.mySession;
                                    mySession.find( (data) => data.Id === CEF.id ).IsReady = true;
                                    this.setState({mySession});
                                    CustomEvent.triggerServer('sessions::setReady', true );
                                }}>
                                    <p>Готов</p>
                                </button> :
                                <button className="main-but grey" onClick={ ()=> {
                                    let mySession = this.state.mySession;
                                    mySession.find( (data) => data.Id === CEF.id ).IsReady = false;
                                    this.setState({mySession});
                                    CustomEvent.triggerServer('sessions::setReady', false );
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

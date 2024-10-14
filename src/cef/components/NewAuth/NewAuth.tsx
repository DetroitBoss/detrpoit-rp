import React from 'react';
import './assets/auth.less';
import logo from './assets/logo.svg';
import logotext from './assets/textlogo.svg';
import eye from './assets/openeye.svg';
import colse_eye from './assets/closeeye.svg';
import {CustomEvent} from './../../modules/custom.event';
import {CEF} from '../../modules/CEF';
import {personageLoginData} from '../../../shared/login.state';
import NewPersonage from './NewPersonage';
import {CustomEventHandler} from '../../../shared/custom.event';
import {registerDebugPage} from '../../modules/dev.mode';


interface GetError {
    type: number,
    message: string
}
interface GetShow {
    type: number
}
const TYPE_HIDE           = 0,
      TYPE_REG            = 1,
      TYPE_LOGIN          = 2,
      TYPE_SELECT_CHARACTER          = 3, // вернуть
      TYPE_EMAIL            = 4,

      ERROR_LOGIN         = 1,
      ERROR_PASS          = 2,
      ERROR_REGLOGIN      = 3,
      ERROR_REGPASS       = 4,
      ERROR_REGREPEAT     = 5,
      ERROR_REGMAIL       = 6,

      ERROR_RESTORE       = 8,

      ERROR_PASS_NO_MATCH = 7,

      INPUT_TYPE_LOGIN    = 1,
      INPUT_TYPE_PASS     = 2,
      INPUT_TYPE_REGLOGIN = 3,
      INPUT_TYPE_REGPASS  = 4,
      INPUT_TYPE_REGREPEAT= 5,
      INPUT_TYPE_REGMAIL  = 6,
      INPUT_TYPE_RESTORE  = 7;

export default class NewAuth extends React.Component<{}, {
    show: boolean,
    type: number,
    login: string,
    pass: string,
    passType: boolean,
    reg_login: string,
    reg_pass: string,
    reg_repeat: string,
    reg_mail: string,
    restore: string,
    restoreCode?: string,
    openEye: number,
    login_error: string,
    pass_error: string,
    login_error_text: string,
    pass_error_text: string,
    login_error_anim: boolean,
    pass_error_anim: boolean,
    passType_before: boolean,
    reg_login_error: string,
    reg_pass_error: string,
    reg_login_error_text: string,
    reg_pass_error_text: string,
    reg_login_error_anim: boolean,
    reg_pass_error_anim: boolean,
    reg_repeat_error: string,
    reg_email_error: string,
    reg_repeat_error_text: string,
    reg_email_error_text: string,
    reg_repeat_error_anim: boolean,
    reg_email_error_anim: boolean,
    restore_error: string,
    restore_error_text: string,
    restore_error_anim:boolean,
    page_loading: boolean,
    characters: personageLoginData[],
    donate?:number;
}  > {
    loginGet: CustomEventHandler;
    constructor(props: any) {
        super(props);
        this.state = {
            show: true,
            type: CEF.gui.currentGui === "reg" ? 1 : 2,
            login: "",
            pass: "",
            passType: false,
            reg_login: "",
            reg_pass: "",
            reg_repeat: "",
            reg_mail: "",

            restore: "",
//            regPromo: null,
            openEye: -1,
            login_error: null,
            pass_error: null,
            login_error_text: null,
            pass_error_text: null,
            login_error_anim: false,
            pass_error_anim: false,
            passType_before: false,

            reg_login_error: null,
            reg_pass_error: null,
            reg_login_error_text: null,
            reg_pass_error_text: null,
            reg_login_error_anim: false,
            reg_pass_error_anim: false,

            reg_repeat_error: null,
            reg_email_error: null,
            reg_repeat_error_text: null,
            reg_email_error_text: null,
            reg_repeat_error_anim: false,
            reg_email_error_anim: false,

            restore_error: null,
            restore_error_text: null,
            restore_error_anim: false,

            page_loading:false,
            characters: null
        },

        this.loginGet = CustomEvent.register('auth:getLogin', (login: string) => {
            this.setState({ login })
        })

        registerDebugPage('Авторизация', 'login', () => {
            this.getShow(TYPE_LOGIN)
        })
        registerDebugPage('Регистрация', 'reg', () => {
            this.getShow(TYPE_REG)
        })
        registerDebugPage('Выбор персонажа', 'login', () => {
            this.getShow(TYPE_SELECT_CHARACTER)
        })

        // if(CEF.gui.currentGui === "reg"){
        //     CEF.playSound('registeronyx')
        // }

    }

    componentWillUnmount(){
        if (this.loginGet) this.loginGet.destroy();
    }

    getShow = ( type: number ) => { //Обновить показ
        if( type === TYPE_HIDE) {
            setTimeout( () =>  this.setState( { ...this.state, show: false } ), 1000);
            this.setState( { ...this.state, page_loading: false } );
        } else {
            this.setState( { ...this.state,show:true, type: type, page_loading: false }, () => {
                setTimeout( () =>  this.setState( { ...this.state, page_loading: true } ), 1000);
            } );
        }
        return;
    }
    sendData = ( type:number) => { // Отправить на сервер
        let is_retun:boolean = false;
        switch( type ) {
            case TYPE_EMAIL: {
                if (this.state.restore.length < 3) return this.getError(ERROR_RESTORE, "Укажите E-Mail"), CEF.playSound('errorClick');
                CustomEvent.callServer('account:restorePassword', this.state.restore).then(error => {
                    if(error) return this.getError(ERROR_RESTORE, error), CEF.playSound('errorClick');
                    this.setState({restoreCode: ""})
                })
                return;
            }
            case TYPE_LOGIN:{
                // login, pass
                if (this.state.login.length < 3) this.getError(ERROR_LOGIN, "Укажите логин"), is_retun = true;
                if (this.state.pass.length < 3) this.getError(ERROR_PASS, "Укажите пароль"), is_retun = true;
                if (is_retun) return CEF.playSound('errorClick');
                CustomEvent.callServer('server:user:account:login', this.state.login, this.state.pass).then((res: { status: boolean, text?: string, personages?: personageLoginData[], donate: number }) => {
                    if (!res.status) {
                        this.getError(ERROR_LOGIN, res.text)
                        CEF.playSound('errorClick')
                    } else {
                        // CEF.playSound('okLogin')
                        this.setState({ characters: res.personages, type: TYPE_SELECT_CHARACTER, donate: res.donate || 0 });
                        CEF.gui.saveLogin(this.state.login);
                    }
                });
                return;
            }
            case TYPE_REG: {
                if( this.state.reg_login.length < 3 ) this.getError( ERROR_REGLOGIN, "Укажите логин"), is_retun = true;
                if (this.state.reg_pass.length < 3) this.getError(ERROR_REGPASS, "Укажите пароль"), is_retun = true;
                if (this.state.reg_repeat.length < 3) this.getError(ERROR_REGREPEAT, "Повторите пароль"), is_retun = true;
                if (this.state.reg_pass !== this.state.reg_repeat) this.getError(ERROR_PASS_NO_MATCH, "Указанные пароли не совпадают"), is_retun = true;
                if( !this.state.reg_mail.match(/.+@.+\..+/i) )// !this.state.reg_mail.match(/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){1}\.[a-z]{2,3}$/gm) )
                    this.getError(ERROR_REGMAIL, "Email указан неверно"), is_retun = true;
                if (is_retun) return CEF.playSound('errorClick');
                CustomEvent.callServer('server:user:account:register', this.state.reg_login, this.state.reg_pass, this.state.reg_mail).then((res: { status: boolean, text: string }) => {
                    if (!res.status) {
                        this.getError(ERROR_REGLOGIN, res.text)
                        CEF.playSound('errorClick')
                    } else {
                        CEF.gui.saveLogin(this.state.reg_login);
                        // CEF.playSound('okLogin')
                        this.setState({ characters: [], type: TYPE_SELECT_CHARACTER });
                    }
                });

                return;
            }
        }
    }
    getError = ( type:number, message:string ):GetError => { // Получить ошибку
        switch( type ){
            case ERROR_RESTORE : {
                setTimeout( () =>  this.setState( { ...this.state, restore_error_text: message } ), 750);
                setTimeout( () =>  this.setState( { ...this.state, restore_error_anim: false } ), 1500);
                setTimeout( () =>  this.setState( { ...this.state, restore_error: this.state.restore, restore_error_anim: true } ), 0 );
                return;
            }
            case ERROR_LOGIN: {
                setTimeout( () =>  this.setState( { ...this.state, login_error_text: message } ), 1);
                setTimeout( () =>  this.setState( { ...this.state, login_error_anim: false } ), 1500);
                setTimeout( () =>  this.setState( { ...this.state, login_error: this.state.login, login_error_anim: true } ), 0 );
                return;
            }
            case ERROR_PASS: {
                setTimeout( () =>  this.setState( { ...this.state, pass_error_text: message, passType_before: this.state.passType, passType: true } ), 1);
                setTimeout( () =>  this.setState( { ...this.state, pass_error_anim: false } ), 1500);
                setTimeout( () =>  this.setState( { ...this.state, pass_error: this.state.pass, pass_error_anim: true } ), 0 );
                return;
            }
            case ERROR_REGLOGIN:{
                setTimeout( () =>  this.setState( { ...this.state, reg_login_error_text: message } ), 750);
                setTimeout( () =>  this.setState( { ...this.state, reg_login_error_anim: false } ), 1500);
                setTimeout( () =>  this.setState( { ...this.state, reg_login_error: this.state.reg_login, reg_login_error_anim: true } ), 0 );
                return;
            }
            case ERROR_REGPASS: {
                setTimeout( () =>  this.setState( { ...this.state, reg_pass_error_text: message} ), 750);
                setTimeout( () =>  this.setState( { ...this.state, reg_pass_error_anim: false } ), 1500);
                setTimeout( () =>  this.setState( { ...this.state, reg_pass_error: this.state.reg_pass, reg_pass_error_anim: true } ), 0);
                return;
            }
            case ERROR_REGREPEAT: {
                setTimeout( () =>  this.setState( { ...this.state, reg_repeat_error_text: message} ), 750);
                setTimeout( () =>  this.setState( { ...this.state, reg_repeat_error_anim: false } ), 1500);
                setTimeout( () =>  this.setState( { ...this.state, reg_repeat_error: this.state.reg_repeat, reg_repeat_error_anim: true } ), 0);
                return;
            }
            case ERROR_PASS_NO_MATCH: {
                setTimeout( () =>  this.setState( { ...this.state, reg_repeat_error_text: message, reg_pass_error_text: message } ), 750);
                setTimeout( () =>  this.setState( { ...this.state, reg_repeat_error_anim: false , reg_pass_error_anim: false } ), 1500);
                setTimeout( () =>  this.setState( { ...this.state, reg_pass_error: this.state.reg_pass, reg_repeat_error: this.state.reg_repeat, reg_repeat_error_anim: true , reg_pass_error_anim: true } ), 0 );
                return;
            }
            case ERROR_REGMAIL: {
                setTimeout( () =>  this.setState( { ...this.state, reg_email_error_text: message} ), 750);
                setTimeout( () =>  this.setState( { ...this.state, reg_email_error_anim: false } ), 1500);
                setTimeout( () =>  this.setState( { ...this.state, reg_email_error: this.state.reg_mail, reg_email_error_anim: true } ), 0 );
                return;
            }

        }
    }
    inputRestore = ( e:React.ChangeEvent<HTMLInputElement> ) => {
        if( this.state.restore_error_text != null) return this.setState( { ...this.state, restore_error: null, restore_error_text: null  } );
        if( e.target.value.length < 30 ) this.setState( { ...this.state, restore: e.target.value, restore_error: null, restore_error_text: null } );
    }
    inputRestoreCode = ( e:React.ChangeEvent<HTMLInputElement> ) => {
        if( this.state.restore_error_text != null) return this.setState( { ...this.state, restore_error: null, restore_error_text: null  } );
        if( e.target.value.length < 10 ) this.setState( { ...this.state, restoreCode: e.target.value, restore_error: null, restore_error_text: null } );
    }
    inputLogin = ( e:React.ChangeEvent<HTMLInputElement> ) => {
        if( this.state.login_error_text != null) return this.setState( { ...this.state, login_error: null, login_error_text: null  } );
        let validator = e.target.value.match(/^[a-zA-Z0-9_-]{0,24}$/i);
        if( validator) this.setState( { ...this.state, login: e.target.value, login_error:null } );
    }
    inputPass = ( e:React.ChangeEvent<HTMLInputElement> ) => {
        if( this.state.pass_error_text != null) return this.setState( { ...this.state, pass_error: null, pass_error_text: null  } );
        if( e.target.value.length < 24 ) this.setState( { ...this.state, pass: e.target.value, pass_error: null } );
    }

    inputRegLogin = ( e:React.ChangeEvent<HTMLInputElement> ) => {
        if( this.state.reg_login_error_text != null) return this.setState( { ...this.state, reg_login_error: null, reg_login_error_text: null } );
        let validator = e.target.value.match(/^[a-zA-Z0-9_-]{0,24}$/i);
        if( validator) this.setState( { ...this.state, reg_login: e.target.value, reg_login_error:null } );
    }
    inputRegPass = ( e:React.ChangeEvent<HTMLInputElement> ) => {
        if( this.state.reg_pass_error_text != null) return this.setState( { ...this.state, reg_pass_error: null, reg_pass_error_text: null } );
        if( e.target.value.length < 24 ) this.setState( { ...this.state, reg_pass: e.target.value, reg_pass_error: null , reg_repeat_error: null } );
    }
    inputRegRepeat = ( e:React.ChangeEvent<HTMLInputElement> ) => {
        if( this.state.reg_repeat_error_text != null) return this.setState( { ...this.state, reg_repeat_error: null, reg_repeat_error_text: null } );
        if( e.target.value.length < 24 ) this.setState( { ...this.state, reg_repeat: e.target.value, reg_pass_error: null, reg_repeat_error: null } );
    }
    inputRegEmail = ( e:React.ChangeEvent<HTMLInputElement> ) => {
        if( this.state.reg_email_error_text != null) return this.setState( { ...this.state, reg_email_error: null, reg_email_error_text: null  } );
        if( e.target.value.length < 70 ) this.setState( { ...this.state, reg_mail: e.target.value, reg_email_error: null, reg_email_error_text: null } );
    }

    gotoReg = ( type:number ) => {
        this.setState( { ...this.state, page_loading: false } );
        setTimeout( () =>  {
            this.setState({ ...this.state, type: type, page_loading: false }, () => {
                setTimeout(() => {
                    this.setState({ ...this.state, type: type, page_loading: true })
                }, 100)
            })
        }, 1000);
    }
    openPass = () => {
        setTimeout( () =>  this.setState( { ...this.state, passType: !this.state.passType } ), 400);
        this.setState( { ...this.state, openEye: this.state.openEye > 0 ? 0 : this.state.openEye+1 } );
    }
    clickInputBox = ( type:number ) => {
        switch( type )
        {
            case INPUT_TYPE_RESTORE : {

            }
            case INPUT_TYPE_LOGIN:
            {
                setTimeout( () =>  this.setState( { ...this.state, login_error_text: null } ), 750);
                setTimeout( () =>  this.setState( { ...this.state, login_error_anim: false } ), 1500);
                return this.setState( { ...this.state, login_error_anim: true  } );
            }
            case INPUT_TYPE_PASS: {
                setTimeout( () =>  this.setState( { ...this.state, pass_error_text: null, passType: this.state.passType_before } ), 750);
                setTimeout( () =>  this.setState( { ...this.state, pass_error_anim: false } ), 1500);
                return this.setState( { ...this.state, pass_error_anim: true  } );
            }
            case INPUT_TYPE_REGLOGIN:
            {
                setTimeout( () =>  this.setState( { ...this.state, reg_login_error_text: null } ), 750);
                setTimeout( () =>  this.setState( { ...this.state, reg_login_error_anim: false } ), 1500);
                return this.setState( { ...this.state, reg_login_error_anim: true  } );
            }
            case INPUT_TYPE_REGPASS:
            case INPUT_TYPE_REGREPEAT: {
                setTimeout( () =>  this.setState( { ...this.state, reg_pass_error_text: null, reg_repeat_error_text: null } ), 750);
                setTimeout( () =>  this.setState( { ...this.state, reg_pass_error_anim: false, reg_repeat_error_anim: false } ), 1500);
                return this.setState( { ...this.state, reg_pass_error_anim: true, reg_repeat_error_anim: true  } );
            }
            case INPUT_TYPE_REGMAIL: {
                setTimeout( () =>  this.setState( { ...this.state, reg_email_error_text: null } ), 750);
                setTimeout( () =>  this.setState( { ...this.state, reg_email_error_anim: false } ), 1500);
                return this.setState( { ...this.state, reg_email_error_anim: true  } );
            }
        }
    }
    componentDidMount = () => {
        this.setState( { ...this.state, page_loading: true  } );
    }
    render() {
        if( this.state.show === false ) return <></>;
        return <div className="auth_main">
            {this.state.type === TYPE_EMAIL ? <>
                <div className="uk-animation-fade">
                <div className={`auth_login ${this.state.page_loading ? "show": ""}`}>
                <div className="auth_restore_blur"/>
                    <div className="auth_box">
                        <div className="auth_form_box">
                            <div className="auth_form_logo">
                                    <img src={logo}/>
                            </div>
                            <h1>Восстановление</h1>
                            {typeof this.state.restoreCode !== "string" ? <>
                                <p>Введите ваш E-mail, мы пришлем вам новый пароль</p>
                                <div className={`auth_form_area ${this.state.restore_error !== null ? `auth_error`:``}`}>
                                    <p>Ваш E-Mail</p>
                                    <input onClick={ () => this.clickInputBox( INPUT_TYPE_RESTORE )}
                                            onKeyDown={e => {
                                                if (e.keyCode !== 13) return;
                                                e.preventDefault();
                                                this.sendData(TYPE_EMAIL)
                                            }}
                                           className={ this.state.restore_error_anim ?  "auth_show_err" : "" }
                                           type="text" value={this.state.restore !== null ? (  this.state.restore ) : ""}
                                           onChange={this.inputRestore}/>
                                </div>
                                <div className="auth_form_key" onClick={()=>this.sendData( TYPE_EMAIL )}>
                                    <p>Отправить код</p>
                                </div>
                            </> : <>
                                <p>Код подтверждения, отправленный на Ваш E-mail</p>
                                <div className={`auth_form_area ${this.state.restore_error !== null ? `auth_error`:``}`}>
                                    <p>Код подтверждения</p>
                                    <input onClick={ () => this.clickInputBox( INPUT_TYPE_RESTORE )}
                                                onKeyDown={e => {
                                                    if(e.keyCode !== 13) return;
                                                    e.preventDefault()
                                                    if (this.state.restoreCode.length < 4) return this.setState({ restoreCode: null });
                                                    CustomEvent.callServer('account:verifyRestore', this.state.restore, this.state.restoreCode).then(err => {
                                                        if (!err) return this.gotoReg(TYPE_LOGIN)
                                                        this.getError(ERROR_RESTORE, err);
                                                    })
                                                }}
                                           className={ this.state.restore_error_anim ?  "auth_show_err" : "" }
                                           type="text" value={this.state.restoreCode !== null ? (  this.state.restoreCode ) : ""}
                                           onChange={this.inputRestoreCode}/>
                                </div>
                                <div className="auth_form_key" onClick={(e)=>{
                                    e.preventDefault()
                                    if(this.state.restoreCode.length < 4) return this.setState({restoreCode: null});
                                    CustomEvent.callServer('account:verifyRestore', this.state.restore, this.state.restoreCode).then(err => {
                                        if(!err) return this.gotoReg(TYPE_LOGIN)
                                        this.getError(ERROR_RESTORE, err);
                                    })
                                }}>
                                    <p>Подтвердить</p>
                                </div>
                            </>}
                            { (this.state.restore_error !== null ) ?
                                <div className="auth_error_box">
                                    <p>Ошибка</p>
                                    <p>{this.state.restore_error_text}</p>
                                </div> : <div className="auth_error_null"/> }
                            <div className="auth_down">
                                <div className="auth_goto_reg" onClick={() => this.gotoReg( TYPE_LOGIN )}>Назад к авторизации</div>
                            </div>

                        </div>
                    </div>
                </div>
                </div>
            </>:null}
            {this.state.type === TYPE_LOGIN ? <>
                <div className="uk-animation-fade">
                <div className={`auth_login ${this.state.page_loading ? "show": ""}`}>
                <div className="auth_login_blur"/>
                    <div className="auth_box">
                        <div className="auth_form_box">
                            <div className="auth_form_logo">
                                    <img src={logo}/>
                            </div>
                            <div className="auth_form_textlogo">
                                <img src={logotext} />
                            </div>
                            <h1>Авторизация</h1>
                            <p>Войдите для того, чтобы начать игру</p>
                            <div className={`auth_form_area ${this.state.login_error !== null ? `auth_error`:``}`}>
                                <p>Логин</p>
                                <input onClick={ () => this.clickInputBox( INPUT_TYPE_LOGIN )}
                                        onKeyDown={e => {
                                            if (e.keyCode === 13) {
                                                e.preventDefault();
                                                this.sendData(TYPE_LOGIN)
                                            }
                                        }}
                                       className={ this.state.login_error_anim ?  "auth_show_err" : "" }
//                                       type="text" value={this.state.login !== null ? ( this.state.login_error_text ? this.state.login_error_text: this.state.login ) : ""}
                                        type="text" value={this.state.login !== null ? ( this.state.login ) : ""}
                                        // autoFocus={this.state.login !== "" ? false : true}
                                        onChange={this.inputLogin}/>
                            </div>
                            <div className={`auth_form_area ${this.state.pass_error !== null  ? `auth_error`:``}`}>
                                <div className="auth_pass_area">
                                    <div>
                                        <p>Пароль</p>
                                        <input onClick={ () => this.clickInputBox( INPUT_TYPE_PASS )}
                                        onKeyDown={e => {
                                            if(e.keyCode === 13){
                                                e.preventDefault();
                                                this.sendData(TYPE_LOGIN)
                                            }
                                        }}
                                               type={ this.state.passType === false ? "password" : "text" }
                                               className={ this.state.pass_error_anim ?  "auth_show_err" : "" }
                                               value={this.state.pass !== null ? ( this.state.pass ) : ""}
                                               autoFocus={this.state.login !== "" ? true : false}
//                                               value={this.state.pass !== null ? ( this.state.pass_error_text ? this.state.pass_error_text:  this.state.pass ) : ""}
                                               onChange={this.inputPass}/>
                                    </div>
                                    <img className={this.state.openEye != -1 ? ( this.state.openEye ? "auth_eye_open":"auth_eye_close") : ""}
                                         src={ (this.state.pass_error_text ? this.state.passType_before :this.state.passType) === false ? colse_eye : eye}
                                         onClick={this.openPass}/>
                                </div>
                            </div>
                            <div className="auth_form_key" onClick={()=>this.sendData( TYPE_LOGIN )}>
                                <p>Играть</p>
                            </div>
                            { (this.state.login_error !== null || this.state.pass_error !== null ) ?
                                <div className="auth_error_box">
                                    <p>Ошибка</p>
                                    <p>{this.state.login_error_text}</p>
                                    <p>{this.state.pass_error_text}</p>
                                </div> : <div className="auth_error_null"/> }
                            <div className="auth_down">
                                <div className="auth_goto_reg" onClick={() => this.gotoReg( TYPE_REG )}>Регистрация</div>
                                <div className="auth_goto_rest" onClick={() => this.gotoReg( TYPE_EMAIL )}>Восстановление</div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                </>
                : <></>}
            {this.state.type === TYPE_REG ? <>
                <div className={`auth_reg ${this.state.page_loading ? "show" : ""}`}>
                <div className="auth_reg_blur" />
                    <div className="auth_box">
                        <div className="auth_form_box">
                            <div className="auth_form_logo">
                                <img src={logo} />
                            </div>
                            <div className="auth_form_textlogo">
                                <img src={logotext} />
                            </div>
                            <h1>Регистрация</h1>
                            <p>Зарегистрируйтесь, чтобы начать игру</p>
                            <div className={`auth_form_area ${this.state.reg_login_error !== null ? `auth_error` : ``}`}>
                                <p>Логин</p>
                                <input onClick={() => this.clickInputBox(INPUT_TYPE_REGLOGIN)}
    className={this.state.reg_login_error_anim ? "auth_show_err" : ""}
    type="text" value={this.state.reg_login !== null ? ( this.state.reg_login) : ""}
    onChange={this.inputRegLogin}/>
                            </div>
                            <div className={`auth_form_area ${this.state.reg_pass_error !== null ? `auth_error` : ``}`}>
                                <p>Пароль</p>
                                <input onClick={() => this.clickInputBox(INPUT_TYPE_REGPASS)}
    className={this.state.reg_pass_error_anim ? "auth_show_err" : ""}
//    type={this.state.reg_pass_error_text ? "text" : "password"}
    type={ "password"}
    value={this.state.reg_pass !== null ? ( this.state.reg_pass) : ""}
    onChange={this.inputRegPass}/>
                            </div>
                            <div className={`auth_form_area ${this.state.reg_repeat_error !== null ? `auth_error` : ``}`}>
                                <p>Повторите пароль</p>
                                <input onClick={() => this.clickInputBox(INPUT_TYPE_REGREPEAT)}
    className={this.state.reg_repeat_error_anim ? "auth_show_err" : ""}
    type={ "password"}
//    type={this.state.reg_repeat_error_text ? "text" : "password"}
    value={this.state.reg_repeat !== null ? ( this.state.reg_repeat) : ""}
    onChange={this.inputRegRepeat}/>
                            </div>
                            <div className={`auth_form_area ${this.state.reg_email_error !== null ? `auth_error` : ``}`}>
                                <p>Ваш E-mail</p>
                                <input onClick={() => this.clickInputBox(INPUT_TYPE_REGMAIL)}
    className={this.state.reg_email_error_anim ? "auth_show_err" : ""}
    type="text" value={this.state.reg_mail !== null ? ( this.state.reg_mail) : ""}
    onChange={this.inputRegEmail}/>
                            </div>

                            <div className="auth_form_key" onClick={() => this.sendData(TYPE_REG)}>
                                <p>Зарегистрироваться</p>
                            </div>
                            { (this.state.reg_login_error !== null || this.state.reg_pass_error !== null || this.state.reg_email_error !== null ) ?
                                <div className="auth_error_box">
                                    <p>Ошибка</p>
                                    <p>{this.state.reg_login_error_text}</p>
                                    <p>{this.state.reg_pass_error_text}</p>
                                    <p>{this.state.reg_email_error_text}</p>
                                </div> : <div className="auth_error_null"/> }
                            <div className="auth_down">
                                <div className="auth_goto_login" onClick={() => this.gotoReg(TYPE_LOGIN)}>Назад к авторизации</div>
                            </div>

                        </div>
                    </div>
                </div>
            </> : <></>}
            {this.state.type === TYPE_SELECT_CHARACTER ? <>
                <NewPersonage data={this.state.characters} donate={this.state.donate} />
            </>
                : <></>}
            </div>
    }
}

import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import './style.less'
import png from './assets/*.png';
import svg from './assets/svg/*.svg';
import {CEF} from "../../modules/CEF";
import {CustomEventHandler} from "../../../shared/custom.event";
import {PayBox} from '../PayBox/PayBox';
import check from './../ClothShop/assets/check.svg';
import {FamilyReputationType} from "../../../shared/family";
import {systemUtil} from "../../../shared/system";
import coin from '../UserMenu/assets/svg/player-stop-white.svg';

export class CreateFamily extends Component<{}, {
    show: boolean,
    /** Цена коины, вирты */
    price: [number, number],
    inputName: string,
    inputType: number,
    showPay: boolean,
    succ?: boolean
}> {
    private ev: CustomEventHandler;
    _child: React.RefObject<PayBox>;
    constructor(props: any) {
        super(props);
        this.state = {
            show: true,
            price: [2999, 1500000],
            inputName: '',
            inputType: 0,
            showPay: false,
            succ: false
        }
        this.ev = CustomEvent.register('family:showcreate', (price:[number,number]) => {
            this.setState({
                price, 
                show:true, 
            });
        })
        this._child = React.createRef<PayBox>();     
    }
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }
    componentWillUnmount(){
        if(this.ev) this.ev.destroy();
        document.removeEventListener('keydown', this.handleKeyDown);
    }
    handleKeyDown(e:any){
        switch( e.keyCode ) {
            case 27: {
                if(this.state.showPay && this.state.showPay === true ) 
                    this.setState({showPay:false});
                else {
                    this.setState({show:false});
                    CEF.gui.setGui(null);
                }
                return;
            }
        }
    }
    create = () => {
        console.log(this)
        if( this.state.inputName.length < 1 ) return;
        let result = this.state.inputType === 0 ? {paytype: 150, pin: ""} : this._child.current.canPay(this.state.price[1]);
        if (!result) return;
        CustomEvent.callServer('family:create', this.state.inputName, result.paytype, result.pin).then(answer => {
            if(answer) this.setState({succ:true});
            else CEF.gui.setGui(null)
        });
    }

    render() {
        if(!this.state.show) return <></>;
        return <>
                {this.state.succ === true ?
                    <section className="family-create-wrapper success" style={{background: `url(${png['create-bg']}) no-repeat center center`, backgroundSize: 'cover'}}>
                        <h2 className="title-main large"><span className="thin">Семья</span> {this.state.inputName} <span className="thin">создана</span></h2>
                        <p className="desc-main">Управлять семьей вы можете через планшет</p>
                        <div className="fc-create-succes-info">
                            <div>
                                <i><img src={svg['man+']} alt=""/></i>
                                <p>Теперь Вы можете пригласить людей в свою семью</p>
                            </div>
                            <div>
                                <i><img src={svg['flag']} alt=""/></i>
                                <p>Выполнять специальные задания и соревноваться с другими семьями</p>
                            </div>
                            <div>
                                <i><img src={svg['home']} alt=""/></i>
                                <p>Уже сейчас можете приобрести квартиру для своей семьи</p>
                            </div>
                            <div>
                                <i><img src={svg['up']} alt=""/></i>
                                <p>В планшете вы можете улучшить свою семью</p>
                            </div>
                        </div>
                        <div className="form-create-family">
                            <button className="main-but" onClick={()=>{
                                this.setState({show:false});
                                CEF.gui.setGui(null);
                            }}>
                                <p>Закрыть</p>
                            </button>
                        </div>
                    </section> 
                    :
                    <section className="family-create-wrapper" style={{background: `url(${png['create-bg']}) no-repeat center center`, backgroundSize: 'cover'}}>
                        { this.state.showPay && this.state.showPay === true ?
                        <>
                            <div className="family_blur" />
                            <div className="family_paybox">
                                <div className="family_paybox_box">
                                    <PayBox ref={this._child} />
                                    <div className="family_buy" onClick={this.create} >
                                        <img src={check}/>Оплатить
                                    </div>
                                </div>
                            </div>
                        </>
                        : null }
                        <h2 className="title-main large">Создание <span className="thin">{'семьи'}</span></h2>
                        <p className="desc-main">Для вас открываются новые возможности</p>
                        <div className="fc-wows">
                            <div>
                                <img src={png['create-1']} alt=""/>
                                <p>Семейный<br /><span>автопарк</span></p>
                            </div>
                            <div>
                                <img src={png['create-2']} alt=""/>
                                <p>Индивидуальные<br /><span>особняки</span></p>
                            </div>
                            <div>
                                <img src={png['create-3']} alt=""/>
                                <p>Обычные и особые<br /><span>задания</span></p>
                            </div>
                            <div>
                                <img src={png['create-5']} alt=""/>
                                    <p>Создание<br /><span>семьи</span></p>
                            </div>
                        </div>
                        <div className="form-create-family">
                            <div className="fc-enter-cash">
                                <input type="radio" className={`checkbox${this.state.inputType === 0 ? ' checked':''}`} name="createFamily" id="createFamilyCoins" required 
                                        onClick={()=> { this.setState({ inputType: 0 })}}/>
                                <label htmlFor="createFamilyCoins">
                                    <div className="money-info">
                                        <p><small>За коины</small></p>
                                        <p><img src={coin} alt=""/><strong>{systemUtil.numberFormat(this.state.price[0])}</strong></p>
                                    </div>
                                </label>
                                <input type="radio" className={`checkbox${this.state.inputType === 1 ? ' checked':''}`} name="createFamily" id="createFamilyVirt"
                                       onClick={()=> { console.log('test'); this.setState({ inputType: 1 })}}/>
                                <label htmlFor="createFamilyVirt">
                                    <div className="money-info">
                                        <p><small>За игровую валюту</small></p>
                                        <p><strong>${systemUtil.numberFormat(this.state.price[1])}</strong></p>
                                    </div>
                                </label>
                            </div>
                            <div className="input-wrap-all input-labelin input-centered w100">
                                <p>Название</p>
                                <input type="text" placeholder={'название вашей семьи'}
                                        value={this.state.inputName}
                                       onChange={(e:any)=> { 
                                            if( e.target.value.match(/^[a-zA-Z_-]{0,15}$/i) )
                                                this.setState({ inputName:e.target.value })
                                        }}/>
                            </div>
                            <button className="main-but" onClick={()=> { 
                                    if( this.state.inputName.length < 1 ) return; 
                                    return this.state.inputType === 0 ? this.create(): this.setState({showPay:true})
                                }}>
                                <p>{'Создать семью'}</p>
                            </button>
                        </div>

                    </section>
                }
            </>
    }
}

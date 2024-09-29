import React, {Component} from 'react';

import {CEF} from '../../modules/CEF';

//@ts-ignore
import SignaturePad from 'react-signature-pad';

import firstBackground from "./assets/firstBackground.png";
import secondBackground from "./assets/secondBackground.png";
import exitIcon from "./assets/exitIcon.svg";
import marriageBody2 from "./assets/marriageBody2.png";
import marriageBody1 from "./assets/marriageBody1.png";
import marriageBody3 from "./assets/marriageBody3.png";
import marriageBody4 from "./assets/marriageBody4.png";

import "./Marriage.less";
import "./ExitButton.less"
import {CustomEvent} from "../../modules/custom.event";
import {system} from "../../modules/system";
import {DivorceType, Person, WEEDING_PAY} from "../../../shared/wedding";

type Window = 'AcceptFrame' | 'InfoFrame' | 'SignFrame' | 'Welcome' | 'Divorce' | 'Select';

export class Marriage extends Component<{}, {
    show: boolean
    component: Window
    firstPerson: [string, string, number]
    secondPerson: [string, string, number]
    partners: Person[]
    userIsMale: boolean
}> {
    constructor(props: any) {
        super(props);

        this.state = {
            show: CEF.test,
            userIsMale: false,
            component: "Select",
            firstPerson: ["Kevin", "Mackalister", 0],
            secondPerson: ["Johny", "Bravissimo", 0],
            partners: [
                {
                    name: "Vadim Vadim",
                    staticID: 228
                },

                {
                    name: "Matvey Matvey",
                    staticID: 1337
                },

                {
                    name: "Mansur Mansur",
                    staticID: 7777
                }
            ]
        }

        CustomEvent.register('marriage:set', (
            window?: Window,
            partners?: Person[],
            firstPerson?: [string ,string, number],
            secondPerson?: [string, string, number]
        ) => {
            if (window) {
                this.changeWindow(window);
            }

            if (partners) {
                this.setState({
                    partners
                });
            }

            if (firstPerson) {
                this.setState({
                    firstPerson
                });
            }

            if (secondPerson) {
                this.setState({
                    secondPerson
                });
            }
        });
    }

    close() {
        CustomEvent.triggerServer('marriage::closeMenu');
    }

    acceptMarriageOffer() {
        CustomEvent.triggerServer('marriage::accept');
    }

    declineMarriageOffer() {
        CustomEvent.triggerServer('marriage::decline');
    }

    async dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
        const res: Response = await fetch(dataUrl);
        const blob: Blob = await res.blob();
        return new File([blob], fileName, { type: 'image/png' });
    }

    confirmSign() {
        if ((this.refs.mySignature as any).isEmpty()) {
            return CEF.alert.setAlert('error', 'Распишитесь!');
        }

        const result = (this.refs.mySignature as any).toDataURL();
        if (result.length > 35000) {
            return CEF.alert.setAlert('error', 'Слишком большая подпись');
        }

        this.dataUrlToFile(result, 'file.png').then(d => {
            CEF.saveSignature(d, 'marriagesign_' + CEF.id).then(status => {
                CustomEvent.triggerServer('marriage::confirmSign');
            })
        })
    }

    getSignatureUrl(id: number) {
        return CEF.getSignatureURL('marriagesign_' + id);
    }

    changeWindow(window: Window) {
        this.setState({
            component: window
        })
    }

    divorce(divorceType: DivorceType) {
        CustomEvent.triggerServer('marriage::divorce', divorceType);
    }

    updatePartners(partners: Person[]) {
        this.setState({...this.state, partners});
    }

    componentDidMount() {
        CEF.user.getIsMale()
            .then(isMale => {
                this.setState({
                    userIsMale: isMale
                })
            });

        if (this.state.component === 'SignFrame') {
            (this.refs.mySignature as any).minWidth = 0.8;//*Math.max((window as any).devicePixelRatio || 1, 1);
            (this.refs.mySignature as any).maxWidth = 2;//*Math.max((window as any).devicePixelRatio || 1, 1);
            (this.refs.mySignature as any).onBegin = () => {
                (this.refs.mySignature as any).clear();
            }
        }
    }

    render() {
        return <div className='marriage'>
            <img className="marriage__left-background" src={firstBackground} alt="#"/>
            <img className="marriage__right-background" src={secondBackground} alt="#"/>
            <div className="exit" onClick={() => this.close()}>
                <div className="exit-icon">
                    <img src={exitIcon} alt="#"/>
                </div>
                <div className="exit__title">
                    Закрыть
                </div>
            </div>

            {this.state.component === "AcceptFrame" ?

                <div className="marriage-body marriage-body__second">
                    <img src={marriageBody2} className="marriage-body__background2" alt="#"/>
                    <div className="marriage-body-content">
                        <h1>
                            {this.state.firstPerson[0]}
                            <br/>
                            {this.state.firstPerson[1]}
                        </h1>
                        <span>
                        Делает вам предложение руки и сердца
                    </span>
                        <div className="marriage-body-content__secondName">
                            {this.state.firstPerson[1]}
                        </div>
                        <div className="marriage-body-content-buttons">
                            <div className="marriage-body-content-buttons__body marriage-body-content-buttons-green"
                                 onClick={() => this.acceptMarriageOffer()}>
                                ПРИНЯТЬ
                            </div>
                            <div className="marriage-body-content-buttons__body"
                                 onClick={() => this.declineMarriageOffer()}>
                                ОТКЛОНИТЬ
                            </div>
                        </div>
                    </div>
                </div>
                : ""
            }

            {this.state.component === "InfoFrame" ?

                <div className="marriage-body marriage-body__first">

                    <img src={marriageBody1} className="marriage-body__background1" alt="#"/>

                    <div className="marriage-body-content">
                    <span className="marriage-body-content__text">
                        Брачный <br/> контракт
                    </span>
                        <div className="marriage-body-content-names">
                    <span className="marriage-body-content-names__leftName">
                        {this.state.firstPerson[0]} <br/> {this.state.firstPerson[1]}
                    </span>
                            &
                            <span className="marriage-body-content-names__rightName">
                    {this.state.secondPerson[0]} <br/> {this.state.secondPerson[1]}
                    </span>
                        </div>
                        <div className="marriage-body-content-painting">
                            <img src={this.getSignatureUrl(this.state.firstPerson[2])} alt="#"/>
                            <div className="marriage-body-content-painting__title">Росписи</div>
                            <img src={this.getSignatureUrl(this.state.secondPerson[2])} alt="#"/>
                        </div>
                        <span className="marriage-body-content__text">
                    Официально помолвлены
                    </span>
                    </div>
                </div>
                : ""
            }

            {this.state.component === "SignFrame" ?

                <div className="marriage-body marriage-body__third">
                    <img src={marriageBody2} className="marriage-body__background2" alt="#"/>
                    <div className="marriage-body-content">
                        <h1>
                            Распишитесь
                        </h1>
                        <div className="marriage-body-content-signature">
                            <SignaturePad ref="mySignature" />
                        </div>
                        <div className="marriage-body-content-buttons">
                            <div className="marriage-body-content-buttons__body marriage-body-content-buttons-green"
                                 onClick={() => this.confirmSign()}>
                                СОХРАНИТЬ
                            </div>
                        </div>
                    </div>
                </div>
                : ""
            }

            {this.state.component === "Welcome" ? <div className="marriage-body marriage-body__second">
                    <img src={marriageBody2} className="marriage-body__background3" alt="#"/>
                    <div className="marriage-body-content">
                        <h1>Центр<br/>регистрации брака</h1>
                        <span className="marriage-body-content__text">Хотите узаконить ваш брак?</span>
                        <div className="marriage-body-content-buttons" onClick={() => this.changeWindow('Select')}>
                            <div className="marriage-body-content-buttons__body">
                                { this.state.userIsMale ? 'ПОЖЕНИТЬСЯ' : 'ВЫЙТИ ЗАМУЖ' }
                            </div>
                        </div>
                    </div>
                </div>
                : ""
            }

            {
                this.state.component === "Divorce" ? <div className="marriage-body marriage-body__second">

                    <img src={marriageBody2} className="marriage-body__background3" alt="#"/>

                    <div className="marriage-body-content">
                        <h1>Расторжение<br/>брака </h1>

                        <div className="marriage-body-content-buttons marriage-body-content-divorce">
                            <div className="marriage-body-content-buttons">
                                <span>
                                    Желаете расторгнуть брак по согласию?
                                </span>
                                <div className="marriage-body-content-buttons__body" onClick={() => this.divorce('consent')}>
                                    ПО СОГЛАСИЮ
                                </div>
                            </div>
                            <div className="marriage-body-content-buttons">
                               <span>
                                   Или расторгнуть брак без соглашения за <span>{system.numberFormat(WEEDING_PAY)}</span>?
                               </span>
                                <div className="marriage-body-content-buttons__body" onClick={() => this.divorce('money')}>
                                    БЕЗ СОГЛАСИЯ
                                </div>
                            </div>
                        </div>
                    </div>

                </div> : ""
            }

            {
                this.state.component === "Select" ? <div className="marriage-body marriage-body__second">

                    <img src={marriageBody4} className="marriage-body__background4" alt="#"/>

                    <div className="marriage-body-content">
                        <h1>Выберите<br/>партнера</h1>

                        <div className="marriage-body-content-list">

                            {
                                this.state.partners.map((el, key) => {
                                    return <div key={key} onClick={() => {
                                        CustomEvent.triggerServer('marriage::sendOffer', el.staticID);
                                    }}>
                                        <h3>{ el.name }</h3>
                                        <span>{ el.staticID }</span>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div> : ""
            }
        </div>
    }
}
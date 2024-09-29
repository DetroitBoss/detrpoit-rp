import React, {Component} from "react";
import "./style.less";

import fleeca from "./assets/fleeca.svg";
import lines from "./assets/lines.svg";
import cardBlack from "./assets/cardBlack.png";
import cardPlatinum from "./assets/cardPlatinum.png";
import cardGold from "./assets/cardGold.png";
import cardIcon from "./assets/cardIcon.png";
import point from "./assets/point.svg";
import sharpIcon from "./assets/sharpIcon.svg";
import starIcon from "./assets/starIcon.svg";
import minus from "./assets/minus.svg";
import plus from "./assets/plus.svg";
import walletIcon from "./assets/walletIcon.svg";
import houseIcon from "./assets/houseIcon.svg";
import carIcon from "./assets/carIcon.svg";
import doubleHouseIcon from "./assets/doubleHouseIcon.svg";
import doubleCarIcon from "./assets/doubleCarIcon.svg";
import businessIcon from "./assets/businessIcon.svg";
import exitIcon from "../NumberPlate/assets/images/exitIcon.svg";
import {CEF} from '../../modules/CEF';
import {CustomEvent} from '../../modules/custom.event';
import {CustomEventHandler} from '../../../shared/custom.event';
import {newBankCardCost, REMOVAL_BANK_MONEY_PERCENT} from '../../../shared/economy';
import {systemUtil} from '../../../shared/system';
import {BankTax, BankTaxes} from '../../../shared/atm';

interface Rate {
    amount: number,
    name: string,
    benefits: string[]
}

let eventHandler: CustomEventHandler;
let updateEventHandler: CustomEventHandler;
let updateCardEventHandler: CustomEventHandler;

type taxesCategory = "houses" | "businesses" | "warehouse"

export class Bank extends Component<{}, {
    bankId: number,
    component: "operations" | "settings" | "taxes" | "rate",
    accountNumber: string,
    balance: number,
    cash: number,
    rate: number,
    isCashOut: boolean,
    showMax: boolean,
    activeBtnOperation: boolean,
    commission: number,
    totalAmount: number,
    refOperationAmount: React.RefObject<any>,
    refOperationCode: React.RefObject<any>,
    taxes: BankTaxes,
    taxesCat: taxesCategory,
    rates: Rate[],
    chooseRate: number,
    settingsComponent: "changeCode" | "orderCard" | "closeAccount",
    refOldCode: React.RefObject<any>,
    refNewCode: React.RefObject<any>
    refChangePin: React.RefObject<any>
}> {

    private getTaxName(cat: taxesCategory): string {
        switch (cat) {
            case 'houses':
                return 'Дома'
            case 'businesses':
                return 'Бизнес'
            case 'warehouse':
                return 'Склад'
        }
    }

    maxAmount: number = 99999999;

    constructor(props: any) {
        super(props);

        this.state = {
            bankId: 0,
            component: "operations",
            accountNumber: "123123",
            balance: 540000,
            cash: 800000,
            rate: 1,
            isCashOut: false,
            showMax: false,
            activeBtnOperation: false,
            commission: 0,
            totalAmount: 0,
            refOperationAmount: React.createRef(),
            refOperationCode: React.createRef(),
            taxes: {
                houses: [
                    {
                        id: 0,
                        name: "Наименование дома",
                        address: "3517 W. Gray St. Utica, Pennsylvania 57867",
                        taxAmountLeft: 21000,
                        maxTaxAmount: 30000,
                    },
                    {
                        id: 0,
                        name: "Наименование дома",
                        address: "3517 W. Gray St. Utica, Pennsylvania 57867",
                        taxAmountLeft: 21000,
                        maxTaxAmount: 30000,
                    },
                    {
                        id: 0,
                        name: "Наименование дома",
                        address: "3517 W. Gray St. Utica, Pennsylvania 57867",
                        taxAmountLeft: 21000,
                        maxTaxAmount: 30000,
                    },
                    {
                        id: 0,
                        name: "Наименование дома",
                        address: "3517 W. Gray St. Utica, Pennsylvania 57867",
                        taxAmountLeft: 21000,
                        maxTaxAmount: 30000,
                    }
                ],
                businesses: [],
                warehouse: []
            },
            taxesCat: "houses",
            rates: [
                {
                    name: "Debit",
                    amount: 1000,
                    benefits: [
                        "Макс. баланс 10000000",
                        //"Блатная карта",
                        //"Она чёрная"
                    ]
                },
                {
                    name: "Gold",
                    amount: 20000,
                    benefits: [
                        "Макс. баланс 100000000",
                        //"Блатная карта",
                        //"Она чёрная"
                    ]
                },
                {
                    name: "Platinum",
                    amount: 50000,
                    benefits: [
                        "Макс. баланс 500000000",
                        //"Блатная карта",
                        //"Она чёрная"
                    ]
                },
            ],
            chooseRate: 0,
            settingsComponent: "changeCode",
            refNewCode: React.createRef(),
            refOldCode: React.createRef(),
            refChangePin: React.createRef()
        }

        updateEventHandler = CustomEvent.register('bank:updateTax',
            (taxId: number, taxCategory: taxesCategory) => {
                const taxes = this.state.taxes;
                taxes[taxCategory].splice(this.state.taxes[taxCategory].findIndex(el => el.id === taxId), 1)
                this.setState({
                    ...this.state,
                    taxes: taxes
                })
            })

        updateCardEventHandler = CustomEvent.register('bank:updateCard',
            (cardRate: number) => {
                this.setState({
                    ...this.state,
                    rate: cardRate
                })
            })

        eventHandler = CustomEvent.register('bank:loadData',
            (bankId: number, rateId: number, cardNumber: string, taxes: BankTaxes) => {
                this.setState({
                    bankId,
                    rate: rateId,
                    accountNumber: cardNumber,
                    taxes
                })
            })
    }

    public componentWillUnmount() {
        if (eventHandler) eventHandler.destroy();
    }

    exit(): void {
        CEF.gui.setGui(null)
    }

    payAllTaxesForCat(): void {
        this.state.taxes[this.state.taxesCat].map(tax => {
            CustomEvent.triggerServer('bank:payTax', tax.id, this.state.taxesCat)
        })
    }

    payForItem(id: number): void {
        CustomEvent.triggerServer('bank:payTax', id, this.state.taxesCat)
    }

    changeRate(): void {
        if (this.state.chooseRate <= this.state.rate) return;
        const index: number = this.state.chooseRate;
        CustomEvent.triggerServer('bank:changeCard', index)
    }

    async onClickChangeCode(): Promise<void> {
        const old = this.state.refOldCode.current.value,
            newer = this.state.refNewCode.current.value;
        CustomEvent.triggerServer('atm:changePin', this.state.accountNumber, old, newer)
    }

    async orderCard(): Promise<void> {
        CustomEvent.triggerServer('bank:reissue', this.state.refChangePin.current.value)
    }

    closeAccount(): void {
        CustomEvent.triggerServer('bank:closeCard')
    }

    setComponent(component: "operations" | "settings" | "taxes" | "rate"): void {
        this.setState({...this.state, component})
    }

    setIsCashOut(toggle: boolean): void {
        if (this.state.isCashOut === toggle) return;
        this.state.refOperationAmount.current.value = ''
        this.setState({...this.state, isCashOut: toggle, totalAmount: 0})
    }

    getTotalAmountForCat(cat: taxesCategory): number {
        let blockTaxes = this.state.taxes[cat],
            amount = 0;

        blockTaxes.forEach(el => {
            amount += el.maxTaxAmount - el.taxAmountLeft;
        });

        if (amount < 0) return 0;
        return amount;
    }

    setTaxesCat(taxesCat: taxesCategory): void {
        this.setState({...this.state, taxesCat});
    }

    onChangeOperation(isAmount: boolean): void {
        let amount = Number(this.state.refOperationAmount.current.value),
            code = this.state.refOperationCode.current.value;

        if (code.length > 4) this.state.refOperationCode.current.value = code.substr(0, 4);
        if (/[^0-9.]/g.test(code)) this.state.refOperationCode.current.value = this.state.refOperationCode.current.value.replaceAll(/[^0-9.]/g, '')

        if (amount > this.maxAmount) {
            return this.setState({
                ...this.state,
                commission: 0,
                totalAmount: 0,
                activeBtnOperation: false,
                showMax: true
            });
        }

        let obj: any = {};

        if (amount <= this.maxAmount && this.state.showMax) obj.showMax = false;

        if (isAmount) {
            obj.commission = this.state.isCashOut ? Math.round(amount / 100) : 0;
            obj.totalAmount = amount + obj.commission;
        }

        obj.activeBtnOperation = !this.state.showMax && !obj.showMax && code.length === 4 && amount !== 0;

        this.setState({...this.state, ...obj});
    }

    setChooseRate(toggle: boolean): void {
        let chooseRate: number = this.state.chooseRate;
        if (toggle) {
            if (this.state.chooseRate === this.state.rates.length - 1) return;
            chooseRate += 1;
        } else {
            if (this.state.chooseRate === 0) return;
            chooseRate -= 1;
        }

        this.setState({...this.state, chooseRate})
    }


    getTransform(): string {
        switch (this.state.chooseRate) {
            case 0:
                return "bank-card0";
            case 1:
                return "";
            case 2:
                return "bank-card2";
            default:
                return "";
        }
    }

    setSettingsComponent(settingsComponent: "changeCode" | "orderCard" | "closeAccount"): void {
        this.setState({...this.state, settingsComponent});
    }

    onChangeCode(isOld: boolean): void {
        const old = this.state.refOldCode.current.value,
            newer = this.state.refNewCode.current.value;

        if (isOld) {
            if (old.length > 4) this.state.refOldCode.current.value = old.substr(0, 4);
            if (/[^0-9.]/g.test(old)) this.state.refOldCode.current.value = this.state.refOldCode.current.value.replaceAll(/[^0-9.]/g, '')
        } else {
            if (newer.length > 4) this.state.refNewCode.current.value = old.substr(0, 4);
            if (/[^0-9.]/g.test(newer)) this.state.refNewCode.current.value = this.state.refNewCode.current.value.replaceAll(/[^0-9.]/g, '')
        }
    }

    getCardStyle(): string {
        switch (this.state.rate) {
            case 0: {
                return cardBlack;
            }
            case 1: {
                return cardGold;
            }
            case 2: {
                return cardPlatinum
            }
            default: {
                return cardBlack;
            }
        }
    }


    render() {
        return <div className="bank">
            <img src={fleeca} className="bank__fleecaImg" alt=""/>
            <img src={lines} className="bank__linesImg" alt=""/>

            <div className="exit" onClick={() => this.exit()}>
                <div className="exit-icon">
                    <img src={exitIcon} alt="#"/>
                </div>
                <div className="exit__title">
                    Закрыть
                </div>
            </div>

            <div className="bank-body">

                <div className="bank-body-left">

                    <div className="bank-body-left__card">
                        <img src={this.getCardStyle()} alt=""/>
                        <p>{CEF.user.name}</p>
                    </div>

                    <div className="bank-body-left-content">

                        <div className="bank-body-left-content-yourCard">

                            <div className="__title">
                                Ваш баланс
                            </div>

                            <img src={cardIcon} className="bank-body-left-content-yourCard__cardIcon" alt=""/>

                            <span className="bank-body-left-content-yourCard__cardName">Fleeca card</span>

                            <span className="bank-body-left-content-yourCard__cardNumber">
                                <img src={point} alt=""/>
                                <img src={point} alt=""/>
                                <span>{this.state.accountNumber.replace(this.state.accountNumber.slice(0, -4), '')}</span>
                            </span>

                            <span className="bank-body-left-content-yourCard__balance">
                                $ {CEF.user.bank.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}
                            </span>

                        </div>

                        <div className="bank-body-left-content-row">
                            <img src={sharpIcon} alt=""/>
                            <div className="bank-body-left-content-row__title">Номер счета</div>
                            <span>{this.state.accountNumber}</span>
                            <div className="bank-body-left-content-row__hr"/>
                        </div>

                        <div className="bank-body-left-content-row">
                            <img src={starIcon} alt=""/>
                            <div className="bank-body-left-content-row__title">Тариф</div>
                            <span>{this.state.rates[this.state.rate].name}</span>
                        </div>

                        <div className="bank-body-left-content-footer displayNone">
                            <div className="bank-body-left-content-footer__title">
                                Управление бизнесом
                            </div>
                            <div className="bank-body-left-content-footer__text">
                                Процент за обслуживание бизнеса
                            </div>
                            <div className="bank-body-left-content-footer__input">
                                <img src={minus} alt=""/>
                                <span>%</span>
                                <div/>
                                <input type="number"/>
                                <img src={plus} alt=""/>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="bank-body-right">

                    <div className="bank-body-right-nav">
                        <div className={`${this.state.component === "operations" ? "bank-active" : ""}`}
                             onClick={() => this.setComponent("operations")}>
                            <span>Банковские операции</span></div>
                        <div className={`${this.state.component === "taxes" ? "bank-active" : ""}`}
                             onClick={() => this.setComponent("taxes")}>
                            <span>Оплата налогов</span></div>
                        <div className={`${this.state.component === "rate" ? "bank-active" : ""}`}
                             onClick={() => this.setComponent("rate")}>
                            <span>Смена тарифа карты</span></div>
                        <div className={`${this.state.component === "settings" ? "bank-active" : ""}`}
                             onClick={() => this.setComponent("settings")}>
                            <span>Настройки и управление</span></div>
                    </div>

                    <div className={`bank-body-right-content bank-body-right-content0 
                    ${this.state.component === "operations" ? "" : "displayNone"}`}>

                        <div className="bank-body-right-content0__switcher">
                            <div className={`${this.state.isCashOut ? "" : "bank-active"}`}
                                 onClick={() => this.setIsCashOut(false)}>Пополнение счета
                            </div>
                            <div className={`${this.state.isCashOut ? "bank-active" : ""}`}
                                 onClick={() => this.setIsCashOut(true)}>Снятие со счета
                            </div>
                        </div>

                        <div className="bank-body-right-content0-window">

                            <div className="bank-body-right-content0-window__cashBalance">
                                <img src={walletIcon} alt=""/>
                                $ {CEF.user.money.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}
                            </div>

                            <div className="bank-body-right-content0-window__title">
                                Введите сумму
                            </div>

                            <div className="bank-body-right-content0-window-input">
                                <span>$</span>
                                <div/>
                                <input type="number" ref={this.state.refOperationAmount}
                                       onChange={() => this.onChangeOperation(true)}/>
                                {this.state.showMax && <p>Макс. сумма
                                    $ {this.maxAmount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</p>}
                            </div>

                            <div className="bank-body-right-content0-window-commission">
                                <div>
                                    Комиссия
                                    ({this.state.isCashOut ? REMOVAL_BANK_MONEY_PERCENT : 0}%) <span>$
                                    {this.state.isCashOut
                                        ? this.state.commission.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ") : 0}</span>
                                </div>
                                <div>
                                    Итог <span>$ {this.state.totalAmount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</span>
                                </div>
                            </div>

                        </div>

                        <div className="bank-body-right-content0-pinTitle">
                            Введите PIN-код
                        </div>

                        <div className="bank-body-right-content0-pin">
                            <input ref={this.state.refOperationCode} type="password" placeholder="••••"
                                   onChange={() => this.onChangeOperation(this.state.isCashOut)}/>
                            <div
                                className={`${this.state.activeBtnOperation ? "bank-active" : ""}`}
                                onClick={async () => {
                                    const isPinCorrect: boolean = await CustomEvent.callServer('pin:check', this.state.accountNumber, this.state.refOperationCode.current.value)
                                    if (isPinCorrect)
                                        this.state.isCashOut
                                            ? CustomEvent.triggerServer('bank:witdraw', this.state.bankId, this.state.totalAmount)
                                            : CustomEvent.triggerServer('bank:deposit', this.state.bankId, this.state.totalAmount)
                                }}
                            >
                                {this.state.isCashOut ? "СНЯТЬ" : "ПОПОЛНИТЬ"}
                            </div>
                        </div>

                    </div>

                    <div className={`bank-body-right-content bank-body-right-content1
                    ${this.state.component === "taxes" ? "" : "displayNone"}`}>

                        <div className="bank-body-right-content1-nav">

                            <div
                                className={`bank-body-right-content1-nav-block ${this.state.taxesCat === "houses" ? "bank-active" : ""}`}
                                onClick={() => this.setTaxesCat("houses")}>
                                <img src={houseIcon} alt=""/>
                                <span>Дома</span>
                                <div>Всего
                                    <p>$ {this.getTotalAmountForCat("houses").toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</p>
                                </div>
                            </div>
                            <div
                                className={`bank-body-right-content1-nav-block ${this.state.taxesCat === "businesses" ? "bank-active" : ""}`}
                                onClick={() => this.setTaxesCat("businesses")}>
                                <img src={businessIcon} alt=""/>
                                <span>Бизнес</span>
                                <div>Всего
                                    <p>$ {this.getTotalAmountForCat("businesses").toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</p>
                                </div>
                            </div>
                            <div
                                className={`bank-body-right-content1-nav-block ${this.state.taxesCat === "warehouse" ? "bank-active" : ""}`}
                                onClick={() => this.setTaxesCat("warehouse")}>
                                <img src={businessIcon} alt=""/>
                                <span>Склад</span>
                                <div>Всего
                                    <p>$ {this.getTotalAmountForCat("warehouse").toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bank-body-right-content1-title">
                            {this.getTaxName(this.state.taxesCat)}
                            <div className="bank-body-right-content1-title__button"
                                 onClick={() => this.payAllTaxesForCat()}>
                                Оплатить все
                                за <span>$ {this.getTotalAmountForCat(this.state.taxesCat).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</span>
                            </div>
                        </div>

                        <div className="bank-body-right-content1-scroll">
                            {
                                this.state.taxes[this.state.taxesCat].map((el, key) => {
                                    const bottomTitle: string = el.address ? el.address : el.numberPlate;

                                    return <div className="bank-body-right-content1-scroll-block" key={key}>

                                        <div className="bank-body-right-content1-scroll-block__left">
                                            <div>{el.name}</div>
                                            <span>{bottomTitle}</span>
                                        </div>
                                        <div className="bank-body-right-content1-scroll-block__right">
                                            <span>$ {(el.maxTaxAmount - el.taxAmountLeft < 0 ? 0 : el.maxTaxAmount - el.taxAmountLeft).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</span>
                                            <div onClick={() => this.payForItem(el.id)}>Оплатить</div>
                                        </div>
                                    </div>
                                })
                            }

                        </div>
                    </div>

                    <div className={`bank-body-right-content bank-body-right-content2
                    ${this.state.component === "rate" ? "" : "displayNone"}`}>

                        <div className="bank-body-right-content2__leftShadow"/>
                        <div className="bank-body-right-content2__rightShadow"/>

                        <div className="bank-body-right-content2__leftButton"
                             onClick={() => this.setChooseRate(false)}/>
                        <div className="bank-body-right-content2__rightButton"
                             onClick={() => this.setChooseRate(true)}/>

                        <div className={`bank-body-right-content2-cards ${this.getTransform()}`}>
                            <div
                                className={`${this.state.chooseRate === 0 ? "bank-active" : ""}`}>
                                <img src={cardBlack} alt=""/>
                            </div>
                            <div
                                className={`${this.state.chooseRate === 1 ? "bank-active" : ""}`}>
                                <img src={cardGold} alt=""/>
                            </div>
                            <div
                                className={`${this.state.chooseRate === 2 ? "bank-active" : ""}`}>
                                <img src={cardPlatinum} alt=""/>
                            </div>

                        </div>

                        <div className="bank-body-right-content2-cardInfo">
                            <div className="bank-body-right-content2-cardInfo__title">
                                {this.state.rates[this.state.chooseRate].name} карта
                                {/*  Premium, VIP  */}
                            </div>
                            <div className="bank-body-right-content2-cardInfo__li">
                                {
                                    this.state.rates[this.state.chooseRate].benefits.map((el, key) => {
                                        return <span key={key}>{el}</span>
                                    })
                                }
                            </div>
                            <div className="bank-body-right-content2-cardInfo-button">
                                <span>$ {this.state.rates[this.state.chooseRate].amount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</span>
                                <div onClick={() => this.changeRate()}
                                     className={`${this.state.chooseRate <= this.state.rate ? "bank-active" : ""}`}>
                                    {this.state.chooseRate === this.state.rate ? "Ваш тариф" : this.state.chooseRate > this.state.rate ? "Сменить" : "Недоступно"}
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className={`bank-body-right-content bank-body-right-content3
                    ${this.state.component === "settings" ? "" : "displayNone"}`}>

                        <div className="bank-body-right-content3-buttons">
                            <div className={`${this.state.settingsComponent === "changeCode" ? "bank-active" : ""}`}
                                 onClick={() => this.setSettingsComponent("changeCode")}>Изменить PIN-код
                            </div>
                            <div className={`${this.state.settingsComponent === "orderCard" ? "bank-active" : ""}`}
                                 onClick={() => this.setSettingsComponent("orderCard")}>Перевыпустить карту
                            </div>
                            <div className={`${this.state.settingsComponent === "closeAccount" ? "bank-active" : ""}`}
                                 onClick={() => this.setSettingsComponent("closeAccount")}>Закрыть счёт
                            </div>
                        </div>

                        <div className="bank-body-right-content3__hr"/>

                        {this.state.settingsComponent === "changeCode" &&
                        <div className={`bank-body-right-content3-content `}>
                            <div className="bank-body-right-content3-content__title">
                                Изменение PIN-кода
                            </div>
                            <div className="bank-body-right-content3-content__descriptionBig">
                                Введите старый PIN-код
                            </div>
                            <input type="password" placeholder="••••" ref={this.state.refOldCode}
                                   onChange={() => this.onChangeCode(true)}/>
                            <div className="bank-body-right-content3-content__descriptionBig">
                                Введите новый PIN-код
                            </div>
                            <input type="number" placeholder="••••" ref={this.state.refNewCode}
                                   onChange={() => this.onChangeCode(false)}/>
                            <div className="bank-body-right-content3-content__buttonBig"
                                 onClick={() => this.onClickChangeCode()}>
                                ИЗМЕНИТЬ
                            </div>
                        </div>}

                        {this.state.settingsComponent === "orderCard" &&
                        <div className={`bank-body-right-content3-content`}>
                            <div className="bank-body-right-content3-content__title">
                                Перевыпустить карту
                            </div>
                            <div className="bank-body-right-content3-content__description">
                                Введите пин-код для перевыпуска карты
                            </div>
                            <input type="password" placeholder="••••" ref={this.state.refChangePin}
                                   onChange={() => this.onChangeCode(true)}/>
                            <div className="bank-body-right-content3-content__price">
                                <span>Стоимость</span>
                                <p>$ {systemUtil.numberFormat(newBankCardCost)}</p>
                                <div className="bank-body-right-content3-content__button"
                                     onClick={() => this.orderCard()}>
                                    ПЕРЕВЫПУСТИТЬ
                                </div>
                            </div>
                        </div>}

                        {this.state.settingsComponent === "closeAccount" &&
                        <div className={`bank-body-right-content3-content`}>
                            <div className="bank-body-right-content3-content__title">
                                Закрыть счет
                            </div>
                            <div className="bank-body-right-content3-content__description">
                                После закрытия счета ваша карта будет заблокирована. Все денежные средства которые на
                                ней находятся будут переведены в наличные. После закрытия счета данный номер карты
                                обратно будет получить невозможно.
                            </div>
                            <div className="bank-body-right-content3-content__button"
                                 onClick={() => this.closeAccount()}>
                                ЗАКРЫТЬ
                            </div>
                        </div>}

                    </div>

                </div>
            </div>
        </div>
    }
}
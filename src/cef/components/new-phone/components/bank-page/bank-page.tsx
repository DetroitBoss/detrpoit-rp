// noinspection CheckTagEmptyBody

import React, {Component} from "react";
import "./bank-page.less";
import png from "./../../assets/*.png";
import {Transaction} from "./interfaces/transaction.interface";
import {TransactionType} from "./enums/transactionType.enum";
import {BankPages} from "./enums/bankPages.enum";
import {NewTransactionComponent} from "./components/new-transaction-component/new-transaction-component";
import {TaxCategories} from "./components/tax-categories-component/tax-categories-component";
import {SuccessTransactionComponent} from "./components/success-component/success-transaction-component";
import {CardInfoComponent} from "./components/card-info-component/card-info-component";
import {CustomEvent} from "../../../../modules/custom.event";
import {BankingHistoryItem} from "../../../../../shared/phone";
import {system} from "../../../../modules/system";
import {CEF} from "../../../../modules/CEF";
import {BANK_CARD_NAME_LIST} from "../../../../../shared/economy";
import { TaxCategory } from "../../../../../shared/phone/taxCategory.enum";
// import {TaxCategory} from "../../../../../../../shared/phone/taxCategory.enum";

export class BankPage extends Component<
  { availableTaxes: [TaxCategory, number][] },
  {
    cardNumber: string;
    cardBalance: number;
    income: number;
    outcome: number;
    isShowTransactions: boolean;
    transactions: Transaction[];
    page: BankPages;
    newTransactionType: TransactionType;
    selectedTaxCategory: TaxCategory;
    newTransactionAmount: number,
    tarifName: string
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      cardNumber: '',
      cardBalance: 0,
      income: 0,
      outcome: 0,
      isShowTransactions: false,
      transactions: [
        {
          type: TransactionType.ENROLLMENT,
          amount: 1000,
          id: 12345,
        },
        {
          type: TransactionType.TRANSFER,
          amount: 1000,
          id: 12345,
        },
        {
          type: TransactionType.PURCHASE,
          amount: 1000,
          shop: "Los Santos Customs",
        },
        {
          type: TransactionType.TAX,
          amount: 1000,
          category: TaxCategory.Business,
        },
        {
          type: TransactionType.TAX,
          amount: 1000,
          category: TaxCategory.Car,
        },
        {
          type: TransactionType.TAX,
          amount: 1000,
          category: TaxCategory.Home,
        },
        {
          type: TransactionType.TAX,
          amount: 1000,
          category: TaxCategory.Warehouse,
        },
      ],
      page: BankPages.MAIN,
      tarifName: '',
      newTransactionType: null,
      selectedTaxCategory: null,
      newTransactionAmount: null,
    };
    
    CustomEvent.triggerServer('phone:loadBankHistory');
    
    CustomEvent.register('phone:bankData', (
        bankNumber: string, 
        tarif: number,
        bankingOperations: BankingHistoryItem[]
    ) => {
      const transactions: Transaction[] = [];
      bankingOperations.forEach(b => transactions.push({
          id: b.id, 
          target: b.target, 
          type: b.type == "add" ? TransactionType.ENROLLMENT : TransactionType.PURCHASE,
          amount: b.sum,
      }))
      
      this.setState({
        tarifName: BANK_CARD_NAME_LIST[tarif],
        cardNumber: bankNumber,
        transactions: transactions
      })
    })
    
    this.format = this.format.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.taxCategorySelecting = this.taxCategorySelecting.bind(this);
    this.setNewTransactionAmount = this.setNewTransactionAmount.bind(this);
  }

  format(s: string | number, blockWidth: number = 4) {
    let v = s.toString().replace(/[^\d0-9]/g, ""),
      reg = new RegExp(".{" + blockWidth + "}", "g");
    if (blockWidth === 3) {
      return (
        v.substr(0, v.length % blockWidth) +
        " " +
        v.substr(v.length % blockWidth, v.length).replace(reg, function (a) {
          return a + " ";
        })
      );
    } else {
      return v.replace(reg, function (a) {
        return a + " ";
      });
    }
  }

  onPageChange(page: BankPages) {
    this.setState({ ...this.state, page });
  }
  taxCategorySelecting(selectedTaxCategory: TaxCategory) {
    this.setState({ ...this.state, selectedTaxCategory, page: BankPages.NEW_TRANSACTION });
  }
  setNewTransactionAmount(newTransactionAmount: number) {
    this.setState({ ...this.state, newTransactionAmount, page: BankPages.SUCCESS }, () => console.log(this.state));
  }

  render() {
    return (
      <div className="np-bank-page-wrap">
        {this.state.page === BankPages.NEW_TRANSACTION ? (
          <NewTransactionComponent
              taxSum={this.props.availableTaxes.find(t => t[0] === this.state.selectedTaxCategory) 
                  ? this.props.availableTaxes.find(t => t[0] === this.state.selectedTaxCategory)[1] : 0}
            userBalance={this.state.cardBalance}
            type={this.state.newTransactionType}
            taxCategory={this.state.selectedTaxCategory}
            onPageChange={this.onPageChange}
            setNewTransactionAmount={this.setNewTransactionAmount}
          ></NewTransactionComponent>
        ) : this.state.page === BankPages.TAX_CATEGORIES ? (
          <TaxCategories taxCategorySelecting={this.taxCategorySelecting} 
             onPageChange={this.onPageChange}
             availableTaxes={this.props.availableTaxes}
              ></TaxCategories>
        ) : this.state.page === BankPages.SUCCESS ? (
          <SuccessTransactionComponent onPageChange={this.onPageChange} transactionAmount={this.state.newTransactionAmount}></SuccessTransactionComponent>
        ) : this.state.page === BankPages.INFO ? (
          <CardInfoComponent 
              cardNumber={this.state.cardNumber}
              cardBalance={this.state.cardBalance}
              rate={this.state.tarifName}
              onPageChange={this.onPageChange}></CardInfoComponent>
        ) : this.state.page === BankPages.MAIN ? (
          <>
            <div
              className={
                this.state.isShowTransactions === true
                  ? "np-bank-page-bg darked"
                  : "np-bank-page-bg"
              }
            >
              <img src={png["bank-bg"]} alt="" />
            </div>
            <div className="np-bank-page">
              <div className="np-bank-page-card" onClick={
                (e) => {
                  CEF.copy(this.state.cardNumber)
                  CEF.alert.setAlert('info', 'Номер карты скопирован')
                }}>
                <div className="np-bank-page-card-number">
                  {this.state.cardNumber}
                </div>
                <svg
                  className="np-bank-page-card-nfc"
                  width="16"
                  height="20"
                  viewBox="0 0 16 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.1215 0.0547514C11.8286 0.220575 11.5759 0.642929 11.5759 0.96671C11.5759 1.17808 11.6321 1.31351 12.3025 2.71731C12.5385 3.21138 12.7897 3.7795 12.8607 3.9798C12.9318 4.1801 13.0339 4.46416 13.0877 4.61105C13.1416 4.75794 13.2176 4.9983 13.2568 5.14518C13.2959 5.29207 13.3726 5.57613 13.4273 5.77643C13.5293 6.15037 13.5791 6.39165 13.6676 6.94181C13.6955 7.1154 13.7388 7.37761 13.7637 7.5245C13.9648 8.70853 13.9644 10.9373 13.763 12.4531C13.7381 12.64 13.7074 12.8367 13.6946 12.8901C13.6819 12.9435 13.6462 13.1183 13.6154 13.2786C13.4447 14.1657 13.1485 15.1922 12.7431 16.301C12.7016 16.4144 12.422 17.0097 12.1218 17.6238C11.5222 18.8504 11.4927 18.9636 11.6759 19.3381C11.7939 19.5793 12.0227 19.8389 12.2021 19.9351C12.3579 20.0186 12.7962 20.0224 12.9319 19.9414C13.3125 19.7143 13.5374 19.3865 14.0952 18.2458C14.3537 17.7171 14.5949 17.2026 14.6312 17.1024C14.6675 17.0023 14.7446 16.8002 14.8026 16.6533C14.9597 16.2557 15.2257 15.461 15.3308 15.0752C15.5088 14.4217 15.6122 14.0048 15.662 13.7399C15.6896 13.593 15.7321 13.3745 15.7564 13.2543C16.0804 11.6554 16.0813 8.75917 15.7585 6.69902C15.6767 6.17722 15.2328 4.46751 15.0335 3.90697C14.9852 3.77091 14.7876 3.22721 14.63 2.79626C14.5921 2.69278 14.3389 2.15637 14.0673 1.60422C13.5716 0.596411 13.3163 0.21368 13.0435 0.0692701C12.8837 -0.0153171 12.2625 -0.0251257 12.1215 0.0547514ZM8.3941 2.01856C8.02068 2.13593 7.68612 2.54658 7.68583 2.88794C7.68559 3.13757 7.78323 3.40279 8.19508 4.27115C8.81586 5.58002 8.94286 5.92167 9.16978 6.89325C9.45566 8.11719 9.54756 8.87314 9.54756 10.0009C9.54756 11.6233 9.30057 12.9156 8.65441 14.6746C8.6176 14.7748 8.38456 15.2717 8.13658 15.7788C7.73636 16.5972 7.68578 16.7296 7.68673 16.9563C7.69001 17.7017 8.41791 18.1768 9.0525 17.8476C9.54528 17.592 9.83553 17.1399 10.5659 15.4899C10.7581 15.0557 11.1882 13.6854 11.2905 13.1815C11.4648 12.3226 11.5028 12.0664 11.582 11.2149C11.6751 10.215 11.6398 8.94481 11.4875 7.81585C11.3628 6.89189 11.0857 5.84431 10.6556 4.67131C10.6139 4.55759 10.4218 4.14242 10.2286 3.74872C9.62109 2.51055 9.4012 2.19696 9.02465 2.03177C8.78478 1.9265 8.69317 1.9246 8.3941 2.01856ZM4.34096 4.07381C4.00597 4.22764 3.70045 4.61188 3.70135 4.87812C3.70211 5.09206 3.80406 5.35859 4.17492 6.11633C4.35762 6.48964 4.54112 6.88815 4.58263 7.00197C4.74807 7.45511 4.97275 8.28122 5.04178 8.68988C5.1109 9.09908 5.11076 11.0009 5.04159 11.4091C4.90752 12.2005 4.59127 13.1318 4.15129 14.031C3.84106 14.665 3.79562 14.7911 3.79704 15.0139C3.79917 15.3383 3.92504 15.566 4.24062 15.8164C4.35202 15.9048 4.43836 15.925 4.70475 15.925C5.18952 15.925 5.43351 15.7836 5.73306 15.3293C5.97431 14.9634 6.34791 14.2363 6.48032 13.875C6.85526 12.852 7.04242 12.1956 7.1281 11.6033C7.18788 11.1898 7.20382 8.86386 7.14888 8.56849C7.129 8.46166 7.09048 8.25408 7.06325 8.10719C6.94668 7.47823 6.69856 6.64435 6.48317 6.1577C6.41988 6.01475 6.2963 5.73477 6.20853 5.53549C6.03555 5.14295 5.5766 4.39725 5.4217 4.25707C5.29299 4.14067 4.8514 3.97898 4.67372 3.98325C4.59506 3.98509 4.44534 4.02588 4.34096 4.07381ZM0.64047 5.92973C0.368626 6.0736 0.192046 6.25526 0.0894285 6.49668C-0.041512 6.80473 -0.0212067 6.97041 0.197644 7.37883C0.66941 8.25927 0.814535 8.55562 0.880528 8.7733C0.976835 9.09106 0.977689 10.7057 0.881714 11.0206C0.783319 11.3436 0.582591 11.7845 0.43087 12.0109C0.182795 12.3811 0 12.8057 0 13.0117C0 13.4411 0.310557 13.8286 0.794183 14.0027C0.977357 14.0686 1.01854 14.0673 1.25504 13.9874C1.39784 13.9392 1.59154 13.8397 1.68548 13.7664C2.02071 13.5048 2.47022 12.8156 2.67674 12.2467C2.71792 12.1332 2.78628 11.9475 2.82865 11.834C3.01804 11.3263 3.09916 10.7619 3.09916 9.95238C3.09916 9.14288 3.01804 8.57844 2.82865 8.07077C2.78628 7.95725 2.7192 7.7754 2.67954 7.66658C2.42681 6.97366 1.87198 6.15367 1.49443 5.91526C1.29811 5.79124 0.888972 5.79818 0.64047 5.92973Z"
                    fill="white"
                  />
                </svg>
                <svg
                  className="np-bank-page-card-mc"
                  width="34"
                  height="23"
                  viewBox="0 0 34 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="11.5" cy="11.5" r="11.5" fill="#EB001B" />
                  <g style={{ mixBlendMode: "hard-light" }}>
                    <circle cx="22.5" cy="11.5" r="11.5" fill="#F79E1B" />
                  </g>
                </svg>
                <div className="np-bank-page-card-balance">
                  Баланс
                  <div className="np-card-balance-value">
                    $ {system.numberFormat(CEF.user.bank)}
                  </div>
                </div>
              </div>
              <button className="np-bank-page-card-info" onClick={() => this.onPageChange(BankPages.INFO)}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.625 3C6.86203 3 3 6.86203 3 11.625C3 16.388 6.86203 20.25 11.625 20.25C16.388 20.25 20.25 16.388 20.25 11.625C20.25 6.86203 16.388 3 11.625 3Z"
                    stroke="#2A8CFF"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M10.3125 10.3125H11.8125V15.75"
                    stroke="#2A8CFF"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.75 15.9375H13.875"
                    stroke="#2A8CFF"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M11.4063 6.09375C11.2085 6.09375 11.0151 6.1524 10.8507 6.26228C10.6862 6.37216 10.5581 6.52834 10.4824 6.71107C10.4067 6.89379 10.3869 7.09486 10.4255 7.28884C10.4641 7.48282 10.5593 7.661 10.6991 7.80086C10.839 7.94071 11.0172 8.03595 11.2112 8.07453C11.4051 8.11312 11.6062 8.09332 11.7889 8.01763C11.9717 7.94194 12.1278 7.81377 12.2377 7.64932C12.3476 7.48487 12.4062 7.29153 12.4062 7.09375C12.4062 6.82853 12.3009 6.57418 12.1134 6.38664C11.9258 6.19911 11.6715 6.09375 11.4063 6.09375Z"
                    fill="#2A8CFF"
                  />
                </svg>
                Информация о карте
              </button>
              <div className="np-bank-page-actions-btns">
                <button
                  className="np-bank-page-action-btn"
                  onClick={() => {
                    this.setState({
                      ...this.state,
                      page: BankPages.NEW_TRANSACTION,
                      newTransactionType: TransactionType.TRANSFER,
                    });
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.1549 18.469V13.1726L14.8584 13.1726L14.8584 9.6416L8.6792 15.8208L14.8584 22V18.469H20.1549Z"
                      fill="white"
                    />
                    <path
                      d="M1.71728 8.86637L1.71728 3.56991L7.01373 3.56991L7.01373 0.0389395L13.1929 6.21814L7.01373 12.3973L7.01373 8.86637L1.71728 8.86637Z"
                      fill="white"
                    />
                  </svg>
                  Перевести на счёт
                </button>
                <button
                  className="np-bank-page-action-btn"
                  onClick={() => {
                    this.setState({
                      ...this.state,
                      page: BankPages.TAX_CATEGORIES,
                      newTransactionType: TransactionType.TAX,
                    });
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.875 12.3755C17.116 12.3755 16.5 12.9915 16.5 13.7505C16.5 14.5095 17.116 15.1255 17.875 15.1255H22V12.3755H17.875Z"
                      fill="white"
                    />
                    <path
                      d="M17.875 11.0005H20.625V7.56297C20.625 7.17797 20.3225 6.87547 19.9375 6.87547H18.5625V4.81297C18.5625 4.42797 18.26 4.12547 17.875 4.12547H16.2388L15.0562 1.76048C14.8775 1.41673 14.465 1.27923 14.135 1.44423L12.54 2.24173L12.3062 1.76048C12.1275 1.41673 11.715 1.27923 11.385 1.44423L6.0225 4.12547H2.0625C0.92125 4.12547 0 5.04672 0 6.18797V18.563C0 19.7042 0.92125 20.6255 2.0625 20.6255H19.9375C20.3225 20.6255 20.625 20.323 20.625 19.938V16.5005H17.875C16.3625 16.5005 15.125 15.263 15.125 13.7505C15.125 12.238 16.3625 11.0005 17.875 11.0005ZM17.1875 5.50047V6.02297L16.9263 5.50047H17.1875ZM1.41625 6.42172C1.38875 6.35297 1.375 6.27047 1.375 6.18797C1.375 5.80297 1.6775 5.50047 2.0625 5.50047H3.2725L1.41625 6.42172ZM3.6025 6.87547L11.385 2.98422L13.3237 6.87547H3.6025ZM14.8638 6.87547L13.1587 3.46547L14.135 2.98422L16.0737 6.87547H14.8638Z"
                      fill="white"
                    />
                  </svg>
                  Оплата услуг
                </button>
              </div>
              <div className="np-bank-page-stats-wrap">
                <div className="np-bank-page-stats">
                  Доходы
                  <div className="np-bank-page-stats-value">
                    $ {this.state.transactions
                      .filter(t => t.type === TransactionType.ENROLLMENT)
                      .map(e => e.amount).reduce((a, b) => a + b, 0)}
                  </div>
                </div>
                <div className="np-bank-page-stats-divider"></div>
                <div className="np-bank-page-stats">
                  Расходы
                  <div className="np-bank-page-stats-value">
                    $ {this.state.transactions
                      .filter(t => t.type === TransactionType.PURCHASE)
                      .map(e => e.amount).reduce((a, b) => a + b, 0)}
                  </div>
                </div>
              </div>
              <div
                className={
                  this.state.isShowTransactions === true
                    ? "np-bank-page-transactions-wrap active"
                    : "np-bank-page-transactions-wrap"
                }
                onClick={() => {
                  this.setState({
                    ...this.state,
                    isShowTransactions: !this.state.isShowTransactions,
                  });
                }}
              >
                <div className="np-transactions-title">
                  <span>Транзакции</span>
                  <span>Сегодня</span>
                </div>
                <div className="np-bank-page-transactions">
                  {this.state.transactions.map((t) => {
                    return (
                      <div className="np-bank-page-transaction-item">
                        <div className="np-transaction-info-wrap">
                          <div className="np-transaction-icon">
                            {t.type === TransactionType.TRANSFER ? (
                              <svg
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M20.1549 18.469V13.1726L14.8584 13.1726L14.8584 9.6416L8.67923 15.8208L14.8584 22V18.469H20.1549Z"
                                  fill="url(#paint0_linear)"
                                />
                                <path
                                  d="M1.71728 8.86637L1.71728 3.56991L7.01373 3.56991L7.01373 0.0389395L13.1929 6.21814L7.01373 12.3973L7.01373 8.86637L1.71728 8.86637Z"
                                  fill="url(#paint1_linear)"
                                />
                                <defs>
                                  <linearGradient
                                    id="paint0_linear"
                                    x1="8.67923"
                                    y1="15.8208"
                                    x2="20.1549"
                                    y2="15.8208"
                                    gradientUnits="userSpaceOnUse"
                                  >
                                    <stop stopColor="white" />
                                    <stop offset="1" stopColor="#F9F9F9" />
                                  </linearGradient>
                                  <linearGradient
                                    id="paint1_linear"
                                    x1="13.1929"
                                    y1="6.21814"
                                    x2="1.71728"
                                    y2="6.21814"
                                    gradientUnits="userSpaceOnUse"
                                  >
                                    <stop stopColor="white" />
                                    <stop offset="1" stopColor="#F9F9F9" />
                                  </linearGradient>
                                </defs>
                              </svg>
                            ) : t.type === TransactionType.ENROLLMENT ? (
                              <svg
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.47565 14.531L4.47565 7.82743H11.1792V3.3584L19 11.1792L11.1792 19V14.531L4.47565 14.531Z"
                                  fill="url(#paint0_linear)"
                                />
                                <defs>
                                  <linearGradient
                                    id="paint0_linear"
                                    x1="19"
                                    y1="11.1792"
                                    x2="4.47565"
                                    y2="11.1792"
                                    gradientUnits="userSpaceOnUse"
                                  >
                                    <stop stopColor="white" />
                                    <stop offset="1" stopColor="#F9F9F9" />
                                  </linearGradient>
                                </defs>
                              </svg>
                            ) : t.type === TransactionType.PURCHASE ? (
                              <svg
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M17.5243 14.531V7.82743H10.8208V3.3584L3 11.1792L10.8208 19V14.531L17.5243 14.531Z"
                                  fill="url(#paint0_linear)"
                                />
                                <defs>
                                  <linearGradient
                                    id="paint0_linear"
                                    x1="3"
                                    y1="11.1792"
                                    x2="17.5243"
                                    y2="11.1792"
                                    gradientUnits="userSpaceOnUse"
                                  >
                                    <stop stopColor="white" />
                                    <stop offset="1" stopColor="#F9F9F9" />
                                  </linearGradient>
                                </defs>
                              </svg>
                            ) : (
                              <svg
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0)">
                                  <path
                                    d="M6.62536 3.32747C6.7847 3.29725 6.94792 3.2814 7.11364 3.2814H14.8861C15.0518 3.2814 15.215 3.29725 15.3743 3.32747C15.6204 2.6713 16.3724 0.66584 16.617 0.0138177C16.18 0.159465 13.4591 1.06647 13.0208 1.21255C12.3776 0.826643 11.643 0.385859 10.9998 0C10.3567 0.385859 9.62207 0.826643 8.9789 1.2125C8.54196 1.06685 5.821 0.159897 5.38272 0.0137745C5.62721 0.66584 6.37928 2.6713 6.62536 3.32747Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M7.11358 4.57666C6.39817 4.57666 5.81818 5.15666 5.81818 5.87207C5.81818 6.58748 6.39813 7.16748 7.11358 7.16748H14.886C15.6014 7.16748 16.1814 6.58752 16.1814 5.87207C16.1814 5.15666 15.6014 4.57666 14.886 4.57666C13.3356 4.57666 8.88812 4.57666 7.11358 4.57666Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M11.9714 15.8362H11.6475V17.7793H11.9714C12.2392 17.7793 12.4821 17.6704 12.658 17.4944C13.0378 17.1146 13.0381 16.5011 12.658 16.121C12.4821 15.9452 12.2392 15.8362 11.9714 15.8362Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M9.0567 13.5692C9.0567 14.1049 9.49252 14.5408 10.0283 14.5408H10.3521V12.5977H10.0283C9.49261 12.5977 9.0567 13.0335 9.0567 13.5692Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M18.3631 10.7684C17.9967 10.3561 16.7032 8.90098 16.0631 8.18091C15.7031 8.36503 15.3022 8.46309 14.886 8.46309H7.1136C6.69747 8.46309 6.29663 8.36503 5.93651 8.18091C5.73356 8.4092 4.20986 10.1233 3.63655 10.7684C-0.194702 15.035 2.85223 22.0035 8.68035 22.0001H13.3193C19.1431 22.004 22.197 15.0397 18.3631 10.7684ZM11.9714 19.0748H11.6475V20.3702C11.2034 20.3702 10.7962 20.3702 10.3521 20.3702V19.0748C9.70524 19.0748 9.05589 19.0748 8.40901 19.0748C8.40901 18.6218 8.40901 18.2325 8.40901 17.7794H10.3521V15.8363H10.0283C7.02016 15.7114 7.02236 11.4262 10.0283 11.3024H10.3521V10.007H11.6475V11.3024H13.5906V12.5978C12.984 12.5978 12.2562 12.5978 11.6475 12.5978V14.5409H11.9714C14.9795 14.6658 14.9773 18.951 11.9714 19.0748Z"
                                    fill="white"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0">
                                    <rect width="22" height="22" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            )}
                          </div>
                          <div className="np-transaction-description">
                            <div className="np-transaction-type">
                              {t.type === TransactionType.ENROLLMENT
                                ? "Зачисление"
                                : t.type === TransactionType.PURCHASE
                                ? "Покупка"
                                : t.type === TransactionType.TAX
                                ? "Налоги"
                                : t.type === TransactionType.TRANSFER
                                ? "Перевод"
                                : null}
                            </div>
                            <div className="np-transaction-desc">
                              {t.type === TransactionType.ENROLLMENT
                                ? "от " + t.target
                                : t.type === TransactionType.TRANSFER
                                ? "" + t.target
                                : t.type === TransactionType.PURCHASE
                                ? t.shop
                                : t.type === TransactionType.TAX
                                ? t.category
                                : null}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            t.type === TransactionType.ENROLLMENT
                              ? "np-transaction-amount income"
                              : "np-transaction-amount"
                          }
                        >
                          {t.type === TransactionType.ENROLLMENT
                            ? "+ $" + t.amount
                            : "- $" + t.amount}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    );
  }
}

import React, { Component } from "react";
import { BankPages } from "../../enums/bankPages.enum";
import { TransactionType } from "../../enums/transactionType.enum";
import "./new-transaction-component.less";
import {CustomEvent} from "../../../../../../modules/custom.event";
import {CEF} from "../../../../../../modules/CEF";
import {system} from "../../../../../../modules/system";
import {TaxCategory} from "../../../../../../../shared/phone/taxCategory.enum";
import {systemUtil} from "../../../../../../../shared/system";

export class NewTransactionComponent extends Component<
  {
    onPageChange: any;
    setNewTransactionAmount: any;
    type: TransactionType;
    userBalance: number;
    taxCategory?: TaxCategory;
    taxSum: number;
  },
  {
    recipientCard: string;
    transactionAmount: string | number;
    tax: number;
  }
> { 
  public cardInputRef: React.RefObject<any> =
    React.createRef<HTMLInputElement>();
  public amountInputRef: React.RefObject<any> =
    React.createRef<HTMLInputElement>();

  constructor(props: any) {
    super(props);
    this.state = {
      recipientCard: null,
      transactionAmount: this.props.taxSum,
      tax: 123456789,
    };
    
    CustomEvent.register('phone:sendMoney:success', () => {
      this.props.setNewTransactionAmount(this.state.transactionAmount)
    })

    CustomEvent.register('phone:payTax:success', () => {
      this.props.setNewTransactionAmount(this.props.taxSum)
    })
    
    this.format = this.format.bind(this);
    this.formatCardInput = this.formatCardInput.bind(this);
    this.formatAmountInput = this.formatAmountInput.bind(this);
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

  formatCardInput(e: any) {
    this.setState({ ...this.state, recipientCard: e.target.value });
  }

  formatAmountInput(e: any) {
    this.setState({ ...this.state, transactionAmount: e.target.value });
  }

  render() {
    return (
      <div className="np-new-transaction">
        <button
          className="np-bank-page-back-btn"
          onClick={() => this.props.type === TransactionType.TAX ? this.props.onPageChange(BankPages.TAX_CATEGORIES) : this.props.onPageChange(BankPages.MAIN)}
        >
          <div className="np-bank-page-btn-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.625 12.5L3.125 8L7.625 3.5M3.75 8H12.875"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {this.props.type === TransactionType.TAX &&
          this.props.taxCategory !== undefined
            ? "Оплата услуг"
            : "Назад"}
        </button>
        <div className="np-new-transaction-title">
          {this.props.type === TransactionType.TRANSFER
            ? "Перевести средства на другой счет"
            : this.props.type === TransactionType.TAX && this.props.taxCategory
            ? this.props.taxCategory
            : null}
        </div>
        <div className="np-new-transaction-user-balance-wrap">
          Ваш баланс
          <div className="np-new-transaction-user-balance">
            $ {system.numberFormat(CEF.user.bank)}
          </div>
        </div>
        {this.props.type === TransactionType.TRANSFER ? (
          <div className="np-new-transaction-transfer">
            <label className="np-new-transaction-form-field">
              Введите карту получателя
              <input
                className="input"
                ref={this.cardInputRef}
                onChange={this.formatCardInput}
              />
              <div className="input-value">
                {this.state.recipientCard}
              </div>
            </label>
            <label className="np-new-transaction-form-field">
              Введите сумму перевода
              <input
                className="input"
                type="number"
                onChange={this.formatAmountInput}
              />
              <div className="input-value">
                {this.state.transactionAmount
                  ? "$ " + this.format(this.state.transactionAmount, 3)
                  : ""}
              </div>
            </label>
          </div>
        ) : this.props.type === TransactionType.TAX ? (
          <div className="np-new-transaction-tax">
            <div className="np-new-transaction-tax-info">
              Налоги
              <div className="np-new-transaction-tax-amount">$ {system.numberFormat(this.props.taxSum)}</div>
            </div>
            <div className="np-tax-icon">
              {this.props.taxCategory === TaxCategory.Car ? (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.9688 9.625C20.8398 9.41016 19.5675 8.86059 19.5675 8.86059C19.7888 8.74629 19.9401 8.72266 19.9401 8.25C19.9401 7.73438 19.9375 7.5625 19.5938 7.5625H18.4276C18.4229 7.55219 18.4177 7.54145 18.413 7.5307C17.6602 5.88672 17.5592 5.47121 16.4364 4.91176C14.9304 4.16281 12.1069 4.125 11 4.125C9.89312 4.125 7.06965 4.16281 5.56488 4.91176C4.44082 5.47035 4.46875 5.75781 3.58832 7.5307C3.58832 7.53543 3.5793 7.54789 3.57113 7.5625H2.40367C2.0625 7.5625 2.05992 7.73438 2.05992 8.25C2.05992 8.72266 2.21117 8.74629 2.43246 8.86059C2.43246 8.86059 1.20312 9.45312 1.03125 9.625C0.859375 9.79688 0.6875 11 0.6875 13.0625C0.6875 15.125 0.859375 17.1875 0.859375 17.1875H1.37242C1.37242 17.7891 1.46094 17.875 1.71875 17.875H5.15625C5.41406 17.875 5.5 17.7891 5.5 17.1875H16.5C16.5 17.7891 16.5859 17.875 16.8438 17.875H20.3672C20.5391 17.875 20.625 17.7461 20.625 17.1875H21.1406C21.1406 17.1875 21.3125 15.082 21.3125 13.0625C21.3125 11.043 21.0977 9.83984 20.9688 9.625ZM5.38227 11.556C4.59968 11.6416 3.8131 11.6855 3.02586 11.6875C2.14844 11.6875 2.11836 11.7438 2.05648 11.1959C2.03321 10.9452 2.04057 10.6925 2.0784 10.4436L2.10547 10.3125H2.23438C2.75 10.3125 3.23426 10.3344 4.14863 10.6038C4.61369 10.7434 5.05112 10.9623 5.44156 11.2509C5.62891 11.3867 5.67188 11.5156 5.67188 11.5156L5.38227 11.556ZM16.0024 14.6498L15.8125 15.125H6.1875C6.1875 15.125 6.20426 15.0988 5.97266 14.6446C5.80078 14.3086 6.01562 14.0938 6.35551 13.9717C7.01379 13.7345 8.9375 13.0625 11 13.0625C13.0625 13.0625 15.0245 13.6417 15.6621 13.9717C15.8984 14.0938 16.1919 14.1797 16.0024 14.6523V14.6498ZM4.95945 8.78324C4.82066 8.79125 4.68155 8.79225 4.54266 8.78625C4.6548 8.58687 4.71711 8.36473 4.82668 8.1327C5.17043 7.40223 5.56359 6.57551 6.26356 6.22703C7.27504 5.72344 9.37148 5.49656 11 5.49656C12.6285 5.49656 14.725 5.72172 15.7364 6.22703C16.4364 6.57551 16.8279 7.40266 17.1733 8.1327C17.2838 8.36688 17.3452 8.59074 17.4604 8.79141C17.3744 8.79613 17.2756 8.79141 17.0397 8.78324H4.95945ZM19.9005 11.1942C19.8086 11.7305 19.8945 11.6875 18.9741 11.6875C18.1869 11.6855 17.4003 11.6416 16.6177 11.556C16.4953 11.5341 16.4605 11.3274 16.5584 11.2509C16.9469 10.9591 17.3849 10.7399 17.8514 10.6038C18.7657 10.3344 19.2805 10.2983 19.7888 10.3164C19.823 10.3177 19.8554 10.3316 19.8799 10.3554C19.9045 10.3792 19.9193 10.4112 19.9216 10.4453C19.9459 10.6954 19.9388 10.9476 19.9005 11.1959V11.1942Z"
                    fill="white"
                  />
                </svg>
              ) : this.props.taxCategory === TaxCategory.Business ? (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.4375 12.375H7.5625V11H0.6875V19.4219C0.6875 19.5586 0.741825 19.6898 0.838523 19.7865C0.935222 19.8832 1.06637 19.9375 1.20312 19.9375H20.7969C20.9336 19.9375 21.0648 19.8832 21.1615 19.7865C21.2582 19.6898 21.3125 19.5586 21.3125 19.4219V11H14.4375V12.375ZM21.3125 5.32812C21.3125 5.19137 21.2582 5.06022 21.1615 4.96352C21.0648 4.86682 20.9336 4.8125 20.7969 4.8125H16.5V2.40625C16.5 2.31508 16.4638 2.22765 16.3993 2.16318C16.3349 2.09872 16.2474 2.0625 16.1562 2.0625H5.84375C5.75258 2.0625 5.66515 2.09872 5.60068 2.16318C5.53622 2.22765 5.5 2.31508 5.5 2.40625V4.8125H1.20312C1.06637 4.8125 0.935222 4.86682 0.838523 4.96352C0.741825 5.06022 0.6875 5.19137 0.6875 5.32812V9.625H21.3125V5.32812ZM14.7812 4.8125H7.21875V3.78125H14.7812V4.8125Z"
                    fill="white"
                  />
                </svg>
              ) : this.props.taxCategory === TaxCategory.Home ? (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.875 7.96661V2.52075H14.4375V5.03227L11 1.83325L0 12.1458H2.75V21.0833H8.9375V14.2083H13.0625V21.0833H19.25V12.1458H22L17.875 7.96661Z"
                    fill="white"
                  />
                </svg>
              ) : this.props.taxCategory === TaxCategory.Warehouse ? (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.25 0.6875H2.75L1.375 7.5625V13.75H20.625V7.5625L19.25 0.6875ZM18.7344 7.5625H13.75C13.75 8.29185 13.4603 8.99132 12.9445 9.50704C12.4288 10.0228 11.7293 10.3125 11 10.3125C10.2707 10.3125 9.57118 10.0228 9.05546 9.50704C8.53973 8.99132 8.25 8.29185 8.25 7.5625H3.26562L4.21094 2.49219H17.7891L18.7344 7.5625ZM13.75 15.125C13.75 15.8543 13.4603 16.5538 12.9445 17.0695C12.4288 17.5853 11.7293 17.875 11 17.875C10.2707 17.875 9.57118 17.5853 9.05546 17.0695C8.53973 16.5538 8.25 15.8543 8.25 15.125H1.375V21.3125H20.625V15.125H13.75Z"
                    fill="white"
                  />
                </svg>
              // ) : this.props.taxCategory === TaxCategory.FamilyAtHome ? (
              //   <svg
              //     width="22"
              //     height="22"
              //     viewBox="0 0 22 22"
              //     fill="none"
              //     xmlns="http://www.w3.org/2000/svg"
              //   >
              //     <path
              //       d="M18.7773 11.8112V7.58092H16.0918V9.53183L13.4062 7.04688L4.8125 15.0575H6.96094V22H11.7949V16.6596H15.0176V22H19.8516V15.0575H22L18.7773 11.8112Z"
              //       fill="white"
              //     />
              //     <path
              //       fillRule="evenodd"
              //       clipRule="evenodd"
              //       d="M12.9873 1.87221V5.81073L13.2154 6.04076L8.53348 10.3248H6.49365V12.1912L3.09957 15.2969H1.99805V8.83315H0L7.99219 1.375L10.4897 3.68858V1.87221H12.9873ZM11.247 15.2969H13.9863V12.7903L11.247 15.2969Z"
              //       fill="white"
              //     />
              //   </svg>
              // ) : this.props.taxCategory === TaxCategory.FamilyCars ? (
              //   <svg
              //     width="22"
              //     height="22"
              //     viewBox="0 0 22 22"
              //     fill="none"
              //     xmlns="http://www.w3.org/2000/svg"
              //   >
              //     <path
              //       d="M21.3215 11.6254C21.2413 11.4965 20.4496 11.1668 20.4496 11.1668C20.5873 11.0982 20.6814 11.084 20.6814 10.8004C20.6814 10.4911 20.6798 10.3879 20.466 10.3879H19.7403C19.7374 10.3818 19.7342 10.3753 19.7312 10.3689C19.2628 9.38247 19.2 9.13317 18.5014 8.79749C17.5643 8.34813 15.8074 8.32544 15.1187 8.32544C14.43 8.32544 12.6732 8.34813 11.7369 8.79749C11.0375 9.13265 11.0548 9.30513 10.507 10.3689C10.507 10.3717 10.5014 10.3792 10.4963 10.3879H9.7699C9.55761 10.3879 9.55601 10.4911 9.55601 10.8004C9.55601 11.084 9.65012 11.0982 9.78781 11.1668C9.78781 11.1668 9.02289 11.5223 8.91595 11.6254C8.809 11.7286 8.70206 12.4504 8.70206 13.6879C8.70206 14.9254 8.809 16.1629 8.809 16.1629H9.12823C9.12823 16.5239 9.18331 16.5754 9.34372 16.5754H11.4826C11.643 16.5754 11.6965 16.5239 11.6965 16.1629H18.541C18.541 16.5239 18.5944 16.5754 18.7548 16.5754H20.9472C21.0541 16.5754 21.1076 16.4981 21.1076 16.1629H21.4285C21.4285 16.1629 21.5354 14.8997 21.5354 13.6879C21.5354 12.4762 21.4017 11.7543 21.3215 11.6254ZM11.6232 12.784C11.1363 12.8354 10.6469 12.8617 10.157 12.8629C9.61109 12.8629 9.59237 12.8967 9.55387 12.568C9.53939 12.4176 9.54397 12.266 9.56751 12.1166L9.58435 12.0379H9.66456C9.98539 12.0379 10.2867 12.0511 10.8557 12.2127C11.145 12.2965 11.4172 12.4278 11.6601 12.601C11.7767 12.6825 11.8034 12.7598 11.8034 12.7598L11.6232 12.784ZM18.2313 14.6403L18.1132 14.9254H12.1243C12.1243 14.9254 12.1347 14.9097 11.9906 14.6372C11.8837 14.4356 12.0173 14.3067 12.2288 14.2335C12.6384 14.0912 13.8354 13.6879 15.1187 13.6879C16.4021 13.6879 17.6228 14.0355 18.0196 14.2335C18.1666 14.3067 18.3493 14.3583 18.2313 14.6418V14.6403ZM11.3602 11.1204C11.2738 11.1252 11.1872 11.1258 11.1008 11.1222C11.1706 11.0026 11.2094 10.8693 11.2775 10.7301C11.4914 10.2918 11.7361 9.79574 12.1716 9.58666C12.801 9.2845 14.1054 9.14838 15.1187 9.14838C16.132 9.14838 17.4365 9.28347 18.0659 9.58666C18.5014 9.79574 18.7449 10.292 18.9599 10.7301C19.0286 10.8706 19.0669 11.0049 19.1385 11.1253C19.085 11.1281 19.0235 11.1253 18.8768 11.1204H11.3602ZM20.6568 12.567C20.5996 12.8887 20.6531 12.8629 20.0804 12.8629C19.5906 12.8617 19.1011 12.8354 18.6142 12.784C18.538 12.7709 18.5164 12.6469 18.5773 12.601C18.819 12.4259 19.0916 12.2944 19.3818 12.2127C19.9507 12.0511 20.271 12.0294 20.5873 12.0403C20.6086 12.041 20.6288 12.0494 20.644 12.0637C20.6593 12.0779 20.6685 12.0972 20.6699 12.1176C20.6851 12.2677 20.6807 12.419 20.6568 12.568V12.567Z"
              //       fill="white"
              //     />
              //     <path
              //       fillRule="evenodd"
              //       clipRule="evenodd"
              //       d="M12.4255 7.82687C12.4118 7.68896 12.3664 7.63794 12.2159 7.63794H11.4903C11.4874 7.63175 11.4842 7.62531 11.4812 7.61886C11.4386 7.52907 11.3993 7.44538 11.3626 7.36718C10.9961 6.58636 10.8864 6.35261 10.2514 6.04749C9.31427 5.59813 7.55745 5.57544 6.86872 5.57544C6.18 5.57544 4.42317 5.59813 3.48687 6.04749C2.90069 6.32839 2.818 6.49501 2.48409 7.16781C2.41958 7.29778 2.34571 7.44664 2.25701 7.61886C2.25701 7.62075 2.25452 7.6247 2.25136 7.62971C2.24977 7.63223 2.24801 7.63501 2.24632 7.63794H1.5199C1.30761 7.63794 1.30601 7.74106 1.30601 8.05044C1.30601 8.30653 1.38275 8.34293 1.49903 8.39808C1.51151 8.404 1.52446 8.41014 1.53781 8.41679C1.53781 8.41679 0.77289 8.77231 0.665946 8.87544C0.559001 8.97856 0.452057 9.70044 0.452057 10.9379C0.452057 12.1754 0.559001 13.4129 0.559001 13.4129H0.87823C0.87823 13.7739 0.933307 13.8254 1.09372 13.8254H3.23261C3.39303 13.8254 3.4465 13.7739 3.4465 13.4129H7.93844C7.93691 13.3043 7.93607 13.1947 7.93607 13.0852C7.93607 12.7414 7.94433 12.4374 7.95854 12.1754H3.87428C3.87428 12.1754 3.88471 12.1597 3.7406 11.8872C3.63365 11.6856 3.76733 11.5567 3.97882 11.4835C4.38841 11.3412 5.58539 10.9379 6.86872 10.9379C7.30855 10.9379 7.74104 10.9788 8.13552 11.0404C8.14033 11.0332 8.14514 11.0273 8.14996 11.0227C8.25691 10.9196 9.02183 10.5641 9.02183 10.5641C9.00847 10.5574 8.99553 10.5513 8.98304 10.5453C8.86677 10.4902 8.79002 10.4538 8.79002 10.1977C8.79002 9.88832 8.79163 9.7852 9.00391 9.7852H9.73033L9.73537 9.77697C9.73854 9.77196 9.74103 9.76801 9.74103 9.76612C9.8297 9.59395 9.90356 9.44513 9.96805 9.31518L9.9681 9.31507C10.2282 8.79109 10.3358 8.57412 10.6477 8.37109C10.6409 8.37086 10.6339 8.37062 10.6267 8.37038H3.11016C3.0238 8.37519 2.93724 8.37579 2.85082 8.37219C2.89097 8.30336 2.92086 8.23 2.95198 8.1536C2.97495 8.09721 2.9986 8.03917 3.02755 7.98006C3.24144 7.54178 3.48607 7.04574 3.9216 6.83666C4.55097 6.5345 5.85542 6.39838 6.86872 6.39838C7.88202 6.39838 9.18648 6.53347 9.81584 6.83666C10.2514 7.04574 10.4949 7.54203 10.7099 7.98006C10.7386 8.03867 10.7619 8.09621 10.7846 8.15211C10.8001 8.19035 10.8154 8.22782 10.8317 8.26435C10.8748 8.24172 10.921 8.21865 10.9709 8.19475C11.3594 8.00827 11.8893 7.89527 12.4255 7.82687ZM1.90704 10.1129C2.39688 10.1117 2.8863 10.0854 3.37324 10.034L3.55345 10.0098C3.55345 10.0098 3.52671 9.93247 3.41014 9.851C3.1672 9.67782 2.89502 9.54647 2.60565 9.46274C2.03671 9.30109 1.73539 9.28794 1.41456 9.28794H1.33435L1.3175 9.36657C1.29396 9.51596 1.28939 9.66755 1.30387 9.818C1.3388 10.1162 1.35744 10.1161 1.76821 10.1135C1.81023 10.1132 1.85636 10.1129 1.90704 10.1129Z"
              //       fill="white"
              //     />
              //   </svg>
              ) : null}
            </div>
          </div>
        ) : null}

        <button className="np-new-transaction-confirm" onClick={() => {
          if (this.props.type === TransactionType.TRANSFER) {
            if (!this.state.recipientCard) return CEF.alert.setAlert("error", "Для перевода средств необходимо указать корректный счёт получателя");
            if (this.state.transactionAmount < 100 || this.state.transactionAmount > 100000)
              return CEF.alert.setAlert("error", "Для перевода средств укажите сумму от 100$ до 100000$");
            if (CEF.user.bank < this.state.transactionAmount) 
              return CEF.alert.setAlert("error", "На вашем счету недостаточно средств");
            CustomEvent.triggerServer('phone:sendMoney', this.state.recipientCard, systemUtil.parseInt(this.state.transactionAmount));
          }
          else if (this.props.type === TransactionType.TAX) {
            if (!this.state.transactionAmount)
              return CEF.alert.setAlert("error", "Неверная сумма");
            if (this.state.transactionAmount > this.props.taxSum) {
              return CEF.alert.setAlert("error", "Сумма превышает максимальную");
            }
            this.props.setNewTransactionAmount(this.state.tax)
            CustomEvent.triggerServer('phone:payTax', this.props.taxCategory, this.props.taxSum);
          }
        }}>
          {this.props.type === TransactionType.TRANSFER
            ? "Перевести"
            : "Оплатить"}
        </button>
      </div>
    );
  }
}

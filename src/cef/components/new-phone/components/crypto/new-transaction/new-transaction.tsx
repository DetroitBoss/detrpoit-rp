import React, {Component} from "react";
import "./new-transaction.less";
import {MINING_SELL_COEFFICIENT, MINING_TF_INDEX_BASE_COIN} from "../../../../../../shared/mining";
import {systemUtil} from "../../../../../../shared/system";
import {CryptoTransactionType} from "../../../../../../shared/phone/cryptoTransactionType.enum";
import {CustomEvent} from "../../../../../modules/custom.event";
import {system} from "../../../../../modules/system";

export class NewTransaction extends Component<
  {},
  {
    cryptoInputValue: number;
    dollarsInputValue: number;
    type: CryptoTransactionType;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      cryptoInputValue: null,
      dollarsInputValue: null,
      type: CryptoTransactionType.WITHDRAW,
    };
    this.onCryptoInputChange = this.onCryptoInputChange.bind(this);
    this.onDollarsInputChange = this.onDollarsInputChange.bind(this);
  }

  onCryptoInputChange(e: any) {
    this.setState({ ...this.state, 
      cryptoInputValue: e.currentTarget.value,
      dollarsInputValue: this.state.type === CryptoTransactionType.WITHDRAW 
          ? e.currentTarget.value * MINING_SELL_COEFFICIENT 
          : e.currentTarget.value * MINING_TF_INDEX_BASE_COIN
    });

  }
  onDollarsInputChange(e: any) {
    //this.setState({ ...this.state, dollarsInputValue: e.target.value });
  }

  render() {
    return (
      <div className="np-crypto-nt">
        <div
          className={
            this.state.type === CryptoTransactionType.WITHDRAW
              ? "np-crypto-selector withdraw"
              : "np-crypto-selector buy"
          }
        >
          <button
            className="np-crypto-nt-withdraw"
            onClick={() =>
              this.setState({
                ...this.state,
                cryptoInputValue: 0,
                dollarsInputValue: 0,
                type: CryptoTransactionType.WITHDRAW,
              })
            }
          >
            Вывести
          </button>
          <button
            className="np-crypto-nt-buy"
            onClick={() =>
              this.setState({ ...this.state,
                cryptoInputValue: null,
                dollarsInputValue: null, 
                type: CryptoTransactionType.BUY
              })
            }
          >
            Купить
          </button>
        </div>
        <label className="np-crypto-form-field">
          Введите сумму
          <input
              type="number"
              placeholder="00000"
              value={this.state.cryptoInputValue ?? 0}
              //ref={this.cryptoInputRef}
              onChange={this.onCryptoInputChange}
          />
          <div className="input-value">
            <div className="np-crypto-form-field-icon">
              <svg
                width="14"
                height="16"
                viewBox="0 0 14 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.27136 4.24823C3.44724 3.80169 3.72864 3.42957 4.11558 3.16909C4.50251 2.90861 4.92462 2.75977 5.38191 2.75977L14 2.75977L10.7286 11.2068C10.5528 11.6533 10.2714 12.0254 9.88442 12.2859C9.49749 12.5464 9.07538 12.6952 8.61809 12.6952L0 12.6952L3.27136 4.24823ZM3.97487 9.86717H8.0201C8.12563 9.86717 8.23116 9.82996 8.33668 9.75554C8.44221 9.68111 8.51256 9.60669 8.54774 9.49506L10.0603 5.62506L5.94472 5.62506C5.69849 5.62506 5.52261 5.7739 5.45226 5.99717L3.97487 9.86717Z"
                  fill="black"
                />
                <rect
                  x="8.75986"
                  width="1.35484"
                  height="15.3548"
                  transform="rotate(18 8.75986 0)"
                  fill="black"
                />
              </svg>
            </div>
            {systemUtil.numberFormat(this.state.cryptoInputValue ?? 0)}
          </div>
        </label>
        <label className="np-crypto-form-field">
          Сумма ($)
          <input
            type="number"
            placeholder="00000"
            //ref={this.dollarsInputRef}
            value={this.state.dollarsInputValue ?? 0}
            onChange={this.onDollarsInputChange}
          />
          <div className="input-value">
            <div className="np-crypto-form-field-icon">$</div>
            {systemUtil.numberFormat(this.state.dollarsInputValue ?? 0)}
          </div>
        </label>
        <button className="np-crypto-transaction-btn" onClick={(event) => {
          CustomEvent.triggerServer('mining:exchange', systemUtil.parseInt(this.state.cryptoInputValue), this.state.type) 
        }}>{this.state.type}</button>
      </div>
    );
  }
}

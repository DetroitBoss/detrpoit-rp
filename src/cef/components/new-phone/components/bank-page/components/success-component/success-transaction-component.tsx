import React, { Component } from "react";
import "./success-transaction-component.less";
import png from "../../../../../assets/*.png";
import {BankPages} from "../../enums/bankPages.enum";

export class SuccessTransactionComponent extends Component<
  {
    transactionAmount: number;
    onPageChange: any;
  },
  {}
> {
  constructor(props: any) {
    super(props);
    this.format = this.format.bind(this)
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
  render() {
    return (
      <div className="np-success-transaction">
        <img
          className="np-success-transaction-bg"
          src={png["success-transaction-bg"]}
          alt=""
        />
        <div className="np-success-transaction-info">
          <div className="np-success-transaction-title">Перевод выполнен!</div>
          <div className="np-success-transaction-amount">
            $ {this.format(this.props.transactionAmount, 3)}
          </div>
        </div>
        <button
          className="np-new-transaction-confirm"
          onClick={() => this.props.onPageChange(BankPages.MAIN)}
        >
          Продолжить
        </button>
      </div>
    );
  }
}

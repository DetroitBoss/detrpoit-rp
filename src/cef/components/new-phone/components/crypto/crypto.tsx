import React, { Component } from "react";
import "./crypto.less";
import { NewTransaction } from "./new-transaction/new-transaction";
import PhoneCryptoData from "../../../../../shared/phone/phoneCryptoData";
import {CustomEvent} from "../../../../modules/custom.event";
import {systemUtil} from "../../../../../shared/system";

export class Crypto extends Component<
  {data: PhoneCryptoData},
  {
    progress: number;
    maxWithDrawnBalance: number;
    isTransaction: boolean;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      progress: 25,
      maxWithDrawnBalance: 1234561,
      isTransaction: false,
    };
    this.format = this.format.bind(this);
    //this.calcProgress = this.calcProgress.bind(this);
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

  componentDidMount() {
    // this.calcProgress()
  }

  // calcProgress() {
  //   console.log(this.state.withdrawnBalance / (this.state.maxWithDrawnBalance / 100));
  //   this.setState({
  //     ...this.state,
  //     progress:
  //       Math.trunc(this.state.withdrawnBalance / (this.state.maxWithDrawnBalance / 100)),
  //   }, () => console.log(this.state));
  // }

  render() {
    return (
      <div className="np-crypto-wrap">
        <div className="np-crypto-balance-wrap">
          {this.state.isTransaction !== true ? (
            <div className="np-crypto-title">
              <span>Crypto</span>Счет
            </div>
          ) : (
            <button
              className="np-crypto-back-btn"
              onClick={() =>
                this.setState({
                  ...this.state,
                  isTransaction: !this.state.isTransaction,
                })
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.625 12.5L3.125 8L7.625 3.5M3.75 8H12.875"
                  stroke="#3A9FFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Назад
            </button>
          )}

          <div className="np-crypto-balance-label">Баланс</div>
          <div className="np-crypto-balance">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                y="20"
                width="28.2843"
                height="28.2843"
                transform="rotate(-45 0 20)"
                fill="#514F7A"
              />
              <path
                d="M14.9416 15.0464C15.1919 14.4108 15.5925 13.8811 16.1433 13.5104C16.694 13.1396 17.2948 12.9277 17.9457 12.9277L30.2127 12.9277L25.5563 24.9512C25.3059 25.5868 24.9054 26.1165 24.3546 26.4872C23.8039 26.858 23.203 27.0699 22.5521 27.0699H10.2852L14.9416 15.0464ZM15.943 23.0444H21.7009C21.8511 23.0444 22.0014 22.9914 22.1516 22.8855C22.3018 22.7796 22.4019 22.6736 22.452 22.5147L24.605 17.0062H18.7469C18.3964 17.0062 18.146 17.218 18.0459 17.5358L15.943 23.0444Z"
                fill="white"
              />
              <rect
                x="22.7539"
                y="9"
                width="1.92847"
                height="21.856"
                transform="rotate(18 22.7539 9)"
                fill="white"
              />
            </svg>
            {this.format(this.props.data?.cryptoBalance ?? 0, 3)}
          </div>
        </div>
        {this.state.isTransaction !== true ? (
          <>
            <div className="np-crypto-stats-wrap">
              <div className="np-crypto-stats-title">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 19.375H1.875V11.875H5V19.375ZM13.75 19.375H10.625V8.125H13.75V19.375ZM18.125 19.375H15V3.75H18.125V19.375ZM9.375 19.375H6.25V0.625H9.375V19.375Z"
                    fill="#514F7A"
                  />
                </svg>
                Статистика
              </div>
              <div className="np-crypto-stats-label">Сегодня вывели</div>
              <div className="np-crypto-withdrawn-balance">
                <svg
                  width="26"
                  height="28"
                  viewBox="0 0 26 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.07538 7.88929C6.40201 7.06 6.92462 6.36893 7.64322 5.88518C8.36181 5.40143 9.14573 5.125 9.99498 5.125L26 5.125L19.9246 20.8123C19.598 21.6416 19.0754 22.3327 18.3568 22.8164C17.6382 23.3002 16.8543 23.5766 16.005 23.5766L0 23.5766L6.07538 7.88929ZM7.38191 18.3245H14.8945C15.0905 18.3245 15.2864 18.2554 15.4824 18.1171C15.6784 17.9789 15.809 17.8407 15.8744 17.6334L18.6834 10.4463L11.0402 10.4463C10.5829 10.4463 10.2563 10.7227 10.1256 11.1373L7.38191 18.3245Z"
                    fill="#514F7A"
                  />
                  <rect
                    x="16.2683"
                    width="2.51613"
                    height="28.5161"
                    transform="rotate(18 16.2683 0)"
                    fill="#514F7A"
                  />
                </svg>
                {systemUtil.numberFormat(this.props.data?.dailyWithdrawal ?? 0)}
              </div>
              <div
                className="radial-progress"
                data-progress={this.state.progress}
              >
                <div className="circle">
                  <div className="mask full">
                    <div className="fill"></div>
                  </div>
                  <div className="mask half">
                    <div className="fill"></div>
                    <div className="fill fix"></div>
                  </div>
                  <div className="shadow"></div>
                </div>
                <div className="inset"></div>
              </div>
              {/* <button onClick={() => this.setState({...this.state, progress: this.state.progress + 5})}>+5</button>
        <button onClick={() => this.setState({...this.state, progress: this.state.progress - 5})}>-5</button> */}
            </div>
            <div
              className="np-crypto-new-transaction"
              onClick={() =>
                this.setState({ ...this.state, isTransaction: true })
              }
            >
              <div className="np-crypto-transaction-icon">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <path
                      d="M14 18.2262C13.1327 18.2262 12.2911 18.1141 11.4886 17.9043V21.056H8.56348L13.9994 27.9993L19.4353 21.056H16.5102V17.9046C15.7081 18.1142 14.8669 18.2262 14 18.2262Z"
                      fill="#7D78F9"
                    />
                    <path
                      d="M14 16.5864C18.5729 16.5864 22.2932 12.8661 22.2932 8.29322C22.2932 3.72033 18.5729 0 14 0C9.42718 0 5.70685 3.72033 5.70685 8.29322C5.70685 12.8661 9.42712 16.5864 14 16.5864ZM13.178 4.41086V3.34034H14.8184V4.40392H16.2529V6.04439H13.3489C12.9718 6.04439 12.6651 6.35116 12.6651 6.72825C12.6651 7.10535 12.9719 7.41212 13.3489 7.41212H15.0689C16.3842 7.41212 17.4541 8.48209 17.4541 9.79726C17.4541 11.1125 16.3842 12.1825 15.0689 12.1825H14.8184V13.246H13.178V12.1825H11.3625V10.542H15.0689C15.4796 10.542 15.8136 10.2079 15.8136 9.79726C15.8136 9.38665 15.4796 9.05259 15.0689 9.05259H13.3488C12.0672 9.05259 11.0246 8.0099 11.0246 6.72825C11.0246 5.50419 11.9759 4.49879 13.178 4.41086Z"
                      fill="#7D78F9"
                    />
                  </g>
                </svg>
              </div>
              <div className="np-crypto-transaction-desc">
                <div className="np-crypto-transaction-name">
                  Обмен и продажа
                </div>
                <div className="np-crypto-transaction-label">
                  Выводы и покупки криптовалюты
                </div>
              </div>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.625 5.25L15.375 12L8.625 18.75"
                  stroke="white"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="square"
                />
              </svg>
            </div>
          </>
        ) : (
          <NewTransaction />
        )}
      </div>
    );
  }
}

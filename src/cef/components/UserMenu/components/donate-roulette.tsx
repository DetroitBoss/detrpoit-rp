import React, { Component } from "react";
import "./style.less";
import { CEF } from "../../../modules/CEF";
import png from "./assets/*.png";
import { RulettePage } from "./rulette/rulette";
import { system } from "../../../modules/system";

export enum ModalType {
  STANDART = "standart",
  PREMIUM = "premium",
  LUXE = "luxe",
  STORE = "prize-store",
  WINNING = "winning",
}

// Это пример компонента под реакт для быстрого создания уже рабочего экземпляра.
export class DonateRoulette extends Component<
  {
    // show: boolean
    coins: number;
    dollars: number;
    close: any;
  },
  {
    r: boolean;
    type: ModalType;
    isClose: boolean;
    roulettsList: { type: ModalType; cost: number }[];
  }
> {
  public balance = {
    d: system.numberFormat(CEF.user.money),
    c: this.props.coins,
  };
  /** Это наш ивент, через который интерфейс может получать данные от клиента или сервера */
  constructor(props: any) {
    super(props);
    this.state = {
      r: false,
      type: null,
      isClose: true,
      roulettsList: [
        { type: ModalType.STANDART, cost: 200 },
        { type: ModalType.PREMIUM, cost: 500 },
        { type: ModalType.LUXE, cost: 1000 },
      ],
      /** По умолчанию используется значение CEF.test. true будет если мы в браузере проверяем интерфейс.*/
    };
  }

  render() {
    return (
      <div className="tabs__content-wrap">
        <div className="modal-wrapper">
          <div className="modal-header">
            <div className="btns">
              <button
                className="btn back"
                onClick={() => {
                  this.state.isClose === true
                    ? this.props.close()
                    : this.setState({ r: false, type: null, isClose: true });
                }}
              >
                <div className="icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="arrow-left">
                      <path
                        id="icon"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.41414 12.0001L16.707 4.70718L15.2928 3.29297L6.58571 12.0001L15.2928 20.7072L16.707 19.293L9.41414 12.0001Z"
                        fill="#F2F2F2"
                      />
                    </g>
                  </svg>
                </div>
                <span>Назад</span>
              </button>
              {this.state.type === ModalType.STORE ? (
                <></>
              ) : this.state.r === false ?
                <button
                  className="btn white"
                  onClick={() => {
                    this.setState({
                      r: true,
                      type: ModalType.STORE,
                      isClose: false,
                    });
                  }}
                >
                  <div className="icon">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="white"
                      className="svg-icon books"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M3.55932 5.39999H0.508474C0.20339 5.39999 0 5.57999 0 5.84999V17.55C0 17.82 0.20339 18 0.508474 18H3.55932C3.8644 18 4.06779 17.82 4.06779 17.55V5.84999C4.06779 5.57999 3.8644 5.39999 3.55932 5.39999Z" />
                      <path d="M14.8474 2.70009C14.7457 2.43009 14.5424 2.34007 14.2373 2.34007L11.2881 2.88004C10.983 2.97004 10.8813 3.15013 10.8813 3.42013L14.0339 17.5501C14.1356 17.8201 14.339 17.9101 14.6441 17.9101L17.5932 17.3701C17.8983 17.2801 18 17.1 18 16.83L14.8474 2.70009Z" />
                      <path d="M9.661 0H6.61016C6.30507 0 6.10168 0.18 6.10168 0.45V17.55C6.10168 17.82 6.30507 18 6.61016 18H9.661C9.96609 18 10.1695 17.82 10.1695 17.55V0.45C10.1695 0.18 9.96609 0 9.661 0Z" />
                    </svg>
                  </div>
                  <span>Хранилище призов</span>
                </button>
              : null}
            </div>
            {this.state.type === ModalType.STORE ? (
              <div className="balance">
                <div className="dollars">
                  <p className="dollars-main">${this.props.dollars}</p>
                  <p className="dollars-second">${CEF.user.bank}</p>
                </div>
                <div className="coins">
                  <svg
                    width="22"
                    height="22"
                    className="coin-icon"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 11C0 17.0751 4.92487 22 11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0C4.92487 0 0 4.92487 0 11ZM20 11C20 15.9706 15.9706 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11ZM14 6C15.1046 6 16 6.89543 16 8V14C16 15.1046 15.1046 16 14 16H8C6.89543 16 6 15.1046 6 14V8C6 6.89543 6.89543 6 8 6H14ZM8 14V8H14V14H8Z"
                    />
                  </svg>
                    <span>{this.props.coins}</span>  
                </div>
              </div>
            ) : null}
          </div>
          {this.state.r === false ? (
            <div className="dr-wrap">
              <div className="dr-title">Roulette menu</div>
              <div className="dr-rouletts-list">
                {this.state.roulettsList.map((r) => {
                  return (
                    <div
                      className="dr-roulette-item"
                      onClick={() =>
                        this.setState({ r: true, type: r.type, isClose: false })
                      }
                    >
                      <div className="dr-roulette-item-title">{r.type}</div>
                      <div className="dr-roulette-item-cost">
                        {r.cost}
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM15 7C16.1046 7 17 7.89543 17 9V15C17 16.1046 16.1046 17 15 17H9C7.89543 17 7 16.1046 7 15V9C7 7.89543 7.89543 7 9 7H15ZM9 15V9H15V15H9Z"
                            fill="#FFBC10"
                          />
                        </svg>
                      </div>
                      <img
                        className={"dr-roulette-item-img " + r.type}
                        src={png[r.type]}
                        alt=""
                      />
                    </div>
                  );
                })}
              </div>
              {/* <div className="dr-parent left">
                <div
                  className="dr-leftBlock"  
                  onClick={() => {
                    this.setState({ r: true, type: ModalType.DEFAULT, isClose: false });
                  }}
                >
                  <img
                    className="dr-block-image left"
                    src={png["default-chance"]}
                    alt=""
                  />
                </div>
              </div>
              <div className="dr-parent right">
                <div
                  className="dr-rightBlock"
                  onClick={() => {
                    this.setState({ r: true, type: ModalType.CHANCE, isClose: false });
                  }}
                >
                  <img
                    className="dr-block-image right"
                    src={png["big-chance"]}
                    alt=""
                  />
                </div>
              </div> */}
            </div>
          ) : (
            <RulettePage
              backToSelect={() => {
                this.setState({ r: false, type: null });
              }}
              toWinning={(d) => {
                this.setState({ r: true, type: ModalType.WINNING });
                CEF.playSound("roulette-win");
              }}
              type={this.state.type}
              coins={this.props.coins}
            />
          )}
        </div>
      </div>
    );
  }
}

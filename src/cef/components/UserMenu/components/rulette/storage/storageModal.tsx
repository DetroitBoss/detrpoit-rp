﻿import React, { Component } from "react";
import "./storageModal.less";
//import svg from "*.svg";
// Это пример компонента под реакт для быстрого создания уже рабочего экземпляра.
export class StorageModal extends Component<
  {
    show: boolean;
    totalDollars: number;
    totalDonate: number;
    itemsCount: number;
    closeModal(): void;
    sellPressed(): void;
  },
  {}
> {
  /** Это наш ивент, через который интерфейс может получать данные от клиента или сервера */
  constructor(props: any) {
    super(props);
    this.state = {
      show: false,
      totalDollars: 0,
      totalDonate: 0,
      itemsCount: 0,
    };
  }

  render() {
    return (
      <div>
        {this.props.show ? (
          <div className="storage-modal">
            <button className="close" onClick={this.props.closeModal}>
              ×
            </button>
            <div className="modalText-wrap">
              <span>
                {`Вы уверены, что хотите продать ${this.props.itemsCount} предметов `}
                за{" "}
                {this.props.totalDonate ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.75 9C0.75 13.5563 4.44365 17.25 9 17.25C13.5563 17.25 17.25 13.5563 17.25 9C17.25 4.44365 13.5563 0.75 9 0.75C4.44365 0.75 0.75 4.44365 0.75 9ZM15.75 9C15.75 12.7279 12.7279 15.75 8.99999 15.75C5.27207 15.75 2.24999 12.7279 2.24999 9C2.24999 5.27208 5.27207 2.25 8.99999 2.25C12.7279 2.25 15.75 5.27208 15.75 9ZM11.25 5.25C12.0784 5.25 12.75 5.92157 12.75 6.75V11.25C12.75 12.0784 12.0784 12.75 11.25 12.75H6.75C5.92157 12.75 5.25 12.0784 5.25 11.25V6.75C5.25 5.92157 5.92157 5.25 6.75 5.25H11.25ZM6.74999 11.25V6.75H11.25V11.25H6.74999Z"
                      fill="black"
                    />
                  </svg>
                ) : (
                  ""
                )}
                {this.props.totalDonate ? this.props.totalDonate : ""}
                {this.props.totalDonate && this.props.totalDollars ? "и " : ""}
                {this.props.totalDollars ? "$" + this.props.totalDollars : ""}?
              </span>
            </div>
            <div className="buttons-wrap">
              <button
                onClick={this.props.sellPressed}
                className="modal-btn sell"
              >
                Продать
              </button>
              <button
                onClick={this.props.closeModal}
                className="modal-btn cancel"
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

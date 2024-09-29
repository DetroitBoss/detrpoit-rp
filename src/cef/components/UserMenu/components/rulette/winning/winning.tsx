import React, { Component } from "react";
import "./winning.less";
import { DropDataBase } from "../../../../../../shared/donate/donate-roulette/Drops/dropBase";
import png from "*.png";
import {
  drops,
  RarityType,
} from "../../../../../../shared/donate/donate-roulette/main";
import { Prize } from "../spinner/components/prize/prize";
import { VipDropData } from "../../../../../../shared/donate/donate-roulette/Drops/vipDrop";
import {
  DropSellType,
  RouletteType,
} from "../../../../../../shared/donate/donate-roulette/enums";
import { RealDropData } from "../../../../../../shared/donate/donate-roulette/Drops/realDrop";
import { VehicleDropData } from "../../../../../../shared/donate/donate-roulette/Drops/vehicleDrop";
import { StorageModal } from "../storage/storageModal";
import { CustomEvent } from "../../../../../modules/custom.event";

// Это пример компонента под реакт для быстрого создания уже рабочего экземпляра.
export class WinningPage extends Component<
  {
    displayDrops: DropDataBase[];
    takePressed(): void;
    coins: number;
  },
  {
    //displayDrops: DropDataBase[];
    modalShow: boolean;
  }
> {
  /** Это наш ивент, через который интерфейс может получать данные от клиента или сервера */
  constructor(props: any) {
    super(props);
    this.state = {
      //displayDrops: [],
      modalShow: false,
    };
    this.closeModal = this.closeModal.bind(this);
    this.sellPress = this.sellPress.bind(this);
  }

  sellPress() {
    this.setState({ modalShow: true });
  }

  getDonatePrice() {
    return this.props.displayDrops
      .filter((d) => d.sellType === DropSellType.DONATE)
      .map((e) => e.sellPrice)
      .reduce((a, b) => a + b, 0);
  }

  getDollarsPrice() {
    return this.props.displayDrops
      .filter((d) => d.sellType === DropSellType.DOLLARS)
      .map((e) => e.sellPrice)
      .reduce((a, b) => a + b, 0);
  }

  closeModal() {
    this.setState({ modalShow: false });
  }

  render() {
    return (
      <div className="winning-wrap">
        <StorageModal
          sellPressed={() => {
            CustomEvent.triggerServer(
              "droulette:sellDrops",
              this.props.displayDrops.map((d) => d.dropId)
            );
            this.closeModal();
            this.props.takePressed();
          }}
          closeModal={this.closeModal}
          show={this.state.modalShow}
          totalDollars={this.getDollarsPrice()}
          totalDonate={this.getDonatePrice()}
          itemsCount={this.props.displayDrops.length}
        />
        <div className="balance dark">
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
        <div className="winning-header">
          <h1>Поздравляем</h1>
          <h1 className="header-bold">Вы выиграли:</h1>
        </div>
        <div className="winning-items">
          {this.props.displayDrops.map((item) => {
            return <Prize key={item.dropId} item={item} />;
          })}
        </div>
        <img className="win-blink" src={png["blink"]} />
        <div className="winning-buttons">
          <button className="btn orange" onClick={this.props.takePressed}>
            <div className="icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.6673 10V18.3333H3.33398V10"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.3327 5.83032H1.66602V9.99699H18.3327V5.83032Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 18.3303V5.83032"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 5.83634H13.75C14.3025 5.83634 14.8324 5.61685 15.2231 5.22615C15.6138 4.83545 15.8333 4.30555 15.8333 3.75301C15.8333 3.20048 15.6138 2.67057 15.2231 2.27987C14.8324 1.88917 14.3025 1.66968 13.75 1.66968C10.8333 1.66968 10 5.83634 10 5.83634Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.99935 5.83634H6.24935C5.69681 5.83634 5.16691 5.61685 4.77621 5.22615C4.38551 4.83545 4.16602 4.30555 4.16602 3.75301C4.16602 3.20048 4.38551 2.67057 4.77621 2.27987C5.16691 1.88917 5.69681 1.66968 6.24935 1.66968C9.16602 1.66968 9.99935 5.83634 9.99935 5.83634Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span>
              {this.props.displayDrops.length === 1
                ? "Забрать приз"
                : "Забрать призы"}
            </span>
          </button>
          <button className="btn orange empty" onClick={this.sellPress}>
            <div className="icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0)">
                  <path
                    d="M16.6673 18.3334C17.1276 18.3334 17.5007 17.9603 17.5007 17.5001C17.5007 17.0398 17.1276 16.6667 16.6673 16.6667C16.2071 16.6667 15.834 17.0398 15.834 17.5001C15.834 17.9603 16.2071 18.3334 16.6673 18.3334Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.50033 18.3334C7.96056 18.3334 8.33366 17.9603 8.33366 17.5001C8.33366 17.0398 7.96056 16.6667 7.50033 16.6667C7.04009 16.6667 6.66699 17.0398 6.66699 17.5001C6.66699 17.9603 7.04009 18.3334 7.50033 18.3334Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M0.833984 0.833252H4.16732L6.40065 11.9916C6.47686 12.3752 6.68557 12.7199 6.99027 12.9652C7.29497 13.2104 7.67623 13.3407 8.06732 13.3333H16.1673C16.5584 13.3407 16.9397 13.2104 17.2444 12.9652C17.5491 12.7199 17.7578 12.3752 17.834 11.9916L19.1673 4.99992H5.00065"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <span>{`Продать за ${
              this.getDonatePrice() === 0 ? "" : this.getDonatePrice()
            }
                          
                            ${
                              this.getDollarsPrice() === 0
                                ? " "
                                : "$" + this.getDollarsPrice()
                            }`}</span>
          </button>
        </div>
      </div>
    );
  }
}

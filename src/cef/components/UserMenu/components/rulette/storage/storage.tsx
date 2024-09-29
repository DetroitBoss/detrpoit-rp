import React, { Component } from "react";
import "./storage.less";
import { Prize } from "../spinner/components/prize/prize";
import {
  drops,
  RarityType,
} from "../../../../../../shared/donate/donate-roulette/main";
import { DropDataBase } from "../../../../../../shared/donate/donate-roulette/Drops/dropBase";
import { DropSellType } from "../../../../../../shared/donate/donate-roulette/enums";
import { StorageModal } from "./storageModal";
import { CustomEvent } from "../../../../../modules/custom.event";
import { CustomEventHandler } from "../../../../../../shared/custom.event";
import { RealDropData } from "../../../../../../shared/donate/donate-roulette/Drops/realDrop";
import svg from "./../../assets/*.svg";
import png from "./../../assets/*.png";
import prizesPng from "./../../assets/items/*.png";
// Это пример компонента под реакт для быстрого создания уже рабочего экземпляра.
export class StoragePage extends Component<
  {},
  {
    dropItems: DropDataBase[];
    totalDollars: number;
    totalDonate: number;
    modalShow: boolean;
  }
> {
  private ev: CustomEventHandler;
  constructor(props: any) {
    super(props);
    this.state = {
      dropItems: [],
      totalDollars: 0,
      totalDonate: 0,
      modalShow: false,
    };
    this.press = this.press.bind(this);
    this.sellPress = this.sellPress.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.activate = this.activate.bind(this);
    this.ev = CustomEvent.register("donateStorage:set", (dropIds: number[]) => {
      const array: DropDataBase[] = [];
      dropIds.forEach((e) => {
        const item = drops.find((d) => d.dropId === e);
        if (!item) {
          return;
        }

        const clone: DropDataBase = new RealDropData(
          item.dropId,
          item.icon,
          item.name,
          item.rarity,
          item.roulette,
          item.sellType,
          item.sellPrice
        );
        clone.selected = false;
        array.push(clone);
      });
      this.setState({
        dropItems: array,
      });
    });
    CustomEvent.triggerServer("donateStorage:request");
  }

  press(item: DropDataBase) {
    item.selected = !item.selected;

    // const selected = this.state.selectedDrops;
    // const selectedItem = selected.find(s => s === item.dropId);
    // if (selectedItem !== undefined)
    //   selected.splice(selected.indexOf(selectedItem), 1);
    // else selected.push(item.dropId)

    this.setState({
      totalDollars: this.state.dropItems
        .filter((d) => d.selected && d.sellType === DropSellType.DOLLARS)
        .map((e) => e.sellPrice)
        .reduce((a, b) => a + b, 0),
      totalDonate: this.state.dropItems
        .filter((d) => d.selected && d.sellType === DropSellType.DONATE)
        .map((e) => e.sellPrice)
        .reduce((a, b) => a + b, 0),
    });
  }

  sellPress() {
    this.setState({ modalShow: true });
  }

  closeModal() {
    this.setState({ modalShow: false });
  }

  activate() {
    CustomEvent.triggerServer(
      "droulette:activateDrops",
      this.state.dropItems.filter((d) => d.selected).map((e) => e.dropId)
    );
    CustomEvent.triggerServer("donateStorage:request");
  }

  render() {
    return (
      <div className="storage-page">
        <StorageModal
          sellPressed={() => {
            CustomEvent.triggerServer(
              "droulette:sellDrops",
              this.state.dropItems
                .filter((d) => d.selected)
                .map((e) => e.dropId)
            );
            CustomEvent.triggerServer("donateStorage:request");
            this.closeModal();
          }}
          closeModal={this.closeModal}
          show={this.state.modalShow}
          totalDollars={this.state.totalDollars}
          totalDonate={this.state.totalDonate}
          itemsCount={this.state.dropItems.filter((d) => d.selected).length}
        />
        <div className="storage-wrapper">
          <h1 className="storage-header">
            Хранилище
            <br />
            призов
          </h1>
          <div className="storage-actions">
            <p className="actions-header">Выберите предметы</p>
            <div className="actions-buttons">
              <button className="btn orange empty" onClick={this.sellPress}>
                <div className="icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0)">
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
                <span>
                  Продать за &nbsp;
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.75 9C0.75 13.5563 4.44365 17.25 9 17.25C13.5563 17.25 17.25 13.5563 17.25 9C17.25 4.44365 13.5563 0.75 9 0.75C4.44365 0.75 0.75 4.44365 0.75 9ZM15.75 9C15.75 12.7279 12.7279 15.75 8.99999 15.75C5.27207 15.75 2.24999 12.7279 2.24999 9C2.24999 5.27208 5.27207 2.25 8.99999 2.25C12.7279 2.25 15.75 5.27208 15.75 9ZM11.25 5.25C12.0784 5.25 12.75 5.92157 12.75 6.75V11.25C12.75 12.0784 12.0784 12.75 11.25 12.75H6.75C5.92157 12.75 5.25 12.0784 5.25 11.25V6.75C5.25 5.92157 5.92157 5.25 6.75 5.25H11.25ZM6.74999 11.25V6.75H11.25V11.25H6.74999Z"
                      fill="white"
                    />
                  </svg>
                  {`${this.state.totalDonate} и $${this.state.totalDollars}`}
                </span>
              </button>
              <button
                className="btn orange"
                onClick={() => {
                  CustomEvent.triggerServer(
                    "droulette:activateDrops",
                    this.state.dropItems
                      .filter((d) => d.selected)
                      .map((e) => e.dropId)
                  );
                  CustomEvent.triggerServer("donateStorage:request");
                }}
              >
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
                <span>Забрать призы</span>
              </button>
            </div>
          </div>

          <div className="dr-items-wrap">
            <div className="dr-roulette-items">
              {this.state.dropItems
                .sort((a, b) => {
                  if (a.rarity < b.rarity) {
                    return 1;
                  }
                  if (a.rarity > b.rarity) {
                    return -1;
                  }
                  return 0;
                })
                .map((i, key) => {
                  return (
                    <div
                      className={
                        i.selected ? "dr-item selected" : "dr-item"
                      }
                      onClick={() => this.press(i)}
                      key = {key}
                    >
                      <div className="item-checkmark">
                        <svg
                          width="17"
                          height="13"
                          viewBox="0 0 17 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.70711 9.29289L15 0L16.4142 1.41421L5.70711 12.1213L0 6.41421L1.41421 5L5.70711 9.29289Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                      <img
                        className="item-rarity-img"
                        src={
                          png[
                            i.rarity === RarityType.LEGENDARY
                              ? "gold"
                              : i.rarity === RarityType.SPECIAL
                              ? "red"
                              : i.rarity === RarityType.UNIQUE
                              ? "pink"
                              : i.rarity === RarityType.RARE
                              ? "purple"
                              : i.rarity === RarityType.COMMON
                              ? "blue"
                              : "red"
                          ]
                        }
                        alt=""
                      />
                      <img
                        className="item-img"
                        src={prizesPng[i.icon]}
                        alt=""
                      />
                      <div className="item-name">{i.name}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

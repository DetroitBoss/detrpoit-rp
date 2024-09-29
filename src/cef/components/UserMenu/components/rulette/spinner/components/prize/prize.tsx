import React, { Component } from "react";
import "./prize.less";
import png from "../../../../assets/*.png";
import prizePng from "../../../../assets/items/*.png";
import { RarityType } from "../../../../../../../../shared/donate/donate-roulette/main";
import { DropDataBase } from "shared/donate/donate-roulette/Drops/dropBase";

// Это пример компонента под реакт для быстрого создания уже рабочего экземпляра.
export class Prize extends Component<
  {
    item: DropDataBase;
    prizeType?: "storage" | "roulette";
    selected?: boolean;
    clicked?: any;
  },
  {}
> {
  /** Это наш ивент, через который интерфейс может получать данные от клиента или сервера */
  constructor(props: any) {
    super(props);
    this.state = {};

    this.press = this.press.bind(this);
  }

  press() {
    if (this.props.prizeType === "storage") {
      this.props.clicked();
      //this.setState({selected: !this.props.selected})
    }
  }

  render() {
    return (
      <div
        onClick={this.press}
        className={
          "prize " +
          (this.props.prizeType === "storage"
            ? this.props.selected
              ? "storage-selected "
              : "storage-default "
            : " ") +
          RarityType[this.props.item.rarity].toLowerCase()
        }
      >
        <div className="prize-name">{this.props.item.name}</div>
        <div className="prize-img">
          <img
            className="rarity-img"
            src={
              png[
                this.props.item.rarity === RarityType.LEGENDARY
                  ? "gold"
                  : this.props.item.rarity === RarityType.SPECIAL
                  ? "red"
                  : this.props.item.rarity === RarityType.UNIQUE
                  ? "pink"
                  : this.props.item.rarity === RarityType.RARE
                  ? "purple"
                  : this.props.item.rarity === RarityType.COMMON
                  ? "blue"
                  : "red"
              ]
            }
            alt=""
          />
          <img className="item-img" src={prizePng[`${this.props.item.icon}`]} alt="" />
        </div>
      </div>
    );
  }
}

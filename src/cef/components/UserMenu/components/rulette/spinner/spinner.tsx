import React, {Component} from "react";
import {CustomEvent} from "../../../../../modules/custom.event";
import "./spinner.less";
import {CEF} from "../../../../../modules/CEF";
import {CustomEventHandler} from "../../../../../../shared/custom.event";
import png from "./../../assets/*.png";
import prizesPng from "./../../assets/items/*.png";
import {ModalType} from "../../donate-roulette";
import {drops, RarityType,} from "../../../../../../shared/donate/donate-roulette/main";
import {DropDataBase} from "shared/donate/donate-roulette/Drops/dropBase";
// @ts-ignore
import Slot from "./slot.js";
import {DropSlot} from "./DropSlot";
import svg from "*.svg";

// Это пример компонента под реакт для быстрого создания уже рабочего экземпляра.
export class SpinnerPage extends Component<
  {
    type: string;
    spinFinished(winElements: DropDataBase[]): void;
    coins: number;
  },
  {
    dropItems: DropDataBase[];
    // <<<<<<< HEAD
    quantityPrizes: number;
    // =======

    width: number;
    height: number;
    canvas: React.RefObject<any>;
    parent: React.RefObject<any>;
    ctx: any;
    countElements: number;
    speed: number;
    frameRate: number;
    maxSpeed: number;
    duration: number;
    timeToStop: number;
    sizeItem: number;
    currentState: Slot[];
    itemList: DropSlot[];
    bgImg: null;
    lastFrame: number;
    headResult: Slot;
    winResult: Slot;
    winDrop: DropDataBase;
    cancel: boolean;
    antiFlood: number;
    stopFrom: number;
    sound: boolean;
    winBuilded: boolean;
    floodProtection: number;

    isRun: boolean;
    isStop: boolean;
    isWin: boolean;
    result: number;
    withoutAnimation: boolean;
    audio: any;
    spinCost: number;
    // >>>>>>> 1ee4c538ad946e4a3712006fcd219ca898dd378a
  }
> {
  private quantityPrizes: {
    name: string;
    value: number;
    checked?: boolean;
  }[] = [
    {
      name: "x1",
      value: 1,
      checked: true,
    },
    {
      name: "x3",
      value: 3,
    },
    {
      name: "x5",
      value: 5,
    }
  ];
  /** Это наш ивент, через который интерфейс может получать данные от клиента или сервера */
  private ev: CustomEventHandler;
  constructor(props: any) {
    super(props);
    this.state = {
      /** По умолчанию используется значение CEF.test. true будет если мы в браузере проверяем интерфейс.*/
      dropItems: drops,
      withoutAnimation: false,
      quantityPrizes: 1,
      width: 0,
      height: 0,
      canvas: React.createRef(),
      parent: React.createRef(),
      ctx: null,
      countElements: 9,
      speed: 0,
      frameRate: 36,
      maxSpeed: 60,
      duration: 2500,
      timeToStop: 0,
      sizeItem: 0,
      currentState: [],
      itemList: [],
      bgImg: null,
      lastFrame: 0,
      headResult: null,
      winResult: null,
      winDrop: null,
      cancel: false,
      antiFlood: 0,
      stopFrom: 0,
      sound: true,
      winBuilded: false,
      floodProtection: 0,
      spinCost:
        this.props.type === ModalType.LUXE
          ? 1000
          : this.props.type === ModalType.PREMIUM
          ? 500
          : this.props.type === ModalType.STANDART
          ? 200
          : null,

      isRun: false,
      isStop: false,
      isWin: false,
      result: -1,
      audio: null,
    };

    this.onChangeValue = this.onChangeValue.bind(this);

    this.addWinElement = this.addWinElement.bind(this);
    this.builWinCombination = this.builWinCombination.bind(this);
    this.updateState = this.updateState.bind(this);
    this.addRandomElement = this.addRandomElement.bind(this);
    this.initGame = this.initGame.bind(this);
    this.initImages = this.initImages.bind(this);
    this.removeElement = this.removeElement.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handleLoop = this.handleLoop.bind(this);
    this.drawFrame = this.drawFrame.bind(this);
    this.requestWin = this.requestWin.bind(this);
    this.start = this.start.bind(this);
    this.requestSpin = this.requestSpin.bind(this);

    this.ev = CustomEvent.register("droulette:spin", (winNumbers: number[]) => {
      if (winNumbers.length == 1)
        this.start(winNumbers[0]);
      else {
        const items = []
        for (let i = 0; i < winNumbers.length; i++) {
          items.push(this.state.itemList.find(item => item.data.dropId == winNumbers[i]).data)
        }
        this.props.spinFinished(items);
      }
    });
  }
  onChangeValue(event: any) {
    this.setState({ dropItems: drops, quantityPrizes: event.target.value, withoutAnimation: event.target.value > 1 ? true : this.state.withoutAnimation });
  }
  componentDidMount() {
    const parent = this.state.parent.current;
    let itemList: DropSlot[] = this.state.itemList;
    drops.filter(el => el.rarity !== RarityType.CASINO).forEach((d) => {
      //if (d.roulette.includes(this.props.type as RouletteType)) {
        itemList.push(new DropSlot(d));
      //}
    });
    this.setState({ ...this.state, itemList });

    this.setState({
      ctx: this.state.canvas.current.getContext("2d"),
      width: parent.clientWidth,
      // height: parent.offsetWidth / this.state.countElements,
      height: parent.clientHeight,
      canvas: this.state.canvas,
      frameRate: Math.floor(1000 / this.state.frameRate),
    });
    this.initImages();

    setTimeout(this.initGame, 500);
    //setTimeout(this.start, 1500);
  }

  // start() {
  //   if (!this.state.winBuilded) {
  //     this.setState({
  //       winBuilded: false,
  //       timeToStop: Date.now() + this.state.duration,
  //       isRun: true,
  //       isStop: false,
  //       isWin: false,
  //       result: 1,
  //     });
  //   }
  // }
  requestSpin() {
    if (this.state.isRun) return;

    CustomEvent.triggerServer("droulette:request", this.props.type, this.state.quantityPrizes);
  }

  start(winNumber: number) {
    // CEF.playSound("roulette-single-spin");
    // const audio = new Audio(spin);
    // audio.volume = 0.4;
    // audio.play();
    // //this.setState({audio: audio})
    // setTimeout(() => {
    //   audio.remove();
    // })
    if (this.state.withoutAnimation) {
      const item = this.state.itemList.find((i) => i.data.dropId == winNumber);
      this.props.spinFinished([item.data]);
    } else {
      if (!this.state.winBuilded) {
        this.setState({
          winBuilded: false,
          timeToStop: Date.now() + this.state.duration,

          isRun: true,
          isStop: false,
          isWin: false,
          result: winNumber,
        });
      }
    }
  }

  addWinElement(id: number) {
    const last = this.state.currentState[this.state.currentState.length - 1];
    let currentOffset = last ? last.posX + last.size : 0;

    const item = this.state.itemList.find((i) => i.data.dropId == id);
    const slot = new Slot(
      this.state.ctx,
      item,
      this.state.parent.current.clientWidth / 3,
      currentOffset
    );
    this.state.currentState.push(slot);
    this.setState({ winDrop: item.data });
    return slot;
  }

  builWinCombination(val: number) {
    this.setState({ winBuilded: true });
    for (let index = 0; index < this.state.countElements; index++) {
      if (index == 0) {
        this.setState({ headResult: this.addRandomElement() });
      } else if (index == 1) {
        this.setState({ winResult: this.addWinElement(val) });
      } else this.addRandomElement();
    }
  }

  componentWillUnmount() {
    if (this.ev) this.ev.destroy();
    CEF.stopSound();
  }

  updateState() {
    if (this.state.cancel) return;
    if (this.state.lastFrame < Date.now()) {
      if (this.state.isRun) {
        this.setState({ lastFrame: Date.now() + this.state.frameRate });

        if (this.state.timeToStop < Date.now()) this.setState({ isStop: true });

        if (this.state.isStop) this.handleStop();
        else this.handleLoop();
      }
      this.drawFrame();
    }

    //this.state.canvas.current.requestAnimationFrame(this.updateState)
    requestAnimationFrame(this.updateState, this.state.canvas.current);
  }

  addRandomElement() {
    const last = this.state.currentState[this.state.currentState.length - 1];
    let currentOffset = last ? last.posX + last.size : 0;

    const item =
      this.state.itemList[
        Math.floor(Math.random() * this.state.itemList.length)
      ];
    const slot = new Slot(
      this.state.ctx,
      item,
      this.state.parent.current.clientWidth / 3,
      currentOffset
    );
    this.state.currentState.push(slot);
    return slot;
  }

  initGame() {
    this.setState({ currentState: [] });

    for (let index = 0; index < this.state.countElements + 2; index++) {
      this.addRandomElement();
    }

    requestAnimationFrame(this.updateState, this.state.canvas);
  }

  initImages() {
    this.state.itemList.forEach((item) => {
      item.img = new Image(this.state.height, this.state.width);
      item.img.src =
        prizesPng[item.data.icon] === undefined
          ? prizesPng["1"]
          : prizesPng[item.data.icon];
      item.rarityImg = new Image(this.state.height, this.state.width);
      item.rarityImg.src =
        png[
          item.data.rarity === RarityType.LEGENDARY
            ? "gold"
            : item.data.rarity === RarityType.SPECIAL
            ? "red"
            : item.data.rarity === RarityType.UNIQUE
            ? "pink"
            : item.data.rarity === RarityType.RARE
            ? "purple"
            : item.data.rarity === RarityType.COMMON
            ? "blue"
            : "red"
        ];
    });
  }

  removeElement() {
    this.state.currentState.shift();
  }

  handleStop() {
    if (this.state.speed > this.state.maxSpeed * 0.8) {
      if (this.state.currentState[0].canDelete()) {
        this.removeElement();
        this.addRandomElement();
      }

      this.state.currentState.forEach((item) => {
        item.moveX(this.state.speed);
      });
      this.setState({ speed: this.state.speed - 1 });
    } else {
      if (!this.state.winBuilded) {
        this.builWinCombination(this.state.result);
        this.setState({ stopFrom: this.state.headResult.posX });
      }
      const kof = Math.abs(this.state.headResult.posX / this.state.stopFrom);
      this.setState({
        speed: Math.max(Math.floor(this.state.maxSpeed * kof * 0.75 + 3), 5),
      });
      if (
        this.state.headResult.posX <= 0
        // (this.state.parent.current.clientHeight * 0.85) / -3.2
      ) {
        const fix = this.state.headResult.posX;
        this.state.currentState.forEach((item) => {
          item.fixPos(fix);
        });
        this.setState({ speed: 0 });
        this.requestWin();
      } else {
        this.state.currentState.forEach((item) => {
          item.moveX(this.state.speed);
        });
      }
      if (this.state.currentState[0].canDelete()) {
        this.removeElement();
      }
    }
  }

  handleLoop() {
    if (!this) return;
    if (this.state.maxSpeed > this.state.speed)
      this.setState({ speed: this.state.speed + 5 });

    if (this.state.currentState[0].canDelete()) {
      this.removeElement();
      this.addRandomElement();
    }

    this.state.currentState.forEach((item) => {
      item.moveX(this.state.speed);
    });
  }

  drawFrame() {
    this.state.ctx.globalCompositeOperation = "normal";
    this.state.ctx.clearRect(0, 0, this.state.width, this.state.height);
    this.state.currentState.forEach((item) => {
      item.draw();
    });
  }

  requestWin() {
    this.setState({
      isRun: false,
      isStop: false,
      isWin: true,
      result: -1,
    });
    setTimeout(() => {
      this.props.spinFinished([this.state.winDrop]);
    }, 100);
  }
  render() {
    return (
      <div className={"spinner-page " + this.props.type}>
        <div className="spinner-img-wrapper">
          {/* <img className="spinner-img" src={png[this.props.type]} alt="" /> */}
        </div>
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
        <div id="spinner-container" className="spinner-wrapper">
          <div className="spinner-page-title">{this.props.type} roulette</div>
          <img className="spinner-bg" src={png["roulette-top-bg"]} alt="" />

          <div
            ref={this.state.parent}
            className={this.state.isRun ? "spinner" : "spinner"}
          >
            <div
              className={this.state.isRun ? "pointer top move" : "pointer top"}
            ></div>
            <canvas
              width={this.state.width}
              height={this.state.height}
              ref={this.state.canvas}
            />
            <div
              className={
                this.state.isRun ? "pointer bottom move" : "pointer bottom"
              }
            ></div>
          </div>
          <div className="spinner-controls">
            <div style={{ display: "flex" }}>
              <div className="quantity-prizes" onChange={this.onChangeValue}>
                {this.quantityPrizes.map((q: any) => {
                  return (
                    <>
                      <input
                        type="radio"
                        id={q.name}
                        value={q.value}
                        name="q"
                        defaultChecked={q.value === this.state.quantityPrizes}
                      />
                      <label
                        key={q.name}
                        className="multiplier"
                        htmlFor={q.name}
                      >
                        {q.name}
                      </label>
                    </>
                  );
                })}
              </div>
              <button className="spinn" onClick={this.requestSpin}>
                Крутить за
                <svg
                  width="18"
                  height="18"
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
                {this.state.quantityPrizes * this.state.spinCost}
              </button>
            </div>
            <div>
              <input
                defaultChecked={this.state.withoutAnimation}
                checked={this.state.withoutAnimation}
                id="without-animation"
                type="checkbox"
                onChange={(event) =>
                  this.setState({
                    withoutAnimation: this.state.quantityPrizes == 1 ? !this.state.withoutAnimation : this.state.withoutAnimation,
                  })
                }
              />
              <label htmlFor="without-animation">
                <div className="checkbox">
                  <img src={png["checkmark"]} alt="" />
                </div>
                Быстрое открытие <br /> <small>без анимации</small>
              </label>
            </div>
          </div>
        </div>
        <div className="dr-items-wrap">
          <div className="dr-roulette-items-title">Содержимое рулетки</div>
          <div className="dr-roulette-items">
            {this.state.itemList
              .sort((a, b) => {
                if (a.data.rarity < b.data.rarity) {
                  return 1;
                }
                if (a.data.rarity > b.data.rarity) {
                  return -1;
                }
                return 0;
              })
              .map((i) => {
                return (
                  <div
                    className={
                      "dr-item " + RarityType[i.data.rarity].toLowerCase()
                    }
                  >
                    <img
                      className="item-rarity-img"
                      src={
                        png[
                          i.data.rarity === RarityType.LEGENDARY
                            ? "gold"
                            : i.data.rarity === RarityType.SPECIAL
                            ? "red"
                            : i.data.rarity === RarityType.UNIQUE
                            ? "pink"
                            : i.data.rarity === RarityType.RARE
                            ? "purple"
                            : i.data.rarity === RarityType.COMMON
                            ? "blue"
                            : null
                        ]
                      }
                      alt=""
                    />
                    <img
                      className="item-img"
                      src={prizesPng[i.data.icon]}
                      alt=""
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}

import React, {Component} from "react";
import "./buttons.less";
import {CEF} from "../../modules/CEF";
import png from "./assets/img/*.png";
import svg from "./assets/img/*.svg";
import {system} from "../../modules/system";
import {CustomEvent} from "../../modules/custom.event";
import {CustomEventHandler} from "../../../shared/custom.event";
import {systemUtil} from "../../../shared/system";
import {
  mapWinDesc,
  mapWinMultiplier,
  mapWinName,
  redNumbers,
  ROULETTE_MAX_BETS,
  ROULETTE_TABLE_POSITIONS
} from "../../../shared/casino/roulette";

export class CasinoDiceCroupier extends Component<{},
    {
      bet: number;
      allbet: number;
      allbetcount: number;
      seconds: number;
      tableId: number;
      show: boolean;
      showhelp: boolean;
      showwin: number;
      lastResults: number[],
    }> {
  private readonly ev: CustomEventHandler;
  private readonly ev2: CustomEventHandler;
  private readonly ev3: CustomEventHandler;
  private readonly int: any;
  private int2: any;

  constructor(props: any) {
    super(props);
    this.state = {
      bet: 0,
      allbet: 0,
      allbetcount: 0,
      show: CEF.test,
      showhelp: false,
      showwin: 0,
      seconds: CEF.test ? 120 : 0,
      tableId: 0,
      lastResults: [0, 1, 2, 3, 4, 17, 18]
    };
    this.ev = CustomEvent.register("casino:roulette:data", (bet: number, lastResults: number[], tableId: number, allbet: number, allbetcount: number) => {
      this.setState({bet, show: true, lastResults, tableId, allbet, allbetcount});
    });
    this.ev2 = CustomEvent.register("casino:roulette:win", (sum: number) => {
      this.notifyWin(sum)
    });
    this.ev3 = CustomEvent.register("casino:roulette:timer", (seconds: number) => {
      this.setState({seconds})
    });
    if (CEF.test) {
      setTimeout(() => {
        this.notifyWin(10000)
      }, 1000)
    }
    this.int = setInterval(() => {
      if (this.state.seconds > 0) this.setState({seconds: this.state.seconds - 1})
      if (CEF.test) {
        let lastResults = [...this.state.lastResults];
        lastResults.push(system.getRandomInt(0, 63));
        if (lastResults.length > 7) lastResults.splice(0, 1);
        this.setState({lastResults})
      }
    }, 1000)
  }

  notifyWin(sum: number) {
    if (this.int2) clearTimeout(this.int2);
    this.setState({showwin: sum});
    this.int2 = setTimeout(() => {
      this.setState({showwin: 0});
    }, 5000)
  }

  get table() {
    return ROULETTE_TABLE_POSITIONS[this.state.tableId]
  }

  componentWillUnmount() {
    if (this.ev) this.ev.destroy();
    if (this.ev2) this.ev2.destroy();
    if (this.ev3) this.ev3.destroy();
    if (this.int) clearInterval(this.int);
    if (this.int2) clearTimeout(this.int2);
    document.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }

  componentDidMount() {
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  handleKeyUp(ev: KeyboardEvent) {
    let keyCode = ev.keyCode;
    if (keyCode === 17) this.setState({showhelp: !this.state.showhelp})
  }

  render() {
    if (!this.state.show) return <></>;
    return (
        <section className="dice-section-wrapper croupier-wrapper animated fadeIn">
          <div className="cg1-buttons-grid-left animated fadeInLeft waiteone">
            <div className="casino-button-info-item">
              <p className="cg1-keyboard mr24">ESC</p>
              <p>Уйти</p>
          </div>
          <div className="casino-button-info-item">
            <p className="cg1-keyboard">ЛКМ</p>
            <p>Бросок</p>
          </div>
        </div>
        <div className="casino-balance">
          <p className="casino-mini-font mb24">Баланс</p>
          <div className="casino-chips large mb24">
            <img src={png["chip"]} alt="" />
            <p>{systemUtil.numberFormat(CEF.user.chips)}</p>
          </div>
          <p className="cgc-count-buy">
            ${systemUtil.numberFormat(CEF.user.money)}
          </p>
        </div>
          {this.state.seconds ? <div className="animated zoomIn">
            <div className="cg-timer">
              <p className="casino-mini-font mb8">До начала игры</p>
              <p className="casino-timer-font">{system.secondsToString(this.state.seconds)}</p>
            </div>
          </div> : <></>}
        <div className="dice-players">
          <i className="fly-dice-shadow"></i>
          {/* Разные состояния карточки. Личная карточка игрока (не всегда отображается первой, показывать по тем местам где сидит человек) */}
          <div className="dice-player-item dpi-active">
            <div className="dpi-timer">
              <div>Бросает кубик</div>
              <div>00:01</div>
            </div>
            <div className="dpi-enter mb40">
              <div className="dice-my-img"><img src={svg["dice-3"]} alt=""/></div>
              <div className="dice-my-img"><img src={svg["dice-3"]} alt=""/></div>
            </div>
            <div className="dpi-name mb24">Kevin<br />Mackalister</div>
            <p className="casino-mini-font mb40">ID 4012</p>
            <div className="dpi-bid animated fadeInDown">
              <div className="casino-chips small">
                <img src={png["chip"]} alt="" />
                <p>3 000</p>
              </div>
            </div>
          </div>
          {/* Карточка другого игрока: Только пришел, не нажал играть принял игру */}
          <div className="dice-player-item green">
            <div className="dpi-enter mb40">
              <button className="dpi-button border" disabled><p>Ожидание</p></button>
            </div>
            <div className="dpi-name mb24">Kevin<br />Mackalister</div>
            <p className="casino-mini-font mb40">ID 4012</p>
          </div>
          {/* Карточка другого игрока: нажал "Поставить" */}
          <div className="dice-player-item blue">
            <div className="dpi-enter mb40">
              <button className="dpi-button border to-success" disabled><img src={svg["success"]} alt=""/><p>Ожидание</p></button>
            </div>
            <div className="dpi-name mb24">Kevin<br />Mackalister</div>
            <p className="casino-mini-font mb40">ID 4012</p>
            <div className="dpi-bid animated fadeInDown">
              <div className="casino-chips small">
                <img src={png["chip"]} alt="" />
                <p>3 000</p>
              </div>
            </div>
          </div>
          {/* Карточка другого игрока: другой цвет (для варианта отображения на личной карточке появляется кнопка "отмена") */}
          <div className="dice-player-item red">
            <div className="dpi-enter mb40">
              <button className="dpi-button border"><p>Отмена</p></button>
            </div>
            <div className="dpi-name mb24">Kevin<br />Mackalister</div>
            <p className="casino-mini-font mb40">ID 4012</p>
            <div className="dpi-bid animated fadeInDown">
              <div className="casino-chips small">
                <img src={png["chip"]} alt="" />
                <p>3 000</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="croupier-enter-bid-wrapper">
          <p className="casino-mini-font mb40">Выберите ставку</p>
          <div className="croupier-enter-bid-grid mb40">
            <button><div className="casino-chips">
                <img src={png["chip-green"]} alt="" />
                <p>100</p>
              </div></button>
            <button><div className="casino-chips">
                <img src={png["chip-pink"]} alt="" />
                <p>300</p>
              </div></button>
            <button className="bid-enter"><div className="casino-chips">
                <img src={png["chip-red"]} alt="" />
                <p>500</p>
              </div></button>
            <button><div className="casino-chips">
                <img src={png["chip-white"]} alt="" />
                <p>1 000</p>
              </div></button>
            <button><div className="casino-chips">
                <img src={png["chip-yellow"]} alt="" />
                <p>2 000</p>
              </div></button>
            <button><div className="casino-chips">
                <img src={png["chip"]} alt="" />
                <p>3 000</p>
              </div></button>
          </div>
          <button className="dpi-button"><p>Начать игру</p></button>
        </div>
        {/* WINTASK Появляется на 4 секунды и пропадает, можно попробовать добавить класс zoomOut после 4ех секунд */}
        <div className="dice-wintask-wrapper animated zoomIn">
          <i className="fly-win-lines"><img src={svg["win-lines"]} alt=""/></i>
          <div className="dice-wintask">
            <p className="dice-win-title">Победил<br /><span>Kevin Mackalister</span></p>
            <div className="dice-win-size">
              <div className="casino-chips">
                <img src={png["chip"]} alt="" />
                <p>3 000 000</p>
              </div>
            </div>
          </div>
        </div>
        <div className="croupier-chips">
        <p className="casino-mini-font mb8">Вы заработали</p>
          <div className="casino-chips">
            <img src={png["chip"]} alt="" />
            <p>3 000 000</p>
          </div>
        </div>
      </section>
    );
  }
}


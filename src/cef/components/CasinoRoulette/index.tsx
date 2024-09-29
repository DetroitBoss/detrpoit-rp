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
  mapWinDesc, mapWinIcon,
  mapWinMultiplier,
  mapWinName,
  redNumbers,
  ROULETTE_MAX_BETS,
  ROULETTE_TABLE_POSITIONS
} from "../../../shared/casino/roulette";

export class CasinoRoulette extends Component<{},
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
        <section className="roulette-section-wrapper animated fadeIn">
          <div className="cg1-buttons-grid-left animated fadeInLeft waiteone">
            <div className="casino-button-info-item">
              <p className="cg1-keyboard mr24">ESC</p>
              <p>Уйти</p>
          </div>
          <div className="casino-button-info-item">
            <p className="cg1-keyboard">L CTRL</p>
            <p>Правила рулетки</p>
          </div>
          <div className="casino-button-info-item">
            <p className="cg1-keyboard">ЛКМ</p>
            <p>Поставить ставку</p>
          </div>
          <div className="casino-button-info-item">
            <p className="cg1-keyboard">ПКМ</p>
            <p>Отменить ставку</p>
          </div>
          <div className="casino-button-info-item">
            <p className="cg1-keyboard cube mr8">
              <img src={svg["cg1-up"]} alt="" />
            </p>
            <p className="cg1-keyboard cube mr16">
              <img src={svg["cg1-down"]} alt="" />
            </p>
            <p>Размер ставки</p>
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
        {/* <div className="cg1-right-bottom-wrapper">
          <div className="cg1-up-down animated fadeInDown waitthree">
            <div className="casino-chips">
              <img src={png["chip"]} alt="" />
              <p>{system.numberFormat(this.state.bet)}</p>
            </div>
            <p className="casino-mini-font ml12">Ставка</p>
          </div>
        </div> */}
        <div className="cg-bottom-middle">
          <div>
            <p className="casino-mini-font ml12 mb8">Сумма ставок</p>
            <div className="casino-chips">
              <img src={png["chip"]} alt="" />
              <p>{system.numberFormat(this.state.allbet)}</p>
            </div>
          </div>
          <div className="mid-line-count">
            <p className="casino-mini-font op4 mb8"> ставок <br/> осталось </p>
            <span>{Math.max(0, ROULETTE_MAX_BETS - this.state.allbetcount)}</span>
            <i></i>
          </div>
          <div>
            <p className="casino-mini-font ml12 mb8">Текущая</p>
            <div className="casino-chips">
              <img src={png["chip"]} alt="" />
              <p>{system.numberFormat(this.state.bet)}</p>
            </div>
          </div>
        </div>
        <div className="cg-left-bottom">
          <div className="cg-maxandmin">
            <div className="casino-chips small">
              <img src={png["chip"]} alt=""/>
              <p>{system.numberFormat(Math.min(...(this.table?.chipTypePrices || [0])))}</p>
            </div>
            <p className="casino-mini-font op4">
              Минимальная
              <br />
              ставка
            </p>
          </div>
          <div className="cg-maxandmin">
            <div className="casino-chips small">
              <img src={png["chip"]} alt=""/>
              <p>{system.numberFormat(Math.max(...(this.table?.chipTypePrices || [0])))}</p>
            </div>
            <p className="casino-mini-font op4">
              Максимальная
              <br />
              ставка
            </p>
          </div>
        </div>
          {this.state.seconds ? <div className="animated zoomIn">
            <div className="cg-timer">
              <p className="casino-mini-font mb8">До начала игры</p>
              <p className="casino-timer-font">{system.secondsToString(this.state.seconds)}</p>
            </div>
          </div> : <></>}
          <div className={`cg-roulette-wintask ${this.state.showwin < 0 ? 'loss' : ''} animated fadeInUp w`} style={{
            display: this.state.showwin ? 'flex' : 'none'
          }}>
            <p className="cg-r-win-title">
              <span>{this.state.showwin < 0 ? 'сожалеем' : 'поздравляем'}</span>
              <br/>
              вы {this.state.showwin < 0 ? 'проиграли' : 'выиграли'}:
            </p>
            <div className="casino-chips large">
              <img src={png["chip"]} alt=""/>
              <p>{system.numberFormat(Math.abs(this.state.showwin))}</p>
            </div>
          </div>
          {this.state.showhelp ? <div className="modal-rules-roulette-wrapper">
            <div className="casino-button-info-item">
              <p>Закрыть правила</p>
              <p className="cg1-keyboard m0 ml12">L CTRL</p>
            </div>
            <div className="modal-rules-roulette">
              <div>
                <p className="font32 fontw600 mb24">
                  Что представляет<br/>из себя рулетка?
                </p>
                <p className="font24 ln-1-4 fontw400">
                  Рулетка - это стол на котором размещены цифры от 1 до 36 и ещё
                  есть зеро (0) и (00). Есть также Even (четное), Odd (нечетное),
                  красное и черное, и поля по 12 чисел (1st 12, 2nd 12, 3rd 12) и
                  3 линии и "больше" или "меньше" это ставка на попадание числа в
                диапазон от 1..18 или 18..36
              </p>
            </div>
            <div>
              <p className="font32 fontw600 mb24">Выигрыши</p>
              <div className="rules-roulette-table">
                <div className="rr-t-line-hr">
                  <div>
                    <p className="op4 font16 fontw400">Ставка</p>
                  </div>
                  <div>
                    <p className="op4 font16 fontw400">Форумла выигрыша</p>
                  </div>
                  <div>
                    <p className="op4 font16 fontw400">Пример</p>
                  </div>
                </div>
                {Object.keys(mapWinName).map(key => {
                  const name = mapWinName[key];
                  const desc = mapWinDesc[key];
                  const icon = mapWinIcon[key];
                  return <div className="rr-t-line" key={`roulette_help_win_${key}`}>
                    <div>
                      <p className="font24 fontw400 strong-in">
                        <strong>{name}</strong>
                      </p>
                    </div>
                    <div>
                      <p className="font24 fontw600">{mapWinMultiplier[key]}*X+X</p>
                    </div>
                    <div>
                      <img src={png[icon]} alt=""/>
                    </div>
                  </div>
                })}


              </div>
            </div>
            </div>
          </div> : <></>}
      </section>
    );
  }
}

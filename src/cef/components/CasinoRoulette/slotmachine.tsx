import React, {Component} from "react";
import "./buttons.less";
import {CEF} from "../../modules/CEF";
import png from "./assets/img/*.png";
import svg from "./assets/img/*.svg";
import gif from "./assets/img/*.gif";
import {system} from "../../modules/system";
import {CustomEvent} from "../../modules/custom.event";
import {CustomEventHandler} from "../../../shared/custom.event";
import {systemUtil} from "../../../shared/system";
import {CASINO_SLOT_BETS_LIST} from "../../../shared/casino/slots";

export class SlotMachine extends Component<{},
    {
      bet: number;
    }> {
  private readonly ev: CustomEventHandler;
  private readonly ev2: CustomEventHandler;
  private readonly ev3: CustomEventHandler;
  private readonly int: any;
  private int2: any;

  constructor(props: any) {
      super(props);
      this.state = { bet: 0 };
      this.ev = CustomEvent.register("casino:slots:data", (bet: number) => this.setState({bet}));
      this.ev2 = CustomEvent.register('cef:hud:setMoney', (money: number) => this.setState({ ...this.state }));
      this.ev3 = CustomEvent.register('cef:hud:setChips', (money: number) => this.setState({ ...this.state }));
  }


  componentWillUnmount() {
    if (this.ev) this.ev.destroy();
    if (this.ev2) this.ev2.destroy();
    if (this.ev3) this.ev3.destroy();
  }

  increaseBet() {
      CustomEvent.triggerClient('casino:slotmachine:changeBet', true);
  }

  decreaseBet() {
      CustomEvent.triggerClient('casino:slotmachine:changeBet', false);
  }

  render() {
      if (!this.state.bet) return <></>;
    return (
        <section className="slot-section-wrapper animated fadeIn">
          <div className="cg1-buttons-grid-left animated fadeInLeft waiteone">
            <div className="casino-button-info-item">
              <p className="cg1-keyboard mr24">ESC</p>
              <p>Уйти</p>
          </div>
          <div className="casino-button-info-item">
            <p className="cg1-keyboard">SPACE</p>
            <p>Нажать кнопку</p>
          </div>
          <div className="casino-button-info-item">
            <p className="cg1-keyboard">ENTER</p>
            <p>Крутить колесо</p>
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
        
        <div className="cg1-middle-bottom-wrapper">
            <div className="cg1-up-down animated fadeInDown waitthree">
                <p className="casino-mini-font mr12">Ставка</p>
                <div className="casino-chips mr24">
                    <img src={png["chip"]} alt=""/>
                    <p>{system.numberFormat(this.state.bet)}</p>
                </div>
                <div className="cg1-but-icon"><img src={svg["cg1-down"]} alt="" onClick={() => this.decreaseBet()} /></div>
                <div className="cg1-but-icon"><img src={svg["cg1-up"]} alt="" onClick={() => this.increaseBet()} /></div>
            </div>
            <button className="casino-game-main-button animated fadeInDown waittwo">
                <p>Крутить<small>ПРОБЕЛ</small></p>
                <span>
                    <i><img src={svg["circle-lines"]} className="rotation360" alt="" /></i>
                </span>
                <img src={gif["blink"]} alt="" />
            </button>
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
      </section>
    );
  }
}


import React, { Component } from "react";
import png from "../../assets/*.png";
import "./health.less";
import {CustomEvent} from "../../../../modules/custom.event";
import PhoneHealthData from "../../../../../shared/phone/phoneHealthData";
import {CEF} from "../../../../modules/CEF";
import {systemUtil} from "../../../../../shared/system";

export class Health extends Component<
  { onClose: () => void; phoneId: number },
  {
    user: PhoneHealthData;
    list: {icon: string, percent: number, desc: string}[];
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: {
        level: 1,
        health: 87,
        thirst: 87,
        hunger: 87,
        exp: 12,
        maxExp: 14,
      },
      list: [],
    };
    
    CustomEvent.triggerServer('phone:requestHealth');
    
    CustomEvent.register('phone:healthData', (data: PhoneHealthData) => {
      this.setState({
        ...this.state,
        user: data,
        list: [
          {
            icon: "heart",
            percent: data.health,
            desc: "Здоровье",
          },
          {
            icon: "burger",
            percent: data.hunger,
            desc: "Голод",
          },
          {
            icon: "bottle",
            percent: data.thirst,
            desc: "Жажда",
          },
        ],
      })
    })
  }

  render() {
    return (
      <div className="np-health-wrap">
        <img className="np-health-bg" src={png["doctor"]} alt="" />
        <div className="np-health">
          <div className="np-health-title">Hi, {CEF.user.name}</div>
          <div className="np-health-sub-title">Ваш уровень</div>
          <div className="np-health-user-level">
            {this.state.user.level}
            <span>{`${this.state.user.exp}/${this.state.user.maxExp}`}</span>
          </div>
          <div className="np-health-list">
            {this.state.list.map((i) => {
              return (
                <div className="np-health-item">
                  <div className="np-health-item-icon">
                    <img src={png[i.icon]} alt="" />
                  </div>
                  <div className="np-health-item-value">
                    <span>{Math.floor(i.percent / 10)}%</span>
                    {i.desc}
                  </div>
                </div>
              );
            })}
          </div>
          <button className="np-health-call-btn" onClick={(e) => {
            CustomEvent.triggerServer("phone:requestCall", this.props.phoneId, 102)
            this.props.onClose()
          }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.4503 17.35C22.2057 17.0894 21.3417 16.3188 19.7536 15.2992C18.1538 14.2708 16.9739 13.6295 16.6355 13.48C16.6057 13.4668 16.5728 13.4619 16.5404 13.466C16.5081 13.47 16.4774 13.4828 16.4517 13.503C15.9066 13.9281 14.9888 14.7091 14.9396 14.7513C14.6217 15.0236 14.6217 15.0236 14.3616 14.9388C13.9041 14.7888 12.4828 14.0341 11.2444 12.7928C10.006 11.5516 9.21237 10.0952 9.06237 9.63813C8.97659 9.37751 8.97659 9.37751 9.24987 9.0597C9.29206 9.01048 10.0735 8.09267 10.4986 7.54798C10.5188 7.52233 10.5316 7.49167 10.5356 7.45929C10.5397 7.42692 10.5348 7.39405 10.5216 7.36423C10.3721 7.02532 9.73081 5.84595 8.70237 4.2461C7.68143 2.65845 6.91174 1.79454 6.65112 1.54985C6.6272 1.52728 6.59764 1.51158 6.56555 1.50441C6.53346 1.49723 6.50003 1.49884 6.46878 1.50907C5.55775 1.82214 4.67875 2.22162 3.84378 2.70204C3.03772 3.17062 2.27461 3.70943 1.56331 4.3122C1.53848 4.33331 1.51986 4.36078 1.50946 4.39166C1.49905 4.42254 1.49725 4.45568 1.50424 4.48751C1.60221 4.94407 2.07049 6.85001 3.52362 9.49001C5.00628 12.1844 6.03378 13.5649 8.21112 15.7347C10.3885 17.9045 11.8125 18.9939 14.5097 20.4766C17.1497 21.9297 19.0566 22.3984 19.5122 22.4955C19.5441 22.5024 19.5773 22.5006 19.6082 22.4902C19.6392 22.4798 19.6667 22.4612 19.688 22.4364C20.2907 21.7251 20.8293 20.962 21.2977 20.1559C21.778 19.3209 22.1775 18.4419 22.4907 17.5309C22.5007 17.4999 22.5022 17.4668 22.4951 17.435C22.488 17.4032 22.4726 17.3738 22.4503 17.35Z"
                fill="white"
              />
            </svg>
            Позвонить врачу
          </button>
        </div>
      </div>
    );
  }
}

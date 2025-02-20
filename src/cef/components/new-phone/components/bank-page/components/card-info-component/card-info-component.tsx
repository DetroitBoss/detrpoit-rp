import React, { Component } from "react";
import "./card-info-component.less";
import png from "../../../../assets/*.png";
import { BankPages } from "../../enums/bankPages.enum";
import {CEF} from "../../../../../../modules/CEF";
import {system} from "../../../../../../modules/system";
import {CustomEvent} from "../../../../../../modules/custom.event";

export class CardInfoComponent extends Component<
  {
    onPageChange: any;
      cardNumber: string;
    rate: string;
    cardBalance: number;
  },
  {    bankId: number }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      bankId: 1,
    };
    this.format = this.format.bind(this);
  }
  format(s: string | number, blockWidth: number = 4) {
    let v = s.toString().replace(/[^\d0-9]/g, ""),
      reg = new RegExp(".{" + blockWidth + "}", "g");
    if (blockWidth === 3) {
      return (
        v.substr(0, v.length % blockWidth) +
        " " +
        v.substr(v.length % blockWidth, v.length).replace(reg, function (a) {
          return a + " ";
        })
      );
    } else {
      return v.replace(reg, function (a) {
        return a + " ";
      });
    }
  }
  render() {
    return (
      <div className="np-card-info-wrap">
        <img className="np-card-info-bg" src={png["card-info-bg"]} alt="" />
        <div className="np-card-info">
          <div className="np-card-info-title">Информация о карте</div>
          <div
            className="np-card-info-close-btn"
            onClick={() => this.props.onPageChange(BankPages.MAIN)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2.25C6.62391 2.25 2.25 6.62391 2.25 12C2.25 17.3761 6.62391 21.75 12 21.75C17.3761 21.75 21.75 17.3761 21.75 12C21.75 6.62391 17.3761 2.25 12 2.25ZM15.5302 14.4698C15.6027 14.5388 15.6608 14.6216 15.7008 14.7133C15.7409 14.805 15.7622 14.9039 15.7635 15.004C15.7648 15.1041 15.746 15.2034 15.7083 15.2961C15.6706 15.3889 15.6147 15.4731 15.5439 15.5439C15.4731 15.6147 15.3889 15.6706 15.2961 15.7083C15.2034 15.746 15.1041 15.7648 15.004 15.7635C14.9039 15.7622 14.805 15.7409 14.7133 15.7008C14.6216 15.6608 14.5388 15.6027 14.4698 15.5302L12 13.0608L9.53016 15.5302C9.38836 15.6649 9.19955 15.7389 9.00398 15.7364C8.8084 15.7339 8.62155 15.6551 8.48325 15.5168C8.34495 15.3785 8.26614 15.1916 8.26364 14.996C8.26114 14.8005 8.33513 14.6116 8.46984 14.4698L10.9392 12L8.46984 9.53016C8.33513 9.38836 8.26114 9.19955 8.26364 9.00398C8.26614 8.8084 8.34495 8.62155 8.48325 8.48325C8.62155 8.34495 8.8084 8.26614 9.00398 8.26364C9.19955 8.26114 9.38836 8.33513 9.53016 8.46984L12 10.9392L14.4698 8.46984C14.6116 8.33513 14.8005 8.26114 14.996 8.26364C15.1916 8.26614 15.3785 8.34495 15.5168 8.48325C15.6551 8.62155 15.7339 8.8084 15.7364 9.00398C15.7389 9.19955 15.6649 9.38836 15.5302 9.53016L13.0608 12L15.5302 14.4698Z"
                fill="white"
                fillOpacity="0.3"
              />
            </svg>
          </div>
          <div className="np-card-info-list">
            <div className="np-card-info-item">
              <div className="np-card-info-item-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.5 17.625C1.5 18.3212 1.77656 18.9889 2.26884 19.4812C2.76113 19.9734 3.42881 20.25 4.125 20.25H19.875C20.5712 20.25 21.2389 19.9734 21.7312 19.4812C22.2234 18.9889 22.5 18.3212 22.5 17.625V10.4062H1.5V17.625ZM4.59375 14.0625C4.59375 13.6895 4.74191 13.3319 5.00563 13.0681C5.26935 12.8044 5.62704 12.6562 6 12.6562H8.25C8.62296 12.6562 8.98065 12.8044 9.24437 13.0681C9.50809 13.3319 9.65625 13.6895 9.65625 14.0625V15C9.65625 15.373 9.50809 15.7306 9.24437 15.9944C8.98065 16.2581 8.62296 16.4062 8.25 16.4062H6C5.62704 16.4062 5.26935 16.2581 5.00563 15.9944C4.74191 15.7306 4.59375 15.373 4.59375 15V14.0625ZM19.875 3.75H4.125C3.42881 3.75 2.76113 4.02656 2.26884 4.51884C1.77656 5.01113 1.5 5.67881 1.5 6.375V7.59375H22.5V6.375C22.5 5.67881 22.2234 5.01113 21.7312 4.51884C21.2389 4.02656 20.5712 3.75 19.875 3.75Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                </svg>
              </div>
              <div className="np-card-info-item-description">
                <div className="np-card-info-item-title">Номер карты</div>
                <div className="np-card-info-item-value">
                  {this.props.cardNumber}
                </div>
              </div>
            </div>
            <div className="np-card-info-item">
              <div className="np-card-info-item-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.125 2.25L16.1948 8.25844V2.25H10.125ZM8.50641 2.73656L3.75 6.28125H12L8.50641 2.73656ZM15.75 16.125H21.75V10.125L15.75 16.125ZM21.2812 8.53125L17.7188 3.75V12L21.2812 8.53125ZM2.25 7.78125V13.7812L8.25 7.78125H2.25ZM15.4688 21.2812L20.25 17.7188H12L15.4688 21.2812ZM2.71875 15.4688L6.28125 20.25V12L2.71875 15.4688ZM16.1948 10.4119L13.5909 7.81219H10.4091L7.80516 10.4119V13.5881L10.4123 16.1906C10.433 16.1906 10.4536 16.1878 10.4747 16.1878H13.5909L16.1948 13.5881V10.4119ZM7.78031 15.7542L7.78125 21.75H13.7812L7.78031 15.7542Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                </svg>
              </div>
              <div className="np-card-info-item-description">
                <div className="np-card-info-item-title">Тариф</div>
                <div className="np-card-info-item-value">{this.props.rate}</div>
              </div>
            </div>
            <div className="np-card-info-item">
              <div className="np-card-info-item-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.25 17.25H21.75V18.75H2.25V17.25ZM3.75 19.5H20.25V21H3.75V19.5ZM22.5 8.25C21.3069 8.24864 20.1631 7.77409 19.3195 6.93047C18.4759 6.08686 18.0014 4.94306 18 3.75V3H6V3.75C5.99864 4.94306 5.52409 6.08686 4.68047 6.93047C3.83686 7.77409 2.69306 8.24864 1.5 8.25H0.75V11.25H1.5C2.69306 11.2514 3.83686 11.7259 4.68047 12.5695C5.52409 13.4131 5.99864 14.5569 6 15.75V16.5H18V15.75C18.0014 14.5569 18.4759 13.4131 19.3195 12.5695C20.1631 11.7259 21.3069 11.2514 22.5 11.25H23.25V8.25H22.5ZM12 14.25C11.11 14.25 10.24 13.9861 9.49993 13.4916C8.75991 12.9971 8.18314 12.2943 7.84254 11.4721C7.50195 10.6498 7.41283 9.74501 7.58647 8.87209C7.7601 7.99918 8.18868 7.19736 8.81802 6.56802C9.44736 5.93868 10.2492 5.5101 11.1221 5.33647C11.995 5.16283 12.8998 5.25195 13.7221 5.59254C14.5443 5.93314 15.2471 6.50991 15.7416 7.24993C16.2361 7.98995 16.5 8.85998 16.5 9.75C16.4986 10.9431 16.0241 12.0869 15.1805 12.9305C14.3369 13.7741 13.1931 14.2486 12 14.25Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                  <path
                    d="M4.5 3.75V3H0.75V6.75H1.5C2.29538 6.74913 3.05794 6.43278 3.62036 5.87036C4.18278 5.30794 4.49913 4.54538 4.5 3.75ZM1.5 12.75H0.75V16.5H4.5V15.75C4.49913 14.9546 4.18278 14.1921 3.62036 13.6296C3.05794 13.0672 2.29538 12.7509 1.5 12.75ZM22.5 6.75H23.25V3H19.5V3.75C19.5009 4.54538 19.8172 5.30794 20.3796 5.87036C20.9421 6.43278 21.7046 6.74913 22.5 6.75ZM19.5 15.75V16.5H23.25V12.75H22.5C21.7046 12.7509 20.9421 13.0672 20.3796 13.6296C19.8172 14.1921 19.5009 14.9546 19.5 15.75Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                  <path
                    d="M12 12.75C13.6569 12.75 15 11.4069 15 9.75C15 8.09315 13.6569 6.75 12 6.75C10.3431 6.75 9 8.09315 9 9.75C9 11.4069 10.3431 12.75 12 12.75Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                </svg>
              </div>
              <div className="np-card-info-item-description">
                <div className="np-card-info-item-title">Баланс на карте</div>
                <div className="np-card-info-item-value">
                  $ {system.numberFormat(CEF.user.bank)}
                </div>
              </div>
            </div>
            <div className="np-card-info-item">
              <div className="np-card-info-item-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.9993 19.6545H2.00073V22.0001H21.9993V19.6545Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                  <path
                    d="M21.9993 7.11658H2.00073V9.46211H21.9993V7.11658Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                  <path
                    d="M12 2L2.47015 5.94509H21.5299L12 2Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                  <path
                    d="M6.11397 10.635H3.75928V18.4831H6.11397V10.635Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                  <path
                    d="M10.823 10.635H8.46832V18.4831H10.823V10.635Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                  <path
                    d="M15.5321 10.635H13.1774V18.4831H15.5321V10.635Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                  <path
                    d="M20.2407 10.635H17.886V18.4831H20.2407V10.635Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                </svg>
              </div>
              <div className="np-card-info-item-description">
                <div className="np-card-info-item-title">Ваш банк</div>
                <div className="np-card-info-item-value">
                  #{this.state.bankId}
                </div>
              </div>
            </div>
          </div>
          <div className="np-new-transaction-confirm">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.2501 0.75L0.744446 9.75L9.1407 13.5469L21.0001 3L10.4532 14.8594L14.2501 23.25L23.2501 0.75Z"
                fill="white"
              />
            </svg>
            <div onClick={(e) => {
              CustomEvent.triggerServer('gps:markClosestBank')
            }}>
              Проложить маршрут
              <br />к банку
            </div>
          </div>
        </div>
      </div>
    );
  }
}

import React, { Component } from "react";
import { GPSPages } from "../../enums/GPSPages.enum";
import png from "../../../../assets/*.png";
import "./destination-is-set-component.less";
import {CustomEvent} from "../../../../../../modules/custom.event";

export class DestinationIsSetComponent extends Component<
  {
    onPageChange: any;
  },
  {
    location: string;
  }
> {
  constructor(props: any) {
    super(props);
    
    
    this.state = {
      location: "Адрес",
    };
  }

  render() {
    return (
      <div className="np-gps-destination-is-set">
        <img
          className="np-gps-destination-is-set-bg"
          src={png["destination-is-set-bg"]}
          alt=""
        />
        <img
          className="np-gps-destination-is-set-point"
          src={png["user-location"]}
          alt=""
        />
        <div className="np-gps-page-location-wrap">
          <div className="np-gps-page-location-icon">
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 1.875C9.82441 1.875 5.625 5.65488 5.625 10.3125C5.625 17.8125 15 28.125 15 28.125C15 28.125 24.375 17.8125 24.375 10.3125C24.375 5.65488 20.1756 1.875 15 1.875ZM15 15C14.2583 15 13.5333 14.7801 12.9166 14.368C12.2999 13.956 11.8193 13.3703 11.5355 12.6851C11.2516 11.9998 11.1774 11.2458 11.3221 10.5184C11.4667 9.79098 11.8239 9.1228 12.3483 8.59835C12.8728 8.0739 13.541 7.71675 14.2684 7.57205C14.9958 7.42736 15.7498 7.50162 16.4351 7.78545C17.1203 8.06928 17.706 8.54993 18.118 9.16661C18.5301 9.7833 18.75 10.5083 18.75 11.25C18.7489 12.2442 18.3535 13.1974 17.6505 13.9005C16.9474 14.6035 15.9942 14.9989 15 15Z"
                fill="black"
              />
            </svg>
          </div>
          <div className="np-gps-page-location-info">
            <div className="np-gps-page-location-title">Местоположение</div>
            <div className="np-gps-page-location">{this.state.location}</div>
          </div>
        </div>
        <div>
          <div className="np-gps-destination-is-set-text">
            <div className="np-gps-page-title">
              Пункт назначения установлен!
            </div>
            <div className="np-gps-page-info-text">
              Точка назначения выставлена на мини-карте. Мы проложили самый
              короткий маршрут. Приятной дороги!
            </div>
          </div>
          <button
            className="np-gps-page-btn black"
            onClick={() => this.props.onPageChange(GPSPages.MAIN)}
          >
            GO
            <svg
              width="16"
              height="15"
              viewBox="0 0 16 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.9587 2.8554L1.11297 5.74365C0.977257 5.77417 0.960168 5.96062 1.08806 6.01532L6.33713 8.25968C6.37071 8.27403 6.3932 8.30622 6.39516 8.34266L6.70539 14.0894C6.71288 14.2283 6.89374 14.2762 6.96903 14.1593L14.1107 3.07289C14.1801 2.96505 14.0838 2.82729 13.9587 2.8554Z"
                fill="#EEEEEE"
              />
              <path
                d="M14.1106 3.07324C14.1449 3.01991 14.1386 2.95932 14.1085 2.91504L6.37898 8.29507C6.38833 8.30909 6.39409 8.32554 6.39505 8.34302L6.70528 14.0898C6.71277 14.2286 6.89362 14.2766 6.96891 14.1597L14.1106 3.07324Z"
                fill="#111111"
                fill-opacity="0.1"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }
}

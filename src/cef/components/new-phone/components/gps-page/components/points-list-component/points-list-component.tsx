import React, { Component } from "react";
import { GPSPages } from "../../enums/GPSPages.enum";
import { Point } from "../../interfaces/point.interface";
import "./points-list-component.less";
import {GPSPointData, LocationCategoryEnum} from "../../../../../../../shared/phone/locationCategories.enum";

export class PointsListComponent extends Component<
  {
    onPageChange: any;
    selectingPoint: any;
    getIcon: any;
    onBack: any;
    pointsCategory: LocationCategoryEnum;
    points: Point[];
  },
  {  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="np-gps-points-list-wrap">
        <div className="np-gps-points-list-page">
          <div className="np-gps-points-list-btns">
            <button className="np-gps-page-btn back" onClick={() => this.props.onBack()}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.625 12.5L3.125 8L7.625 3.5M3.75 8H12.875"
                  stroke="#3A9FFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Назад
            </button>
            <button
              className="np-gps-page-location-categories-close"
              onClick={() => this.props.onPageChange(GPSPages.MAIN)}
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
                  fill="black"
                  fillOpacity="0.3"
                />
              </svg>
            </button>
          </div>
          <div className="np-gps-page-sub-title">
            {this.props.pointsCategory}
          </div>
          <div className="np-gps-points-list">
            {this.props.points.map((p) => {
              return (
                <div className="np-gps-point-item">
                  <div className="np-gps-point-icon">
                    {this.props.getIcon(p.category)}
                  </div>
                  <div className="np-gps-point-info">
                    <div className="np-gps-point-name">{p.name}</div>
                    <div className="np-gps-point-distance">
                      Дистанция: {p.distance}м
                    </div>
                  </div>
                  <div className="np-gps-point-select-btn" onClick={() => this.props.selectingPoint(p)}>
                    <svg
                      id="select-btn-svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect id="select-btn-rect" width="24" height="24" rx="12"/>
                      <path
                        d="M10 18L16 12L10 6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

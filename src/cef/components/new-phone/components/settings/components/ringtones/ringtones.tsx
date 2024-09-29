import React, { Component } from "react";
import "./ringtones.less";
import png from "../../../../assets/*.png";

export class Ringtones extends Component<
  { onBack: any },
  {
    selectedRingtone: string;
    ringtoneList: string[];
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedRingtone: "Sandrexa_Domina",
      ringtoneList: [
        "Sandrexa_Domina",
        "Sandrexa_Domina1",
        "Sandrexa_Domina2",
        "Sandrexa_Domina3",
        "Sandrexa_Domina4",
        "Sandrexa_Domina5",
        "Sandrexa_Domina6",
        "Sandrexa_Domina7",
        "Sandrexa_Domina8",
        "Sandrexa_Domina9",
        "Sandrexa_Domina10",
        "Sandrexa_Domina11",
        "Sandrexa_Domina12",
      ],
    };
  }

  render() {
    return (
      <div className="np-settings-ringtones">
        <div
          className="np-settings-back-btn"
          onClick={() => this.props.onBack()}
        >
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
        </div>
        <div className="np-settings-sub-title">Рингтоны</div>
        <div className="np-settings-list">
          {this.state.ringtoneList.map((r) => {
            return (
              <div
                className="np-settings-item"
                onClick={() =>
                  this.setState({ ...this.state, selectedRingtone: r })
                }
              >
                <div className="np-settings-item-icon">
                  {this.state.selectedRingtone === r ? (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.5 6L9 18L4.5 13.5"
                        stroke="#3A9FFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </div>
                <div className="np-settings-customization-wrap">
                  <div className="np-settings-name">{r}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

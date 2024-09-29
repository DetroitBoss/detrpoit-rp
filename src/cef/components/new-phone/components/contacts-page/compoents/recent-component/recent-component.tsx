import React, { Component } from "react";
import png from "./../../../../assets/*.png";
import "./recent-component.less";
import { Contact } from "../../interfaces/contact.interface";
import { Call } from "../../interfaces/call.interface";
import { CallType } from "../../enums/callType.enum";
import { ContactsPages } from "../../enums/contacts-pages.enum";
import { ContactInfoType } from "../../enums/contactInfoType.enum";
import {PhoneHistory} from "../../../../../../../shared/phone";

export class RecentComponent extends Component<
  {
    setPage: any;
    setStateFromRecent: any;
    history: PhoneHistory[];
    contacts: [string, number][];
    setUserInfo: any
    setAddContactNumber: any
  },
  {}
> {
    
  constructor(props: any) {
    super(props);
    this.state = {
      
    };
    this.clearHistory = this.clearHistory.bind(this);
  }

  clearHistory() {
    this.setState({ ...this.state, contacts: [] });
  }

  render() {
    return (
      <div className="np-contacts">
        <div className="np-contacts-title-wrap">
          <div className="np-contacts-title">
            <span>Недавние</span>
          </div>
          {/*<button className="np-btn" onClick={() => this.clearHistory()}>*/}
          {/*  Очистить*/}
          {/*</button>*/}
        </div>

        <div className="np-contacts-list-wrap recent">
          <ul className="np-contacts-list">
            {!this.props.history || this.props.history.length === 0 ? (
              <li className="np-contact-item bbn color-gray">
                История звонков была очищена или у вас ещё не было звонков
              </li>
            ) : (
              this.props.history.map((c) => {
                  const contactName = this.props.contacts.find(contact => contact[1] == c.number)
                      ?
                      this.props.contacts.find(contact => contact[1] == c.number)[0]
                      :
                      ""
                return c.number ? (
                  <li
                    className={`np-contact-item ${
                      c.type === "tommeMissed" ? "missed" : ""
                    }`}
                  >
                    {c.type === "fromme" ? (
                      <svg
                        className="svg-outgoing"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0)">
                          <path
                            d="M5.79729 8.20274C4.46102 6.86646 4.15929 5.53019 4.09122 4.99481C4.0722 4.84677 4.12315 4.69832 4.22905 4.59315L5.31043 3.51225C5.4695 3.35328 5.49773 3.10552 5.3785 2.91484L3.65674 0.241323C3.52483 0.0301762 3.25399 -0.0460288 3.03133 0.0653575L0.267294 1.36712C0.0872392 1.45578 -0.0186665 1.64708 0.00177672 1.84674C0.146604 3.2226 0.746432 6.60481 4.07022 9.92884C7.39402 13.2529 10.7757 13.8525 12.1523 13.9973C12.352 14.0177 12.5433 13.9118 12.6319 13.7318L13.9337 10.9677C14.0447 10.7456 13.969 10.4754 13.7587 10.3433L11.0852 8.62201C10.8946 8.50266 10.6469 8.53068 10.4878 8.6896L9.40688 9.77098C9.30171 9.87688 9.15326 9.92783 9.00522 9.9088C8.46984 9.84074 7.13357 9.53901 5.79729 8.20274Z"
                            fill="black"
                            fillOpacity="0.2"
                          />
                          <path
                            d="M10.6208 5.54925V6.50342C10.6208 6.59583 10.6736 6.68012 10.7567 6.7205C10.8398 6.76087 10.9387 6.75025 11.0114 6.69315L13.7609 4.53256C13.8186 4.48736 13.8524 4.4181 13.8524 4.34477C13.8524 4.27143 13.8186 4.20218 13.7609 4.15697L11.007 1.99325C10.935 1.93716 10.8374 1.92693 10.7553 1.96689C10.6732 2.00684 10.6211 2.09001 10.6208 2.18128V3.14149C10.6205 3.27261 10.5149 3.37914 10.3838 3.38046C9.34052 3.39373 7.04259 3.56294 6.59411 5.72184C6.57391 5.82104 6.61847 5.92219 6.7053 5.97424C6.79214 6.02628 6.90235 6.0179 6.98032 5.95332C7.36435 5.63953 8.03804 5.31028 9.17252 5.31028H10.3818C10.5138 5.31028 10.6208 5.41727 10.6208 5.54925Z"
                            fill="black"
                            fillOpacity="0.2"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0">
                            <rect width="14" height="14" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    ) : null}
                    {contactName ? contactName : c.number }
                    <p className="call-info-wrap">
                      <span className="call-info-time">
                        {c.time}
                      </span>
                      <button
                        className="call-info-btn"
                        onClick={() => {
                            if (contactName) {
                                this.props.setUserInfo(contactName, c.number)
                                this.props.setStateFromRecent({page: ContactsPages.CONTACT_INFO, contactInfoType: ContactInfoType.SHORT_INFO})
                            } else {
                                this.props.setAddContactNumber(c.number)
                            }

                        }}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.625 3C6.86203 3 3 6.86203 3 11.625C3 16.388 6.86203 20.25 11.625 20.25C16.388 20.25 20.25 16.388 20.25 11.625C20.25 6.86203 16.388 3 11.625 3Z"
                            className="info-btn-stroke"
                            strokeMiterlimit="10"
                          />
                          <path
                            d="M10.3125 10.3125H11.8125V15.75"
                            className="info-btn-stroke"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.75 15.9375H13.875"
                            className="info-btn-stroke"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                          />
                          <path
                            d="M11.4063 6.09375C11.2085 6.09375 11.0151 6.1524 10.8507 6.26228C10.6862 6.37216 10.5581 6.52834 10.4824 6.71107C10.4067 6.89379 10.3869 7.09486 10.4255 7.28884C10.4641 7.48282 10.5593 7.661 10.6991 7.80086C10.839 7.94071 11.0172 8.03595 11.2112 8.07453C11.4051 8.11312 11.6062 8.09332 11.7889 8.01763C11.9717 7.94194 12.1278 7.81377 12.2377 7.64932C12.3476 7.48487 12.4062 7.29153 12.4062 7.09375C12.4062 6.82853 12.3009 6.57418 12.1134 6.38664C11.9258 6.19911 11.6715 6.09375 11.4063 6.09375Z"
                            className="info-btn-fill"
                          />
                        </svg>
                      </button>
                    </p>
                  </li>
                ) : null;
              })
            )}
          </ul>
        </div>
      </div>
    );
  }
}

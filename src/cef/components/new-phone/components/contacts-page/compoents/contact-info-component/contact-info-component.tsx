import React, { Component } from "react";
import { ContactsPages } from "../../enums/contacts-pages.enum";
import "./contact-info-component.less";
import png from "../../../../assets/*.png";
import { User } from "../../interfaces/user.interface";
import { CallType } from "../../enums/callType.enum";
import { ContactInfoType } from "../../enums/contactInfoType.enum";
import {system} from "../../../../../../modules/system";
import {CustomEvent} from "../../../../../../modules/custom.event";

export class ContactInfoComponent extends Component<
  {
    setPage: any;
    navigateToSendMessagePage: (phoneNumber: number, contactName: string) => void
    user: User;
    phoneId: number;
    type: ContactInfoType;
  },
  { userName: string }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      userName: "Самый длинный ник в игре",
    };
  }

  navigateToSendMessagePage = () => {
      this.props.navigateToSendMessagePage(this.props.user.phone, this.props.user.name)
  }

  render() {
    return (
      <div className="np-contact-info">
        <div className="np-btns-wrap">
          <button
            className="np-btn np-contact-info-btn"
            onClick={() => this.props.setPage(ContactsPages.RECENT)}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.625 10.5L1.125 6L5.625 1.5M1.75 6H10.875"
                stroke="#2A8CFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Недавние
          </button>
        </div>
        <div className="np-contact-info-user">
          <div className="np-contact-info-user-img">
            <img src={png[this.props.user.photo]} alt="" />
          </div>
          <div className="np-contact-info-user-name">
            {this.props.user.name}
          </div>
        </div>
        <div className="np-btns-wrap">
          <button className="np-contact-info-btn large" onClick={this.navigateToSendMessagePage}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.1322 9.48732C22.6071 7.01681 21.2147 4.76821 19.2109 3.15591C17.1617 1.51634 14.6152 0.623674 11.9908 0.624971C8.8972 0.624971 6.00774 1.81681 3.84751 3.9811C1.75989 6.07532 0.615792 8.84036 0.624932 11.7649C0.625003 13.909 1.25448 16.0059 2.43528 17.7956L2.65618 18.1029L1.43743 23.375L7.26712 21.9247C7.26712 21.9247 7.38392 21.9638 7.47024 21.9968C7.55657 22.0298 8.2995 22.3147 9.08763 22.535C9.74271 22.7179 11.1057 22.9921 12.1736 22.9921C15.2027 22.9921 18.0312 21.819 20.1376 19.6883C22.2252 17.5742 23.3749 14.7635 23.3749 11.7709C23.3751 11.0033 23.2937 10.2378 23.1322 9.48732Z"
                fill="url(#paint0_linear)"
                fillOpacity="0.8"
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="11.9999"
                  y1="0.624969"
                  x2="11.9999"
                  y2="23.375"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#3A9FFF" />
                  <stop offset="1" stopColor="#0A75F2" />
                </linearGradient>
              </defs>
            </svg>
            Написать
          </button>
          <button className="np-contact-info-btn large" onClick={
              (e) => {
                  CustomEvent.triggerServer('phone:requestCall', this.props.phoneId, this.props.user.phone)
                  //this.props.setPage(ContactsPages.CALL)
              }}>
            <svg    
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.8555 23.3748C17.8642 23.3748 16.4718 23.0163 14.3867 21.8514C11.8512 20.4295 9.89006 19.1168 7.36826 16.6016C4.93685 14.1717 3.75365 12.5985 2.09767 9.58519C0.226893 6.18284 0.545799 4.3994 0.902284 3.63718C1.32681 2.72616 1.95346 2.18128 2.76342 1.64046C3.22347 1.33904 3.71032 1.08066 4.21779 0.868584C4.26857 0.846748 4.3158 0.825928 4.35795 0.807139C4.60932 0.693897 4.99017 0.522764 5.4726 0.705576C5.79455 0.826436 6.08197 1.07374 6.53189 1.51808C7.45459 2.42808 8.71549 4.45476 9.18064 5.45007C9.49295 6.12089 9.69963 6.5637 9.70014 7.06034C9.70014 7.64179 9.40764 8.09019 9.05267 8.57413C8.98615 8.66503 8.92013 8.75187 8.85615 8.83616C8.46971 9.34397 8.3849 9.49073 8.44076 9.75276C8.554 10.2794 9.39849 11.847 10.7863 13.2318C12.1742 14.6166 13.6966 15.4078 14.2253 15.5205C14.4985 15.5789 14.6483 15.4905 15.1723 15.0904C15.2475 15.033 15.3247 14.9736 15.4054 14.9142C15.9467 14.5115 16.3743 14.2266 16.942 14.2266H16.9451C17.4392 14.2266 17.8622 14.4409 18.563 14.7943C19.477 15.2554 21.5647 16.5001 22.4803 17.4238C22.9256 17.8727 23.1739 18.1591 23.2953 18.4805C23.4781 18.9645 23.306 19.3438 23.1937 19.5977C23.1749 19.6399 23.1541 19.6861 23.1323 19.7374C22.9185 20.2439 22.6586 20.7298 22.3558 21.1887C21.816 21.9961 21.2691 22.6212 20.3561 23.0463C19.8872 23.268 19.3741 23.3804 18.8555 23.3748Z"
                fill="url(#paint0_linear)"
                fillOpacity="0.8"
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="12.0027"
                  y1="0.625305"
                  x2="12.0027"
                  y2="23.375"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#3A9FFF" />
                  <stop offset="1" stopColor="#0A75F2" />
                </linearGradient>
              </defs>
            </svg>
            Позвонить
          </button>
        </div>
        <div className="np-contact-info-user-info">
          {this.props.type !== ContactInfoType.SHORT_INFO ? (
            <div className="np-contact-info-user-calls">
              <ul>
                <li>Сегодня</li>
                {this.props.user.calls
                  .filter((c) => c.time === system.timeStampStringTime(system.timestamp))
                  .map((c) => {
                    return (
                      <li>
                        <span className="np-contact-info-call-time">
                          {c.time}
                        </span>
                        <span className="np-contact-info-call-type">
                          {c.type === CallType.DISMISSED
                            ? "Отклонённый вызов"
                            : c.type === CallType.MISSED
                            ? "Пропущенный вызов"
                            : c.type === CallType.INCOMING
                            ? "Входящий"
                            : c.type === CallType.OUTGOING
                            ? "Исходящий"
                            : ""}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ) : null}
          <div className="np-contact-info-phone-wrap">
            <p>Номер телефона</p>
            <p className="np-contact-info-phone">{this.props.user.phone}</p>
          </div>
        </div>
        <div className="np-contact-info-btn-wrap">
          <button className="np-btn">Заблокировать контакт</button>
        </div>
        <div className="np-contact-info-btn-wrap">
          <button className="np-btn red" onClick={(e) => {
            CustomEvent.triggerServer('phone:removeContact', this.props.phoneId, this.props.user.phone)
          }}>Удалить контакт</button>
        </div>
      </div>
    );
  }
}

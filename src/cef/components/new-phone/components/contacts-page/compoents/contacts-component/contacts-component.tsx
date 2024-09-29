import React, { Component } from "react";
import png from "./../../../../assets/*.png";
import "./contacts-component.less";
import { Contact } from "../../interfaces/contact.interface";
import { ContactsPages } from "../../enums/contacts-pages.enum";
import { ContactInfoType } from "../../enums/contactInfoType.enum";

export class ContactsComponent extends Component<
  { setPage: any; setStateFromRecent: any; contacts: Contact[]; myNumber: number; setUserInfo: any },
  {
    userImg: string;
    userPhone: number;
    page: string;
    searchValue: string;
  }
> {
  public filteredContacts: Contact[];
  constructor(props: any) {
    super(props);
    this.state = {
      userImg: "user",
      userPhone: 24536783679,
      page: "recent",
      searchValue: "",
    };
    
    this.filteredContacts = this.props.contacts;
  }
  filteringContacts() {}

  render() {
    return (
      <div className="np-contacts">
        <div className="np-contacts-title-wrap">
          <div className="np-contacts-title">Контакты</div>
          <button
            className="np-btn np-btn-icon np-btn-add-contact"
            onClick={() => this.props.setPage(ContactsPages.ADD_CONTACTS)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.75 11C20.75 5.61719 16.3828 1.25 11 1.25C5.61719 1.25 1.25 5.61719 1.25 11C1.25 16.3828 5.61719 20.75 11 20.75C16.3828 20.75 20.75 16.3828 20.75 11Z"
                stroke="#2A8CFF"
                strokeWidth="2"
                strokeMiterlimit="10"
              />
              <path
                d="M15.0625 11H6.9375M11 6.9375V15.0625V6.9375Z"
                stroke="#2A8CFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="np-search-bar">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.4073 19.7527L16.9969 15.3422C18.0587 13.9286 18.6319 12.208 18.63 10.44C18.63 5.92406 14.9559 2.25 10.44 2.25C5.92406 2.25 2.25 5.92406 2.25 10.44C2.25 14.9559 5.92406 18.63 10.44 18.63C12.208 18.6319 13.9286 18.0587 15.3422 16.9969L19.7527 21.4073C19.9759 21.6069 20.2671 21.7135 20.5664 21.7051C20.8658 21.6967 21.1506 21.574 21.3623 21.3623C21.574 21.1506 21.6967 20.8658 21.7051 20.5664C21.7135 20.2671 21.6069 19.9759 21.4073 19.7527ZM4.59 10.44C4.59 9.28298 4.9331 8.15194 5.5759 7.18991C6.21871 6.22789 7.13235 5.47808 8.2013 5.03531C9.27025 4.59253 10.4465 4.47668 11.5813 4.70241C12.7161 4.92813 13.7584 5.48529 14.5766 6.30343C15.3947 7.12156 15.9519 8.16393 16.1776 9.29872C16.4033 10.4335 16.2875 11.6098 15.8447 12.6787C15.4019 13.7476 14.6521 14.6613 13.6901 15.3041C12.7281 15.9469 11.597 16.29 10.44 16.29C8.88906 16.2881 7.40217 15.6712 6.30548 14.5745C5.2088 13.4778 4.59186 11.9909 4.59 10.44Z"
              fill="#343435"
              fillOpacity="0.4"
            />
          </svg>
          <input
            type="text"
            placeholder="Поиск"
            onChange={(e) =>
              this.setState({ ...this.state, searchValue: e.target.value })
            }
          />
        </div>
        <div className="np-contacts-user">
          <div className="np-user-img">
            <img src={png[this.state.userImg]} alt="" />
          </div>
          <div className="np-user-phone-wrap">
            <p className="np-user-phone-label">Мой телефон</p>
            <p className="np-user-phone">{this.props.myNumber}</p>
          </div>
        </div>
        <div className="np-contacts-list-wrap">
          <ul className="np-contacts-list">
            {this.props.contacts.map((c, i) => {
              return (
                <li
                  key={i}
                  className={`np-contact-item ${
                    c.contactName === undefined
                      ? "group-name"
                      : this.props.contacts[i++] === undefined ||
                        this.props.contacts[i++]?.contactName === undefined
                      ? "bbn"
                      : ""
                  }`}
                  onClick={() => {
                    this.props.setUserInfo(c.contactName, c.contactNumber);
                    this.props.setStateFromRecent({page: ContactsPages.CONTACT_INFO, contactInfoType: ContactInfoType.SHORT_INFO})
                  }}
                >
                  {c.contactName ? c.contactName : c.groupName}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

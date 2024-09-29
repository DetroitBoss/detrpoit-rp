// noinspection CheckTagEmptyBody

import React, {Component} from "react";
import png from "./../../assets/*.png";
import {AddChangeContactComponent} from "./compoents/add-change-contact-component/add-change-contact-component";
import {CallComponent} from "./compoents/call-component/call-component";
import {ContactInfoComponent} from "./compoents/contact-info-component/contact-info-component";
import {ContactsComponent} from "./compoents/contacts-component/contacts-component";
import {KeysComponent} from "./compoents/keys-component/keys-components";
import {RecentComponent} from "./compoents/recent-component/recent-component";
import "./contacts-page.less";
import {CallType} from "./enums/callType.enum";
import {ContactInfoType} from "./enums/contactInfoType.enum";
import {ContactRecordType} from "./enums/contactRecordType.enum";
import {ContactsPages} from "./enums/contacts-pages.enum";
import {Contact} from "./interfaces/contact.interface";
import {User} from "./interfaces/user.interface";
import {PhoneHistory} from "../../../../../shared/phone";
import {CustomEvent} from "../../../../modules/custom.event";

export class ContactsPage extends Component<
  {
    myNumber: number;
    onPageChange: any;
    isShowMMButton: any;
    contacts: [string, number][];
    phoneHistory: PhoneHistory[];
    phoneId: number;
    incomingCall?: string;
    navigateToSendMessagePage: (phoneNumber: number, contactName: string) => void;
    currentCall?: string;
  },
  {
    userImg: string;
    userPhone: number;
    page: ContactsPages;
    user: User;
    isCall: boolean;
    callType: CallType;
    enteredPhone: string;
    contactInfoType: ContactInfoType;
    addContactNumber: number
  }
> {
  public contacts: Contact[] = [];
  constructor(props: any) {
    super(props);
    this.state = {
      addContactNumber: 0,
      userImg: "user",
      userPhone: 24536783679,
      page: this.props.incomingCall || this.props.currentCall ? ContactsPages.CALL : ContactsPages.CONTACTS,
      user: {
        phone: 28478302890,
        photo: "user-without-photo",
        name: "Самый длинный ник в игре",
      },
      enteredPhone: this.props.incomingCall ? this.props.incomingCall.toString() : (this.props.currentCall ? this.props.currentCall.toString() : null),
      isCall: !!this.props.currentCall,
      callType: this.props.incomingCall ? CallType.INCOMING : (this.props.currentCall ? CallType.OUTGOING : null),
      contactInfoType: null,
    };
    if (this.props.contacts)
      this.props.contacts.forEach(p => this.contacts.push({ contactNumber: p[1], contactName: p[0], groupName: p[0][0]}))

    this.setPage = this.setPage.bind(this);
    this.setCallType = this.setCallType.bind(this);
    this.setParentState = this.setParentState.bind(this);
    this.setContactInfoType = this.setContactInfoType.bind(this);
    this.setStateFromRecent = this.setStateFromRecent.bind(this);
    this.setUser = this.setUser.bind(this);
    this.setAddContactNumber = this.setAddContactNumber.bind(this);

    CustomEvent.register("phone:startCallTo", (caller: string) => {
      this.setState({
        page: ContactsPages.CALL,
      });
    });
  }

  setPage(page: ContactsPages) {
    this.setState({ ...this.state, page: page },() => console.log(this.state));
  }

  setUser(name: string, number: number) {
    const user = this.state.user;
    user.name = name;
    user.phone = number;
    
    this.setState({user: user});
  }


  setCallType(callType: CallType) {
    this.setState({ ...this.state, callType });
  }

  setIsCall(isCall: boolean) {
    this.setState({ ...this.state, isCall }, () => console.log);
  }
  setParentState(state: {
    callType: CallType;
    page: ContactsPages;
    enteredPhone: string;
  }) {
    this.setState(
      {
        ...this.state,
        callType: state.callType,
        page: state.page,
        enteredPhone: state.enteredPhone,
      },
    );
  }
  setStateFromRecent(state: {page: ContactsPages, contactInfoType: ContactInfoType}) {
    this.setState(
      {
        ...this.state,
        page: state.page, 
        contactInfoType: state.contactInfoType
      },
    );
  }
  setContactInfoType(contactInfoType: ContactInfoType) {
    this.setState({ ...this.state, contactInfoType },() => console.log(this.state));
  }

  setAddContactNumber(number: number) {
    console.log(number)
    this.setState({ addContactNumber: number, page: ContactsPages.ADD_CONTACTS })
  }

  render() {
    return (
      <div className="np-contacts">
        {this.state.page === ContactsPages.ADD_CONTACTS ? (
          <AddChangeContactComponent
              contactNumber={this.state.addContactNumber}
              id={this.props.phoneId}
            type={ContactRecordType.ADD}
            isShowMMButton={this.props.isShowMMButton}
            setPage={this.setPage}/>
        ) : this.state.page === ContactsPages.CHANGE_CONTACT ? (
          <AddChangeContactComponent
              id={this.props.phoneId}
            type={ContactRecordType.EDIT}
            isShowMMButton={this.props.isShowMMButton}
            setPage={this.setPage}
          ></AddChangeContactComponent>
        ) : this.state.page === ContactsPages.CALL ||
          this.state.isCall === true ? (
          <CallComponent
              call={this.props.currentCall ? this.props.currentCall.toString() : this.props.incomingCall}
            setIsCall={this.setIsCall}
            callType={this.state.callType}
            setPage={this.setPage}
            user={{
              phone: +this.state.enteredPhone,
              name: "Самый длинный ник в игре",
              familiar: true,
              photo: "call-user-without-photo",
            }}
            enteredPhone={this.state.enteredPhone}
          ></CallComponent>
        ) : (
          <>
            <div className="np-component">
              {this.state.page === ContactsPages.CONTACTS ? (
                <ContactsComponent
                    setUserInfo={this.setUser}
                    myNumber={this.props.myNumber}
                setStateFromRecent={this.setStateFromRecent}
                  setPage={this.setPage}
                contacts={this.contacts}
                ></ContactsComponent>
              ) : this.state.page === ContactsPages.RECENT ? (
                <RecentComponent
                    setAddContactNumber={this.setAddContactNumber}
                    setUserInfo={this.setUser}
                    history={this.props.phoneHistory}
                    contacts={this.props.contacts}
                    setStateFromRecent={this.setStateFromRecent}
                    setPage={this.setPage}>

                </RecentComponent>
              ) : this.state.page === ContactsPages.KEYS ? (
                <KeysComponent
                    phoneId={this.props.phoneId}
                  setCallType={this.setCallType}
                  setParentState={this.setParentState}
                ></KeysComponent>
              ) : this.state.page === ContactsPages.CONTACT_INFO ? (
                <ContactInfoComponent
                  phoneId={this.props.phoneId}
                  type={this.state.contactInfoType}
                  user={this.state.user}
                  navigateToSendMessagePage={this.props.navigateToSendMessagePage}
                  setPage={this.setPage}
                ></ContactInfoComponent>
              ) : null}
            </div>
            <div className="np-contacts-menu">
              <div className="np-menu-items">
                <button
                  className={
                    this.state.page === ContactsPages.RECENT ||
                    this.state.page === ContactsPages.CONTACT_INFO
                      ? "np-menu-item active"
                      : "np-menu-item"
                  }
                  onClick={() =>
                    this.setState({ ...this.state, page: ContactsPages.RECENT })
                  }
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M13 2.4375C7.16676 2.4375 2.4375 7.16676 2.4375 13C2.4375 18.8332 7.16676 23.5625 13 23.5625C18.8332 23.5625 23.5625 18.8332 23.5625 13C23.5625 7.16676 18.8332 2.4375 13 2.4375ZM17.875 14.625H13C12.7845 14.625 12.5778 14.5394 12.4255 14.387C12.2731 14.2347 12.1875 14.028 12.1875 13.8125V6.5C12.1875 6.28451 12.2731 6.07785 12.4255 5.92548C12.5778 5.7731 12.7845 5.6875 13 5.6875C13.2155 5.6875 13.4222 5.7731 13.5745 5.92548C13.7269 6.07785 13.8125 6.28451 13.8125 6.5V13H17.875C18.0905 13 18.2972 13.0856 18.4495 13.238C18.6019 13.3903 18.6875 13.597 18.6875 13.8125C18.6875 14.028 18.6019 14.2347 18.4495 14.387C18.2972 14.5394 18.0905 14.625 17.875 14.625Z" />
                  </svg>
                  Недавние
                </button>
                <button
                  className={
                    this.state.page === ContactsPages.CONTACTS
                      ? "np-menu-item active"
                      : "np-menu-item"
                  }
                  onClick={() =>
                    this.setState({
                      ...this.state,
                      page: ContactsPages.CONTACTS,
                    })
                  }
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M13 2.4375C7.1759 2.4375 2.4375 7.1759 2.4375 13C2.4375 18.8241 7.1759 23.5625 13 23.5625C18.8241 23.5625 23.5625 18.8241 23.5625 13C23.5625 7.1759 18.8241 2.4375 13 2.4375ZM13.1016 7.3125C13.8247 7.3125 14.5316 7.52694 15.1329 7.92869C15.7341 8.33044 16.2028 8.90147 16.4795 9.56956C16.7562 10.2377 16.8286 10.9728 16.6876 11.682C16.5465 12.3913 16.1983 13.0428 15.6869 13.5541C15.1756 14.0654 14.5241 14.4137 13.8149 14.5547C13.1056 14.6958 12.3705 14.6234 11.7024 14.3467C11.0343 14.07 10.4633 13.6013 10.0615 13.0001C9.65975 12.3988 9.44531 11.6919 9.44531 10.9688C9.44531 9.99905 9.83052 9.06907 10.5162 8.38339C11.2019 7.69771 12.1319 7.3125 13.1016 7.3125ZM13 21.9375C11.7673 21.938 10.5478 21.6828 9.41871 21.1881C8.2896 20.6934 7.27536 19.9699 6.44008 19.0633C6.88898 16.7385 10.921 16.25 13 16.25C15.079 16.25 19.111 16.7385 19.5599 19.0628C18.7247 19.9695 17.7105 20.6932 16.5814 21.188C15.4523 21.6828 14.2328 21.938 13 21.9375Z" />
                  </svg>
                  Контакты
                </button>
                <button
                  className={
                    this.state.page === ContactsPages.KEYS
                      ? "np-menu-item active"
                      : "np-menu-item"
                  }
                  onClick={() =>
                    this.setState({ ...this.state, page: ContactsPages.KEYS })
                  }
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5.28122 8.12497C4.71878 8.12497 4.16897 7.95819 3.70132 7.64571C3.23367 7.33324 2.86918 6.8891 2.65394 6.36948C2.4387 5.84985 2.38239 5.27807 2.49211 4.72643C2.60184 4.1748 2.87268 3.66809 3.27039 3.27039C3.66809 2.87268 4.1748 2.60184 4.72643 2.49211C5.27807 2.38239 5.84985 2.4387 6.36948 2.65394C6.8891 2.86918 7.33324 3.23367 7.64571 3.70132C7.95819 4.16897 8.12497 4.71878 8.12497 5.28122C8.12416 6.03518 7.8243 6.75803 7.29116 7.29116C6.75803 7.8243 6.03518 8.12416 5.28122 8.12497ZM13 8.12497C12.4375 8.12497 11.8877 7.95819 11.4201 7.64571C10.9524 7.33324 10.5879 6.8891 10.3727 6.36948C10.1575 5.84985 10.1011 5.27807 10.2109 4.72643C10.3206 4.1748 10.5914 3.66809 10.9891 3.27039C11.3868 2.87268 11.8935 2.60184 12.4452 2.49211C12.9968 2.38239 13.5686 2.4387 14.0882 2.65394C14.6079 2.86918 15.052 3.23367 15.3645 3.70132C15.6769 4.16897 15.8437 4.71878 15.8437 5.28122C15.8429 6.03518 15.543 6.75803 15.0099 7.29116C14.4768 7.8243 13.7539 8.12416 13 8.12497ZM20.7187 8.12497C20.1563 8.12497 19.6065 7.95819 19.1388 7.64571C18.6712 7.33324 18.3067 6.8891 18.0914 6.36948C17.8762 5.84985 17.8199 5.27807 17.9296 4.72643C18.0393 4.1748 18.3102 3.66809 18.7079 3.27039C19.1056 2.87268 19.6123 2.60184 20.1639 2.49211C20.7156 2.38239 21.2873 2.4387 21.807 2.65394C22.3266 2.86918 22.7707 3.23367 23.0832 3.70132C23.3957 4.16897 23.5625 4.71878 23.5625 5.28122C23.5617 6.03518 23.2618 6.75803 22.7287 7.29116C22.1955 7.8243 21.4727 8.12416 20.7187 8.12497ZM5.28122 15.8437C4.71878 15.8437 4.16897 15.6769 3.70132 15.3645C3.23367 15.052 2.86918 14.6079 2.65394 14.0882C2.4387 13.5686 2.38239 12.9968 2.49211 12.4452C2.60184 11.8935 2.87268 11.3868 3.27039 10.9891C3.66809 10.5914 4.1748 10.3206 4.72643 10.2109C5.27807 10.1011 5.84985 10.1575 6.36948 10.3727C6.8891 10.5879 7.33324 10.9524 7.64571 11.4201C7.95819 11.8877 8.12497 12.4375 8.12497 13C8.12416 13.7539 7.8243 14.4768 7.29116 15.0099C6.75803 15.543 6.03518 15.8429 5.28122 15.8437ZM13 15.8437C12.4375 15.8437 11.8877 15.6769 11.4201 15.3645C10.9524 15.052 10.5879 14.6079 10.3727 14.0882C10.1575 13.5686 10.1011 12.9968 10.2109 12.4452C10.3206 11.8935 10.5914 11.3868 10.9891 10.9891C11.3868 10.5914 11.8935 10.3206 12.4452 10.2109C12.9968 10.1011 13.5686 10.1575 14.0882 10.3727C14.6079 10.5879 15.052 10.9524 15.3645 11.4201C15.6769 11.8877 15.8437 12.4375 15.8437 13C15.8429 13.7539 15.543 14.4768 15.0099 15.0099C14.4768 15.543 13.7539 15.8429 13 15.8437ZM20.7187 15.8437C20.1563 15.8437 19.6065 15.6769 19.1388 15.3645C18.6712 15.052 18.3067 14.6079 18.0914 14.0882C17.8762 13.5686 17.8199 12.9968 17.9296 12.4452C18.0393 11.8935 18.3102 11.3868 18.7079 10.9891C19.1056 10.5914 19.6123 10.3206 20.1639 10.2109C20.7156 10.1011 21.2873 10.1575 21.807 10.3727C22.3266 10.5879 22.7707 10.9524 23.0832 11.4201C23.3957 11.8877 23.5625 12.4375 23.5625 13C23.5617 13.7539 23.2618 14.4768 22.7287 15.0099C22.1955 15.543 21.4727 15.8429 20.7187 15.8437ZM5.28122 23.5625C4.71878 23.5625 4.16897 23.3957 3.70132 23.0832C3.23367 22.7707 2.86918 22.3266 2.65394 21.807C2.4387 21.2873 2.38239 20.7156 2.49211 20.1639C2.60184 19.6123 2.87268 19.1056 3.27039 18.7079C3.66809 18.3102 4.1748 18.0393 4.72643 17.9296C5.27807 17.8199 5.84985 17.8762 6.36948 18.0914C6.8891 18.3067 7.33324 18.6712 7.64571 19.1388C7.95819 19.6065 8.12497 20.1563 8.12497 20.7187C8.12416 21.4727 7.8243 22.1955 7.29116 22.7287C6.75803 23.2618 6.03518 23.5617 5.28122 23.5625ZM13 23.5625C12.4375 23.5625 11.8877 23.3957 11.4201 23.0832C10.9524 22.7707 10.5879 22.3266 10.3727 21.807C10.1575 21.2873 10.1011 20.7156 10.2109 20.1639C10.3206 19.6123 10.5914 19.1056 10.9891 18.7079C11.3868 18.3102 11.8935 18.0393 12.4452 17.9296C12.9968 17.8199 13.5686 17.8762 14.0882 18.0914C14.6079 18.3067 15.052 18.6712 15.3645 19.1388C15.6769 19.6065 15.8437 20.1563 15.8437 20.7187C15.8429 21.4727 15.543 22.1955 15.0099 22.7287C14.4768 23.2618 13.7539 23.5617 13 23.5625ZM20.7187 23.5625C20.1563 23.5625 19.6065 23.3957 19.1388 23.0832C18.6712 22.7707 18.3067 22.3266 18.0914 21.807C17.8762 21.2873 17.8199 20.7156 17.9296 20.1639C18.0393 19.6123 18.3102 19.1056 18.7079 18.7079C19.1056 18.3102 19.6123 18.0393 20.1639 17.9296C20.7156 17.8199 21.2873 17.8762 21.807 18.0914C22.3266 18.3067 22.7707 18.6712 23.0832 19.1388C23.3957 19.6065 23.5625 20.1563 23.5625 20.7187C23.5617 21.4727 23.2618 22.1955 22.7287 22.7287C22.1955 23.2618 21.4727 23.5617 20.7187 23.5625Z" />
                  </svg>
                  Клавиши
                </button>
              </div>
            </div>
          </>
        )}
        {this.state.isCall === true ? <img src={png["call-bg"]} alt="" /> : ""}
      </div>
    );
  }
}

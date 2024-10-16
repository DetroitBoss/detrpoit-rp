import React, {Component} from "react";
import png from "./assets/*.png";
import {BankPage} from "./components/bank-page/bank-page";
import {ContactsPage} from "./components/contacts-page/contacts-page";
import {GPSPage} from "./components/gps-page/gps-page";
import {Messenger} from "./components/messenger/messenger";
import {PhonePages} from "./enums/phonePage.enum";
import "./style.less";
import {PhoneHistory, PhoneSettings} from "../../../shared/phone";
import {CustomEvent} from "../../modules/custom.event";
import {CEF} from "../../modules/CEF";
import {Notification} from "./interfaces/notification.interface";
import {App} from "./interfaces/app.interface";
import {SettingsPage} from "./components/settings/settings";
import {Crypto} from "./components/crypto/crypto";
import PhoneCryptoData from "../../../shared/phone/phoneCryptoData";
import {Health} from "./components/health/health";
import {TaxCategory} from "../../../shared/phone/taxCategory.enum";

export class NewPhone extends Component<
  {},
  {
    page: PhonePages;
    time: Date;
    isButton: boolean;
    bg: string;
    phoneId: number;
    contacts: [string, number][];
    number: number;
    balance: number;
    opened: boolean;
    taxes: [TaxCategory, number][];
    phoneHistory: PhoneHistory[];
    incomingCall?: string;
    currentCall?: string;
    notificationList: Notification[];
    isNotification: boolean;
    apps: App[];
    chosenApps: App[];
    targetMessengerNumber: number;
    targetMessengerName: string;
    settings: PhoneSettings;
    crypto: PhoneCryptoData;
  }
> {
  private notificationIdCounter: number = 0;
  constructor(props: any) {
    super(props);
    this.state = {
      page: PhonePages.MENU,
      time: new Date(),
      isButton: true,
      bg: "default-wallpaper",
      phoneId: 0,
      contacts: [],
      number: 0,
      balance: 0,
      targetMessengerNumber: 0,
      targetMessengerName: "",
      opened: true,
      taxes: [],
      phoneHistory: [],
      apps: [
        {
          name: "Погода",
          isBig: true,
          page: PhonePages.MENU,
          icon: "weather",
        },
        {
          name: "DRP Drive",
          isBig: false,
          page: PhonePages.CONTACTS,
          icon: "onyx-drive",
          isBlock: false,
        },
        {
          name: "DRP FM",
          isBig: false,
          page: PhonePages.CONTACTS,
          icon: "onyx-fm",
          isBlock: false,
        },
        {
          name: "Биржа",
          isBig: false,
          page: PhonePages.CRYPTO,
          icon: "exchange",
          isBlock: false,
        },
        {
          name: "Здоровье",
          isBig: false,
          page: PhonePages.HEALTH,
          icon: "health",
        },
        {
          name: "Messenger",
          isBig: false,
          page: PhonePages.MESSENGER,
          icon: "messenger",
          isBlock: false,
        },
      ],
      chosenApps: [
        {
          name: "Контакты",
          isBig: false,
          page: PhonePages.CONTACTS,
          icon: "calls",
        },
        {
          name: "Банк",
          isBig: false,
          page: PhonePages.BANK,
          icon: "bank",
        },
        {
          name: "GPS",
          isBig: false,
          page: PhonePages.GPS,
          icon: "gps",
        },
        {
          name: "Настройки",
          isBig: false,
          page: PhonePages.SETTINGS,
          icon: "settings",
        },
      ],
      notificationList: [
        //{
        //  program: "gov",
        //  title: "Government news 1",
        //  text: "Тут будут какие-то новости писаться, какая-то инфа",
        //  timer: 10000,
        //},
      ],
      isNotification: false,
      settings: {},
      crypto: null
    };

    CustomEvent.register(
      "phone:open",
      (
        id: number,
        contacts: [string, number][],
        number: number,
        balance: number,
        availableTaxes: [TaxCategory, number][], // id налога, сумма налога(переделать потом)
        phoneHistory: PhoneHistory[],
        settings: PhoneSettings,
        crypto: PhoneCryptoData,
      ) => {
        this.setState({
          phoneId: id,
          contacts: contacts,
          number: number,
          balance: balance,
          opened: true,
          page: PhonePages.MENU,
          taxes: availableTaxes,
          phoneHistory: phoneHistory,
          settings: settings,
          bg: settings?.background ?? "default-wallpaper",
          crypto
        });

        this.setState({ contacts: [["Мой номер", number], ["TAXI", 100], ["Police", 101], ["EMS", 102], ["News", 103], ...contacts] });
        
        CEF.gui.enableCusrsor();
        CustomEvent.triggerClient("phone:opened", true);
      }
    );
    this.onPhoneClosed = this.onPhoneClosed.bind(this);

    CustomEvent.register("phone:closephone", this.onPhoneClosed);

    CustomEvent.register(
      "phone:showalert",
      (
        program: string,
        title: string,
        text: string,
        type: "default" | "success" | "error" = "default",
        timer = 5000,
        time = "Сейчас"
      ) => {
        if (!CEF.id || CEF.gui.currentGui === "personage") return;
        CEF.playSound("sms", 0.12);
        
        const notification: Notification = {
          id: this.notificationIdCounter++,
          text,
          type,
          timer,
          time,
          program,
          title,
        };
        const list = [...this.state.notificationList];
        list.push(notification);
        this.setState({
          ...this.state,
          notificationList: list,
          isNotification: true,
        });
      }
    );

    CustomEvent.register("phone:requestCall", (caller: string) => {
      this.setState({
        incomingCall: caller,
        page: PhonePages.CONTACTS,
        opened: true,
      });
      CEF.gui.enableCusrsor();
    });

    CustomEvent.register("phone:startCallTo", (caller: string) => {
      this.setState({
        currentCall: caller,
        page: PhonePages.CONTACTS,
        opened: true,
      });
    });

    CustomEvent.register("phone:callAborted", () => {
      this.setState({
        incomingCall: null,
        currentCall: null,
        page: PhonePages.MENU,
      });
    });

    CustomEvent.register("phone:payTax:success", (taxCategory: TaxCategory) => {
      const taxes = this.state.taxes.map<[TaxCategory, number]>((tax) => {
        if (tax[0] === taxCategory) tax[1] = 0;
        return tax;
      });

      this.setState({ taxes: taxes });
    });

    CustomEvent.register(
      "phone:contactAdd:success",
      (name: string, number: number) => {
        const contacts = this.state.contacts;
        contacts.push([name, number]);
        this.setState({ page: PhonePages.MENU, contacts: contacts });
      }
    );

    CustomEvent.register('mining:updateAmount', (crypto: PhoneCryptoData) => {
      this.setState({ ...this.state, crypto})
    });

    CustomEvent.register("phone:contactRemove:success", (number: number) => {
      const contacts = this.state.contacts;
      contacts.splice(
        contacts.findIndex((c) => c[1] == number),
        1
      );
      this.setState({ page: PhonePages.MENU, contacts: contacts });
    });

    this.onPageChange = this.onPageChange.bind(this);
    this.isShowMMButton = this.isShowMMButton.bind(this);
    this.onBgChange = this.onBgChange.bind(this);
    this.setParentState = this.setParentState.bind(this);
  }


  onPhoneClosed() {
    this.setState({ page: PhonePages.MENU, opened: false, isNotification: false });
    CustomEvent.triggerClient("phone:opened", false);
    CEF.gui.disableCusrsor();
  }


  onPageChange(page: PhonePages) {
    this.setState({ ...this.state, targetMessengerName: '', targetMessengerNumber: 0, page });
  }

  isShowMMButton(isButton: boolean) {
    this.setState({ ...this.state, isButton });
  }

  onBgChange(bg: string) {
    this.setState({ ...this.state, bg })
  }

  setParentState(settings: PhoneSettings) {
    this.setState({...this.state, settings})
  }
  
  notificationPhone(notification: Notification, key: number) {
    setTimeout(
        () => {
          const notificationList = [...this.state.notificationList];
          notificationList.splice(notificationList.findIndex(n => n.id === notification.id), 1)

          this.setState({
            ...this.state,
            notificationList: notificationList,
            isNotification: notificationList.length !== 0,
          })
        }, notification.timer !== undefined ? notification.timer : 5000
    );
    return this.state.isNotification === true ? (
      <div className="np-notification" key={key}>
        <div className="np-notification-header">
          <div className="np-notification-info">
            <div className="np-notification-icon">
              <img src={png['gov']} alt="" />
            </div>
            <div className="np-notification-name">
              {notification.program.toUpperCase()}
            </div>
          </div>
          <div className="np-notification-time">
            {notification.time === undefined ? "Сейчас" : notification.time}
          </div>
        </div>
        <div className="np-notification-body">
          <div className="np-notification-title">{notification.title}</div>
          <div className="np-notification-text">{notification.text}</div>
        </div>
      </div>
    ) : null;
  }

  navigateToSendMessagePage = (phoneNumber: number, contactName: string) => {
    this.setState({
      targetMessengerNumber: phoneNumber,
      targetMessengerName: contactName,
      page: PhonePages.MESSENGER,
    })
  }

  getNotificationsCount(): number {
    if (!this.state.isNotification) {
      return 0;
    }

    return this.state.notificationList.length;
  }

  render() {
    if (!this.state.opened && this.getNotificationsCount() === 0)
      return <></>;
    // noinspection CheckTagEmptyBody
    return (
      <div
        className={
          this.state.opened === false && this.getNotificationsCount() > 0
            ? "np-wrap half"
            : "np-wrap"
        }
      >
        <img className="np-bg" src={png["phone-bg"]} />
        <div
          className={
            this.state.page === PhonePages.BANK ? "np-page dark" : "np-page"
          }
        >
          <div
            className={
              this.state.page === PhonePages.BANK
                ? "np-page-header white"
                : "np-page-header"
            }
          >
            <div className="np-page-time">
              {this.state.time.getHours() +
                " : " +
                this.state.time.getMinutes()}
              <svg
                className="np-header-svg time"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.41127 10.2595L9.98802 1.99597L1.72449 5.57272H6.41127V10.2595Z"
                  fill="black"
                />
              </svg>
            </div>
            <div className="np-page-bang">
              <img src={png["bang"]} alt="" />
            </div>
            <div className="np-page-info">
              <svg
                className="np-header-svg network"
                width="18"
                height="12"
                viewBox="0 0 18 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.25"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.6479 1.79999H14.4319C14.8649 1.79999 15.2159 2.151 15.2159 2.58399V8.85599C15.2159 9.28898 14.8649 9.63999 14.4319 9.63999H13.6479C13.2149 9.63999 12.8639 9.28898 12.8639 8.85599V2.58399C12.8639 2.151 13.2149 1.79999 13.6479 1.79999Z"
                  fill="black"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.904 3.36798H10.12C9.68701 3.36798 9.336 3.71899 9.336 4.15198V8.85598C9.336 9.28897 9.68701 9.63998 10.12 9.63998H10.904C11.337 9.63998 11.688 9.28897 11.688 8.85598V4.15198C11.688 3.71899 11.337 3.36798 10.904 3.36798ZM6.59187 4.93597H7.37587C7.80886 4.93597 8.15987 5.28698 8.15987 5.71997V8.85597C8.15987 9.28896 7.80886 9.63997 7.37587 9.63997H6.59187C6.15888 9.63997 5.80787 9.28896 5.80787 8.85597V5.71997C5.80787 5.28698 6.15888 4.93597 6.59187 4.93597ZM3.064 6.11195H3.848C4.28099 6.11195 4.632 6.46296 4.632 6.89595V8.85595C4.632 9.28894 4.28099 9.63995 3.848 9.63995H3.064C2.63101 9.63995 2.28 9.28894 2.28 8.85595V6.89595C2.28 6.46296 2.63101 6.11195 3.064 6.11195Z"
                  fill="black"
                />
              </svg>

              <svg
                className="np-header-svg wi-fi"
                width="12"
                height="9"
                viewBox="0 0 12 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.7063 2.77798C10.2081 1.4982 8.31524 0.799988 6.33589 0.799988C4.35067 0.799988 2.45258 1.50237 0.952491 2.78906L0.825093 2.89833C0.722069 2.9867 0.716155 3.14378 0.812245 3.23961L1.69577 4.12068C1.78153 4.2062 1.91866 4.21203 2.01141 4.13411L2.12086 4.04215C3.30224 3.04962 4.78549 2.50939 6.33589 2.50939C7.88101 2.50939 9.35952 3.04593 10.5391 4.03229L10.6486 4.12378C10.7413 4.20135 10.8782 4.19537 10.9638 4.10999L11.8474 3.2288C11.9437 3.13284 11.9376 2.97549 11.8342 2.88721L11.7063 2.77798ZM6.33608 3.5203C7.5833 3.5203 8.7808 3.93405 9.75632 4.70027L9.89419 4.80855C10.0041 4.89488 10.0138 5.05756 9.91482 5.15622L9.02829 6.04029C8.94629 6.12206 8.81655 6.13145 8.72357 6.06234L8.6155 5.98203C7.95663 5.49236 7.16216 5.22969 6.33608 5.22969C5.50492 5.22969 4.7058 5.49562 4.04475 5.99091L3.93657 6.07197C3.84359 6.14164 3.71337 6.13246 3.63112 6.05045L2.74492 5.16671C2.6462 5.06826 2.65557 4.90599 2.76498 4.8195L2.90206 4.71112C3.8799 3.93807 5.08285 3.5203 6.33608 3.5203ZM6.33602 6.2406C6.83738 6.2406 7.32455 6.37235 7.7538 6.62356L7.92772 6.72535C8.05958 6.80251 8.08277 6.98311 7.97466 7.09091L6.4897 8.57175C6.39849 8.66271 6.25061 8.66271 6.15939 8.57175L4.68398 7.10043C4.57634 6.9931 4.59878 6.81342 4.72952 6.73569L4.90149 6.63344C5.33468 6.37587 5.82803 6.2406 6.33602 6.2406Z"
                  fill="black"
                />
              </svg>

              <svg
                className="np-header-svg charge"
                width="22"
                height="10"
                viewBox="0 0 22 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.35"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.38389 0.40802H17.2799C18.3624 0.40802 19.2399 1.28554 19.2399 2.36802V7.46402C19.2399 8.5465 18.3624 9.42402 17.2799 9.42402H2.38389C1.30141 9.42402 0.423889 8.5465 0.423889 7.46402V2.36802C0.423889 1.28554 1.30141 0.40802 2.38389 0.40802ZM2.38399 1.19194C1.73451 1.19194 1.20799 1.71845 1.20799 2.36794V7.46394C1.20799 8.11342 1.73451 8.63994 2.38399 8.63994H17.28C17.9295 8.63994 18.456 8.11342 18.456 7.46394V2.36794C18.456 1.71845 17.9295 1.19194 17.28 1.19194H2.38399Z"
                  fill="black"
                />
                <path
                  opacity="0.4"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.0239 2.99506C20.722 3.35192 21.1999 4.07813 21.1999 4.91597C21.1999 5.75381 20.722 6.48002 20.0239 6.83688V2.99506Z"
                  fill="black"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.77603 1.97595H16.888C17.321 1.97595 17.672 2.32696 17.672 2.75995V7.07195C17.672 7.50494 17.321 7.85595 16.888 7.85595H2.77603C2.34304 7.85595 1.99203 7.50494 1.99203 7.07195V2.75995C1.99203 2.32696 2.34304 1.97595 2.77603 1.97595Z"
                  fill="black"
                />
              </svg>
            </div>
          </div>
          {this.state.page === PhonePages.CONTACTS ? (
            <ContactsPage
              navigateToSendMessagePage={this.navigateToSendMessagePage}
              incomingCall={this.state.incomingCall}
              currentCall={this.state.currentCall}
              phoneId={this.state.phoneId}
              myNumber={this.state.number}
              phoneHistory={this.state.phoneHistory}
              isShowMMButton={this.isShowMMButton}
              onPageChange={this.onPageChange}
              contacts={this.state.contacts}
            ></ContactsPage>
          ) : this.state.page === PhonePages.MENU ? (
            <div className="np-main-page-wrap">
              <div className="np-main-page-bg">
                <img src={png[this.state.settings.background ?? 'default-wallpaper']} alt="" />
              </div>
              {this.state.isNotification === true ? (
                <div className="np-notification-wrap">
                  {this.state.notificationList.map((n, key) => {
                    return this.notificationPhone(n, key);
                  })}
                </div>
              ) : (
                <div className="np-main-page-apps">
                  {this.state.apps.map((a, key) => {
                    return (
                      <div key={key}
                        className={
                          a.isBig === true
                            ? "np-main-page-big-app"
                            : "np-main-page-app"
                        }
                        onClick={() =>
                          a.isBlock === false || a.isBlock === undefined
                            ? this.onPageChange(a.page)
                            : null
                        }
                      >
                        <div className="np-main-page-app-icon">
                          <img src={png[a.icon]} alt="" />
                          {a.isBlock !== undefined && a.isBlock === false ? (
                            <div className="np-main-page-app-blocked">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M19.502 9.94033H18.5351H18.5349V6.53486C18.5348 2.93159 15.6033 0 12 0C8.3968 0 5.46521 2.93159 5.46521 6.53491V9.94038H4.49817C3.73372 9.94038 3.11389 10.5601 3.11389 11.3246V12.1667V21.7737V22.6157C3.11389 23.3803 3.73367 24 4.49817 24H12H19.502C20.2664 24 20.8862 23.3803 20.8862 22.6157V21.7737V12.1667V11.3246C20.8862 10.5601 20.2664 9.94033 19.502 9.94033ZM13.4734 19.8559H10.5267L11.0541 17.3428C10.5609 17.029 10.2314 16.4809 10.2314 15.853C10.2314 14.8763 11.0233 14.0845 12 14.0845C12.9768 14.0845 13.7685 14.8763 13.7685 15.853C13.7685 16.4809 13.4392 17.029 12.946 17.3427L13.4734 19.8559ZM16.2031 9.94033H12H7.79714H7.7969V6.53486C7.7969 4.21704 9.6823 2.33169 12 2.33169C14.3178 2.33169 16.2031 4.21709 16.2031 6.53486V9.94033Z"
                                  fill="white"
                                  fillOpacity="0.9"
                                />
                              </svg>
                            </div>
                          ) : null}
                        </div>
                        <div className="np-main-page-app-name">{a.name}</div>
                      </div>
                    );
                  })}
                  <div className="np-main-page-chosen-panel">
                    {this.state.chosenApps.map((a, key) => {
                      return (
                        <div
                            key={key}
                          className="np-main-page-app"
                          onClick={() =>
                            a.isBlock === false || a.isBlock === undefined
                              ? this.onPageChange(a.page)
                              : null
                          }
                        >
                          <div className="np-main-page-app-icon">
                            <img src={png[a.icon]} alt="" />
                            {a.isBlock !== undefined && a.isBlock === false ? (
                              <div className="np-main-page-app-blocked">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M19.502 9.94033H18.5351H18.5349V6.53486C18.5348 2.93159 15.6033 0 12 0C8.3968 0 5.46521 2.93159 5.46521 6.53491V9.94038H4.49817C3.73372 9.94038 3.11389 10.5601 3.11389 11.3246V12.1667V21.7737V22.6157C3.11389 23.3803 3.73367 24 4.49817 24H12H19.502C20.2664 24 20.8862 23.3803 20.8862 22.6157V21.7737V12.1667V11.3246C20.8862 10.5601 20.2664 9.94033 19.502 9.94033ZM13.4734 19.8559H10.5267L11.0541 17.3428C10.5609 17.029 10.2314 16.4809 10.2314 15.853C10.2314 14.8763 11.0233 14.0845 12 14.0845C12.9768 14.0845 13.7685 14.8763 13.7685 15.853C13.7685 16.4809 13.4392 17.029 12.946 17.3427L13.4734 19.8559ZM16.2031 9.94033H12H7.79714H7.7969V6.53486C7.7969 4.21704 9.6823 2.33169 12 2.33169C14.3178 2.33169 16.2031 4.21709 16.2031 6.53486V9.94033Z"
                                    fill="white"
                                    fillOpacity="0.9"
                                  />
                                </svg>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : this.state.page === PhonePages.BANK ? (
            <BankPage availableTaxes={this.state.taxes} />
          )
            : this.state.page === PhonePages.CRYPTO ? (
            <Crypto data={this.state.crypto} />
          )
            : this.state.page === PhonePages.GPS ? (
            <GPSPage />
          ) : this.state.page === PhonePages.SETTINGS ? (
            <SettingsPage
                phoneId={this.state.phoneId}
                setParentState={this.setParentState}
                settings={this.state.settings}
                onBgChange={this.onBgChange}
                bg={this.state.bg}
                phoneNumber={this.state.number}
                phoneClose={this.onPhoneClosed} />
          ) : this.state.page === PhonePages.HEALTH ? (
            <Health onClose={this.onPhoneClosed} phoneId={this.state.phoneId}/>
          ): this.state.page=== PhonePages.MESSENGER ? <Messenger
                      phoneId={this.state.phoneId}
                      phoneNumber={this.state.number}
                      targetName={this.state.targetMessengerName}
                      targetNumber={this.state.targetMessengerNumber}
                  /> : null
          }
          {this.state.isButton === true &&
          this.state.page !== PhonePages.MENU ? (
            <div className="np-page-footer">
              <div
                className={
                  this.state.page === PhonePages.BANK
                    ? "np-footer-line white"
                    : "np-footer-line"
                }
                onClick={() =>
                  this.setState({ ...this.state, page: PhonePages.MENU })
                }
              ></div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

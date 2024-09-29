import React, { Component } from "react";
import { CallType } from "../../enums/callType.enum";
import { ContactsPages } from "../../enums/contacts-pages.enum";
import { KeyTypes } from "../../enums/keyType.enum";
import { Key } from "../../interfaces/key.interface";
import png from "./../../../../assets/*.png";
import "./keys-component.less";
import {CustomEvent} from "../../../../../../modules/custom.event";
import {CEF} from "../../../../../../modules/CEF";

export class KeysComponent extends Component<
  { setParentState: any; setCallType: any; phoneId: number },
  {
    phone: string;
  }
> {
  private keys: Key[] = [];
  constructor(props: any) {
    super(props);
    this.state = {
      phone: "",
    };
    this.keys = [
      { value: "1", type: KeyTypes.NUMBER },
      { value: "2", type: KeyTypes.NUMBER },
      { value: "3", type: KeyTypes.NUMBER },
      { value: "4", type: KeyTypes.NUMBER },
      { value: "5", type: KeyTypes.NUMBER },
      { value: "6", type: KeyTypes.NUMBER },
      { value: "7", type: KeyTypes.NUMBER },
      { value: "8", type: KeyTypes.NUMBER },
      { value: "9", type: KeyTypes.NUMBER },
      { value: "*", type: KeyTypes.SYMBOL },
      { value: "0", type: KeyTypes.NUMBER },
      { value: "#", type: KeyTypes.SYMBOL },
      {},
      { type: KeyTypes.CALL },
      { type: KeyTypes.DELETE },
    ];
    this.characterInput = this.characterInput.bind(this);
    this.characterDelete = this.characterDelete.bind(this);
  }

  characterInput(symbol: string) {
    let phone = this.state.phone;
    this.setState({ phone: (phone += symbol) });
  }

  characterDelete() {
    let phone = this.state.phone;
    this.setState({ phone: phone.slice(0, -1) });
  }

  render() {
    return (
      <div className="np-keys">
        <div className="np-keys-input">
          <input type="text" defaultValue={this.state.phone} />
        </div>
        {/*<button className="np-keys-add-contact">Добавить номер</button>*/}
        <div className="np-keys-wrap">
          {this.keys.map((k, i) => {
            return k.type === KeyTypes.NUMBER || k.type === KeyTypes.SYMBOL ? (
              <button
                key={i}
                className="np-key number"
                onClick={() => this.characterInput(k.value)}
              >
                <p>{k.value}</p>
              </button>
            ) : k.type === KeyTypes.CALL ? (
              <button
                key={i}
                className="np-key call"
                onClick={() => {
                  if (!parseInt(this.state.phone)) return CEF.alert.setAlert('error', 'Телефон указан неверно');
                  
                  CustomEvent.triggerServer('phone:requestCall', this.props.phoneId, parseInt(this.state.phone))
                  this.props.setParentState({
                    callType: CallType.OUTGOING,
                    page: ContactsPages.CALL,
                    enteredPhone: this.state.phone
                  });
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.9102 27.125C20.7665 27.125 19.1598 26.7113 16.754 25.3672C13.8284 23.7266 11.5655 22.2119 8.65571 19.3098C5.85024 16.5061 4.48501 14.6908 2.57426 11.2139C0.415669 7.28809 0.783638 5.23028 1.19497 4.35079C1.68481 3.29962 2.40786 2.6709 3.34243 2.04688C3.87326 1.69909 4.43501 1.40095 5.02055 1.15626C5.07915 1.13106 5.13364 1.10704 5.18227 1.08536C5.47231 0.954693 5.91176 0.757232 6.4684 0.96817C6.83989 1.10762 7.17153 1.39297 7.69067 1.90567C8.75532 2.95567 10.2102 5.29415 10.7469 6.44258C11.1073 7.21661 11.3457 7.72754 11.3463 8.30059C11.3463 8.97149 11.0088 9.48887 10.5993 10.0473C10.5225 10.1522 10.4463 10.2523 10.3725 10.3496C9.92661 10.9356 9.82876 11.1049 9.89321 11.4072C10.0239 12.0148 10.9983 13.8236 12.5997 15.4215C14.201 17.0193 15.9577 17.9322 16.5676 18.0623C16.8829 18.1297 17.0557 18.0277 17.6604 17.566C17.7471 17.4998 17.8362 17.4313 17.9293 17.3627C18.554 16.8981 19.0473 16.5693 19.7024 16.5693H19.7059C20.276 16.5693 20.7641 16.8166 21.5727 17.2244C22.6274 17.7565 25.0362 19.1926 26.0926 20.2584C26.6065 20.7764 26.893 21.1068 27.0331 21.4777C27.244 22.0361 27.0454 22.4738 26.9159 22.7668C26.8942 22.8154 26.8702 22.8688 26.845 22.9279C26.5983 23.5124 26.2984 24.073 25.9491 24.6025C25.3262 25.5342 24.6952 26.2555 23.6416 26.7459C23.1007 27.0018 22.5086 27.1314 21.9102 27.125Z"
                    fill="white"
                  />
                </svg>
              </button>
            ) : k.type === KeyTypes.DELETE ? (
              <button
                key={i}
                className="np-key delete"
                onClick={this.characterDelete}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="10.6667"
                    y="9.60001"
                    width="12.8"
                    height="12.8"
                    fill="#343435"
                  />
                  <path
                    d="M25.1957 6H9.8044C9.40589 6.00049 9.01204 6.08586 8.64909 6.25042C8.28613 6.41497 7.96239 6.65495 7.6994 6.95437C7.65385 7.00632 7.61384 7.06287 7.58003 7.12313L2.00003 15.4844C1.90634 15.6401 1.85684 15.8183 1.85684 16C1.85684 16.1817 1.90634 16.3599 2.00003 16.5156L7.5719 24.8638C7.60695 24.9281 7.64886 24.9884 7.6969 25.0438C7.95983 25.3437 8.28369 25.5841 8.64689 25.749C9.01009 25.9139 9.40428 25.9995 9.80315 26H25.1957C25.9392 25.9992 26.652 25.7034 27.1777 25.1777C27.7035 24.652 27.9992 23.9391 28 23.1956V8.80437C27.9992 8.06086 27.7035 7.34804 27.1777 6.8223C26.652 6.29655 25.9392 6.00083 25.1957 6ZM21.75 19.4375C21.8451 19.5299 21.9209 19.6402 21.9729 19.7621C22.0249 19.884 22.0522 20.0151 22.0531 20.1476C22.0541 20.2802 22.0287 20.4116 21.9784 20.5342C21.9281 20.6569 21.8539 20.7683 21.7601 20.862C21.6664 20.9557 21.5549 21.0298 21.4323 21.0801C21.3096 21.1303 21.1782 21.1557 21.0456 21.1547C20.9131 21.1537 20.7821 21.1263 20.6602 21.0743C20.5383 21.0222 20.428 20.9464 20.3357 20.8512L16.9794 17.5L13.625 20.8531C13.4373 21.0408 13.1827 21.1463 12.9172 21.1463C12.6517 21.1463 12.3971 21.0408 12.2094 20.8531C12.0217 20.6654 11.9162 20.4108 11.9162 20.1453C11.9162 19.8798 12.0217 19.6252 12.2094 19.4375L15.5625 16.0831L12.2069 12.7275C12.0193 12.5394 11.914 12.2846 11.9143 12.0189C11.9146 11.7532 12.0204 11.4986 12.2085 11.3109C12.3965 11.1233 12.6514 11.018 12.9171 11.0183C13.1827 11.0186 13.4374 11.1244 13.625 11.3125L16.9807 14.6687L20.335 11.3125C20.5227 11.1249 20.7772 11.0194 21.0425 11.0194C21.3079 11.0194 21.5624 11.1249 21.75 11.3125C21.9377 11.5001 22.0431 11.7546 22.0431 12.02C22.0431 12.2854 21.9377 12.5399 21.75 12.7275L18.3938 16.0831L21.75 19.4375Z"
                    fill="#EEEFF1"
                  />
                </svg>
              </button>
            ) : k.type === undefined ? (
              <button className="np-key empty"></button>
            ) : null;
          })}
        </div>
      </div>
    );
  }
}

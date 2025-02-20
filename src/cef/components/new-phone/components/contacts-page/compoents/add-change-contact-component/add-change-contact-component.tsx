import React, { Component } from "react";
import png from "../../../../assets/*.png";
import "./add-change-contact-component.less";
import { Contact } from "../../interfaces/contact.interface";
import { ContactsPages } from "../../enums/contacts-pages.enum";
import { Emoji } from "../../../../assets/emoji/EmojiList";
import { ContactRecordType } from "../../enums/contactRecordType.enum";
import {CustomEvent} from "../../../../../../modules/custom.event";
import {CEF} from "../../../../../../modules/CEF";

export class AddChangeContactComponent extends Component<
  { setPage: any; isShowMMButton: any; type: ContactRecordType; id?: number; contactNumber?: number },
  {
    contactName: string;
    contactNumber: number;
    isOpenEmojiPopup: boolean;
  }
> {
  public contacts: Contact[];
  public inputNameRef: React.RefObject<any> = React.createRef<HTMLDivElement>();

  constructor(props: any) {
    super(props);
    this.state = {
      contactName: "",
      contactNumber: this.props.contactNumber ? this.props.contactNumber : null,
      isOpenEmojiPopup: false,
    };

    console.log(this.state.contactNumber)
    console.log('props' + this.props.contactNumber)

    this.inputName = this.inputName.bind(this);
    this.inputNumber = this.inputNumber.bind(this);
  }
  public emojiList: string[] = Emoji;

  inputName(e: any) {
    console.log('state: ' + this.state.contactName);
    console.log('e: ' + e.currentTarget.value);
    this.setState({ contactName: e.currentTarget.value });
  }
  inputNumber(e: any) {
    console.log(this.state.contactNumber);
    this.setState({ ...this.state, contactNumber: +e.currentTarget.value });
  }

  componentDidMount() {
    this.props.isShowMMButton(false);
    this.props.type === ContactRecordType.EDIT
      ? (this.inputNameRef.current.innerHTML =
          'Name&nbsp;<img src="/Happy-Happy.185a8dfe.png">&nbsp;Name')
      : null;
    this.props.type === ContactRecordType.EDIT
      ? (this.setState({ contactNumber: 123456789 }))
      : null;
  }

  componentWillUnmount() {
    this.props.isShowMMButton(true);
  }

  render() {
    return (
      <div className="np-add-contact-wrap">
        <div className="np-add-contact">
          <button
            className="np-add-contact-close"
            onClick={() => this.props.setPage(ContactsPages.CONTACTS)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2.25C6.62391 2.25 2.25 6.62391 2.25 12C2.25 17.3761 6.62391 21.75 12 21.75C17.3761 21.75 21.75 17.3761 21.75 12C21.75 6.62391 17.3761 2.25 12 2.25ZM15.5302 14.4698C15.6027 14.5388 15.6608 14.6216 15.7008 14.7133C15.7409 14.805 15.7622 14.9039 15.7635 15.004C15.7648 15.1041 15.746 15.2034 15.7083 15.2961C15.6706 15.3889 15.6147 15.4731 15.5439 15.5439C15.4731 15.6147 15.3889 15.6706 15.2961 15.7083C15.2034 15.746 15.1041 15.7648 15.004 15.7635C14.9039 15.7622 14.805 15.7409 14.7133 15.7008C14.6216 15.6608 14.5388 15.6027 14.4698 15.5302L12 13.0608L9.53016 15.5302C9.38836 15.6649 9.19955 15.7389 9.00398 15.7364C8.8084 15.7339 8.62155 15.6551 8.48325 15.5168C8.34495 15.3785 8.26614 15.1916 8.26364 14.996C8.26114 14.8005 8.33513 14.6116 8.46984 14.4698L10.9392 12L8.46984 9.53016C8.33513 9.38836 8.26114 9.19955 8.26364 9.00398C8.26614 8.8084 8.34495 8.62155 8.48325 8.48325C8.62155 8.34495 8.8084 8.26614 9.00398 8.26364C9.19955 8.26114 9.38836 8.33513 9.53016 8.46984L12 10.9392L14.4698 8.46984C14.6116 8.33513 14.8005 8.26114 14.996 8.26364C15.1916 8.26614 15.3785 8.34495 15.5168 8.48325C15.6551 8.62155 15.7339 8.8084 15.7364 9.00398C15.7389 9.19955 15.6649 9.38836 15.5302 9.53016L13.0608 12L15.5302 14.4698Z" />
            </svg>
          </button>
          <div className="np-add-contact-img">
            <img src={png["add-contact-img"]} alt="" />
          </div>
          <div className="np-add-contact-form-field">
            <label>Имя</label>
            <input
              className="np-contact-input"
              contentEditable="true"
              ref={this.inputNameRef}
              onChange={this.inputName}
            ></input>
            <button
              className="np-add-contact-emoji"
              onClick={() =>
                this.setState({
                  ...this.state,
                  isOpenEmojiPopup: !this.state.isOpenEmojiPopup,
                })
              }
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.4246 3.57558C17.4514 2.59268 16.2935 1.81178 15.0175 1.27773C13.7415 0.743675 12.3726 0.466998 10.9894 0.463594C9.60617 0.460189 8.23591 0.730124 6.95732 1.25789C5.67873 1.78566 4.51702 2.56085 3.53893 3.53894C2.56084 4.51703 1.78565 5.67874 1.25788 6.95733C0.730116 8.23591 0.460182 9.60618 0.463586 10.9894C0.466991 12.3726 0.743667 13.7416 1.27772 15.0175C1.81177 16.2935 2.59268 17.4514 3.57557 18.4246C4.54883 19.4075 5.70671 20.1884 6.98269 20.7225C8.25866 21.2565 9.62758 21.5332 11.0108 21.5366C12.394 21.54 13.7643 21.2701 15.0429 20.7423C16.3215 20.2146 17.4832 19.4394 18.4613 18.4613C19.4394 17.4832 20.2146 16.3215 20.7423 15.0429C21.2701 13.7643 21.54 12.394 21.5366 11.0108C21.5332 9.62759 21.2565 8.25867 20.7225 6.98269C20.1884 5.70672 19.4075 4.54884 18.4246 3.57558ZM14.3751 8.75011C14.5976 8.75011 14.8151 8.81609 15.0001 8.93971C15.1851 9.06332 15.3293 9.23902 15.4145 9.44459C15.4996 9.65016 15.5219 9.87636 15.4785 10.0946C15.4351 10.3128 15.3279 10.5133 15.1706 10.6706C15.0133 10.8279 14.8128 10.9351 14.5946 10.9785C14.3764 11.0219 14.1502 10.9996 13.9446 10.9145C13.739 10.8293 13.5633 10.6851 13.4397 10.5001C13.3161 10.3151 13.2501 10.0976 13.2501 9.87511C13.2497 9.72727 13.2786 9.58081 13.335 9.44415C13.3914 9.30749 13.4742 9.18333 13.5788 9.07879C13.6833 8.97425 13.8075 8.89139 13.9441 8.83499C14.0808 8.77858 14.2273 8.74974 14.3751 8.75011ZM7.6251 8.75011C7.84761 8.75011 8.06511 8.81609 8.25012 8.93971C8.43512 9.06332 8.57932 9.23902 8.66447 9.44459C8.74961 9.65016 8.77189 9.87636 8.72849 10.0946C8.68508 10.3128 8.57793 10.5133 8.4206 10.6706C8.26326 10.8279 8.06281 10.9351 7.84458 10.9785C7.62635 11.0219 7.40015 10.9996 7.19458 10.9145C6.98902 10.8293 6.81331 10.6851 6.6897 10.5001C6.56608 10.3151 6.5001 10.0976 6.5001 9.87511C6.49973 9.72727 6.52858 9.58081 6.58498 9.44415C6.64139 9.30749 6.72424 9.18333 6.82878 9.07879C6.93332 8.97425 7.05749 8.89139 7.19414 8.83499C7.3308 8.77858 7.47726 8.74974 7.6251 8.75011ZM11.0024 17.0001C8.87338 17.0001 7.07666 15.6178 6.51557 13.7268C6.46682 13.5618 6.40635 13.2501 6.40635 13.2501H15.5939C15.5939 13.2501 15.5324 13.5637 15.4846 13.7268C14.9324 15.6187 13.1315 17.0001 11.0024 17.0001Z"
                  fill="#DADADA"
                  fillOpacity="0.8"
                />
              </svg>
            </button>
            {this.state.isOpenEmojiPopup === true ? (
              <div className="np-emoji-popup">
                {Emoji.map((e) => {
                  return (
                    <div
                      className="np-emoji-item"
                      onClick={() => {
                        //console.log(<img src={png[e]} alt="" />);
                        let img = document.createElement("img");
                        img.src = png[e];
                        this.inputNameRef.current.appendChild(img);
                      }}
                    >
                      <img src={png[e]} alt="" />
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
          <div className="np-add-contact-form-field">
            <label>Номер телефона</label>
            <input
              className="np-contact-input"
              value={this.state.contactNumber}
              type="number"
              onChange={this.inputNumber}
            />
          </div>
          <button
            className="np-add-contact-btn"
            onClick={() => {
              if (!this.state.contactNumber || !this.state.contactName) return CEF.alert.setAlert('error', 'Неверно введен номер или имя контакта');
              if (this.props.type === ContactRecordType.ADD)
                CustomEvent.triggerServer("phone:newContact", this.props.id, this.state.contactName, this.state.contactNumber);
              
            }}
          >
            {this.props.type === ContactRecordType.ADD ? (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 0.25C4.62391 0.25 0.25 4.62391 0.25 10C0.25 15.3761 4.62391 19.75 10 19.75C15.3761 19.75 19.75 15.3761 19.75 10C19.75 4.62391 15.3761 0.25 10 0.25ZM13.75 10.75H10.75V13.75C10.75 13.9489 10.671 14.1397 10.5303 14.2803C10.3897 14.421 10.1989 14.5 10 14.5C9.80109 14.5 9.61032 14.421 9.46967 14.2803C9.32902 14.1397 9.25 13.9489 9.25 13.75V10.75H6.25C6.05109 10.75 5.86032 10.671 5.71967 10.5303C5.57902 10.3897 5.5 10.1989 5.5 10C5.5 9.80109 5.57902 9.61032 5.71967 9.46967C5.86032 9.32902 6.05109 9.25 6.25 9.25H9.25V6.25C9.25 6.05109 9.32902 5.86032 9.46967 5.71967C9.61032 5.57902 9.80109 5.5 10 5.5C10.1989 5.5 10.3897 5.57902 10.5303 5.71967C10.671 5.86032 10.75 6.05109 10.75 6.25V9.25H13.75C13.9489 9.25 14.1397 9.32902 14.2803 9.46967C14.421 9.61032 14.5 9.80109 14.5 10C14.5 10.1989 14.421 10.3897 14.2803 10.5303C14.1397 10.671 13.9489 10.75 13.75 10.75Z"
                    fill="white"
                    fillOpacity="0.9"
                  />
                </svg>
                Добавить контакт
              </>
            ) : (
              "Изменить"
            )}
          </button>
        </div>
      </div>
    );
  }
}

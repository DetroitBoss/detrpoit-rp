import React, {Component, createRef} from 'react';
import './style.less'
import {CustomEvent} from '../../modules/custom.event';
import {CEF} from '../../modules/CEF';

interface DialogState {
  id: number;
  length: number;
  title: string;
  text: string;
  inputType: string;
  inputValue: string;
  buttonLeft: string;
  buttonRight: string;
  protectSpawn: boolean;
}

export class Dialog extends Component<any, DialogState> {
  input: React.RefObject<HTMLInputElement>;
  textarea: React.RefObject<HTMLTextAreaElement>;
  initEvent: import("../../../shared/custom.event").CustomEventHandler;
  constructor(props: any) {
    super(props);

    this.state = {
      id: 0,
      length: 20,
      title: '',
      text: '',
      inputType: 'text',
      inputValue: '',
      buttonLeft: '',
      buttonRight: '',
      protectSpawn: true
    };
    this.input = createRef();
    this.textarea = createRef();
    this.handleKeyUp = this.handleKeyUp.bind(this);

    this.initEvent = CustomEvent.register(
      'cef:dialog:init',
      (id, title, text, inputType, buttonLeft, buttonRight, inputValue, length = 20) => {
        setTimeout(() => {
          this.setState({protectSpawn: false});
        }, 1000)
        this.setState({
          id,
          length,
          title,
          inputType,
          inputValue,
          buttonLeft,
          buttonRight,
          text,
          protectSpawn:true
        });
      }
    );

    
    if (this.state.inputValue) {
      setTimeout(() => {
        if (this.state.inputType == 'textarea') {
          this.textarea.current.value = ''
          this.textarea.current.value = this.state.inputValue
        } else if (this.input.current) {
          this.input.current.value = ''
          this.input.current.value = this.state.inputValue
        }
      }, 200)
    }
    
  }


  componentWillUnmount() {
    // document.removeEventListener('keyup', this.handleKeyUp);
    this.initEvent.destroy();
  }

  handleKeyUp(e: React.KeyboardEvent<any>) {
    if (e.keyCode == 13) {
      e.preventDefault();
      this.submit(1);
    }
    if (e.keyCode == 27) {
      e.preventDefault();
      this.submit(0);
    }
  }

  changeNumber(e: any) {
    e.preventDefault();
    if (this.state.inputType == 'int') {
      if (/[-+]?[0-9]+/gi.test(e.target.value)) {
        this.setState({ inputValue: e.target.value });
      }
    } else if (this.state.inputType == 'float') {
      if (!isNaN(parseFloat(e.target.value))) {
        this.setState({ inputValue: e.target.value });
      }
    }
  }

  submit(select: number) {
    let value;
    if (this.state.inputType == 'textarea' && this.textarea.current) {
      value = this.textarea.current.value;
    } else if (this.input.current) {
      value = this.input.current.value;
      if (this.state.inputType == 'int') value = parseInt(value);
      else if (this.state.inputType == 'float') value = parseFloat(value);
    }
    if (!value || !select) value = '';
    value = value.toString().replace(/\n/g, ' ');
    if(this.state.id == 0) mp.trigger(`dialog:stop`);
    else mp.trigger(`client:dialog:submit`, this.state.id, value);
    CEF.gui.setGui(null);
  }

  render() {
    const { title, text, inputType, inputValue, buttonLeft, buttonRight, length } = this.state;
    return (
      <div className="section-middle-block">
        <div className="white-block w500">
          <div className="title-wrap text-center">
            <h3>{title}</h3>
          </div>
          <p className="dialog-text p-0-30">{text}</p>
          {inputType == 'text' || inputType == 'password' ? (
            <input
              onKeyDown={e => this.handleKeyUp(e)}
              name="dialog"
              type={inputType}
              placeholder={inputValue}
              defaultValue={inputValue}
              maxLength={length}
              ref={this.input}
              className="primary-input input-dialog wide text-center mb20"
              autoFocus
            />
          ) : (
            ''
          )}
          {inputType == 'float' || inputType == 'int' ? (
            <input
              onKeyDown={e => this.handleKeyUp(e)}
              name="dialog"
              type="number"
              placeholder={inputValue}
              defaultValue={inputValue}
              maxLength={length}
              step={inputType == 'int' ? 1 : 0.01}
              ref={this.input}
              onChange={this.changeNumber.bind(this)}
              className="primary-input input-dialog wide text-center mb20"
              autoFocus
            />
          ) : (
            ''
          )}
          {inputType == 'textarea' ? (
            <textarea
              onKeyDown={e => this.handleKeyUp(e)}
              name="dialog"
              className="primary-input dialog-textarea wide mb20"
              ref={this.textarea}
              defaultValue={inputValue}
              maxLength={length}
              autoFocus
            ></textarea>
          ) : (
            ''
          )}
          <div className="button-wrap">
            {buttonLeft ? (
              <button
                onClick={() => this.submit(0)}
                className="primary-button cancel"
              >
                <span>{buttonLeft}</span>
              </button>
            ) : (
              ''
            )}
            {buttonRight ? (
              <button
                onClick={() => this.submit(1)}
                className="primary-button"
              >
                <span>{buttonRight}</span>
              </button>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    );
  }
}

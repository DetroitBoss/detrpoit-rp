import React, {Component} from 'react';
import './assets/style.less'
import {CustomEvent} from '../../modules/custom.event';
import {CEF} from '../../modules/CEF';
import ellipse from './assets/ellipse.svg';
import {systemUtil} from '../../../shared/system';

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
  initEvent: import("../../../shared/custom.event").CustomEventHandler;
  constructor(props: any) {
    super(props);

    this.state = {
      id: 1,
      length: 120,
      title: 'Привет',
      text: 'ваывавыа выавы авыа выа ыва выавы авыа выа выа выа выавы выаааал ллвыфдлвдыфв ывдлдыфлв пока',
      inputType: 'float',
      inputValue: '',
      buttonLeft: 'Принять',
      buttonRight: 'Закрыть',
      protectSpawn: true
    };
    this.handleKeyUp = this.handleKeyUp.bind(this);

    this.initEvent = CustomEvent.register(
      'cef:dialog:init',
      (id, title, text, inputType, buttonLeft, buttonRight, inputValue, length = 20) => {
        setTimeout(() => {
          this.setState({ protectSpawn: false });
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
          protectSpawn: true
        });
      }
    );

  }

  handleKeyUp = (e: any) => {
    if (e.keyCode == 13) {
      e.preventDefault();
      this.submit(1);
    }
    else if (e.keyCode == 27) {
      e.preventDefault();
      this.submit(0);
    }
  }

  changeInput = (e: any) => {
    e.preventDefault();
    if (!e.target.value){
      return this.setState({ inputValue: "" });
    }
    const value = systemUtil.filterInput(e.target.value)
    switch (this.state.inputType) {
      case 'int': {
        if (/[-+]?[0-9]+/gi.test(value)) {
          this.setState({ inputValue: value });
        }
        return;
      }
      case 'float': {
        if (!isNaN(parseFloat(value))) {
          this.setState({ inputValue: value });
        }
        return;
      }
      case 'text':
      case 'password':
      case 'textarea': {
        this.setState({ inputValue: value });
        return;
      }
    }
  }

  submit(select: number) {
    if (this.state.protectSpawn) return;
    let value: string | number = this.state.inputValue;
    if (this.state.inputType == 'int') value = parseInt(value);
    else if (this.state.inputType == 'float') value = parseFloat(value);
    if (!value || !select) value = '';
    value = value.toString().replace(/\n/g, ' ');
    if (this.state.id == 0) mp.trigger(`dialog:stop`);
    else mp.trigger(`client:dialog:submit`, this.state.id, value);
    CEF.gui.setGui(null);
  }

  render() {
    const { title, text, inputType, inputValue, buttonLeft, buttonRight, length } = this.state;
    return (
      <div className={`dialog_main`}>
        <div className="dialog_blur" />
        <div className="dialog_grid" />
        <img className="dialog_ellipse" src={ellipse} />
        <div className="dialog_box">
          <h1>{title}</h1>
          <p>{text}</p>
          <div className="dialog_info">
            {this.DialogInfo(inputType, length)}
          </div>
          <div className="dialog_button">
            {buttonLeft ? <div className="dialog_key" onClick={() => this.submit(0)} >{buttonLeft}</div> : null}
            {buttonRight ? <div className="dialog_key" onClick={() => this.submit(1)} >{buttonRight}</div> : null}
          </div>
        </div>
      </div>
    );
  }
  DialogInfo(inputType: string, length: number) {
    switch (inputType) {
      case 'textarea': {
        return <textarea
          onKeyDown={e => this.handleKeyUp(e)}
          name="dialog"
          className="dialog_textarea"
          value={this.state.inputValue}
          maxLength={length}
          onChange={(e: any) => this.changeInput(e)}
          autoFocus
        ></textarea>
      }
      case 'float':
      case 'int': {
        return <input
          onKeyDown={e => this.handleKeyUp(e)}
          name="dialog"
          type="number"
          value={this.state.inputValue}
          maxLength={length}
          step={inputType == 'int' ? 1 : 0.01}
          onChange={(e: any) => this.changeInput(e)}
          className="dialog_int"
          autoFocus
        />;
      }
      case 'text':
      case 'password': {
        return <input
          onKeyDown={e => this.handleKeyUp(e)}
          name="dialog"
          type={inputType}
          value={this.state.inputValue}
          maxLength={length}
          className="dialog_int"
          onChange={(e: any) => this.changeInput(e)}
          autoFocus
        />
      }
      default: null;
    }
  };
}


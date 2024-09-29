import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import {CEF} from '../../modules/CEF';
//import art from './imgs/autoschool-art-end.png';
//import close from './imgs/close.svg';
import {maxMiss} from '.';
import check from './imgs/check.svg';
import err from './imgs/err.svg';
import succ from './imgs/succ.png';
import fail from './imgs/fail.jpg';

interface OutroProps {
  miss: number;
  lic: string;
}

class Outro extends Component<OutroProps, any> {
  constructor(props: OutroProps) {
    super(props);
    console.log(this.props);
  }

  goOut() {
    CEF.gui.setGui(null);
    CustomEvent.triggerServer('client:autoschool:theory', false);
  }

  goPractise() {
    CEF.gui.setGui(null);
    // добавить this.props.lic
    CustomEvent.triggerServer('client:autoschool:theory', true);
  }

  render() {
    return (
      <div className={ this.props.miss <= maxMiss ? `autoschool_succ` : `autoschool_err`}>
          {this.props.miss <= maxMiss ? 
            <>
              <div style={{display:"flex", alignItems: "center"}}><img src={check} style={{width: '6vh', marginRight:'2vh'}}/><h1>Поздравляем</h1></div>
              <p>Вы прошли теорию, совершив {this.props.miss} ошибок!</p>
              <img src={succ} style={{height: '30vh', marginTop: '-3.5vh'}}/>
              <div className="autoschool_key" onClick={() => this.goPractise()}>Перейти к практике</div>
            </> :
            <>
              <img src={err} style={{width: '6vh', marginBottom:'4vh'}}/>
              <h1>Вы не сдали</h1>
              <p style={{marginTop:'3vh'}}>К сожалению, Вы не сдали экзамен</p>
              <p>Вы совершили {this.props.miss} ошибок</p>
              <img src={fail} style={{width: "20vh", marginTop:'3vh', borderRadius:"5vh",  border: "2px solid #f6f6f6"}}></img>
              <div style={{marginTop:'3vh'}} className="autoschool_key" onClick={() => this.goOut()}>Закрыть</div>
            </>
          }
      </div>
    );
  }
}

export default Outro;

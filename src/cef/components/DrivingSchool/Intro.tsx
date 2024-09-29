import React, {Component} from 'react';

import {LicensesData} from './../../../shared/licence';
import teory from './imgs/teory.svg';
import list from './list';
import {maxMiss} from './index';

interface IntroProps {
  go(): void;
  lic: string;
}

class Intro extends Component<IntroProps, any> {
  render() {
    const lic = LicensesData.find(i => i.id === this.props.lic);
    return (
      <div className="autoschool_intro">
        <div>
          <div style={{display:'flex', alignItems:'center', marginBottom:'4vh'}}>
            <h1>{lic.ex}</h1>
            <h1 style={{fontSize: '2vh', marginLeft:'2vh'}}>Лицензия</h1>
          </div>
          <p style={{marginBottom:'4vh', opacity: 0.9, fontSize: '1.3vh'}}>
              Добро пожаловать в автошколу!<br/>
              Для того чтобы получить {lic.name}, вам нужно выполнить следующие действия
              <ul style={{marginTop:'1vh'}}>
                <li>- Ознакомится с теоретической частью дорожных правил</li>
                <li>- Сдать тест по теоретической части</li>
                <li>- Сдать практическую часть экзамена</li>
              </ul>
              <ul style={{marginTop:'1vh'}}>
                <li>
                  В теоретической части {list.length} вопросов
                  <br />
                  Для зачета, правильных ответов должно быть не менее {list.length-maxMiss}
                </li>
                <li>
                  Для сдачи практической части, вам необходимо проехать
                  по обозначенному маршруту, на автомобиле автошколы
                </li>
              </ul>
          </p>
          <div className="autoschool_btn" onClick={this.props.go}>
                    <img src={teory}></img>
                    <h4>Начать экзамен</h4>
          </div>
        </div>
      </div>
    )
/*    return (
      <section className="section-view autoschool-section">
        <div className="box-white box-autoschool posrev">
          <i className="close" style={{ marginRight: 10 }}>
            <img src={close} onClick={() => [CEF.gui.setGui(null), CustomEvent.triggerServer('client:autoschool:theory', false)]} />
          </i>
          <i className="autoschool-art">
            <img src={art} alt="" />
          </i>
          <div className="autoschool-header">
            <div className="title-wrap m0">
              <h2>
                Добро пожаловать
                <br />в автошколу!
              </h2>
              <p>
                Для того чтобы получить водительское удостоверение,
                <br />
                вам нужно выполнить следующие действия
              </p>
            </div>
          </div>
          <div className="white-box-content schoolauto">
            <ul className="list-line mb30">
              <li>ознакомится с теоретической частью дорожных правил</li>
              <li>сдать тест по теоретической части</li>
              <li>сдать практическую часть экзамена</li>
            </ul>
            <ul className="list-circle mb30">
              <li>
                В теоретической части 14 вопросов.
                <br />
                Для зачета, правильных ответов должно быть не менее 12;
              </li>
              <li>
                Для сдачи практической части, вам необходимо проехать
                <br />
                по обозначенному маршруту, на автомобиле автошколы;
              </li>
            </ul>
            <button className="primary-button go-quiz" onClick={this.props.go}>
              <span>Пройти экзамен</span>
            </button>
          </div>
        </div>
      </section>
    );*/
  }
}

export default Intro;

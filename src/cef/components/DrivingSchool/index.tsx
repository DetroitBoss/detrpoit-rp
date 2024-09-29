import React, {Component} from 'react';
import Intro from './Intro';
import Outro from './Outro';
import Questions from './Questions';
import list from './list';
import art from './imgs/autoschool-art.png';
import teory from './imgs/teory.svg';
//import './autoschool.less'
import {LicensesData} from './../../../shared/licence'
import './style.less'
import {CEF} from '../../modules/CEF';
import {CustomEvent} from '../../modules/custom.event';
import {CustomEventHandler} from '../../../shared/custom.event';

interface DrivingSchoolState {
  page: number;
  question: number;
  miss: number;
  lic: string;
}
/** Максимально допустимое количество ошибок */
export const maxMiss = 5;

export class DrivingSchool extends Component<any, DrivingSchoolState> {
  ev: CustomEventHandler;
  constructor(props: any) {
    super(props);

    this.state = {
      page: 0,
      question: 1,
      miss: 0,
      lic: 'car'
    };

    this.ev = CustomEvent.register('drivingschool', (lic: string) => {
        this.setState({page: 1, lic})
    })
  }

  go() {
    this.setState({ page: 2 });
  }
  selectLecenseType = (type:string) => {
      if( ['car', 'moto', 'truck'].includes( type ) ) 
          this.setState({ page: 1, lic: type });         // начать теорию
      else {
        CEF.gui.setGui(null);
        // Начать практику
      }
  }
  confirm(ans: number, callback: Function) {
    if (ans) {
      this.setState((prev: DrivingSchoolState) => {
        const state: any = {
          question: prev.question + 1,
          newQuestion: true,
        };
        if (ans != list[this.state.question - 1].correct) {
          state.miss = prev.miss + 1;
        }
        if (state.question > list.length) {
          return { miss: prev.miss, page: 3 };
        } else {
          return { ...state };
        }
      });
      callback();
    }
  }

  componentWillMount = () => 
      document.addEventListener('keydown', this.close);

  componentWillUnmount(){
      document.removeEventListener('keydown', this.close);
      if (this.ev) this.ev.destroy();
  }

  close = (e: any) => {
      if( this.state.page > 1 ) 
          return;
      if (e.keyCode == 27) {
          CustomEvent.triggerServer('client:autoschool:theory', false);
          CEF.gui.setGui(null);
      }
  }
  render() {
    if (this.state.page == 0) return <></>;
    return (
      <div className="autoschool">
        <div className="autoschool_grid"/>
        {this.state.page == 0 ? 
          <div className="autoschool_main">
              <div style={{position:'relative',height: '85vh', width:'43.5vh'}}><img style={{position:'absolute', bottom: '-7.5vh', marginLeft:'5vh'}} src={art}/></div>
              <div className="autoschool_types">
                  <h1>Автошкола</h1>
                  <p style={{width: '20vh', marginTop: '3.5vh'}}> Добро пожаловать в автошколу!</p>
                  <p style={{width: '25vh', marginTop: '2vh'}}>Для того чтобы получить водительское удостоверение, вам требуетсф выбрать категорию и сдать экзамен.</p>
                  <div className="autoschool_types_items">
                    {LicensesData.filter((item) => ['car', 'moto', 'boat', 'air', 'truck'].includes( item.id )).map( (item)=>{
                         return <div key={item.id} className="autoschool_types_item">
                                  <h2 style={{marginBottom:'1vh'}}>{item.ex}</h2>
                                  <p>Категория позволяет использовать {item.name}</p>
                                  <div onClick={()=>this.selectLecenseType(item.id)}>
                                    <img src={teory}></img>
                                    <h4>{ ['car', 'moto', 'truck'].includes( item.id ) ? "Теория" : "Практика"}</h4>
                                  </div>
                                </div>
                    })}
                  </div>
              </div>
          </div>:
          (this.state.page == 1 ? (
            <Intro go={this.go.bind(this)} lic={this.state.lic} />
          ) : this.state.page == 2 ? (
            <Questions list={list} num={this.state.question} confirm={this.confirm.bind(this)} />
          ) : (
                <Outro miss={this.state.miss} lic={this.state.lic} />
              ))
        }
      </div>
    );
  }
}

export default DrivingSchool;

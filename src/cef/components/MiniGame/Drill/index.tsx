import React, {Component} from 'react';

import './../Provoda/assets/style.less'
//import './assets/style.less'
import {DraggableCore} from 'react-draggable';
import Mouse from './../Provoda/assets/mouse.svg'
import Drill from './assets/drill.png';
import Sverlo1 from './assets/sverlo1.png';
import Sverlo2 from './assets/sverlo2.png';
import Wood from './assets/wood.png';
import {Success} from './../Success/success';
import {CEF} from '../../../modules/CEF';
import {Howl} from "howler";

type PointType = {
    attached:boolean,
    position:[number,number],
    width: [number,number],
    lottie: React.RefObject<any>
}
type DrillType = {
    position:[number,number]
}
type BabloGameType = {
    time: number,
    drill: DrillType,
    point: Array<PointType>; 
    sound: [Howl, number];
}
const points = { min: 4, max: 8};
export class DrillGame extends Component<{
    status: (status: boolean) => void;
}, BabloGameType> {
    intervalID: NodeJS.Timeout;
    constructor(props: any) {
        super(props);
        this.state = {
            time:20,
            drill: { position: [30,50]},
            point: [
//                {attached:false, position: [0,0], width:[0.0,0.0], lottie: React.createRef()}
            ],
            sound: [null, null]
        },
        this.intervalID = setInterval( this.timerGame, 1000);
    }
    successGame = () => {
        //Игра пройдена
        this.props.status(true)
        console.log('end game');
    }
    timerGame = () => {
        if( this.state.time <= 1 ) { 
            clearInterval( this.intervalID );
            // Время вышло
        }
        this.setState({...this.state, time: this.state.time-1});        
    }
    successPoint = () => {
        console.log( this.state.point.filter( i => i.attached === true).length, this.state.point.length )
       if( this.state.point.filter( i => i.attached === true).length >= this.state.point.length )
            this.successGame();
    }
    componentDidMount = () => {
        let addPoint = points.min + Math.floor(Math.random() * Math.floor( points.max - points.min)),
            _point:Array<PointType> = [];
        for( let i=0; i < addPoint; i ++ ) {
            _point.push({attached:false, position: [0, 10.0+i*8.0 + Math.random()*4.0 ], width:[ 0, 10], lottie: React.createRef()});
//            _point.push({attached:false, position: [0, -70.0 + i*18.0 + Math.random()*4.0 ], width:[ 0, 10], lottie: React.createRef()});
        }
        this.setState({...this.state, point:_point});
        
    }
    handleEvent = ( data:any  ) => {
        let _drill = this.state.drill,
            _point = this.state.point,
            addX = (data.deltaX / document.documentElement.clientWidth *100),
            addY = (data.deltaY / document.documentElement.clientHeight *100),
            _sound = this.state.sound,
            newposition:[number,number] = [_drill.position[0]-addX, _drill.position[1]+addY];
        if(_drill.position[0] < 0 ) {
            let inPoint = false;
            this.state.point.map( (data,id)=> {
                if( Math.abs( ( data.position[1]-4.5) - _drill.position[1] ) < 1 ) {
                    if( data.width[0] < data.width[1] || newposition[0] > -10.0 ) {
                        inPoint = true;
                        newposition[1] = data.position[1]-4.5;//40.0
                        data.width[0] += addX/5.0;
                        if( _sound[0] === null ) {
                            _sound[0] = CEF.playSound('drel', 0.05);
                        } 
                        newposition[0] = _drill.position[0]-addX/5.0;
                        if( _point[id].attached === false && data.width[0] >= data.width[1] ) {
                            _point[id].attached = true;
                            _point[id].lottie.current.play();
                        }
                    } 
                }
            });
            if( addX < 0 ) {
                newposition[1] = _drill.position[1];
            }
            else if( inPoint === false ) return;
        } else {
            if( addX < 0 && _sound[0] !== null && _sound[1] === null ) {
                _sound[1] = 0.05;
                const time = setInterval( () =>  {
                    _sound[1] -= 0.005;
                    if( _sound[1] <= 0.005 ) {
                        _sound[0].pause();
                        _sound[0].unload();
                        _sound[0] = null;
                        _sound[1] = null;
                        clearInterval( time );
                    } else {
                        _sound[0].volume(_sound[1]);
                    }
                    this.setState( { ...this.state, sound: _sound } )
                }, 100);
            }            
        }
        _drill.position[0] = newposition[0];
        _drill.position[1] = newposition[1];
        this.setState({...this.state, drill: _drill, point:_point, sound: _sound})
    }
    PrefInt = (number:any, len:number) => {
        if (number.length < len)
           return `0` + number;  
        return number;
     } 
      
    render() {
        return (<>
            {/* <div className="provoda_bg" style={{backgroundImage: `url('./bg.png')`}}/> */}
            <div className="provoda_browser" style={ {mixBlendMode: "normal",background: 'radial-gradient(50% 50% at 50% 50%, rgba(58, 71, 31, 0.64) 0%, rgba(25, 31, 18, 0.94) 100%)'}}>
                <div className="provoda_info">
                    <div>
                        <h1>Просверлите</h1>
                        <h2>Отверстия</h2>
                        <h3>Сверилте отверстия на метках</h3>
                    </div>
                    <div className="provoda_bottom">
                        <img src={Mouse}/>
                        <h4>Двигайте мышью, чтобы управлять дрелью</h4>
                    </div>
                </div>
                <img src={Wood} style={{zIndex:9999, mixBlendMode: "normal",isolation: "isolate", position: `absolute`, right: 0, width: '30vh', height: '100vh'}}/>
                {this.state.point.map( (data) => {
                    return <>
                            <div style={{zIndex:10000, mixBlendMode: "normal",position: `absolute`, right: '20vh', width: `${data.width[1]}vh`, height: '1.2vh', top: `${data.position[1]}vh`, opacity: 0.9, backgroundColor: data.attached ? "rgb(25, 31, 18)": "#FFFFFFFF", borderRadius:"0 1vh 1vh 0"}}>
                            </div>
                            <div style={{zIndex:( data.attached === true ? 99999 : -1), display:'flex',right: '10vh', position: 'absolute', justifyContent:'center', width:'5vh', height:'5vh', top: `${data.position[1]-2.5}vh`}}>
                                {Success( data.lottie, this.successPoint)}
                            </div>
                          </>
                })}
                <DraggableCore key={`dr_${1}`}
                            grid = { [ 0.5 ,  0.5 ] } 
                            onStart={(e: MouseEvent, data: Object) => this.handleEvent(data )}
                            onDrag={(e: MouseEvent, data: Object) => this.handleEvent(data )}
                            onStop={(e: MouseEvent, data: Object) => this.handleEvent(data )}
                    >
                    <div style={{
                        top: `${this.state.drill.position[1]}vh`,
                        zIndex: 10001,
                        display: 'flex',
                        right: `calc( ${this.state.drill.position[0]}vh + 30vh )`,
                        position: `absolute`}}>

                            <img src={Drill} style={{
                                minWidth: '50vh',
                                minHeight: '50vh',
                                width: '50vh',
                                height: '50vh',
                                zIndex: 10002,
                                pointerEvents: 'none'
                            }}/>
                            <div style={{marginBottom:'40vh', height: '10vh', width:'30vh', marginLeft:"-10vh", overflow: 'hidden'}}><img className="drillgame_sverlo" src={Sverlo1} style={{width:'100%', height:'100%', pointerEvents: 'none'}}/></div>
                            <img src={Sverlo2} style={{marginBottom:'40vh', height: '10vh', width:'1vh', pointerEvents: 'none'}}/>
                    </div>
                </DraggableCore>
            </div>                
        </>);
    }
}


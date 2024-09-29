import React, {Component} from 'react';

import './../Provoda/assets/style.less'
//import './assets/style.less'
import {DraggableCore} from 'react-draggable';
import Mouse from './../Provoda/assets/mouse.svg'
import Bag from './assets/bag.png'
import BG from './assets/bg.png'
import Bag_full from './assets/bag_full.png'
import Orange from './assets/orange.png'
import Grass from './../Box/assets/Grass.png';
import {Success} from '../Success/success';

type OrangeType = {
    attached:boolean,
    position:[number,number],
    rotate: number
}
type OrangeGameType = {
    time: number
    orange: Array<OrangeType>; 
}
const positions = [
    {x: 108.0, y: 3.6},
    {x: 96.0, y: 7.0},
    {x: 87.7, y: 9.9},
    {x: 77.5, y: 14.3},
    {x: 68.8, y: 8.9},
    {x: 64.0, y: 4.15},
    {x: 56.0, y: -0.43},
    {x: 48.6, y: 2.3},
    {x: 38.4, y: 2.8},
    {x: 31.7, y: 6.3},
    {x: 32.7, y: 18.2},
    {x: 38.6, y: 26.2},
    {x: 45.6, y: 37.4},
    {x: 54.3, y: 42.8},
    {x: 33.6, y: 40.4},
    {x: 34.1, y: 30.2},
    {x: 26.9, y: 26.4},
    {x: 23.2, y: 30.4},
    {x: 13.4, y: 32.9},
    {x: 16.4, y: 41.4},
    {x: 5.7, y: 36.6},
    {x: -1, y: 32.6},
    {x: -1.94, y: 41.89},
    {x: -1.19, y: 53.3},
    {x: -0.5, y: 20.0},
    {x: -1.7, y: 4.8},
    {x: 9.25, y: 0.3},
    {x: 21.2, y: 0.1}
]
const orange = { min: 6, max: 12};
export class OrangeGame extends Component<{
    status: (status: boolean) => void
    type?: number; 
}, OrangeGameType> {
    intervalID: NodeJS.Timeout;
    lottieRef: React.RefObject<any>;
    constructor(props: any) {
        super(props);
        this.state = {
            time:20,
            orange: [
                {attached:false, position: [0,0], rotate: Math.random()*360.0}
            ],
        },
        this.lottieRef = React.createRef();
        // this.intervalID = setInterval( this.timerGame, 1000);
    }
    successGame = () => {
        clearInterval( this.intervalID );
        this.props.status(true)
        console.log('end game');
    }
    timerGame = () => {
        if( this.state.time <= 1 ) { 
            clearInterval( this.intervalID );
            this.props.status(false)
        }
        this.setState({...this.state, time: this.state.time-1});        
    }
    componentDidMount = () => {
        let addOrange = orange.min + Math.floor(Math.random() * Math.floor( orange.max - orange.min)),
            _orange:Array<OrangeType> = [];
        for( let i=0; i < addOrange; i ++ ) {
            var item = this.props.type === 1 ? {x: 20+Math.random()*100.0, y:Math.random()*50} : positions[Math.floor(Math.random()*positions.length)];
            _orange.push({attached:false, position: [item.x, item.y ], rotate: this.props.type === 1 ? (-90.0+Math.random()*180.0) : (-20.0+Math.random()*40.0)});
        }
        this.setState({...this.state, orange:_orange});
        
    }
    handleEvent = ( data:any, i1: number ) => {
        let _orange = this.state.orange;
        if( _orange[i1].attached === true ) return; 
        _orange[i1].position[0] -= (data.deltaX / document.documentElement.clientHeight *100);
        _orange[i1].position[1] +=  (data.deltaY / document.documentElement.clientHeight *100);
        if( _orange[i1].position[0] < -5 || _orange[i1].position[0] > (document.documentElement.clientWidth/document.documentElement.clientHeight)*98.0 || _orange[i1].position[1] < -5 || _orange[i1].position[1] > 95) return;
        if( _orange[i1].position[1] > 80.0 && _orange[i1].position[0] > 50 && _orange[i1].position[0] < 120) _orange[i1].attached = true;
        let _result = _orange.filter( data => { if( data.attached ===true ) return 1;});
        if( _result.length >= this.state.orange.length ) {
            //this.successGame();
            this.lottieRef.current.setSpeed(0.5);
            this.lottieRef.current.play();
        }
        this.setState({...this.state, orange: _orange})
    }
    PrefInt = (number:any, len:number) => {
        if (number.length < len)
           return `0` + number;  
        return number;
     } 
      
    render() {
//        let time = [ this.PrefInt((Math.floor(this.state.time/60).toString()), 2) , this.PrefInt(( ( this.state.time-Math.floor(this.state.time/60)*60).toString()), 2)]
        return (<>
            {/* <div className="provoda_bg" style={{backgroundImage: `url('./bg.png')`}}/> */}
            <div className="provoda_browser" style={ {userSelect:'none', background: 'radial-gradient(50% 50% at 50% 50%, rgba(48, 71, 31, 0.64) 0%, rgba(35, 25, 17, 0.94) 100%)'}}>
                <div className="provoda_info">
                    <div>
                        <h1>Соберите</h1>
                        <h2>{this.props.type === 1 ?  "Листья марихуанны": "Апельсины"}</h2>
                        <h3>Вам требуется собрать {this.props.type === 1 ?  "листья марихуанны": "апельсины"} в ящик</h3>
                    </div>
                    <div className="provoda_bottom">
                        <img src={Mouse}/>
                        <h4>Двигайте мышью, чтобы перемещать {this.props.type === 1 ?  "листья марихуанны": "апельсины"}</h4>
                    </div>
                </div>
                <div style={{zIndex:( this.state.orange.filter( (data)=>data.attached === true).length >= this.state.orange.length ? 99999 : -1), display:'flex', position: 'absolute', justifyContent:'center', width:'20vh', height:'20vh'}}>
                    {Success( this.lottieRef, this.successGame)}
                </div>
                {/* <div className="bablo_time">
                    <h5>{time[0]}:{time[1]}</h5>
                    <h3>Осталось</h3>
                </div> */}
                { this.props.type === 1 ? null : <>
                    <img src={BG} style={{position: `absolute`, top: 0, width: '130vh', right: '-0vh'}}/>
                    <img src={BG} style={{position: `absolute`, top: '-15vh', width: '130vh', right: '-30vh', transform: "rotate(45deg)"}}/>
                </>}
                <img src={Bag} style={{zIndex:10000, pointerEvents:'none', position: `absolute`, bottom: 0, right: '50vh', width: '80vh'}}/>
                <img src={Bag_full} style={{position: `absolute`, bottom: 0, right: '50vh', width: '80vh'}}/>
                
                {this.state.orange.map( (data, i1) => {
                    return <DraggableCore key={`dr_${i1}`}
                                    grid = { [ 1 ,  1 ] } 
                                    onStart={(e: MouseEvent, data: Object) => this.handleEvent(data, i1 )}
                                    onDrag={(e: MouseEvent, data: Object) => this.handleEvent(data, i1 )}
                                    onStop={(e: MouseEvent, data: Object) => this.handleEvent(data, i1 )}
                                    disabled={data.attached}
                            >
                            <div key={i1} style={{
                                right: `${data.position[0]}vh`,
                                top: `${data.position[1]}vh`,
                                // width:'auto', 
                                // height:'auto',
                                zIndex: data.attached === true ? 9998 : 9999,
                                position: `absolute`}}>

                                    <img src={this.props.type === 1 ? Grass : Orange} style={{
                                        width: this.props.type === 1 ? '12vh': '12vh',
                                        height: this.props.type === 1 ? '12vh': '12vh',
                                        minWidth: '12vh',
                                        minHeight: '12vh',
                                        transform: `rotate(${data.rotate}deg)`,
                                        pointerEvents: 'none'
                                    }}/>
                            </div>
                        </DraggableCore>
                })}
            </div>                
        </>);
    }
}


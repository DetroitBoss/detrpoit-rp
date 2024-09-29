import React, {Component} from 'react';

import './../Provoda/assets/style.less'
//import './assets/style.less'
import {DraggableCore} from 'react-draggable';
import Mouse from './../Provoda/assets/mouse.svg'
import Bag from './assets/bag.png'
import Bag_full from './assets/bag_full.png'
import Cash from './assets/cash.png'

import {Success} from '../Success/success';

type BabloType = {
    attached:boolean,
    position:[number,number],
    rotate: number
}
type BabloGameType = {
    time: number
    bablo: Array<BabloType>;
}
const bablo = { min: 10, max: 15};
export class BabloGame extends Component<{
    status: (status: boolean) => void;
}, BabloGameType> {
    intervalID: NodeJS.Timeout;
    lottieRef: React.RefObject<any>;
    constructor(props: any) {
        super(props);
        this.state = {
            time:20,
            bablo: [
                {attached:false, position: [0,0], rotate: Math.random()*360.0}
            ],
        },
        this.lottieRef = React.createRef();
        this.intervalID = setInterval( this.timerGame, 1000);
    }
    successGame = () => {
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
        let addCash = bablo.min + Math.floor(Math.random() * Math.floor( bablo.max - bablo.min)),
            _bablo:Array<BabloType> = [];
        for( let i=0; i < addCash; i ++ ) {
            _bablo.push({attached:false, position: [10.0 + Math.random()*80.0, 0.0 + Math.random()*50.0 ], rotate: Math.random()*360.0});
        }
        this.setState({...this.state, bablo:_bablo});

    }
    handleEvent = ( data:any, i1: number ) => {
        let _bablo = this.state.bablo;

        if( _bablo[i1].attached === true ) return; 
        _bablo[i1].position[0] += (data.deltaX / document.documentElement.clientWidth *100);
        _bablo[i1].position[1] +=  (data.deltaY / document.documentElement.clientHeight *100);
        if( _bablo[i1].position[1] > 73.0 ) _bablo[i1].attached = true;

        let _result = _bablo.filter( data => { if( data.attached ===true ) return 1;});
        if( _result.length >= this.state.bablo.length ) {
            //this.successGame();
            this.lottieRef.current.setSpeed(0.5);
            this.lottieRef.current.play();
        }
        this.setState({...this.state, bablo: _bablo})
    }
    PrefInt = (number:any, len:number) => {
        if (number.length < len)
           return `0` + number;
        return number;
     }

    render() {
        let time = [ this.PrefInt((Math.floor(this.state.time/60).toString()), 2) , this.PrefInt(( ( this.state.time-Math.floor(this.state.time/60)*60).toString()), 2)]
        return (<>
            {/* <div className="provoda_bg" style={{backgroundImage: `url('./bg.png')`}}/> */}
            <div className="provoda_browser" style={ {background: 'radial-gradient(50% 50% at 50% 50%, rgba(58, 71, 31, 0.64) 0%, rgba(25, 31, 18, 0.94) 100%)'}}>
                <div className="provoda_info">
                    <div>
                        <h1>Соберите</h1>
                        <h2>Деньги</h2>
                        <h3>Вам требуется собрать деньги в сумку</h3>
                    </div>
                    <div className="provoda_bottom">
                        <img src={Mouse}/>
                        <h4>Двигайте мышью, чтобы убрать деньги в сумку</h4>
                    </div>
                </div>
                <div style={{zIndex:( this.state.bablo.filter( (data)=>data.attached === true).length >= this.state.bablo.length ? 99999 : -1), display:'flex', position: 'absolute', justifyContent:'center', width:'20vh', height:'20vh'}}>
                    {Success( this.lottieRef, this.successGame)}
                </div>
                <div className="bablo_time">
                    <h5>{time[0]}:{time[1]}</h5>
                    <h3>Осталось</h3>
                </div>
                <img src={Bag} style={{zIndex:10000, position: `absolute`, bottom: 0, width: '70vh'}}/>
                <img src={Bag_full} style={{position: `absolute`, bottom: 0, width: '70vh'}}/>

                {this.state.bablo.map( (data, i1) => {
                    return <>
                        <DraggableCore key={`dr_${i1}`}
                                    grid = { [ 1 ,  1 ] }
                                    onStart={(e: MouseEvent, data: Object) => this.handleEvent(data, i1 )}
                                    onDrag={(e: MouseEvent, data: Object) => this.handleEvent(data, i1 )}
                                    onStop={(e: MouseEvent, data: Object) => this.handleEvent(data, i1 )}
                                    disabled={data.attached}
                            >
                            <div key={i1} style={{

                                left: `${data.position[0]}vw`,
                                top: `${data.position[1]}vh`,
                                // width:'auto', 

                                // height:'auto',
                                zIndex: data.attached === true ? 9998 : 9999,
                                position: `absolute`}}>

                                    <img src={Cash} style={{
                                        width: '12vh',
                                        height: '12vh',
                                        transform: `rotate(${data.rotate}deg)`,
                                        pointerEvents: 'none'
                                    }}/>
                            </div>
                        </DraggableCore>
                    </>
                })}
            </div>
        </>);
    }
}


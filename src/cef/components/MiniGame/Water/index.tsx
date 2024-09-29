import React, {Component} from 'react';

import './../Provoda/assets/style.less'
//import './assets/style.less'
import {DraggableCore} from 'react-draggable';
import Mouse from './../Provoda/assets/mouse.svg'
import Ground from './assets/Ground.png';
import Tree from './assets/Tree.png';
import Water from './assets/Water.png';
import {Success} from './../Success/success';

type WaterType = {
    position:[number,number],
    rotate: number,
    progress: [number,number]
}
type WaterGameType = {
    drag:boolean,
    pot: WaterType;
}
export class WaterGame extends Component<{
    status: (status: boolean) => void;
}, WaterGameType> {
    lottieRef: React.RefObject<any>;
    intervalID: NodeJS.Timeout;
    constructor(props: any) {
        super(props);
        this.state = {
            drag: false,
            pot: { position: [60,25] ,rotate:-30, progress: [0, 100] }
        },
        this.lottieRef = React.createRef();
    }
    successGame = () => {
        //Игра пройдена
        this.props.status(true)
        console.log('end game');
    }
    componentDidMount = () => {
    }
 
    handleEvent = ( data:any, startstop?:boolean ) => {
        let _pot = this.state.pot, 
            addX = (data.deltaX / document.documentElement.clientWidth * 150 ),
            addY = (data.deltaY / document.documentElement.clientHeight* 150 );
        if( startstop === false ) {
            _pot.rotate = -30;
            if( this.intervalID ) clearInterval( this.intervalID );
            this.intervalID = null;
        }
        if( addY < 0) {
            _pot.rotate += addY;
            if( _pot.rotate < -30 ) _pot.rotate  = -30;
            startstop = false;
            if( this.intervalID ) clearInterval( this.intervalID );
            this.intervalID = null;
        } 
        else if( addY > 0 ) {
            _pot.rotate += addY;
            if( _pot.rotate >= 15 ) {
                _pot.rotate  = 15;
                if( !this.intervalID && _pot.progress[0] < _pot.progress[1]) this.intervalID = setInterval( this.waterAdd, 200);
            }
        } 
        this.setState({...this.state, pot:_pot, drag: startstop });
    } 
    waterAdd = () => {
        let _pot = this.state.pot;
        _pot.progress[0] += 4;
        if(_pot.progress[0] >= _pot.progress[1] ) {
            this.lottieRef.current.setSpeed(0.5);
            this.lottieRef.current.play();
            if( this.intervalID ) clearInterval( this.intervalID );
            this.intervalID = null;
        }
        this.setState({...this.state, pot:_pot , drag: false });
    }
    render() {
        let waters = [0,0,0,0,0,0,0,0,0,0,0,0];
        return (<>
            <div className="provoda_browser" style={ { userSelect:'none', zIndex:10000,background: 'radial-gradient(50% 50% at 50% 50%, rgba(71, 48, 31, 0.64) 0%, rgba(31, 24, 18, 0.94) 100%)'}}>
                <img src={Tree} style={{ zIndex:10001, pointerEvents: 'none', position: `absolute`, right: '5vh', width:'35vh', height:'83vh', bottom:'17vh'}}/> 
                <img src={Ground} style={{ zIndex:10002, pointerEvents: 'none', position: `absolute`, width: '52vw', left: 0, height: '50vh', top:'50vh'}}/> 
                <img src={Ground} style={{ zIndex:10002, pointerEvents: 'none', position: `absolute`, width: '52vw', right: 0, height: '50vh', top:'50vh'}}/> 

                <div style={{position:'absolute', right: '5vh', bottom:'0vh', zIndex:10002}}>
                <div className="water-round-container" style={{bottom: `${-23+this.state.pot.progress[0]/4.5}vh`, transition: "bottom 0.2s ease-out"}}>
                    <div className="water-wave1"></div>
                    <div className="water-wave2"></div>
                    <div className="water-wave3"></div>
                </div>
                </div>
                <div className="provoda_info">
                    <div>
                        <h1>Полейте</h1>
                        <h2>Дерево</h2>
                        <h3>Наклоняйте лейку, чтобы поливать дерево</h3>
                    </div>
                    <div className="provoda_bottom" style={{marginBottom: "8vw"}}>
                        <img src={Mouse}/>
                        <h4>Двигайте мышью, чтобы наклонить лейку</h4>
                    </div>
                </div>
                <div style={{zIndex:( this.state.pot.progress[0] >= this.state.pot.progress[1] ? 99999 : -1), display:'flex', position: 'absolute', justifyContent:'center', width:'20vh', height:'20vh'}}>
                    {Success( this.lottieRef, this.successGame)}
                </div>
                <DraggableCore key={`dr_${1}`}
                            onStart={(e: MouseEvent, data: Object) => this.handleEvent( data, true )}
                            onDrag={(e: MouseEvent, data: Object) => this.handleEvent( data, true )}
                            onStop={(e: MouseEvent, data: Object) => this.handleEvent( data , false)}
                            disabled={this.state.pot.progress[0] >= this.state.pot.progress[1] ? true: false}
                    >

                        <div style={{
                            bottom: `${this.state.pot.position[1]}vh`,
                            zIndex: 10001,
                            display: 'flex',
                            right: `calc(${this.state.pot.position[0]-25}vh)`,
                            transform: `rotate(${this.state.pot.rotate}deg)`,
                            position: `absolute`}}>
                                <div style={{position: `relative`}}>
                                    <img src={Water} style={{
                                        width: '60vh',
                                        minWidth: '60vh',
                                        zIndex: 10003,
                                        margin: 0,
                                        pointerEvents: 'none',
                                        userSelect: 'none'
                                    }}/>
                                    { this.state.pot.rotate >= 15 ?
                                        <div className="rain" style={{display: "flex", zIndex: 0,position: 'absolute',top: `45vh`,right:`-8.5vh`, transform: `rotate(${-200}deg)`}}>
                                            {waters.map( () => {
                                                return <div className="water_stream" style={{animation: `water_game ${0.5+Math.random()*0.5}s infinite linear`}}/>                                
                                            })}
                                        </div>
                                        : null }
                                </div>
                        </div>
                </DraggableCore>
            </div>                
        </>);
    }
}


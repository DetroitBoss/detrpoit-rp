import React, {Component} from 'react';
import './../Provoda/assets/style.less'
import {DraggableCore} from 'react-draggable';
import Mouse from './../Provoda/assets/mouse.svg'
import Hammer from './assets/Hammer.png';
import Spike from './assets/spike.png';
import Wood from './assets/wood.png';
import {Success} from './../Success/success';

type PointType = {
    attached:boolean,
    position:[number,number],
    width: [number,number],
    lottie: React.RefObject<any>
}
type DrillType = {
    position:[number,number]
}
type HammerGameType = {
    time: number,
    drill: DrillType,
    point: Array<PointType>,
    timeMouse: number;
}

const hammerAudio = {
    tick: [
        new Audio(require("./assets/hammer1.mp3")),
        new Audio(require("./assets/hammer2.mp3")),
        new Audio(require("./assets/hammer3.mp3")),
    ],
    done: new Audio(require("./assets/completehammer.mp3")),
    currentlyPlaying: false,
};

const playRandomHammerSound = () => {
    if (hammerAudio.currentlyPlaying)
        return;

    const idx = Math.floor(Math.random() * Math.floor(hammerAudio.tick.length));
    hammerAudio.currentlyPlaying = true;
    hammerAudio.tick[idx].play();
};

const playOnDoneHammerSound = () => {
    hammerAudio.done.play();
};

const onAudioEnded = () => hammerAudio.currentlyPlaying = false;

for (const audio of hammerAudio.tick) {
    audio.addEventListener("ended", onAudioEnded);
}
hammerAudio.done.addEventListener("ended", onAudioEnded);


const points = { min: 4, max: 6};
export class HammerGame extends Component<{
    status: (status: boolean) => void;
}, HammerGameType> {
    intervalID: NodeJS.Timeout;
    constructor(props: any) {
        super(props);
        this.state = {
            time:20,
            drill: { position: [40,50]},
            point: [
            ],
            timeMouse: 0
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
       if( this.state.point.filter( i => i.attached === true).length >= this.state.point.length )
            this.successGame();
    }
    componentDidMount = () => {
        let addPoint = points.min + Math.floor(Math.random() * Math.floor( points.max - points.min)),
            _point:Array<PointType> = [];
        for( let i=0; i < addPoint; i ++ ) {
            _point.push({attached:false, position: [20, 10.0+i*12.0 + Math.random()*2.0 ], width:[ 0, 20], lottie: React.createRef()});
        }
        this.setState({...this.state, point:_point});
    }
    handleEvent = ( data:any  ) => {
        let _drill = this.state.drill,
            _point = this.state.point,
            isReturn = false,
            unix = Math.round((new Date()).getTime() ),
            addX = (data.deltaX / document.documentElement.clientWidth *200),
            addY = (data.deltaY / document.documentElement.clientHeight *200),
            newposition:[number,number] = [_drill.position[0]-addX, _drill.position[1]+addY];

        if(newposition[0] <= 20) {

            let inPoint = false;
            this.state.point.map( (data,id)=> {
                if( Math.abs( ( data.position[1]-0.5) - newposition[1] ) < 3.0  ) {
                    if(  data.position[0] > newposition[0] && addX > 0 ) 
                        newposition[0] = data.position[0];
                    if( Math.abs( data.position[0] - newposition[0] ) < 1.0 
                        && _point[id].attached === false && addX > 0 
                        &&  ( Math.abs( addX )  ) / (unix-this.state.timeMouse) * 5 > 0.25 ) { 
                            inPoint = true;
                            newposition[1] = data.position[1]-0.5; 
                            data.position[0] -= ( Math.abs( addX )  ) / (unix-this.state.timeMouse) * 2;
                            newposition[0] = data.position[0]; 
                            if(  data.position[0] <= 1 ) {
                                _point[id].attached = true;
                                _point[id].position[0] = 1;
                                _point[id].lottie.current.play();
                                playOnDoneHammerSound();
                            } else playRandomHammerSound();
                    } 
                    else if( newposition[0] > data.position[0]  )
                        isReturn = false;
                    else 
                        isReturn = true;
                }
            });
  //        if( addX <= 0 ) newposition[1] = _drill.position[1];
            if( inPoint === false ) 
                if( _drill.position[0] < 0 || isReturn ) return;
        }
        _drill.position[0] = newposition[0] > 0 ? newposition[0] : 0;
        _drill.position[1] = newposition[1];
        this.setState({...this.state, drill: _drill, point:_point, timeMouse: unix })
    }

    render() {
        return (<>
            <div className="provoda_browser" style={ {mixBlendMode: "normal",background: 'radial-gradient(50% 50% at 50% 50%, rgba(58, 71, 31, 0.64) 0%, rgba(25, 31, 18, 0.94) 100%)'}}>
                <div className="provoda_info">
                    <div>

                        <h1>Забейте</h1>
                        <h2>Гвозди</h2>
                        <h3>Забейте поглубже!</h3>
                    </div>
                    <div className="provoda_bottom">
                        <img src={Mouse}/>
                        <h4>Двигайте мышью, чтобы управлять молотком</h4>
                    </div>
                </div>
                <img src={Wood} style={{zIndex:9999, mixBlendMode: "normal",isolation: "isolate", position: `absolute`, right: 0, width: '30vh', height: '100vh'}}/>
                {this.state.point.map( (data,id) => {
                    return <div key={id}>
                            <img src={Spike} style={{zIndex:9998,position: `absolute`, right: `${10+data.position[0]}vh`, width: `${data.width[1]}vh`, height: '3vh', top: `${data.position[1]+1.0}vh`}}></img>
                            <div key={id+10} style={{zIndex:( data.attached === true ? 99999 : -1), display:'flex',right: '34vh', position: 'absolute', justifyContent:'center', width:'5vh', height:'5vh', top: `${data.position[1]}vh`}}>
                                {Success( data.lottie, this.successPoint)}
                            </div>
                          </div>
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
                            <img src={Hammer} style={{
                                width: '25vh',
                                minWidth: '25vh',
                                height: '50vh',
                                zIndex: 10002,
                                pointerEvents: 'none'
                            }}/>
                    </div>
                </DraggableCore>
            </div>                
        </>);
    }
}


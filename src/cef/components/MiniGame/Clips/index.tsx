import React, {Component} from 'react';

import './../Provoda/assets/style.less'
//import './assets/style.less'
import {DraggableCore} from 'react-draggable';
import Mouse from './../Provoda/assets/mouse.svg'
import BG from './assets/bg.png';
import BG_drug from './assets/bg_drug.png';
import Clips1 from './assets/Clips1.png'
import Clips2 from './assets/Clips2.png'
import Sheet from './assets/Sheet.png'
import Sheet_drug from './assets/Sheet_drug.png';
import {Success} from '../Success/success';

type ClipsType = {
    attached:boolean,
    position:[number,number],
    rotate: number
}
type ClipsGameType = {
    time: number;
    clip: {
        position: [number, number],
        rotate: number,
        translate: [string,string],
        toggle: boolean      
    }
    clips: Array<ClipsType>; 
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
const clips = { min: 6, max: 12};
export class ClipsGame extends Component<{
    status: (status: boolean) => void,
    type?: number
}, ClipsGameType> {
    intervalID: NodeJS.Timeout;
    lottieRef: React.RefObject<any>;
    constructor(props: any) {
        super(props);
        this.state = {
            time:20,
            clip: {
                position: [ 50, 50*(document.documentElement.clientWidth/document.documentElement.clientHeight)],
                rotate: 0,              
                translate: ["0","0"],
                toggle: false
            },
            clips: [
                {attached:false, position: [0,0], rotate: Math.random()*360.0}
            ],
        },
        this.lottieRef = React.createRef();
        document.onmousemove = (e:any) => {
            this.moveClips( e );
            //        moveAt(e);
        }
        document.onclick = (e:any) => {
            this.clickClips( e );
        }
        // this.intervalID = setInterval( this.timerGame, 1000);
    }
    successGame = () => {
        //Игра пройдена
        clearInterval( this.intervalID );
        this.props.status(true)
        console.log('end game');
    }
    timerGame = () => {
        if( this.state.time <= 1 ) {
            clearInterval( this.intervalID );
            // Время вышло
            this.props.status(false)
        }
        this.setState({...this.state, time: this.state.time-1});        
    }
    componentDidMount = () => {
        let addClips = clips.min + Math.floor(Math.random() * Math.floor( clips.max - clips.min)),
            _clips:Array<ClipsType> = [];
        for( let i=0; i < addClips; i ++ ) {
            var item = positions[Math.floor(Math.random()*positions.length)];
            _clips.push({attached:false, position: [item.x, item.y ], rotate: -20-Math.random()*80.0});
        }
        this.setState({...this.state, clips:_clips});
        
    }
    clickClips = ( e:any ) => {
        let _clips = this.state.clips,
            _clip = this.state.clip;
        if( _clip.toggle === true ) return 1;
        for( let i=0; i < this.state.clips.length; i ++ ) {
            if( _clips[i].attached === true ) continue;
            if( Math.abs(  this.state.clips[i].position[0]  - ((document.documentElement.clientWidth - document.getElementById('clips').getBoundingClientRect().right ) / document.documentElement.clientHeight * 100) ) < 10.0 && 
            Math.abs(  this.state.clips[i].position[1] - (document.getElementById('clips').getBoundingClientRect().top / document.documentElement.clientHeight * 100) ) < 10)  {
                _clips[i].attached = true;
                _clips[i].rotate = Math.random()*360.0;
                if( _clips.filter( data => data.attached == true ).length >= _clips.length) {
                    this.lottieRef.current.setSpeed(0.5);
                    this.lottieRef.current.play();
                }
                break;
            }
        }
        _clip.rotate = -12;
        _clip.translate = ['0vw', '2vw'];
        _clip.toggle = true;
        setTimeout( ()=>{
            _clip.rotate = 0;
            _clip.translate = ["0","0"];
            this.setState({...this.state, clips:_clips, clip: _clip});
        }, 400);
        setTimeout( ()=>{ _clip.toggle = false; }, 800 );
        this.setState({...this.state, clips:_clips, clip: _clip});
    }
    moveClips = ( e: any ) => {
        let _clip = this.state.clip;
        _clip.position[1] = e.pageX / document.documentElement.clientHeight*100;//document.documentElement.clientWidth * 100;
        _clip.position[0] =  e.pageY / document.documentElement.clientHeight * 100;
        this.setState({...this.state, clip: _clip})
    }
    
    PrefInt = (number:any, len:number) => {
        if (number.length < len)
           return `0` + number;  
        return number;
     } 
      
    render() {
//        let time = [ this.PrefInt((Math.floor(this.state.time/60).toString()), 2) , this.PrefInt(( ( this.state.time-Math.floor(this.state.time/60)*60).toString()), 2)]
        return (<>
            <div className="provoda_browser" style={ {userSelect:'none', background: 'radial-gradient(50% 50% at 50% 50%, rgba(48, 71, 31, 0.64) 0%, rgba(35, 25, 17, 0.94) 100%)'}}>
                <div className="provoda_info">
                    <div>
                        <h1>Обрезка</h1>
                        <h2>Листьев</h2>
                        <h3>Вам требуется обрезать  {this.props.type === 1 ? "" : "гнилые"} листья</h3>
                    </div>
                    <div className="provoda_bottom">
                        <img src={Mouse}/>
                        <h4>Нажимайте, чтобы резать</h4>
                    </div>
                </div>
                <div style={{zIndex:( this.state.clips.filter( (data)=>data.attached === true).length >= this.state.clips.length ? 99999 : -1), display:'flex', position: 'absolute', justifyContent:'center', width:'20vh', height:'20vh'}}>
                    {Success( this.lottieRef, this.successGame)}
                </div>
                {/* <div className="bablo_time">
                    <h5>{time[0]}:{time[1]}</h5>
                    <h3>Осталось</h3>
                </div> */}
                {this.props.type === 1 ? <>
                    <img src={BG_drug} style={{position: `absolute`, top: '5vh', width: '70vh', right: '0vh', transform: "rotate(-45deg)", pointerEvents: 'none'}}/>
                    <img src={BG_drug} style={{position: `absolute`,  width: '70vh', right: '-0vh', top: '-10vh', pointerEvents: 'none' }}/>
                    <img src={BG_drug} style={{position: `absolute`,  width: '75vh', right: '50vh', top:'-13vh', transform:'rotate(-20deg)', pointerEvents: 'none'}}/>
                    <img src={BG_drug} style={{position: `absolute`, top: '5vh', width: '70vh', right: '-30vh', transform: "rotate(-80deg)", pointerEvents: 'none'}}/>
                </>:<>
                    <img src={BG} style={{position: `absolute`, top: 0, width: '130vh', right: '-0vh', pointerEvents: 'none'}}/>
                    <img src={BG} style={{position: `absolute`, top: '-15vh', width: '130vh', right: '-30vh', transform: "rotate(45deg)", pointerEvents: 'none'}}/>
                </>}
                <img src={Clips1} style={{zIndex:10000, position: `absolute`, 
                        top: `${this.state.clip.position[0]-30+4.0}vh`, 
                        left: `${this.state.clip.position[1]-30-17.5}vh`, 
                        transition: "transform 0.33s ease-in-out",
                        pointerEvents: 'none',
                        transform: `rotate(${this.state.clip.rotate}deg) translate(${this.state.clip.translate[0]}, ${this.state.clip.translate[1]})`,
                        width: '80vh'}}/>
                <img id="clips" src={Clips2} style={{zIndex:10000, position: `absolute`, 
                        top: `${this.state.clip.position[0]-30}vh`, 
                        left: `${this.state.clip.position[1]-30}vh`, 
                        pointerEvents: 'none',
//                        transform: `rotate(${this.state.clip.rotate}deg)`,
                        width: '58vh'}}/>

                {this.state.clips.map( (data, i1) => {
                    return <DraggableCore key={`dr_${i1}`}
                                    disabled={true}
                            >
                            <div key={i1} style={{
                                transition: data.attached ? "all 1.33s ease-in-out" : "unset",
                                right: `${data.position[0]}vh`,
                                top: `${data.attached ? "90" : data.position[1]}vh`,
                                opacity: data.attached ? 0.5 : 1,
                                zIndex: data.attached === true ? 9998 : 9999,
                                position: `absolute`}}>

                                    <img src={this.props.type === 1 ? Sheet_drug : Sheet} style={{
                                        transition: data.attached ? "all 1.33s ease-in-out" : "unset",
                                        width: '12vh',
                                        height: '12vh',
                                        minWidth: '12vh',
                                        minHeight: '12vh',
                                        transform: `rotate(${data.rotate}deg)`,
                                        pointerEvents: 'none'
                                    }}/>
                            </div>
                        </DraggableCore>
                    {/* </> */}
                })}
            </div>                
        </>);
    }
}


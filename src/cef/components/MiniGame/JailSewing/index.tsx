import React, {Component} from 'react';

import './../Provoda/assets/style.less'
//import './assets/style.less'
import {DraggableCore} from 'react-draggable';
import Mouse from './../Provoda/assets/mouse.svg'

import List from './assets/List.png';
import List2 from './assets/List2.png';
import Progress from './assets/Progres.png';
import Flame from './assets/Flame.json';
import Svarka from './assets/Svarka.png';
import {Success} from './../Success/success';
import Lottie from 'lottie-react';

type SvarkaType = {
    position:[number,number],
    progress: [number,number]
}
type SvarkaGameType = {
    drag:boolean,
    svarka: SvarkaType;
}
export class JailSewing extends Component<{
    status: (status: boolean) => void;
}, SvarkaGameType> {
    lottieRef: React.RefObject<any>;
    constructor(props: any) {
        super(props);
        this.state = {
            drag: false,
            svarka: { position: [50,-5] , progress: [0, 100] }
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
        let _svarka = this.state.svarka, 
            addX = (data.deltaX / document.documentElement.clientWidth *100),
            addY = (data.deltaY / document.documentElement.clientHeight *100);
        if( _svarka.position[1] + addY > 0 && addY < 0) addY = 0;
        _svarka.position[0] += addX;
        _svarka.position[1] -=  addY;
        if( _svarka.position[1] > 0 ) _svarka.position[1]  = 0;
        if( _svarka.progress[0] < _svarka.progress[1] &&  addX > 0 && _svarka.position[1] > -1 && Math.abs(_svarka.position[0] - _svarka.progress[0]) < (_svarka.progress[0] < 15 ? 15:5 ) ) {
            _svarka.progress[0] += (data.deltaX / document.documentElement.clientWidth *100)/2.0;
            if( _svarka.progress[0] >= _svarka.progress[1] ) {
                _svarka.progress[0] = _svarka.progress[1];
                this.lottieRef.current.setSpeed(0.5);
                this.lottieRef.current.play();
            }
        }

        this.setState({...this.state, svarka:_svarka, drag: startstop });
    } 
    Progress = () => {
        let content:any[] = [];
        for( let i = 0; i < this.state.svarka.progress[1]; i++ ) {
            content.push (<img src={Progress} style={{transition:'0.3s',  height: `8vh`, width: `1.6vw`, position: 'absolute', zIndex: 10000-i, left: `${i >= this.state.svarka.progress[0] ? ( i < this.state.svarka.progress[0]+5? this.state.svarka.progress[0]:0):i}vw`, opacity: (i >= this.state.svarka.progress[0] ? 0: 1) }}></img>);
        }
        return content;
    }
    render() {
        return (<>
            <div className="provoda_browser" style={ { zIndex:10000,background: 'radial-gradient(50% 50% at 50% 50%, rgba(71, 48, 31, 0.64) 0%, rgba(31, 24, 18, 0.94) 100%)'}}>
                <img src={List2} style={{ position: `absolute`, width: '100vw', height: '50vh', top:'0vh'}}/>
                <img src={List} style={{ position: `absolute`, width: '100vw', height: '50vh', top:'50vh'}}/>

                <div className="provoda_info">
                    <div>
                        <h1>Сшейте</h1>
                        <h2>лоскутки</h2>
                        <h3>Выберите заплатку и воспользуйтесь иглой, чтобы сшить</h3>
                    </div>
                    <div className="provoda_bottom">
                        <img src={Mouse}/>
                        <h4>Двигайте мышью, чтобы управлять швейной машинкой</h4>
                    </div>
                </div>
                <div style={{zIndex:( this.state.svarka.progress[0] >= this.state.svarka.progress[1] ? 99999 : -1), display:'flex', position: 'absolute', justifyContent:'center', width:'20vh', height:'20vh'}}>
                    {Success( this.lottieRef, this.successGame)}
                </div>
                { this.Progress() } 
                <DraggableCore key={`dr_${1}`}
                            // grid = { [ 1 ,  1 ] } 
                            onStart={(e: MouseEvent, data: Object) => this.handleEvent( data, true )}
                            onDrag={(e: MouseEvent, data: Object) => this.handleEvent( data, true )}
                            onStop={(e: MouseEvent, data: Object) => this.handleEvent( data , false)}
                    >

                        <div style={{
                            bottom: `${this.state.svarka.position[1]}vh`,
                            zIndex: 10001,
                            display: 'flex',
                            left: `calc(${this.state.svarka.position[0]}vw - 30vh)`,
                            position: `absolute`}}>

                                <img src={Svarka} style={{
                                    width: '30vh',
                                    minWidth: '30vh',
                                    height: '50vh',
                                    zIndex: 10002,
                                    margin: 0,
                                    pointerEvents: 'none',
                                    userSelect: 'none'
                                }}/>
                        </div>
                </DraggableCore>
            </div>                
        </>);
    }
}


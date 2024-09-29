import React, {Component} from 'react';

import './../Provoda/assets/style.less'
//import './assets/style.less'
import {DraggableCore} from 'react-draggable';
import Mouse from './../Provoda/assets/mouse.svg'
import Box from './assets/Box.png';
import Box2 from './assets/Box2.png';
import Scotch from './assets/Scotch.png';
import {Success} from './../Success/success';
import Grass from './assets/Grass.png';
import {CEF} from '../../../modules/CEF';

type BoxType = {
    attached:boolean,
    position:[number,number],
    default:{ top?: number, bottom?:number, left?:number, right?:number },
    rotate: [number,number,number,number],
    scew?: number
}
type GrassType = {
    position: [number, number],
    rotate: number
}
type BoxGameType = {
    boxes: Array<BoxType>; 
    scotch: Array<BoxType>;
    grass?: Array<GrassType>;
}
export class BoxGame extends Component<{
    status: (status: boolean) => void;
    type? : number
}, BoxGameType> {
    lottieRef: React.RefObject<any>;
    constructor(props: any) {
        super(props);
        this.state = {
            boxes: [
                {attached:false, position: [0,-60], default:{ top: -19.5 }, rotate: [0,0,0,360.0], scew: 0},
                {attached:false, position: [60,0],  default:{ right: -29.5},rotate: [0,0,1,90.0], scew: 0},
                {attached:false, position: [0,60],  default:{ bottom: -19.5},rotate: [0,0,0,180.0], scew: 0},
                {attached:false, position: [-60,0], default:{ left: -29.5 }, rotate: [0,0,1,270.0], scew: 0}
            ],
            scotch: []
        },
        this.lottieRef = React.createRef();
    }
    successGame = () => {
        //Игра пройдена
        this.props.status(true)
        console.log('end game');
    }
    componentDidMount = () => {
        let _scotch:Array<BoxType> = [];
        let _grass:Array<GrassType> = [];
         for( let i=0; i < 2; i ++ ) {
//            _scotch.push({attached:false, position: [50.0 + Math.random()*40.0, -90.0 + Math.random()*180.0 ], rotate: [0,0,0,Math.random()*360.0], default: {}});
            _scotch.push({attached:false, position: [65.0 + Math.random()*25.0, 10.0 + Math.random()*80.0 ], rotate: [0,0,0,Math.random()*360.0], default: {}});
        }
        if( this.props.type === 1 ) {
            for( let i = 0; i < 50+Math.random()*10; i++ ) {
                _grass.push({position:[Math.random()*30,Math.random()*30], rotate: Math.random()*360.0});
            }
        }
        this.setState({...this.state, scotch:_scotch, grass: _grass});
    }
    handleEvent = ( data:any, i1: number ) => {
         let _boxes = this.state.boxes;
         if( _boxes[i1].attached === true ) return; 
            switch( i1 ) {
                case 0: {
                    if( _boxes[i1].rotate[0] <= 0-data.deltaY ) return;
                    _boxes[i1].rotate[0] += (data.deltaY / document.documentElement.clientHeight*720 );
                    _boxes[i1].default.top += (data.deltaY / document.documentElement.clientHeight*78 );
                    if(  _boxes[i1].rotate[0] <= 90.0 ) {
                        _boxes[i1].default.left = (_boxes[i1].default.left ? _boxes[i1].default.left : 0) - (data.deltaY / document.documentElement.clientHeight*16 );
                        _boxes[i1].scew +=   (data.deltaY / document.documentElement.clientHeight*80 );
                    }
                    else {
                        _boxes[i1].default.left = (_boxes[i1].default.left ? _boxes[i1].default.left : 0) + (data.deltaY / document.documentElement.clientHeight*16 );
                        _boxes[i1].scew -=   (data.deltaY / document.documentElement.clientHeight*80 );
                    }
                    if( _boxes[i1].rotate[0] >= 180.0) { _boxes[i1].rotate[0] = 180.0; _boxes[i1].attached = true; _boxes[i1].scew = 0; CEF.playSound('box3', 0.05);  }

                    if(  _boxes[i1].rotate[0] >= 0.0 && _boxes[i1].rotate[0] <= 45.0 ) 
                        _boxes[i1].default.top  -=   (data.deltaY / document.documentElement.clientHeight*38 );
                    else if( _boxes[i1].rotate[0] > 45.0 && _boxes[i1].rotate[0] <= 90.0 ) 
                        _boxes[i1].default.top  +=   (data.deltaY / document.documentElement.clientHeight*38 );
                    else if(  _boxes[i1].rotate[0] >= 90.0 && _boxes[i1].rotate[0] <= 135.0 ) 
                        _boxes[i1].default.top  +=   (data.deltaY / document.documentElement.clientHeight*38 );
                    else if( _boxes[i1].rotate[0] > 135.0 && _boxes[i1].rotate[0] < 180.0 ) 
                        _boxes[i1].default.top  -=   (data.deltaY / document.documentElement.clientHeight*38 );
                    if( _boxes[i1].default.top > 0 ) _boxes[i1].default.top = 0.01;

                    break;
                }
                case 2: {
                    if( _boxes[i1].rotate[0] <= 0+data.deltaY ) return;
                    _boxes[i1].rotate[0]-= (data.deltaY / document.documentElement.clientHeight*720 );
                    _boxes[i1].default.bottom -= (data.deltaY / document.documentElement.clientHeight*78 );
                    if(  _boxes[i1].rotate[0] <= 90.0 ) {
                        _boxes[i1].default.right = (_boxes[i1].default.right ? _boxes[i1].default.right : 0) + (data.deltaY / document.documentElement.clientHeight*16 );
                        _boxes[i1].scew -=   (data.deltaY / document.documentElement.clientHeight*80 );
                    }
                    else {
                        _boxes[i1].default.right = (_boxes[i1].default.right ? _boxes[i1].default.right : 0) - (data.deltaY / document.documentElement.clientHeight*16 );
                        _boxes[i1].scew +=   (data.deltaY / document.documentElement.clientHeight*80 );
                    }

                    if(  _boxes[i1].rotate[0] >= 0.0 && _boxes[i1].rotate[0] <= 45.0 ) 
                        _boxes[i1].default.bottom  +=   (data.deltaY / document.documentElement.clientHeight*38 );
                    else if( _boxes[i1].rotate[0] > 45.0 && _boxes[i1].rotate[0] <= 90.0 ) 
                        _boxes[i1].default.bottom  -=   (data.deltaY / document.documentElement.clientHeight*38 );
                    else if(  _boxes[i1].rotate[0] >= 90.0 && _boxes[i1].rotate[0] <= 135.0 ) 
                        _boxes[i1].default.bottom  -=   (data.deltaY / document.documentElement.clientHeight*38 );
                    else if( _boxes[i1].rotate[0] > 135.0 && _boxes[i1].rotate[0] <= 180.0 ) 
                        _boxes[i1].default.bottom  +=   (data.deltaY / document.documentElement.clientHeight*38 );

                    if( _boxes[i1].rotate[0] >= 180.0) { _boxes[i1].rotate[0] = 180.0; _boxes[i1].attached = true; _boxes[i1].scew = 0; CEF.playSound('box3', 0.05);  }
                    if( _boxes[i1].default.bottom > 0 ) _boxes[i1].default.bottom = 0.01;

                    break;
                }
                case 1: {
                    if( _boxes[i1].rotate[1] <= 0+data.deltaX ) return;
                    _boxes[i1].rotate[1] -= (data.deltaX / document.documentElement.clientWidth*720 );
                    _boxes[i1].default.right -= (data.deltaX / document.documentElement.clientWidth*78 )
                    if(  _boxes[i1].rotate[1] <= 90.0 ) 
                        _boxes[i1].scew +=   (data.deltaX / document.documentElement.clientWidth*80 );
                    else 
                        _boxes[i1].scew -=   (data.deltaX / document.documentElement.clientWidth*80 );

                    if(  _boxes[i1].rotate[1] >= 0.0 && _boxes[i1].rotate[1] <= 45.0 ) 
                        _boxes[i1].default.right  +=   (data.deltaX / document.documentElement.clientWidth*38 );
                    else if( _boxes[i1].rotate[1] > 45.0 && _boxes[i1].rotate[1] <= 90.0 ) 
                        _boxes[i1].default.right  -=   (data.deltaX / document.documentElement.clientWidth*38 );
                    else if(  _boxes[i1].rotate[1] >= 90.0 && _boxes[i1].rotate[1] <= 135.0 ) 
                        _boxes[i1].default.right  -=   (data.deltaX / document.documentElement.clientWidth*38 );
                    else if( _boxes[i1].rotate[1] > 135.0 && _boxes[i1].rotate[1] <= 180.0 ) 
                        _boxes[i1].default.right  +=   (data.deltaX / document.documentElement.clientWidth*38 );

                    if( _boxes[i1].rotate[1] >= 180.0) { _boxes[i1].rotate[1] =180.0; _boxes[i1].attached = true; _boxes[i1].scew = 0;  CEF.playSound('box3', 0.05);  }
                    if( _boxes[i1].default.right > -10.0 ) _boxes[i1].default.right = -10.0;
                    break;
                }
                case 3: {
                    if( _boxes[i1].rotate[1] <= 0-data.deltaX ) return;
                    _boxes[i1].rotate[1] += (data.deltaX / document.documentElement.clientWidth*720 );
                    _boxes[i1].default.left += (data.deltaX / document.documentElement.clientWidth*78 )
                    if(  _boxes[i1].rotate[1] <= 90.0 ) 
                        _boxes[i1].scew -=   (data.deltaX / document.documentElement.clientWidth*80 );
                    else 
                        _boxes[i1].scew +=   (data.deltaX / document.documentElement.clientWidth*80 );

                    if(  _boxes[i1].rotate[1] >= 0.0 && _boxes[i1].rotate[1] <= 45.0 ) 
                        _boxes[i1].default.left  -=   (data.deltaX / document.documentElement.clientWidth*38 );
                    else if( _boxes[i1].rotate[1] > 45.0 && _boxes[i1].rotate[1] <= 90.0 ) 
                        _boxes[i1].default.left  +=   (data.deltaX / document.documentElement.clientWidth*38 );
                    else if(  _boxes[i1].rotate[1] >= 90.0 && _boxes[i1].rotate[1] <= 135.0 ) 
                        _boxes[i1].default.left  +=   (data.deltaX / document.documentElement.clientWidth*38 );
                    else if( _boxes[i1].rotate[1] > 135.0 && _boxes[i1].rotate[1] <= 180.0 ) 
                        _boxes[i1].default.left  -=   (data.deltaX / document.documentElement.clientWidth*38 );

                    if( _boxes[i1].rotate[1] >= 180.0) { 
                        _boxes[i1].rotate[1] =180.0; _boxes[i1].attached = true; _boxes[i1].scew = 0; 
                        CEF.playSound('box3', 0.05); 
                    }
                    if( _boxes[i1].default.left > -10.0 ) _boxes[i1].default.left = -10.0;

                    break;
                }

            }
            this.setState({...this.state, boxes: _boxes});
    }
    scotchEvent = ( data:any, i1: number ) => {
        let _scotch:Array<BoxType> = this.state.scotch;
        if( _scotch[i1].attached === true ) return; 
        _scotch[i1].position[0] += (data.deltaX / document.documentElement.clientWidth *100);
        _scotch[i1].position[1] +=  (data.deltaY / document.documentElement.clientHeight *100);
//        console.log( _scotch[i1].position[0] , _scotch[i1].position[1] )
        let result1 = this.state.boxes.filter( (data) =>  data.attached === true );
        if( result1.length < this.state.boxes.length) return this.setState({...this.state, scotch:_scotch});;
        if(  Math.abs( Math.abs( _scotch[i1].position[0] )-40) < 6 && Math.abs( Math.abs( _scotch[i1].position[1] )-40) < 6) {
            _scotch[i1].attached = true;
        }
        this.setState({...this.state, scotch:_scotch});
        let result2 = this.state.scotch.filter( (data) =>  data.attached === true );
        if(result2.length >= this.state.scotch.length ) {//this.successGame();
            this.lottieRef.current.setSpeed(0.5);
            this.lottieRef.current.play();
            CEF.playSound('succ', 0.05); 
        } 
        //else CEF.playSound('box2', 0.05); 
    } 
    addGrass = () => {
        if( !this.state.grass) return;
        let content:any[] = [];
        for( let i = 0; i < this.state.grass.length; i++ ) {
            content.push (<img key={i} src={Grass} style={{ height: `10vh`, position: 'absolute', zIndex: 998, 
                                    left: `${this.state.grass[i].position[0]}vh`, 
                                    top: `${this.state.grass[i].position[1]}vh`,
                                    transform: `rotate(${this.state.grass[i].rotate}deg)` }}></img>);
        }
        return content;
    }
    render() {
        return (<>
            <div className="provoda_browser" style={ {userSelect:'none', background: 'radial-gradient(50% 50% at 50% 50%, rgba(71, 48, 31, 0.64) 0%, rgba(31, 24, 18, 0.94) 100%)'}}>
                <div className="provoda_info">
                    <div>
                        <h1>Упакуйте</h1>
                        <h2>Коробку</h2>
                        <h3>Запакуйте коробку, сложите края и заклейте скотчем</h3>
                    </div>
                    <div className="provoda_bottom">
                        <img src={Mouse}/>
                        <h4>Двигайте мышью, чтобы закрыть и заклеить коробку</h4>
                    </div>
                </div>
                <div style={{zIndex:( this.state.scotch.filter( i => i.attached === true ).length >= this.state.scotch.length ? 99999 : -1), display:'flex', position: 'absolute', justifyContent:'center', width:'20vh', height:'20vh'}}>
                    {Success( this.lottieRef, this.successGame)}
                </div>
                {this.state.scotch.map( (data, idx) => {
                        return <DraggableCore key={`dr_${idx}`}
                                    grid = { [ 1 ,  1 ] } 
                                    onStart={(e: MouseEvent, data: Object) => this.scotchEvent(data, idx )}
                                    onDrag={(e: MouseEvent, data: Object) => this.scotchEvent(data, idx )}
                                    onStop={(e: MouseEvent, data: Object) => this.scotchEvent(data, idx )}
                                    disabled={data.attached}
                                    >
                                    <div key={idx} style={{
                                        left: `${data.position[0]}vw`,
                                        top: `${data.position[1]}vh`,
                                        zIndex: ( 10005 + ( data.attached === true ? 0 : 1)),
                                        position: `absolute`}}>
                                            <img src={Scotch} style={{
                                                width: '20vh',
                                                transform: `rotateX(${data.rotate[0]}deg) rotateY(${data.rotate[1]}deg) rotateZ(${data.rotate[3]}deg)`,
                                                pointerEvents: 'none'
                                            }}/>                                    
                                    </div>                            
                        </DraggableCore>  
                })}

                <div style={{position: `absolute`, width: '40vh', height: '40vh', display: "flex", justifyContent:'center', alignItems:'center'}}>
                    <img src={Box} style={{zIndex:997, position: `absolute`, width: '40vh', height: '40vh'}}/> 
                    {this.props.type === 1 ? this.addGrass() : null}
                    {this.state.boxes.map( (data, i1) => {
                        return <DraggableCore key={`dr_${i1}`}
                                        grid = { [ 1 ,  1 ] } 
                                        onStart={(e: MouseEvent, data: Object) => this.handleEvent(data, i1 )}
                                        onDrag={(e: MouseEvent, data: Object) => this.handleEvent(data, i1 )}
                                        onStop={(e: MouseEvent, data: Object) => this.handleEvent(data, i1 )}
                                        disabled={data.attached}
                                >
                                    <div key={i1} style={{
                                    top: data.default.top ? `${data.default.top}vh` : 'auto',
                                    bottom: data.default.bottom ? `${data.default.bottom}vh` : 'auto',
                                    left: data.default.left ? `${data.default.left}vh` : 'auto',
                                    right: data.default.right ? `${data.default.right}vh` : 'auto',
                                    zIndex: 9999+i1 - ( data.attached === true ? 10 : 0),
                                    position: `absolute`}}>
                                        <img src={Box2} style={{
                                            width: '40vh',
                                            height: '19.5vh',
                                            transformStyle: 'preserve-3d',
                                            transform: `rotateX(${data.rotate[0]}deg) rotateY(${data.rotate[1]}deg) rotateZ(${data.rotate[3]}deg) skew(${data.scew}deg)`,
                                            pointerEvents: 'none'
                                        }}/>                                    
                                    </div>
                                </DraggableCore>
                    })}
                </div>
            </div>                
        </>);
    }
}


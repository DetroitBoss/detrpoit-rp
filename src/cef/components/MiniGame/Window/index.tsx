import React, {Component} from 'react';
import './../Provoda/assets/style.less'
import {DraggableCore} from 'react-draggable';
import Mouse from './../Provoda/assets/mouse.svg'
import BG from './assets/BG.png';
import Shvabra from './assets/Shvabra.png';
import {Success} from './../Success/success';

type WindowType = {
    position:[number,number],
    progress: [number,number]
}
type WindowGameType = {
    drag:boolean,
    shvabra: WindowType,
    size:[number, number];
    canvas: number;
}
export class WindowGame extends Component<{
    status: (status: boolean) => void;
}, WindowGameType> {
    lottieRef: React.RefObject<any>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    constructor(props: any) {
        super(props);
        this.state = {
            drag: false,
            shvabra: { position: [50 ,50] , progress: [0, 1] },
            size: [document.documentElement.clientWidth, document.documentElement.clientHeight],
            canvas: 0
        },
        this.lottieRef = React.createRef(),
        this.canvasRef = React.createRef(),
        document.addEventListener('resize', this.resizeCanvas, false);
    }
    successGame = () => {
        //Игра пройдена
        this.props.status(true)
        console.log('end game');
    }
    componentDidMount = () => {
        let ctx = this.canvasRef.current.getContext('2d');
        this.setState( {...this.state, canvas: this.canvasRef.current.toDataURL().length})
        var imageObj1 = new Image();
        imageObj1.src = BG
        imageObj1.onload = ()=> {
            ctx.drawImage( imageObj1, 0, 0, this.state.size[0], this.state.size[1]);
        }
    }
 
    handleEvent = ( data:any, startstop?:boolean ) => {
        let _shvabra = this.state.shvabra, 
            addX = (data.deltaX / document.documentElement.clientWidth *100),
            addY = (data.deltaY / document.documentElement.clientHeight *100);
            _shvabra.position[0] += addX;
            _shvabra.position[1] +=  addY;
        let x = _shvabra.position[0]/100 *this.state.size[0] - (document.documentElement.clientHeight*0.2),
            y = _shvabra.position[1]/100 *this.state.size[1]  - (document.documentElement.clientHeight*0.0);
        let ctx = this.canvasRef.current.getContext('2d');
        ctx.clearRect( x, y , (document.documentElement.clientHeight*0.4), (document.documentElement.clientHeight*0.04));
        if( this.canvasRef.current.toDataURL().length <= this.state.canvas*1.15 && this.state.shvabra.progress[0] < this.state.shvabra.progress[1]) {
            this.state.shvabra.progress[0] = this.state.shvabra.progress[1];
            this.lottieRef.current.setSpeed(0.5);
            this.lottieRef.current.play();
        }
        this.setState({...this.state, shvabra:_shvabra, drag: startstop });
    } 
    resizeCanvas = () => {
        this.setState( {...this.state, size: [document.documentElement.clientWidth, document.documentElement.clientHeight ]} )
    }
    render() {
        return (<>
            <div className="provoda_browser" style={ { zIndex:10000,background: 'radial-gradient(50% 50% at 50% 50%, rgba(42, 59, 118, 0.58) 0%, #1C1E31 100%)'}}>
                <div className="provoda_info">
                    <div>
                        <h1>Вымойте</h1>
                        <h2>Стекло</h2>
                        <h3>Доведите до блеска!</h3>
                    </div>
                    <div className="provoda_bottom">
                        <img src={Mouse}/>
                        <h4>Двигайте мышью, чтобы перемещать швабру</h4>
                    </div>
                </div>
                <div style={{zIndex:( this.state.shvabra.progress[0] >= this.state.shvabra.progress[1] ? 99999 : -1), display:'flex', position: 'absolute', justifyContent:'center', width:'20vh', height:'20vh'}}>
                    {Success( this.lottieRef, this.successGame)}
                </div>
                {BGcanvas(this.state.size,this.canvasRef)}
                <DraggableCore key={`dr_${1}`}
                            onStart={(e: MouseEvent, data: Object) => this.handleEvent( data, true )}
                            onDrag={(e: MouseEvent, data: Object) => this.handleEvent( data, true )}
                            onStop={(e: MouseEvent, data: Object) => this.handleEvent( data , false)}
                    >

                        <div style={{
                            top: `${this.state.shvabra.position[1]}vh`,
                            zIndex: 10001,
                            display: 'flex',
                            left: `calc(${this.state.shvabra.position[0]}vw - 20vh)`,
                            position: `absolute`}}>


                                <img src={Shvabra} style={{
                                    width: '40vh',
                                    minWidth: '40vh',
                                    height: '40vh',
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

const BGcanvas = (size:[number, number],canvasRef:React.RefObject<any>) => {
      return <canvas style={{display:"flex", width:"100vw",height:"100vh", justifyContent:"center", alignItems:"center"}} height={size[1]} width={size[0]} ref={canvasRef}></canvas>
}
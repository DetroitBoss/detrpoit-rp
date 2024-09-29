import React, {Component} from 'react';

import './assets/style.less'
import {DraggableCore} from 'react-draggable';
import Mouse from './assets/mouse.svg'

import {Success} from '../Success/success';

type ProvodType = {
    color:number,
    attached:boolean,
    position:[number,number]
}
type ProvodaGameType = {
    id: number
    provoda: Array<Array<ProvodType>>;
}

const Colors = ["#F04D26","#2D9CDB", "#4F4F4F", "#F2C94C", "#27AE60", "#9B51E0"];

export class ProvodaGame extends Component<{
    status: (status: boolean) => void
}, ProvodaGameType> {
    lottieRef: React.RefObject<any>;

    constructor(props: any) {
        super(props);
        this.state = {
            id:0,
            provoda: [
                [ {color: 0, attached: false, position:[0,0]},
                  {color: 1, attached: false, position:[0,0]},
                  {color: 2, attached: false, position:[0,0]},
                  {color: 3, attached: false, position:[0,0]},
                  {color: 4, attached: false, position:[0,0]},
                  {color: 5, attached: false, position:[0,0]}]
                ,[ {color: 0, attached: false, position:[0,0]},
                   {color: 1, attached: false, position:[0,0]},
                   {color: 2, attached: false, position:[0,0]},
                   {color: 3, attached: false, position:[0,0]},
                   {color: 4, attached: false, position:[0,0]},
                   {color: 5, attached: false, position:[0,0]}]
            ]
        },
        this.lottieRef = React.createRef();
    }
    successGame = () => {
        //Игра пройдена
        this.props.status(true)
        console.log('end game');
    }

    shuffle = (array:Array<ProvodType>) => {
        let currentIndex:any = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    componentDidMount = () => {
        let _provoda = [ this.shuffle( this.state.provoda[0]), this.shuffle( this.state.provoda[1])];
        _provoda.map( (data, i1)=> {
            data.map( (item, i2) => {
                _provoda[i1][i2].position[0] = 30+this.state.provoda[i1].length / 2 + 6*i2;//-5*this.state.provoda[i1].length / 2 + 10*i2;
                _provoda[i1][i2].position[1] = i1 ?  -90: 90;//-180: 180;
            });
        })
        this.setState( {...this.state, provoda:_provoda  } );
    }
    handleEvent = ( data:any, i1: number, i2: number) => {
        let _provoda = this.state.provoda;
        if( _provoda[i1][i2].attached === true ) return;
        _provoda[i1][i2].position[0] += (data.deltaX / document.documentElement.clientWidth *100);
        _provoda[i1][i2].position[1] +=  (data.deltaY / document.documentElement.clientHeight *100);
        _provoda.map( (data, idx)=> {
            if( idx === i1 ) return;
            data.map( (item, idx2) => {
                if(_provoda[i1][i2].color === item.color ) {
                    if(Math.abs( _provoda[i1][i2].position[0] - item.position[0]) < 2 && Math.abs(100 - Math.abs( _provoda[i1][i2].position[1] - item.position[1])) < 5 ) {
                        _provoda[i1][i2].attached = true;
                        _provoda[idx][idx2].attached = true;
                        _provoda[i1][i2].position[0] = _provoda[idx][idx2].position[0];
                        _provoda[i1][i2].position[1] = 0;
                        _provoda[idx][idx2].position[1] = -100;

                    }
                }
            })
        });
        let _result = _provoda.map( (data, i1)=> {
            return data.filter( data => { if( data.attached ===true ) return 1;});
        });
        if( _result[0].length >= this.state.provoda[0].length ) {
//            this.successGame();
            this.lottieRef.current.setSpeed(0.5);
            this.lottieRef.current.play();
        }
        this.setState({...this.state, provoda: _provoda})
    }

    render() {
        return (<>
            <div className="provoda_bg"/>
            <div className="provoda_browser">
                <div className="provoda_info">
                    <div>
                        <h1>Соедините</h1>
                        <h2>Провода</h2>
                        <h3>Вам требуется соединить цветные провода, чтобы техника снова заработала. Удачи!</h3>
                    </div>
                    <div className="provoda_bottom">
                        <img src={Mouse}/>
                        <h4>Соединяйте провода мышью</h4>
                    </div>
                </div>
                <div style={{zIndex:( this.state.provoda[0].filter( (data)=>data.attached === true).length >= this.state.provoda[0].length ? 99999 : -1), display:'flex', position: 'absolute', justifyContent:'center', width:'20vh', height:'20vh'}}>
                    {Success( this.lottieRef, this.successGame)}
                </div>

                {this.state.provoda.map( (data, i1) => {
                    return data.map( (item, i2) => {
                        return <>
                            <DraggableCore key={`dr_${i1}_${i2}`}
                                        grid = { [ 1 ,  1 ] }
                                        onStart={(e: MouseEvent, data: Object) => this.handleEvent(data, i1, i2 )}
                                        onDrag={(e: MouseEvent, data: Object) => this.handleEvent(data, i1, i2 )}
                                        onStop={(e: MouseEvent, data: Object) => this.handleEvent(data, i1, i2 )}
                                        disabled={item.attached}
                                >
                                <div  style={{
                                    left: `${item.position[0]}vw`,
                                    top: `${item.position[1]}vh`,
                                    width:'auto',
                                    height:'auto',
                                    zIndex: item.attached === true ? 9998 : 9999,
                                    position: `absolute`}}>

                                        <div className="provoda_item" style={{
                                            transform: i1 ?  `rotate(180deg)`:null,
                                            background: Colors[item.color],
                                            boxShadow: `17px 10px 34px ${Colors[item.color]}25, -20px 10px 34px rgba(0, 0, 0, 0.3), inset 14px 10px 24px rgba(0, 0, 0, 0.55)`
                                        }}>
                                            {item.attached === false ? [1,1,1,1].map( (_, index) => {
                                                return <span key={index} style = {{
                                                    position:'absolute',
                                                    marginTop:'-0.6vw',
                                                    marginLeft: `${0.15+index*0.5}vw`,
                                                    width: '0.2vw',
                                                    height: '0.6vw',
                                                    background: "#FFFFFF",
                                                    boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.55)"
                                                }}></span>
                                            }): null }
                                        </div>
                                </div>
                            </DraggableCore>
                        </>
                    })
                })}
            </div>
        </>);
    }
}


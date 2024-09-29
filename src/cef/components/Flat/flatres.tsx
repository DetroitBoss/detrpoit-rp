import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import './assets/style.less'
import svg from './assets/svg/*.svg';
import png from './assets/png/*.png';
import {CEF} from "../../modules/CEF";
import {CustomEventHandler} from "../../../shared/custom.event";
import {CONSTRUCTION_HOUSES} from "../../../shared/construction";

type FlatResType = {
    show: boolean;
    progress:{name:string, desc:string, completed: boolean, open: boolean, param: number}[],
    setsStatus: Map<number, number>,
    setsCount: Map<number, number>,
    setsTaken: Map<number, number>,
    configid: number,
}
export class FlatRes extends Component<{}, FlatResType> {
    private ev: CustomEventHandler;
    constructor(props: any) {
        super(props);
        this.state = {
            setsStatus: new Map(),
            setsCount: new Map(),
            setsTaken: new Map(),
            configid: 0,
            show: CEF.test,
            progress: [
                {name: 'Плитка', desc: 'Поклеить', completed: true, open: true, param: 6},
                {name: 'Абоя', desc: 'Поклеить', completed: false, open: true, param: null},
                {name: 'Унитас', desc: 'Помыть', completed: false, open: false, param: 3},
                {name: 'Унитас', desc: 'Помыть', completed: false, open: false, param: 3},
                {name: 'Унитас', desc: 'Помыть', completed: false, open: false, param: 3},
                {name: 'Унитас', desc: 'Помыть', completed: false, open: false, param: 3},
                {name: 'Унитас', desc: 'Помыть', completed: false, open: false, param: 3},
                {name: 'Унитас', desc: 'Помыть', completed: false, open: false, param: 3},
                {name: 'Унитас', desc: 'Помыть', completed: false, open: false, param: 3},
                {name: 'Унитас', desc: 'Помыть', completed: false, open: false, param: 3},
                {name: 'Унитас', desc: 'Помыть', completed: false, open: false, param: 3},
                {name: 'Унитас', desc: 'Помыть', completed: false, open: false, param: 3},
                {name: 'Унитас', desc: 'Помыть', completed: false, open: false, param: 3},
                {name: 'Унитас', desc: 'Помыть', completed: false, open: false, param: 3},
                {name: 'Унитас', desc: 'Помыть', completed: false, open: false, param: 3},
                {name: 'Унитас', desc: 'Помыть', completed: false, open: false, param: 3},
                {name: 'Унитас', desc: 'Помыть', completed: false, open: false, param: 3},
                {name: 'Унитас', desc: 'Помыть', completed: false, open: false, param: 3},
            ]
        },
        this.ev = CustomEvent.register('flat:res', (setsStatus: [number, number][], setsCount: [number, number][], setsTaken: [number, number][], configid) => {
            let status = new Map<number, number>();
            let count = new Map<number, number>();
            let taken = new Map<number, number>();
            setsStatus.map(([key, value]) => status.set(key, value))
            setsCount.map(([key, value]) => count.set(key, value))
            setsTaken.map(([key, value]) => taken.set(key, value))
            this.setState({setsStatus: status, setsCount: count, setsTaken: taken, show: true,configid });
        })
    }
    get config(){
        return CONSTRUCTION_HOUSES[this.state.configid]
    }
    componentDidMount = () => {
    }
    componentWillUnmount = () => {
        if(this.ev) this.ev.destroy();
    }
    progress = ( params:number, max: number ) => {
        let param = [];
        for( let l=0; l < max; l ++) {
            if(l >= params) param.push( <i key={l}/> )
            else param.push(<i key={l} className="active"/>)
        }
        return param;
    } 
    render() {
        if(!this.state.show) return <></>;
        return <>
                <section className="section-repair-flat">
                    <button className="normalize-button" onClick={ ()=> {
                        CustomEvent.triggerServer( 'flat:leave' );
                        CEF.gui.setGui(null);
                    }}>
                        <img src={svg['exit']} alt=""/>
                        <p>Покинуть квартиру</p>
                    </button>
                    <div className="rfl-title">
                        <p className="font60 fontw200 mb24 ln-1"><span className="fontw600">Этапы</span><br />стройки</p>
                        <p className="font18 fontw300 ln-1-8 op7">Сделайте ремонт в квартире. Для того чтобы сделать качественный ремонт и хорошо заработать, вам понадобится соблюдать этапы стройки</p>
                    </div>
                    <div className="flat-steps-wrapper">
                        {this.config.sets.map((set, id) => {
                            const completed = !this.state.setsCount.get(id);
                            if(completed) return <></>;
                            const group = set[8] || 1
                            const open = !this.state.setsTaken.get(id) && !this.config.sets.find((q, s) => q[8] + 1 === group && this.state.setsCount.get(s))
                            const defaultCount = set[7] || 1
                            const param = this.state.setsCount.get(id) || 0
                            const name = set[5]

                            return <div className={ completed ? "completed" : ( open ? "active" : "lock")} key={`set_show_${id}`}
                                        onClick={ (()=> {
                                            if(!completed && open) {
                                                CustomEvent.triggerServer('flat:get', id);
                                                setTimeout(() => {
                                                    CEF.gui.setGui(null);
                                                }, 1000)
                                            }
                                        })}>
                                <p className="font40 fontw600 mr32 rfl-count">{id+1}.</p>
                                <div className="rfl-step-image">
                                    <p className="font12">{name}</p>
                                    <img src={png[set[0]]} alt=""/>
                                </div>
                                <div className="rfl-step-levels">
                                    { param ? this.progress( param, defaultCount ) : null }
                                </div>
                                <p className="font18 fontw400 ln-1-4 ml32">{name}</p>
                            </div>
                        })}

                        {this.config.sets.map((set, id) => {
                            const completed = !this.state.setsCount.get(id);
                            if(!completed) return <></>;
                            const group = set[8] || 1
                            const open = !this.state.setsTaken.get(id) && !this.config.sets.find((q, s) => q[8] + 1 === group && this.state.setsCount.get(s))
                            const defaultCount = set[7] || 1
                            const param = this.state.setsCount.get(id) || 0
                            const name = set[5]

                            return <div className={ completed ? "completed" : ( open ? "active" : "lock")} key={`set_show_${id}`}
                                        onClick={ (()=> {
                                            if(!completed && open) {
                                                CustomEvent.triggerServer('flat:get', id);
                                                setTimeout(() => {
                                                    CEF.gui.setGui(null);
                                                }, 1000)
                                            }
                                        })}>
                                <p className="font40 fontw600 mr32 rfl-count">{id+1}.</p>
                                <div className="rfl-step-image">
                                    <p className="font12">{name}</p>
                                    <img src={png[set[0]]} alt=""/>
                                </div>
                                <div className="rfl-step-levels">
                                    { param ? this.progress( param, defaultCount ) : null }
                                </div>
                                <p className="font18 fontw400 ln-1-4 ml32">{name}</p>
                            </div>
                        })}
                    </div>
                    <i className="fly-hummers"><img src={png['fly-blur-hummers']} alt=""/></i>
                    <i className="fly-hummer"><img src={png['hummer']} alt=""/></i>
                </section>

        </>
    }
}

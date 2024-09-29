import React, {Component} from 'react';
import {CustomEvent} from '../../../modules/custom.event';
import art from "./../../DrivingSchool/imgs/autoschool-art.png";
import './assets/style.less';
import work from './assets/work.svg';
import cancel from './assets/cancel.svg';
import {getJobData, getLevelByExp, JOB_MAX_EXP, JobId, jobsList} from "../../../../shared/jobs";
import {system} from "../../../modules/system";
import {CEF} from "../../../modules/CEF";
import {CustomEventHandler} from "../../../../shared/custom.event";

export class WorkSelect extends Component<{}, {
    /** Работа */
    job?: JobId,
    /** Работа */
    myjob?: JobId,
    /** Выбранное задание */
    task?:number,
    /** Опыт работы */
    exp:number,
    /** Переодеты ли мы в форму */
    // clothe: boolean,
    // /** Есть ли возможность переодеться */
    // clotheneed: boolean,
    block?:boolean,
}> {
    private ev: CustomEventHandler;

    constructor(props: any) {
        super(props);
        this.state = {
            exp: 0,
            // clothe: false,
            // clotheneed: true,
            job: CEF.test ? system.randomArrayElement(jobsList).id : null
        }
        this.ev = CustomEvent.register('job:data', (job: JobId, myjob: JobId, task:number, exp: number) => {
            this.setState({job, myjob, task, exp});
        })
    }

    componentWillUnmount(){
        if(this.ev) this.ev.destroy();
    }

    selectWork = ( id:number) => {
        if(this.state.block) return;
        setTimeout(() => {
            this.setState({block: false})
        }, 1000)
        if(id === this.task){
            this.setState( {task: null, block: true});
            CustomEvent.triggerServer('job:task:stop');
        } else {
            // this.setState( {task: id, block: true});
            CustomEvent.triggerServer('job:task', this.job, id)
        }
        CEF.gui.setGui(null);
    }

    joinJob(){
        if(this.state.block) return;
        setTimeout(() => {
            this.setState({block: false})
        }, 1000)
        this.setState( {myjob: this.job, block: true});
        CustomEvent.triggerServer('job:join', this.job);
    }
    leaveJob(){
        if(this.state.block) return;
        setTimeout(() => {
            this.setState({block: false})
        }, 1000)
        this.setState( {myjob: null, block: true});
        CustomEvent.triggerServer('job:leave');
        CEF.gui.setGui(null);
    }

    // selectClothes = () => {
    //     if(this.state.block) return;
    //     setTimeout(() => {
    //         this.setState({block: false})
    //     }, 1000)
    //     CustomEvent.triggerServer('job:dress', this.job, !this.state.clothe)
    //     this.setState( {...this.state, clothe:!this.state.clothe, block: true});
    // }

    get task(){
        return this.state.task;
    }

    get jobConfig(){
        if(!this.state.job) return null
//        console.log( getJobData(this.state.job) );
        return getJobData(this.state.job);
    }
    get job(){
        return this.state.job
    }
    get level(){
        return getLevelByExp(this.state.exp);
    }

    render() {
        if(!this.jobConfig) return <></>;
        return <>
            <div className="workmenu">
                <div className="workmenu_grid"/>
                <div className="workmenu_main">
                    <div style={{position:'relative',height: '85vh', width:'43.5vh'}}>
                        <img style={{position:'absolute', bottom: '-7.5vh', marginLeft:'5vh'}} src={art}/>
                    </div>
                    <div className="workmenu_types">
                        <h1>{this.jobConfig.name}</h1>
                        <div className="workmenu_header">
                            <div className="">
                                <p style={{width: '20vh', marginBottom:'1vh'}}>{this.jobConfig.full_desc}</p>
                                <p style={{width: '20vh', marginBottom:'1vh', opacity:0.8 }}>{this.level} уровень. ({this.state.exp.toFixed(0)} / {JOB_MAX_EXP})</p>
                            </div>
                            {this.state.myjob !== this.job ? <div className="workmenu_skin workmenu_ind">
                                <div className="workmenu_key" style={{backgroundColor: "#EB5757"}} onClick={()=>this.joinJob()}>
                                    <img src={work}/>
                                    <h4>Устроиться на работу</h4>
                                </div>
                            </div> : <><div className="workmenu_skin">
                                <div className="workmenu_key" style={{backgroundColor: "#EB5757"}} onClick={()=>this.leaveJob()}>
                                    <img src={work}/>
                                    <h4>Уволиться</h4>
                                </div>
                            </div>
                            </>}
                        </div>
                        {this.state.myjob === this.job ? <div className="workmenu_types_items">
                            {this.jobConfig.tasks.map((item, index) => {
                                return <div key={`task_${index}`} className="workmenu_types_item">
                                    <h2 style={{marginBottom:'1vh'}}>{item.name}</h2>
                                    <p style={{marginBottom:'1vh'}}>{item.desc}</p>
                                    <div className="workmenu_price">
                                        Оплата ${system.numberFormat(item.money)}
                                    </div>
                                    <div className="workmenu_price">
                                        Опыт {item.exp || 1}
                                    </div>
                                    {item.level && item.level > this.level ? <div className={"workmenu_price "+(item.level > this.level ? 'ok' : 'no')}>
                                        Требуемый уровень: {item.level}
                                    </div> : <div className="workmenu_key" onClick={()=>this.selectWork(index)}>
                                        <img src={ this.state.task === index ? cancel : work}/>
                                        <h4>{ this.state.task === index ? "Уволиться" : "Устроиться"}</h4>
                                    </div>}
                                </div>
                            })}
                        </div> : <></>}
                    </div>
                </div>
            </div>
        </>;
    }
}


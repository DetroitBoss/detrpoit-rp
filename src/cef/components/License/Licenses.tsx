import React from 'react';
import './assets/lic.module.less';
import Draggable from 'react-draggable';
import {LicenceType, LicensesData, ILicenceGetDataStore} from '../../../shared/licence';
import licIcon from './assets/pic/*.png'
import {CustomEvent} from '../../modules/custom.event';
import {systemUtil} from '../../../shared/system';
import { observer } from 'mobx-react';
import LicensesStore from "../../stores/Licenses"


@observer export class LicenseBlock extends React.Component<{
    store: LicensesStore
}, {}> {
    store: LicensesStore
    constructor(props: any) {
        super(props);
        this.store = this.props.store

    }
    render() {
        return <>
            {this.store.items.map((item: ILicenceGetDataStore, index) => {
                return <LicensesItem key={item.code} type={item.type} serial={item.serial} time={item.time} player={item.player} code={item.code} close={() => {
                    const items: ILicenceGetDataStore[] = [...this.store.items]
                    items.splice(items.findIndex(q => q.code === item.code), 1)
                    this.store.setState({ items });
                }} />
            })}
        </>;
    }

}


export class LicensesItem extends React.Component<ILicenceGetDataStore, {}> {
    constructor(props: any) {
        super(props);
    }


    // Получаем объект вида { ILicenceGetDataStore }


    closeClick = () => {
        this.props.close()
    }

    getLicCfg = () => {
        return LicensesData.find(q => q.id === this.props.type)
    }

    escClick = (event: any) => { if (event.keyCode === 27) this.closeClick(); }
    // componentDidMount = () => {
    //     document.addEventListener("keyup", this.escClick, false);

    //     (window as any).testget = (data: any) => {
    //         this.getLicensesData(data);
    //     }
    // }
    // componentWillUnmount = () => {
    //     document.removeEventListener("keyup", this.escClick, false);
    // }

    render() {
        return <>
            <Draggable handle=".move">
                <div className="liceffect" style={{
                    backgroundImage: `linear-gradient( 135deg, rgb(15,15,15) 0%, rgb(${this.getLicCfg().gradient}) 100%)`,
                    boxShadow: `0px 30px 68px 0px rgba(${this.getLicCfg().shadow[0]}),inset 0px 28px 101px 0px rgba(${this.getLicCfg().shadow[1]})`
                }}>
                    <div className="licbox" style={{ backgroundImage: `url(${licIcon[this.getLicCfg().pic]})` }}>
                        <div className="lickey" >
                            <div>
                                <svg className="move" height="1.2rem" viewBox="0 0 500 500" width="1.2rem" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M487.557,237.789l-64-64c-3.051-3.051-7.659-3.947-11.627-2.304c-3.989,1.643-6.592,5.547-6.592,9.856v32h-128v-128h32c4.309,0,8.213-2.603,9.856-6.592c1.643-3.989,0.725-8.576-2.304-11.627l-64-64c-4.16-4.16-10.923-4.16-15.083,0l-64,64c-3.051,3.072-3.968,7.637-2.325,11.627c1.643,3.989,5.547,6.592,9.856,6.592h32v128h-128v-32c0-4.309-2.603-8.213-6.592-9.856
                                            c-3.925-1.664-8.555-0.747-11.627,2.304l-64,64c-4.16,4.16-4.16,10.923,0,15.083l64,64c3.072,3.072,7.68,4.011,11.627,2.304c3.989-1.621,6.592-5.525,6.592-9.835v-32h128v128h-32c-4.309,0-8.213,2.603-9.856,6.592c-1.643,3.989-0.725,8.576,2.304,11.627l64,64c2.091,2.069,4.821,3.115,7.552,3.115s5.461-1.045,7.552-3.115l64-64c3.051-3.051,3.968-7.637,2.304-11.627
                                            c-1.664-3.989-5.547-6.592-9.856-6.592h-32v-128h128v32c0,4.309,2.603,8.213,6.592,9.856c3.947,1.685,8.576,0.747,11.627-2.304l64-64C491.717,248.712,491.717,241.971,487.557,237.789z"/>
                                </svg>
                            </div>
                            <svg onClick={() => this.closeClick()} height="1.2rem" viewBox="0 0 330 330" width="1.2rem" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0
                                    30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"/>
                            </svg>
                        </div>
                        <div className="licdata">
                            <div className="licname">
                                <div>Лицензия на</div>
                                <h1>{this.getLicCfg().name}</h1>
                                <p>Действительна до {systemUtil.timeStampString(this.props.time)}</p>
                            </div>
                            <div className="licinfo">
                                <div>{this.props.code}</div>
                            </div>
                            <div className="licown">
                                <p>Принадлежит</p>
                                <h2>{this.props.player}</h2>
                            </div>
                            <div className="licnumber">
                                <p>Социальный номер</p>
                                <h2>№ {this.props.serial}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </Draggable>
        </>;
    }
}



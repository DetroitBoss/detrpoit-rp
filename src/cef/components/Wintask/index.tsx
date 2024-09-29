import React, {Component} from 'react';
import './style.less';
import bg from './../Fuel/assets/bg.svg';
import leaves from './leaves.svg';
import {CEF} from '../../modules/CEF';
import iconsItems from '../../../shared/icons/*.png';
import {inventoryShared} from "../../../shared/inventory";
import coin from '../UserMenu/assets/svg/player-stop-white.svg';
import {CustomEvent} from '../../modules/custom.event';
import {CustomEventHandler} from '../../../shared/custom.event';

enum WinTaskEnum {
    MONEY = 9999,
    COINS = 10000
}

export class WinTask extends Component<{}, {
    taskInfo: Array<string>;
    taskName: string;
    item: Array<{type:number, ammount: number, desc?:string}>;
}> {
    ev: CustomEventHandler;
    constructor(props: any) {
        super(props);

        this.state = {
            taskInfo: ['Задание', 'выполнено'],
            taskName: 'Доставить сумку',
            item: [
                // {type: WinTaskEnum.MONEY, ammount: 100},
                // {type: WinTaskEnum.COINS, ammount: 100},
                // {type: 950, ammount: 1, desc: 'Тестовая'},
                // {type: 952, ammount: 1, desc: 'Тестовые'}
            ]
        },
        this.ev = CustomEvent.register('wintask:show', ( taskName: string, item: Array<{type:number, ammount: number, desc?:string}>) => {
            this.setState( {...this.state, taskName, item });
        })
    }

    itemCfg = ( item_id: number ) => {
        return inventoryShared.get( item_id );
    }

    closeTask = () => {
        CEF.gui.setGui( null );
    }

    componentWillUnmount = () => {
        if (this.ev) this.ev.destroy();
    }

    render = () =>  {
        return <>
            <body className="body-win-task">
                <div className="overflow">
                    <div className="circle">
                        <img src={bg} width="24" height="24"/> 
                    </div>
                    <div className="leaves">
                        <img src={leaves} width="24" height="24"/> 
                    </div>

                    <div className="win-task-wrapper">
                        <p className="p-big">Поздравлем!</p>
                        <p className="p-descr">{this.state.taskInfo[0]} <span>“{this.state.taskName}”</span> {this.state.taskInfo[1]}</p>
                        <div className="win-task-rewards-wrapper">
                            {this.state.item.length > 0 ?
                                <p className="p-title">{this.state.item.length > 1 ? "Награды" : "Награда"}{this.state.item.length < 1 ? " отсутствует" : ""}</p>
                                :null
                            }
                            <div className="win-task-rewards-wrap">
                                { this.state.item.map( ( data, index) => {
                                return ( data.type === WinTaskEnum.MONEY || data.type == WinTaskEnum.COINS ) ? 
                                    <div className="win-task-rewards-item" key={index}>
                                        <p className="p-mini-title">{ data.type === WinTaskEnum.MONEY ? 'Деньги' : 'Coins' }</p>
                                        <p className="p-value">
                                            { data.type === WinTaskEnum.COINS ? <img src={coin} alt=""/> : null }
                                            { data.type === WinTaskEnum.MONEY ? `$${data.ammount}`:`${data.ammount}`}
                                        </p>
                                    </div> :
                                    <div className="win-task-rewards-item" key={index}>
                                        <div className="object-rewards-wrap">
                                            <div className="object-rewards-item">
                                                <div className="img-wrap">
                                                    <img src={iconsItems[`Item_${data.type}`]} alt=""/>
                                                </div>
                                            </div>
                                            <p className="object-rewards-item-name">{this.itemCfg( data.type ).name} {data.desc ? data.desc : ''}</p>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                        <button className="win-task-btn" onClick={this.closeTask}>
                            <p>Закрыть</p>
                        </button>
                    </div>
                    </div>
            </body>
        </>
    }
}
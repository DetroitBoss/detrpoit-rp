import './style.less';
import React, {Component} from 'react';

import aim from "./images/svg/aim.svg";
import watch from "./images/svg/watch.svg";
import IslandBattleStore from "../../stores/IslandBattle";
import {observer} from "mobx-react";


@observer export class HudIslandBattle extends Component<{
    store: IslandBattleStore
}, {}> {

    store: IslandBattleStore = this.props.store

    constructor(props: any) {
        super(props);
    }

    render() {

       return <div className="hudIslandBattle">

           {
               this.store.result.map((el, key) => {
                   return <div className="hudIslandBattle-block">
                       {el.points} <img src={aim} alt=""/> - {el.name}
                   </div>
               })
           }

           <span>Конец через</span>

           <div className="hudIslandBattle__time">
               {this.store.time} мин. <img src={watch} alt=""/>
           </div>

       </div>

    }

}
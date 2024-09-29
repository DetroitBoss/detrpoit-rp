import './style.less';
import React, {Component} from 'react';

import cup from './images/cup.png';
import scull from './images/svg/scull.svg';
import { IGunGamePlayerScore } from 'shared/hudgungame';
import { observer } from 'mobx-react';
import HudGunGameStore from '../../stores/HudGunGame'

@observer export class HudGunGame extends Component<{
    store: HudGunGameStore
}, {}> {
    store: HudGunGameStore
    constructor(props: any) {
        super(props);
        this.store = this.props.store
    }

    render() {
        return this.store.show ? <div className={`hudGunGame`}>

            {this.store.topPlayers.slice()
                .sort((a, b) => b.kills - a.kills)
                .map((player, index) => {
                    return <div className="hudGunGame-block" key={index}>

                        {index === 0 && (<img src={cup} className="hudGunGame-block__cup" alt=""/>)}

                        <div className="hudGunGame-block__left">
                            {player.name}
                        </div>
                        <div className="hudGunGame-block__right">
                            {player.kills}
                            <img src={scull} alt=""/>
                        </div>
                    </div>
                })}

            <div className="hudGunGame-block hudGunGame-block__bottom">
                <div className="hudGunGame-block__left">
                    Ваша статистика
                </div>
                <div className="hudGunGame-block__right">
                    {this.store.myKills}
                    <img src={scull} alt=""/>
                </div>
            </div>

        </div>
        : null
    }

}
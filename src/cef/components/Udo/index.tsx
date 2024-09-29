import React from 'react';
import './assets/style.less';
import Draggable from 'react-draggable';
import {UdoData, UdoTypeBase} from '../../../shared/licence';
import udoIcon from './assets/*.png'
import {CustomEvent} from '../../modules/custom.event';
import close from '../HudBlock/images/svg/close.svg'
import {CEF} from "../../modules/CEF";
import { fractionCfg } from '../../modules/fractions';


interface UdoType extends UdoTypeBase {
    close?: () => any
}



export class UdoBlock extends React.Component<{}, {
    items: UdoType[]

}> {
    constructor(props: any) {
        super(props);
        this.state = {
            items: [
                // {player:"test name", fraction:1, rank:1},
                // {player:"test name", fraction:1, rank:1},
            ]
        }

        CustomEvent.register('udo:show', (data: UdoType) => {
            const items = [...this.state.items]
            items.push(data);
            this.setState({ items });
        })

    }
    render() {
        return <>
            {this.state.items.map((item, index) => {
                return <UdoItem key={index} user={item.user} tag={item.tag} player={item.player} fraction={item.fraction} rank={item.rank} close={() => {
                    const items = [...this.state.items]
                    items.splice(index, 1)
                    this.setState({ ...this.state, items });
                }} />
            })}
        </>;
    }

}


export class UdoItem extends React.Component<UdoType, { isDrag: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = {
            isDrag: true
        }
    }
    closeClick = () => {
        this.props.close()
    }

    getUdoCfg = () => {
        return UdoData.find(q => q.id === this.props.fraction)
    }

    escClick = (event: any) => { if (event.keyCode === 27) this.closeClick(); }

    get image(){
        return CEF.getSignatureURL('idcard_' + this.props.user)
    }

    render() {
        return <>
            <section className="section-udo animated fadeInUp">
                <Draggable>
                    <div className={"udo-new-wrapper "+(this.getUdoCfg().class)}>
                        <button className="udo-new-close" onClick={this.props.close}>
                            <div><img src={close} alt="" /></div>
                            <p>Закрыть</p>
                        </button>
                        <div className="udo-new-text">
                            <p className="udo-fraction">{fractionCfg.getFractionName(this.props.fraction)}</p>
                            <p className="udo-new-name">{this.props.player}</p>
                            <p className="udo-rank">{fractionCfg.getRankName(this.props.fraction, this.props.rank)}{this.props.tag ? <><br />Отдел <strong>{this.props.tag}</strong></> : <></>}</p>
                            <div className="udo-signature"><img src={this.image} alt="" /></div>
                        </div>
                    </div>
                </Draggable>

            </section>
        </>;
    }
}



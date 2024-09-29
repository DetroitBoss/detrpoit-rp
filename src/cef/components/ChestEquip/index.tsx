import './police-equip.less';
import React, {Component} from 'react';
import {CustomEvent} from '../../modules/custom.event';
import {CEF} from '../../modules/CEF';
import icons from '../../../shared/icons/*.png'
import {getBaseItemNameById} from '../../../shared/inventory';

interface EquipDataInterface {
  name: string;
  items: {
    id: number,
    amount: number,
    canTake: boolean
  }[];
  ready: boolean;
  id: number;
}

export default class ChestEquip extends Component<any, EquipDataInterface> {
  q: number;
  ev: import("../../../shared/custom.event").CustomEventHandler;
  constructor(props: any) {
    super(props);
    this.state = {
      id: 0,
      name: "Name",
      items: [],
      ready: false
    }

    this.ev = CustomEvent.register('chest:open', (id: number, name: string, items: {
      id: number,
      amount: number,
      canTake: boolean
    }[]) => {
      this.setState({
        id, name, items, ready: true
      })
    })

  }

  componentWillUnmount() {
    this.ev ? this.ev.destroy() : null;
  }

  take(item_id: number) {
    CustomEvent.triggerServer('chest:take', this.state.id, item_id)
  }

  close() {
    CEF.gui.setGui(null);
  }

  render() {
    return this.state.ready ? <>
      <i className="shadow-overlay-top"></i>
      <div className="section-view">
        <div className="police-equip-wrapper">
          <h2 className="page-title">{this.state.name}</h2>
          <div className="police-equip-grid">
            {this.state.items.map((item, id) => {
              const icon = icons[`Item_${item.id}`];
              return (
                <div className={`eqp-item ${!item.canTake ? 'nohave' : ''}`} key={id}>
                  <div onClick={() => (item.canTake ? this.take(item.id) : false)}>
                    <div className="eqp-box">
                      <i className="eqp-item-default">
                        <img src={icon} alt="" />
                      </i>
                      <img src={icon} alt="" />
                      <span>{item.amount}</span>
                    </div>
                    <button className="eqp-but">{getBaseItemNameById(item.id)}</button>
                  </div>
                </div>
              );
            })}
          </div>
          <a className="eqp-but-close" onClick={() => this.close()}>Закрыть</a>
        </div>
      </div>
    </> : <></>
  }

};


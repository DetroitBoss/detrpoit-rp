import React, {Component} from 'react';
// @ts-ignore
import {CustomEvent} from '../../modules/custom.event';

import images from './images/*.png'
import {AlertType} from '../../../shared/alert';


export class AcceptBlock extends Component<{}, { list: [number,JSX.Element][]}> {
    new(id: number, text:string, type:AlertType, img:string, time = 5000){
        text = unescape(text);
        let resBlock = (<div key={id} className={`hud-alert ${type} ${img ? '' : 'alert-easy'}`}>
            <i>{img ? <img src={images[img]} alt="" /> : ''}</i>
            <p style={{ paddingLeft: `${!img ? '14px' : '0'}` }}>
                <strong>Подтвердите действие</strong>
                {text}
                <br />
                <button className="cancel" onClick={e => {
                    e.preventDefault();
                    this.click(id, false);
                }}>Отклонить</button> <button className="accept" onClick={e => {
                    e.preventDefault();
                    this.click(id, true);
                }}>Принять</button>
            </p>
        </div>);
        let oldList = [...this.state.list];
        oldList.push([id, resBlock]);
        this.setState({ list: oldList })
        setTimeout(() => {
            this.click(id, false);
        }, time);
    }
    click(id:number, status:boolean){
        let oldListnew = [...this.state.list];
        let ind = oldListnew.findIndex(q => q[0] === id);
        if (ind == -1) return;
        oldListnew.splice(ind, 1)
        this.setState({ list: oldListnew })
        CustomEvent.triggerClient('cef:alert:accept:result', id, status);
    }
    constructor(props: any) {
        super(props);
        this.state = {
            list: []
        }

        CustomEvent.register('cef:alert:accept', (id: number, text, type, img, time = 5000) => {
            this.new(id, text, type, img, time);
        });
        
    }


    render() {
        return (<>
            <div className="accept-wrapper">
                {this.state.list.map(item => {
                    return item[1];
                })}
            </div>
        </>);
    }
}


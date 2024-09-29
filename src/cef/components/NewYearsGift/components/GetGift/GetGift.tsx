import React, {Component} from "react";
import "../../style.less"
import iconsInventoryItems from '../../../../../shared/icons/*.png';

import png from "./assets/*.png";
import svg from "./assets/*.svg";
import { CustomEvent } from '../../../../modules/custom.event'
import { CustomEventHandler } from '../../../../../shared/custom.event'
import { CEF } from '../../../../modules/CEF'

export class GetGift extends Component<{}, {
    items: [number, string][]
}> {
    private _ev: CustomEventHandler
    
    constructor(props: any) {
        super(props);
        
        this.state = {
            items: [[2, 'descr'], [4, 'descr'], [6, 'descr']]
        }

        this._ev = CustomEvent.register('newYearsGift:setGifts', (data: [number, string][]) => {
            this.setState({
                items: data
            })
        })
    }
    
    public componentWillUnmount() {
        this._ev?.destroy
    }

    public onButtonPressed(): void {
        if (this.state.items.length == 1) {
            CEF.gui.setGui(null)
            CustomEvent.triggerServer('newYearsGift:get')
        }
        
        const items = this.state.items
        items.pop()
        
        this.setState({
            items: items
        })
    }
    
    render() {
        return <div className="giftGet">

            <img src={this.state.items.length === 1 ? png["oneLetter"] : png["manyLetters"]} alt="" className="giftGet__background"/>

            <div className="giftGet-block">

                <div className="giftGet__text">{this.state.items[this.state.items.length - 1][1]}
                </div>

                <div className="giftGet-item">

                    <img src={png["itemBackground"]} alt="" className="giftGet-item__background"/>

                    <img src={iconsInventoryItems[`Item_${this.state.items[this.state.items.length - 1][0]}`]} alt="" className="giftGet-item__item"/>
                </div>

            </div>

            <div className="giftGet__button" onClick={() => {
              this.onButtonPressed()    
            }}>
                <img src={svg["button"]} alt=""/>
                
                <span>{this.state.items.length === 1 ? 'Получить' : 'Далее' }</span>
            </div>
        </div>
    }
}
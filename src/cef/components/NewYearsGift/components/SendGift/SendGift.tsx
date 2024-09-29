import React, {Component} from "react";
import "../../style.less";

import png from "./assets/*.png";
import svg from "./assets/*.svg";
import { CEF } from '../../../../modules/CEF'
import { inventoryShared } from '../../../../../shared/inventory'
import iconsInventoryItems from '../../../../../shared/icons/*.png';
import { CustomEventHandler } from '../../../../../shared/custom.event'
import { CustomEvent } from '../../../../modules/custom.event'

export class SendGift extends Component<{}, {
    letterText: string, 
    letterLength: number,
    idLength: number,
    userId: number,
    inventoryItemsIds: [number, number][]
    selectedItemId: number
}> {
    private _ev: CustomEventHandler
    
    constructor(props: any) {
        super(props);

        this.state = {
            letterText: "",
            selectedItemId: 3,
            letterLength: 0,
            userId: 0,
            idLength: 0,
            inventoryItemsIds: CEF.test ? [[1, 1], [2, 1], [4, 1], [6, 12],] : []
        }

        this._ev = CustomEvent.register('newYearGift:setInventoryData', (data: [number, number][]) => {
            this.setState({
                inventoryItemsIds: data
            })
        })
    }

    public componentWillUnmount() {
        this._ev?.destroy()
    }

    updateLetter(val: string, len: number) {
        this.setState({
            ...this.state, 
            letterLength: len,
            letterText: val
        })
    }

    send() {
        if (isNaN(this.state.userId) || this.state.userId == 0) {
            return CEF.alert.setAlert("warning", "Неверно указан ID игрока")
        }

        if (isNaN(this.state.selectedItemId) || this.state.selectedItemId <= 0) {
            return CEF.alert.setAlert("warning", "Неверно выбран предмет")
        }
        
        CustomEvent.triggerServer('newYearsGift:send', this.state.selectedItemId, this.state.userId)
    }
    
    updateUserId(value: number, len: number) {
        this.setState({
            ...this.state, 
            idLength: len,
            userId: value
        })
    }

    renderInventoryItems() {
        const items = []

        this.state.inventoryItemsIds.forEach(i => {
            const item = inventoryShared.get(i[0])

            items.push(
                <div className="giftSend-right-inventory__slot" onClick={() => {
                    this.setState({
                        selectedItemId: item.item_id
                    })
                }}>
                    <img src={iconsInventoryItems[`Item_${item.item_id}`]} alt=""/>
                    <span>{i[1]}</span>
                </div>
            )  
        })
        
        const totalEmptyItems = 25 - items.length
        
        if (totalEmptyItems > 0) {
            for (let i = 0; i < totalEmptyItems; i++) {
                items.push(<div className="giftSend-right-inventory__slot" />)
            }    
        }
        
        return items
    }
    
    render() {
        return <div className="giftSend">

            <div className="giftSend-left">

                <img src={png["background"]} alt="" className="giftSend-left__background"/>

                <textarea wrap="soft" onChange={(event) => this.updateLetter(event.target.value, event.target.value.length)}
                          maxLength={130} placeholder="Введите текст" className="giftSend-left__text"/>

                <div className="giftSend-left__maxLength">
                    {this.state.letterLength}/130
                </div>

                <div className="giftSend-left__itemSlot">
                    <img src={iconsInventoryItems[`Item_${this.state.selectedItemId}`]} alt=""/>
                </div>

                <div className="giftSend-left-address">

                    <div className="giftSend-left-address-input">

                        <img src={svg["input"]} alt=""/>

                        <input type="number" maxLength={7}
                               onChange={(event) => this.updateUserId(event.target.valueAsNumber, event.target.value.length)}
                               placeholder="Укажи ID получателя" name="" id=""/>

                    </div>

                    <div className="giftSend-left-address-button" onClick={() => this.send()}>

                        <img src={this.state.idLength === 0 ? svg["buttonGray"] : svg["button"]}
                             className={`giftSend-left-address-button__background
                            ${this.state.idLength !== 0 ? "giftSend__active" : null}`} alt=""/>

                        <img src={svg["box"]} className="giftSend-left-address-button__box" alt=""/>

                        <span>Отправить</span>

                    </div>

                </div>

            </div>

            <div className="giftSend-right">

                <div className="giftSend-right__title">
                    ВАШ ИНВЕНТАРЬ
                </div>

                <div className="giftSend-right-inventory">

                    {this.renderInventoryItems()}

                </div>

            </div>

        </div>
    }

}
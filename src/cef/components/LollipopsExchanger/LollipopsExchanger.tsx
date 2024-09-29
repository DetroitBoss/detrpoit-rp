import React, {Component} from "react";
import {CustomEvent} from "../../modules/custom.event";
import "./style.less";

import png from "./assets/*.png"

import itemsImages from "./assets/items/*.png"
import inventoryImages from "../../../shared/icons/*.png";
import {DressConfigDto} from "../../../shared/events/halloween.exchange";
import {EXCHANGE_ITEMS} from "../../../shared/events/newYear/exchange.config";
import {system} from "../../modules/system";


const images: any = {
    'items': itemsImages,
    'inventory': inventoryImages
};

function wrapFuncWithCooldown(cooldownS: number, func: () => void) {
    let lastUsedTime = 0;

    return function() {
        if (system.timestamp - lastUsedTime < cooldownS) {
            return;
        }

        lastUsedTime = system.timestamp;
        func();
    }
}

export class LollipopsExchanger extends Component<{}, {
    show: boolean,
    balance: number,
    isMale: boolean,
    dressConfig: DressConfigDto[]
}> {
    constructor(props: any) {
        super(props);

        this.state = {
            show: false,
            balance: 0,
            isMale: true,
            dressConfig: []
        };

        CustomEvent.register('new-year:exchange:open', (candiesBalance: number, isMale: boolean, dressConfig: DressConfigDto[]) => {
            this.setState({
                show: true,
                balance: candiesBalance,
                dressConfig,
                isMale
            });
        })

        CustomEvent.register('new-year:exchange:setBalance', (candiesBalance: number) => {
            this.setState({
                balance: candiesBalance
            });
        })
    }

    handleBuy(itemIdx: number) {
        CustomEvent.triggerServer('new-year:exchange:buy', itemIdx);
    }



    render() {
        return <>{
            this.state.show && <div className="lollipopsExchanger">

                <img src={png["background"]} className="lollipopsExchanger__background" alt=""/>

                <div className="lollipopsExchanger__title">
                    Выбирай подарки!
                    <img src={png["lollipops"]} alt=""/>
                </div>

                <div className="lollipopsExchanger__balance">
                    Всего конфет
                    <div><img src={png["lollipops"]} alt=""/>{this.state.balance}</div>
                </div>

                <div className="lollipopsExchanger-list">

                    {EXCHANGE_ITEMS.map((item, index) => {
                        if (item.isForMale != null && item.isForMale(this.state.dressConfig) !== this.state.isMale) {
                            return null;
                        }


                        return <div className="lollipopsExchanger-list-block" key={index} onClick={
                            wrapFuncWithCooldown(1, () => this.handleBuy(index))
                        }>

                            <img src={png["itemsBackground"]} className="lollipopsExchanger-list-block__background"
                                 alt=""/>

                            <img src={images[item.imageDict()][item.imageName()]} className="lollipopsExchanger-list-block__item"
                                 alt=""/>

                            <div className="lollipopsExchanger-list-block__name">{item.getName(this.state.dressConfig)}</div>

                            <div className="lollipopsExchanger-list-block__price">
                                <img src={png["lollipops"]} alt=""/>
                                {item.price}
                            </div>

                        </div>
                    })
                    }
                </div>

            </div>
        }</>
    }
}
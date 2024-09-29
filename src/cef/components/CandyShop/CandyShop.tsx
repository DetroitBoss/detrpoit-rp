import React, {Component} from "react";
import "./style.less";

import png from "./assets/*.png"

import itemsImages from "./assets/items/*.png"
import inventoryImages from "../../../shared/icons/*.png";
import {CustomEvent} from "../../modules/custom.event";
import {DressConfigDto, EXCHANGE_ITEMS} from "../../../shared/events/halloween.exchange";
import {system} from "../../modules/system";

const images: any = {
    'items': itemsImages,
    'inventory': inventoryImages
};

// TODO: move to CEF/shared
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

export class CandyShop extends Component<{}, {
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

        CustomEvent.register('halloween::exchange::open', async (candiesBalance: number, isMale: boolean, dressConfig: DressConfigDto[]) => {
            this.setState({
                show: true,
                balance: candiesBalance,
                dressConfig,
                isMale
            });
        });

        CustomEvent.register('halloween::exchange::setBalance',(candiesBalance: number) => {
            this.setState({
                balance: candiesBalance
            });
        });
    }

    handleBuy(itemIdx: number) {
        CustomEvent.triggerServer('halloween:exchange:buy', itemIdx);
    }

    render() {
        return <>{
            this.state.show && <div className="candyShop">

                <img src={png["background"]} className="candyShop__background" alt=""/>

                <div className="candyShop__title">
                    Сладость или гадость?
                    <img src={png["candy"]} alt=""/>
                </div>

                <div className="candyShop__balance">
                    Всего конфет
                    <div><img src={png["candy"]} alt=""/>{this.state.balance}</div>
                </div>

                <div className="candyShop-list">

                    {/*  Это меня Вадим научил :)  */}

                    {EXCHANGE_ITEMS.map((item, index) => {
                        if (item.isForMale != null && item.isForMale(this.state.dressConfig) !== this.state.isMale) {
                            return null;
                        }

                        return <div className="candyShop-list-block" key={index} onClick={
                            wrapFuncWithCooldown(1, () => this.handleBuy(index))
                        }>

                            <img src={png["itemsBackground"]} className="candyShop-list-block__background" alt=""/>

                            <img src={images[item.imageDict()][item.imageName()]} className="candyShop-list-block__item"
                                 alt=""/>

                            <div className="candyShop-list-block__name">{item.getName(this.state.dressConfig)}</div>

                            <div className="candyShop-list-block__price">
                                <img src={png["candy"]} alt=""/>
                                {item.price}
                            </div>

                        </div>
                    })}


                </div>

            </div>
        }</>
    }
}
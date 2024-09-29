import React, {Component} from "react";
import "./style.less";
import BattlePassStorageStore from "../../../../stores/BattlePassStorage";
import {observer} from "mobx-react";
import images from '../../../../../shared/icons/*.png';
import svg from "./assets/*.svg";
import {IBattlePassItemDTO} from "../../../../../shared/battlePass/storage";
import {getBaseItemNameById, inventoryShared, ITEM_TYPE} from "../../../../../shared/inventory";
import {
    CustomEvent
} from "../../../../modules/custom.event";

@observer
export class Storage extends Component<{
    store: BattlePassStorageStore
}, {}> {

    store: BattlePassStorageStore = this.props.store;

    constructor(props: any) {
        super(props);
    }

    showInteraction(event: React.MouseEvent<HTMLDivElement, MouseEvent>, toStorage: boolean, id: number) {

        let itemName: string = '',
            target: IBattlePassItemDTO;

        if (toStorage) {
            target = this.store.inventory.find(el => el.id === id);
        } else {
            target = this.store.storage.find(el => el.id === id);
        }

        if (target) {
            itemName = getBaseItemNameById(target.item_id);

            if (target.serial) {
                let cfg = inventoryShared.get(target.item_id);

                if (cfg && cfg.type === ITEM_TYPE.CLOTH) {
                    itemName += ` (${target.serial})`
                }
            }
        }

        this.store.setState({
            styles: {
                display: 'block',
                position: 'absolute',
                left: `${event.screenX}px`,
                top: `${event.screenY}px`
            },
            menuActive: true,
            toStorage,
            name: itemName,
            targetId: id
        })
    }

    closeInteraction() {
        this.store.setState({
            styles: {
                display: 'none',
                position: 'absolute',
                left: `0px`,
                top: `0px`
            },
            menuActive: false
        })
    }

    componentWillUnmount() {
        this.closeInteraction();
    }

    transfer() {

        let target: IBattlePassItemDTO;

        if (this.store.toStorage) {
            target = this.store.inventory.find(el => el.id === this.store.targetId);
        } else {
            target = this.store.storage.find(el => el.id === this.store.targetId);
        }

        if (!target) return;

        this.closeInteraction()

        CustomEvent.triggerServer('battlePass:storage:transfer', target.id, this.store.toStorage);
    }

    getStyles() {
        return {...this.store.styles}
    }


    render() {
        return <div className={"storage"}>

            <div className="storage-menu" style={this.getStyles()}>
                <div className="storage-menu__name">
                    {this.store.name}
                </div>
                <div className="storage-menu__button" onClick={() => this.transfer()}>
                    <img src={svg["arrow"]} alt=""/>
                    Положить в {this.store.toStorage ? 'хранилище' : 'инвентарь'}
                </div>
            </div>

            <div className="storage-block">
                <div className="storage-block__title">
                    Инвентарь
                </div>
                <div className="storage-block-list">
                    {this.store.inventory.map((el, key) => {
                        return <div key={key} onClick={(e) => this.showInteraction(
                            e,
                            true,
                            el.id)}>
                            <img alt='' src={images[`Item_${el.item_id}`]}/>
                        </div>
                    })}
                </div>
            </div>

            <div className="storage-block">
                <div className="storage-block__title">
                    Хранилище
                </div>
                <div className="storage-block-list">
                    {this.store.storage.map((el, key) => {
                        return <div key={key} onClick={(e) => this.showInteraction(
                            e,
                            false,
                            el.id
                        )}>
                            <img alt='' src={images[`Item_${el.item_id}`]}/>
                        </div>
                    })}
                </div>
            </div>

        </div>
    }
}
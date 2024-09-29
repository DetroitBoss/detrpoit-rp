import React, {useCallback, useLayoutEffect, useState} from "react";
import "./style.less"

import svg from "./assets/*.svg"
import png from "./assets/*.png"
import {IDonateStorageItem, IDonateStorageMenu} from "../../../../../shared/donateStorage";
import {getBaseItemNameById, inventoryShared, ITEM_TYPE} from "../../../../../shared/inventory";
import {CustomEvent} from "../../../../modules/custom.event";
import images from '../../../../../shared/icons/*.png';

const DonateStorage = () => {

    const [storage, setStorage] = useState<IDonateStorageItem[]>([]);
    const [inventory, setInventory] = useState<IDonateStorageItem[]>([]);

    useLayoutEffect(() => {
        const ev = CustomEvent.register("donateStorage:setData", (inventoryDTO, storageDTO) => {
            setInventory(inventoryDTO);
            setStorage(storageDTO);
        });

        CustomEvent.triggerServer('donateStorage:update');

        return () => ev.destroy();
    }, []);

    const [menu, setMenu] = useState<IDonateStorageMenu>({
        show: false,
        name: '',
        styles: {
            display: 'none',
            position: 'absolute',
            left: `0px`,
            top: `0px`
        },
        toStorage: false
    });



    const [target, setTarget] = useState<number>(-1);

    const openInteraction = useCallback(
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>, toStorage: boolean, id: number) => {

            let itemName: string = '',
                targetItem: IDonateStorageItem;

            if (toStorage) {
                targetItem = inventory.find(el => el.id === id);
            } else {
                targetItem = storage.find(el => el.id === id);
            }

            if (target) {
                itemName = getBaseItemNameById(targetItem.item_id);

                if (targetItem.serial) {
                    let cfg = inventoryShared.get(targetItem.item_id);

                    if (cfg && cfg.type === ITEM_TYPE.CLOTH) {
                        itemName += ` (${targetItem.serial})`
                    }
                }
            }

            setMenu({
                show: true,
                name: itemName,
                styles: {
                    display: 'block',
                    position: 'absolute',
                    left: `${event.screenX * 0.8}px`,
                    top: `${event.screenY * 0.8}px`
                },
                toStorage
            })

            setTarget(id);

        }, [storage, inventory]);

    const closeInteraction = useCallback(() => {
        setMenu({
            show: false,
            name: '',
            styles: {
                display: 'none',
                position: 'absolute',
                left: `0px`,
                top: `0px`
            },
            toStorage: false
        })
    }, []);

    const transfer = useCallback(() => {
        if (!target) return;

        CustomEvent.triggerServer('donateStorage:transfer', target, menu.toStorage);

        closeInteraction()
    }, [target, menu]);

    return <div className="donateStorage">

        {menu.show && <div className="donateStorage-menu" style={menu.styles}>
            <div className="donateStorage-menu__name">
                {menu.name}
            </div>
            <div className="donateStorage-menu__button" onClick={() => transfer()}>
                <img src={svg["arrow"]} alt=""/>
                Положить в {menu.toStorage ? "хранилище" : "инвентарь"}
            </div>
        </div>}

        <div className="donateStorage__title">Хранилище</div>
        <div className="donateStorage-body">
            <div className="donateStorage-body-block donateStorage-body-block-left">
                <div className="donateStorage-body-block__title">
                    Ваш инвентарь
                </div>
                <div className="donateStorage-body-block__roominess">
                    <img src={svg["infinity"]} alt=""/>
                    кг
                </div>
                <div className="donateStorage-body-block-list">
                    {inventory.map((el, key) => {
                        return <div className="donateStorage-body-block-list-slot" key={key}
                                    onClick={(e) => openInteraction(e, true, el.id)}>
                            <img src={images[`Item_${el.item_id}`]} alt=""/>
                        </div>
                    })}
                </div>
            </div>
            <div className="donateStorage-body-block">
                <div className="donateStorage-body-block__title">
                    Хранилище
                </div>
                <div className="donateStorage-body-block__description">
                    Тут хранятся только ваши донатные вещи
                </div>
                <div className="donateStorage-body-block__roominess">
                    <img src={svg["infinity"]} alt=""/>
                    кг
                </div>
                <div className="donateStorage-body-block-list">
                    {storage.map((el, key) => {
                        return <div className="donateStorage-body-block-list-slot" key={key}
                                    onClick={(e) => openInteraction(e, false, el.id)}>
                            <img src={images[`Item_${el.item_id}`]} alt=""/>
                        </div>

                    })}
                </div>
            </div>
        </div>
    </div>
}

export default DonateStorage;
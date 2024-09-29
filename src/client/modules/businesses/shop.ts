import {CustomEvent} from "../custom.event";
import {guiNames} from "../../../shared/gui";
import {gui} from "../gui";
import {CONTAINERS_DATA, inventoryShared} from "../../../shared/inventory";
import {disableControlGroup} from "../controls";

const sourceBackpack = { drawable: 0, texture: 0 };

CustomEvent.registerServer('shop:open', () => {
    sourceBackpack.drawable = mp.players.local.getDrawableVariation(5);
    sourceBackpack.texture = mp.players.local.getTextureVariation(5);

    gui.setGui('shop');
});

let cefData: any[] = [];
CustomEvent.registerServer('item_shop:init', (
    shopId: number,
    shopName: string,
    items: { item_id: number, count: number, price: number }[],
    donate: number,
    shopType: number,
    shopCategory: number
) => {
    cefData = [shopId, shopName, items, donate, shopType, shopCategory];
    CustomEvent.triggerCef('cef:item_shop:init', ...cefData);
});

mp.events.add('shop::closeButton', () => {
    if (tryOnTimeout != null) {
        clearTimeout(tryOnTimeout);
        tryOnTimeout = null;
    }

    mp.players.local.setComponentVariation(5, sourceBackpack.drawable, sourceBackpack.texture, 2);
});

let tryOnTimeout: number = null;
mp.events.add('shop::tryOnBackpack', (backpackItemId: number) => {
    const backpackCfg = CONTAINERS_DATA.find(container => container.item_id === backpackItemId)?.bag_sync;
    if (!backpackCfg) {
        return;
    }

    if (tryOnTimeout != null) {
        clearTimeout(tryOnTimeout);
        tryOnTimeout = null;
        mp.players.local.setComponentVariation(5, sourceBackpack.drawable, sourceBackpack.texture, 2);
    }

    gui.setGui(null);
    mp.players.local.setComponentVariation(5, backpackCfg.d, backpackCfg.t, backpackCfg.p);

    tryOnTimeout = setTimeout(() => {
        gui.setGuiWithEvent('shop', 'cef:item_shop:init', ...cefData);
        tryOnTimeout = null;
    }, 3000);
});

mp.events.add('render', () => {
    if (!tryOnTimeout) {
        return;
    }

    disableControlGroup.baseKeyDisable();
});
import {CustomEvent} from "../../custom.event";
import {MarketItemChangesDto} from "../../../../shared/market/dtos/marketItemChangesDto";
import {marketItemsDb} from "../marketItemsDb";
import {getPlayerTent} from "../TradeTent";
import {MarketItemEntity} from "../../typeorm/entities/marketItem";
import {systemUtil} from "../../../../shared/system";
import {inventoryShared, OWNER_TYPES} from "../../../../shared/inventory";
import {inventory} from "../../inventory";
import {ItemEntity} from "../../typeorm/entities/inventory";
import {AlertType} from "../../../../shared/alert";

const ITEMS_MOVED_STOCK_MSG = 'Некоторые предметы были перемещены на склад рынка, заберите их в течении 24 часов или они пропадут';

type NotifyType = { msg: string, type: AlertType }

CustomEvent.registerCef('market::applyChanges', async (player, changes: MarketItemChangesDto[]) => {
    const notifies = new Map<string, NotifyType>();

    const tent = getPlayerTent(player);
    if (!tent) {
        return player.user.setGui(null);
    }

    let marketItems = marketItemsDb.getBySeller(player);

    moveDisabledItemsToStock(player, marketItems, changes, notifies);

    const addedItems = addNewItemsToMarket(player, changes);
    marketItems = marketItems.concat(addedItems);

    changeMarketItemsCount(player, marketItems, changes, notifies);
    changeMarketItemsPrices(player, marketItems, changes);

    await marketItemsDb.save(marketItems);
    player.user.setGui(null);
    player.notify('Изменения были успешно применены', 'success');

    for (let notify of [...notifies.values()]) {
        player.notify(notify.msg, notify.type);
    }
});

function moveDisabledItemsToStock(player: PlayerMp, marketItems: MarketItemEntity[], changes: MarketItemChangesDto[], notifies: Map<string, NotifyType>) {
    const itemsToDisable = changes.filter(itemChange => itemChange.oldActive && !itemChange.newActive);

    const marketItemsToMove = marketItems
        .filter(marketItem => itemsToDisable.some(item => item.itemId === marketItem.itemId));

    marketItemsDb.moveMarketItemsToStock(marketItemsToMove);
    systemUtil.spliceArrayByArray(changes, itemsToDisable);

    if (marketItemsToMove.length > 0) {
        notifies.set('itemsMovedToStock', {
            msg: ITEMS_MOVED_STOCK_MSG,
            type: 'warning'
        });
    }
}

function addNewItemsToMarket(player: PlayerMp, changes: MarketItemChangesDto[]) {
    const itemsToAdd = changes.filter(itemChange => !itemChange.oldActive && itemChange.newActive);
    const playerInventory = player.user.inventory;

    const addedMarketItems = itemsToAdd.map((itemChange) => {
        const itemConfig = inventoryShared.get(itemChange.itemConfigId);

        if (itemChange.newCount <= 0) {
            return null;
        }

        if (itemConfig.canSplit) {
            const availableAmount = inventory.getItemsCountById(player, itemChange.itemConfigId);
            if (itemChange.newCount > availableAmount) {
                itemChange.newCount = availableAmount;
            }

            inventory.deleteItemsById(player, itemChange.itemConfigId, itemChange.newCount);

            const item = new ItemEntity();
            item.owner_type = OWNER_TYPES.MARKET_STOCK;
            item.owner_id = player.dbid;
            item.item_id = itemChange.itemConfigId;
            item.count = itemChange.newCount;

            return marketItemsDb.create(player, item, itemChange.newPrice);
        } else {
            const item = playerInventory.find(entity => entity.id === itemChange.itemId);
            if (!item) {
                return null;
            }

            inventory.updateItemOwner(item, OWNER_TYPES.MARKET_STOCK, player.dbid);
            return marketItemsDb.create(player, item, itemChange.newPrice);
        }
    })
        .filter(item => item !== null);

    systemUtil.spliceArrayByArray(changes, itemsToAdd);
    return addedMarketItems;
}

function changeMarketItemsCount(player: PlayerMp, marketItems: MarketItemEntity[], changes: MarketItemChangesDto[], notifies: Map<string, NotifyType>) {
    const itemsToChangeCount = changes.filter(itemChange => itemChange.newCount !== itemChange.oldCount);

    for (let itemChange of itemsToChangeCount) {
        const marketItem = marketItems.find(entity => entity.item.item_id === itemChange.itemConfigId);
        if (!marketItem)
            continue;

        if (itemChange.newCount > itemChange.oldCount) {
            let countDiff = itemChange.newCount - itemChange.oldCount;
            const availableAmount = inventory.getItemsCountById(player, itemChange.itemConfigId);

            if (availableAmount < countDiff)
                countDiff = availableAmount;

            inventory.deleteItemsById(player, itemChange.itemConfigId, countDiff);
            marketItem.item.count += countDiff;
        } else {
            let countDiff = itemChange.oldCount - itemChange.newCount;
            if (marketItem.item.count < countDiff) {
                return;
            }

            marketItem.item.count -= countDiff;

            const stockItem = new ItemEntity();
            stockItem.owner_type = OWNER_TYPES.MARKET_STOCK;
            stockItem.owner_id = player.dbid;
            stockItem.item_id = itemChange.itemConfigId;
            stockItem.count = countDiff;


            const stockMarketItem = marketItemsDb.create(player, stockItem, 0);
            marketItemsDb.moveMarketItemsToStock([stockMarketItem]);
            marketItems.push(stockMarketItem);

            notifies.set('itemsMovedToStock', {
                msg: ITEMS_MOVED_STOCK_MSG,
                type: 'warning'
            });
        }
    }
}

function changeMarketItemsPrices(player: PlayerMp, marketItems: MarketItemEntity[], changes: MarketItemChangesDto[]) {
    const itemsToChange = changes.filter(itemChange => itemChange.newPrice !== itemChange.oldPrice);

    for (let itemToChange of itemsToChange) {
        const marketItem = marketItems.find(entity => entity.itemId === itemToChange.itemId);
        if (!marketItem)
            continue;

        if (itemToChange.newPrice < 1)
            continue;

        marketItem.price = itemToChange.newPrice;
    }
}


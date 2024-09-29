import {inventory} from "../inventory";
import {OWNER_TYPES} from "../../../shared/inventory";
import {marketItemsDb} from "./marketItemsDb";
import {systemUtil} from "../../../shared/system";
import {MARKET_STOCK_RADIUS, MARKET_STOCKS} from "../../../shared/market/tentSpotsConfig";
import {system} from "../system";

export function openMarketStock(player: PlayerMp) {
    inventory.openInventory(player);
}

export function getNearestMarketInventory(player: PlayerMp): { owner_type: OWNER_TYPES, owner_id: number, have_access: boolean } {
    if (!MARKET_STOCKS.some(position => systemUtil.distanceToPos(position, player.position) < MARKET_STOCK_RADIUS)) {
        return null;
    }

    updateInventoryBlocks(player);

    return { owner_type: OWNER_TYPES.MARKET_STOCK, owner_id: player.dbid, have_access: true };
}

function updateInventoryBlocks(player: PlayerMp) {
    const stockItems = marketItemsDb.getBySellerOnStock(player);
    inventory.inventory_blocks.set(`${OWNER_TYPES.MARKET_STOCK}_${player.dbid}`, stockItems.map(entity => entity.item));
}

mp.events.add('inventory:itemTransferred', (
    player: PlayerMp,
    itemId: number,
    new_owner_type: OWNER_TYPES,
    new_owner_id: number,
    owner_type: OWNER_TYPES,
    owner_id: number
) => {
    if (owner_type !== OWNER_TYPES.MARKET_STOCK) {
        return;
    }

    const stockItems = marketItemsDb.getBySellerOnStock(player);
    const transferredItem = stockItems.find(entity => entity.itemId === itemId);
    if (!transferredItem) {
        return;
    }

    if (transferredItem.item
        && transferredItem.item.owner_type === OWNER_TYPES.MARKET_STOCK
        && transferredItem.item.count > 0) {
        return;
    }

    marketItemsDb.delete(transferredItem);

    updateInventoryBlocks(player);

});

function checkOutdatedItems() {
    const stockItems = marketItemsDb.getAllStockItems();
    for (let item of stockItems) {
        if (system.timestamp > item.deleteStockTime) {
            inventory.deleteItem(item.item);
            marketItemsDb.delete(item);
        }
    }
}

setInterval(checkOutdatedItems, 60000);
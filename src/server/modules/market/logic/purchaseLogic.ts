import {CustomEvent} from "../../custom.event";
import {getTentById} from "../TradeTent";
import {marketItemsDb} from "../marketItemsDb";
import {inventoryShared, OWNER_TYPES} from "../../../../shared/inventory";
import {inventory} from "../../inventory";
import {MarketItemEntity} from "../../typeorm/entities/marketItem";
import {ItemEntity} from "../../typeorm/entities/inventory";

CustomEvent.registerCef('market::purchase', async (player, tentId: number, itemId: number, amount: number) => {
    const tent = getTentById(tentId);
    if (!tent) {
        return player.user.setGui(null);
    }

    const marketItem = marketItemsDb.getBySeller(tent.owner)
        .find(entity => entity.itemId === itemId);

    if (!getItemAmountAvailable(marketItem, amount)) {
        player.notify('Выбранного товара не осталось на складе', 'error')
        await tent.openMarket(player);
        return;
    }

    const itemConfig = inventoryShared.get(marketItem.item.item_id);
    const isPlayerCanTakeItem = player.user.canTakeItem(itemConfig.item_id, amount, amount);
    if (!isPlayerCanTakeItem) {
        return player.notify('Вы не можете вместить все предметы', 'error');
    }

    const totalPrice = marketItem.price * amount;
    if (player.user.money < totalPrice || !player.user.removeMoney(totalPrice, true,
        `Покупка предметов на рынке (${itemConfig.item_id} x${amount})`)) {
        return player.notify('У вас недостаточно средств', 'error');
    }

    tent.addMoney(totalPrice, marketItem.item, amount, player.user.name);

    if (itemConfig.canSplit) {
        marketItem.item.count -= amount;
        player.user.giveItem({
            item_id: marketItem.item.item_id,
            count: amount
        });

        if (marketItem.item.count <= 0) {
            inventory.deleteItem(marketItem.item);
            marketItemsDb.delete(marketItem);
        }

    } else {
        inventory.updateItemOwner(marketItem.item, OWNER_TYPES.PLAYER, player.dbid);
        inventory.reloadInventory(player);

        marketItemsDb.delete(marketItem);
    }

    await tent.openMarket(player);
});

function getItemAmountAvailable(marketItem: MarketItemEntity, amount: number): boolean {
    if (!marketItem) {
        return false;
    }

    const itemConfig = inventoryShared.get(marketItem.item.item_id);
    if (itemConfig.canSplit) {
        return marketItem.item.count >= amount;
    }

    return true;
}

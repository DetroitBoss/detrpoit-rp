import {inventory} from "../inventory";
import {OWNER_TYPES} from "../../../shared/inventory";
import {ItemEntity} from "../typeorm/entities/inventory";
import {CustomEvent} from "../custom.event";
import {IDonateStorageItem} from "../../../shared/donateStorage";

class DonateStorage {
    public transferItemHandler = (player: PlayerMp, id: number, toStorage: boolean) => {
        if (!player.user) return;

        if (toStorage) {
            const inventoryItems = this.getInventoryItems(player),
                item = inventoryItems.find(el => el.id === id);

            if (!item) return;

            this.addToStorage(player, item);
        } else {
            const storage = this.getStorageItems(player),
                item = storage.find(el => el.id === id);

            if (!item) return;

            this.addToInventory(player, item);
        }
    }

    private addToStorage(player: PlayerMp, item: ItemEntity) {
        inventory.updateItemOwner(item.id, OWNER_TYPES.DONATE_STORAGE, player.user.id, OWNER_TYPES.PLAYER, player.user.id);
        inventory.reloadInventory(player, [OWNER_TYPES.DONATE_STORAGE, player.user.id],
            [OWNER_TYPES.PLAYER, player.user.id])
        this.updatePlayerStorage(player);
    }

    private addToInventory(player: PlayerMp, item: ItemEntity) {
        inventory.updateItemOwner(item.id, OWNER_TYPES.PLAYER, player.user.id, OWNER_TYPES.DONATE_STORAGE, player.user.id);
        inventory.reloadInventory(player, [OWNER_TYPES.PLAYER, player.user.id],
            [OWNER_TYPES.DONATE_STORAGE, player.user.id])
        this.updatePlayerStorage(player);
    }

    protected getStorageItems(player: PlayerMp) {
        return inventory.getInventory(OWNER_TYPES.DONATE_STORAGE, player.user.id);
    }

    private getInventoryItems(player: PlayerMp) {
        const items = inventory.getInventory(OWNER_TYPES.PLAYER, player.user.id);

        return items.filter(item => this.isDonateItem(item));
    }

    public updatePlayerStorage = (player: PlayerMp) => {
        const inventory = this.getInventoryItems(player),
            storage = this.getStorageItems(player),
            inventoryDTO: IDonateStorageItem[] = [],
            storageDTO: IDonateStorageItem[] = [];

        inventory.forEach(el => {
            inventoryDTO.push({
                id: el.id,
                item_id: el.item_id,
                serial: el.serial
            })
        })

        storage.forEach(el => {
            storageDTO.push({
                id: el.id,
                item_id: el.item_id,
                serial: el.serial
            })
        })

        CustomEvent.triggerCef(player, 'donateStorage:setData', inventoryDTO, storageDTO);
    }

    public isDonateItem(item: ItemEntity) {
        return item.advancedString === "DONATE_BLOCK_CLOTHES";
    }
}


export const donateStorage = new DonateStorage();


CustomEvent.registerCef('donateStorage:transfer', donateStorage.transferItemHandler);
CustomEvent.registerCef('donateStorage:update', donateStorage.updatePlayerStorage)
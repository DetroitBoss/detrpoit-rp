import {inventory} from "../../inventory";
import {OWNER_TYPES} from "../../../../shared/inventory";
import {BATTLE_PASS_SEASON} from "../../../../shared/battlePass/main";
import {ItemEntity} from "../../typeorm/entities/inventory";
import {IBattlePassItemDTO} from "../../../../shared/battlePass/storage";
import {CustomEvent} from "../../custom.event";
import {isBattlePassItem} from "../../../../shared/battlePass/history-seasons";

class BattlePassStorage {
    constructor() {
        CustomEvent.registerCef('battlePass:storage:transfer', this.transferItemHandler);
    }

    private transferItemHandler = (player: PlayerMp, id: number, toStorage: boolean) => {
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

    protected addToStorage(player: PlayerMp, item: ItemEntity) {
        inventory.updateItemOwner(item.id, OWNER_TYPES.BP_STORAGE, player.user.id, OWNER_TYPES.PLAYER, player.user.id);
        inventory.reloadInventory(player, [OWNER_TYPES.BP_STORAGE, player.user.id],
            [OWNER_TYPES.PLAYER, player.user.id])
        this.updatePlayerStorage(player);
    }

    protected addToInventory(player: PlayerMp, item: ItemEntity) {
        inventory.updateItemOwner(item.id, OWNER_TYPES.PLAYER, player.user.id, OWNER_TYPES.BP_STORAGE, player.user.id);
        inventory.reloadInventory(player, [OWNER_TYPES.PLAYER, player.user.id],
            [OWNER_TYPES.BP_STORAGE, player.user.id])
        this.updatePlayerStorage(player);
    }

    private getInventoryItems(player: PlayerMp) {
        const items = inventory.getInventory(OWNER_TYPES.PLAYER, player.user.id);

        return items.filter(item =>
            isBattlePassItem(item.advancedString) || item.advancedString === 'BATTLE_PASS_CLOTHES');
    }

    protected getStorageItems(player: PlayerMp) {
        return inventory.getInventory(OWNER_TYPES.BP_STORAGE, player.user.id);
    }

    public updatePlayerStorage(player: PlayerMp) {
        const inventory = this.getInventoryItems(player),
            storage = this.getStorageItems(player),
            inventoryDTO: IBattlePassItemDTO[] = [],
            storageDTO: IBattlePassItemDTO[] = [];

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

        CustomEvent.triggerCef(player, 'battlePass:storage:setData', inventoryDTO, storageDTO);
    }
}

export const battlePassStorage = new BattlePassStorage();
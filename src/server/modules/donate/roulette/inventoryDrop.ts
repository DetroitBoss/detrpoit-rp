import {DropBase} from "./dropBase";
import {InventoryDropData} from "../../../../shared/donate/donate-roulette/Drops/inventoryDrop";
import {inventory} from "../../inventory";
import {OWNER_TYPES} from "../../../../shared/inventory";

export class InventoryDrop extends DropBase {
    constructor(public readonly data: InventoryDropData) {
        super(data.dropId);
    }

    protected onDropActivated(player: PlayerMp): boolean {
        inventory.createItem(
            {
                owner_type: OWNER_TYPES.PLAYER,
                owner_id: player.user.id,
                item_id: this.data.inventoryItemId,
                count: this.data.count,
            });
        return true;
    }
}
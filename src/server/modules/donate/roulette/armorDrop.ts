import {DropBase} from "./dropBase";
import {inventory} from "../../inventory";
import {ARMOR_ITEM_ID, OWNER_TYPES} from "../../../../shared/inventory";
import {dress} from "../../customization";
import {ArmorNames} from "../../../../shared/cloth";
import {ArmorDropData} from "../../../../shared/donate/donate-roulette/Drops/armorDrop";

export class ArmorDrop extends DropBase {
    constructor(public readonly data: ArmorDropData) {
        super(data.dropId);
    }

    protected onDropActivated(player: PlayerMp): boolean {
        const dressCfg = dress.data.find(dressEntity => dressEntity.name === ArmorNames.StandardArmor);

        inventory.createItem(
            {
                owner_type: OWNER_TYPES.PLAYER,
                owner_id: player.user.id,
                item_id: ARMOR_ITEM_ID,
                count: this.data.armorStrength,
                advancedNumber: dressCfg.id,
                serial: ArmorNames.StandardArmor
            });
        return true;
    }
}
import {CommonViewStrategy} from "./CommonViewStrategy";
import {ItemEntity} from "../../typeorm/entities/inventory";
import {TradeTent} from "../TradeTent";
import {MarketItemEntity} from "../../typeorm/entities/marketItem";
import {inventoryShared} from "../../../../shared/inventory";

export class BlackViewStrategy extends CommonViewStrategy {
    public constructor(tent: TradeTent) {
        super(tent);
    }


    public getItemsToShow(player: PlayerMp): MarketItemEntity[] {
        let items = super.getItemsToShow(player);

        if (player.user.is_gos) {
            items = items.filter(entity => {
                const config = inventoryShared.get(entity.item.item_id);
                return config.protect;
            })
        }

        return items;
    }
}
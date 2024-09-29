import {IViewStrategy} from "./IViewStrategy";
import {ItemEntity} from "../../typeorm/entities/inventory";
import {TradeTent} from "../TradeTent";
import {MarketItemEntity} from "../../typeorm/entities/marketItem";
import {marketItemsDb} from "../marketItemsDb";

export class CommonViewStrategy implements IViewStrategy {
    public constructor(
        private readonly tent: TradeTent
    ) {

    }

    public getItemsToShow(player: PlayerMp): MarketItemEntity[] {
        return marketItemsDb.getBySeller(this.tent.owner);
    }

}
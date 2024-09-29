import {MarketItemEntity} from "../../typeorm/entities/marketItem";

export interface IViewStrategy {
    getItemsToShow(player: PlayerMp): MarketItemEntity[];
}
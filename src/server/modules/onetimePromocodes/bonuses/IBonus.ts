import {MenuClass} from "../../menu";

export interface IBonus<T> {
    activate(player: PlayerMp, promocodeName: string, data: T): void;

    addItemsToCreateMenu(player: PlayerMp, menu: MenuClass, data: any, updateMenu: () => void): void;
}
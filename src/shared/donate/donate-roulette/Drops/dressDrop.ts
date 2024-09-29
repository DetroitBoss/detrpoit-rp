import {DropDataBase} from "./dropBase";
import {RarityType} from "../main";
import {DropSellType, RouletteType} from "../enums";

export class DressDropData extends DropDataBase {
    constructor(
        dropId: number,
        icon: number,
        /** Название одежды из конфига основного сервера */
        public readonly clothName: string,
        public readonly clothComponentName: string,
        name: string,
        rarityType: RarityType,
        roulette: RouletteType[],
        sellType: DropSellType,
        sellPrice: number,
        canDrop: boolean = true,
        isVisibleInPrizeList: boolean = true
    ) {
        super(dropId, icon, name, rarityType, roulette, sellType, sellPrice, canDrop, isVisibleInPrizeList);
    }
}
import {DropDataBase} from "./dropBase";
import {RarityType} from "../main";
import {DropSellType, RouletteType} from "../enums";

export class RealDropData extends DropDataBase {
    constructor(
        dropId: number,
        icon: number,
        name: string,
        rarityType: RarityType,
        roulette: RouletteType[],
        sellType: DropSellType,
        sellPrice: number,
        public readonly canDrop: boolean = true,
        isVisibleInPrizeList: boolean = true
    ) {
        super(dropId, icon, name, rarityType, roulette, sellType, sellPrice, canDrop, isVisibleInPrizeList);
    }
}
import {DropDataBase} from "./dropBase";
import {RarityType} from "../main";
import {DropSellType, RouletteType} from "../enums";
import {VipId} from "../../../vip";

export class VipDropData extends DropDataBase {
    constructor(
        dropId: number,
        icon: number,
        public readonly vipType: VipId,
        public readonly days: number,
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
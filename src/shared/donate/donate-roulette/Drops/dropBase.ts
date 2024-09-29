import {DropSellType, RouletteType} from "../enums";
import {RarityType} from "../main";

export abstract class DropDataBase {
    private _selected: boolean;
    
    get selected(): boolean {
        return this._selected;
    }
    set selected(val: boolean) {
        this._selected = val;
    }
    
    protected constructor(
        public readonly dropId: number, 
        public readonly icon: number, 
        public readonly name: string,
        public readonly rarity: RarityType,
        public readonly roulette: RouletteType[], 
        public readonly sellType: DropSellType,
        public readonly sellPrice: number,
        public canDrop: boolean = true,
        public isVisibleInPrizeList: boolean = true,
    ) {}
}
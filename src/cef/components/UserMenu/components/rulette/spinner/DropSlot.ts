import {DropDataBase} from "../../../../../../shared/donate/donate-roulette/Drops/dropBase";
import {RarityType} from "../../../../../../shared/donate/donate-roulette/main";

export class DropSlot {
    private readonly _data: DropDataBase;
    
    public get data(): DropDataBase {
        return this._data;
    }
    
    private _img: HTMLImageElement;
    
    public set img(value: HTMLImageElement) {
        this._img = value
    }

    public get img(): HTMLImageElement {
        return this._img;
    }

    private _rarityImg: HTMLImageElement;
    
    public set rarityImg(value: HTMLImageElement) {
        this._rarityImg = value
    }

    public get rarityImg(): HTMLImageElement {
        return this._rarityImg;
    }

    private _color: string;
 
    public set color(value: string) {
        this._color = value
    }

    public get color(): string {
        switch (this._data.rarity) {
            case RarityType.LEGENDARY:
                return "#ffd74a"
            case RarityType.SPECIAL:
                return "#ff3806"
            case RarityType.UNIQUE:
                return "#ff3ea6"
            case RarityType.RARE:
                return "#ba4aff"
            case RarityType.COMMON:
                return "#3d95e7"
            case RarityType.CASINO:
                return "#ff0000";
        }
        
    }
    
    constructor(data: DropDataBase) {
        this._data = data;
    }
}
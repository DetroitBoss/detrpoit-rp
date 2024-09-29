import {RarityType} from "./main";

export class Rarity {
    constructor(
        public readonly type: RarityType, 
        public readonly displayName: string, 
        public readonly dropChance: number) {
    }
}
import {MonopolyPlayer} from "../monopolyPlayer";
import {FieldType} from "../fieldType";

export interface IField {
    /** ID (расположение на столе) */
    id: number
    
    type: FieldType
    /** Сработает когда игрок попал на поле */
    onPlayerReached(player: MonopolyPlayer): void
}


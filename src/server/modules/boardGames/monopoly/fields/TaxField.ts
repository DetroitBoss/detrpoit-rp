import {MonopolyPlayer} from "../monopolyPlayer";
import {IField} from "./IField";
import {FieldBase} from "./FieldBase";
import {FieldType} from "../fieldType";

export class TaxField extends FieldBase implements IField {
    public readonly type: FieldType = FieldType.Tax

    public onPlayerReached(player: MonopolyPlayer): void {
        player.withdrawBalance(1000)
    }
}
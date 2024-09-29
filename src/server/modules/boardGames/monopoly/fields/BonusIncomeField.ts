import {MonopolyPlayer} from "../monopolyPlayer";
import {IField} from "./IField";
import {FieldBase} from "./FieldBase";
import {FieldType} from "../fieldType";

export class BonusIncomeField extends FieldBase implements IField {
    public readonly type: FieldType = FieldType.BonusIncome

    public onPlayerReached(player: MonopolyPlayer): void {
        player.balance += 2000
        player.releaseMove()
    }
}
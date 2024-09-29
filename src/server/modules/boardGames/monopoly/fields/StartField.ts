import {MonopolyPlayer} from "../monopolyPlayer";
import {IField} from "./IField";
import {FieldBase} from "./FieldBase";
import {FieldType} from "../fieldType";

export class StartField extends FieldBase implements IField {
    public readonly type: FieldType = FieldType.Start

    public onPlayerReached(player: MonopolyPlayer): void {
        player.balance += 1000
        player.suggestMove()
    }
}
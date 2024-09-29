import {MonopolyPlayer} from "../monopolyPlayer";
import {IField} from "./IField";
import {FieldBase} from "./FieldBase";
import {FieldType} from "../fieldType";

export class SKipField extends FieldBase implements IField {
    public readonly type: FieldType = FieldType.Skip

    public onPlayerReached(player: MonopolyPlayer): void {
        player.releaseMove()
    }
}
import {MonopolyPlayer} from "../monopolyPlayer";
import {IField} from "./IField";
import {FieldBase} from "./FieldBase";
import {FieldType} from "../fieldType";

export class PrisonField extends FieldBase implements IField {
    public readonly type: FieldType = FieldType.Prison

    public onPlayerReached(player: MonopolyPlayer): void {
        player.prisonMoves = 3
        player.teleportTo(this.id)
        player.releaseMove()
    }
}
import {MonopolyPlayer} from "../monopolyPlayer";
import {IField} from "./IField";
import {FieldBase} from "./FieldBase";
import {system} from "../../../system";
import {FieldType} from "../fieldType";

export class TeleportField extends FieldBase implements IField {
    public readonly type: FieldType = FieldType.Teleport

    public onPlayerReached(player: MonopolyPlayer): void {
        player.teleportBy(system.getRandomInt(4, 10))
    }
}
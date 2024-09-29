import {MonopolyPlayer} from "../monopolyPlayer";
import {IField} from "./IField";
import {FieldBase} from "./FieldBase";
import {system} from "../../../system";
import {FieldType} from "../fieldType";

const WIN_AMOUNT = 2500

export class JackpotField extends FieldBase implements IField {
    public readonly type: FieldType = FieldType.Jackpot

    public onPlayerReached(player: MonopolyPlayer): void {
        const randomNumber = system.getRandomInt(1, 100)
        if (randomNumber < 20) {
            player.balance += WIN_AMOUNT
            player.player.notify(`Поздравляем! Вы выиграли ${WIN_AMOUNT} в лотерее`, 'success')
        } else {
            player.player.notify(`К сожалению, вы не выиграли ничего`, 'error')
        }
        player.releaseMove()
    }
}
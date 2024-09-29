import {DropBase} from "./dropBase";
import {MoneyDropData} from "../../../../shared/donate/donate-roulette/Drops/moneyDrop";

export class MoneyDrop extends DropBase {
    constructor(public readonly data: MoneyDropData) {
        super(data.dropId);
    }

    protected onDropActivated(player: PlayerMp): boolean {
        player.user.addMoney(this.data.count, true, 'moneyFromRoulette')
        return true
    };
}
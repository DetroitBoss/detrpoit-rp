import {DropBase} from "./dropBase";
import {XpDropData} from "../../../../shared/donate/donate-roulette/Drops/xpDrop";

export class ExpDrop extends DropBase {
    constructor(public readonly data: XpDropData) {
        super(data.dropId);
    }

    protected onDropActivated(player: PlayerMp): boolean {
        player.user.giveExp(this.data.count)
        return true
    };
}
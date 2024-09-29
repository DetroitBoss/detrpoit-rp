import {DropBase} from "./dropBase";
import {VipDropData} from "../../../../shared/donate/donate-roulette/Drops/vipDrop";
import {system} from "../../system";

export class VipDrop extends DropBase {
    constructor(public readonly data: VipDropData) {
        super(data.dropId);
    }

    protected onDropActivated(player: PlayerMp): boolean {
        if (player.user.vip && player.user.vip !== this.data.vipType && system.timestamp < player.user.vip_end) {
            player.notify(`У вас уже есть VIP другого уровня`, "error")
            return false;
        }
        player.user.giveVip(this.data.vipType, this.data.days);
        player.notify(`Вы получили ${this.data.vipType} VIP на ${this.data.days} дней!`)
        player.user.save();
        
        return true;
    };
}
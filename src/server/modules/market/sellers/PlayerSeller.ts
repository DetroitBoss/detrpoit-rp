import {ISeller} from "./ISeller";
import {CustomEvent} from "../../custom.event";

export class PlayerSeller implements ISeller {
    public constructor(
        private readonly position: Vector3Mp,
        private readonly player: PlayerMp
    ) {
        player.notify('Так как вы продаете товары сами, то не можете покидать пределы рынка', 'info');

        CustomEvent.triggerClient(player, 'market:setSellerPosition', this.position);
    }

    public destroy(isTentDestroyed: boolean): void {
        CustomEvent.triggerClient(this.player, 'market:setSellerPosition', null);
    }

    public makePayment(money: number): void {
        return;
    }

    public getSellsPercent(): number {
        return 0;
    }

    public callToTent(caller: PlayerMp): void {
        CustomEvent.triggerClient(this.player, 'market:calledByCop');
        caller.notify('Владелец палатки подойдет к ней в ближайшее время');
    }
}
import {interractionMenuBasic} from "../../../shared/interactions";
import {CustomEvent} from "../custom.event";

export class InterractionMenu extends interractionMenuBasic {
    player: PlayerMp;
    private _forVehicle: boolean;
    constructor(player: PlayerMp, forVehicle: boolean = false) {
        super();
        this.player = player
        this._forVehicle = forVehicle;
    }
    open() {
        if (!mp.players.exists(this.player)) return;
        CustomEvent.triggerClient(this.player, 'intMenu:open', this.id, this._forVehicle, this.items.map(item => item))
    }
}
import { User } from "../../user";
import {system} from "../../system";
import {CASINO_DIMENSION, WHEEL_POSITION} from "../../../../shared/casino/wheel";
import {CustomEvent} from "../../custom.event";

export class Wheel {
    private _occupator: number | null = null;

    constructor() {

    }

    get occupator() {
        if (!User.get(this._occupator)) {
            return null;
        }else{
            return this._occupator;
        }
    }

    set occupator(value: number | null) {
        if (value !== null && this._occupator !== null) return;
        this._occupator = value;
    }

    public spin(player: PlayerMp, prize: number) {
        mp.players.forEach(p => {
            if (p.dimension !== CASINO_DIMENSION || system.distanceToPos(p.position, WHEEL_POSITION) > 50) return;
            
            CustomEvent.triggerClient(p, 'casino:wheel:spin', prize, player.user.id === p.user.id);
        })
    }

    public setFinishRot(rot: number) {
        mp.players.forEach(p => {
            if (p.dimension !== CASINO_DIMENSION || system.distanceToPos(p.position, WHEEL_POSITION) > 50) return;

            CustomEvent.triggerClient(p, "casino:wheel:finishSpin", rot);
        })
    }
}
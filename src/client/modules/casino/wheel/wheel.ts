import {WHEEL_PROP, WHEEL_POSITION, CASINO_DIMENSION} from "../../../../shared/casino/wheel";

export class Wheel {
    private readonly _entity: ObjectMp
    public isSpinning: boolean = false
    public stopNow: boolean = false;

    constructor() {
        this._entity = mp.objects.new(mp.game.joaat(WHEEL_PROP), WHEEL_POSITION, {dimension: CASINO_DIMENSION});
    }

    get entity(): ObjectMp {
        return this._entity;
    }

    setFinishRot(rot: number) {
        if (this.isSpinning) this.stopNow = true;

        this._entity.setRotation(0, rot, 0, 2, true);
    }

    public playStartSpinSound(position: Vector3Mp): void {
        mp.game.audio.playSoundFromCoord(1, 'Spin_Start', position.x, position.y, position.z, 'dlc_vw_casino_lucky_wheel_sounds', true, 0, false);
    }

    public playerWinSound(position: Vector3Mp): void {
        mp.game.audio.playSoundFromCoord(1, 'Win', position.x, position.y, position.z, "dlc_vw_casino_lucky_wheel_sounds", true, 0, false);
    }
}
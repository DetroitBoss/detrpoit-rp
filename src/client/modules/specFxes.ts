import {CustomEvent} from "./custom.event";
import {Vector3Shared} from "../../shared/system";

CustomEvent.registerServer('fxes:addExplosion', (
    position: Vector3Shared,
    type: number,
    damage: number,
    isAudible: boolean,
    isInvisible: boolean,
    cameraShake: number,
) => {
    mp.game.fire.addExplosion(position.x, position.y, position.z, type, damage, isAudible, isInvisible, cameraShake);
});

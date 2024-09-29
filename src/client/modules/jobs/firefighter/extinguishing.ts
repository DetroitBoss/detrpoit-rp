import {FirePlace, fireSpots} from "./firespots";
import {systemUtil} from "../../../../shared/system";
import {CustomEvent} from "../../custom.event";
import {user} from "../../user";

const ExtinguishingSphereRadius = 2;

const player = mp.players.local;
export const fireExtinguisherHash = mp.game.joaat('weapon_fireextinguisher');

// Отключение воды на пожарке
const fireTruckHash = mp.game.joaat('firetruk');
mp.events.add('render', () => {
    if (!player.isInAnyVehicle(false) || player.vehicle.getModel() !== fireTruckHash) {
        return;
    }

    mp.game.controls.disableControlAction(0, 68, true);
});

mp.events.add('playerWeaponShot', (position: Vector3Mp, targetEntity: any) => {
    const current: number = mp.game.invoke('0x0A6DB4965674D243', player.handle);
    if (current !== fireExtinguisherHash) {
        return;
    }

    for (let spot of fireSpots.values()) {
        const nearestPlace = spot.firePlaces
            .filter(place => place.isBurning &&
                systemUtil.distanceToPos(position, place.absolutePosition) < place.radius + ExtinguishingSphereRadius)
            .sort((a, b) => {
                return fireplacesComparerByDistance(a, b, position);
            })
            [0];

        if (!nearestPlace) {
            continue;
        }

        nearestPlace.extinguish();
        return;
    }
});

function fireplacesComparerByDistance(a: FirePlace, b: FirePlace, position: Vector3Mp): number {
    return systemUtil.distanceToPos(position, a.absolutePosition) <=
        systemUtil.distanceToPos(position, b.absolutePosition) ? -1 : 1;
}

CustomEvent.registerServer('firefighter:getMixtureInWeapon', () => {
    return user.currentAmmo;
});

import {CustomEvent} from "../../../custom.event";
import {WEAPON_SNOWBALL, WEAPON_UNARMED} from "../../../../../shared/events/newYear/snowballs.config";

export class Snowballs {
    constructor() {
        mp.events.add('playerWeaponChange', (player, oldWeapon, newWeapon) => {
            CustomEvent.triggerClient(player, 'snowballs:weaponChange', oldWeapon, newWeapon);
        });

        CustomEvent.registerClient('snowballs:give', (player) => this.giveHandle(player));
        CustomEvent.registerClient('snowballs:reset', (player) => this.resetHandle(player));
    }

    giveHandle(player: PlayerMp) {
        player.user.giveWeapon(WEAPON_SNOWBALL, 1, true);
    }

    resetHandle(player: PlayerMp) {
        player.removeAllWeapons();
        player.user.giveWeapon(WEAPON_UNARMED, 1, true);
    }
}
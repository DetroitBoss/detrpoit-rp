import './zombiesController';

import {CustomEvent} from "../../../../custom.event";
import {
    HALLOWEEN_ENTER_PORTAL_EVENT,
    HALLOWEEN_EXIT_PORTAL_EVENT,
    HALLOWEEN_ZOMBIES_DAMAGE
} from "../../../../../../shared/events/halloween.config";
import {disableHalloweenWeather, enableHalloweenWeather} from "../common";

export const ZOMBIES_MOVEMENT_CLIPSET = 'move_heist_lester';

CustomEvent.registerServer(HALLOWEEN_ENTER_PORTAL_EVENT, () => {
    loadZombiesClipSet();
    enableHalloweenWeather(20);
});

CustomEvent.registerServer(HALLOWEEN_EXIT_PORTAL_EVENT, () => {
    disableHalloweenWeather(20);
});

async function loadZombiesClipSet() {
    //mp.game.streaming.requestClipSet(ZOMBIES_MOVEMENT_CLIPSET);
    while (!mp.game.streaming.hasClipSetLoaded(ZOMBIES_MOVEMENT_CLIPSET)) {
        await mp.game.waitAsync(10);
    }
}

mp.events.add('entityStreamIn', (ped: PedMp) => {
    try {
        if (!ped?.getVariable('halloweenZombie')) {
            return;
        }

        drawPedBlood(ped);
    } catch (e) { }
});

function drawPedBlood(ped: PedMp) {
    // applyPedDamagePack
    mp.game.invoke('0x46DF918788CB093F', ped.handle, "BigHitByVehicle", 0.0, 9.0);
    mp.game.invoke('0x46DF918788CB093F', ped.handle, "SCR_Dumpster", 0.0, 9.0);
    mp.game.invoke('0x46DF918788CB093F', ped.handle, "SCR_Torture", 0.0, 9.0);
}

CustomEvent.registerServer('halloween:applyDamageByZombie', () => {
    try {
        if (mp.players.local.health <= 0) {
            return;
        }

        if (mp.players.local.health < HALLOWEEN_ZOMBIES_DAMAGE) {
            mp.players.local.applyDamageTo(mp.players.local.health + 1, true);
        } else {
            mp.players.local.applyDamageTo(HALLOWEEN_ZOMBIES_DAMAGE, true);
        }
    } catch (e) { }
});



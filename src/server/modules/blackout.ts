import {CustomEvent} from "./custom.event";
import {gui} from "./gui";

let blackoutStatus = false;

gui.chat.registerCommand('blackout_start', (player) => {
    if (!player.user || !player.user.isAdminNow(7)) {
        return;
    }

    blackoutStatus = true;
    CustomEvent.triggerClients('blackout:start');
});

gui.chat.registerCommand('blackout_stop', (player) => {
    if (!player.user || !player.user.isAdminNow(7)) {
        return;
    }

    blackoutStatus = false;
    CustomEvent.triggerClients('blackout:set', blackoutStatus);
});

gui.chat.registerCommand('blackout_blink', (player, blinkTimeStr) => {
    if (!player.user || !player.user.isAdminNow(7)) {
        return;
    }

    const blinkTime = parseInt(blinkTimeStr);
    CustomEvent.triggerClients('blackout:blink', blinkTime);
});

mp.events.add('playerReady', (player: PlayerMp) => {
    CustomEvent.triggerClient(player, 'blackout:set', blackoutStatus);
});
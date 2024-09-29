import {CustomEvent} from "./custom.event";

CustomEvent.registerClient('afk:status', (player, val: boolean) => {
    player.user.afk = val;
})
import {CustomEvent} from "../custom.event";

CustomEvent.registerClient('duckWalk:toggle', (player: PlayerMp) => {
    if (!player || !player.user) return;

    if (!player.user.duckWalk) {
        player.setVariable('walkingStyle', 100);
        player.user.duckWalk = true;
    }else{
        player.setVariable('walkingStyle', player.user.entity.walkingStyle ? player.user.entity.walkingStyle : 0);
        player.user.duckWalk = false;
    }
})
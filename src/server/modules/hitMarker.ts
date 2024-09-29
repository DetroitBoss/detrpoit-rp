import {CustomEvent} from "./custom.event";

CustomEvent.registerClient('hitmarker:damage', (player: PlayerMp, targetId: number, damage: number, pos: Vector3Mp) => {
    if (!mp.players.exists(targetId)) return;

    const target = mp.players.at(targetId);

    if (!target.user) return;

    CustomEvent.triggerClient(target, 'hitmarker:add', pos, damage);
})

mp.events.add("playerDeath", (player: PlayerMp, reason: number, killer?: PlayerMp) => {
    if (!killer || !killer.user) return;

    CustomEvent.triggerClient(killer, 'hitmarker:kill', player.position);
})
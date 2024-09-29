import {CustomEvent} from "../custom.event";
import {user} from "../user";
import {playAnimationWithResult} from "../anim";
import {system} from "../system";

let prepareBlip: BlipMp = null;

CustomEvent.registerServer('islandBattle:createPrepareBlip', (pos: Vector3Mp) => {
    if (prepareBlip !== null) return;

    prepareBlip = mp.blips.new(159, pos, {
        color: 1,
        name: "Битва за остров",
        shortRange: true,
        scale: 1.5
    })

    user.setWaypoint(pos.x, pos.y, pos.z);
})

CustomEvent.registerServer('islandBattle:destroyPrepareBlip', () => {
    if (prepareBlip === null) return;
    if (prepareBlip.doesExist()) prepareBlip.destroy();
})

CustomEvent.registerServer('islandBattle:pointStart', (id: number, pos: Vector3Mp, time: number) => {
    const player = mp.players.local;

    playAnimationWithResult(
        ['anim@heists@money_grab@duffel', 'loop'],
        time,
        'Захват точки',
        system.headingToCoord(player.position, pos) + 90
    ).then(status => {
        mp.events.callRemote(`islandBattle:interactResult:${id}`, status);
    })
})
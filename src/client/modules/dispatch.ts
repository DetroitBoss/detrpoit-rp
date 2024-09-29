import {CustomEvent} from "./custom.event"
import {user} from "./user";
import { system } from './system'
import { gui } from './gui'

export const dispatch = {
    call: (faction: number | number[], text: string, pos = true, timeSecond = 120) => {
        CustomEvent.triggerServer('dispatch:call', faction, text, pos, timeSecond);
    }
}

let deathMarker: MarkerMp
CustomEvent.registerServer('markDeath', (pos: [number, number]) => {
    if (!user.login) return;
    if (deathMarker) deathMarker.destroy();
    const z = mp.game.gameplay.getGroundZFor3dCoord(pos[0], pos[1], 99999, 0.0, false)
    deathMarker = mp.markers.new(27, new mp.Vector3(pos[0], pos[1], z), 3,
        {
            color: [128, 128, 128, 255],
            dimension: 0
        })
})
CustomEvent.registerServer('markDeath:destroy', () => {
    if (!user.login) return;
    if (deathMarker) deathMarker.destroy();
})

let send = false;
CustomEvent.register('ten0', () => {
    if(!user.login) return;
    if(!user.is_police) return;
    if(send) return;
    send = true;
    setTimeout(() => {
        send = false;
    }, 5000)
    CustomEvent.triggerServer('dispatch:tencode', 0, false)
});
import {CustomEvent} from "./custom.event"
import {colshapeHandle, colshapes} from './checkpoints';
import {playAnimationWithResult} from './anim';


let isAlreadyPlacingBag = false

let localBlip:BlipMp = null
let localColshape:colshapeHandle = null

CustomEvent.registerServer('boxgame:readyStart', (type, name?, time?) => {
    CustomEvent.triggerCef('hud:gamebox', type, name, time)
})

CustomEvent.registerServer('boxgame:stopBag', () => {
    takeBag()
})

CustomEvent.registerServer('boxgame:takeBag', (pos) => {
    localBlip = mp.blips.new(164, new mp.Vector3(pos.x, pos.y, pos.z),
    {
        name: 'Доставить сумку',
        scale: 0.9,
        color: 1,
        shortRange: false,
        dimension: 0
        });
    
    localColshape = colshapes.new(new mp.Vector3(pos.x, pos.y, pos.z - 1), "Положить сумку", (player) => {
        if (isAlreadyPlacingBag) return;
        isAlreadyPlacingBag = true;
        playAnimationWithResult(['anim@heists@money_grab@duffel', 'loop'], 3, "Сдача сумки").then(isDone => {
            if (!isDone) return;
            takeBag();
            CustomEvent.triggerServer('boxgame:bagEnd')
        })
    }, { radius: 2 })
})

let takeBag = () => {
    localBlip.destroy()
    localBlip = null
    localColshape.destroy()
    localColshape = null
    isAlreadyPlacingBag = false
}
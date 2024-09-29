import {FISH_POS, FISH_PULLING_KEYS, FISHER_LEVEL, IFish} from "../../shared/fish";
import {system} from "./system";
import { playAnimationWithResult, playAnimsEntity } from "./anim";
import {CustomEvent} from "./custom.event";
import {user} from "./user";
import {AttachSystem} from "./attach"

const player = mp.players.local

let IsFishing = false
let BarAnimation = 0
let RunCodeOnly1Time = true
let lastThrowLength = 0

AttachSystem.registerPosition("fishingrod", "prop_fishing_rod_01", 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));

const stopFishing = () => {
    CustomEvent.triggerCef('fish:stats:disable')
    user.stopAnim()
    CustomEvent.triggerServer('fish:cancel')
    AttachSystem.removeLocal('fishingrod')
    lastThrowLength = 0
}

CustomEvent.registerServer('rod:use', (level: FISHER_LEVEL, exp: number, stats: {[p: number]: number}) => {
    if (!inFishPosStatus()) {
        stopFishing()
        user.notify('Вы должны находиться на месте ловли рыбы', 'error')
        return
    }
    AttachSystem.removeLocal('fishingrod')
    AttachSystem.addLocal('fishingrod');

    CustomEvent.callServer('fish:haveAccess', FISH_POS_TARGET).then((cfg: { rod: boolean, license: boolean }) => {
        if (!cfg || !cfg.rod) {
            user.notify('У вас нет удочки в руках', "error")
            stopFishing()
            return
        }
        if (!cfg || !cfg.license) {
            user.notify("В данном месте требуется лицензия для ловли рыбы", "error")
            stopFishing()
            return
        }
        if (typeof inFishPos.h === "number") player.setHeading(inFishPos.h)
        startFishingFunc(FISH_POS_TARGET)
        CustomEvent.triggerCef('fish:stats:enable', level, exp, stats)
    })
})

mp.events.add('fishing:catching:done', async (result: number) => {
    if (result >= 100) {
        user.notify('Вы не успели подсечь леску, рыба сорвалась', 'warning')
        stopFishing()
    } else {
        const fish = await CustomEvent.callServer('fish:catch:start', FISH_POS_TARGET, lastThrowLength) as IFish
        if (!fish) 
            return
        
        CustomEvent.triggerCef('fish:pulling:start', fish, system.randomArrayElement(FISH_PULLING_KEYS))
    }
})

mp.events.add('fishing:pulling:done', (completed: boolean, fishId: number) => {
    user.stopAnim()
    AttachSystem.removeLocal('fishingrod')
    CustomEvent.triggerCef('fish:stats:disable')

    if (completed) {
        CustomEvent.triggerServer('fish:catch:done', fishId)
    } else {
        stopFishing()
    }
})

mp.events.add('fishing:throwing:done', (throwLength: number) => {
    // throwingLength - то как далеко забросил удочку мини-игрой от 0 до 100
    playAnimationWithResult(['amb@world_human_stand_fishing@base', 'base'], system.getRandomInt(5, 15), 'Ожидаем клёва').then(async status => {
        if (status) {
            playAnimsEntity(player, [['amb@world_human_stand_fishing@idle_a', 'idle_c', 1]], false, true)
            CustomEvent.triggerCef('fish:catching:start')
            lastThrowLength = throwLength
        } else {
            stopFishing()
        }
    })
})

const startFishingFunc = async (FISH_POS_TARGET: number) => {
    if (player.vehicle) return;
    if (player.isSwimming()) return;
    IsFishing = true
    RunCodeOnly1Time = true
    BarAnimation = 0
    
    // Забрасываем удочку
    playAnimsEntity(player, [['amb@world_human_stand_fishing@idle_a', 'idle_b', 1]], false, true)
    CustomEvent.triggerCef('fish:throwing:start')
}

FISH_POS.map(item => {
    if (item.blip) {
        item.pos.map(pos => {
            // system.createBlip(item.blip, 1, pos, item.name)
            if (item.r <= 3) {
                mp.markers.new(1, new mp.Vector3(pos.x, pos.y, pos.z), 1, {
                    color: [100, 203, 63, 100],
                    dimension: -1,
                })
            }
        })
        system.createBlip(item.blip, 1, item.pos.length >= 2 ? system.middlePoint3d(...item.pos) : item.pos[0], item.name)
    }
})

let inFishPos: {
    x: number;
    y: number;
    z: number;
    h?: number;
};
let FISH_POS_TARGET: number;

export const inFishPosStatus = () => {
    return !!inFishPos
}

setInterval(() => {
    inFishPos = null;
    FISH_POS_TARGET = 0;
    FISH_POS.map((item, itemid) => {
        if (inFishPos) return;
        let posInd = system.isPointInPointsIndex(player.position, item.pos, item.r)
        if (posInd > -1) {
            inFishPos = item.pos[posInd];
            FISH_POS_TARGET = itemid;
        }
    })
}, 500)
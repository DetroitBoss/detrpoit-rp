import {system} from "./system";
import {CustomEvent} from "./custom.event";
import {user} from "./user";
import {gui, inputOnFocus, phoneOpened} from "./gui";
import {ANIM_LIST, WALKING_STYLES} from "../../shared/anim";
import {interractionMenu} from "./interactions";
import {startDance} from "./dance";
import {hudBar} from "./hudBar";
import {AttachSystem} from "./attach";
import {MINIGAME_TYPE} from "../../shared/minigame";
import {MinigamePlay} from "./minigame";
import {isPlayerCarryOrCarried} from "./carry";

const player = mp.players.local;

if (!mp.storage.data.favouriteAnims) {
    mp.storage.data.favouriteAnims = [];
}

export function loadDictPlayAnim(
    player: PlayerMp, dict: string, name: string,
    speed: number, speedMultiplier: number, duration: number,
    flag: number, playbackRate: number,
    lockX: boolean, lockY: boolean, lockZ: boolean
) {
    while (!mp.game.streaming.hasAnimDictLoaded(dict)) {
        mp.game.streaming.requestAnimDict(dict);
        mp.game.wait(10);
    }

    player.taskPlayAnim(
        dict, name, speed, speedMultiplier, duration, flag, playbackRate, lockX, lockY, lockZ
    );
}

export async function asyncLoadDictPlayAnim(
    player: PlayerMp, dict: string, name: string,
    speed: number, speedMultiplier: number, duration: number,
    flag: number, playbackRate: number,
    lockX: boolean, lockY: boolean, lockZ: boolean
) {
    while (!mp.game.streaming.hasAnimDictLoaded(dict)) {
        mp.game.streaming.requestAnimDict(dict);
        await mp.game.waitAsync(10);
    }

    player.taskPlayAnim(
        dict, name, speed, speedMultiplier, duration, flag, playbackRate, lockX, lockY, lockZ
    );
}

CustomEvent.registerServer('playAnimationWithResult', (task: string | [string, string, boolean?], seconds: number, text: string, heading?:number, minigame?:MINIGAME_TYPE) => {
    return playAnimationWithResult(task, seconds, text, heading, minigame)
})

CustomEvent.registerServer('waitTimer', (distance: number, seconds: number, text: string, anim?: [string, string], trackEntity?: [string, number]) => {
    return waitTimer(distance, seconds, text, anim, trackEntity)
})

export const playAnimationWithResult = (task: string | [string, string, boolean?], seconds: number, text: string, heading?: number, minigame?:MINIGAME_TYPE) => {
    return new Promise((resolve) => {
        const startD = player.dimension
        if(typeof heading === "number") player.setHeading(heading)
        if (typeof task === "string") user.playScenario(task)
        else user.playAnim([[task[0], task[1]]], !!task[2], true);
        let timer = seconds;
        let block = hudBar.timer(text, seconds);
        setTimeout(() => {
            let int = setInterval(async () => {
                timer--;
                if (timer <= 0 || player.dimension !== startD || mp.players.local.getHealth() <= 0 || (typeof task === "string" ? !player.isUsingScenario(task) : !player.isPlayingAnim(task[0], task[1], 3))) {
                    clearInterval(int);
                    if (timer > 0) {
                        user.notify("Вы прервали действие", "error");
                        resolve(false)
                    } else {
                        if(minigame && !(await MinigamePlay(minigame))) resolve(false);
                        else resolve(true)
                    }
                    user.stopAnim();
                    block.destroy();
                }
            }, 1000)
        }, 1000)
    })
}

export const waitTimer = (distance: number, seconds: number, text: string, anim?: [string, string, boolean?], trackEntity?: [string, number]) => {
    return new Promise((resolve) => {
        let oldpos = player.position;
        const pos = () => {
            if(!trackEntity) return oldpos;
            else {
                let ent:EntityMp;
                if(trackEntity[0] === 'vehicle') ent = mp.vehicles.atRemoteId(trackEntity[1])
                else if(trackEntity[0] === 'player') ent = mp.players.atRemoteId(trackEntity[1])
                else if(trackEntity[0] === 'ped') ent = mp.peds.atRemoteId(trackEntity[1])
                else if(trackEntity[0] === 'object') ent = mp.objects.atRemoteId(trackEntity[1])
                if(!ent || !ent.handle) return new mp.Vector3(999999, 999999, 999999)
                return ent.position
            }
        }
        const nearest = () => system.distanceToPos(player.position, pos()) <= distance
        const anims = () => {
            if(!anim) return true
            else return player.isPlayingAnim(anim[0], anim[1], 3);
        }
        if(anim) user.playAnim([[anim[0], anim[1]]], !anim[2], true);
        let timer = seconds;
        let block = hudBar.timer(text, seconds);
        setTimeout(() => {
            let int = setInterval(async () => {
                timer--;
                if (timer <= 0 || !nearest() || !anims()) {
                    clearInterval(int);
                    if (timer > 0) {
                        if(!anims()) user.notify("Вы прервали анимацию", "error");
                        if(!nearest()) user.notify("Вы отошли слишком далеко", "error");
                        resolve(false)
                    } else {
                        resolve(true)
                    }
                    user.stopAnim();
                    block.destroy();
                }
            }, 1000)
        }, 1000)
    })
}

mp.events.add('anim:switchFavourite', (categoryName: string, animName: string) => {
    if (!mp.storage.data.favouriteAnims) mp.storage.data.favouriteAnims = [] as { name: string, category: string }[]
    const index = mp.storage.data.favouriteAnims.findIndex((a: { name: string; }) => a.name == animName)
    if (index === -1)
        mp.storage.data.favouriteAnims.push({ name: animName, category: categoryName})
    else mp.storage.data.favouriteAnims.splice(index, 1);
    CustomEvent.triggerCef('anim:setFavourite', mp.storage.data.favouriteAnims)
})

CustomEvent.register('anim', () => {
    gui.setGui('animations');
    CustomEvent.triggerCef('anim:setFavourite', mp.storage.data.favouriteAnims)
})

mp.events.add('anim:stopPlaying', () => {
    user?.stopAnim();
})
mp.events.add('anim:play', (categoryName: string, animName: string) => {
    if (mp.players.local.isInAnyVehicle(false)
        || user.cuffed
        || isPlayerCarryOrCarried()
    ) return;

    let data = ANIM_LIST[categoryName][animName]
    if (!data) {
        for (let category in ANIM_LIST) {
            for (let name in ANIM_LIST[category]) {
                if (name == animName) {
                    data = ANIM_LIST[category][name];
                    break;
                }
            }
        }
    }
    
    if (!data) return;

    if (typeof data[1] === "string") {
        user.playScenario(data[1]);
    } else {
        user.playAnim(data[1] as any, data[0], data[2]);
    }
})

mp.events.addDataHandler('walkingStyle', async (player: PlayerMp) => {
    if (!player.handle) {
        return;
    }

    await applyWalkingStyle(player);
});

mp.events.add('entityStreamIn', async (player: PlayerMp) => {
    if (!mp.players.exists(player)) {
        return;
    }

    await applyWalkingStyle(player);
});

let duckWalk = false;

setInterval(() => {
    mp.players.forEachInStreamRange((player) => {
        const style = player.getVariable('walkingStyle');
        if (!style || style !== 100) return;

        player.setMovementClipset("move_ped_crouched", 0.25);
        player.setStrafeClipset("move_ped_crouched_strafing");
    })
}, 150)

async function applyWalkingStyle(player: PlayerMp) {
    const styleIndex = player.getVariable('walkingStyle');
    if (styleIndex == null) {
        return;
    }

    if (duckWalk) {
        player.resetMovementClipset(0.0);
        player.resetStrafeClipset();
        duckWalk = false;
    }

    if (styleIndex !== 100) {
        const style = WALKING_STYLES[styleIndex]?.animSet;
        if (!style) {
            player.resetMovementClipset(0.0);
            return;
        }

        if (!mp.game.streaming.hasClipSetLoaded(style)) {
            mp.game.invoke("0x6EA47DAE7FAD0EED", style);

            let i = 0;
            while (i < 500) {
                if (!mp.game.streaming.hasClipSetLoaded(style)) {
                    i++;
                    await mp.game.waitAsync(10);
                } else {
                    break;
                }
            }
        }

        player.setMovementClipset(style, 1.0);
    }else{
        if (!mp.game.streaming.hasClipSetLoaded("move_ped_crouched")) {
            mp.game.invoke("0x6EA47DAE7FAD0EED", "move_ped_crouched");

            let i = 0;
            while (i < 500) {
                if (!mp.game.streaming.hasClipSetLoaded("move_ped_crouched")) {
                    i++;
                    await mp.game.waitAsync(10);
                } else {
                    break;
                }
            }
        }

        if (!mp.game.streaming.hasClipSetLoaded("move_ped_crouched_strafing")) {
            mp.game.invoke("0x6EA47DAE7FAD0EED", "move_ped_crouched_strafing");

            let i = 0;
            while (i < 500) {
                if (!mp.game.streaming.hasClipSetLoaded("move_ped_crouched_strafing")) {
                    i++;
                    await mp.game.waitAsync(10);
                } else {
                    break;
                }
            }
        }

        player.setMovementClipset("move_ped_crouched", 0.25);
        player.setStrafeClipset("move_ped_crouched_strafing");
        duckWalk = true;
    }
}


// CustomEvent.register('anim', () => {
//     animMenu();
// })

// registerHotkey(190, () => {
//     mp.game.invoke('0x277F471BA9DB000B', player.handle, player.position.x, player.position.y, player.position.z, 5.0, 5)
//     // player.taskUseNearestScenarioToCoordWarp(player.position.x, player.position.y, player.position.z, 5.0, 5);
// })

const inspeed = 5.0001
const inspeedNotFirst = 2.0001
const outspeed = -5.0001
const outspeed2 = 2.0001

CustomEvent.registerServer('anim:stop', (id: number) => {
    const target = mp.players.atRemoteId(id);
    if(!target || !target.handle) return;
    target.clearTasks()
})

export let myLastAnimUpper = false;
export const myLastAnimUpperClear = () => {
    myLastAnimUpper = false;
}

export const playAnimsEntity = (entity: PlayerMp | PedMp, seq: [string, string, number?][], upper = false, lopping = false):Promise<boolean> => {

    const exists = () => {
        if (!entity) return false;
        if (entity.type === 'player' && !mp.players.exists(entity as PlayerMp)) return false
        if (entity.type === 'ped' && !mp.peds.exists(entity as PedMp)) return false
        if (!entity.handle) return false
        return true;
    }

    return new Promise(async (resolve:(status: boolean)=>void) => {
        if (!entity) return resolve(false);
        if (!exists()) return resolve(false);
        if (!entity.handle) return resolve(false);
        if (entity.type === 'player' && (entity as PlayerMp).vehicle && !upper) return resolve(false);
        let first = true;
        let flags = 0
        if (upper) flags += 48;
        if(entity.type === 'player' && entity.remoteId === mp.players.local.remoteId) myLastAnimUpper = upper
        if (lopping) flags++;
        for (let index = 0; index < seq.length; index++) {
            if (!exists()) return resolve(false);
            const data = seq[index];
            const dict = data[0];
            const anim = data[1];
            const times = data[2] || 1;
            let countloadDict = 0;
            while (!mp.game.streaming.hasAnimDictLoaded(dict) && countloadDict < 100) {
                mp.game.streaming.requestAnimDict(dict);
                countloadDict++;
                await system.sleep(10);
            }
            if (!exists()) return resolve(false);
            if (mp.game.streaming.hasAnimDictLoaded(dict)){
                if (!exists()) return resolve(false);
                for (let id = 1; id < (times + 1); id++) {
                    if (!exists()) return resolve(false);
                    if(entity.remoteId === mp.players.local.remoteId) myLastAnimUpper = upper
                    entity.taskPlayAnim(dict, anim, first ? inspeed : inspeedNotFirst, (index == (seq.length - 1) && id == times) ? outspeed2 : outspeed, -1, flags, 0, false, false, false);
                    first = false;
                    await system.sleep(10);
                    while (exists() && entity.isPlayingAnim(dict, anim, 3) && entity.getAnimCurrentTime(dict, anim) <= 0.90) {
                        await system.sleep(10);
                    }
                }
                mp.game.streaming.removeAnimDict(dict);
            }
        }
        resolve(true);
    })
}

export const playAnims = (targetID: number, seq: [string, string, number?][], upper = false, lopping = false) => {
    const entity = player.remoteId === targetID ? player : mp.players.atRemoteId(targetID);
    return playAnimsEntity(entity, seq, upper, lopping)
}

CustomEvent.registerServer('playAnim', (targetID: number, seq: [string, string, number?][], upper?: boolean, lopping?: boolean) => {
    playAnims(targetID, seq, upper, lopping);
})


let spamBlock = false;

function spbl() {
    spamBlock = true;
    setTimeout(() => {
        spamBlock = false;
    }, 3000)
}

setInterval(() => {
    if (spamBlock) return;
    if (user.dead) return;
    const player = mp.players.local
    let dictphone = "cellphone@"
    if (player.vehicle) dictphone += "in_car@ds";
    const cuffedAnim = player.isPlayingAnim('mp_arresting', 'idle', 3)
    if (player.getVariable('cuffed') && !cuffedAnim){
        user.playAnim([['mp_arresting', 'idle']], true, true);
        AttachSystem.addLocal('handcuff')
    } else if (!player.getVariable('cuffed') && cuffedAnim){
        user.playAnim([['mp_arresting', 'b_uncuff']], true, false);
        AttachSystem.removeLocal('handcuff')
    }
    if (player.getVariable('call')) return;
    const playphoneanim = inputOnFocus ? player.isPlayingAnim('amb@code_human_wander_texting@male@base', 'static', 3) : player.isPlayingAnim(dictphone, 'cellphone_text_read_base', 3)
    if (phoneOpened) {
        if (!playphoneanim) {
            if (inputOnFocus){
                if (player.isPlayingAnim(dictphone, 'cellphone_text_read_base', 3)){
                    user.playAnim([['amb@code_human_wander_texting@male@base', 'static', 1]], true, true)
                } else {
                    user.playAnim([[dictphone, 'cellphone_text_in', 1], ['amb@code_human_wander_texting@male@base', 'static', 1]], true, true)
                }
            } else {
                if (player.isPlayingAnim('amb@code_human_wander_texting@male@base', 'static', 3)){
                    user.playAnim([[dictphone, 'cellphone_text_read_base', 1]], true, true)
                } else {
                    user.playAnim([[dictphone, 'cellphone_text_in', 1], [dictphone, 'cellphone_text_read_base', 1]], true, true)
                }
            }
            spbl()
        }
    } else if (playphoneanim) {
        user.playAnim([[dictphone, 'cellphone_text_out']], true, false)
        spbl()
    }
}, 500);

mp.game.streaming.requestAnimDict("cellphone@")
mp.game.streaming.requestAnimDict("cellphone@in_car@ds")

mp.events.addDataHandler('call', (entity, status) => {
    if (status) {
        let dict = "cellphone@"
        if (entity.vehicle) dict += "in_car@ds";
        entity.taskPlayAnim(
            dict,
            'cellphone_call_listen_base',
            4.0,
            -1,
            -1,
            50,
            0,
            false,
            false,
            false
        );
    } else {
        let dict = "cellphone@"
        if (entity.vehicle) dict += "in_car@ds";
        entity.taskPlayAnim(
            dict,
            'cellphone_call_out',
            4.0,
            -1,
            -1,
            50,
            0,
            false,
            false,
            false
        );
    }
});

setInterval(() => {
    if (!mp.players.local.getVariable('call')) return;
    let dict = "cellphone@"
    if (mp.players.local.vehicle) dict += "in_car@ds";
    if (!mp.players.local.isPlayingAnim(dict, 'cellphone_call_listen_base', 3)) {
        mp.players.local.taskPlayAnim(
            dict,
            'cellphone_call_listen_base',
            4.0,
            -1,
            -1,
            50,
            0,
            false,
            false,
            false
        );
    }
}, 5000)

mp.events.add('entityStreamIn', (entity: PlayerMp) => {
    if (entity.type != 'player') return;
    if (!entity.getVariable('call')) return;
    let dict = "cellphone@"
    if (entity.vehicle) dict += "in_car@ds";
    entity.taskPlayAnim(
        dict,
        'cellphone_call_listen_base',
        4.0,
        -1,
        -1,
        50,
        0,
        false,
        false,
        false
    );
});


CustomEvent.register('stopanim', () => {
    if (isPlayerCarryOrCarried()) {
        return;
    }

    user.stopAnim()
})
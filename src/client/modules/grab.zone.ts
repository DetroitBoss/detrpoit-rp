import {CustomEvent} from "./custom.event";
import {user} from "./user";
import {system} from "./system";
import {GRAB_C4_SET_TIME, GRAB_POS_LIST} from "../../shared/grab.zone";
import {hudBar} from "./hudBar";
import {MINIGAME_TYPE} from "../../shared/minigame";
import {MinigamePlay} from "./minigame";

const player = mp.players.local;
let exploded = new Map<number, boolean>();

CustomEvent.registerServer('grab:start', (anim: string | [string, string], x: number, y: number, z: number, h: number, minigame?:MINIGAME_TYPE) => {
    return new Promise(async (resolve) => {
        player.taskGoStraightToCoord(x, y, z, 1.0, 30000, h, 0.0)
        let c = 0;
        while (c < 50 && system.distanceToPos2D(player.position, { x, y }) > 0.1) await system.sleep(100);
        if (system.distanceToPos2D(player.position, { x, y }) > 0.1) return resolve(false);
        if (typeof anim === "string") user.playScenario(anim);
        else user.playAnim([anim], false, true)
        await system.sleep(2000);
        let timer = GRAB_C4_SET_TIME;
        let block = hudBar.timer('Сбор денег', timer);
        let int = setInterval(async () => {
            timer--;
            let playAnim = false;
            if (typeof anim === "string") playAnim = player.isUsingScenario(anim)
            else playAnim = player.isPlayingAnim(anim[0], anim[1], 3)
            if (timer <= 0 || !playAnim || system.distanceToPos2D(player.position, { x, y }) > 1.3) {
                if (timer > 0) {
                    user.notify("Вы прервали сбор денег", "error");
                    resolve(false)
                } else {
                    if(minigame && !(await MinigamePlay(minigame))) return resolve(false);
                    resolve(true)
                }
                user.stopAnim();
                block.destroy()
                clearInterval(int);
            }
        }, 1000)
    })
})

CustomEvent.registerServer('grab:explode', (x: number, y: number, z: number, h: number) => {
    return new Promise(async (resolve) => {
        player.taskGoStraightToCoord(x, y, z, 1.0, 30000, h, 0.1)
        let c = 0;
        while (c < 50 && system.distanceToPos2D(player.position, { x, y }) > 1) await system.sleep(100);
        if (system.distanceToPos2D(player.position, { x, y }) > 1) return resolve(false);
        user.playScenario("CODE_HUMAN_MEDIC_TEND_TO_DEAD");
        await system.sleep(2000);
        let timer = GRAB_C4_SET_TIME;
        let block = hudBar.timer('Установка взрывчатки', timer);
        let int = setInterval(() => {
            timer--;
            if (timer <= 0 || !player.isUsingScenario("CODE_HUMAN_MEDIC_TEND_TO_DEAD") || system.distanceToPos2D(player.position, { x, y }) > 1.3) {
                if (timer > 0) {
                    user.notify("Вы прервали установку взрывчатки", "error");
                    resolve(false)
                } else {
                    resolve(true)
                }
                user.stopAnim();
                block.destroy();
                clearInterval(int);
            }
        }, 1000)
    })
})


CustomEvent.registerServer('grab:door:add', (id: number, noexplode = false) => {
    exploded.set(id, true)
    const cfg = GRAB_POS_LIST[id];
    if (!cfg) return;
    if (!cfg.door) return;
    if (mp.game.gameplay.getDistanceBetweenCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, cfg.door.x, cfg.door.y, cfg.door.z, true) > 100) return;
    sync();
    if (noexplode) return;
    mp.game.fire.addExplosion(cfg.door.default_x, cfg.door.default_y, cfg.door.default_z, 2, 20, false, false, 0);
    mp.game.audio.playSoundFromCoord(-1, "Jet_Explosions", cfg.door.default_x, cfg.door.default_y, cfg.door.default_z, "exile_1", false, 0, false);
    mp.game.fire.addExplosion(cfg.door.x, cfg.door.y, cfg.door.z, 2, 20, false, false, 0);
    mp.game.audio.playSoundFromCoord(-1, "Jet_Explosions", cfg.door.x, cfg.door.y, cfg.door.z, "exile_1", false, 0, false);
    const middle = system.middlePoint3d(cfg.door, { x: cfg.door.default_x, y: cfg.door.default_y, z: cfg.door.default_z});
    mp.game.fire.addExplosion(middle.x, middle.y, middle.z, 2, 20, false, false, 0);
    mp.game.audio.playSoundFromCoord(-1, "Jet_Explosions", middle.x, middle.y, middle.z, "exile_1", false, 0, false);
})
CustomEvent.registerServer('grab:door:remove', (id: number) => {
    exploded.delete(id)
    const cfg = GRAB_POS_LIST[id];
    if (!cfg) return;
    if (!cfg.door) return;
    if (mp.game.gameplay.getDistanceBetweenCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, cfg.door.x, cfg.door.y, cfg.door.z, true) > 100) return;
    sync();
})


const sync = () => {
    GRAB_POS_LIST.map((item, id) => {
        const data = item.door;
        if (!data) return;
        const dist = system.distanceToPos(mp.players.local.position, data)
        if (dist > 50) return;
        let hide = exploded.has(id);
        const handle = mp.game.object.getClosestObjectOfType(data.x, data.y, data.z + 1, 10, data.hash, true, true, true);
        if (handle) {
            const pos = mp.game.invokeVector3('0x3FEF770D40960D5A', handle, true);

            if (hide) {
                if (system.distanceToPos(pos, { x: data.hide_x, y: data.hide_y, z: data.hide_z }) > 0.2) mp.game.invoke('0x06843DA7060A026B', handle, data.hide_x, data.hide_y, data.hide_z, true, true, true, false);
            } else {
                if (system.distanceToPos(pos, { x: data.default_x, y: data.default_y, z: data.default_z }) > 0.2) mp.game.invoke('0x06843DA7060A026B', handle, data.default_x, data.default_y, data.default_z, true, true, true, false);
            }
            mp.game.invoke('0x428CA6DBD1094446', handle, true)
        }
    })
}

setInterval(() => {
    sync();
}, 2000)
import {DOORS_LIST} from "../../shared/doors"
import {CustomEvent} from "./custom.event"
import {gui} from "./gui";
import {system} from "./system";
import {user} from "./user";
import {systemUtil} from "../../shared/system";
import { colshapes } from './checkpoints'
import { Raycast } from './raycast'

const player = mp.players.local;
/** Текущий статус двери */
let doorsStatus = new Map<number, boolean>();
let drawText: { id: number, text: string, x: number, y: number, z: number, locked: boolean }[] = []

const doorsRechange = new Map<string, { sourceObj: number, createdObj: number }>();


setInterval(async () => {
    if (doorsStatus.size === 0) {
        return;
    }

    drawText = [];
    DOORS_LIST.map((item, id) => {
        const dist = system.distanceToPos(mp.players.local.position, item.pos)
        if (dist > 30) return;
        const intId = mp.game.interior.getInteriorAtCoords(item.pos.x, item.pos.y, item.pos.z);
        if (intId && !mp.game.interior.isInteriorReady(intId)) return;

        if (dist < 4) {
            drawText.push({
                id,
                text: `${item.text}`,
                locked: getDoorStatus(id),
                x: item.pos.x,
                y: item.pos.y,
                z: item.pos.z
            })
        }

        item.doors.map(async (data, idx) => {
           // const doorId = `DOOR_${id}_${idx}`;

            //const obj = Raycast.getEntityLookAt(3)
            
            // const obj = mp.game.object.getClosestObjectOfType(data.x, data.y, data.z, 3, data.hash, true, true, true)
            //    ?? mp.game.object.getClosestObjectOfType(data.x, data.y, data.z, 3, data.hash, false, true, true);
           // if (!obj) return;

            // const doorRotation = mp.game.invokeVector3(system.natives.GET_ENTITY_ROTATION, obj, 2);
            // //const doorPosition = mp.game.invokeVector3(system.natives.GET_ENTITY_COORDS, obj, true);
            // const doorHash = mp.game.joaat(doorId);
            //
            // if (!doorsRechange.has(doorId)) {
            //     const door = mp.objects.new(data.hash, systemUtil.getVector3Mp(doorPosition), {
            //         alpha: 255,
            //         dimension: 0,
            //         rotation: systemUtil.getVector3Mp(doorRotation)
            //     });
            //
            //     while (!door.handle) {
            //         await mp.game.waitAsync(10);
            //     }
            //
            //     mp.game.invoke(system.natives.FREEZE_ENTITY_POSITION, door.handle, false);
            //     mp.game.invoke(system.natives.SET_ENTITY_DYNAMIC, door.handle, true);
            //     doorsRechange.set(doorId, { sourceObj: obj, createdObj: door.handle })
            //
            //     mp.game.invoke(system.natives.SET_ENTITY_ALPHA, obj, 0, true);
            //     mp.game.invoke(system.natives.SET_ENTITY_VISIBLE, obj, false, false);
            // } else {
            //     const door = doorsRechange.get(doorId);
            //
            //     mp.game.invoke(system.natives.FREEZE_ENTITY_POSITION, door.createdObj, false);
            //     mp.game.invoke(system.natives.SET_ENTITY_DYNAMIC, door.createdObj, true);
            // }
            //
            // if (!mp.game.object.doesDoorExist(doorHash)) {
            //     CustomEvent.triggerServer('srv:log', `add door to door system ${doorHash}`);
            //     mp.game.object.addDoorToSystem(doorHash, data.hash, doorPosition.x, doorPosition.y, doorPosition.z, false, false, false);
            // }


            const locked = getDoorStatus(id);
            //CustomEvent.triggerServer('srv:log', `check door ${data.hash} ${locked}`);

            //if (door.heading > -0.15 && door.heading < 0.15) mp.game.invoke('0x428CA6DBD1094446', obj, locked)
            mp.game.object.doorControl(data.hash, data.x, data.y, data.z, locked, 0.0, 0.0, 0.0)
        })
    })
}, 1000)

mp.events.add('render', () => {
    drawText.map(item => gui.drawText3D(`${item.text} (${item.locked ? '~r~Закрыто' : '~g~Открыто'})`, item.x, item.y, item.z, null, true))
})

/** true - закрыта, false - открыта */
export const getDoorStatus = (id: number) => {
    return doorsStatus.get(id);
}
export const setDoorStatus = (
    id: number,
    /** true - закрыта, false - открыта */
    status: boolean,
    /** Игнорировать доступ */
    ignoreAccess = false
) => {
    CustomEvent.triggerServer("door:status", id, status, ignoreAccess);
}
export const getDoorData = (id: number) => {
    return DOORS_LIST[id]
}

CustomEvent.registerServer('doors:data', (list: [number, boolean][]) => {
    list.map(q => {
        doorsStatus.set(q[0], q[1]);
    })
})

export const doorEvent = () => {
    const door = drawText.find(q => system.distanceToPos(player.position, q) < 2)
    if (!door) return false;
    clickDoor(door.id);
    return true;
}
/** Можем ли мы сейчас использовать двери */
export const doorEventHave = () => {
    const door = drawText.find(q => system.distanceToPos(player.position, q) < 2)
    if (!door) return null;
    return door.text;
}

const clickDoor = async (id: number) => {
    let data = getDoorData(id);

    if (!user.isAdminNow() && user.fraction != data.fraction)
        return user.notify("У вас нет ключей", "error");

    if (!await CustomEvent.callServer('fraction:haveDoorRights'))
        return user.notify("У вас нет доступа", "error");

    if (player.dimension)
        return user.notify("Сейчас нельзя закрывать двери", "error");

    player.taskGoStraightToCoord(data.pos.x, data.pos.y, data.pos.z, 1.0, 10000,
        mp.game.gameplay.getHeadingFromVector2d(player.position.x - data.pos.x, player.position.y - data.pos.y) + 180,
        0.6);

    let c = 0;
    while (c < 100 && system.distanceToPos2D(player.position, data.pos) > 0.6) {
        await system.sleep(10)
        c++;
    }

    if (system.distanceToPos2D(player.position, data.pos) > 0.8)
        return;

    user.playAnim([['mp_common', 'givetake2_a']], false, false).then(() => {
        setDoorStatus(id, !getDoorStatus(id))
    });
}
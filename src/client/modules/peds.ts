import {system} from "./system";

let scaredlib = "amb@code_human_cower_stand@male@react_cowering", scaredanim = "base_right"

mp.events.addDataHandler("grabScared", async (entity: PedMp, value: number) => {
    if (entity.type != "ped") return;
    if (value) scareAnim(entity);
    else stopAnim(entity);
});

mp.events.addDataHandler("cowGrease", async (entity: PedMp) => {
    if (entity.type != "ped") return;
    mp.game.streaming.requestAnimDict('amb@lo_res_idles@')
    while (!mp.game.streaming.hasAnimDictLoaded('amb@lo_res_idles@')) await system.sleep(100);
    mp.game.invoke('0xEA47FE3719165B94', entity.handle, 'amb@lo_res_idles@', 'creatures_world_cow_grazing_lo_res_base', 2.0001, 2.0001, -1, 1, 0, 0, 0, 0)
    setTimeout(() => {
        mp.game.invoke('0xE1EF3C1216AFF2CD', entity.handle);
    }, 3000)
});

mp.events.addDataHandler("pedHi", (entity: PedMp) => {
    if (entity.type != "ped") return;
    mp.game.invoke("0x8E04FEDD28D42462", entity.handle, "Generic_Hi", "Speech_Params_Force", 0);
});

mp.events.add('entityStreamIn', (entity: PedMp) => {
    if (entity.type != "ped") return;
    if (entity.getVariable('grabScared')) scareAnim(entity);
    else stopAnim(entity);
});


const stopAnim = (ped: PedMp) => {
    mp.game.invoke('0xE1EF3C1216AFF2CD', ped.handle);
}
const scareAnim = async (ped: PedMp) => {
    mp.game.streaming.requestAnimDict(scaredlib)
    while (!mp.game.streaming.hasAnimDictLoaded(scaredlib)) await system.sleep(100);
    mp.game.invoke('0xEA47FE3719165B94', ped.handle, scaredlib, scaredanim, 2.0001, 2.0001, -1, 1, 0, 0, 0, 0)
}

export const taskGoCoord = (ped: PedMp, pos: Vector3Mp, heading: number = 0) => {
    const seqId = [228];
    mp.game.invoke(system.natives.OPEN_SEQUENCE_TASK, seqId);
    mp.game.invoke(system.natives.TASK_GO_STRAIGHT_TO_COORD, 0, pos.x, pos.y, pos.z, 1.0, -1, heading + 0.001, 0.05);
    mp.game.invoke(system.natives.CLOSE_SEQUENCE_TASK, seqId[0]);
    mp.game.invoke(system.natives.TASK_PERFORM_SEQUENCE, ped.handle, seqId[0]);
    mp.game.invoke(system.natives.CLEAR_SEQUENCE_TASK, seqId);
}
export const taskGoCoords = (ped: PedMp, poss: {x: number, y: number, z: number, h?: number}[]) => {
    const seqId = [228];
    mp.game.invoke(system.natives.OPEN_SEQUENCE_TASK, seqId);
    poss.map(pos => {
        mp.game.invoke(system.natives.TASK_GO_STRAIGHT_TO_COORD, 0, pos.x, pos.y, pos.z, 1.0, -1, (pos.h || 0) + 0.001, 0.05);
    })
    mp.game.invoke(system.natives.CLOSE_SEQUENCE_TASK, seqId[0]);
    mp.game.invoke(system.natives.TASK_PERFORM_SEQUENCE, ped.handle, seqId[0]);
    mp.game.invoke(system.natives.CLEAR_SEQUENCE_TASK, seqId);
}

export const taskRoutePlay = (ped: PedMp, pos: [number, number, number][], patrolName: string, scenario: string) => {
    // OpenPatrol
    mp.game.invoke('0x7767DD9D65E91319', patrolName);
    mp.game.invoke('0xA36BFB5EE89F3D82', patrolName);

    // ADD_PATROL_ROUTE_NODE
    pos.map((item, i) => {
        let next = i === (pos.length - 1) ? pos[0] : pos[i + 1];
        mp.game.invoke('0x8EDF950167586B7C', i, scenario, ...item, ...next, mp.game.gameplay.getRandomIntInRange(5000, 10000))
    })
    // ADD_PATROL_ROUTE_LINK
    pos.map((item, i) => {
        let next = i === (pos.length - 1) ? 0 : i + 1;
        mp.game.invoke('0x23083260DEC3A551', i, next);
    })
    // closePatrolRoute
    mp.game.invoke('0xB043ECA801B8CBC1');
    // createPatrolRoute
    mp.game.invoke('0xAF8A443CCC8018DC');
    //TaskPatrol
    mp.game.invoke('0xBDA5DF49D080FE4E', ped.handle, patrolName, 1.0, true, true);
}


export const isPedMy = (ped: PedMp) => {
    return ped.controller?.remoteId === mp.players.local.remoteId
}
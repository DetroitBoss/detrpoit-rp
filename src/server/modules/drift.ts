import {colshapes} from "./checkpoints";
import {DRIFT_MAP_ENTER, DRIFT_MAP_EXIT} from "../../shared/drift";
import {system} from "./system";
import {CustomEvent} from "./custom.event";
import {SocketSyncWeb} from "./socket.sync.web";
import {UserEntity} from "./typeorm/entities/user";
import {Between, FindConditions, In, Like, MoreThan} from "typeorm";
import {saveEntity} from "./typeorm";
let driftDimension:number;

let todayBestDriftScore = new Map<number, {name: string, score: number}>();
let lastDriftScore = new Map<number, number>();

setTimeout(() => {

    driftDimension = system.personalDimension

    colshapes.new(new mp.Vector3(DRIFT_MAP_ENTER.x, DRIFT_MAP_ENTER.y, DRIFT_MAP_ENTER.z), 'Выход', player => {
        player.user.teleportVeh(DRIFT_MAP_EXIT.x, DRIFT_MAP_EXIT.y, DRIFT_MAP_EXIT.z + 1, DRIFT_MAP_EXIT.h, 0)
        if(player.vehicle){
            player.vehicle.getOccupants().map(target => {
                CustomEvent.triggerClient(player, 'driftmap', false)
            })
        } else {
            CustomEvent.triggerClient(player, 'driftmap', false)
        }
        // setTimeout(() => SocketSyncWeb.fire('drift:hud', JSON.stringify(getDriftHudData())), system.TELEPORT_TIME * 2)
    }, {
        drawStaticName: "scaleform",
        color: [224, 122, 4, 120],
        dimension: -1,
        // type: 27,
        radius: 3
    })

    colshapes.new(new mp.Vector3(DRIFT_MAP_EXIT.x, DRIFT_MAP_EXIT.y, DRIFT_MAP_EXIT.z), 'Ebisu Minami', player => {
        player.user.teleportVeh(DRIFT_MAP_ENTER.x, DRIFT_MAP_ENTER.y, DRIFT_MAP_ENTER.z + 1, DRIFT_MAP_ENTER.h, driftDimension)
        if(player.vehicle){
            player.vehicle.getOccupants().map(target => {
                CustomEvent.triggerClient(player, 'driftmap', true)
            })
        } else {
            CustomEvent.triggerClient(player, 'driftmap', true)
        }
        setTimeout(() => reloadHud(), system.TELEPORT_TIME * 2)
    }, {
        color: [224, 122, 4, 120],
        drawStaticName: "scaleform",
        type: 27,
        radius: 3
    })
}, 5000)



let top3Score:[string, number][] = [];

const reloadHud = () => {
    let today = system.sortArrayObjects([...todayBestDriftScore].map(q => q[1]), [
        {id: "score", type: "DESC"}
    ])
    today.splice(5);
    SocketSyncWeb.getfire('drift:hud').map(player => {
        const user = player.user;
        let my = [todayBestDriftScore.has(user.id) ? todayBestDriftScore.get(user.id).score : 0, user.entity.drift_best];
        let res = {my, today, alltime: top3Score}
        SocketSyncWeb.fireTarget(player, 'drift:hud', JSON.stringify(res))
    })
}

export const loadTop3Drifters = () => {
    return new Promise((resolve) => {
        UserEntity.find({
            where: {
                drift_best: MoreThan(5000)
            },
            take: 5,
            order: {drift_best: "DESC"}
        }).then(list => {
            top3Score = [];
            list.map(q => {
                top3Score.push([q.rp_name, q.drift_best])
            })
            reloadHud();
            resolve(null);
        })
    })
}

CustomEvent.registerClient('drift:fall', player => {
    player.user.teleportVeh(DRIFT_MAP_ENTER.x, DRIFT_MAP_ENTER.y, DRIFT_MAP_ENTER.z + 1, DRIFT_MAP_ENTER.h, driftDimension)
})

CustomEvent.registerClient('drift:score', (player, score: number) => {
    const user = player.user;
    if(!user) return;
    if(!todayBestDriftScore.has(user.id) || todayBestDriftScore.get(user.id).score < score) {
        if(todayBestDriftScore.has(user.id) && todayBestDriftScore.get(user.id).score > 5000) player.outputChatBox(`Вы установили новый сегодняшний рекорд. Прошлый рекорд ${todayBestDriftScore.get(user.id).score}, новый ${score}`)
        todayBestDriftScore.set(user.id, {name: user.name, score});
    }
    lastDriftScore.set(user.id, score);
    user.achiev.achievTickByType('driftPoints', score);
    if(user.entity.drift_best < score) {
        if(user.entity.drift_best > 5000) player.outputChatBox(`Вы установили новый лучший рекорд. Прошлый рекорд ${user.entity.drift_best}, новый ${score}`)
        user.entity.drift_best = score
        saveEntity(user.entity).then(() => {
            loadTop3Drifters();
        });
    } else reloadHud()
})

mp.events.add('playerDeath', (player, reason?: number, killer?: PlayerMp) => {
    const user = player.user;
    if(!user) return;
    if(player.dimension !== driftDimension) return;
    user.health = 100;
    player.user.teleport(DRIFT_MAP_EXIT.x, DRIFT_MAP_EXIT.y, DRIFT_MAP_EXIT.z + 1, DRIFT_MAP_EXIT.h, 0)
    CustomEvent.triggerClient(player, 'driftmap', false)
})
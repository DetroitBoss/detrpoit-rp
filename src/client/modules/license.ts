import {CustomEvent} from "./custom.event";
import {LICENCE_CENTER_LIST, licenseShootTimer} from "../../shared/licence";
import {system} from "./system";
import {user} from "./user";
import {TextTimerBar} from "./bars/classes/TextTimerBar";
import {CheckpointTimerBar} from "./bars/classes/CheckpointTimerBar";

const player = mp.players.local;

LICENCE_CENTER_LIST.map(item => {
    if(item.icon) system.createBlip(item.icon, 1, new mp.Vector3(item.point.x, item.point.y, item.point.z), item.name, 0)
})

const checkSize = 5;


CustomEvent.registerServer('autoschool:practice', async (exam: number, lic: number, vehicleid: number) => {

    const resolve = (status: boolean) => {
        CustomEvent.triggerServer('autoschool:practice:result', status);
    }
    let cdexitVeh = 30;
    const cfg = LICENCE_CENTER_LIST[exam];


    let end = false;

    let player = mp.players.local;
    let checkpoints = [...cfg.points]
    let check: CheckpointMp;
    let blip: BlipMp;
    let currentCheckID = 0;
    let checkBlip = 2;
    let checkBlipFinish = 4;
    user.notify("Приступайте к выполнению");
    let mapTimeBar:TextTimerBar;
    let interval = setInterval(() => {
        if (end) {
            cdexitVeh = 30
            clearInterval(interval)
            if (mapTimeBar) mapTimeBar.destroy();
        } else if (mp.players.local.vehicle && mp.players.local.vehicle.remoteId == vehicleid) {
            cdexitVeh = 30;
            if (mapTimeBar) mapTimeBar.hidden = true;
        } else {
            cdexitVeh--
            if (mapTimeBar && mapTimeBar.exists) {
                mapTimeBar.hidden = false;
                mapTimeBar.text = system.secondsToString((cdexitVeh + 1))
            } else {
                mapTimeBar = new TextTimerBar("Вернитесь в учебный ТС", system.secondsToString((cdexitVeh + 1)));
            }
            if (cdexitVeh == 0) {
                resolve(false)
                end = true;
                if (mapTimeBar && mapTimeBar.exists) {
                    mapTimeBar.destroy()
                }
                clearInterval(interval);
            }
        }
    }, 1000)
    while (!end) {
        let checkdata = {
            x: system.parseFloat(checkpoints[currentCheckID].x),
            y: system.parseFloat(checkpoints[currentCheckID].y),
            z: system.parseFloat(checkpoints[currentCheckID].z),
        }
        let checkdataNext = {
            x: system.parseFloat(checkpoints[currentCheckID].x),
            y: system.parseFloat(checkpoints[currentCheckID].y),
            z: system.parseFloat(checkpoints[currentCheckID].z),
        }
        if (currentCheckID != (checkpoints.length - 1)) {
            checkdataNext = {
                x: system.parseFloat(checkpoints[currentCheckID + 1].x),
                y: system.parseFloat(checkpoints[currentCheckID + 1].y),
                z: system.parseFloat(checkpoints[currentCheckID + 1].z),
            }
        }
        check = mp.checkpoints.new(currentCheckID == (checkpoints.length - 1) ? checkBlipFinish : checkBlip, new mp.Vector3(checkdata.x, checkdata.y, checkdata.z - 1), checkSize + 0.0001, {
            direction: (currentCheckID == (checkpoints.length - 1)) ? new mp.Vector3(0, 0, 75) : new mp.Vector3(checkdataNext.x, checkdataNext.y, checkdataNext.z),
            color: [255, 255, 0, 60],
            visible: true,
            dimension: player.dimension
        });
        blip = mp.blips.new((currentCheckID == (checkpoints.length - 1)) ? 611 : 1, new mp.Vector3(checkdata.x, checkdata.y, checkdata.z), {
            name: (!checkdataNext) ? 'Финишная точка' : 'Контрольная точка',
            color: 5,
            shortRange: false,
            dimension: player.dimension
        });
        blip.setRoute(true);

        let reached = false;

        while (!reached) {
            let distance = mp.game.gameplay.getDistanceBetweenCoords(checkdata.x, checkdata.y, checkdata.z, player.position.x, player.position.y, player.position.z, false);
            if (distance < (checkSize + 0.8)) {
                if (player.vehicle && player.vehicle.remoteId == vehicleid) {
                    reached = true;
                    mp.game.audio.playSound(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", false, 0, true);
                } else {
                    await system.sleep(10)
                }
            } else {
                await system.sleep(10)
            }
            if (end) {
                if (blip) blip.destroy(), blip = null;
                if (check) check.destroy(), check = null;
                reached = true;
            }
        }
        if (blip) blip.destroy(), blip = null;
        if (check) check.destroy(), check = null;
        if (currentCheckID == (checkpoints.length - 1)) {
            end = true
            if (mapTimeBar && mapTimeBar.exists) {
                mapTimeBar.destroy()
            }
            resolve(true);
        } else {
            currentCheckID++;
        }
    }

})

let objectsShoot:[ObjectMp, BlipMp, number][] = [];
const clearObjects = () => {
    objectsShoot.map(item => {
        if(item){
            if (mp.objects.exists(item[0])) item[0].destroy();
            if (mp.blips.exists(item[1])) item[1].destroy();
        }
    })
    objectsShoot = []
}
const shootTargets = ['gr_prop_gr_target_05b', 'gr_prop_gr_target_02b'];

let CheckpointBar: CheckpointTimerBar;
let checkPointCnt = 0;
CustomEvent.registerServer('license:gun', async (examindex: number, licindex: number, weapon: string) => {
    clearObjects();
    await system.sleep(1000);
    const cfg = LICENCE_CENTER_LIST[examindex];
    if(!cfg) return;
    const cfgLic = LICENCE_CENTER_LIST[examindex].license[licindex];
    if (!cfgLic) return;
    const points = [...cfg.points]
    player.freezePosition(true);
    player.setHeading(cfg.start.h);
    player.setCoords(cfg.start.x, cfg.start.y, cfg.start.z - 1, true, true, true, true);
    mp.game.cam.setGameplayCamRelativeHeading(0);
    let timer = parseInt(`${licenseShootTimer}`);
    user.notify("Для успешной сдачи практической части экзамена приготовьтесь за " + timer+" секунд отстрелять все мишени", "success", "DIA_TARGET", 5000)
    points.map(item => {
        const pos = new mp.Vector3(item.x, item.y, item.z)
        setTimeout(() => {
            const obj = mp.objects.new(mp.game.joaat(system.randomArrayElement(shootTargets)), pos, {
                dimension: player.dimension,
                rotation: new mp.Vector3(0,0,item.h)
            });
            setTimeout(() => {
                objectsShoot.push([obj, system.createBlip(119, 1, pos, "Мишень", player.dimension, false), obj.handle]);
            }, 100)
        }, 10)

    })
    await system.sleep(1000);
    let end = false;
    mp.game.invoke('0x3EDCB0505123623B', player.handle, true, mp.game.joaat(weapon))
    player.freezePosition(false);
    const mapTimeBar = new TextTimerBar("Стрельба по мишеням", system.secondsToString(timer));
    CheckpointBar = new CheckpointTimerBar("Мишени", points.length);
    checkPointCnt = 0;
    while(!end){
        if (timer <= 0 || objectsShoot.length === 0) end = true;
        else {
            mapTimeBar.text = system.secondsToString(timer)
            await system.sleep(1000);
            timer--;
        }
    }
    mapTimeBar.destroy();
    CheckpointBar.destroy();
    CheckpointBar = null;
    CustomEvent.triggerServer("licese:weapon:result", objectsShoot.length === 0)
    clearObjects();
})

mp.events.add('playerWeaponShot', (targetPosition: Vector3Mp) => {
    if (objectsShoot.length === 0) return;
    const cast = mp.raycasting.testPointToPoint(player.position, targetPosition, [player.handle], [2, 4, 8, 16])
    if(!cast) return;
    if(!cast.entity) return;
    let index = objectsShoot.findIndex(q => q[0].id === (cast.entity as EntityMp).id);
    if(index === -1) return
    if (CheckpointBar && CheckpointBar.exists){
        CheckpointBar.setCheckpointState(checkPointCnt, CheckpointTimerBar.state.completed)
        checkPointCnt++;
    }
    if (mp.objects.exists(objectsShoot[index][0])) objectsShoot[index][0].destroy();
    if (mp.blips.exists(objectsShoot[index][1])) objectsShoot[index][1].destroy();
    objectsShoot.splice(index, 1);
});
import {CustomEvent} from "./custom.event";
import {system} from "./system";
import {LIMIT_CHECKPOINTS, MAX_RACERS, RACE_TYPE} from "../../shared/race";
import {user} from "./user";
import {TextTimerBar} from "./bars/classes/TextTimerBar";
import {CheckpointTimerBar} from "./bars/classes/CheckpointTimerBar";
import {discord} from "./discord";

const player = mp.players.local;
let raceEditLabels:TextLabelMp[] = []
let raceEditMarkers:MarkerMp[] = []
let raceEditBlips:BlipMp[] = []
let raceEditName: string;
let raceEditId: number;
let raceEditCars: string[] = [];
let raceEditVeh: VehicleMp;
let raceEditType: RACE_TYPE;
let raceEditPos: {
    x: number;
    y: number;
    z: number;
    h: number;
}[];
let raceEditStarts: {
    x: number;
    y: number;
    z: number;
    h: number;
}[];

CustomEvent.registerServer('race:editmap', (id: number, name: string, pos: {
    x: number;
    y: number;
    z: number;
    h: number;
}[], starts: {
    x: number;
    y: number;
    z: number;
    h: number;
    }[], type: RACE_TYPE, cars: string[]) => {
    raceEditId = id;
    raceEditName = name;
    raceEditPos = pos;
    raceEditStarts = starts;
    raceEditType = type;
    raceEditCars = cars;

    reloadTestMarkers();
})


mp.events.add('raceedit:spawnCar', (car: string) => {
    if (raceEditVeh && mp.vehicles.exists(raceEditVeh)) raceEditVeh.destroy();
    raceEditVeh = mp.vehicles.new(mp.game.joaat(car), player.position, {
        heading: player.getHeading(),
        dimension: player.dimension
    })
    raceEditVeh.autosalon = true
    setTimeout(() => {
        player.setIntoVehicle(raceEditVeh.handle, -1);
    }, 100)
})
mp.events.add('raceedit:newSpawn', () => {
    if (raceEditStarts.length >= MAX_RACERS) return user.notify(`Лимит точек спавна - ${MAX_RACERS}`, 'error')
    let pos = player.vehicle ? player.vehicle.position : player.position
    let heading = player.vehicle ? player.vehicle.getHeading() : player.getHeading()
    let item = {
        x: parseFloat((pos.x).toFixed(1)), y: parseFloat((pos.y).toFixed(1)), z: parseFloat((pos.z).toFixed(1)), h: heading
    }
    raceEditStarts.push(item);
    reloadTestMarkers();
})
mp.events.add('raceedit:newCheck', () => {
    if (raceEditPos.length >= LIMIT_CHECKPOINTS) return user.notify(`Лимит чекпоинтов - ${LIMIT_CHECKPOINTS}`, 'error')
    let pos = player.vehicle ? player.vehicle.position : player.position
    let heading = player.vehicle ? player.vehicle.getHeading() : player.getHeading()
    let item = {
        x: parseFloat((pos.x).toFixed(1)), y: parseFloat((pos.y).toFixed(1)), z: parseFloat((pos.z).toFixed(1)), h: heading
    }
    raceEditPos.push(item);
    reloadTestMarkers();
})
mp.events.add('raceedit:changeType', () => {
    raceEditType = raceEditType === "circle" ? "line" : "circle"
})
mp.events.add('raceedit:spawnDel', (id: number) => {
    raceEditStarts.splice(id, 1)
    reloadTestMarkers();
})
mp.events.add('raceedit:checkDel', (id: number) => {
    raceEditPos.splice(id, 1)
    reloadTestMarkers();
})
mp.events.add('raceedit:spawnTp', (id: number) => {
    const ent = player.vehicle ? player.vehicle : player;
    const crd = raceEditStarts[id];
    if(!crd) return;
    ent.setCoords(crd.x, crd.y, crd.z, true, true, true, false)
})
mp.events.add('raceedit:checkTp', (id: number) => {
    const ent = player.vehicle ? player.vehicle : player;
    const crd = raceEditPos[id];
    if (!crd) return;
    ent.setCoords(crd.x, crd.y, crd.z, true, true, true, false)
})

mp.events.add('raceedit:save', (status: boolean) => {
    exitEdit(status)
})

const exitEdit = (status: boolean) => {
    clearTestMarkers();
    if (raceEditVeh && mp.vehicles.exists(raceEditVeh)) raceEditVeh.destroy();
    raceEditVeh = null;
    if (!status) {
        raceEditId = null;
        return CustomEvent.triggerServer('raceedit:exit');
    }
    CustomEvent.triggerServer('raceedit:save', raceEditId, raceEditPos, raceEditStarts, raceEditType)
    raceEditId = null;
}

mp.events.add('playerDeath', () => {
    if(!raceEditId) return;
    CustomEvent.triggerCef('raceedit:close')
    exitEdit(false)
})

const clearTestMarkers = () => {
    raceEditLabels.map(item => {
        if (mp.labels.exists(item)) item.destroy();
    })
    raceEditLabels = [];
    raceEditMarkers.map(item => {
        if (mp.markers.exists(item)) item.destroy();
    })
    raceEditMarkers = [];
    raceEditBlips.map(item => {
        if (mp.blips.exists(item)) item.destroy();
    })
    raceEditBlips = [];
}

const reloadTestMarkers = () => {

    clearTestMarkers();

    raceEditStarts.map((item, index) => {
        raceEditLabels.push(mp.labels.new(`Стартовая позиция #${index}`, new mp.Vector3(item.x, item.y, item.z), {
            dimension: player.dimension
        }))
        raceEditMarkers.push(mp.markers.new(1, new mp.Vector3(item.x, item.y, item.z), 2, {
            color: [255, 0, 0, 50],
            dimension: player.dimension
        }))
        raceEditBlips.push(system.createBlip(435, 1, new mp.Vector3(item.x, item.y, item.z), `Стартовая позиция ${index}`, player.dimension))
    })
    raceEditPos.map((item, index) => {
        raceEditLabels.push(mp.labels.new(index === (raceEditPos.length - 1) ? `Финальный чекпоинт ${index}` : `Чекпоинт ${index}`, new mp.Vector3(item.x, item.y, item.z), {
            dimension: player.dimension
        }))
        raceEditMarkers.push(mp.markers.new(1, new mp.Vector3(item.x, item.y, item.z), 2, {
            color: [0, 255, 0, 50],
            dimension: player.dimension
        }))
        raceEditBlips.push(system.createBlip(index === (raceEditPos.length - 1) ? 38 : 1, 2, new mp.Vector3(item.x, item.y, item.z), index === (raceEditPos.length - 1) ?  `Финальный чекпоинт ${index}` : `Чекпоинт ${index}`, player.dimension))
    })
    CustomEvent.triggerCef('raceedit:open', raceEditId, raceEditName, raceEditPos.length, raceEditStarts.length, raceEditType, raceEditCars);
}

let raceCarId: number;
let racePoints: {x: number, y: number, z: number, h: number}[] = []
let raceLaps: number;

CustomEvent.registerServer("race:load", (carId: number, points: { x: number, y: number, z: number, h: number }[], laps: number) => {
    raceCarId = carId;
    racePoints = points;
    raceLaps = laps;
})

let checkpointBar: CheckpointTimerBar;
CustomEvent.registerServer('race:starttimer', async () => {
    // Set up checkpoint bar

    checkpointBar = new CheckpointTimerBar("Обратный отсчёт", 4);
    checkpointBar.color = 18; // HUD_COLOUR_GREEN, or [114, 204, 114, 255]
    for (let i = 0; i < 3; i++) {
        mp.game.audio.playSoundFrontend(-1, "RACE_PLACED", "HUD_AWARDS", true)
        checkpointBar.setCheckpointState(i, CheckpointTimerBar.state.failed);
        await system.sleep(1000);
    }
})

CustomEvent.registerServer("race:start", () => {
    user.disableAllControlsSystem(false);
    if (checkpointBar && checkpointBar.exists){
        checkpointBar.setAllCheckpointsState(CheckpointTimerBar.state.completed);
        setTimeout(() => {
            if (checkpointBar && checkpointBar.exists){
                checkpointBar.destroy();
                checkpointBar = null;
            }
        }, 2000)
    }
    discord.status = "В гонке"
    drivePoints(raceCarId, racePoints, raceLaps).then(status => {
        CustomEvent.triggerServer('race:end', status);
        discord.status = null
    })
})
CustomEvent.registerServer("race:test", (model: string, pos: {
    x: number;
    y: number;
    z: number;
    h: number;
}[], start: {
    x: number;
    y: number;
    z: number;
    h: number;
}, laps: number) => {
    player.setCoords(start.x, start.y, start.z, true, true, true, false)
    if (raceEditVeh && mp.vehicles.exists(raceEditVeh)) raceEditVeh.destroy();
    raceEditVeh = mp.vehicles.new(mp.game.joaat(model), new mp.Vector3(start.x, start.y, start.z), {
        heading: start.h,
        dimension: player.dimension
    })
    raceEditVeh.autosalon = true
    setTimeout(() => {
        player.setIntoVehicle(raceEditVeh.handle, -1);
        user.disableAllControlsSystem(false);
    }, 1000)
    drivePoints(raceEditVeh.remoteId, pos, laps).then(res => {
        if (raceEditVeh && mp.vehicles.exists(raceEditVeh)) raceEditVeh.destroy();
        raceEditVeh = null;
        CustomEvent.triggerServer('raceedit:exit')
    })
})

export const drivePoints = (
    /** RemoteID транспорта, на котором мы должны передвигатся */
    vehicleid: number,
    /** Массив точек, через которые нужно проехать */
    checkpoints: {x: number, y: number, z: number, h: number}[],
    /** Количество кругов */
    laps = 1,
    /** Размер чекпоинта */
    checkSize = 4
):Promise<boolean> => {
    return new Promise(async (resolve) => {
        const allChecksCount = checkpoints.length * laps;
        let checkBar = 1;
        let bar = new TextTimerBar('Чекпоинт', checkBar+'/' + allChecksCount);
        let cdexitVeh = 10;
        let end = false;

        let player = mp.players.local;
        let check: CheckpointMp;
        let blip: BlipMp;
        let currentCheckID = 0;
        let checkBlip = 2;
        let checkBlipFinish = 4;
        let mapTimeBar: TextTimerBar;
        let mapLapBar: TextTimerBar;

        const clear = () => {
            if (bar && bar.exists) bar.destroy();
            if (mapTimeBar && mapTimeBar.exists) mapTimeBar.destroy();
            if (mapLapBar && mapLapBar.exists) mapLapBar.destroy();
        }

        if(laps > 1){
            mapLapBar = new TextTimerBar("Осталось кругов", laps.toString());
        }
        let interval = setInterval(() => {
            if (end) {
                cdexitVeh = 10
                clearInterval(interval)
            } else if (mp.players.local.vehicle && mp.players.local.vehicle.remoteId == vehicleid) {
                if (cdexitVeh != 10 && mapTimeBar && mapTimeBar.exists) mapTimeBar.destroy();
                cdexitVeh = 10;
            } else {
                cdexitVeh--
                if (mapTimeBar && mapTimeBar.exists){
                    mapTimeBar.text = system.secondsToString((cdexitVeh + 1))
                } else {
                    mapTimeBar = new TextTimerBar("Вернитесь в ТС", system.secondsToString((cdexitVeh + 1)));
                }
                if (cdexitVeh == 0) {
                    if (bar) bar.destroy();
                    resolve(false)
                    end = true;
                    clearInterval(interval);
                    clear()
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
            check = mp.checkpoints.new(currentCheckID == (checkpoints.length - 1) && laps == 1 ? checkBlipFinish : checkBlip, new mp.Vector3(checkdata.x, checkdata.y, checkdata.z - 1), checkSize + 0.0001, {
                direction: (currentCheckID == (checkpoints.length - 1)) ? new mp.Vector3(0, 0, 75) : new mp.Vector3(checkdataNext.x, checkdataNext.y, checkdataNext.z),
                color: [255, 255, 0, 60],
                visible: true,
                dimension: player.dimension
            });
            blip = mp.blips.new((currentCheckID == (checkpoints.length - 1) && laps == 1) ? 611 : 1, new mp.Vector3(checkdata.x, checkdata.y, checkdata.z), {
                name: (!checkdataNext && laps == 1) ? 'Финишная точка' : 'Контрольная точка',
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
                if (laps > 1){
                    laps--;
                    currentCheckID = 0;
                    checkBar++;
                    bar.text = checkBar + '/' + allChecksCount;
                    if (mapLapBar && mapLapBar.exists){
                        mapLapBar.text = laps ? laps.toString() : 'Последний'
                    }
                } else {
                    end = true
                    clear()
                    resolve(true);
                }
            } else {
                checkBar++;
                bar.text = checkBar + '/' + allChecksCount;
                currentCheckID++;
            }
        }
    })
}
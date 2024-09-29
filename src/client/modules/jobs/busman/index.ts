import {CustomEvent} from "../../custom.event";
import {
    WorkState,
    HALT,
    BUS_WAYS,
    HaltState,
    PED_MODELS,
    STOPS_FOR_EXP,
    BUS_LEVELS
} from "../../../../shared/jobs/busman/config";
import {gui} from "../../gui";
import {user} from "../../user";
import { system } from "../../system";

let state: WorkState = {
    type: null
},
    blockKeys: boolean = false,
    workVehicle: number | null = null,
    inWorkVehicle: boolean;

function CreateHalt(type: number, status: number): HaltState {
    const point = BUS_WAYS[type][status].Position,
        Blip: BlipMp = mp.blips.new(HALT.blipSprite, point, {
            color: HALT.blipColor,
            shortRange: true,
            name: HALT.blipName
        }),
        Colshape: ColshapeMp = mp.colshapes.newSphere(point.x, point.y, point.z - 1, HALT.colshapeRange, 0),
        Marker: MarkerMp = mp.markers.new(1, new mp.Vector3(point.x, point.y, point.z - 1), HALT.markerScale, {
            color: HALT.markerColor
        });

    mp.game.invoke('0x4F7D8A9BFB0B43E9', Blip.handle, true);

    return {
        Blip,
        Colshape,
        Marker
    }
}


function DeleteHalt(Halt: HaltState) {
    Halt.Blip.destroy();
    Halt.Colshape.destroy();
    Halt.Marker.destroy();
}

function CreatePeds(type: number, status: number) {
    const pedsPositions = BUS_WAYS[type][status].NPCPositions;

    let arr: PedMp[] = [];

    pedsPositions.forEach((el) => {
        const model = PED_MODELS[Math.floor(Math.random() * PED_MODELS.length)];
        let ped = mp.peds.new(mp.game.joaat(model), el.Position, el.Heading, 0);
        ped.freezePosition(false);
        arr.push(ped);
    });

    return arr;
}

mp.events.add("playerStartedEnterVehicle", (vehHandle: number) => {
    if (!mp.vehicles.atHandle(vehHandle)) return;

    let veh = mp.vehicles.atHandle(vehHandle);

    if (!veh.getVariable('busman')) return;

    if (veh.getVariable('busman') !== user.id) mp.players.local.clearTasksImmediately();
});

mp.events.add('entityStreamIn', (entity) => {
    if (state.pedsOnStop) {
        state.pedsOnStop.forEach((el) => {
            if (el.handle === entity.handle) {
                entity.freezePosition(false);
            }
        })
    }
})

async function DeletePeds() {
    return new Promise((resolver, reject) => {
        state.pedsInBus.forEach((el) => {
            el.destroy();
        });

        const interval = setInterval(() => {
            if (state.pedsInBus.every(el => el.handle === 0)) {
                state.pedsInBus = [];
                resolver(true);
                clearInterval(interval);
            }
        }, 100);
    })
}

function CheckExitFromBus(ped: PedMp, veh: VehicleMp) {
    if (ped.handle === 0) return true;
    return !mp.game.invoke('0xA3EE4A07279BB9DB', ped.handle, veh.handle, false);
}


CustomEvent.registerServer('busman:employerOpen', (exp: number) => {
    gui.setGui('busman');
    CustomEvent.triggerCef('busman:employerLoad', exp, state.type);
});

CustomEvent.registerServer('busman:startWork', (type: number, vehicleID: number, vehiclePosition: Vector3Mp) => {
    vehiclePosition.z += 3;

    const spawnVehicleMarker = mp.markers.new(0, vehiclePosition, 1, {
        color: [202, 0, 42, 255]
    });

    state = {
        type,
        status: 0,
        Halt: CreateHalt(type, 0),
        vehicleID,
        pedsInBus: [],
        spawnVehicleMarker,
        pedsOnStop: CreatePeds(type, 0),
        stopsForEXP: 0
    }
});

mp.events.add('playerEnterColshape', async (shape: ColshapeMp) => {

    if (!workVehicle) return;

    let player = mp.players.local,
        veh = mp.vehicles.atRemoteId(workVehicle),
        exitError: boolean = false;

    if (veh.handle === 0) return user.notify("Рабочий транспорт слишком далеко", 'error');

    if (player.vehicle && player.vehicle.getVariable("busman") && state.Halt && state.Halt.Colshape && shape === state.Halt.Colshape) {
        veh.setForwardSpeed(1.5);
        if (veh.getDoorLockStatus() !== 1) veh.setDoorsLocked(1);

        blockKeys = true;

        user.notify("Ожидайте окончания высадки/посадки пассажиров");
        CustomEvent.triggerServer('busman:salary', BUS_LEVELS[state.type].salary);

        if (state.stopsForEXP === STOPS_FOR_EXP - 1) {
            state.stopsForEXP = 0;
            CustomEvent.triggerServer('busman:addEXP');
        } else {
            state.stopsForEXP++;
        }

        DeleteHalt(state.Halt);

        // Выход

        state.pedsInBus.forEach((el) => {
            if (el.handle === 0) return;
            mp.game.invoke('0xD3DBCE61A490BE02', el.handle, veh.handle, 0);
        });

        let dateExit = system.timestamp;

        state.pedsInBus.forEach((el) => {
            if (el.handle === 0) return;
            mp.game.invoke('0xD3DBCE61A490BE02', el.handle, veh.handle, 0);
        });

        if (state.pedsInBus.length !== 0) {
            await new Promise((resolve, reject) => {
                const interval = setInterval(async () => {
                    if (state.pedsInBus.every(el => CheckExitFromBus(el, veh))) {
                        clearInterval(interval);
                        resolve(true);
                    }

                    if (system.timestamp - dateExit > 15 && system.timestamp - dateExit < 16) {
                        await DeletePeds();
                        exitError = true;
                        clearInterval(interval);
                        resolve(true);
                    }

                    if (system.timestamp - dateExit > 40) {
                        resolve(true);
                    }
                }, 100);
            });
        }

        // Удаление

        if (state.pedsInBus.length !== 0) await DeletePeds();

        // Вход


        state.pedsOnStop.forEach((el, key) => {
            if (el.handle === 0) return;
            const currSeat = exitError ? key + 2 : key;
            mp.game.invoke('0xC20E50AA46D09CA8', el.handle, veh.handle, 10000, currSeat, 2.0, 1, 0);
        });

        let date = system.timestamp;

        await new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if (state.pedsOnStop.every(el => mp.game.invoke('0xA3EE4A07279BB9DB', el.handle, veh.handle, false))) {
                    clearInterval(interval);
                    resolve(true);
                }else {
                    if (system.timestamp - date > 15 && system.timestamp - date < 16) {
                        state.pedsOnStop.forEach((el, key) => {
                            if (!mp.game.invoke('0xA3EE4A07279BB9DB', el.handle, veh.handle, false)) {
                                const currSeat = exitError ? key + 2 : key;
                                mp.game.invoke('0x9A7D091411C5F684', el.handle, veh.handle, currSeat);
                            }
                        });
                    }

                    if (system.timestamp - date > 40) {
                        resolve(true);
                    }
                }
            }, 100);
        });

        state.pedsOnStop.forEach((el) => {
            state.pedsInBus.push(el);
        });

        if (BUS_WAYS[state.type].length - 1 !== state.status) {
            state.status++;
        } else {
            state.status = 0;
            mp.events.callRemote('advancedQuests:job', 'busman:way');
        }

        state.Halt = CreateHalt(state.type, state.status);
        state.pedsOnStop = CreatePeds(state.type, state.status);
        blockKeys = false;
    }
});

mp.events.add('render', () => {
    if (blockKeys) mp.game.controls.disableAllControlActions(27);
});

mp.events.add('playerEnterVehicle', (vehicle: VehicleMp) => {
    if (!mp.vehicles.exists(vehicle)) return;

    if (vehicle.getVariable('busman') && vehicle.getVariable('busman') === user.id) {
        inWorkVehicle = true;
    }

    if (
        !vehicle.getVariable('busman')
        || vehicle.getVariable('busman') !== user.id
        || !state.vehicleID
        || vehicle.remoteId !== state.vehicleID
        || !state.spawnVehicleMarker
    ) return;

    workVehicle = vehicle.remoteId;
    state.spawnVehicleMarker.destroy();
    state.spawnVehicleMarker = undefined;
})

mp.events.add('playerLeaveVehicle', (vehicle) => {
    if (!mp.vehicles.exists(vehicle)) return;

    if (vehicle.getVariable('busman') && vehicle.getVariable('busman') === user.id) {
        inWorkVehicle = false;
        if (state.timeout) clearTimeout(state.timeout);

        user.notify('Если вы не вернётесь в транспорт в течение минуты, рабочий день будет окончен');

        state.timeout = setTimeout(() => {
            if (!inWorkVehicle) {
                mp.events.call('busman:finishWork');
            }
        }, 60000);
    }
})

mp.events.add('busman:finishWork', () => {
    if (state.timeout) {
        clearTimeout(state.timeout);
        state.timeout = null;
    }


    if (state.spawnVehicleMarker) {
        state.spawnVehicleMarker.destroy();
        state.spawnVehicleMarker = undefined;
    }

    if (workVehicle !== null) workVehicle = null;

    state.pedsOnStop.forEach((el) => {
        el.destroy();
    });

    state.pedsInBus.forEach((el) => {
        el.destroy();
    });

    if (state.Halt) DeleteHalt(state.Halt);

    state = {
        type: null
    }

    CustomEvent.triggerServer('busman:finishWork', state.vehicleID)
});

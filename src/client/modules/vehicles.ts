import {CustomEvent} from "./custom.event";
import {system} from "./system";
import {user} from "./user";
import {testDriveMode} from "./businesses/autosalon";
import {PLAYER_IN_VEHICLE_CONFIG} from "../../shared/player.in.vehicle";
import {disableControlGroup} from "./controls";
import {StaticVehicle, StaticVehicleStreamRange} from "../../shared/business";

const player = mp.players.local

let carStaticList: VehicleMp[] = [];

// Бинд кнопки F чтобы вызвать событие "playerStartedEnterVehicle" когда игрок пытается сесть в ТС. 
mp.keys.bind(70, false, () => {
    if (mp.players.local.getIsTaskActive(160)) {
        const handle = mp.players.local.getVehicleIsUsing()
        mp.events.call('playerStartedEnterVehicle', handle)
        mp.events.callRemote('playerStartedEnterVehicle', mp.vehicles.atHandle(handle).remoteId)
    }
})

const spawnStaticVehicle = (item: {
    // Модель ТС
    model : string;
    // Координаты
    x: number;
    y: number;
    z: number;
    // Угол поворота
    h: number;
    color1: [number, number, number];
    color2: [number, number, number];

}, id: number) => {
    const pos = new mp.Vector3(item.x, item.y, item.z);
    if(system.distanceToPos(pos, player.position) > StaticVehicleStreamRange) return;
    if(carStaticList.find(q => q && q.staticVehicle === id)) return;
    const h = item.h;
    const model = item.model;
    const primary = item.color1;
    const secondary = item.color2;
    const veh = mp.vehicles.new(mp.game.joaat(model), pos, {
        heading: h,
        dimension: -1
    })
    veh.staticVehicle = id
    veh.autosalon = true;
    carStaticList.push(veh);
    setTimeout(() => {
        veh.setCustomPrimaryColour(primary[0], primary[1], primary[2]);
        veh.setCustomSecondaryColour(secondary[0], secondary[1], secondary[2]);
        veh.setDoorsLocked(2);
        veh.freezePosition(true);
    }, 100)
}



setInterval(() => {
    carStaticList.map((veh) => {
        if(veh && mp.vehicles.exists(veh)){
            if(StaticVehicle[veh.staticVehicle].spin) veh.setHeading(veh.getHeading() + 1);

            veh.setDoorsLocked(2);
            veh.freezePosition(true);
        }
    })
}, 100)

setInterval(() => {
    StaticVehicle.map((item, index) => spawnStaticVehicle(item, index))
    carStaticList.map((veh, index) => {
        if(veh && mp.vehicles.exists(veh)){
            if(system.distanceToPos(veh.position, player.position) > StaticVehicleStreamRange){
                veh.destroy()
                carStaticList.splice(index, 1);
            }
        }
    })
}, 1200)



export const vehicles = {
    findNearests: (range = 5) => {
        return mp.vehicles.toArray().filter(veh => veh.handle && system.distanceToPos(player.position, veh.position) <= range).sort((a, b) => {
            return system.distanceToPos(player.position, a.position) - system.distanceToPos(player.position, b.position)
        })
    },
    findNearest: (range = 5) => {
        if(player.vehicle) return player.vehicle
        let vehs = vehicles.findNearests(range);
        if(vehs.length >= 1) return vehs[0]
        else return null;
    },
    lockSound: async (veh: VehicleMp) => {
        if(!mp.vehicles.exists(veh)) return;
        const times = veh.getVariable('locked') ? 3 : 2;
        const timer = veh.getVariable('locked') ? 800 : 400;
        const duration = veh.getVariable('locked') ? 500 : 200;
        
        let vehicleHorn = veh.getMod(14)
        let count = 0
        let lights = 2
        
        veh.setMod(14, -1)
        
        while (count < times){
            if(mp.vehicles.exists(veh)){
                veh.startHorn(duration, mp.game.joaat("HELDDOWN"), false)
                veh.setLights(2);
            }
            await system.sleep(timer / 2)
            if(mp.vehicles.exists(veh)) veh.setLights(0);
            count++;
            await system.sleep(timer / 2)
        }
        if(mp.vehicles.exists(veh)){
            veh.setLights(0);
            veh.setMod(14, vehicleHorn)
        }
    }
}

mp.events.add('render', () => {
    if(player.getVariable('inVehicleTruck')){
        disableControlGroup.allControls();
        disableControlGroup.cameraChanging();

        if (mp.game.invoke('0x8D4D46230B2C353A') !== 4) {
            mp.game.cam.setFollowPedCamViewMode(4);
        }
    }
})

let seatBelt = false;
setInterval(() => {
    if(!player.vehicle && seatBelt){
        seatBelt = false;
        mp.players.local.setConfigFlag(32, true);
    }
}, 3000);

CustomEvent.register('seatbelt', () => {
    if(!player.vehicle) return;
    const veh = player.vehicle;
    if(mp.game.vehicle.isThisModelABicycle(veh.getModel())) return;
    if(mp.game.vehicle.isThisModelABike(veh.getModel())) return;
    if(mp.game.vehicle.isThisModelABoat(veh.getModel())) return;
    if(mp.game.vehicle.isThisModelAHeli(veh.getModel())) return;
    if(mp.game.vehicle.isThisModelAPlane(veh.getModel())) return;
    if(mp.game.vehicle.isThisModelAQuadbike(veh.getModel())) return;
    if(mp.game.vehicle.isThisModelATrain(veh.getModel())) return;
    mp.players.local.setConfigFlag(32, seatBelt);
    seatBelt = !seatBelt;
    if(seatBelt) user.notify('Вы пристегнули ремень безопасности', 'success');
    else user.notify('Вы отстегнули ремень безопасности', 'error');
})

let lastData: string = JSON.stringify({});
let hal = false;
mp.events.add('render', () => {
    hal = !hal;
    if (hal) return;
    if(!user.login) return;
    let data: { [param: string]: any } = {}
    if (mp.players.local.vehicle) {
        const veh = mp.players.local.vehicle;
        data = {
            f: Math.min(100, Math.floor((veh.getVariable('fuel') / veh.getVariable('fuel_max')) * 100)),
            s: system.getCurrentSpeed(),
            l: veh.getVariable('locked'),
            e: veh.getVariable('engine'),
            x: seatBelt
        }
    }
    if (lastData == JSON.stringify(data)) return;
    lastData = JSON.stringify(data);
    CustomEvent.triggerCef('hud:speedometer', data);
});

mp.events.addDataHandler("freeze", async (target: VehicleMp, val: boolean) => {
    if(target.type !== "vehicle") return;
    target.freezePosition(val)
})

mp.events.addDataHandler("truckopen", async (target: VehicleMp, status: boolean) => {
    if (target.type !== "vehicle") return;
    status ? target.setDoorOpen(5, true, true)
        : target.setDoorShut(5, true)
})

mp.events.add('entityStreamIn', async (target: VehicleMp) => {
    if (target.type !== "vehicle") return;

    if (target.getVariable('freeze')) {
        target.freezePosition(true);
    }
});


mp.events.addDataHandler("multiple", async (target: VehicleMp, val: number) => {
    if(target.type !== "vehicle") return;
    target.setEngineTorqueMultiplier(val / 100)
})

mp.events.add('entityStreamIn', async (target: VehicleMp) => {
    if (target.type !== "vehicle") return;
    if (!target.getVariable('multiple')) return;
    target.setEngineTorqueMultiplier(target.getVariable('multiple') / 100)
});

mp.events.addDataHandler("inVehicleTruck", async (target: PlayerMp, val: number) => {
    if (target.type != "player") return;
    if (typeof val !== "number") {
        target.clearTasks();
        target.resetAlpha();
        target.setAlpha(255)
        target.detach(false, false)
        return;
    }
    let veh = mp.vehicles.atRemoteId(val)
    if (!veh) await system.sleep(500);
    if (!veh) veh = mp.vehicles.atRemoteId(val)
    if(!veh) return;
    if(!veh.handle) return;
    const cfg = PLAYER_IN_VEHICLE_CONFIG.find(q => q.model === veh.getVariable('modelname'));
    if(!cfg) return user.notify("vehicle in truck cfg error");
    
    user.playAnim([["amb@world_human_bum_slumped@male@laying_on_right_side@idle_a", "idle_a"]], false, true, target.remoteId);
    target.attachTo(veh.handle, veh.getBoneIndexByName('engine'), cfg.x, cfg.y, cfg.z, cfg.rot_x, cfg.rot_y, cfg.rot_z, true, true, false, true, 1, true)
    
});

mp.events.add('entityStreamIn', async (target: PlayerMp) => {
    if (target.type != "player") return;
    if (!target.getVariable('inVehicleTruck')) return;
    let veh = mp.vehicles.atRemoteId(target.getVariable('inVehicleTruck'))
    if (!veh) await system.sleep(500);
    veh = mp.vehicles.atRemoteId(target.getVariable('inVehicleTruck'))
    if (!veh) return;
    if (!veh.handle) return;
    const cfg = PLAYER_IN_VEHICLE_CONFIG.find(q => q.model === veh.getVariable('modelname'));
    if (!cfg) return;
    user.playAnim([["amb@world_human_bum_slumped@male@laying_on_right_side@idle_a", "idle_a"]], false, true, target.remoteId);
    target.attachTo(veh.handle, veh.getBoneIndexByName('engine'), cfg.x, cfg.y, cfg.z, cfg.rot_x, cfg.rot_y, cfg.rot_z, true, true, false, true, 1, true)
});

setInterval(() => {
    mp.players.forEachInStreamRange(async target => {
        if (!target.getVariable('inVehicleTruck')) return;
        let veh = mp.vehicles.atRemoteId(target.getVariable('inVehicleTruck'))
        if (!veh) await system.sleep(500);
        veh = mp.vehicles.atRemoteId(target.getVariable('inVehicleTruck'))
        if (!veh) return;
        if (!veh.handle) return;
        if (veh.getDoorAngleRatio(5) === 0) {
            target.setAlpha(0)
        } else {
            target.setAlpha(255)
            target.resetAlpha();
        }
    })
}, 800)

mp.events.addDataHandler("truckopen", (veh: VehicleMp, val: boolean) => {
    if (veh.type != "vehicle") return;
    if (val) {
        veh.setDoorOpen(5, false, false)
    } else if (!val){
        veh.setDoorShut(5, false)
    }
});
mp.events.addDataHandler("hoodopen", (veh: VehicleMp, val: boolean) => {
    if (veh.type != "vehicle") return;
    if (val) {
        veh.setDoorOpen(4, false, false)
    } else if (!val){
        veh.setDoorShut(4, false)
    }
});
mp.events.addDataHandler("locked", (entity: VehicleMp, status: boolean) => {
    if (entity.type != "vehicle") return;
    vehicles.lockSound(entity)
    if(status){
        entity.lastLockedTime = system.timestamp
    }
});


mp.events.add('entityStreamIn', (entity: VehicleMp) => {
    if (entity.type != "vehicle") return;
    entity.setDirtLevel(entity.getVariable('dirt') || 0.0);
    mp.game.invoke('0x1F2AA07F00B3217A', entity.handle, 0)
    if(entity.getVariable('truckopen')){
        entity.setDoorOpen(5, false, true)
    }
    if (entity.getVariable('hoodopen')){
        entity.setDoorOpen(4, false, true)
    }
    if (entity.autosalon){
        entity.setEngineOn(true, true, false)
        entity.setUndriveable(false)
    }
    if (entity.getVariable('engine')) entity.setEngineOn(true, true, false)
    else entity.setEngineOn(false, true, false)
    entity.setUndriveable(entity.getVariable('engine') ? false : true)
});

mp.events.addDataHandler("engine", (entity: VehicleMp, value) => {
    if (!value) entity.setEngineOn(false, true, false)
    else entity.setEngineOn(true, true, false)
    entity.setUndriveable(value ? false : true)
});

// let lastVeh: VehicleMp;
// setInterval(() => {
//     const currentVeh = player.vehicle && !player.vehicle.autosalon ? player.vehicle : null;
//     if(lastVeh != currentVeh) {
//         const event = currentVeh ? 'playerEnterVehicle' : 'playerLeaveVehicle'
//         const id = currentVeh ? currentVeh.remoteId : lastVeh.remoteId
//         user.notify('event '+event)
//         user.notify('id '+id)
//         CustomEvent.triggerServer(event, id)
//         lastVeh = currentVeh;
//     }
// }, 100)

let vehicleDirt: { time: number , remoteId: number } = {
    time: system.timestamp,
    remoteId: -1
}

setInterval(() => {
    if(!user.login) return;
    if(!user.isDriver) return;
    const veh = player.vehicle;
    if(!veh) return;

    const dirtyValue = veh.getVariable('dirt') || 0
    const current = veh.getDirtLevel();

    if (veh.remoteId !== vehicleDirt.remoteId) {
        vehicleDirt.time = system.timestamp;
        vehicleDirt.remoteId = veh.remoteId;

        CustomEvent.triggerServer('vehicle:syncDirt', dirtyValue);
    }else{
        if (dirtyValue !== current && system.timestamp - vehicleDirt.time > 360) {
            CustomEvent.triggerServer('vehicle:syncDirt', current + 0.01);
            vehicleDirt.time = system.timestamp;
        }
    }
}, 60000)

mp.events.addDataHandler("dirt", (entity: VehicleMp, value) => {
    if(entity.type !== "vehicle") return;
    entity.setDirtLevel(value ? value : 0.01);
});

setInterval(() => {
    if (!mp.players.local.vehicle) return;
    if (typeof mp.players.local.vehicle.remoteId !== "number") return;
    if (testDriveMode) return;
    if (player.vehicle) {
        if (player.vehicle.autosalon) {
            player.vehicle.setEngineOn(true, true, false)
            player.vehicle.setUndriveable(false)
            return;
        }
    }
    const vehicle = mp.players.local.vehicle;
    if (vehicle.getVariable('engine')) vehicle.setEngineOn(true, true, true)
    else vehicle.setEngineOn(false, true, true)
    vehicle.setUndriveable(vehicle.getVariable('engine') ? false : true)
    if (vehicle.getVariable('multiple')) vehicle.setEngineTorqueMultiplier(vehicle.getVariable('multiple') / 100)
}, 700)


let send = false;
CustomEvent.register('lockveh', () => {
    if(send) return;
    let veh = vehicles.findNearest();
    if(!veh) return user.notify("ТС поблизости не обнаружен", "error")
    if (typeof veh.remoteId !== "number") return user.notify("Вы не можете управлять данным ТС", "error")
    if (mp.game.vehicle.isThisModelABicycle(veh.getModel())) return;
    send = true;
    setTimeout(() => {
        send = false;
    }, 2000)
    CustomEvent.triggerServer('lockveh', veh.remoteId)
})
CustomEvent.register('engineveh', () => {
    let veh = player.vehicle;
    if(!veh) return;
    if(veh.autosalon) return;
    const driver = veh.getPedInSeat(-1);
    if (!driver || driver != player.handle) return user.notify("Чтобы управлять двигателем необходимо находится за рулём", "error");
    if (typeof veh.remoteId !== "number") return user.notify("Вы не можете управлять данным ТС", "error")
    if (mp.game.vehicle.isThisModelABicycle(veh.getModel())) return;
    if(veh.getVariable('fraction') && user.fraction !== veh.getVariable('fraction') && !user.isAdminNow()) return user.notify("Вы не можете управлять данным ТС", "error")
    CustomEvent.triggerServer('engineveh', veh.remoteId);
})

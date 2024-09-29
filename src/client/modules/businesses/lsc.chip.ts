import {ChipTuningOption, handlingConfigs} from "../../../shared/lsc";
import {CustomEvent} from "../custom.event";
import {gui} from "../gui";
import {system} from "../system";
import {guiNames} from "../../../shared/gui";
import {vehicles} from "../vehicles";

mp.events.add('playerEnterVehicle', (vehicle: VehicleMp, seat: number) => {
    applyConfigMaxSpeed(vehicle);
    applyChipTuning(mp.players.local.vehicle);
});

export function applyConfigMaxSpeed(vehicle: VehicleMp) {
    const maxSpeed: number = vehicle.getVariable('maxSpeed');
    if (maxSpeed) {
        vehicle.setMaxSpeed(maxSpeed / 3.6);
    } else {
        vehicle.setMaxSpeed(999);
    }
}

setInterval(() => {
    if (mp.players.local.isInAnyVehicle(false) &&
        mp.players.local.vehicle && mp.vehicles.exists(mp.players.local.vehicle)) {

        applyConfigMaxSpeed(mp.players.local.vehicle);
    }
}, 5000);

mp.events.addDataHandler('tuning:chip', (vehicle: VehicleMp, value, oldValue) => {
    if (mp.players.local.vehicle === vehicle) {
        applyChipTuning(vehicle);
    }
});

mp.events.addDataHandler('maxSpeed', (vehicle: VehicleMp, value, oldValue) => {
    if (mp.players.local.vehicle === vehicle) {
        applyConfigMaxSpeed(vehicle);
    }
});

function applyChipTuning(vehicle: VehicleMp) {
    if (!mp.vehicles.exists(vehicle)) {
        return;
    }

    checkDefaultSettings(vehicle);

    const chipDataJson = <string>vehicle.getVariable('tuning:chip');
    if (!chipDataJson) {
        applyDefaultSettings(vehicle);
        return;
    }

    const chipData = <ChipTuningOption[]>JSON.parse(chipDataJson);
    if (!chipData) {
        applyDefaultSettings(vehicle);
        return;
    }

    for (let option of chipData) {
        const handlingName = handlingConfigs.find(handling => handling.id === option.handlingId)?.handlingName;
        if (handlingName) {
            vehicle.setHandling(handlingName, option.value, true);
        }
    }
}

let isChipOpened = false;
CustomEvent.registerServer('lsc:exitChip', () => {
    isChipOpened = false;
    mp.game.cam.renderScriptCams(false, false, 0, false, false);
});

mp.events.add('gui:menuClosed', (gui: guiNames) => {
    if (gui === 'lsc' && isChipOpened) {
        CustomEvent.triggerServer('lsc:chip:exit', openedBusinessId);
    }
})

let openedBusinessId: number = -1;
CustomEvent.registerServer('business:lscChip:open', (
    businessId: number,
    tuningCost: number,
    currentTuning: ChipTuningOption[],
) => {
    isChipOpened = true;
    openedBusinessId = businessId;
    const vehicle = mp.players.local.vehicle;

    if (!currentTuning || currentTuning.length === 0) {
        currentTuning = handlingConfigs.map(handlingConfig => ({
            handlingId: handlingConfig.id,
            value: vehicle.getHandling(handlingConfig.handlingName)
        }));
    }

    const standardConfig = getDefaultConfig(vehicle);

    gui.setGui('lsc');
    CustomEvent.triggerCef('lsc:startChip', vehicle.getVariable('modelname') || '', currentTuning, standardConfig, tuningCost, businessId, vehicle.remoteId);
})


CustomEvent.registerServer('lsc:chip:loadDefaults', (defaultConfigs: [number, ChipTuningOption[]][]) => {
    for (let pair of defaultConfigs) {
        defaultConfigByModel.set(pair[0], pair[1]);
    }
});

const defaultConfigByModel = new Map<number, ChipTuningOption[]>();

function checkDefaultSettings(vehicle: VehicleMp) {
    if (defaultConfigByModel.has(vehicle.model)) {
        return;
    }

    const config = handlingConfigs.map<ChipTuningOption>(handling => ({
        handlingId: handling.id,
        value: vehicle.getHandling(handling.handlingName)
    }));

    defaultConfigByModel.set(vehicle.model, config);
    CustomEvent.triggerServer('lsc:chip:setDefault', vehicle.model, config);
}

function applyDefaultSettings(vehicle: VehicleMp) {
    const config = getDefaultConfig(vehicle);
    if (!config) {
        return;
    }

    for (let option of config) {
        const handlingName = handlingConfigs.find(handling => handling.id === option.handlingId)?.handlingName;
        if (handlingName) {
            vehicle.setHandling(handlingName, option.value, true);
        }
    }
}

function getDefaultConfig(vehicle: VehicleMp): ChipTuningOption[] {
    return defaultConfigByModel.get(vehicle.model);
}


let phi = 25,
    theta = -15,
    phim = 0,
    thetam = 0,
    lastX = 0,
    lastY = 0;


const degToRad = Math.PI / 180;

let camera: CameraMp;

if (!camera || !mp.cameras.exists(camera)) {
    camera = mp.cameras.new('lsc', new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0), 40)
}

let leftDown = false
let rightDown = false
let downPos = [0, 0]

const player = mp.players.local;
setInterval(() => {
    if (!isChipOpened) return;

    mp.game.cam.renderScriptCams(true, false, 0, false, false);
    camera.setActive(true)
    const cursorPos = mp.gui.cursor.position
    const resolution = mp.game.graphics.getScreenActiveResolution(0, 0)

    if (!mp.keys.isDown(0x02)) {
        if (rightDown) rightDown = false
    } else {
        if (!player.vehicle) return;
        if (!rightDown) {
            if (!(mp.gui.cursor.position[0] * 100 / resolution.x >= 27 && mp.gui.cursor.position[0] * 100 / resolution.x < 78) || !(mp.gui.cursor.position[1] * 100 / resolution.y <= 90)) return;
            rightDown = true
            downPos = mp.gui.cursor.position
        }
        if (!rightDown) return;
        if (cursorPos[0] != lastX || cursorPos[1] != lastY) {
            //cursorPos[0]-lastX
            let newFov = system.smallestNumber(system.biggestNumber(10, camera.getFov() + (cursorPos[1] - lastY) * 0.3), 80)
            camera.setFov(newFov)
        }
    }


    if (!mp.keys.isDown(0x01)) {
        if (leftDown) leftDown = false
    } else {
        if (!player.vehicle) return;
        if (!leftDown) {
            if (!(mp.gui.cursor.position[0] * 100 / resolution.x >= 27 && mp.gui.cursor.position[0] * 100 / resolution.x < 78) || !(mp.gui.cursor.position[1] * 100 / resolution.y <= 90)) return;
            leftDown = true
            downPos = mp.gui.cursor.position
            thetam = theta;
            phim = phi;
        }
        if (!leftDown) return;
        if (cursorPos[0] != lastX || cursorPos[1] != lastY) {

            thetam = theta;
            phim = phi;

            phi = -(cursorPos[0] - lastX) * 0.1 + phim;
            theta = -(cursorPos[1] - lastY) * 0.1 + thetam;
            if (theta > 90) theta = 90
            else if (theta < 65) theta = 65

            const distance = 10
            const newCoord = [
                distance * Math.sin(theta * degToRad) * Math.cos(phi * degToRad),
                distance * Math.sin(theta * degToRad) * Math.sin(phi * degToRad),
                distance * Math.cos(theta * degToRad)
            ]

            camera.setCoord(player.vehicle.position.x + newCoord[0], player.vehicle.position.y + newCoord[1], player.vehicle.position.z + newCoord[2])
            camera.pointAt(player.vehicle.handle, 0, 0, 0, true)
        }
    }
    lastX = cursorPos[0]
    lastY = cursorPos[1]
}, 10)

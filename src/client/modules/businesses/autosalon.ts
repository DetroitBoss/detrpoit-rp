import {CustomEvent} from "../custom.event";
import {AutosalonCarItem} from "../../../shared/autosalon";
import {user} from "../user";
import {gui} from "../gui";
import {mouseMove} from "../controls";
import {anticheatProtect, teleportAnticheat} from "../protection";
import {handleCamZoom} from '../camera'

const player = mp.players.local
let showOffset: [number, number, number] = [1.23276901245117, -7.93903710937500, 2.460024642944336];
export let testDriveMode = false;
let currentPosition: {
    x: number;
    y: number;
    z: number;
    h?: number;
};
let currentTestPosition: {
    x: number;
    y: number;
    z: number;
    h?: number;
};
let currentExitPosition: {
    x: number;
    y: number;
    z: number;
};
let currentCamera: CameraMp;
let currentVeh: VehicleMp;
let currentDonate: number;
let currentFamilyBuy: boolean;
let currentCars: AutosalonCarItem[];
let currentSelectedCar: number;
let currentAutosalonId: number;
let currentAutosalonName: string;
let currentPrimaryColor: { r: number, g: number, b: number } = {r: 0, g: 0, b: 0};
let currentSecondaryColor: { r: number, g: number, b: number } = {r: 0, g: 0, b: 0};

export const stopBuyCar = () => {
    anticheatProtect('teleport');
    player.position = new mp.Vector3(currentExitPosition.x, currentExitPosition.y, currentExitPosition.z);
    player.freezePosition(false);
    unFocusCamera();
    gui.setGui(null);
    CustomEvent.triggerServer('server:autosalon:stopBuyCar')
}

mp.events.add('server:autosalon:stopBuyCar', () => {
    stopBuyCar();
})

let isCameraZoomEnabled = true;
mp.events.add('autosalon:toggleZoom', (enableZoom: boolean) => {
    isCameraZoomEnabled = enableZoom;
});

mp.events.add('render', () => {
    if (!isCameraZoomEnabled) {
        return;
    }

    handleCamZoom(currentCamera)
})

mp.events.add('autosalon:setPrimaryColor', (r: number, g: number, b: number) => {
    currentPrimaryColor = {r, g, b};
    vehColor();
})
mp.events.add('autosalon:setSecondaryColor', (r: number, g: number, b: number) => {
    currentSecondaryColor = {r, g, b};
    vehColor();
})
mp.events.add('autosalon:buyCar', (isFamilyMoney = false) => {
    CustomEvent.triggerServer('autosalon:buyCar', currentSelectedCar, currentAutosalonId, currentPrimaryColor, currentSecondaryColor, isFamilyMoney)
})
mp.events.add('client:autosalon:changeCar', (id: number) => {
    currentSelectedCar = id;
    respawnVehicle();
})

let maxSpeed = 999;

mp.events.add('client:autosalon:testDrive', () => {
    respawnVehicle(true);
    player.freezePosition(false);
    player.setAlpha(0);
    player.setInvincible(true);
    setTimeout(async () => {
        player.setIntoVehicle(currentVeh.handle, -1);
        player.setAlpha(255);
        const cfg = getCurrentCar();
        maxSpeed = await CustomEvent.callServer('vehicle:getMaxSpeed', cfg.model)
        currentVeh.setMaxSpeed(maxSpeed / 3.6);
    }, 100)
    setTimeout(() => {
        unFocusCamera();
        user.notify("У вас 60 секунд на тест драйв", "success");
        testDriveMode = true;
        let timer = 600;
        let int = setInterval(() => {
            timer--;
            if (mp.players.local.vehicle) mp.players.local.vehicle.setMaxSpeed(maxSpeed / 3.6);
            if (timer <= 0 || !player.isInAnyVehicle(false)) {
                player.setInvincible(false);
                user.notify("Тест драйв завершён", "error");
                clearInterval(int);
                testDriveMode = false;
                openSalonMenu()
            }
        }, 100)
    }, 1000)
})

mouseMove((right, down, leftKey, rightKey, posX) => {
    if (!leftKey) return;
    if (!currentVeh) return;
    if (!mp.vehicles.exists(currentVeh)) return;
    if (!currentVeh.handle) return;
    if (testDriveMode) return;
    if (posX > 0.21 && posX < 0.81) {
        currentVeh.setHeading(currentVeh.getHeading() + (right / 1.5));
        currentVeh.setCoords(currentPosition.x, currentPosition.y, currentPosition.z, true, true, true, true);
    }
}, 10)

const vehColor = () => {
    if (!mp.vehicles.exists(currentVeh)) return;
    currentVeh.setCustomPrimaryColour(currentPrimaryColor.r, currentPrimaryColor.g, currentPrimaryColor.b);
    currentVeh.setCustomSecondaryColour(currentSecondaryColor.r, currentSecondaryColor.g, currentSecondaryColor.b);
}

CustomEvent.registerServer('autosalon:start', (name: string, id: number, cars: AutosalonCarItem[], exit: {
    x: number;
    y: number;
    z: number;
}, position: {
    x: number;
    y: number;
    z: number;
    h?: number;
}, test: {
    x: number;
    y: number;
    z: number;
    h?: number;
}, donate: number, familyBuy: boolean) => {
    currentDonate = donate;
    currentFamilyBuy = familyBuy;
    currentExitPosition = exit;
    currentPosition = position;
    currentTestPosition = test;
    currentAutosalonId = id;
    currentAutosalonName = name;
    currentCars = cars;
    currentSelectedCar = currentCars[0].item;
    openSalonMenu()
})

export const openSalonMenu = () => {
    teleportAnticheat(currentPosition.x, currentPosition.y, currentPosition.z + 15)
    player.position = new mp.Vector3(currentPosition.x, currentPosition.y, currentPosition.z + 15);
    player.freezePosition(true);
    gui.setGui('autosalon');
    respawnVehicle();
    focusCamera();
    CustomEvent.triggerCef('autosalon:startAutosalon', currentAutosalonName, currentCars, currentSelectedCar, currentDonate, currentFamilyBuy);
}

const unFocusCamera = () => {
    gui.setGui(null);
    mp.game.cam.renderScriptCams(false, false, 0, false, false);
    mp.game.invoke('0x198F77705FA0931D', player.handle);
    mp.game.cam.setGameplayCamRelativeHeading(0);

    user.hideLoadDisplay(500, false);
}

const focusCamera = () => {
    mp.game.streaming.requestCollisionAtCoord(currentPosition.x, currentPosition.y, currentPosition.z);
    mp.game.streaming.setFocusArea(currentPosition.x, currentPosition.y, currentPosition.z, 0.0, 0.0, 0.0);
    if (!currentCamera || !mp.cameras.exists(currentCamera)) currentCamera = mp.cameras.new('car_dealing');
    currentCamera.setFov(30);
    currentCamera.setActive(true)
    currentCamera.setCoord(currentPosition.x + showOffset[0], currentPosition.y + showOffset[1], currentPosition.z + showOffset[2]);
    currentCamera.pointAtCoord(currentPosition.x, currentPosition.y, currentPosition.z);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
    mp.game.cam.renderScriptCams(true, true, 1500, true, false);
}

const getCurrentCar = () => {
    return currentCars.find(q => q.item == currentSelectedCar);
}

const respawnVehicle = (test = false) => {
    if (currentVeh && mp.vehicles.exists(currentVeh)) {
        currentVeh.destroy();
    }
    const cfg = getCurrentCar();
    currentVeh = mp.vehicles.new(mp.game.joaat(cfg.model), test ? new mp.Vector3(currentTestPosition.x, currentTestPosition.y, currentTestPosition.z) : new mp.Vector3(currentPosition.x, currentPosition.y, currentPosition.z), {
        heading: test ? currentTestPosition.h : currentPosition.h,
        dimension: player.dimension
    })
    currentVeh.autosalon = true
    setTimeout(() => {
        vehColor();
    }, 10)

}
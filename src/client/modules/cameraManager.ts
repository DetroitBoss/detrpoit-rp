import {CAMERA_WAYPOINTS, CameraWaypoint} from "../../shared/cameraWaypoints";
import {cameraManager} from "./camera";
import {system} from "./system";

const player = mp.players.local
export type cameraSettingsMode = "Обычный" | "Смотреть на ТС" | "Смотреть на игрока";

const CamerasManagerInfo = {
    gameplayCamera: <CameraMp>null,
    activeCamera: <CameraMp>null,
    interpCamera: <CameraMp>null,
    interpActive: false,
    _events: new Map(),
    cameras: new Map([
        ['testCamera', mp.cameras.new('default', new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0), 50.0)],
    ]),
    requestCol: false
};

let qaz = 0;
mp.events.add('render', () => {
    qaz++;
    if (qaz == 11) qaz = 0;
    if (CamerasManagerInfo.activeCamera && mp.cameras.exists(CamerasManagerInfo.activeCamera) && qaz === 10){
        mp.game.streaming.setFocusArea(CamerasManagerInfo.activeCamera.getCoord().x, CamerasManagerInfo.activeCamera.getCoord().y, CamerasManagerInfo.activeCamera.getCoord().z, 0.0, 0.0, 0.0);
        CamerasManagerInfo.requestCol = true
    } else if ((!CamerasManagerInfo.activeCamera || !mp.cameras.exists(CamerasManagerInfo.activeCamera)) && CamerasManagerInfo.requestCol){
        mp.game.invoke('0x31B73D1EA9F01DA2');
        CamerasManagerInfo.requestCol = false
    }
    if (CamerasManagerInfo.activeCamera && mp.cameras.exists(CamerasManagerInfo.activeCamera) && CamerasManagerInfo.interpCamera && CamerasManager.doesExist(CamerasManagerInfo.interpCamera) && !CamerasManagerInfo.activeCamera.isInterpolating()) {

        CamerasManager.fireEvent('stopInterp', CamerasManagerInfo.activeCamera);
        CamerasManagerInfo.interpCamera.setActive(false);
        CamerasManagerInfo.interpCamera.destroy();
        CamerasManagerInfo.interpCamera = null;
    }
});

const cameraSerialize = (camera: CameraMp) => {
    camera.setActiveCamera = (toggle: boolean) => {
        CamerasManager.setActiveCamera(camera, toggle);
    };

    camera.setActiveCameraWithInterp = (position, rotation, duration, easeLocation, easeRotation) => {
        CamerasManager.setActiveCameraWithInterp(camera, position, rotation, duration, easeLocation, easeRotation);
    };
};

export class CamerasManager {

    static on(eventName: string, eventFunction: (camera: CameraMp) => void) {
        if (CamerasManagerInfo._events.has(eventName)) {
            const event = CamerasManagerInfo._events.get(eventName);

            if (!event.has(eventFunction)) {
                event.add(eventFunction);
            }
        } else {
            CamerasManagerInfo._events.set(eventName, new Set([eventFunction]));
        }
    }

    static fireEvent(eventName: string, ...args: any[]) {
        if (CamerasManagerInfo._events.has(eventName)) {
            const event = CamerasManagerInfo._events.get(eventName);

            event.forEach((eventFunction: any) => {
                eventFunction(...args);
            });
        }
    }

    static getCamera(name: string) {

        const camera = CamerasManagerInfo.cameras.get(name);

        if (typeof camera.setActiveCamera !== 'function') {
            cameraSerialize(camera);
        }

        return camera;
    }

    static setCamera(name: string, camera: CameraMp) {
        CamerasManagerInfo.cameras.set(name, camera);
    }

    static hasCamera(name: string) {
        return CamerasManagerInfo.cameras.has(name);
    }

    static destroyCamera(camera: CameraMp) {
        if (this.doesExist(camera)) {
            if (camera === this.activeCamera) {
                this.activeCamera.setActive(false);
            }
            camera.destroy();
        }
    }

    static createCamera(name: string, type: string, position: Vector3Mp, rotation: Vector3Mp, fov: number, target?: number, mode?: cameraSettingsMode, time?: number) {
        const cam = mp.cameras.new(type, position, target ? new mp.Vector3(0, 0, 0) : rotation, fov);
        if (target) {
            let int = setInterval(() => {
                let targetEnt: EntityMp;
                if (mode == "Смотреть на ТС") targetEnt = mp.vehicles.atRemoteId(target)
                if (mode == "Смотреть на игрока") targetEnt = mp.players.atRemoteId(target)
                if (targetEnt) cam.pointAt(targetEnt.handle, 0, 0, 0, true);
            }, 10)
            setTimeout(() => {
                clearInterval(int)
            }, time);
        }
        cameraSerialize(cam);
        CamerasManagerInfo.cameras.set(name, cam);
        return cam;
    }

    static setActiveCamera(activeCamera: CameraMp, toggle: boolean) {
        if (!toggle) {
            if (this.doesExist(CamerasManagerInfo.activeCamera)) {
                CamerasManagerInfo.activeCamera = null;
                activeCamera.setActive(false);
                mp.game.cam.renderScriptCams(false, false, 0, false, false);
            }

            if (this.doesExist(CamerasManagerInfo.interpCamera)) {
                CamerasManagerInfo.interpCamera.setActive(false);
                CamerasManagerInfo.interpCamera.destroy();
                CamerasManagerInfo.interpCamera = null;
            }

        } else {
            if (this.doesExist(CamerasManagerInfo.activeCamera)) {
                CamerasManagerInfo.activeCamera.setActive(false);
            }
            CamerasManagerInfo.activeCamera = activeCamera;
            activeCamera.setActive(true);
            mp.game.cam.renderScriptCams(true, false, 0, false, false);
        }
    }

    static setActiveCameraWithInterp(activeCamera: CameraMp, position: Vector3Mp, rotationOrTarget: Vector3Mp, duration: number, easeLocation: number, easeRotation: number, target?: number, mode?: cameraSettingsMode, time?: number) {

        if (this.doesExist(CamerasManagerInfo.activeCamera)) {
            CamerasManagerInfo.activeCamera.setActive(false);
        }

        if (this.doesExist(CamerasManagerInfo.interpCamera)) {

            CamerasManager.fireEvent('stopInterp', CamerasManagerInfo.interpCamera);

            CamerasManagerInfo.interpCamera.setActive(false);
            CamerasManagerInfo.interpCamera.destroy();
            CamerasManagerInfo.interpCamera = null;
        }
        const interpCamera = mp.cameras.new('default', activeCamera.getCoord(), activeCamera.getRot(2), activeCamera.getFov());
        activeCamera.setCoord(position.x, position.y, position.z);
        if (target) {
            let int = setInterval(() => {
                let targetEnt: EntityMp;
                if (mode == "Смотреть на ТС") targetEnt = mp.vehicles.atRemoteId(target)
                if (mode == "Смотреть на игрока") targetEnt = mp.players.atRemoteId(target)
                if (targetEnt) activeCamera.pointAt(targetEnt.handle, 0, 0, 0, true);
            }, 10)
            setTimeout(() => {
                clearInterval(int)
            }, time);
        }

        else activeCamera.setRot(rotationOrTarget.x, rotationOrTarget.y, rotationOrTarget.z, 2);
        activeCamera.stopPointing();

        CamerasManagerInfo.activeCamera = activeCamera;
        CamerasManagerInfo.interpCamera = interpCamera;
        activeCamera.setActiveWithInterp(interpCamera.handle, duration, easeLocation, easeRotation);
        mp.game.cam.renderScriptCams(true, false, 0, false, false);

        CamerasManager.fireEvent('startInterp', CamerasManagerInfo.interpCamera);
    }

    static doesExist(camera: CameraMp) {
        return mp.cameras.exists(camera) && camera.doesExist();
    }

    static get activeCamera() {
        return CamerasManagerInfo.activeCamera;
    }

    static get gameplayCam() {
        if (!CamerasManagerInfo.gameplayCamera) {
            CamerasManagerInfo.gameplayCamera = mp.cameras.new("gameplay");
        }
        return CamerasManagerInfo.gameplayCamera;
    }
}


interface cameraSettings {
    pos1: Vector3Mp;
    pos2: Vector3Mp;
    rot1: Vector3Mp;
    rot2: Vector3Mp;
    mode: cameraSettingsMode;
    target: number;
    fov: number;
    duration: number;
}



export const drawCamera = (posStart: Vector3Mp, rotStart: Vector3Mp, posEnd: Vector3Mp, rotEnd: Vector3Mp, fov: number, duration: number, fadeEnd: boolean | (() => boolean) = false) => {
    return new Promise((resolve, reject) => {
        let camera: CameraMp = CamerasManager.createCamera('recordCamera', 'default', posStart, rotStart, fov, null, null, duration);
        CamerasManager.setActiveCameraWithInterp(camera, posEnd, rotEnd, duration, 0, 0, null, null, duration);
        setTimeout(async () => {
            if (fadeEnd){
                if ((typeof fadeEnd === "boolean" && fadeEnd) || (typeof fadeEnd === "function" && fadeEnd())) mp.game.cam.doScreenFadeOut(500), await system.sleep(500);
            }
            if (CamerasManagerInfo.activeCamera){
                mp.game.cam.renderScriptCams(false, false, 0, false, false);
                CamerasManager.destroyCamera(camera);
            }
            resolve(true);
        }, duration);
    })
}
export const drawCameraConf = (conf: CameraWaypoint, fadeEnd: boolean | (() => boolean) = false) => {
    return new Promise(async (resolve, reject) => {
        for (let id = 0; id < conf.coords.length; id++){
            if (conf.coords[id + 1]){
                if (id == 0 || CamerasManagerInfo.activeCamera){
                    const cfg1 = conf.coords[id];
                    const cfg2 = conf.coords[id + 1];
                    await drawCamera(new mp.Vector3(cfg1.x, cfg1.y, cfg1.z), new mp.Vector3(cfg1.rx, cfg1.ry, cfg1.rz), new mp.Vector3(cfg2.x, cfg2.y, cfg2.z), new mp.Vector3(cfg2.rx, cfg2.ry, cfg2.rz), conf.fov, cfg1.time, () => {
                        if (!fadeEnd) return false;
                        if (typeof fadeEnd === "boolean" && fadeEnd && !conf.coords[id + 2]) return true;
                        if (typeof fadeEnd === "function" && fadeEnd() && !conf.coords[id + 2]) return true;
                        return false;
                    })
                }
            } else {
                const cfg1 = conf.coords[id];
                setTimeout(() => {
                    resolve(null)
                }, cfg1.time)
            }
        }
    })
}

let loadScreenEnd = false;

setTimeout(async () => {
    mp.game.cam.doScreenFadeOut(500);
    await system.sleep(1000)
    mp.game.cam.doScreenFadeIn(500);
    while(!loadScreenEnd){
        let el = system.randomArrayElement(CAMERA_WAYPOINTS.filter(q => q.cameraForLoadScreen));
        await drawCameraConf(el, () => {
            return !loadScreenEnd
        })
        if (!loadScreenEnd){
            await system.sleep(1000)
            mp.game.cam.doScreenFadeIn(500);
        }
    }
    mp.game.cam.doScreenFadeIn(500);
    await system.sleep(1000);
    mp.game.cam.doScreenFadeIn(500);
}, 1)

mp.events.add('loadingscreen:load', () => {
    loadScreenEnd = true
    if (CamerasManagerInfo.activeCamera) {
        mp.game.cam.renderScriptCams(false, false, 0, false, false);
        CamerasManager.destroyCamera(CamerasManagerInfo.activeCamera);
        CamerasManagerInfo.activeCamera = null;
    }
    setTimeout(() => {
        cameraManager.createOrbitCam(-143.31, -730.63, 31.27, 2150);
    }, 1000)
})
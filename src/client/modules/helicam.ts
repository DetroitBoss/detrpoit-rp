// config
import {system} from "./system";
import {CamerasManager} from "./cameraManager";
import {gui, hideHud} from "./gui";
import {user} from "./user";
import { fractionCfg } from "./fractions";

let fov_max = 80.0
let fov_min = 10.0 // max zoom level (smaller fov is more zoom)
let zoomspeed = 2.0 // camera zoom speed
let speed_lr = 3.0 // speed by which the camera pans left-right
let speed_ud = 3.0 // speed by which the camera pans up-down
let toggle_helicam = 51 // control id of the button by which to toggle the helicam mode. Default: INPUT_CONTEXT (E)
let toggle_vision = 25 // control id to toggle vision mode. Default: INPUT_AIM (Right mouse btn)
let toggle_rappel = 154 // control id to rappel out of the heli. Default: INPUT_DUCK (X)
let toggle_spotlight = 183 // control id to toggle the front spotlight Default: INPUT_PhoneCameraGrid (G)
let toggle_lock_on = 22 // control id to lock onto a vehicle with the camera. Default is INPUT_SPRINT (spacebar)
let locked_on_vehicle: number;
// Script starts here
let helicam = false
let helicamTick = false
let fov = (fov_max + fov_min) * 0.5
let vision_state = 0 // 0 is normal, 1 is nightmode, 2 is thermal vision
let scaleform: number;


const camera = CamerasManager.hasCamera('heli_cam') ?
    CamerasManager.getCamera('heli_cam') :
    CamerasManager.createCamera(
        'heli_cam',
        'default',
        new mp.Vector3(0, 0, 0),
        new mp.Vector3(-90, 0, 0),
        50
    );



mp.events.add('render', () => {
    if(!IsPlayerInPolmav()) return quit();
    if(IsHeliHighEnough()){
        const veh = mp.players.local.vehicle
        if(mp.game.controls.isControlJustPressed(0, toggle_helicam)){
            if(mp.players.local.handle !== veh.getPedInSeat(0)) return user.notify('Только второй пилот может использовать камеру', 'error')
            mp.game.audio.playSoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", false);
            helicam = !helicam;
        }

        if(helicam){
            if(mp.game.controls.isControlJustPressed(0, toggle_vision)){
                mp.game.audio.playSoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", false);
                changeVision();
            }
            if(!helicamTick){
                mp.game.graphics.setTimecycleModifier("heliGunCam")
                mp.game.graphics.setTimecycleModifierStrength(0.3);
                scaleform = mp.game.graphics.requestScaleformMovie("HELI_CAM")
                if(!mp.game.graphics.hasScaleformMovieLoaded(scaleform)) return;
                helicamTick = true;
                hideHud(true)
                return;
            }
            camera.attachTo(veh.handle, 0.0, 2.7, -1.0, true)
            camera.setFov(fov)
            camera.setActive(true)
            mp.game.cam.renderScriptCams(true, false, 0, true, false)
            mp.game.graphics.pushScaleformMovieFunction(scaleform, "SET_CAM_LOGO")
            mp.game.graphics.pushScaleformMovieFunctionParameterInt(mp.players.local.isInAnyPoliceVehicle() ? 1 : 0);
            mp.game.graphics.popScaleformMovieFunctionVoid();

            let vehicle_detected = GetVehicleInView()
            if(locked_on_vehicle){
                const target = mp.vehicles.atHandle(locked_on_vehicle)
                if(!target || !target.handle){
                    camera.stopPointing()
                    locked_on_vehicle = null
                } else {
                    camera.pointAt(target.handle, 0.0, 0.0, 0.0, true)
                }
            }
            if(vehicle_detected){
                const target = mp.vehicles.atHandle(vehicle_detected)
                if(target){
                    const model = mp.game.ui.getLabelText(mp.game.vehicle.getDisplayNameFromVehicleModel(target.model));
                    const plate = target.getNumberPlateText()
                    gui.drawText(`Модель: ${model}\nНомер: ${plate || 'Не известен'}`, 0.45, 0.9, [0.0, 0.55])
                }
            }
            let zoomvalue = (1.0/(fov_max-fov_min))*(fov-fov_min)
            if(!locked_on_vehicle) {
                CheckInputRotation(zoomvalue)
                if(vehicle_detected){
                    if(mp.game.controls.isControlJustPressed(0, toggle_lock_on)){
                        mp.game.audio.playSoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", false);
                        locked_on_vehicle = vehicle_detected
                    }
                }

            } else if(mp.game.controls.isControlJustPressed(0, toggle_lock_on) && locked_on_vehicle){
                mp.game.audio.playSoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", false);
                locked_on_vehicle = 9999999
            }


            HandleZoom()
            HideHUDThisFrame()
            mp.game.graphics.pushScaleformMovieFunction(scaleform, "SET_ALT_FOV_HEADING")
            mp.game.graphics.pushScaleformMovieFunctionParameterFloat(camera.getCoord().z)
            mp.game.graphics.pushScaleformMovieFunctionParameterFloat(zoomvalue)
            mp.game.graphics.pushScaleformMovieFunctionParameterFloat(camera.getRot(2).z)
            mp.game.graphics.popScaleformMovieFunctionVoid()
            mp.game.graphics.drawScaleformMovieFullscreen(scaleform, 255, 255, 255, 255, true)
            return;
        }
    }
    quit();
})

const GetVehicleInView = (): number => {
    const coords = camera.getCoord();
    let forward_vector = RotAnglesToVec(camera.getRot(2))
    const start = new mp.Vector3(
        coords.x + (forward_vector.x*10.0),
        coords.y + (forward_vector.y*10.0),
        coords.z + (forward_vector.z*10.0),
    );
    const end = new mp.Vector3(
        coords.x + (forward_vector.x*200.0),
        coords.y + (forward_vector.y*200.0),
        coords.z + (forward_vector.z*200.0),
    );
    let rayhandle = mp.raycasting.testCapsule(start, end, 5.0, [mp.players.local.vehicle?.handle], [10])
    if(!rayhandle || !rayhandle.entity) return null;
    return typeof rayhandle.entity === 'number' ? rayhandle.entity : rayhandle.entity.handle
}

const quit = () => {
    if(!helicamTick) return;
    camera.setActive(false);
    mp.game.cam.renderScriptCams(false, false, 0, true, false);
    mp.game.graphics.setTimecycleModifier('default')
    helicamTick = false;
    helicam = false;
    mp.game.graphics.setNightvision(false)
    mp.game.graphics.setSeethrough(false)
    vision_state = 0
    hideHud(false)
}
mp.game.graphics.setSeethrough(false)
mp.game.graphics.setNightvision(false)
mp.game.graphics.setTimecycleModifier('default')
const IsPlayerInPolmav = () => {
    if(!mp.players.local.isInAnyHeli()) return false;
    if(user.isAdminNow()) return true;
    const veh = mp.players.local.vehicle;
    if(!veh) return false;
    const fr = veh.getVariable('fraction')
    if(!fr) return false;
    const frData = fractionCfg.getFraction(fr);
    if(!frData) return false;
    return frData.gos;
}

const IsHeliHighEnough = () => {
    const veh = mp.players.local.vehicle;
    if (!veh) return false;
    return veh.getHeightAboveGround() > 1.5
}

const changeVision = () => {
    if (vision_state == 0) {
        mp.game.graphics.setNightvision(true)
        mp.game.graphics.setSeethrough(false)
        vision_state = 1
    } else if (vision_state == 1) {
        mp.game.graphics.setNightvision(false)
        mp.game.graphics.setSeethrough(true)
        vision_state = 2
    } else {
        mp.game.graphics.setSeethrough(false)
        mp.game.graphics.setNightvision(false)
        vision_state = 0
    }
}

const HideHUDThisFrame = () => {
    mp.game.invoke(system.natives.HIDE_HUD_AND_RADAR_THIS_FRAME)
    mp.game.ui.hideHudComponentThisFrame(19) // weapon wheel
    mp.game.ui.hideHudComponentThisFrame(1) // Wanted Stars
    mp.game.ui.hideHudComponentThisFrame(2) // Weapon icon
    mp.game.ui.hideHudComponentThisFrame(3) // Cash
    mp.game.ui.hideHudComponentThisFrame(4) // MP CASH
    mp.game.ui.hideHudComponentThisFrame(13) // Cash Change
    mp.game.ui.hideHudComponentThisFrame(11) // Floating Help Text
    mp.game.ui.hideHudComponentThisFrame(12) // more floating help text
    mp.game.ui.hideHudComponentThisFrame(15) // Subtitle Text
    mp.game.ui.hideHudComponentThisFrame(18) // Game Stream
}

const CheckInputRotation = (zoomvalue: number) => {
    let rightAxisX = mp.game.controls.getDisabledControlNormal(0, 220)
    let rightAxisY = mp.game.controls.getDisabledControlNormal(0, 221)
    let rotation = camera.getRot(2)
    if (rightAxisX != 0.0 && rightAxisY != 0.0) {
        let new_z = rotation.z + rightAxisX * -1.0 * (speed_ud) * (zoomvalue + 0.1)
        let new_x = Math.max(Math.min(20.0, rotation.x + rightAxisY * -1.0 * (speed_lr) * (zoomvalue + 0.1)), -89.5)
        camera.setRot(new_x, rotation.y, new_z, 2)
    }
}

const HandleZoom = () => {
    if(mp.game.controls.isControlJustPressed(0, 241)) fov = Math.max(fov - zoomspeed, fov_min)
    if(mp.game.controls.isControlJustPressed(0, 242)) fov = Math.min(fov + zoomspeed, fov_max)
    let current_fov = camera.getFov()
    if(Math.abs(fov - current_fov) < 0.1) fov = current_fov
    camera.setFov(current_fov + (fov - current_fov) * 0.05)
}

const RotAnglesToVec = (rot: {x: number, y: number, z: number}) => {
    let z = system.radian(rot.z);
    let x = system.radian(rot.x);
    let num = Math.abs(Math.cos(x));
    return new mp.Vector3(-Math.sin(z)*num, Math.cos(z) * num, Math.sin(x))
}
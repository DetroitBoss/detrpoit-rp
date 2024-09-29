import {system} from "./system";
import {user} from "./user";
import {gui} from "./gui";
import {cursorX} from "./controls";
import {teleportAnticheat} from "./protection";

let _posX = 0;
let _posY = 0;
let _posZ = 0;
let _posH = 0;
let _posR = 0;
let _posRot = 0;
let _currentCam:CameraMp;

export const handleCamZoom = (currentCamera: CameraMp) => {
    if (!currentCamera) return
    if (mp.game.controls.isDisabledControlPressed(0, 241))
        currentCamera.setFov(currentCamera.getFov() - 2)
    else if (mp.game.controls.isDisabledControlPressed(0, 242) &&
        currentCamera.getFov() < 80)
        currentCamera.setFov(currentCamera.getFov() + 2)
}

export const cameraManager = {
    createOrbitCam: (x: number, y: number, z: number, height: number, maxRadius = 100, fov = 20) => {
        _posX = x;
        _posY = y;
        _posZ = z;
        _posH = height;
        _posR = maxRadius;

        // if (
        //     system.distanceToPos2D(
        //         new mp.Vector3(-66.66476, -802.0474, 44.22729),
        //         new mp.Vector3(_posX, _posY, _posZ)
        //     ) < 700
        // )
        //     _posH = 250;

        let newPos = cameraManager.getOrbit(_posX, _posY, _posZ + _posH, 0, _posR);
        _currentCam = mp.cameras.new('orbitCam', newPos, new mp.Vector3(0, 0, 0), fov);
        mp.game.streaming.requestCollisionAtCoord(x, y, z);
        mp.game.streaming.setFocusArea(x, y, z, 0.0, 0.0, 0.0);
        _currentCam.pointAtCoord(x, y, z);
        _currentCam.setActive(true);
        mp.game.cam.renderScriptCams(true, false, 0, false, false);

        return _currentCam;
    },
    changeCamPos: async (x: number, y: number, z: number) => {
        mp.game.streaming.requestCollisionAtCoord(x, y, z);

        user.showLoadDisplay();
        await system.sleep(500);
        _posX = x;
        _posY = y;
        _posZ = z;

        cameraManager.destroyCam();
        cameraManager.createOrbitCam(x, y, z, 100, 100);
        teleportAnticheat(x, y, z)
        mp.players.local.position = new mp.Vector3(x, y, z);

        user.hideLoadDisplay();
    },
    getOrbit: (x: number, y: number, z: number, rot: number, range: number) => {
        let newPos = new mp.Vector3(range * Math.sin(rot) + x, range * Math.cos(rot) + y, z);
        return newPos;
    },
    destroyCam: () => {
        if (_currentCam) {
            _currentCam.destroy();
            mp.game.cam.renderScriptCams(false, true, 500, true, true);
        }
        mp.game.invoke('0x31B73D1EA9F01DA2');

        _posX = 0;
        _posY = 0;
        _posZ = 0;
        _posH = 0;
        _posR = 0;
        _currentCam = null;
    },

}

mp.events.add('render', () => {
    if (!mp.gui.cursor.visible) return;
    if (gui.currentGui) return;
    if (cursorX == 0) {
        mp.game.cam.setGameplayCamRelativeHeading(mp.game.cam.getGameplayCamRelativeHeading() + 1.5);
    } else if (cursorX >= 0.999) {
        mp.game.cam.setGameplayCamRelativeHeading(mp.game.cam.getGameplayCamRelativeHeading() - 1.5);
    }
})
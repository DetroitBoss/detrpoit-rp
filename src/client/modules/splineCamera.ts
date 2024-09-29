import {DialogInput, MenuClass} from "./menu";
import {system} from "./system";
import {user} from "./user";
import {cameraManager} from "./camera";
import {CamerasManager, drawCamera} from "./cameraManager";
import {CustomEvent} from "./custom.event";
import {hideHud} from "./gui";

let point1: Vector3Mp;
let rot1: Vector3Mp;
let point2: Vector3Mp;
let rot2: Vector3Mp;
let fov: number = 70;

export default class SplineCameraGUI {
    /** Создать нативное меню управления */ 
    public static createMenu(): void {
        let menu = new MenuClass('Сплайн камера');
        menu.exitProtect = true;
        menu.newItem({
            name: 'Установить точку 1',
            desc: 'Используется положение и поворот персонажа',
            onpress: () => {
                point1 = mp.players.local.position;
                rot1 = mp.game.cam.getGameplayCamRot(0)
            }
        })

        menu.newItem({
            name: 'Установить точку 2',
            desc: 'Используется положение и поворот персонажа',
            onpress: () => {
                point2 = mp.players.local.position;
                rot2 = mp.game.cam.getGameplayCamRot(0)
            }
        })

        menu.newItem({
            name: 'FOV',
            desc: 'Поле зрения камеры (70 по умолч.)',
            onpress: () => {
                DialogInput('Введите значени Field of View', 0, 1000, 'int').then(val => {
                    if (!val || isNaN(val) || val <= 0) return;
                    fov = val;
                })
            }
        })

        menu.newItem({
            name: 'Запустить пролет',
            desc: 'Запустить пролет от точки1 до точки2',
            onpress: () => {
                MenuClass.closeMenu()
                DialogInput('Введите время перехода в мс', 0, 1000000, 'int').then(val => {
                    if (!val || isNaN(val) || val <= 0) return;
                    drawCamera(point1, rot1, point2, rot2, fov, val)
                    hideHud(true)
                })
            }
        })
        menu.open();
    }
}

class SplineCamera {
    private readonly _cameraIndex: number;
    private _currentNodeIndex: number = 0;
    private _isActive: boolean;
    
    constructor() {
        this._cameraIndex = mp.game.cam.createCam('DEFAULT_SPLINE_CAMERA', false);
    }

    /**
     * Добавить точку движения камере
     * @param position - Координаты точки
     * @param rotation - Поворот камеры в момент
     */
    public addNode(position: Vector3Mp, rotation: Vector3Mp): void {
        mp.game.cam.addCamSplineNode(
            this._cameraIndex, 
            position.x, position.y, position.z, 
            rotation.x, rotation.y, rotation.z, 
            100, 100, 1
        );
    }

    /**
     * Начать переход к следующей точке
     * @param transitionTime - Время перехода
     * @param waitTime - Время ожидания в точке
     */
    public startTransitionToNextNode(transitionTime: number, waitTime: number = 0): void {
        if (!this._isActive) {
            mp.game.cam.renderScriptCams(true, false, 0, false, false);
            this._isActive = true;
        }
        user.notify('index ' + mp.game.cam.getCamSplineNodePhase(this._cameraIndex))
        user.notify('index2 ' + this._currentNodeIndex)
        mp.game.cam.setCamSplineDuration(this._cameraIndex, transitionTime);
        mp.game.cam.setCamSplinePhase(this._cameraIndex, this._currentNodeIndex++);
        //await system.sleep(waitTime + transitionTime);
    }
    
    public destroy(): void {
        mp.game.cam.renderScriptCams(false, false, 0, false, true);
    }
}

let cam = new SplineCamera();

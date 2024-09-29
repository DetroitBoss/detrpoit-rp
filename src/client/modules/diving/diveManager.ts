import {
    CHEST_PROP,
    ChestData, SHIP_PROP
} from "../../../shared/diving/work.config";
import {ChestDTO} from "../../../shared/diving/dto";
import {colshapes, colshapeHandle} from "../checkpoints";
import {CustomEvent} from "../custom.event";
import {user} from "../user";
import {createRouteBlip, destroyRouteBlip} from "../blips";
import {DivingGameComponent} from "../../../shared/diving/minigames.config";
import {gui} from "../gui";
import { system } from "../system";

export class DiveManager {
    private _inClothes: boolean = false;
    private _divePosition: Vector3Mp;
    private _chestData: ChestData;
    private _isGoingToWater: boolean | null = null;
    private _player: PlayerMp;
    private _chestObject: ObjectMp;
    private _interaction: colshapeHandle;
    public _interval: number;
    private _haveTime: number = 40;
    private _routeBlip: boolean = false;
    private _shipObject?: ObjectMp;
    private _chestBlip: BlipMp;
    private _chestInteraction: colshapeHandle;
    public _isCompleted: boolean = false;
    private _chestMiniGameCompleted: boolean = false;
    private _isMapMission: boolean = false;
    private _oxygen: number = 1200;
    private _maxOxygen: number = 1200;
    private _oxygenInterval: number;

    constructor(data: ChestDTO) {
        this._divePosition = data.divePosition;
        this._chestData = data.chestData;
        this._player = mp.players.local;
        this._isMapMission = data.shipData !== undefined;

        /*

            Спавн сундука

         */

        this._chestObject = mp.objects.new(CHEST_PROP, this._chestData.position, {
            rotation: this._chestData.rotation
        })

        this._chestBlip = system.createBlip(
            351,
            6,
            this._chestData.position,
            "Клад",
            0,
            true
        )

        this._chestInteraction = colshapes.new(
            new mp.Vector3(
                this._chestObject.position.x,
                this._chestObject.position.y,
                this._chestObject.position.z - 1),
            'Взломать сундук',
            () => {
                if (!this._inClothes) return user.notify('Необходимо надеть водолазный костюм');
                this._player.freezePosition(true);
                if (!this._chestMiniGameCompleted) {
                    data.shipData !== undefined ?
                        this.openMiniGame('chest')
                        :
                        this.openMiniGame('lock');
                }else{
                    this.openMiniGame('net');
                }
            },
            {
                color: [0, 0, 0, 0],
                radius: 3
            }
        )

        if (data.shipData) {
            this._shipObject = mp.objects.new(SHIP_PROP, data.shipData.position, {
                rotation: data.shipData.rotation
            })
        }

        /*

            Место погружения

         */

        createRouteBlip('Место погружения', this._divePosition, 81);
        this._routeBlip = true;
        this._interaction = colshapes.new(
            new mp.Vector3(
                this._divePosition.x,
                this._divePosition.y,
                this._divePosition.z - 1,
            ),
            "Надеть костюм",
            () => {
                if (this._inClothes) return user.notify('Вы уже одели водолазный костюм', 'error');
                CustomEvent.triggerServer('diving:dive');
            },
            {
                radius: 1.5,
                type: 1,
                color: [255, 255, 0, 255]
            }
        )

        this._interval = setInterval(() => {
            if (this._isGoingToWater === null) return;

            if (this.isInWater()) {
                if (this._isGoingToWater === true) {
                    this._isGoingToWater = false;
                    this._haveTime = 0;
                }
            }else{
                if (this._isGoingToWater === true) {
                    if (this._haveTime <= 0) {
                        this.dropCloth();
                    }else{
                        this._haveTime -= 1;
                    }

                }else{
                    this.dropCloth();
                    if (this._isCompleted) {
                        mp.events.call('diving:clearDiveManager');
                        clearInterval(this._interval);
                        CustomEvent.triggerServer('diving:missionCompleted');
                    }
                }
            }
        }, 500);
    }

    chestGameFinishHandle(success: boolean) {
        if (!success) {
            gui.setGui(null);
            user.notify('Вы провалили мини игру, попробуйте ещё раз', 'error');
            this._player.freezePosition(false);
            return;
        }
        this.openMiniGame('net');
    }

    collectGameFinishHandle() {
        this._player.freezePosition(false);
        this.destroy();
        this._isCompleted = true;
        CustomEvent.triggerServer('diving:reward', this._isMapMission);
    }

    openMiniGame(component: DivingGameComponent) {
        gui.setGui('divingGames');
        CustomEvent.triggerCef('divingGame:setComponent', component);
    }

    isInWater() {
        return this._player.isSwimming() || this._player.isSwimmingUnderWater();
    }

    dive() {
        this._haveTime = 40;
        this._inClothes = true;
        this._isGoingToWater = true;
        user.notify('У вас есть 20 секунд для погружения', 'info');
        this.activateOxygen();
    }

    dropCloth() {
        if (!this._inClothes) return;
        this._isGoingToWater = null;
        this._inClothes = false;
        CustomEvent.triggerServer('diving:dropCloth');
        this.deactivateOxygen();
    }

    activateOxygen() {
        this._oxygen = this._maxOxygen;
        this.updateOxygen(true);
        this.showHudOxygen(true);
        this._player.setMaxTimeUnderwater(600);

        this._oxygenInterval = setInterval(() => {
            if (this._player.isSwimmingUnderWater()) {
                if (this._oxygen <= 0) {
                } else if (this._oxygen >= this._maxOxygen) {
                    this._oxygen -= 4;
                } else {
                    if (this._oxygen - 4 < 0) {
                        this._oxygen = 0;
                    } else {
                        this._oxygen -= 4;
                    }
                }
            }
            this.updateOxygen(false);
        }, 2000);
    }

    deactivateOxygen() {
        this._player.setMaxTimeUnderwater(17.5);
        if (this._oxygenInterval) clearInterval(this._oxygenInterval);
        this._oxygenInterval = undefined;
        this.showHudOxygen(false);
    }

    showHudOxygen(toggle: boolean) {
        CustomEvent.triggerCef('diving:oxygen:show', toggle);
    }

    updateOxygen(setMaxOxygen = false) {
        if (setMaxOxygen) {
            CustomEvent.triggerCef('diving:oxygen:update', this._oxygen, this._maxOxygen);
        }else{
            CustomEvent.triggerCef('diving:oxygen:update', this._oxygen)
        }
    }

    destroy() {

        if (this._shipObject && mp.objects.exists(this._shipObject)) {
            this._shipObject.destroy();
            this._shipObject = undefined;
        }
        if (this._interaction) this._interaction.destroy();
        if (this._chestObject && mp.objects.exists(this._chestObject)) {
            this._chestObject.destroy();
            this._chestObject = undefined;
        }
        if (this._routeBlip) {
            destroyRouteBlip('Место погружения');
            this._routeBlip = false;
        }
        if (this._chestBlip && this._chestBlip.doesExist()) {
            this._chestBlip.destroy();
            this._chestBlip = undefined;
        }
        if (this._chestInteraction) {
            this._chestInteraction.destroy();
            this._chestInteraction = undefined;
        }
    }
}
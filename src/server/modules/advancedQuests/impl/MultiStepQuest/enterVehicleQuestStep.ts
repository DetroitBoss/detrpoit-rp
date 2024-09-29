import {QuestStep} from "./questStep";
import {QuestVehicleFactory} from "../../questVehicleFactory";
import {Vehicle} from "../../../vehicles";
import {IQuestStepFactory} from "./IQuestStepFactory";
import {QuestStepDto} from "../../../../../shared/advancedQuests/dtos";
import {QUESTS_ROUTE_BLIP_COLOR, QUESTS_ROUTE_BLIP_NAME} from "../../index";
import {CustomEvent} from "../../../custom.event";
import {
    ENTER_VEHICLE_STEP_DESTROY_MARKER,
    ENTER_VEHICLE_STEP_MARK_VEHICLE
} from "../../../../../shared/advancedQuests/config";

export class EnterVehicleQuestStepFactory implements IQuestStepFactory {
    private readonly _vehicleFactory: QuestVehicleFactory;
    private readonly _destroyVehicleAfterQuest: boolean;

    constructor(
        vehicleFactory: QuestVehicleFactory,
        destroyVehicleAfterQuest: boolean
    ) {
        this._vehicleFactory = vehicleFactory;
        this._destroyVehicleAfterQuest = destroyVehicleAfterQuest;
    }

    createQuestStep(player: PlayerMp, data: any): QuestStep {
        return new EnterVehicleQuestStep(player, this._vehicleFactory, this._destroyVehicleAfterQuest);
    }
}

class EnterVehicleQuestStep extends QuestStep {
    private readonly _vehicleFactory: QuestVehicleFactory;
    private readonly _destroyVehicleAfterQuest: boolean;
    private _vehicle: VehicleMp;

    get hudDto(): QuestStepDto {
        return {
            name: `Доберитесь и сядьте в машину`,
            completed: this.isComplete
        }
    }

    get isComplete(): boolean {
        return false;
    }

    constructor(
        player: PlayerMp,
        vehicleFactory: QuestVehicleFactory,
        destroyVehicleAfterQuest: boolean
    ) {
        super(player);

        this._vehicleFactory = vehicleFactory;
        this._destroyVehicleAfterQuest = destroyVehicleAfterQuest;
    }

    init(nextStep: () => void, updateHud: () => void) {
        super.init(nextStep, updateHud);

        this._vehicle = this._vehicleFactory.create(this._player);
        CustomEvent.triggerClient(this._player, ENTER_VEHICLE_STEP_MARK_VEHICLE, this._vehicle.id);

        this._player.user.createRouteBlip(QUESTS_ROUTE_BLIP_NAME, this._vehicle.position, QUESTS_ROUTE_BLIP_COLOR);
        mp.events.add('playerEnterVehicle', this.playerEnterVehicleHandler);
    }

    onDestroy() {
        CustomEvent.triggerClient(this._player, ENTER_VEHICLE_STEP_DESTROY_MARKER);
        this._player.user.destroyRouteBlip(QUESTS_ROUTE_BLIP_NAME);
        mp.events.remove('playerEnterVehicle', this.playerEnterVehicleHandler);

        if (!this._destroyVehicleAfterQuest) {
            Vehicle.destroy(this._vehicle);
        }
    }

    onQuestDestroy() {
        if (this._destroyVehicleAfterQuest) {
            Vehicle.destroy(this._vehicle);
        }
    }

    private playerEnterVehicleHandler = (player: PlayerMp, vehicle: VehicleMp, seat: number) => {
        if (player === this._player && vehicle === this._vehicle) {
            Vehicle.setEngine(vehicle, true);

            this._nextStep();
        }
    }
}
import {QuestStep} from "./questStep";
import {systemUtil} from "../../../../../shared/system";
import {IQuestStepFactory} from "./IQuestStepFactory";
import {QuestStepDto} from "../../../../../shared/advancedQuests/dtos";
import {QUESTS_ROUTE_BLIP_COLOR, QUESTS_ROUTE_BLIP_NAME} from "../../index";

export class GetToPositionQuestStepFactory implements IQuestStepFactory {
    private readonly _position: Vector3Mp;
    private readonly _range: number;

    constructor(position: Vector3Mp, range: number) {
        this._position = position;
        this._range = range;
    }

    createQuestStep(player: PlayerMp, data: any): QuestStep {
        return new GetToPositionQuestStep(player, this._position, this._range);
    }
}

class GetToPositionQuestStep extends QuestStep {
    private readonly _targetPosition: Vector3Mp;
    private readonly _range: number;
    private _checkInterval: number;

    get hudDto(): QuestStepDto {
        return {
            name: `Доберитесь до метки`,
            completed: this.isComplete,
            notShowIfCompleted: true
        }
    }

    get isComplete(): boolean {
        if (!mp.players.exists(this._player)) {
            return false;
        }

        return systemUtil.distanceToPos(this._player.position, this._targetPosition) <= this._range;
    }

    constructor(player: PlayerMp, position: Vector3Mp, range: number) {
        super(player);

        this._targetPosition = position;
        this._range = range;
    }

    init(nextStep: () => void, updateHud: () => void) {
        super.init(nextStep, updateHud);

        this._player.user.createRouteBlip(QUESTS_ROUTE_BLIP_NAME, this._targetPosition, QUESTS_ROUTE_BLIP_COLOR);
        this._checkInterval = setInterval(this.checkIntervalHandler, 3000);
    }

    onDestroy(): void {
        clearInterval(this._checkInterval);
        this._player.user.destroyRouteBlip(QUESTS_ROUTE_BLIP_NAME);
    }

    onQuestDestroy(): void {
    }

    checkIntervalHandler = () => {
        if (!mp.players.exists(this._player)) {
            clearInterval(this._checkInterval);
        }

        if (this.isComplete) {
            this._nextStep();
        }
    }
}
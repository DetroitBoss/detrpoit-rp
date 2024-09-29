import {QuestStep} from "./questStep";
import {IQuestSavable} from "../../interfaces/IQuestSavable";
import {QuestStepDto} from "../../../../../shared/advancedQuests/dtos";
import {AnimationData} from "../../../../../shared/anim";
import {CustomEvent} from "../../../custom.event";
import {
    COLLECT_CHECKPOINT_COLLECTED_EVENT,
    COLLECT_CHECKPOINT_INIT_EVENT
} from "../../../../../shared/advancedQuests/config";
import {IQuestStepFactory} from "./IQuestStepFactory";
import {QUESTS_ROUTE_BLIP_COLOR, QUESTS_ROUTE_BLIP_NAME} from "../../index";

export class CollectCheckpointQuestStepFactory implements IQuestStepFactory {
    private readonly _position: Vector3Mp;
    private readonly _animation: AnimationData;
    private readonly _helpText: string;

    constructor(position: Vector3Mp, animation: AnimationData, helpText: string) {
        this._position = position;
        this._animation = animation;
        this._helpText = helpText;
    }

    createQuestStep(player: PlayerMp, data: any): QuestStep {
        return new CollectCheckpointQuestStep(
            player,
            this._position,
            this._animation,
            this._helpText,
            data == null ? false : data as boolean
        );
    }
}

class CollectCheckpointQuestStep extends QuestStep implements IQuestSavable {
    private readonly _position: Vector3Mp;
    private readonly _animation: AnimationData;
    private readonly _helpText: string;
    private _completed: boolean;

    get hudDto(): QuestStepDto {
        return {
            name: '',
            completed: this._completed
        };
    }

    get isComplete(): boolean {
        return this._completed;
    }

    constructor(player: PlayerMp, position: Vector3Mp, animation: AnimationData, helpText: string, completed: boolean) {
        super(player);

        this._position = position;
        this._animation = animation;
        this._helpText = helpText;
        this._completed = completed;
    }

    init(nextStep: () => void, update: () => void) {
        super.init(nextStep, update);

        this._player.user.createRouteBlip(QUESTS_ROUTE_BLIP_NAME, this._position, QUESTS_ROUTE_BLIP_COLOR);
        CustomEvent.registerClient(COLLECT_CHECKPOINT_COLLECTED_EVENT, this.handleCollect);

        CustomEvent.triggerClient(this._player, COLLECT_CHECKPOINT_INIT_EVENT, this._position, this._helpText);
    }

    handleCollect = async () => {
        if (this._animation) {
            await this._player.user.playAnimationWithResult(
                [this._animation.dictionary, this._animation.name],
                this._animation.durationSec,
                this._helpText
            );
        }

        mp.events.call('advancedQuests:collectCheckpointComplete', this._player);
        
        this._completed = true;
        this._nextStep();
    }

    onDestroy(): void {
        CustomEvent.unregisterClient(COLLECT_CHECKPOINT_COLLECTED_EVENT, this.handleCollect);
        this._player.user.destroyRouteBlip(QUESTS_ROUTE_BLIP_NAME);
    }

    onQuestDestroy(): void {
    }

    getSaveData = (): any => {
        return this.isComplete;
    }
}
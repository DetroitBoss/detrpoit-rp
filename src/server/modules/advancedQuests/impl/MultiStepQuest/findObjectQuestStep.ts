import {QuestStep} from "./questStep";
import {IQuestSavable} from "../../interfaces/IQuestSavable";
import {IQuestStepFactory} from "./IQuestStepFactory";
import {Vector3WithHeading} from "../../../../../shared/system";
import {system} from "../../../system";
import {getRandomInt} from "../../../../../shared/arrays";
import {CustomEvent} from "../../../custom.event";
import {
    FIND_OBJECT_QUEST_STEP_COLLECT_EVENT, FIND_OBJECT_QUEST_STEP_DESTROY_EVENT,
    FIND_OBJECT_QUEST_STEP_INIT_EVENT
} from "../../../../../shared/advancedQuests/config";
import {QuestStepDto} from "../../../../../shared/advancedQuests/dtos";

export class FindObjectQuestStepFactory implements IQuestStepFactory {
    private readonly _objectName: string;
    private readonly _objectModel: string;
    private readonly _positions: Vector3WithHeading[];
    private readonly _goal: number;

    constructor(objectName: string, objectModel: string, positions: Vector3WithHeading[], goal: number) {
        this._objectName = objectName;
        this._objectModel = objectModel;
        this._positions = positions;
        this._goal = goal;

        if (goal > positions.length) {
            system.debug.error(`[QUESTS] [FindObjectQuestStepFactory]: goal (${goal}) is more than positions count (${positions.length})`);
        }
    }

    createQuestStep(player: PlayerMp, data: any): QuestStep {
        const positions = this.getPositions();
        return new FindObjectQuestStep(
            player,
            this._objectName,
            this._objectModel,
            positions,
            this._goal,
            data == null ? 0 : data as number
        );
    }

    getPositions(): Vector3WithHeading[] {
        const positionIndexes: number[] = [];

        for (let i = 0; i < this._goal; i++) {
            let idx: number;
            do {
                idx = getRandomInt(0, this._positions.length - 1);
            } while (positionIndexes.some(i => i === idx))

            positionIndexes.push(idx);
        }

        return positionIndexes.map(idx => this._positions[idx]);
    }
}

class FindObjectQuestStep extends QuestStep implements IQuestSavable {
    private readonly _objectName: string;
    private readonly _objectModel: string;
    private readonly _positions: Vector3WithHeading[]
    private readonly _goal: number;
    private _count: number;

    get hudDto(): QuestStepDto {
        return {
            name: `Найдите ${this._objectName}`,
            completed: this.isComplete,
            count: this._count,
            countGoal: this._goal
        }
    }

    get isComplete(): boolean {
        return this._count >= this._goal;
    }

    constructor(player: PlayerMp, objectName: string, objectModel: string, positions: Vector3WithHeading[], goal: number, count: number) {
        super(player);

        this._objectName = objectName;
        this._objectModel = objectModel;
        this._positions = positions;
        this._goal = goal;
        this._count = count;
    }

    init(nextStep: () => void, updateHud: () => void) {
        super.init(nextStep, updateHud);

        CustomEvent.triggerClient(this._player, FIND_OBJECT_QUEST_STEP_INIT_EVENT, this._objectModel, this._positions);
        CustomEvent.registerClient(FIND_OBJECT_QUEST_STEP_COLLECT_EVENT, this.handleCollectObject);
    }

    handleCollectObject = (player: PlayerMp) => {
        if (player !== this._player) {
            return;
        }

        this._count++;
        this.update();

        if (this._count >= this._goal) {
            this._nextStep();
        }
    }

    onDestroy(): void {
        CustomEvent.unregisterClient(FIND_OBJECT_QUEST_STEP_COLLECT_EVENT, this.handleCollectObject);
        CustomEvent.triggerClient(this._player, FIND_OBJECT_QUEST_STEP_DESTROY_EVENT);
    }

    onQuestDestroy(): void {
    }

    getSaveData = (): any => {
        return this._count;
    }
}
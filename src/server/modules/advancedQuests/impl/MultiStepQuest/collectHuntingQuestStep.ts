import {QuestStep} from "./questStep";
import {IQuestStepFactory} from "./IQuestStepFactory";
import {IQuestSavable} from "../../interfaces/IQuestSavable";
import {HUNTING_ANIMAL_SKINNED_EVENT} from "../../../hunting";
import {QuestStepDto} from "../../../../../shared/advancedQuests/dtos";
import {getBaseItemNameById} from "../../../../../shared/inventory";

export class CollectHuntingQuestStepFactory implements IQuestStepFactory {
    private readonly _item_id: number;
    private readonly _goalCount: number;

    constructor(item_id: number, huntingGoal: number) {
        this._item_id = item_id;
        this._goalCount = huntingGoal;
    }

    createQuestStep(player: PlayerMp, data: any): QuestStep {
        return new CollectHuntingQuestStep(player, this._item_id, this._goalCount,
            data == null ? 0 : data as number);
    }
}

class CollectHuntingQuestStep extends QuestStep implements IQuestSavable {
    private readonly _goalCount: number;
    private readonly _item_id: number;
    private _huntingCount: number;

    constructor(player: PlayerMp, item_id: number, goalCount: number, huntingCount: number) {
        super(player);
        this._item_id = item_id;
        this._goalCount = goalCount;
        this._huntingCount = huntingCount;
    }

    get hudDto(): QuestStepDto {
        return {
            name: `Добудьте ${getBaseItemNameById(this._item_id)}`,
            completed: this.isComplete,
            count: this._huntingCount,
            countGoal: this._goalCount
        }
    }

    get isComplete(): boolean {
        return this._huntingCount >= this._goalCount;
    }

    init(nextStep: () => void, updateHud: () => void) {
        super.init(nextStep, updateHud);

        mp.events.add(HUNTING_ANIMAL_SKINNED_EVENT, this.collectHuntingHandler);
    }

    collectHuntingHandler = (player: PlayerMp, item_id: number) => {
        if (player !== this._player || item_id !== this._item_id) {
            return;
        }

        this._huntingCount++;
        this.update();

        if (this.isComplete) {
            this._nextStep();
        }
    }

    onDestroy(): void {
        mp.events.remove(HUNTING_ANIMAL_SKINNED_EVENT, this.collectHuntingHandler);
    }

    onQuestDestroy(): void {
    }

    getSaveData = (): any => {
        return this._huntingCount;
    }
}
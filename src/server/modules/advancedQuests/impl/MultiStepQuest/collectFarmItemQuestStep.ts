import {QuestStep} from "./questStep";
import {IQuestSavable} from "../../interfaces/IQuestSavable";
import {IQuestStepFactory} from "./IQuestStepFactory";
import {FARM_COLLECT_EVENT} from "../../../farm/events";
import {QuestStepDto} from "../../../../../shared/advancedQuests/dtos";
import {getBaseItemNameById} from "../../../../../shared/inventory";

export class CollectFarmItemQuestStepFactory implements IQuestStepFactory {
    private readonly _item_id: number;
    private readonly _goalCount: number;

    constructor(item_id: number, goalCount: number) {
        this._item_id = item_id;
        this._goalCount = goalCount;
    }

    createQuestStep(player: PlayerMp, data: any): QuestStep {
        return new CollectFarmItemQuestStep(player, this._item_id, this._goalCount,
            data == null ? 0 : data as number);
    }
}

class CollectFarmItemQuestStep extends QuestStep implements IQuestSavable {
    private readonly _item_id: number;
    private readonly _goalCount: number;
    private _collectedCount: number;

    get hudDto(): QuestStepDto {
        return {
            name: `Соберите на ферме ${getBaseItemNameById(this._item_id)}`,
            completed: this.isComplete,
            count: this._collectedCount,
            countGoal: this._goalCount
        }
    }

    get isComplete(): boolean {
        return this._collectedCount >= this._goalCount;
    }

    constructor(player: PlayerMp, item_id: number, goalCount: number, collectedCount: number) {
        super(player);

        this._item_id = item_id;
        this._goalCount = goalCount;
        this._collectedCount = collectedCount;
    }

    init(nextStep: () => void, updateHud: () => void) {
        super.init(nextStep, updateHud);

        mp.events.add(FARM_COLLECT_EVENT, this.handleCollectItem);
    }

    handleCollectItem = (player: PlayerMp, item_id: number) => {
        if (player !== this._player || item_id !== this._item_id) {
            return;
        }

        this._collectedCount++;
        this.update();

        if (this.isComplete) {
            this._nextStep();
        }
    }

    onDestroy(): void {
        mp.events.remove(FARM_COLLECT_EVENT, this.handleCollectItem);
    }

    onQuestDestroy(): void {
    }

    getSaveData = (): any => {
        return this._collectedCount;
    }

}
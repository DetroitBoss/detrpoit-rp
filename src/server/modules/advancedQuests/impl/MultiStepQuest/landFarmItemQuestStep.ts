import {IQuestStepFactory} from "./IQuestStepFactory";
import {QuestStep} from "./questStep";
import {IQuestSavable} from "../../interfaces/IQuestSavable";
import {QuestStepDto} from "../../../../../shared/advancedQuests/dtos";
import {getBaseItemNameById} from "../../../../../shared/inventory";
import {FARM_LAND_EVENT} from "../../../farm/events";

export class LandFarmItemQuestStepFactory implements IQuestStepFactory {
    private readonly _item_id: number;
    private readonly _goalCount: number;

    constructor(item_id: number, goalCount: number) {
        this._item_id = item_id;
        this._goalCount = goalCount;
    }

    createQuestStep(player: PlayerMp, data: any): QuestStep {
        return new LandFarmItemQuestStep(player, this._item_id, this._goalCount,
            data == null ? 0 : data as number);
    }
}

class LandFarmItemQuestStep extends QuestStep implements IQuestSavable {
    private readonly _item_id: number;
    private readonly _goalCount: number;
    private _plantedCount: number;

    get hudDto(): QuestStepDto {
        return {
            name: `Посадите на ферме ${getBaseItemNameById(this._item_id)}`,
            completed: this.isComplete,
            count: this._plantedCount,
            countGoal: this._goalCount
        }
    }

    get isComplete(): boolean {
        return this._plantedCount >= this._goalCount;
    }

    constructor(player: PlayerMp, item_id: number, goalCount: number, collectedCount: number) {
        super(player);

        this._item_id = item_id;
        this._goalCount = goalCount;
        this._plantedCount = collectedCount;
    }

    init(nextStep: () => void, updateHud: () => void) {
        super.init(nextStep, updateHud);

        mp.events.add(FARM_LAND_EVENT, this.handleLandItem);
    }

    handleLandItem = (player: PlayerMp, item_id: number) => {
        if (player !== this._player || item_id !== this._item_id) {
            return;
        }

        this._plantedCount++;
        this.update();

        if (this.isComplete) {
            this._nextStep();
        }
    }

    onDestroy(): void {
        mp.events.remove(FARM_LAND_EVENT, this.handleLandItem);
    }

    onQuestDestroy(): void {
    }

    getSaveData = (): any => {
        return this._plantedCount;
    }

}
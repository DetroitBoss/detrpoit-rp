import {QuestStep} from "./questStep";
import {IQuestSavable} from "../../interfaces/IQuestSavable";
import {SHOP_BUY_ITEM_EVENT} from "../../../businesses/shop";
import {IQuestStepFactory} from "./IQuestStepFactory";
import { QuestStepDto } from "shared/advancedQuests/dtos";
import {getBaseItemNameById} from "../../../../../shared/inventory";

export class BuyItemQuestStepFactory implements IQuestStepFactory {
    private readonly _item_id: number;
    private readonly _goalCount: number;

    constructor(item_id: number, goalCount: number) {
        this._item_id = item_id;
        this._goalCount = goalCount;
    }

    createQuestStep(player: PlayerMp, data: any): QuestStep {
        return new BuyItemQuestStep(player, this._item_id, this._goalCount,
            data == null ? 0 : data as number);
    }
}

class BuyItemQuestStep extends QuestStep implements IQuestSavable {
    private readonly _item_id: number;
    private readonly _goalCount: number;
    private _currentCount: number;

    get isComplete(): boolean {
        return this._currentCount >= this._goalCount;
    }

    get hudDto(): QuestStepDto {
        return {
            name: `Купите ${getBaseItemNameById(this._item_id)}`,
            completed: this.isComplete,
            count: this._currentCount,
            countGoal: this._goalCount
        }
    }

    constructor(player: PlayerMp, item_id: number, goalCount: number, currentCount: number) {
        super(player);
        this._item_id = item_id;
        this._goalCount = goalCount;
        this._currentCount = currentCount;
    }

    init(nextStep: () => void, updateHud: () => void) {
        super.init(nextStep, updateHud);

        mp.events.add(SHOP_BUY_ITEM_EVENT, this.handleBuyItem);
    }

    handleBuyItem = (player: PlayerMp, item_id: number, count: number) => {
        if (player !== this._player || item_id !== this._item_id) {
            return;
        }

        this._currentCount += count;
        this.update();

        if (this.isComplete) {
            this._nextStep();
        }
    }

    onDestroy(): void {
        mp.events.remove(SHOP_BUY_ITEM_EVENT, this.handleBuyItem);
    }

    onQuestDestroy(): void {
    }

    getSaveData = (): any => {
        return this._currentCount;
    }

}
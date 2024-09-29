import {IQuestStepFactory} from "./IQuestStepFactory";
import {QuestStep} from "./questStep";
import {IQuestSavable} from "../../interfaces/IQuestSavable";
import {QuestStepDto} from "../../../../../shared/advancedQuests/dtos";
import {getBaseItemNameById} from "../../../../../shared/inventory";
import {ItemEntity} from "../../../typeorm/entities/inventory";

export const TRADE_ITEM_PLAYER_EVENT = 'advancedQuests:tradePlayerStep';

export class TradeItemPlayerQuestStepFactory implements IQuestStepFactory {
    private readonly _item_id: number;
    private readonly _goalCount: number;

    constructor(item_id: number, goalCount: number) {
        this._item_id = item_id;
        this._goalCount = goalCount;
    }

    createQuestStep(player: PlayerMp, data: any): QuestStep {
        return new TradeItemPlayerQuestStep(player, this._item_id, this._goalCount,
            data == null ? 0 : data as number);
    }
}

class TradeItemPlayerQuestStep extends QuestStep implements IQuestSavable {
    private readonly _item_id: number;
    private readonly _goalCount: number;
    private _tradedCount: number;

    get hudDto(): QuestStepDto {
        return {
            name: `При помощи функционального обмена передать ${getBaseItemNameById(this._item_id)}`,
            completed: this.isComplete,
            count: this._tradedCount,
            countGoal: this._goalCount
        }
    }

    get isComplete(): boolean {
        return this._tradedCount >= this._goalCount;
    }

    constructor(player: PlayerMp, item_id: number, goalCount: number, tradedCount: number) {
        super(player);

        this._item_id = item_id;
        this._goalCount = goalCount;
        this._tradedCount = tradedCount;
    }

    init(nextStep: () => void, updateHud: () => void) {
        super.init(nextStep, updateHud);

        mp.events.add(TRADE_ITEM_PLAYER_EVENT, this.handleTradeItem);
    }

    handleTradeItem = (player: PlayerMp, items: ItemEntity[]) => {
        if (player !== this._player) {
            return;
        }

        if (items.findIndex(el => el.item_id === this._item_id) === -1) return;

        this._tradedCount++;
        this.update();

        if (this.isComplete) {
            this._nextStep();
        }
    }

    onDestroy(): void {
        mp.events.remove(TRADE_ITEM_PLAYER_EVENT, this.handleTradeItem);
    }

    onQuestDestroy(): void {
    }

    getSaveData = (): any => {
        return this._tradedCount;
    }

}
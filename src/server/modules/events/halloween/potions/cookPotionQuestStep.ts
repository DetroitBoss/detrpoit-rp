import {IQuestStepFactory} from "../../../advancedQuests/impl/MultiStepQuest/IQuestStepFactory";
import {COOK_POTION_EVENT, POTIONS_RECIPES, PotionType} from "../../../../../shared/events/halloween.potions";
import {QuestStep} from "../../../advancedQuests/impl/MultiStepQuest/questStep";
import {IQuestSavable} from "../../../advancedQuests/interfaces/IQuestSavable";
import {QuestStepDto} from "../../../../../shared/advancedQuests/dtos";
import {getBaseItemNameById, inventoryShared} from "../../../../../shared/inventory";

export class CookPotionQuestStepFactory implements IQuestStepFactory {
    private readonly _potionType: PotionType;
    private readonly _goalCount: number;

    constructor(potionType: PotionType, goalCount: number) {
        this._potionType = potionType;
        this._goalCount = goalCount;
    }

    createQuestStep(player: PlayerMp, data: any): QuestStep {
        return new CookPotionQuestStep(player, this._potionType, this._goalCount,
            data == null ? 0 : data as number);
    }
}

export class CookPotionQuestStep extends QuestStep implements IQuestSavable {
    private readonly _goalCount: number;
    private readonly _potionType: PotionType;
    private _currentCount: number;

    get hudDto(): QuestStepDto {
        const potionName = getBaseItemNameById(
            POTIONS_RECIPES.find(recipe => recipe.type === this._potionType).resultItemId
        );

        return {
            name: `Сварите ${potionName}`,
            completed: this.isComplete,
            count: this._currentCount,
            countGoal: this._goalCount
        }
    }

    get isComplete(): boolean {
        return this._currentCount >= this._goalCount;
    }

    constructor(player: PlayerMp, potionType: PotionType, goalCount: number, currentCount: number) {
        super(player);

        this._potionType = potionType;
        this._goalCount = goalCount;
        this._currentCount = currentCount;
    }

    init(nextStep: () => void, update: () => void) {
        super.init(nextStep, update);

        mp.events.add(COOK_POTION_EVENT, this.handleCookPotion);
    }

    onDestroy(): void {
        mp.events.remove(COOK_POTION_EVENT, this.handleCookPotion);
    }

    handleCookPotion = (player: PlayerMp, potionType: PotionType) => {
        if (player !== this._player || potionType !== this._potionType) {
            return;
        }

        this._currentCount++;
        this.update();

        if (this.isComplete) {
            this._nextStep();
        }
    }

    onQuestDestroy(): void {
    }

    getSaveData = (): any => {
        return this._currentCount;
    }

}
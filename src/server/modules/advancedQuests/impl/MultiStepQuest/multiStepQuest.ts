import {Quest} from "../../interfaces/AbstractQuest";
import {QuestStep} from "./questStep";
import {QuestBase} from "../../interfaces/questBase";
import {IQuestSavable, isObjectImplementsIQuestSavable} from "../../interfaces/IQuestSavable";
import {IQuestFactory} from "../../interfaces/IQuestFactory";
import {IQuestStepFactory} from "./IQuestStepFactory";
import {QuestReward} from "../../interfaces/questReward";
import {QuestDto} from "../../../../../shared/advancedQuests/dtos";
import {CustomEvent} from "../../../custom.event";

export class MultiStepQuestFactory implements IQuestFactory {
    private readonly _stepFactories: IQuestStepFactory[];
    private readonly _questId: string;
    private readonly _reward: QuestReward;
    private readonly _questName: string;

    constructor(
        questId: string,
        questName: string,
        reward: QuestReward,
        stepFactories: IQuestStepFactory[]
    ) {
        this._questId = questId;
        this._questName = questName;
        this._reward = reward;
        this._stepFactories = stepFactories;
    }

    createQuest(player: PlayerMp, data?: any): Quest {
        const stepsData = data == null ? [] : data as any[];
        const steps = this._stepFactories.map((factory, index) =>
            factory.createQuestStep(player, stepsData[index]));

        const baseQuestData: QuestBase = {
            questId: this._questId,
            reward: this._reward,
            player,
        }

        return new MultiStepQuest(baseQuestData, this._questName, steps);
    }
}

class MultiStepQuest extends Quest {
    private readonly _questName: string;
    private readonly _steps: QuestStep[];
    private _stepIndex: number;

    constructor(baseData: QuestBase, questName: string, steps: QuestStep[]) {
        super(baseData);

        this._questName = questName;
        this._steps = steps;
        this._stepIndex = 0;
    }

    init(): void {
        for (let step of this._steps) {
            if (step.isComplete) {
                this._stepIndex++;
                continue;
            }

            step.init(this.nextStep, this.updateHud);
            break;
        }

        this.updateHud();
    }

    destroy(): void {
        this._steps[this._stepIndex].onDestroy();

        for (let step of this._steps) {
            step.onQuestDestroy();
        }

        CustomEvent.triggerCef(this._player, 'advancedQuests::deleteQuest', this._questName);
    }

    getSaveData(): any[] {
        return this._steps.map(step => {
            if (isObjectImplementsIQuestSavable(step)) {
                return (step as IQuestSavable).getSaveData();
            }

            return null;
        });
    }

    updateHud = (): void => {
        const dto: QuestDto = {
            questName: this._questName,
            steps: this._steps.map(step => step.hudDto)
        }

        CustomEvent.triggerCef(this._player, "advancedQuests::updateQuest", dto);
    }

    nextStep = (): void => {
        const currentStep = this._steps[this._stepIndex];
        currentStep.onDestroy();

        while (this._stepIndex + 1 != this._steps.length) {
            this._stepIndex++;
            const step = this._steps[this._stepIndex];

            if (!step.isComplete) {
                step.init(this.nextStep, this.updateHud);
                this.updateHud();
                return;
            }
        }

        this._player.user.advancedQuests.setQuestCompleted(this.id);
    }
}
import {QuestStep} from "./questStep";
import {QuestStepDto} from "../../../../../shared/advancedQuests/dtos";
import {IQuestStepFactory} from "./IQuestStepFactory";
import {IQuestSavable, isObjectImplementsIQuestSavable} from "../../interfaces/IQuestSavable";

export class MultiStepWrapperFactory implements IQuestStepFactory {
    private readonly _stepFactories: IQuestStepFactory[];
    private readonly _mainStepIndex: number;

    constructor(stepFactories: IQuestStepFactory[], mainStepIndex: number) {
        this._stepFactories = stepFactories;
        this._mainStepIndex = mainStepIndex;
    }

    createQuestStep(player: PlayerMp, data: any): QuestStep {
        return new MultiStepWrapper(
            player,
            this._stepFactories.map((factory, index) =>
                factory.createQuestStep(player, index === this._mainStepIndex ? data : null)
            ),
            this._mainStepIndex
        );
    }
}

class MultiStepWrapper extends QuestStep implements IQuestSavable {
    private readonly _steps: QuestStep[];
    private readonly _mainStepIndex: number;
    private _stepIndex: number;

    get isComplete(): boolean {
        return this._steps[this._mainStepIndex].isComplete;
    }

    get hudDto(): QuestStepDto {
        if (this.isComplete) {
            return this._steps[this._mainStepIndex].hudDto;
        }

        return this._steps[this._stepIndex].hudDto;
    }

    constructor(player: PlayerMp, steps: QuestStep[], mainStepIndex: number) {
        super(player);
        this._steps = steps;
        this._mainStepIndex = mainStepIndex;

        this._stepIndex = 0;
    }

    init(nextStep: () => void, update: () => void) {
        super.init(nextStep, update);

        for (let step of this._steps) {
            if (step.isComplete) {
                this._stepIndex++;
                continue;
            }

            step.init(this.nextStep, this.update);
            break;
        }

        this.update();
    }

    private nextStep = () => {
        const currentStep = this._steps[this._stepIndex];
        currentStep.onDestroy();

        while (this._stepIndex + 1 != this._steps.length) {
            this._stepIndex++;
            const step = this._steps[this._stepIndex];

            if (!step.isComplete) {
                step.init(this.nextStep, this.update);
                this.update();
                return;
            }
        }

        this._nextStep();
    }

    onDestroy(): void {
    }

    onQuestDestroy(): void {
        this._steps.forEach(step => step.onQuestDestroy());
    }

    getSaveData = () => {
        const mainStep = this._steps[this._mainStepIndex];

        if (isObjectImplementsIQuestSavable(mainStep)) {
            return (mainStep as IQuestSavable).getSaveData();
        }

        return null;
    }

}
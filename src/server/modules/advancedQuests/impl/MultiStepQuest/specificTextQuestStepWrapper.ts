import {QuestStep} from "./questStep";
import {IQuestSavable, isObjectImplementsIQuestSavable} from "../../interfaces/IQuestSavable";
import {QuestStepDto} from "../../../../../shared/advancedQuests/dtos";
import {IQuestStepFactory} from "./IQuestStepFactory";

export class SpecificTextQuestStepWrapperFactory implements IQuestStepFactory {
    private readonly _hudText: string;
    private readonly _stepFactory: IQuestStepFactory;

    constructor(hudText: string, stepFactory: IQuestStepFactory) {
        this._hudText = hudText;
        this._stepFactory = stepFactory;
    }

    createQuestStep(player: PlayerMp, data: any): QuestStep {
        return new SpecificTextQuestStepWrapper(
            player,
            this._hudText,
            this._stepFactory.createQuestStep(player, data)
        );
    }

}

class SpecificTextQuestStepWrapper extends QuestStep implements IQuestSavable {
    private readonly _hudText: string;
    private readonly _questStep: QuestStep;

    get hudDto(): QuestStepDto {
        const innerHudDto = this._questStep.hudDto;

        return {
            name: this._hudText,
            notShowIfCompleted: false,
            completed: innerHudDto.completed,
            count: innerHudDto.count,
            countGoal: innerHudDto.countGoal
        };
    }

    get isComplete(): boolean {
        return this._questStep.isComplete;
    }

    constructor(player: PlayerMp, hudText: string, questStep: QuestStep) {
        super(player);

        this._hudText = hudText;
        this._questStep = questStep;
    }

    init(nextStep: () => void, update: () => void) {
        super.init(nextStep, update);

        this._questStep.init(nextStep, update);
    }

    onDestroy(): void {
        this._questStep.onDestroy();
    }

    onQuestDestroy(): void {
        this._questStep.onQuestDestroy();
    }

    getSaveData = (): any => {
        if (isObjectImplementsIQuestSavable(this._questStep)) {
            return (this._questStep as IQuestSavable).getSaveData();
        }

        return null;
    }

}
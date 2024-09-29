import {QuestStep} from "./questStep";
import {IQuestSavable} from "../../interfaces/IQuestSavable";
import {QuestStepDto} from "../../../../../shared/advancedQuests/dtos";
import {system} from "../../../system";
import {IQuestStepFactory} from "./IQuestStepFactory";

export class WaitQuestStepFactory implements IQuestStepFactory {
    private readonly _waitTimeMin: number;

    constructor(waitTimeMin: number) {
        this._waitTimeMin = waitTimeMin;
    }

    createQuestStep(player: PlayerMp, data: any): QuestStep {
        return new WaitQuestStep(player, this._waitTimeMin, data);
    }
}

class WaitQuestStep extends QuestStep implements IQuestSavable {
    private readonly _waitTimeMin: number;

    private _waitStartTimestamp: number;
    private _interval: number;

    get hudDto(): QuestStepDto {
        return {
            completed: this.isComplete,
            name: `Подождите ${this._waitTimeMin} минут`
        };
    }

    get isComplete(): boolean {
        return system.timestamp > this._waitStartTimestamp + this._waitTimeMin * 60;
    }

    constructor(player: PlayerMp, waitTimeMin: number, waitStartTimestamp?: number) {
        super(player);

        this._waitTimeMin = waitTimeMin;
        this._waitStartTimestamp = waitStartTimestamp;
    }

    init(nextStep: () => void, update: () => void) {
        if (this._waitStartTimestamp == null) {
            this._waitStartTimestamp = system.timestamp;
        }

        super.init(nextStep, update);
        this._interval = setInterval(this.checkCompleted, 15000);
    }

    checkCompleted = () => {
        if (this.isComplete) {
            this._nextStep();
        }
    }

    onDestroy(): void {
        clearInterval(this._interval);
    }

    onQuestDestroy(): void {
    }

    getSaveData = () => {
        return this._waitStartTimestamp;
    }

}
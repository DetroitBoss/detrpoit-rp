import {IQuestStepFactory} from "./IQuestStepFactory";
import {QuestStep} from "./questStep";
import {IQuestSavable} from "../../interfaces/IQuestSavable";
import {QuestStepDto} from "../../../../../shared/advancedQuests/dtos";

export type JobType = 'electrician' | 'busman:way';
export const JOB_PLAYER_EVENT = "advancedQuests:job";

export class JobQuestStepFactory implements IQuestStepFactory {
    private readonly _goalCount: number;
    private readonly _jobType: JobType;
    private readonly _hudName: string;

    constructor(jobType: JobType, goalCount: number, hudName: string) {
        this._jobType = jobType;
        this._goalCount = goalCount;
        this._hudName = hudName;
    }

    createQuestStep(player: PlayerMp, data: any): QuestStep {
        return new JobQuestStep(player, this._jobType, this._goalCount, this._hudName,
            data == null ? 0 : data as number);
    }
}



class JobQuestStep extends QuestStep implements IQuestSavable {
    private readonly _jobType: JobType;
    private readonly _hudName: string;
    private readonly _goalCount: number;
    private _completedCount: number;

    get hudDto(): QuestStepDto {
        return {
            name: this._hudName,
            completed: this.isComplete,
            count: this._completedCount,
            countGoal: this._goalCount
        }
    }

    get isComplete(): boolean {
        return this._completedCount >= this._goalCount;
    }

    constructor(player: PlayerMp, jobType: JobType, goalCount: number, hudName: string, completedCount: number) {
        super(player);

        this._hudName = hudName;
        this._jobType = jobType;
        this._goalCount = goalCount;
        this._completedCount = completedCount;
    }

    init(nextStep: () => void, updateHud: () => void) {
        super.init(nextStep, updateHud);

        mp.events.add(JOB_PLAYER_EVENT, this.handleJob);
    }

    handleJob = (player: PlayerMp, type: JobType) => {
        if (player !== this._player || type !== this._jobType) {
            return;
        }

        this._completedCount++;
        this.update();

        if (this.isComplete) {
            this._nextStep();
        }
    }

    onDestroy(): void {
        mp.events.remove(JOB_PLAYER_EVENT, this.handleJob);
    }

    onQuestDestroy(): void {
    }

    getSaveData = (): any => {
        return this._completedCount;
    }

}
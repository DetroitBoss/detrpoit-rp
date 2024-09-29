import {IQuestStepFactory} from "./IQuestStepFactory";
import {QuestStep} from "./questStep";
import {IQuestSavable} from "../../interfaces/IQuestSavable";
import {QuestStepDto} from "../../../../../shared/advancedQuests/dtos";

export type JobType = 'busman';
export const LEAVE_JOB_PLAYER_EVENT = "advancedQuests:leaveJob";

export class LeaveJobQuestStepFactory implements IQuestStepFactory {
    private readonly _jobType: JobType;
    private readonly _hudName: string;

    constructor(jobType: JobType, hudName: string) {
        this._jobType = jobType;
        this._hudName = hudName;
    }

    createQuestStep(player: PlayerMp, data: any): QuestStep {
        return new LeaveJobQuestStep(player, this._jobType, this._hudName,
            data == null ? false : data as boolean);
    }
}



class LeaveJobQuestStep extends QuestStep implements IQuestSavable {
    private readonly _jobType: JobType;
    private readonly _hudName: string;
    private _completed: boolean;

    get hudDto(): QuestStepDto {
        return {
            name: this._hudName,
            completed: this.isComplete,
        }
    }

    get isComplete(): boolean {
        return this._completed
    }

    constructor(player: PlayerMp, jobType: JobType, hudName: string, completed: boolean) {
        super(player);

        this._hudName = hudName;
        this._jobType = jobType;
        this._completed = completed;
    }

    init(nextStep: () => void, updateHud: () => void) {
        super.init(nextStep, updateHud);

        mp.events.add(LEAVE_JOB_PLAYER_EVENT, this.handleJob);
    }

    handleJob = (player: PlayerMp, type: JobType) => {
        if (player !== this._player || type !== this._jobType) {
            return;
        }

        this._completed = true;
            this._nextStep();
    }

    onDestroy(): void {
        mp.events.remove(LEAVE_JOB_PLAYER_EVENT, this.handleJob);
    }

    onQuestDestroy(): void {
    }

    getSaveData = (): any => {
        return this._completed;
    }

}
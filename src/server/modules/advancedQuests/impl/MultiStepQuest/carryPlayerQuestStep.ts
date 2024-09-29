import {IQuestStepFactory} from "./IQuestStepFactory";
import {QuestStep} from "./questStep";
import {IQuestSavable} from "../../interfaces/IQuestSavable";
import {QuestStepDto} from "../../../../../shared/advancedQuests/dtos";

export class CarryPlayerQuestStepFactory implements IQuestStepFactory {
    private readonly _goalCount: number;

    constructor(goalCount: number) {
        this._goalCount = goalCount;
    }

    createQuestStep(player: PlayerMp, data: any): QuestStep {
        return new CarryPlayerQuestStep(player, this._goalCount,
            data == null ? 0 : data as number);
    }
}

export const CARRY_PLAYER_EVENT = "advancedQuests:carryPlayer";


class CarryPlayerQuestStep extends QuestStep implements IQuestSavable {
    private readonly _goalCount: number;
    private _carriedCount: number;

    get hudDto(): QuestStepDto {
        return {
            name: `Поносить людей на руках`,
            completed: this.isComplete,
            count: this._carriedCount,
            countGoal: this._goalCount
        }
    }

    get isComplete(): boolean {
        return this._carriedCount >= this._goalCount;
    }

    constructor(player: PlayerMp, goalCount: number, carriedCount: number) {
        super(player);

        this._goalCount = goalCount;
        this._carriedCount = carriedCount;
    }

    init(nextStep: () => void, updateHud: () => void) {
        super.init(nextStep, updateHud);

        mp.events.add(CARRY_PLAYER_EVENT, this.handleCarry);
    }

    handleCarry = (player: PlayerMp) => {
        if (player !== this._player) {
            return;
        }

        this._carriedCount++;
        this.update();

        if (this.isComplete) {
            this._nextStep();
        }
    }

    onDestroy(): void {
        mp.events.remove(CARRY_PLAYER_EVENT, this.handleCarry);
    }

    onQuestDestroy(): void {
    }

    getSaveData = (): any => {
        return this._carriedCount;
    }

}
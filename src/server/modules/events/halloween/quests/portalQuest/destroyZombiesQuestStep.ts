import {QuestStep} from "../../../../advancedQuests/impl/MultiStepQuest/questStep";
import {IQuestSavable} from "../../../../advancedQuests/interfaces/IQuestSavable";
import {QuestStepDto} from "../../../../../../shared/advancedQuests/dtos";
import {CustomEvent} from "../../../../custom.event";
import {HALLOWEEN_ZOMBIE_KILLED_EVENT} from "../../../../../../shared/events/halloween.config";
import {IQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/IQuestStepFactory";

export class DestroyPortalZombiesQuestStepFactory implements IQuestStepFactory {
    private readonly _zombiesGoal: number;

    constructor(zombiesGoal: number) {
        this._zombiesGoal = zombiesGoal;
    }

    createQuestStep(player: PlayerMp, data: any): QuestStep {
        return new DestroyPortalZombiesQuestStep(player, this._zombiesGoal,
            data == null ? 0 : data as number
        );
    }
}

class DestroyPortalZombiesQuestStep extends QuestStep implements IQuestSavable {
    private readonly _zombiesGoal: number;
    private _zombiesKilled: number;

    get hudDto(): QuestStepDto {
        return {
            name: 'Истребите всех зомби',
            completed: this.isComplete,
            countGoal: this._zombiesGoal,
            count: this._zombiesKilled
        };
    }

    get isComplete(): boolean {
        return this._zombiesKilled >= this._zombiesGoal;
    }

    constructor(player: PlayerMp, zombiesGoal: number, zombiesKilled: number) {
        super(player);

        this._zombiesGoal = zombiesGoal;
        this._zombiesKilled = zombiesKilled;
    }

    init(nextStep: () => void, update: () => void) {
        super.init(nextStep, update);

        mp.events.add(HALLOWEEN_ZOMBIE_KILLED_EVENT, this.handleZombieKill);
    }

    handleZombieKill = (player: PlayerMp) => {
        if (this._player !== player) {
            return;
        }

        this._zombiesKilled++;
        this.update();

        if (this.isComplete) {
            this._nextStep();
        }
    }

    onDestroy(): void {
        mp.events.remove(HALLOWEEN_ZOMBIE_KILLED_EVENT, this.handleZombieKill);
    }

    onQuestDestroy(): void {
    }

    getSaveData = (): any => {
        return this._zombiesKilled;
    }
}
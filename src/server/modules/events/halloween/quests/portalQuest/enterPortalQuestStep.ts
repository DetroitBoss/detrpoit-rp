import {QuestStep} from "../../../../advancedQuests/impl/MultiStepQuest/questStep";
import {QuestStepDto} from "../../../../../../shared/advancedQuests/dtos";
import {IQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/IQuestStepFactory";
import {HALLOWEEN_ENTER_PORTAL_EVENT} from "../../../../../../shared/events/halloween.config";

export class EnterPortalQuestStepFactory implements IQuestStepFactory {
    createQuestStep(player: PlayerMp, data: any): QuestStep {
        return new EnterPortalQuestStep(player);
    }
}

class EnterPortalQuestStep extends QuestStep {
    private _isComplete = false;

    get hudDto(): QuestStepDto {
        return {
            name: 'Войдите в портал',
            completed: this.isComplete
        };
    }

    get isComplete(): boolean {
        return this._isComplete;
    }

    constructor(player: PlayerMp) {
        super(player);
    }

    init(nextStep: () => void, update: () => void) {
        super.init(nextStep, update);

        mp.events.add(HALLOWEEN_ENTER_PORTAL_EVENT, this.handleEnterPortal);
    }

    handleEnterPortal = (player: PlayerMp) => {
        if (this._player !== player) {
            return;
        }

        this._nextStep();
    }

    onDestroy(): void {
        mp.events.remove(HALLOWEEN_ENTER_PORTAL_EVENT, this.handleEnterPortal);
    }

    onQuestDestroy(): void {
    }

}
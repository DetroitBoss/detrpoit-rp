import {IQuestStepFactory} from "./IQuestStepFactory";
import {QuestStep} from "./questStep";
import {IQuestSavable} from "../../interfaces/IQuestSavable";
import {QuestStepDto} from "../../../../../shared/advancedQuests/dtos";

export class SendAdQuestStepFactory implements IQuestStepFactory {
    private readonly _hudName: string;

    constructor(hudName: string) {
        this._hudName = hudName;
    }

    createQuestStep(player: PlayerMp, data: any): QuestStep {
        return new SendAdQuestStep(player, this._hudName,
            data == null ? false : data as boolean);
    }
}

export const SEND_AD_PLAYER_EVENT = "advancedQuests:sendAd";


class SendAdQuestStep extends QuestStep implements IQuestSavable {
    private readonly _hudName: string;
    private _completed: boolean;

    get hudDto(): QuestStepDto {
        return {
            name: this._hudName,
            completed: this.isComplete,
        }
    }

    get isComplete(): boolean {
        return this._completed;
    }

    constructor(player: PlayerMp, hudName: string, completed: boolean) {
        super(player);

        this._hudName = hudName;
        this._completed = completed;
    }

    init(nextStep: () => void, updateHud: () => void) {
        super.init(nextStep, updateHud);

        mp.events.add(SEND_AD_PLAYER_EVENT, this.handleSend);
    }

    handleSend = (staticId: number) => {

        if (!this._player.user || staticId !== this._player.user.id) {
            return;
        }

        this._completed = true;
        this._nextStep();
    }

    onDestroy(): void {
        mp.events.remove(SEND_AD_PLAYER_EVENT, this.handleSend);
    }

    onQuestDestroy(): void {
    }

    getSaveData = (): any => {
        return this.isComplete;
    }

}
import {IQuestStepFactory} from "./IQuestStepFactory";
import {QuestStep} from "./questStep";
import {IQuestSavable} from "../../interfaces/IQuestSavable";
import {QuestStepDto} from "../../../../../shared/advancedQuests/dtos";
import {QUESTS_ROUTE_BLIP_COLOR, QUESTS_ROUTE_BLIP_NAME} from "../../index";
import {CustomEvent} from "../../../custom.event";


export class EnterWordQuestStepFactory implements IQuestStepFactory {
    private readonly _word: string;
    private readonly _hudName: string;
    private readonly _position: Vector3Mp;

    constructor(word: string, hudName: string, position: Vector3Mp) {
        this._word = word;
        this._hudName = hudName;
        this._position = position;
    }

    createQuestStep(player: PlayerMp, data: any): QuestStep {
        return new EnterWordQuestStep(player, this._word,
            this._hudName, this._position, data == null ? false : data as boolean);
    }
}

export const ENTER_WORD_EVENT = "advancedQuests:enterWord";


class EnterWordQuestStep extends QuestStep implements IQuestSavable {
    private readonly _word: string;
    private readonly _hudName: string;
    private _isCompleted: boolean;
    private readonly _position: Vector3Mp;

    get hudDto(): QuestStepDto {
        return {
            name: `${this._hudName}`,
            completed: this.isComplete,
            notShowIfCompleted: true
        }
    }

    get isComplete(): boolean {
        return this._isCompleted;
    }

    constructor(player: PlayerMp, word: string, hudName: string, position: Vector3Mp, isCompleted: boolean) {
        super(player);

        this._word = word;
        this._hudName = hudName;
        this._position = position;
        this._isCompleted = isCompleted;
    }

    init(nextStep: () => void, updateHud: () => void) {
        super.init(nextStep, updateHud);
        this._player.user.createRouteBlip(QUESTS_ROUTE_BLIP_NAME, this._position, QUESTS_ROUTE_BLIP_COLOR);
        CustomEvent.registerCef(ENTER_WORD_EVENT, this.handleEnter);
    }

    handleEnter = (player: PlayerMp, word: string) => {
        if (player !== this._player) {
            return;
        }

        if (word.toLowerCase() !== this._word) {
            return player.notify('Неверное слово', 'error');
        }

        this._isCompleted = true;
        this._nextStep();
    }

    onDestroy(): void {
        this._player.user.destroyRouteBlip(QUESTS_ROUTE_BLIP_NAME);
        CustomEvent.unregisterCef(ENTER_WORD_EVENT, this.handleEnter);
    }

    onQuestDestroy(): void {
    }

    getSaveData = (): any => {
        return this._isCompleted;
    }

}
import {QuestStep} from "./questStep";
import {IQuestStepFactory} from "./IQuestStepFactory";
import {registerHookHandler, unregisterHookHandler} from "../../../../../shared/hooks";
import {Dialog} from "../../../advancedNpc/dialogs/interfaces/dialog";
import {NPC_INTERACT_HOOK, ServerNpc} from "../../../advancedNpc";
import {getDialog} from "../../../advancedNpc/dialogs/dialogs";
import {IQuestSavable} from "../../interfaces/IQuestSavable";
import {QuestStepDto} from "../../../../../shared/advancedQuests/dtos";
import {QUESTS_ROUTE_BLIP_COLOR, QUESTS_ROUTE_BLIP_NAME} from "../../index";

export const TALK_WITH_NPC_EVENT = 'quests:dialogs:answerEvent';

export class TalkWithNpcQuestFactory implements IQuestStepFactory {
    private readonly _npcId: string;
    private readonly _dialogId: string;

    constructor(npcId: string, dialogId: string) {
        this._npcId = npcId;
        this._dialogId = dialogId;
    }

    createQuestStep(player: PlayerMp, data: any): QuestStep {
        return new TalkWithNpcQuestStep(player, this._npcId, this._dialogId,
            data == null ? false : data as boolean);
    }
}

class TalkWithNpcQuestStep extends QuestStep implements IQuestSavable {
    private readonly _npcName: string;
    private readonly _npcId: string;
    private readonly _dialogId: string;
    private _isCompleted: boolean;

    get hudDto(): QuestStepDto {
        return {
            name: `Поговорите с ${this._npcName}`,
            completed: this.isComplete,
            notShowIfCompleted: true
        }
    }

    get isComplete(): boolean {
        return this._isCompleted;
    }

    constructor(player: PlayerMp, npcId: string, dialogId: string, isCompleted: boolean) {
        super(player);
        this._npcName = ServerNpc.get(npcId).name;
        this._npcId = npcId;
        this._dialogId = dialogId;
        this._isCompleted = isCompleted;
    }

    init(nextStep: () => void, updateHud: () => void) {
        super.init(nextStep, updateHud);


        const pedPosition = ServerNpc.get(this._npcId).position;
        this._player.user.createRouteBlip(QUESTS_ROUTE_BLIP_NAME, pedPosition, QUESTS_ROUTE_BLIP_COLOR);

        registerHookHandler<Dialog>(NPC_INTERACT_HOOK, this.handleNpcInteract);
        mp.events.add(TALK_WITH_NPC_EVENT, this.handleTalkEvent);
    }

    handleNpcInteract = (player: PlayerMp, npc: ServerNpc): Dialog => {
        if (player !== this._player || npc.id !== this._npcId) {
            return null;
        }

        return getDialog(this._dialogId);
    }

    handleTalkEvent = (player: PlayerMp, dialog: Dialog) => {
        if (player !== this._player || dialog.id !== this._dialogId) {
            return;
        }

        this._isCompleted = true;
        this._nextStep();
    }

    onDestroy(): void {
        this._player.user.destroyRouteBlip(QUESTS_ROUTE_BLIP_NAME);
        unregisterHookHandler<Dialog>(NPC_INTERACT_HOOK, this.handleNpcInteract);
        mp.events.remove(TALK_WITH_NPC_EVENT, this.handleTalkEvent);
    }

    onQuestDestroy(): void {
    }

    getSaveData = (): any => {
        return this._isCompleted;
    }
}
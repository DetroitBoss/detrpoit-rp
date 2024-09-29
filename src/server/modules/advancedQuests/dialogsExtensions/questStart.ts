import {IAnswerAction} from "../../advancedNpc/dialogs/interfaces/IAnswerAction";
import {IQuestFactory} from "../interfaces/IQuestFactory";
import {Dialog} from "../../advancedNpc/dialogs/interfaces/dialog";
import {getQuestFactory} from "../index";

export class QuestStart implements IAnswerAction {
    private readonly _questId: string;

    constructor(questId: string) {
        this._questId = questId;
    }

    handle(player: PlayerMp, dialog: Dialog): void {
        const factory = getQuestFactory(this._questId);

        player.user.advancedQuests.giveQuest(
            factory.createQuest(player)
        );
    }
}
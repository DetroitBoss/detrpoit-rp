import './firstQuest/first.quest';
import './secondQuest/second.quest';
import './thirdQuest/third.quest';
import './fourthQuest/fourth.quest';
import './fifthQuest/fifth.quest';
import './sixthQuest/sixth.quest';

import {registerHookHandler} from "../../../../../shared/hooks";
import {Dialog} from "../../../advancedNpc/dialogs/interfaces/dialog";
import {NPC_INTERACT_HOOK, ServerNpc} from "../../../advancedNpc";
import {system} from "../../../system";
import {
    NEW_YEAR_FIFTH_QUEST_FIRST_LINE_ID,
    NEW_YEAR_FIFTH_QUEST_ID, NEW_YEAR_FIFTH_QUEST_SECOND_LINE_ID,
    NEW_YEAR_SANTA_NPC_ID,
    NEW_YEAR_SIXTH_QUEST_ID,
    NEW_YEAR_FIRST_QUEST_ID, NEW_YEAR_SECOND_QUEST_ID, NEW_YEAR_THIRD_QUEST_ID, NEW_YEAR_FOURTH_QUEST_ID
} from "../../../../../shared/events/newYear/quests.config";
import {getDialog} from "../../../advancedNpc/dialogs/dialogs";

const questsSequence = [
    {npcId: NEW_YEAR_SANTA_NPC_ID, questId: NEW_YEAR_FIRST_QUEST_ID, dialogId: 'new-year-quest-1-dialog-1'},
    {npcId: NEW_YEAR_SANTA_NPC_ID, questId: NEW_YEAR_SECOND_QUEST_ID, dialogId: 'new-year-quest-2-dialog-1'},
    {npcId: NEW_YEAR_SANTA_NPC_ID, questId: NEW_YEAR_THIRD_QUEST_ID, dialogId: 'new-year-quest-3-dialog-1'},
    {npcId: NEW_YEAR_SANTA_NPC_ID, questId: NEW_YEAR_FOURTH_QUEST_ID, dialogId: 'new-year-quest-4-dialog-1'},
    {npcId: NEW_YEAR_SANTA_NPC_ID, questId: NEW_YEAR_FIFTH_QUEST_ID, dialogId: 'new-year-quest-5-dialog-1'},
    {npcId: NEW_YEAR_SANTA_NPC_ID, questId: NEW_YEAR_SIXTH_QUEST_ID, dialogId: 'new-year-quest-6-dialog-1'}
]

export function quests() {
    registerHookHandler<Dialog>(NPC_INTERACT_HOOK, (player: PlayerMp, npc: ServerNpc) => {
        try {
            if (npc.id !== NEW_YEAR_SANTA_NPC_ID) {
                return;
            }

            for (let quest of questsSequence) {
                if (quest.questId === NEW_YEAR_SIXTH_QUEST_ID) {
                    if (
                        player.user.advancedQuests.isQuestCompleted(NEW_YEAR_FIFTH_QUEST_ID) &&
                        !player.user.advancedQuests.isQuestActive(quest.questId) &&
                        !player.user.advancedQuests.isQuestCompleted(quest.questId)
                    ) {
                        if (
                            player.user.advancedQuests.isQuestCompleted(NEW_YEAR_FIFTH_QUEST_FIRST_LINE_ID)
                            ||
                            player.user.advancedQuests.isQuestCompleted(NEW_YEAR_FIFTH_QUEST_SECOND_LINE_ID)
                        ) {
                            return getDialog(quest.dialogId)
                        }
                        return null;
                    }
                    return null;
                } else {
                    if (player.user.advancedQuests.isQuestActive(quest.questId)) {
                        return null;
                    }

                    if (!player.user.advancedQuests.isQuestCompleted(quest.questId)) {
                        return getDialog(quest.dialogId)
                    }
                }
            }
        } catch (e) {
            system.debug.error(`[NEW-YEAR-QUESTS]:: Error on NPC_INTERACT_HOOK ${player?.dbid} ${npc?.id}: ${e}`);
        }
        return null;
    });
}
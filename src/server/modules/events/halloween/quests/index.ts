import './startQuest/start.quest';
import './ghostsQuest/ghosts.quest';
import './portalQuest/portal.quest';

import {registerHookHandler} from "../../../../../shared/hooks";
import {Dialog} from "../../../advancedNpc/dialogs/interfaces/dialog";
import {NPC_INTERACT_HOOK, ServerNpc} from "../../../advancedNpc";
import {
    HALLOWEEN_GHOSTBUSTER_NPC_ID,
    HALLOWEEN_GHOSTS_QUEST_ID, HALLOWEEN_PORTALS_QUEST_ID,
    HALLOWEEN_START_QUEST_ID
} from "../../../../../shared/events/halloween.config";
import {getDialog} from "../../../advancedNpc/dialogs/dialogs";
import {system} from "../../../system";

const questsSequence = [
    { npcId: HALLOWEEN_GHOSTBUSTER_NPC_ID, questId: HALLOWEEN_START_QUEST_ID, dialogId: 'halloween-quest-1-dialog-1' },
    { npcId: HALLOWEEN_GHOSTBUSTER_NPC_ID, questId: HALLOWEEN_GHOSTS_QUEST_ID, dialogId: 'halloween-quest-2-dialog-1' },
    { npcId: HALLOWEEN_GHOSTBUSTER_NPC_ID, questId: HALLOWEEN_PORTALS_QUEST_ID, dialogId: 'halloween-quest-3-dialog-1' }
]

registerHookHandler<Dialog>(NPC_INTERACT_HOOK, (player: PlayerMp, npc: ServerNpc) => {
    try {
        if (npc.id !== HALLOWEEN_GHOSTBUSTER_NPC_ID) {
            return;
        }

        for (let quest of questsSequence) {
            if (player.user.advancedQuests.isQuestActive(quest.questId)) {
                return null;
            }

            if (!player.user.advancedQuests.isQuestCompleted(quest.questId)) {
                return getDialog(quest.dialogId)
            }
        }
    } catch (e) {
        system.debug.error(`[HALLOWEEN-QUESTS]:: Error on NPC_INTERACT_HOOK ${player?.dbid} ${npc?.id}: ${e}`);
    }

    return null;
});
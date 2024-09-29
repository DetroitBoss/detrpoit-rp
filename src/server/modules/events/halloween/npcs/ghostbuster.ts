import {ServerNpc} from "../../../advancedNpc";
import {registerDialog} from "../../../advancedNpc/dialogs/dialogs";
import {
    HALLOWEEN_GHOSTBUSTER_NPC_ID,
    HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    HALLOWEEN_GHOSTBUSTER_NPC_PARAMETERS,
    HALLOWEEN_GHOSTS_QUEST_NPC_ID,
    HALLOWEEN_GHOSTS_QUEST_NPC_PARAMETERS
} from "../../../../../shared/events/halloween.config";

const DEFAULT_GHOSTBUSTER_DIALOG_ID = 'halloween-ghostbuster-dialog-default';

const ghostbusterNpc = new ServerNpc(HALLOWEEN_GHOSTBUSTER_NPC_ID, HALLOWEEN_GHOSTBUSTER_NPC_PARAMETERS, DEFAULT_GHOSTBUSTER_DIALOG_ID);
registerDialog({
    id: DEFAULT_GHOSTBUSTER_DIALOG_ID,
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 0,
            npcReplies: [
                { text: 'Зачем опять пришел? Не мешай, помимо тебя у меня есть ещё с кем поработать' }
            ],
            answers: [
                { text: 'Справедливо', isExit: true }
            ]
        }
    ]
});

const ghostsQuestNpc = new ServerNpc(HALLOWEEN_GHOSTS_QUEST_NPC_ID, HALLOWEEN_GHOSTS_QUEST_NPC_PARAMETERS);
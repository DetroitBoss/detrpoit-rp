import {ServerNpc} from "../../../advancedNpc";
import {
    NEW_YEAR_HARRY_NPC_ID,
    NEW_YEAR_HARRY_NPC_NAME,
    NEW_YEAR_HARRY_NPC_PARAMETERS
} from "../../../../../shared/events/newYear/quests.config";
import {registerDialog} from "../../../advancedNpc/dialogs/dialogs";

export function SpawnHarryNPC() {
    const DEFAULT_HARRY_DIALOG_ID = 'new-year-harry-dialog-default';

    const HarryNPC = new ServerNpc(NEW_YEAR_HARRY_NPC_ID, NEW_YEAR_HARRY_NPC_PARAMETERS, DEFAULT_HARRY_DIALOG_ID);

    registerDialog({
        id: DEFAULT_HARRY_DIALOG_ID,
        characterName: NEW_YEAR_HARRY_NPC_NAME,
        nodes: [
            {
                id: 0,
                npcReplies: [
                    { text: 'Ты чё легавый? А ну быстро сдрыстнул отсюда!' }
                ],
                answers: [
                    { text: 'Понял, только не бей', isExit: true }
                ]
            }
        ]
    });
}
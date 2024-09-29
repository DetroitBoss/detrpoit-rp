import {ServerNpc} from "../../../advancedNpc";
import {
    NEW_YEAR_ARIEL_NPC_ID, NEW_YEAR_ARIEL_NPC_NAME,
    NEW_YEAR_ARIEL_NPC_PARAMETERS
} from "../../../../../shared/events/newYear/quests.config";
import {registerDialog} from "../../../advancedNpc/dialogs/dialogs";


export function SpawnArielNPC() {
    const DEFAULT_ARIEL_DIALOG_ID = 'new-year-ariel-dialog-default';

    new ServerNpc(NEW_YEAR_ARIEL_NPC_ID, NEW_YEAR_ARIEL_NPC_PARAMETERS, DEFAULT_ARIEL_DIALOG_ID);

    registerDialog({
        id: DEFAULT_ARIEL_DIALOG_ID,
        characterName: NEW_YEAR_ARIEL_NPC_NAME,
        nodes: [
            {
                id: 0,
                npcReplies: [
                    {text: '*смотрит милым взглядом*'}
                ],
                answers: [
                    {text: 'ну, ты тут тоже, давай, не начинай', isExit: true}
                ]
            }
        ]
    })
}
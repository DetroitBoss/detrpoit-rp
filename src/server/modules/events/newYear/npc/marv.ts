import {ServerNpc} from "../../../advancedNpc";
import {
    NEW_YEAR_HOMELESS_NPC_ID, NEW_YEAR_HOMELESS_NPC_NAME,
    NEW_YEAR_HOMELESS_NPC_PARAMETERS
} from "../../../../../shared/events/newYear/quests.config";
import {registerDialog} from "../../../advancedNpc/dialogs/dialogs";


export function SpawnMarvNPC() {
    const DEFAULT_MARV_DIALOG_ID = 'new-year-marv-dialog-default';

    const MarvNPC = new ServerNpc(NEW_YEAR_HOMELESS_NPC_ID, NEW_YEAR_HOMELESS_NPC_PARAMETERS, DEFAULT_MARV_DIALOG_ID);

    registerDialog({
        id: DEFAULT_MARV_DIALOG_ID,
        characterName: NEW_YEAR_HOMELESS_NPC_NAME,
        nodes: [
            {
                id: 0,
                npcReplies: [
                    {text: '*Что-то не разборчиво с отрыжкой*'}
                ],
                answers: [
                    {text: 'Не рычи', isExit: true}
                ]
            }
        ]
    })
}
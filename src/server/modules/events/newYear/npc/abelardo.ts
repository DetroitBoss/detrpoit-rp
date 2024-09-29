import {ServerNpc} from "../../../advancedNpc";
import {
    NEW_YEAR_SPANISH_NPC_ID, NEW_YEAR_SPANISH_NPC_NAME,
    NEW_YEAR_SPANISH_NPC_PARAMETERS
} from "../../../../../shared/events/newYear/quests.config";
import {registerDialog} from "../../../advancedNpc/dialogs/dialogs";


export function SpawnAbelardoNPC() {
    const DEFAULT_ABELARDO_DIALOG_ID = 'new-year-marv-abelardo-default';

    const MarvNPC = new ServerNpc(NEW_YEAR_SPANISH_NPC_ID, NEW_YEAR_SPANISH_NPC_PARAMETERS, DEFAULT_ABELARDO_DIALOG_ID);

    registerDialog({
        id: DEFAULT_ABELARDO_DIALOG_ID,
        characterName: NEW_YEAR_SPANISH_NPC_NAME,
        nodes: [
            {
                id: 0,
                npcReplies: [
                    {text: 'Solo soy un NPC que necesita hablar español. Gracias por traducir.'}
                ],
                answers: [
                    {text: 'Опять эти испанские выходки', isExit: true}
                ]
            }
        ]
    })
}
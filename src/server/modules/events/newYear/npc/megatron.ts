import {ServerNpc} from "../../../advancedNpc";
import {
    NEW_YEAR_MEGATRON_NPC_ID,
    NEW_YEAR_MEGATRON_NPC_NAME,
    NEW_YEAR_MEGATRON_NPC_PARAMETERS
} from "../../../../../shared/events/newYear/quests.config";
import {registerDialog} from "../../../advancedNpc/dialogs/dialogs";

export function SpawnMegatronNPC() {
    const DEFAULT_MEGATRON_DIALOG_ID = 'new-year-megatron-dialog-default';

    const MegatronNPC = new ServerNpc(NEW_YEAR_MEGATRON_NPC_ID, NEW_YEAR_MEGATRON_NPC_PARAMETERS, DEFAULT_MEGATRON_DIALOG_ID);

    registerDialog({
        id: DEFAULT_MEGATRON_DIALOG_ID,
        characterName: NEW_YEAR_MEGATRON_NPC_NAME,
        nodes: [
            {
                id: 0,
                npcReplies: [
                    { text: 'Не разговариваю с такими червями, как ты' }
                ],
                answers: [
                    { text: 'Сам червь', isExit: true }
                ]
            }
        ]
    });
}
import {ServerNpc} from "../../../advancedNpc";
import {registerDialog} from "../../../advancedNpc/dialogs/dialogs";
import {
    NEW_YEAR_SANTA_NPC_ID,
    NEW_YEAR_SANTA_NPC_NAME,
    NEW_YEAR_SANTA_NPC_PARAMETERS
} from "../../../../../shared/events/newYear/quests.config";

export function SpawnSantaNPC() {
    const DEFAULT_SANTA_DIALOG_ID = 'new-year-santa-dialog-default';

    const SantaNPC = new ServerNpc(NEW_YEAR_SANTA_NPC_ID, NEW_YEAR_SANTA_NPC_PARAMETERS, DEFAULT_SANTA_DIALOG_ID);

    mp.objects.new(
        mp.joaat('on_ny_claus'),
        new mp.Vector3(
            1674.33, 3685.19, 33.40
        ),
        {
            dimension: 0,
            rotation: new mp.Vector3(0, 0, NEW_YEAR_SANTA_NPC_PARAMETERS.Heading)
        }
    )

    registerDialog({
        id: DEFAULT_SANTA_DIALOG_ID,
        characterName: NEW_YEAR_SANTA_NPC_NAME,
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
}
import {Snowballs} from './snowballs';
import {EVENT_IS_ACTIVE} from "../../../../shared/events/newYear/main.config";
import {
    NEW_YEAR_SANTA_NPC_NAME,
    NEW_YEAR_HOMELESS_NPC_NAME,
    NEW_YEAR_BOLVANKA_NPC_NAME,
    NEW_YEAR_MEGATRON_NPC_NAME,
    NEW_YEAR_SPANISH_NPC_NAME,
    NEW_YEAR_WORD_NPC_NAME,
    NEW_YEAR_GALILEO_NPC_NAME
} from "../../../../shared/events/newYear/quests.config";

if (EVENT_IS_ACTIVE) {
    new Snowballs();

    mp.events.add('entityStreamIn', (entity: EntityMp) => {
        if (entity.type !== 'ped' || !entity.getVariable('advancedPedName')) return;

        switch (entity.getVariable('advancedPedName')) {
            case NEW_YEAR_SANTA_NPC_NAME: {
                mp.game.invoke('0x44A0870B7E92D7C0', entity.handle, 0, false)
                break;
            }

            case NEW_YEAR_HOMELESS_NPC_NAME: {

                break;
            }

            case NEW_YEAR_BOLVANKA_NPC_NAME: {
                mp.game.invoke(
                    '0xEA47FE3719165B94',
                    entity.handle,
                    'amb@world_human_bum_slumped@male@laying_on_right_side@idle_a',
                    'idle_a',
                    8,
                    8,
                    -1,
                    1,
                    0,
                    true,
                    true,
                    true
                    )
                break;
            }

            case NEW_YEAR_MEGATRON_NPC_NAME: {
                mp.game.invoke(
                    '0x142A02425FF02BD9',
                    entity.handle,
                    "WORLD_HUMAN_AA_SMOKE",
                    0,
                    false
                )
                break;
            }

            case NEW_YEAR_WORD_NPC_NAME: {

                break;
            }

            case NEW_YEAR_GALILEO_NPC_NAME: {

                break;
            }

            default: {
                break;
            }
        }

    });
}
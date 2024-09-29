import {EMPLOYER_BLIP, EMPLOYER_NPC} from "../../../shared/diving/employer.config";
import {NpcSpawn} from "../npc";
import {CustomEvent} from "../custom.event";
import {DIVING_COSTUME_ITEM_ID} from "../../../shared/diving/work.config";

function interaction(player: PlayerMp) {
    if (!player.user.haveItem(DIVING_COSTUME_ITEM_ID))
        return player.notify('У вас нету дайверского костюма для данной работы', 'error');

    CustomEvent.triggerClient(player, 'diving:openEmployer');
}

new NpcSpawn(
    EMPLOYER_NPC.Position,
    EMPLOYER_NPC.Heading,
    EMPLOYER_NPC.Model,
    EMPLOYER_NPC.Name,
    interaction,
    EMPLOYER_NPC.Range,
    EMPLOYER_NPC.Dimension
)

mp.blips.new(EMPLOYER_BLIP.Sprite, EMPLOYER_BLIP.Position, {
    color: EMPLOYER_BLIP.Color,
    shortRange: true,
    name: EMPLOYER_BLIP.Name
});
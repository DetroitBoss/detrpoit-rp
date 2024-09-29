import {NpcSpawn} from "../../npc";
import {
    HIRING_HEADING_SORT,
    HIRING_HEADING_SQUAD, HIRING_MODEL_SORT, HIRING_MODEL_SQUAD,
    HIRING_POSITION_SORT,
    HIRING_POSITION_SQUAD, HIRING_TEXT_SORT, HIRING_TEXT_SQUAD
} from "../../../../shared/jobs/sanitation/hiring";
import {sanitation} from "./index";
import {CustomEvent} from "../../custom.event";

const interactionSort = (player: PlayerMp) => {
    player.user.setGui("garbage");
    CustomEvent.triggerCef(player, 'sanitation:sort:hiring', player.user.sanitationSort !== null);
}

const interactionSquad = (player: PlayerMp) => {
    sanitation.openInterface(player)
}

new NpcSpawn(
    HIRING_POSITION_SORT,
    HIRING_HEADING_SORT,
    HIRING_MODEL_SORT,
    HIRING_TEXT_SORT,
    interactionSort
)
new NpcSpawn(
    HIRING_POSITION_SQUAD,
    HIRING_HEADING_SQUAD,
    HIRING_MODEL_SQUAD,
    HIRING_TEXT_SQUAD,
    interactionSquad
)

mp.blips.new(527, new mp.Vector3(2407.08, 3128.17, 48.18), {
    color: 31,
    name: "Свалка",
    dimension: 0,
    shortRange: true
})


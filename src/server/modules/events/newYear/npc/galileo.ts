import {NpcSpawn} from "../../../npc";
import {
    NEW_YEAR_GALILEO_NPC_DIMENSION,
    NEW_YEAR_GALILEO_NPC_HEADING, NEW_YEAR_GALILEO_NPC_MODEL, NEW_YEAR_GALILEO_NPC_NAME,
    NEW_YEAR_GALILEO_NPC_POSITION, NEW_YEAR_GALILEO_NPC_RANGE, NEW_YEAR_SIXTH_QUEST_ID,
} from "../../../../../shared/events/newYear/quests.config";

const interact = (player: PlayerMp) => {
    if (player.user.advancedQuests.isQuestActive(NEW_YEAR_SIXTH_QUEST_ID)) {
        player.user.setGui('advancedQuests', 'advancedQuests:setComponent', 'enterWord');
    }else{
        player.outputChatBox(`${NEW_YEAR_GALILEO_NPC_NAME}: Ты кто такой? Я тебя не звал. Иди отсюда!`);
    }
};

export function SpawnGalileoNPC() {
    return new NpcSpawn(
        NEW_YEAR_GALILEO_NPC_POSITION,
        NEW_YEAR_GALILEO_NPC_HEADING,
        NEW_YEAR_GALILEO_NPC_MODEL,
        NEW_YEAR_GALILEO_NPC_NAME,
        interact,
        NEW_YEAR_GALILEO_NPC_RANGE,
        NEW_YEAR_GALILEO_NPC_DIMENSION
    );
}
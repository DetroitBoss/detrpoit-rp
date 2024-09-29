import {NpcSpawn} from "../../../npc";
import {
    NEW_YEAR_THIRD_QUEST_ID,
    NEW_YEAR_WORD_NPC_DIMENSION,
    NEW_YEAR_WORD_NPC_HEADING, NEW_YEAR_WORD_NPC_MODEL, NEW_YEAR_WORD_NPC_NAME,
    NEW_YEAR_WORD_NPC_POSITION, NEW_YEAR_WORD_NPC_RANGE
} from "../../../../../shared/events/newYear/quests.config";

const interact = (player: PlayerMp) => {
        if (player.user.advancedQuests.isQuestActive(NEW_YEAR_THIRD_QUEST_ID)) {
            player.user.setGui('advancedQuests', 'advancedQuests:setComponent', 'enterWord');
        }else{
            player.outputChatBox(`${NEW_YEAR_WORD_NPC_NAME}: Милок, ты чё-то не туда забрёл, давай, чеши отсюда!`);
        }
};

export function SpawnWordNPC() {
    return new NpcSpawn(
        NEW_YEAR_WORD_NPC_POSITION,
        NEW_YEAR_WORD_NPC_HEADING,
        NEW_YEAR_WORD_NPC_MODEL,
        NEW_YEAR_WORD_NPC_NAME,
        interact,
        NEW_YEAR_WORD_NPC_RANGE,
        NEW_YEAR_WORD_NPC_DIMENSION
    );
}
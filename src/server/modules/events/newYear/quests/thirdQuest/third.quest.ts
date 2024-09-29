import './third.quest.dialogs';

import {registerQuestFactory} from "../../../../advancedQuests";
import {MultiStepQuestFactory} from "../../../../advancedQuests/impl/MultiStepQuest/multiStepQuest";
import {
    NEW_YEAR_SANTA_NPC_ID,
    NEW_YEAR_THIRD_QUEST_HUD_NAME,
    NEW_YEAR_THIRD_QUEST_ID,
    NEW_YEAR_THIRD_QUEST_NAME,
    NEW_YEAR_THIRD_QUEST_REWARD_LOLLIPOPS,
    NEW_YEAR_THIRD_QUEST_VALID_WORD,
    NEW_YEAR_WORD_NPC_POSITION
} from "../../../../../../shared/events/newYear/quests.config";
import {LollipopsReward} from "../lollipopsReward";
import {EnterWordQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/enterWordQuestStep";
import {TalkWithNpcQuestFactory} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";


registerQuestFactory(
    NEW_YEAR_THIRD_QUEST_ID,
    new MultiStepQuestFactory(
        NEW_YEAR_THIRD_QUEST_ID,
        NEW_YEAR_THIRD_QUEST_NAME,
        new LollipopsReward(NEW_YEAR_THIRD_QUEST_REWARD_LOLLIPOPS),
        [
            new EnterWordQuestStepFactory(
                NEW_YEAR_THIRD_QUEST_VALID_WORD,
                NEW_YEAR_THIRD_QUEST_HUD_NAME,
                NEW_YEAR_WORD_NPC_POSITION
            ),
            new TalkWithNpcQuestFactory(NEW_YEAR_SANTA_NPC_ID, 'new-year-quest-3-dialog-2')
        ]
    )
)
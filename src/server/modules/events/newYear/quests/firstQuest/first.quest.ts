import './first.quest.dialogs';

import {registerQuestFactory} from "../../../../advancedQuests";
import {MultiStepQuestFactory} from "../../../../advancedQuests/impl/MultiStepQuest/multiStepQuest";
import {
    NEW_YEAR_FIRST_QUEST_COFFEE_GOAL,
    NEW_YEAR_FIRST_QUEST_COFFEE_ITEM_ID,
    NEW_YEAR_FIRST_QUEST_COGNAC_GOAL,
    NEW_YEAR_FIRST_QUEST_COGNAC_ITEM_ID,
    NEW_YEAR_FIRST_QUEST_DONUT_GOAL,
    NEW_YEAR_FIRST_QUEST_DONUT_ITEM_ID,
    NEW_YEAR_FIRST_QUEST_ID,
    NEW_YEAR_FIRST_QUEST_NAME, NEW_YEAR_FIRST_QUEST_REWARD_LOLLIPOPS,
    NEW_YEAR_FIRST_QUEST_TREES_GOAL,
    NEW_YEAR_FIRST_QUEST_TREES_ITEM_ID,
    NEW_YEAR_SANTA_NPC_ID
} from "../../../../../../shared/events/newYear/quests.config";
import {LollipopsReward} from "../lollipopsReward";
import {BuyItemQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/buyItemQuestStep";
import {TalkWithNpcQuestFactory} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";
import {LandFarmItemQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/landFarmItemQuestStep";

registerQuestFactory(NEW_YEAR_FIRST_QUEST_ID,
    new MultiStepQuestFactory(
        NEW_YEAR_FIRST_QUEST_ID,
        NEW_YEAR_FIRST_QUEST_NAME,
        new LollipopsReward(NEW_YEAR_FIRST_QUEST_REWARD_LOLLIPOPS),
        [
            new BuyItemQuestStepFactory(NEW_YEAR_FIRST_QUEST_COGNAC_ITEM_ID, NEW_YEAR_FIRST_QUEST_COGNAC_GOAL),
            new BuyItemQuestStepFactory(NEW_YEAR_FIRST_QUEST_DONUT_ITEM_ID, NEW_YEAR_FIRST_QUEST_DONUT_GOAL),
            new BuyItemQuestStepFactory(NEW_YEAR_FIRST_QUEST_COFFEE_ITEM_ID, NEW_YEAR_FIRST_QUEST_COFFEE_GOAL),
            new TalkWithNpcQuestFactory(NEW_YEAR_SANTA_NPC_ID, 'new-year-quest-1-dialog-2'),
            new LandFarmItemQuestStepFactory(NEW_YEAR_FIRST_QUEST_TREES_ITEM_ID,NEW_YEAR_FIRST_QUEST_TREES_GOAL),
            new TalkWithNpcQuestFactory(NEW_YEAR_SANTA_NPC_ID, 'new-year-quest-1-dialog-3')
        ]
    )
);
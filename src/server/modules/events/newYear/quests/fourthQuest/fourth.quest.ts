import './fourth.quest.dialogs';
import {registerQuestFactory} from "../../../../advancedQuests";
import {
    NEW_YEAR_FOURTH_QUEST_BANANA_GOAL,
    NEW_YEAR_FOURTH_QUEST_BANANA_ITEM_ID,
    NEW_YEAR_FOURTH_QUEST_CHEESE_BURGER_GOAL,
    NEW_YEAR_FOURTH_QUEST_CHEESE_BURGER_ITEM_ID,
    NEW_YEAR_FOURTH_QUEST_COLA_GOAL,
    NEW_YEAR_FOURTH_QUEST_COLA_ITEM_ID,
    NEW_YEAR_FOURTH_QUEST_ID,
    NEW_YEAR_FOURTH_QUEST_NAME,
    NEW_YEAR_FOURTH_QUEST_REWARD_LOLLIPOPS,
    NEW_YEAR_HOMELESS_NPC_ID,
    NEW_YEAR_SANTA_NPC_ID,
    NEW_YEAR_SPANISH_NPC_ID
} from "../../../../../../shared/events/newYear/quests.config";
import {MultiStepQuestFactory} from "../../../../advancedQuests/impl/MultiStepQuest/multiStepQuest";
import {LollipopsReward} from "../lollipopsReward";
import {MultiStepWrapperFactory} from "../../../../advancedQuests/impl/MultiStepQuest/multiStepWrapper";
import {TalkWithNpcQuestFactory} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";
import {BuyItemQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/buyItemQuestStep";

registerQuestFactory(
    NEW_YEAR_FOURTH_QUEST_ID,
    new MultiStepQuestFactory(
        NEW_YEAR_FOURTH_QUEST_ID,
        NEW_YEAR_FOURTH_QUEST_NAME,
        new LollipopsReward(NEW_YEAR_FOURTH_QUEST_REWARD_LOLLIPOPS),
        [
            new TalkWithNpcQuestFactory(NEW_YEAR_HOMELESS_NPC_ID, 'new-year-quest-4-dialog-2'),
            new MultiStepWrapperFactory([
                new BuyItemQuestStepFactory(NEW_YEAR_FOURTH_QUEST_CHEESE_BURGER_ITEM_ID, NEW_YEAR_FOURTH_QUEST_CHEESE_BURGER_GOAL),
                new BuyItemQuestStepFactory(NEW_YEAR_FOURTH_QUEST_COLA_ITEM_ID, NEW_YEAR_FOURTH_QUEST_COLA_GOAL)
            ], 1),
            new TalkWithNpcQuestFactory(NEW_YEAR_HOMELESS_NPC_ID, 'new-year-quest-4-dialog-3'),
            new TalkWithNpcQuestFactory(NEW_YEAR_SPANISH_NPC_ID, 'new-year-quest-4-dialog-4'),
            new BuyItemQuestStepFactory(NEW_YEAR_FOURTH_QUEST_BANANA_ITEM_ID, NEW_YEAR_FOURTH_QUEST_BANANA_GOAL),
            new TalkWithNpcQuestFactory(NEW_YEAR_SPANISH_NPC_ID, 'new-year-quest-4-dialog-5'),
            new TalkWithNpcQuestFactory(NEW_YEAR_SANTA_NPC_ID, 'new-year-quest-4-dialog-6')
        ]
    )
)
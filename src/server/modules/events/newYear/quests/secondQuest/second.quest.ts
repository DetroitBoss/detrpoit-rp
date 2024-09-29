import './second.quest.dialogs';
import {registerQuestFactory} from "../../../../advancedQuests";
import {
    NEW_YEAR_HARRY_NPC_ID,
    NEW_YEAR_SANTA_NPC_ID,
    NEW_YEAR_SECOND_QUEST_BANANA_GOAL,
    NEW_YEAR_SECOND_QUEST_BANANA_ITEM_ID, NEW_YEAR_SECOND_QUEST_CARRY_GOAL,
    NEW_YEAR_SECOND_QUEST_ID,
    NEW_YEAR_SECOND_QUEST_NAME, NEW_YEAR_SECOND_QUEST_REWARD_LOLLIPOPS,
    NEW_YEAR_SECOND_QUEST_WEED_ANIMATION_DATA, NEW_YEAR_SECOND_QUEST_WEED_HELP_TEXT,
    NEW_YEAR_SECOND_QUEST_WEED_POSITION_FIRST, NEW_YEAR_SECOND_QUEST_WEED_POSITION_FOURTH,
    NEW_YEAR_SECOND_QUEST_WEED_POSITION_SECOND, NEW_YEAR_SECOND_QUEST_WEED_POSITION_THIRD
} from "../../../../../../shared/events/newYear/quests.config";
import {MultiStepQuestFactory} from "../../../../advancedQuests/impl/MultiStepQuest/multiStepQuest";
import {LollipopsReward} from "../lollipopsReward";
import {TradeItemPlayerQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/tradeItemPlayerQuestStep";
import {TalkWithNpcQuestFactory} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";
import {MultiStepWrapperFactory} from "../../../../advancedQuests/impl/MultiStepQuest/multiStepWrapper";
import {CollectCheckpointQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/collectCheckpointQuestStep";
import {CarryPlayerQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/carryPlayerQuestStep";


registerQuestFactory(
    NEW_YEAR_SECOND_QUEST_ID,
    new MultiStepQuestFactory(
        NEW_YEAR_SECOND_QUEST_ID,
        NEW_YEAR_SECOND_QUEST_NAME,
        new LollipopsReward(NEW_YEAR_SECOND_QUEST_REWARD_LOLLIPOPS),
        [
            new TradeItemPlayerQuestStepFactory(NEW_YEAR_SECOND_QUEST_BANANA_ITEM_ID, NEW_YEAR_SECOND_QUEST_BANANA_GOAL),
            new TalkWithNpcQuestFactory(NEW_YEAR_SANTA_NPC_ID, 'new-year-quest-2-dialog-2'),
            new TalkWithNpcQuestFactory(NEW_YEAR_HARRY_NPC_ID, 'new-year-quest-2-dialog-3'),
            new MultiStepWrapperFactory([
                new CollectCheckpointQuestStepFactory(
                    NEW_YEAR_SECOND_QUEST_WEED_POSITION_FIRST,
                    NEW_YEAR_SECOND_QUEST_WEED_ANIMATION_DATA,
                    NEW_YEAR_SECOND_QUEST_WEED_HELP_TEXT
                ),
                new CollectCheckpointQuestStepFactory(
                    NEW_YEAR_SECOND_QUEST_WEED_POSITION_SECOND,
                    NEW_YEAR_SECOND_QUEST_WEED_ANIMATION_DATA,
                    NEW_YEAR_SECOND_QUEST_WEED_HELP_TEXT
                ),
                new CollectCheckpointQuestStepFactory(
                    NEW_YEAR_SECOND_QUEST_WEED_POSITION_THIRD,
                    NEW_YEAR_SECOND_QUEST_WEED_ANIMATION_DATA,
                    NEW_YEAR_SECOND_QUEST_WEED_HELP_TEXT
                ),
                new CollectCheckpointQuestStepFactory(
                    NEW_YEAR_SECOND_QUEST_WEED_POSITION_FOURTH,
                    NEW_YEAR_SECOND_QUEST_WEED_ANIMATION_DATA,
                    NEW_YEAR_SECOND_QUEST_WEED_HELP_TEXT
                )
            ], 3),
            new TalkWithNpcQuestFactory(NEW_YEAR_HARRY_NPC_ID, 'new-year-quest-2-dialog-4'),
            new TalkWithNpcQuestFactory(NEW_YEAR_SANTA_NPC_ID, 'new-year-quest-2-dialog-5'),
            new CarryPlayerQuestStepFactory(NEW_YEAR_SECOND_QUEST_CARRY_GOAL),
            new TalkWithNpcQuestFactory(NEW_YEAR_SANTA_NPC_ID, 'new-year-quest-2-dialog-6'),
        ],
    )
)
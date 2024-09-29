import './fifth.quest.dialogs';

import {registerQuestFactory} from "../../../../advancedQuests";
import {
    NEW_YEAR_FIFTH_QUEST_COLA_GOAL,
    NEW_YEAR_FIFTH_QUEST_COLA_ITEM_ID,
    NEW_YEAR_FIFTH_QUEST_COLLECT_ANIMATION_DATA,
    NEW_YEAR_FIFTH_QUEST_COLLECT_HELP_TEXT, NEW_YEAR_FIFTH_QUEST_COLLECT_HUD_TEXT,
    NEW_YEAR_FIFTH_QUEST_COLLECT_POSITION,
    NEW_YEAR_FIFTH_QUEST_ENERGY_GOAL,
    NEW_YEAR_FIFTH_QUEST_ENERGY_ITEM_ID,
    NEW_YEAR_FIFTH_QUEST_FIRST_LINE_ID, NEW_YEAR_FIFTH_QUEST_FIRST_LINE_REWARD_LOLLIPOPS,
    NEW_YEAR_FIFTH_QUEST_ID,
    NEW_YEAR_FIFTH_QUEST_JOB_GOAL,
    NEW_YEAR_FIFTH_QUEST_JOB_HUD_NAME,
    NEW_YEAR_FIFTH_QUEST_JOB_TYPE,
    NEW_YEAR_FIFTH_QUEST_NAME,
    NEW_YEAR_FIFTH_QUEST_PIZZA_GOAL,
    NEW_YEAR_FIFTH_QUEST_PIZZA_ITEM_ID, NEW_YEAR_FIFTH_QUEST_POTATO_GOAL,
    NEW_YEAR_FIFTH_QUEST_POTATO_ITEM_ID, NEW_YEAR_FIFTH_QUEST_REWARD_LOLLIPOPS,
    NEW_YEAR_FIFTH_QUEST_SECOND_LINE_ID, NEW_YEAR_FIFTH_QUEST_SECOND_LINE_REWARD_LOLLIPOPS,
    NEW_YEAR_FIFTH_QUEST_SIDR_GOAL,
    NEW_YEAR_FIFTH_QUEST_SIDR_ITEM_ID, NEW_YEAR_FIFTH_QUEST_TOMATO_GOAL, NEW_YEAR_FIFTH_QUEST_TOMATO_ITEM_ID,
    NEW_YEAR_MEGATRON_NPC_ID,
    NEW_YEAR_SANTA_NPC_ID
} from "../../../../../../shared/events/newYear/quests.config";
import {MultiStepQuestFactory} from "../../../../advancedQuests/impl/MultiStepQuest/multiStepQuest";
import {LollipopsReward} from "../lollipopsReward";
import {TalkWithNpcQuestFactory} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";
import {CollectCheckpointQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/collectCheckpointQuestStep";
import {JobQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/jobQuestStep";
import {MultiStepWrapperFactory} from "../../../../advancedQuests/impl/MultiStepQuest/multiStepWrapper";
import {BuyItemQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/buyItemQuestStep";
import {LandFarmItemQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/landFarmItemQuestStep";
import {CollectFarmItemQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/collectFarmItemQuestStep";
import {SendAdQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/sendAdQuestStep";
import {SpecificTextQuestStepWrapperFactory} from "../../../../advancedQuests/impl/MultiStepQuest/specificTextQuestStepWrapper";

registerQuestFactory(
    NEW_YEAR_FIFTH_QUEST_ID,
    new MultiStepQuestFactory(
        NEW_YEAR_FIFTH_QUEST_ID,
        NEW_YEAR_FIFTH_QUEST_NAME,
        new LollipopsReward(NEW_YEAR_FIFTH_QUEST_REWARD_LOLLIPOPS),
        [
            new TalkWithNpcQuestFactory(NEW_YEAR_MEGATRON_NPC_ID, 'new-year-quest-5-dialog-2')
        ]
    )
)

registerQuestFactory(
    NEW_YEAR_FIFTH_QUEST_FIRST_LINE_ID,
    new MultiStepQuestFactory(
        NEW_YEAR_FIFTH_QUEST_FIRST_LINE_ID,
        NEW_YEAR_FIFTH_QUEST_NAME,
        new LollipopsReward(NEW_YEAR_FIFTH_QUEST_FIRST_LINE_REWARD_LOLLIPOPS),
        [
            new TalkWithNpcQuestFactory(NEW_YEAR_SANTA_NPC_ID, 'new-year-quest-5-line-1-dialog-1'),
            new SpecificTextQuestStepWrapperFactory(NEW_YEAR_FIFTH_QUEST_COLLECT_HUD_TEXT,
                new CollectCheckpointQuestStepFactory(NEW_YEAR_FIFTH_QUEST_COLLECT_POSITION, NEW_YEAR_FIFTH_QUEST_COLLECT_ANIMATION_DATA, NEW_YEAR_FIFTH_QUEST_COLLECT_HELP_TEXT)),
            new TalkWithNpcQuestFactory(NEW_YEAR_SANTA_NPC_ID, 'new-year-quest-5-line-1-dialog-2'),
            new JobQuestStepFactory(NEW_YEAR_FIFTH_QUEST_JOB_TYPE, NEW_YEAR_FIFTH_QUEST_JOB_GOAL, NEW_YEAR_FIFTH_QUEST_JOB_HUD_NAME),
            new TalkWithNpcQuestFactory(NEW_YEAR_SANTA_NPC_ID, 'new-year-quest-5-line-1-dialog-3')
        ]
    )
)

registerQuestFactory(
    NEW_YEAR_FIFTH_QUEST_SECOND_LINE_ID,
    new MultiStepQuestFactory(
        NEW_YEAR_FIFTH_QUEST_SECOND_LINE_ID,
        NEW_YEAR_FIFTH_QUEST_NAME,
        new LollipopsReward(NEW_YEAR_FIFTH_QUEST_SECOND_LINE_REWARD_LOLLIPOPS),
        [
            new MultiStepWrapperFactory([
                new BuyItemQuestStepFactory(NEW_YEAR_FIFTH_QUEST_PIZZA_ITEM_ID, NEW_YEAR_FIFTH_QUEST_PIZZA_GOAL),
                new BuyItemQuestStepFactory(NEW_YEAR_FIFTH_QUEST_COLA_ITEM_ID, NEW_YEAR_FIFTH_QUEST_COLA_GOAL),
                new BuyItemQuestStepFactory(NEW_YEAR_FIFTH_QUEST_ENERGY_ITEM_ID, NEW_YEAR_FIFTH_QUEST_ENERGY_GOAL),
                new BuyItemQuestStepFactory(NEW_YEAR_FIFTH_QUEST_SIDR_ITEM_ID, NEW_YEAR_FIFTH_QUEST_SIDR_GOAL)
            ], 3),
            new TalkWithNpcQuestFactory(NEW_YEAR_MEGATRON_NPC_ID, 'new-year-quest-5-line-2-dialog-1'),
            new SendAdQuestStepFactory('Отправить объявление с новогодним поздравлением'),
            new TalkWithNpcQuestFactory(NEW_YEAR_SANTA_NPC_ID, 'new-year-quest-5-line-2-dialog-2'),
            new MultiStepWrapperFactory([
                new LandFarmItemQuestStepFactory(NEW_YEAR_FIFTH_QUEST_POTATO_ITEM_ID, NEW_YEAR_FIFTH_QUEST_POTATO_GOAL),
                new CollectFarmItemQuestStepFactory(NEW_YEAR_FIFTH_QUEST_TOMATO_ITEM_ID, NEW_YEAR_FIFTH_QUEST_TOMATO_GOAL)
            ], 1),
            new TalkWithNpcQuestFactory(NEW_YEAR_SANTA_NPC_ID, 'new-year-quest-5-line-2-dialog-3')
        ]
    )
)

mp.events.add('advancedQuests:collectCheckpointComplete', (player: PlayerMp) => {
    if (player.user.advancedQuests.isQuestActive(NEW_YEAR_FIFTH_QUEST_FIRST_LINE_ID)) {
        player.outputChatBox(`!{FF4500}*Оповещение из ближайшей Всепогодной акустики* Хей, это Санта и мой новогодний гномик ${player.user.name}. Мы поздравляем всех с наступающим Новым годом! Хей хоу.`);
    }
})
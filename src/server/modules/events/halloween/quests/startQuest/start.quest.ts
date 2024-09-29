import './start.quest.dialogs';

import {registerHookHandler} from "../../../../../../shared/hooks";
import {Dialog} from "../../../../advancedNpc/dialogs/interfaces/dialog";
import {NPC_INTERACT_HOOK, ServerNpc} from "../../../../advancedNpc";
import {getDialog} from "../../../../advancedNpc/dialogs/dialogs";
import {registerQuestFactory} from "../../../../advancedQuests";
import {
    BLUEBERRY_ITEM_ID,
    BOAR_MEAL_ITEM_ID,
    CHIPS_ITEM_ID, HALLOWEEN_GHOSTBUSTER_NPC_ID, HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    HALLOWEEN_HOUSE_POS,
    HALLOWEEN_START_QUEST_ID, HALLOWEEN_START_QUEST_NAME,
    MILK_ITEM_ID,
    POTATO_ITEM_ID,
    QUEST_1_BLUEBERRY_GOAL,
    QUEST_1_BOAR_MEAL_GOAL,
    QUEST_1_CHIPS_GOAL,
    QUEST_1_MILK_GOAL,
    QUEST_1_OBJECT_GOAL,
    QUEST_1_OBJECT_POSITIONS,
    QUEST_1_OBJECT_TO_FIND_MODEL, QUEST_1_OBJECT_TO_FIND_NAME,
    QUEST_1_POTATO_GOAL, QUEST_1_POTIONS_GOAL
} from "../../../../../../shared/events/halloween.config";
import {MultiStepQuestFactory} from "../../../../advancedQuests/impl/MultiStepQuest/multiStepQuest";
import {CollectHuntingQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/collectHuntingQuestStep";
import {TalkWithNpcQuestFactory} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";
import {BuyItemQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/buyItemQuestStep";
import {CollectFarmItemQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/collectFarmItemQuestStep";
import {GetToPositionQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/getToPositionQuestStep";
import {FindObjectQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/findObjectQuestStep";
import {PotionType} from "../../../../../../shared/events/halloween.potions";
import {CookPotionQuestStepFactory} from "../../potions/cookPotionQuestStep";
import {MultiStepWrapperFactory} from "../../../../advancedQuests/impl/MultiStepQuest/multiStepWrapper";
import {CandyReward} from "../candyReward";

// ПЕРВЫЙ КВЕСТ

registerQuestFactory(HALLOWEEN_START_QUEST_ID,
    new MultiStepQuestFactory(
        HALLOWEEN_START_QUEST_ID,
        HALLOWEEN_START_QUEST_NAME,
        new CandyReward(1000),
        [
            new CollectHuntingQuestStepFactory(BOAR_MEAL_ITEM_ID, QUEST_1_BOAR_MEAL_GOAL),
            new BuyItemQuestStepFactory(CHIPS_ITEM_ID, QUEST_1_CHIPS_GOAL),
            new TalkWithNpcQuestFactory(HALLOWEEN_GHOSTBUSTER_NPC_ID, 'halloween-quest-1-dialog-2'),
            new CollectFarmItemQuestStepFactory(MILK_ITEM_ID, QUEST_1_MILK_GOAL),
            new TalkWithNpcQuestFactory(HALLOWEEN_GHOSTBUSTER_NPC_ID, 'halloween-quest-1-dialog-3'),
            new MultiStepWrapperFactory([
                new GetToPositionQuestStepFactory(HALLOWEEN_HOUSE_POS, 10),
                new FindObjectQuestStepFactory(QUEST_1_OBJECT_TO_FIND_NAME, QUEST_1_OBJECT_TO_FIND_MODEL, QUEST_1_OBJECT_POSITIONS, QUEST_1_OBJECT_GOAL)
            ], 1),
            new TalkWithNpcQuestFactory(HALLOWEEN_GHOSTBUSTER_NPC_ID, 'halloween-quest-1-dialog-4'),
            new CollectFarmItemQuestStepFactory(POTATO_ITEM_ID, QUEST_1_POTATO_GOAL),
            new TalkWithNpcQuestFactory(HALLOWEEN_GHOSTBUSTER_NPC_ID, 'halloween-quest-1-dialog-5'),
            new CollectFarmItemQuestStepFactory(BLUEBERRY_ITEM_ID, QUEST_1_BLUEBERRY_GOAL),
            new TalkWithNpcQuestFactory(HALLOWEEN_GHOSTBUSTER_NPC_ID, 'halloween-quest-1-dialog-6'),
            new CookPotionQuestStepFactory(PotionType.HEALTH_DWARF, QUEST_1_POTIONS_GOAL),
        ]
    )
);


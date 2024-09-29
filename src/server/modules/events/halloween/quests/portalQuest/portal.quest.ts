import './portal.quest.dialogs';
import './portal';

import {registerQuestFactory} from "../../../../advancedQuests";
import {
    HALLOWEEN_GHOSTBUSTER_NPC_ID,
    HALLOWEEN_PORTAL_POSITION,
    HALLOWEEN_PORTALS_ARMORS_GOAL, HALLOWEEN_PORTALS_QUEST_BAG_REWARD_ITEM_ID,
    HALLOWEEN_PORTALS_QUEST_ID,
    HALLOWEEN_PORTALS_QUEST_NAME,
    HALLOWEEN_PORTALS_ZOMBIES_GOAL
} from "../../../../../../shared/events/halloween.config";
import {MultiStepQuestFactory} from "../../../../advancedQuests/impl/MultiStepQuest/multiStepQuest";
import {CandyReward} from "../candyReward";
import {MultiReward} from "../../../../advancedQuests/impl/Rewards/multiReward";
import {BuyItemQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/buyItemQuestStep";
import {ARMOR_ITEM_ID} from "../../../../../../shared/inventory";
import {WaitQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/waitQuestStep";
import {MultiStepWrapperFactory} from "../../../../advancedQuests/impl/MultiStepQuest/multiStepWrapper";
import {TalkWithNpcQuestFactory} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";
import {GetToPositionQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/getToPositionQuestStep";
import {EnterPortalQuestStepFactory} from "./enterPortalQuestStep";
import {DestroyPortalZombiesQuestStepFactory} from "./destroyZombiesQuestStep";
import {ItemReward} from "../../../../advancedQuests/impl/Rewards/itemReward";

registerQuestFactory(HALLOWEEN_PORTALS_QUEST_ID,
    new MultiStepQuestFactory(
        HALLOWEEN_PORTALS_QUEST_ID,
        HALLOWEEN_PORTALS_QUEST_NAME,
        new MultiReward([
            new ItemReward(HALLOWEEN_PORTALS_QUEST_BAG_REWARD_ITEM_ID, 1),
            new CandyReward(4000),
        ]),
        [
            new BuyItemQuestStepFactory(ARMOR_ITEM_ID, HALLOWEEN_PORTALS_ARMORS_GOAL),
            new TalkWithNpcQuestFactory(HALLOWEEN_GHOSTBUSTER_NPC_ID, 'halloween-quest-3-dialog-2'),
            new WaitQuestStepFactory(60),
            new TalkWithNpcQuestFactory(HALLOWEEN_GHOSTBUSTER_NPC_ID, 'halloween-quest-3-dialog-3'),
            new MultiStepWrapperFactory([
                new GetToPositionQuestStepFactory(HALLOWEEN_PORTAL_POSITION, 50),
                new EnterPortalQuestStepFactory(),
                new DestroyPortalZombiesQuestStepFactory(HALLOWEEN_PORTALS_ZOMBIES_GOAL)
            ], 2),
            new TalkWithNpcQuestFactory(HALLOWEEN_GHOSTBUSTER_NPC_ID, 'halloween-quest-3-dialog-4')
        ]
    )
);

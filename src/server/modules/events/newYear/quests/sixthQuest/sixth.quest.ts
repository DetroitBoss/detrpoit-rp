import './sixth.quest.dialogs';

import {registerQuestFactory} from "../../../../advancedQuests";
import {
    NEW_YEAR_ARIEL_NPC_ID,
    NEW_YEAR_GALILEO_NPC_POSITION, NEW_YEAR_SANTA_NPC_ID,
    NEW_YEAR_SIXTH_QUEST_COLLECT_ANIMATION,
    NEW_YEAR_SIXTH_QUEST_COLLECT_HUD_TEXT,
    NEW_YEAR_SIXTH_QUEST_COLLECT_POSITION,
    NEW_YEAR_SIXTH_QUEST_HUD_NAME,
    NEW_YEAR_SIXTH_QUEST_HUNT_GOAL,
    NEW_YEAR_SIXTH_QUEST_HUNT_ITEM_ID,
    NEW_YEAR_SIXTH_QUEST_ID,
    NEW_YEAR_SIXTH_QUEST_JOB_GOAL,
    NEW_YEAR_SIXTH_QUEST_JOB_HUD_NAME,
    NEW_YEAR_SIXTH_QUEST_JOB_TYPE, NEW_YEAR_SIXTH_QUEST_LEAVE_JOB_TEXT, NEW_YEAR_SIXTH_QUEST_LEAVE_JOB_TYPE,
    NEW_YEAR_SIXTH_QUEST_NAME,
    NEW_YEAR_SIXTH_QUEST_REWARD_ITEM_ID,
    NEW_YEAR_SIXTH_QUEST_REWARD_LOLLIPOPS,
    NEW_YEAR_SIXTH_QUEST_WORD_TEXT
} from "../../../../../../shared/events/newYear/quests.config";
import {MultiStepQuestFactory} from "../../../../advancedQuests/impl/MultiStepQuest/multiStepQuest";
import {MultiReward} from "../../../../advancedQuests/impl/Rewards/multiReward";
import {LollipopsReward} from "../lollipopsReward";
import {ItemReward} from "../../../../advancedQuests/impl/Rewards/itemReward";
import {TalkWithNpcQuestFactory} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";
import {CollectCheckpointQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/collectCheckpointQuestStep";
import {SpecificTextQuestStepWrapperFactory} from "../../../../advancedQuests/impl/MultiStepQuest/specificTextQuestStepWrapper";
import {CollectHuntingQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/collectHuntingQuestStep";
import {JobQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/jobQuestStep";
import {EnterWordQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/enterWordQuestStep";
import {LeaveJobQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/leaveFromJobQuestStep";


registerQuestFactory(
    NEW_YEAR_SIXTH_QUEST_ID,
    new MultiStepQuestFactory(
        NEW_YEAR_SIXTH_QUEST_ID,
        NEW_YEAR_SIXTH_QUEST_NAME,
        new LollipopsReward(NEW_YEAR_SIXTH_QUEST_REWARD_LOLLIPOPS),
        [
            new TalkWithNpcQuestFactory(NEW_YEAR_ARIEL_NPC_ID, 'new-year-quest-6-dialog-2'),
            new SpecificTextQuestStepWrapperFactory('Воссоединиться с природой',
                new CollectCheckpointQuestStepFactory(
                    NEW_YEAR_SIXTH_QUEST_COLLECT_POSITION,
                    NEW_YEAR_SIXTH_QUEST_COLLECT_ANIMATION,
                    NEW_YEAR_SIXTH_QUEST_COLLECT_HUD_TEXT
                )),
            new TalkWithNpcQuestFactory(NEW_YEAR_ARIEL_NPC_ID, 'new-year-quest-6-dialog-3'),
            new CollectHuntingQuestStepFactory(NEW_YEAR_SIXTH_QUEST_HUNT_ITEM_ID, NEW_YEAR_SIXTH_QUEST_HUNT_GOAL),
            new TalkWithNpcQuestFactory(NEW_YEAR_ARIEL_NPC_ID, 'new-year-quest-6-dialog-4'),
            new TalkWithNpcQuestFactory(NEW_YEAR_SANTA_NPC_ID, 'new-year-quest-6-dialog-5'),
            new JobQuestStepFactory(
                NEW_YEAR_SIXTH_QUEST_JOB_TYPE,
                NEW_YEAR_SIXTH_QUEST_JOB_GOAL,
                NEW_YEAR_SIXTH_QUEST_JOB_HUD_NAME
            ),
            new LeaveJobQuestStepFactory(NEW_YEAR_SIXTH_QUEST_LEAVE_JOB_TYPE, NEW_YEAR_SIXTH_QUEST_LEAVE_JOB_TEXT),
            new TalkWithNpcQuestFactory(NEW_YEAR_SANTA_NPC_ID, 'new-year-quest-6-dialog-6'),
            new EnterWordQuestStepFactory(
                NEW_YEAR_SIXTH_QUEST_WORD_TEXT,
                NEW_YEAR_SIXTH_QUEST_HUD_NAME,
                NEW_YEAR_GALILEO_NPC_POSITION
            ),
            new TalkWithNpcQuestFactory(NEW_YEAR_SANTA_NPC_ID, 'new-year-quest-6-dialog-7')
        ]
    )
)
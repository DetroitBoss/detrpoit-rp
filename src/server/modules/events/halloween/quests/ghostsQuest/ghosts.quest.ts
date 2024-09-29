import './ghosts.quest.dialogs';

import {registerQuestFactory} from "../../../../advancedQuests";
import {CustomEvent} from "../../../../custom.event";
import {
    HALLOWEEN_DESTROY_GHOST_EVENT,
    HALLOWEEN_END_GHOSTS_DESTROY_EVENT,
    HALLOWEEN_GHOSTBUSTER_NPC_ID,
    HALLOWEEN_GHOSTBUSTERS_CAR_MODEL,
    HALLOWEEN_GHOSTBUSTERS_CARS,
    HALLOWEEN_GHOSTS_COLLECT_MODULE_ANIMATION,
    HALLOWEEN_GHOSTS_COLLECT_MODULE_POSITION,
    HALLOWEEN_GHOSTS_COUNT,
    HALLOWEEN_GHOSTS_QUEST_ID,
    HALLOWEEN_GHOSTS_QUEST_NAME,
    HALLOWEEN_GHOSTS_QUEST_NPC_ID,
    HALLOWEEN_HOUSE_POS,
    HALLOWEEN_START_GHOSTS_DESTROY_EVENT
} from "../../../../../../shared/events/halloween.config";
import {IQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/IQuestStepFactory";
import {QuestStep} from "../../../../advancedQuests/impl/MultiStepQuest/questStep";
import {QuestVehicleFactory} from "../../../../advancedQuests/questVehicleFactory";
import {MultiStepQuestFactory} from "../../../../advancedQuests/impl/MultiStepQuest/multiStepQuest";
import {EnterVehicleQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/enterVehicleQuestStep";
import {GetToPositionQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/getToPositionQuestStep";
import {IQuestSavable} from "../../../../advancedQuests/interfaces/IQuestSavable";
import {QuestStepDto} from "../../../../../../shared/advancedQuests/dtos";
import {MultiStepWrapperFactory} from "../../../../advancedQuests/impl/MultiStepQuest/multiStepWrapper";
import {TalkWithNpcQuestFactory} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";
import {SpecificTextQuestStepWrapperFactory} from "../../../../advancedQuests/impl/MultiStepQuest/specificTextQuestStepWrapper";
import {CollectCheckpointQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/collectCheckpointQuestStep";
import {CookPotionQuestStepFactory} from "../../potions/cookPotionQuestStep";
import {PotionType} from "../../../../../../shared/events/halloween.potions";
import {WaitQuestStepFactory} from "../../../../advancedQuests/impl/MultiStepQuest/waitQuestStep";
import {CandyReward} from "../candyReward";

class GhostsDestroyQuestStepFactory implements IQuestStepFactory {
    private readonly _ghostsCount: number;

    constructor(ghostsCount: number) {
        this._ghostsCount = ghostsCount;
    }

    createQuestStep(player: PlayerMp, data: any): QuestStep {
        return new GhostsDestroyQuestStep(
            player,
            this._ghostsCount,
            data == null ? 0 : data as number
        );
    }
}

class GhostsDestroyQuestStep extends QuestStep implements IQuestSavable {
    private readonly _ghostsGoalCount: number;
    private _ghostsDestroyed: number;

    get hudDto(): QuestStepDto {
        return {
            name: `Устраните приведений`,
            completed: this.isComplete,
            count: this._ghostsDestroyed,
            countGoal: this._ghostsGoalCount
        }
    }

    get isComplete(): boolean {
        return this._ghostsDestroyed >= this._ghostsGoalCount;
    }

    constructor(player: PlayerMp, ghostsCount: number, ghostsLeft: number) {
        super(player);

        this._ghostsGoalCount = ghostsCount;
        this._ghostsDestroyed = ghostsLeft;
    }

    init(nextStep: () => void, updateHud: () => void) {
        super.init(nextStep, updateHud);

        CustomEvent.triggerClient(this._player, HALLOWEEN_START_GHOSTS_DESTROY_EVENT);
        CustomEvent.registerClient(HALLOWEEN_DESTROY_GHOST_EVENT, this.destroyGhostHandler);
    }

    onDestroy(): void {
        CustomEvent.triggerClient(this._player, HALLOWEEN_END_GHOSTS_DESTROY_EVENT);
        CustomEvent.unregisterClient(HALLOWEEN_DESTROY_GHOST_EVENT, this.destroyGhostHandler);
    }

    onQuestDestroy(): void {
    }

    destroyGhostHandler = (player: PlayerMp) => {
        if (player !== this._player) {
            return;
        }

        this._ghostsDestroyed++;
        this.update();

        if (this.isComplete) {
            this._nextStep();
        }
    }

    getSaveData = (): any => {
        return this._ghostsDestroyed;
    }
}

registerQuestFactory(
    HALLOWEEN_GHOSTS_QUEST_ID,
    new MultiStepQuestFactory(
        HALLOWEEN_GHOSTS_QUEST_ID,
        HALLOWEEN_GHOSTS_QUEST_NAME,
        new CandyReward(2000),
        [
            new SpecificTextQuestStepWrapperFactory(
                'Найдите чертеж оружия',
                new TalkWithNpcQuestFactory(HALLOWEEN_GHOSTS_QUEST_NPC_ID, 'halloween-quest-2-dialog-2')
            ),

            new TalkWithNpcQuestFactory(HALLOWEEN_GHOSTBUSTER_NPC_ID, 'halloween-quest-2-dialog-3'),

            new SpecificTextQuestStepWrapperFactory(
                'Достаньте энергетический модуль',
                new MultiStepWrapperFactory([
                    new GetToPositionQuestStepFactory(HALLOWEEN_GHOSTS_COLLECT_MODULE_POSITION, 30),

                    new CollectCheckpointQuestStepFactory(
                        HALLOWEEN_GHOSTS_COLLECT_MODULE_POSITION,
                        HALLOWEEN_GHOSTS_COLLECT_MODULE_ANIMATION,
                        'Сбор энергетического модуля'
                    )
                ], 1)
            ),

            new TalkWithNpcQuestFactory(HALLOWEEN_GHOSTBUSTER_NPC_ID, 'halloween-quest-2-dialog-4'),

            new CookPotionQuestStepFactory(PotionType.ALPHA, 1),

            new TalkWithNpcQuestFactory(HALLOWEEN_GHOSTBUSTER_NPC_ID, 'halloween-quest-2-dialog-5'),

            new WaitQuestStepFactory(15),

            new TalkWithNpcQuestFactory(HALLOWEEN_GHOSTBUSTER_NPC_ID, 'halloween-quest-2-dialog-6'),

            new MultiStepWrapperFactory([
                new EnterVehicleQuestStepFactory(
                    new QuestVehicleFactory(
                        HALLOWEEN_GHOSTBUSTERS_CARS,
                        HALLOWEEN_GHOSTBUSTERS_CAR_MODEL,
                        [255, 255, 255],
                        [255, 255, 255]
                    ),
                    true
                ),

                new GetToPositionQuestStepFactory(
                    HALLOWEEN_HOUSE_POS,
                    25
                ),

                new GhostsDestroyQuestStepFactory(HALLOWEEN_GHOSTS_COUNT)
            ],2),

            new TalkWithNpcQuestFactory(HALLOWEEN_GHOSTBUSTER_NPC_ID, 'halloween-quest-2-dialog-7')
        ]
    )
);



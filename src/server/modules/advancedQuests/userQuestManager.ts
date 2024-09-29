import {User} from "../user";
import {Quest} from "./interfaces/AbstractQuest";
import {QuestEntity} from "../typeorm/entities/quest.entity";
import {getQuestFactory} from "./index";

export class UserQuestManager {
    public static saveAll() {
        const users = [...User.list.values()];
        for (let user of users) {
            if (user.advancedQuests) {
                user.advancedQuests.save();
            }
        }
    }

    private readonly _user: User;
    private _activeQuests: { instance: Quest, entity: QuestEntity }[];
    private _completedQuests: string[];

    constructor(user: User) {
        this._user = user;
        user.afterLoginEvents.push(this.load.bind(this));
    }

    async load() {
        const questEntities = await QuestEntity.find({
            where: {
                user: { id: this._user.id }
            }
        });

        this._completedQuests = questEntities
            .filter(quest => quest.complete)
            .map(quest => quest.questId);

        this._activeQuests = questEntities
            .filter(quest => !quest.complete)
            .filter(quest => getQuestFactory(quest.questId))
            .map(questEntity => {
                const factory = getQuestFactory(questEntity.questId);
                const quest = factory.createQuest(this._user.player, JSON.parse(questEntity.dataJson))
                quest.init();
                return { instance: quest, entity: questEntity };
            });

        mp.events.call('advancedQuests:loaded', this._user);
    }

    isQuestCompleted(questId: string) {
        return this._completedQuests.some(id => id === questId);
    }

    isQuestActive(questId: string) {
        return this._activeQuests.some(quest => quest.instance.id === questId);
    }

    setQuestCompleted(questId: string) {
        const questIdx = this._activeQuests.findIndex(quest => quest.instance.id === questId);
        if (questIdx === -1) {
            return;
        }

        const { instance, entity } = this._activeQuests[questIdx];

        if (instance.reward) {
            instance.reward.giveReward(this._user.player);
        }
        instance.destroy();

        entity.complete = true;
        entity.save();

        this._activeQuests.splice(questIdx, 1);
        this._completedQuests.push(questId);
    }

    giveQuest(quest: Quest) {
        const questEntity = QuestEntity.create({
            user: this._user.entity,
            questId: quest.id
        });

        quest.init();
        this._activeQuests.push({ instance: quest, entity: questEntity });
    }

    async save() {
        const entities = this._activeQuests
            .map(quest => {
                quest.entity.dataJson = JSON.stringify(quest.instance.getSaveData());
                return quest.entity;
            })

        await QuestEntity.save(entities);
    }

    destroy() {
        this._activeQuests.forEach(quest => quest.instance.destroy());
    }
}

mp.events.add('playerQuit', (player: PlayerMp) => {
    if (!player || !player.user || !player.user.advancedQuests) {
        return;
    }

    player.user.advancedQuests.save();
    player.user.advancedQuests.destroy();
});
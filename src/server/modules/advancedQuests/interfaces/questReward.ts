export abstract class QuestReward {
    abstract async giveReward(player: PlayerMp): Promise<void>;
}
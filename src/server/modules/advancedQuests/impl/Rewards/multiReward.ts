import {QuestReward} from "../../interfaces/questReward";

export class MultiReward extends QuestReward {
    private readonly _rewards: QuestReward[];

    constructor(rewards: QuestReward[]) {
        super();

        this._rewards = rewards;
    }

    async giveReward(player: PlayerMp): Promise<void> {
        for (let reward of this._rewards) {
            await reward.giveReward(player);
        }
    }
}
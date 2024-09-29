import {QuestReward} from "../../../advancedQuests/interfaces/questReward";

export class CandyReward extends QuestReward {
    private readonly _candiesAmount: number;

    constructor(candiesAmount: number) {
        super();

        this._candiesAmount = candiesAmount;
    }

    async giveReward(player: PlayerMp): Promise<void> {
        player.user.giveCandies(this._candiesAmount);
    }
}
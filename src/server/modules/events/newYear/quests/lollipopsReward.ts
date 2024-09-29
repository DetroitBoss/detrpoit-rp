import {QuestReward} from "../../../advancedQuests/interfaces/questReward";

export class LollipopsReward extends QuestReward {
    private readonly _lollipopsAmount: number;

    constructor(lollipopsAmount: number) {
        super();

        this._lollipopsAmount = lollipopsAmount;
    }

    async giveReward(player: PlayerMp): Promise<void> {
        player.user.giveLollipops(this._lollipopsAmount);
        player.user.log('lollipops', `Получил леденцы за квест, в размере - ${this._lollipopsAmount}`);
    }
}
import {QuestReward} from "../../interfaces/questReward";

export class ItemReward extends QuestReward {
    private readonly _itemId: number;
    private readonly _amount: number;

    constructor(itemId: number, amount: number) {
        super();

        this._itemId = itemId;
        this._amount = amount;
    }

    async giveReward(player: PlayerMp): Promise<void> {
        if (!player || !player.user || !mp.players.exists(player)) {
            return;
        }

        await player.user.giveItem(this._itemId, false, false, this._amount);
    }
}
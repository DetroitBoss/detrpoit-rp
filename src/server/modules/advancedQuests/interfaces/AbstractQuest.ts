import {QuestBase} from "./questBase";
import {QuestReward} from "./questReward";

export abstract class Quest {
    public readonly id: string;
    public readonly reward: QuestReward;
    protected readonly _player: PlayerMp;
    protected readonly _data: any;

    protected constructor(baseData: QuestBase) {
        this.id = baseData.questId;
        this.reward = baseData.reward;
        this._player = baseData.player;
    }

    abstract init(): void

    abstract destroy(): void

    abstract getSaveData(): any
}
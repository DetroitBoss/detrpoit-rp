import {QuestReward} from "./questReward";

export interface QuestBase {
    questId: string,
    player: PlayerMp,
    reward: QuestReward
}
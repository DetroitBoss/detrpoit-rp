import {Quest} from "./AbstractQuest";

export interface IQuestFactory {
    createQuest(player: PlayerMp, data?: any): Quest;
}
import {QuestStep} from "./questStep";

export interface IQuestStepFactory {
    createQuestStep(player: PlayerMp, data: any): QuestStep
}
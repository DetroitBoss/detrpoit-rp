export interface QuestDto {
    questName: string,
    steps: QuestStepDto[]
}

export interface QuestStepDto {
    name: string,
    completed: boolean,
    countGoal?: number
    count?: number,
    notShowIfCompleted?: boolean,
}
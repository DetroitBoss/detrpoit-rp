export interface DialogNodeDto {
    id: number,
    npcReplies: DialogNpcReplyDto[],
    answers: string[]
}

export interface DialogNpcReplyDto {
    text: string,
    audioUrl?: string
}
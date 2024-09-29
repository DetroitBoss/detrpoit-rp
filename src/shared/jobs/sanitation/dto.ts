export interface ILobbyDTO {
    id: number
    name: string
    isPublic: boolean
}

export interface IMyLobbyDTO {
    id: number
    players: string[]
    ownerName: string
}
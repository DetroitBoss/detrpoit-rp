export interface IGunGamePlayerScore {
    name: string,
    kills: number
}

export interface IGunGamePlayerScores {
    topPlayers: IGunGamePlayerScore[]
    myKills: number
}
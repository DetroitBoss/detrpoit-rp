export interface SnowWarRating {
    name: string,
    kills: number
}

export interface RegistrationDTO {
    battleInProgress: boolean
    playersQueueLength: number
    timer: number
}


export interface HudUpdateDTO {
    health: number,
    kills: number,
    rating: SnowWarRating[],
    time: number
}

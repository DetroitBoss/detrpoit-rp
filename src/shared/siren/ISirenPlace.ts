export interface ISirenPlace {
    name: string
    remote: Vector3Mp
    position: Vector3Mp
    range: number
    dimension: number
    fractionIds: number[]
    time: number
    turnOnFrequency: number
    dispatchFractionIds?: number[]
}
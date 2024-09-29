import {ISirenPlace} from "./ISirenPlace";

export const SIREN_PLACES: ISirenPlace[] = [
    {
        name: "SANG",
        remote: new mp.Vector3(-2347.61, 3268.99, 31.81),
        position: new mp.Vector3(-2087.50, 3118.77, 35.78),
        range: 800,
        dimension: 0,
        fractionIds: [4],
        /** В минутах */
        time: 1,
        /** В минутах частота с которой можно включать */
        turnOnFrequency: 5,
        dispatchFractionIds: [4,7,2,3]
    }
]
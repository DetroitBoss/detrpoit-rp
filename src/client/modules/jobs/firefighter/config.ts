import {FirePlaceType} from "../../../../shared/jobs/firefighter/fireSpots";

export interface FirePlaceTypeConfig {
    asset: string,
    effect: string,
    scale: number,
    hp: number
}
export const FIREPLACE_TYPE_CONFIGS = new Map<FirePlaceType, FirePlaceTypeConfig>([
    [
        'small',
        { asset: 'core', effect: 'fire_object', scale: 2, hp: 300 }
    ],
    [
        'big',
        { asset: 'core', effect: 'fire_object', scale: 5, hp: 700 }
    ]
]);
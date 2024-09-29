import {randomArrayElement} from "../arrays";

const marketPedsModels = [
    'a_m_m_bevhills_01',
    's_m_m_migrant_01',
    'ig_oneil'
];

export function getMarketPedModel(): string {
    return randomArrayElement(marketPedsModels);
}
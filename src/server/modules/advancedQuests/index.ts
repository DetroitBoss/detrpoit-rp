import {system} from "../system";
import {IQuestFactory} from "./interfaces/IQuestFactory";

export const QUESTS_ROUTE_BLIP_COLOR = 27;
export const QUESTS_ROUTE_BLIP_NAME = 'Квестовое задание';

const registeredFactories = new Map<string, IQuestFactory>();
export function registerQuestFactory(questId: string, factory: IQuestFactory) {
    if (registeredFactories.has(questId)) {
        return system.debug.error(`[QUESTS] Attempt to register already registered quest factory. (${questId})`);
    }

    registeredFactories.set(questId, factory);
}

export function getQuestFactory(questId: string): IQuestFactory {
    return registeredFactories.get(questId);
}


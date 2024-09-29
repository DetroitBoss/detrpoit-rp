//todo: getNearestActivity
import { ActivityType } from './config'
import { EntranceComponent } from './dtos'
import { ANIMATION_FACTOR_FROM_PROGRESS, DEFAULT_LANDING_TIME, FARMER_LEVELS } from './progress.config'

export const getEntranceWorkerComponentByType = (type: ActivityType): EntranceComponent => {
    switch (type) {
        case ActivityType.Field:
            return 'FieldWorker'
        case ActivityType.Greenhouse:
            return 'GreenhouseWorker'
        case ActivityType.Animal:
            return 'CattleWorker'
    }
}

export const getRentComponentByType = (type: ActivityType): EntranceComponent => {
    switch (type) {
        case ActivityType.Field:
            return 'FieldOwner'
        case ActivityType.Greenhouse:
            return 'GreenhouseOwner'
        case ActivityType.Animal:
            return 'CattleOwner'
    }
}

export const getRentReadyComponentByType = (type: ActivityType): EntranceComponent => {
    switch (type) {
        case ActivityType.Field:
            return 'FieldReady'
        case ActivityType.Greenhouse:
            return 'GreenhouseReady'
        case ActivityType.Animal:
            return 'CattleReady'
    }
}

export const getFarmerLevelByExp = (exp: number) => {
    return isNaN(FARMER_LEVELS
        .find(level => level.requiredExp > exp)?.level - 1) 
        ? FARMER_LEVELS[FARMER_LEVELS.length - 1].level
        : FARMER_LEVELS.find(level => level.requiredExp > exp)?.level - 1
}

export const getLandingTime = (farmerLevel: number): number => {
    return DEFAULT_LANDING_TIME - (ANIMATION_FACTOR_FROM_PROGRESS * farmerLevel)
}
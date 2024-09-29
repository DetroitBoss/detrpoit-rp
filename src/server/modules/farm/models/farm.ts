import BaseActivity from './activities/baseActivity'
import {
    ACTIVITY_SPOTS,
    ActivityType,
    BEST_FARMER_SPOTS,
    IActivitySpot, IBestFarmerSpot,
} from '../../../../shared/farm/config'
import { Field } from './activities/field'
import { Greenhouse } from './activities/greenhouse'
import { Animal } from './activities/animal'
import { colshapes } from '../../checkpoints'
import { system } from '../../system'
import { CustomEvent } from '../../custom.event'
import { stats } from './stats'

/**
 * Ферма.
 */
export default class Farm {
    public static instance: Farm = new Farm()
    
    public readonly activities: Array<BaseActivity> = []
    
    constructor() {
        // Создаем табличку и все возможные активности
        ACTIVITY_SPOTS.map(s => this.createActivity(s))
        BEST_FARMER_SPOTS.map(Farm.createBestFarmerTable)
    }
    
    private createActivity(spot: IActivitySpot): void {
        let activityToAdd: BaseActivity
        
        switch (spot.type) {
            case ActivityType.Field:
                activityToAdd = new Field(spot)
                break;
            case ActivityType.Greenhouse:
                activityToAdd = new Greenhouse(spot)
                break;
            case ActivityType.Animal:
                activityToAdd = new Animal(spot)
                break;
            default:
                throw new Error('Unexpected ActivityType in Farm.createActivity()')
        }
        
        this.activities.push(activityToAdd)
    }

    private static createBestFarmerTable(spot: IBestFarmerSpot): void {
        colshapes.new(
            system.getVector3Mp(spot.pos),
            'Лучшие фермеры', 
                player => {
                    player.user.setGui('farm')
                    CustomEvent.triggerCef(player, 'farm:setComponent', 'best')
                    CustomEvent.triggerCef(player, 'farm:best:init', [stats.firstPlace, stats.secondPlace, stats.thirdPlace])
                }, { type: -1, radius: 2 }
        )
        mp.objects.new('farm_sign', system.getVector3Mp(spot.pos), {
            rotation: new mp.Vector3(0, 0, spot.heading)
        })
    }
}

export interface IFarmStage {
    startGameWithResult(player: PlayerMp, pointIdx?: number): boolean | Promise<boolean>
}
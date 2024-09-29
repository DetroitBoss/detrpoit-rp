import { CustomEvent } from '../custom.event'
import { IAnimalWorkData, IFarmWorkData, IFieldWorkData, IGreenhouseWorkData } from '../../../shared/farm/dtos'
import { user } from '../user'
import { FarmActivityBase } from './IFarmActivity'
import { ActivityType } from '../../../shared/farm/config'
import { FieldFarmActivity } from './field'
import { GreenhouseFarmActivity } from './greenhouse'
import { AnimalFarmActivity } from './animal'

export class FarmController {
    private currentActivity: FarmActivityBase
    
    public init(): void {
        CustomEvent.registerServer('farm:work:start', (data: IFieldWorkData | IGreenhouseWorkData | IAnimalWorkData | IFarmWorkData) => {
            this.currentActivity?.destroyAllWorkColshapes()
           
            switch (data.type) {
                case ActivityType.Field:
                    this.currentActivity = new FieldFarmActivity(data as IFieldWorkData)
                    break;
                case ActivityType.Greenhouse:
                    this.currentActivity = new GreenhouseFarmActivity(data as IGreenhouseWorkData)
                    break;
                case ActivityType.Animal:
                    this.currentActivity = new AnimalFarmActivity(data as IAnimalWorkData)
                    break;
            }
        })

        CustomEvent.registerServer('farm:point:processed', (pointIdx: number) => {
            this.currentActivity.onPointProcessed(pointIdx)
        })
        
        CustomEvent.registerServer('farm:work:stop', () => {
            this.currentActivity.destroyAllWorkColshapes()
            this.currentActivity = null
            CustomEvent.triggerCef('farmHud:hide')
        })

        mp.events.add('playerStartedEnterVehicle', (handle: number) => {
            const vehicle = mp.vehicles.atHandle(handle)
            const vehicleFarmActivityId = vehicle.getVariable('farm')

            if (!vehicleFarmActivityId) return

            if (!this.currentActivity || vehicleFarmActivityId != this.currentActivity.id) {
                user.notify('Вы не работаете на ферме которой принадлежит этот транспорт', 'warning')
                mp.players.local.clearTasksImmediately()
            }
        })
    }
}

new FarmController().init()
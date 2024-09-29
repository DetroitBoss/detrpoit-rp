import BaseActivity from './activities/baseActivity'
import { system } from '../../system'
import { FARM_STAND_OBJECT_MODEL, IActivitySpot } from '../../../../shared/farm/config'
import { colshapes } from '../../checkpoints'
import { Vehicle } from '../../vehicles'

export default class ActivityBuilder {
    public static build(activity: BaseActivity): void {
        const spot = activity.spot

        if (spot.standPos) mp.objects.new(FARM_STAND_OBJECT_MODEL, system.getVector3Mp(spot.standPos[0]), {
            rotation: new mp.Vector3(0, 0, spot.standPos[1])
        })

        this.buildColShapes(activity, spot)

        this.buildVehicles(activity, spot)
    }
    
    private static buildColShapes(activity: BaseActivity, spot: IActivitySpot): void {
        const ped = system.createPed(system.getVector3Mp(spot.pedPos[0]), spot.pedPos[1], activity.settings.managerPedHash)

        colshapes.new(system.getVector3Mp(spot.pedPos[0]).subtract(new mp.Vector3(0, 0, 1)),
            'Устроиться на работу',
            player => activity.onPlayerInteractedWithPed(player),
            { type: -1, onEnterHandler: _ => ped.setVariable('pedHi', 1)}
        )
        colshapes.new(system.getVector3Mp(spot.storagePos),
            'Склад',
            player => activity.onPlayerInteractedWithStock(player),
            { type: 1, radius: 0.8 }
        )
    }
    
    private static buildVehicles(activity: BaseActivity, spot: IActivitySpot): void {
        if (spot.vehicleSpawnPoints?.length) {
            spot.vehicleSpawnPoints.map(p => {
                const vehicle = Vehicle.spawn(activity.settings.vehicleModel, system.getVector3Mp(p[0]), p[1] ?? 0)
                vehicle.setColor(1, 2)
                vehicle.setVariable('farm', activity.id)
                activity.vehicles.push(vehicle)
            })
        }

        if (spot.trailerSpawnPoints?.length) {
            spot.trailerSpawnPoints.map(p => {
                Vehicle.spawn('raketrailer', system.getVector3Mp(p[0]), p[1] ?? 0)
            })
        }
    }
}
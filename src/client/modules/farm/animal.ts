import { FarmAnimalState, IAnimalWorkData, IFarmAnimal, IFarmWorkPoint } from '../../../shared/farm/dtos'
import { FarmActivityBase } from './IFarmActivity'
import { CustomEvent } from '../custom.event'
import { colshapeHandle, colshapes } from '../checkpoints'

export class AnimalFarmActivity extends FarmActivityBase {
    private _animals: Array<[IFarmAnimal, colshapeHandle]> = []
    
    constructor(public readonly data: IAnimalWorkData) {
        super(data.id, data.points)

        data.animals.forEach(a => {
            this._animals.push([a, colshapes.new(new mp.Vector3(data.points[a.id].pos.x, data.points[a.id].pos.y, data.points[a.id].pos.z), 'Корова', 
            _ => {
                    CustomEvent.triggerServer('farm:workPoint:enter', a.id)
                }, { type: -1, radius: 2 })])
        })
        
        CustomEvent.registerServer('farm:animal:update', (animal: IFarmAnimal) => {
            const animalToUpdate = this._animals.find(a => a[0].id == animal.id)
            animalToUpdate[0] = animal
        })
    }

    public onPointProcessed(idx: number): void {
    }

    protected onWorkStarted(points: IFarmWorkPoint[]): void {
    }
}
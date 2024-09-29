import { colshapeHandle, colshapes } from '../checkpoints'
import { CustomEvent } from '../custom.event'
import { IFarmWorkPoint } from '../../../shared/farm/dtos'

export interface IFarmActivity {
    startWork: () => void
    stopWork: () => void
    onPointProcessed: () => void
}

export abstract class FarmActivityBase {
    protected workColshapes: Map<number, colshapeHandle> = new Map<number, colshapeHandle>()
    public readonly id: number
    
    protected constructor(id: number, points: IFarmWorkPoint[]) {
        this.id = id
        if (this.workColshapes) this.destroyAllWorkColshapes()
        
        //this.onWorkStarted(points)
    }

    public destroyAllWorkColshapes(): void {
        this.workColshapes.forEach(shape => shape.destroy())
        this.workColshapes = new Map<number, colshapeHandle>()
    }
    
    public abstract onPointProcessed(idx: number): void
    
    protected abstract onWorkStarted(points: IFarmWorkPoint[]): void
}
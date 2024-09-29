import { IFarmWorkPoint, IGreenhouseWorkData } from '../../../shared/farm/dtos'
import { colshapes } from '../checkpoints'
import { CustomEvent } from '../custom.event'
import { FarmActivityBase } from './IFarmActivity'
import { ActivityType, GreenhouseStage } from '../../../shared/farm/config'

export class GreenhouseFarmActivity extends FarmActivityBase {

    constructor(public readonly data: IGreenhouseWorkData) {
        super(data.id, data.points)
        this.onWorkStarted(data.points)
    }

    public onPointProcessed(idx: number): void {
        this.workColshapes.get(idx)?.destroy()
    }

    public onWorkStarted(points: IFarmWorkPoint[]): void {
        CustomEvent.triggerCef('farmHud:show', ActivityType.Greenhouse, this.data.stage)
        
        if (this.data.stage == GreenhouseStage.Collection) {
            points.map((point, idx) => {
                if (!point.processed) {
                    this.workColshapes.set(idx, colshapes.new(new mp.Vector3(point.pos.x, point.pos.y, point.pos.z - 1), 'Собрать урожай', 
                            _ => CustomEvent.triggerServer('farm:workPoint:enter', idx), { type: -1, radius: 2 }))
                }
            })
        } else if (this.data.stage == GreenhouseStage.Water) {
            points.map((point, idx) => {
                if (!point.processed) {
                    this.workColshapes.set(idx, colshapes.new(new mp.Vector3(point.pos.x, point.pos.y, point.pos.z - 1), 'Полить', 
                        _ => CustomEvent.triggerServer('farm:workPoint:enter', idx), { type: -1, radius: 2 }))
                }
            })
        } else {
            points.map((point, idx) => {
                if (!point.processed) {
                    this.workColshapes.set(idx, colshapes.new(new mp.Vector3(point.pos.x, point.pos.y, point.pos.z - 1), '', null, {
                        onEnterHandler: _ => {
                            CustomEvent.triggerServer('farm:workPoint:enter', idx)
                        },
                        radius: 2,
                        type: 27,
                        rotation: 180,
                        color: [17, 255, 0, 100]
                    }))
                }
            }) 
        }
    }
}
import { IFarmWorkPoint, IFieldWorkData } from '../../../shared/farm/dtos'
import { colshapes } from '../checkpoints'
import { CustomEvent } from '../custom.event'
import { FarmActivityBase } from './IFarmActivity'
import { ActivityType, FieldStage } from '../../../shared/farm/config'
import { user } from '../user'

export class FieldFarmActivity extends FarmActivityBase {

    constructor(public readonly data: IFieldWorkData) {
        super(data.id, data.points)
        this.onWorkStarted(data.points)
    }
    
    public onPointProcessed(idx: number): void {
        this.workColshapes.get(idx)?.destroy()
    }

    public onWorkStarted(points: IFarmWorkPoint[]): void {
        CustomEvent.triggerCef('farmHud:show', ActivityType.Field, this.data.stage)
        
        if (this.data.stage === FieldStage.Collection) {
            points.map((point, idx) => {
                if (!point.processed) {
                    const z = mp.game.gameplay.getGroundZFor3dCoord(point.pos.x, point.pos.y, 1000, 0, true);
                    this.workColshapes.set(idx, colshapes.new(new mp.Vector3(point.pos.x, point.pos.y, z + 0.1), 'Собрать урожай', player => {
                        CustomEvent.triggerServer('farm:workPoint:enter', idx)
                    },
                    {type: -1, radius: 2.5}))
                }
            })
        } else {
            points.map((point, idx) => {
                if (!point.processed) {
                    const z = mp.game.gameplay.getGroundZFor3dCoord(point.pos.x, point.pos.y, 1000, 0, true);
                    this.workColshapes.set(idx, colshapes.new(new mp.Vector3(point.pos.x, point.pos.y, z + 0.1), '', null, {
                        onEnterHandler: player => {
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
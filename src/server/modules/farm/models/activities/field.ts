import BaseActivity from './baseActivity'
import { ActivityType, FieldStage, IActivitySpot, SUPPLIES_LIST } from '../../../../../shared/farm/config'
import { CustomEvent } from '../../../custom.event'
import { system } from '../../../system'
import { createFieldStage, IFieldStage } from './stages/field'
import { EXP_PER_ACTION, SALARY_PER_ACTION } from '../../../../../shared/farm/progress.config'
import { IFieldWorkData } from '../../../../../shared/farm/dtos'
import {FARM_COLLECT_EVENT} from "../../events";
import {FARM_TASK_MANAGER_EVENT} from "../../../battlePass/tasks/farmTaskManager";

/**
 * Поле на ферме.
 */
export class Field extends BaseActivity {
    private _cultivationCount: number = 0
    public currentStage: IFieldStage
    public readonly objects: Map<number, ObjectMp> = new Map<number, ObjectMp>()
    
    constructor(spot: IActivitySpot) {
        super(ActivityType.Field, spot)
        this.startStage(FieldStage.Cultivation, '')

        CustomEvent.registerCef('dotsGame:finish', async (player, id: number, result: boolean) => {
            if (!this.workers.includes(player)) return
            if (!result) return
            
            const supplyModel = SUPPLIES_LIST[this.objects.get(id).farmSupplyId]
            this.objects.get(id)?.destroy()

            await this.stock.addItem(supplyModel.vegInventoryItemId)
            mp.events.call(FARM_COLLECT_EVENT, player, supplyModel.vegInventoryItemId)
            mp.events.call(FARM_TASK_MANAGER_EVENT, player, supplyModel.vegInventoryItemId, false)

            this.points[id].processed = true
            this.workers.map(w => CustomEvent.triggerClient(w, 'farm:point:processed', id))
            player.farmWorker.addExp(EXP_PER_ACTION)
            player.farmWorker.addSalary(SALARY_PER_ACTION)

            this.handleStageEnd()
        })
    }

    protected populatePoints(): void {
        const bounds = this.spot.points.map(p => system.getVector3Mp(p[0]))
        const difference = bounds[2].subtract(bounds[0])
        const totalPointsInColumn = difference.length() / this.settings.pointSize - 1

        for (let i = 0; i < totalPointsInColumn; i++) {
            this.populatePointsInRow(difference.divide(totalPointsInColumn + 1).multiply(i + 1))
        }
    }
    
    private populatePointsInRow(yMultiplier: Vector3Mp): void {
        const bounds = this.spot.points.map(p => system.getVector3Mp(p[0]))
        const difference = bounds[1].subtract(bounds[0])
        const totalPointsInRow = difference.length() / this.settings.pointSize - 1

        for (let i = 0; i < totalPointsInRow; i++) {
            this.points.push({ pos: bounds[0].add(difference.divide(totalPointsInRow + 1).multiply(i + 1)).add(yMultiplier), processed: false })
        }
    }
    
    private startStage(stage: FieldStage, msgToPlayers: string): void {
        this.currentStage = createFieldStage(this, stage)
        this.workers.map(worker => {
            worker.notify(msgToPlayers, 'success')
        })
    }
    
    private startNextStage(): void {
        switch (this.currentStage.type) {
            case FieldStage.Cultivation:
                this.startStage(FieldStage.Landing, 'Поле готово к посадке растений')
                break;
            case FieldStage.Landing:
                this.startStage(FieldStage.Collection, 'Соберите растения')
                break;
            case FieldStage.Collection:
                this.startStage(FieldStage.Cultivation, 'Поле нуждается в культивации')
                break;
        }
        this.points.forEach(p => p.processed = false)
        this.sendNewStageData(this.workers)
    }
    
    private sendNewStageData(workers: PlayerMp[]): void {
        workers.map(worker => {
            CustomEvent.triggerClient(worker, 'farm:work:start', {
                id: this.id,
                type: this.type,
                points: this.points,
                stage: this.currentStage.type
            } as IFieldWorkData)
        })
    }
    
    private handleStageEnd(): void {
        // Нет необработанных точек
        if (!this.points.filter(p => !p.processed).length) {
            // Заставляем игрока пройти 3 стадии культивации
            if (this.currentStage.type === FieldStage.Cultivation) {
                if (this._cultivationCount >= 2) {
                    this.startNextStage()
                    this._cultivationCount = 0
                } else {
                    this.points.forEach(p => p.processed = false)
                    this.sendNewStageData(this.workers)
                    this._cultivationCount++
                }
            } 
            else this.startNextStage()
        }
    }
    
    public async onPlayerEnterWorkPoint(player: PlayerMp, pointIdx: number): Promise<void> {
        if (this.points[pointIdx].processed) return;
        if (!await this.currentStage.startGameWithResult(player, pointIdx)) return
        
        this.points[pointIdx].processed = true
        this.workers.map(w => CustomEvent.triggerClient(w, 'farm:point:processed', pointIdx))
        player.farmWorker.addExp(EXP_PER_ACTION)
        player.farmWorker.addSalary(SALARY_PER_ACTION)
        
        this.handleStageEnd()
    }
    
    protected onPlayerStartedWork(player: PlayerMp): void {
        this.sendNewStageData([player])
    }
}
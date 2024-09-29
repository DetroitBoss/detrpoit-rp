import BaseActivity from './baseActivity'
import { ActivityType, GreenhouseStage, IActivitySpot } from '../../../../../shared/farm/config'
import { system } from '../../../system'
import { CustomEvent } from '../../../custom.event'
import { IGreenhouseWorkData } from '../../../../../shared/farm/dtos'
import { EXP_PER_ACTION, SALARY_PER_ACTION } from '../../../../../shared/farm/progress.config'
import { createGreenhouseStage, IGreenhouseStage } from './stages/greenhouse'

/**
 * Фермеская теплица 
 */
export class Greenhouse extends BaseActivity {
    public readonly objects: Map<number, ObjectMp> = new Map<number, ObjectMp>()
    public currentStage: IGreenhouseStage
    
    constructor(spot: IActivitySpot) {
        super(ActivityType.Greenhouse, spot)
        this.startStage(GreenhouseStage.Landing, '')

        CustomEvent.registerCef('waterGame:finish', (player, result: boolean, id: number) => {
            if (!this.workers.includes(player)) return
            if (!result) return

            this.points[id].processed = true
            this.workers.map(w => CustomEvent.triggerClient(w, 'farm:point:processed', id))
            player.farmWorker.addExp(EXP_PER_ACTION)
            player.farmWorker.addSalary(SALARY_PER_ACTION)

            this.handleStageEnd()
        })
    }
    
    protected onPlayerStartedWork(player: PlayerMp): void {
        this.sendNewStageData([player])
    }

    private sendNewStageData(workers: PlayerMp[]): void {
        workers.map(worker => {
            CustomEvent.triggerClient(worker, 'farm:work:start', {
                id: this.id,
                type: this.type,
                points: this.points,
                stage: this.currentStage.type
            } as IGreenhouseWorkData)
        })
    }

    protected populatePoints(): void {
        this.spot.points.map(p => {
            this.points.push({ pos: system.getVector3Mp(p[0]), processed: false })
        })
    }

    private startStage(stage: GreenhouseStage, msgToPlayers: string): void {
        this.currentStage = createGreenhouseStage(this, stage)
        this.workers.map(worker => {
            worker.notify(msgToPlayers, 'success')
        })
    }
    
    private startNextStage(): void {
        switch (this.currentStage.type) {
            case GreenhouseStage.Landing:
                this.startStage(GreenhouseStage.Water, 'Теперь полейте саженцы')
                break;
            case GreenhouseStage.Water:
                this.startStage(GreenhouseStage.Collection, 'Соберите растения')
                break;
            case GreenhouseStage.Collection:
                this.startStage(GreenhouseStage.Landing, 'Теплица готова к посадке растений')
                break;
        }
        this.points.forEach(p => p.processed = false)
        this.sendNewStageData(this.workers)
    }
    
    private handleStageEnd(): void {
        // Нет необработанных точек
        if (!this.points.filter(p => !p.processed).length) {
            this.startNextStage()
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
}
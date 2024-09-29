import {
    ACTIVITY_SETTINGS,
    ActivityType,
    FARM_STAND_OBJECT_MODEL,
    IActivitySettings,
    IActivitySpot
} from '../../../../../shared/farm/config'
import { system } from '../../../system'
import { colshapes } from '../../../checkpoints'
import { IFarmWorkPoint, IFieldWorkData } from '../../../../../shared/farm/dtos'
import Farm from '../farm'
import { Vehicle } from '../../../vehicles'
import { CustomEvent } from '../../../custom.event'
import { FarmActivityStock } from '../stock'
import { FarmWorker } from '../worker'
import { getEntranceWorkerComponentByType, getFarmerLevelByExp } from '../../../../../shared/farm/helpers'
import {
    ACTIVITY_RENT_COST,
    ACTIVITY_RENT_TIME_IN_HOURS,
    FarmerLevel
} from '../../../../../shared/farm/progress.config'
import { User } from '../../../user'
import ActivityBuilder from '../activityBuilder'
import FarmActivityUi from './ui'

export default abstract class BaseActivity {
    protected readonly points: Array<IFarmWorkPoint> = []
    public readonly vehicles: Array<VehicleMp> = []
    public readonly stock: FarmActivityStock
    
    public readonly workers: Array<PlayerMp> = []
    public readonly name: string
    public readonly id: number
    
    private _ownerId: number
    private _rentTimer: number
    private _ui: FarmActivityUi

    public capital: number = 0
    public totalPaid: number = 0
    public rentedAt: number = system.timestamp
    
    public get settings(): IActivitySettings {
        return ACTIVITY_SETTINGS.get(this.type)
    }
    
    public get owner(): number {
        return this._ownerId
    }
    public set owner(userId: number) {
        this._ownerId = userId
    }
    
    protected constructor(
        public readonly type: ActivityType, 
        public readonly spot: IActivitySpot
    ) {
        this.name = this.settings.name
        this.id = system.personalDimension
        
        this._ui = new FarmActivityUi(this)
        this.stock = new FarmActivityStock(this)
        ActivityBuilder.build(this)
        
        this.populatePoints()
    }

    public onPlayerInteractedWithStock(player: PlayerMp): void {
        this.stock.open(player)
    }

    public async onPlayerInteractedWithPed(player: PlayerMp): Promise<void> {
        if (!this.owner) {
          this._ui.openRentMenu(player)  
        } else {
            if (this.owner == player.user.dbid) {
                this._ui.openOwnerMenu(player)
            } else if (player.farmWorker?.activity == this) {
               await this._ui.openWorkerMenu(player)
            } else {
                await this._ui.openEntranceMenu(player)
            }
        }
    }
    
    /**
     * Метод вызывается когда игрок успешно начнет работу у NPC.
     * @param player Игрок начавший работу.
     * @protected
     */
    protected abstract onPlayerStartedWork(player: PlayerMp): void
    protected abstract populatePoints(): void
    public abstract onPlayerEnterWorkPoint(player: PlayerMp, pointIdx: number): void
    
    public startWorkForPlayer(player: PlayerMp): void {
        if (player.farmWorker) return player.notify('Вы уже работаете на другой ферме', 'error')
        if (this.workers.length >= 5 && player.user.id != this.owner) 
            return player.notify('Здесь работает слишком много людей')
        
        player.farmWorker = new FarmWorker(player, this)
        
        this.workers.push(player)
        this.onPlayerStartedWork(player)
    }
    
    public rentTo(player: PlayerMp): void {
        if (player.farmWorker)
            return player.notify('Вы уже работаете на другой ферме', 'error')
        
        if (player.user.money < ACTIVITY_RENT_COST || !player.user.removeMoney(ACTIVITY_RENT_COST, false, 'Аренда на ферме')) 
            return player.notify('Недостаточно средств для аренды', 'warning')
        
        this.rentedAt = system.timestamp
        this.owner = player.user.id
        this.capital = 0
        this.totalPaid = 0
        this.startWorkForPlayer(player)
        
        this._ui.openRentReadyMenu(player)
        
        if (this._rentTimer) clearInterval(this._rentTimer)
        this._rentTimer = setTimeout(() => this.stopRent(), ACTIVITY_RENT_TIME_IN_HOURS * 3600000)
    }
    
    public stopWorkForPlayer(player: PlayerMp): void {
        if (!player.farmWorker) return
        
        this.workers.splice(this.workers.indexOf(player), 1)
        CustomEvent.triggerClient(player, 'farm:work:stop')
        
        player.user.addMoney(player.farmWorker.totalEarned, true, 'Заработал на ферме')
        this.totalPaid += player.farmWorker.totalEarned
        
        delete player.farmWorker
    }
    
    public stopRent(): void {
        if (!this.owner || this.owner == 0) return
        this.workers.map(worker => {
            this.stopWorkForPlayer(worker)
            worker.notify('Аренда фермы закончилась, ваш рабочий день закончен')
        })
        this.owner = 0
        this.capital = 0
    }
}
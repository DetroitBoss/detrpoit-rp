import BaseActivity from './baseActivity'
import { CustomEvent } from '../../../custom.event'
import { User } from '../../../user'
import {
    getEntranceWorkerComponentByType,
    getFarmerLevelByExp,
    getRentComponentByType, getRentReadyComponentByType
} from '../../../../../shared/farm/helpers'
import { SALARY_PER_ACTION } from '../../../../../shared/farm/progress.config'
import { IFarmOwnerData } from '../../../../../shared/farm/dtos'
import { FarmWorker } from '../worker'

export default class FarmActivityUi {
    constructor(private readonly _activity: BaseActivity) {
    }
    
    public async openWorkerMenu(player: PlayerMp): Promise<void> {
        const ownerUser = await User.getData(this._activity.owner)

        player.user.setGui('farm')
        CustomEvent.triggerCef(player, 'farm:setComponent', 'statistic')
        CustomEvent.triggerCef(player, 'farm:stats:open',
            ownerUser?.rp_name ?? 'Государство',
            ownerUser?.farmerExp ?? 0,
            this._activity.name,
            player.farmWorker.totalEarned,
            this._activity.rentedAt,
            player.farmWorker.exp)
    }
    
    public async openEntranceMenu(player: PlayerMp): Promise<void> {
        const ownerUser = await User.getData(this._activity.owner)

        player.user.setGui('farm')
        CustomEvent.triggerCef(player, 'farm:setComponent', 'entrance')
        CustomEvent.triggerCef(player, 'farm:entrance:worker',
            getEntranceWorkerComponentByType(this._activity.type),
            this._activity.id,
            ownerUser?.rp_name ?? 'Государство',
            this._activity.rentedAt,
            SALARY_PER_ACTION,
            getFarmerLevelByExp(player.user.entity.farmerExp))
    }

    public openRentMenu(player: PlayerMp): void {
        player.user.setGui('farm')
        CustomEvent.triggerCef(player, 'farm:setComponent', 'entrance')
        CustomEvent.triggerCef(player, 'farm:entrance:rent',
            getRentComponentByType(this._activity.type),
            this._activity.id
        )
    }

    public openRentReadyMenu(player: PlayerMp): void {
        player.user.setGui('farm')
        CustomEvent.triggerCef(player, 'farm:setComponent', 'entrance')
        CustomEvent.triggerCef(player, 'farm:entrance:rent',
            getRentReadyComponentByType(this._activity.type),
            this._activity.id
        )
    }

    public openOwnerMenu(player: PlayerMp): void {
        player.user.setGui('farm')
        CustomEvent.triggerCef(player, 'farm:setComponent', 'rating')
        CustomEvent.triggerCef(player, 'farm:owner',
            {
                id: this._activity.id,
                capital: this._activity.capital,
                totalPaid: this._activity.totalPaid,
                rentedAt: this._activity.rentedAt,
                workers: this._activity.workers.map(worker => {
                    return {
                        money: worker.farmWorker.totalEarned,
                        name: worker.user.name,
                        level: worker.farmWorker.level
                    }
                })
            } as IFarmOwnerData
        )
    }
}
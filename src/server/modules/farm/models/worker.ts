import BaseActivity from './activities/baseActivity'
import { FarmerLevel, SALARY_PER_ACTION } from '../../../../shared/farm/progress.config'
import { getFarmerLevelByExp } from '../../../../shared/farm/helpers'

export class FarmWorker {
    private _totalEarned: number = 0
    
    public get totalEarned(): number {
        return this._totalEarned
    }
    
    constructor(public readonly player: PlayerMp, public readonly activity: BaseActivity) {
    }
    
    public addExp(expToAdd: number): void {
        this.player.user.entity.farmerExp += expToAdd
    }
    
    public get level(): FarmerLevel {
        return getFarmerLevelByExp(this.player.user.entity.farmerExp)
    }

    public get exp(): number {
        return this.player.user.entity.farmerExp
    }
    
    public addSalary(cashToAdd: number): void {
        if (this.activity.capital <= 0)
            return this.player.notify('У фермы нет денег чтобы платить вам зарплату', 'warning')

        this.activity.capital -= cashToAdd
        this._totalEarned += cashToAdd
    }
}
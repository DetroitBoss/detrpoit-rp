import { User } from '../user'
import { CustomEvent } from '../custom.event'
import { IUserStatsDto } from '../../../shared/userStats'
import { NoSQLbase } from '../nosql'
import {PAYDAY_NEED_PLAY} from "../../../shared/payday";

export class UserStats {
    static dailyOnline = new NoSQLbase<{id: number, hours: number}>('dailyOnline');
    static monthlyOnline = new NoSQLbase<{id: number, hours: number}>('monthlyOnline');
    
    static moneyEarned = new NoSQLbase<{id: number, money: {
        daily: number
        monthly: number
        }}>('moneyEarned');

    static getDaylyOnline(id: number) {
        let index = UserStats.dailyOnline.data.findIndex(q => q.id === id);
        if(index === -1) return 0;
        else return UserStats.dailyOnline.data[index].hours
    }

    static getMonthlyOnline(id: number) {
        let index = UserStats.monthlyOnline.data.findIndex(q => q.id === id);
        if (index === -1) return 0;
        else return UserStats.monthlyOnline.data[index].hours
    }

    static getDailyEarned(id: number) {
        let index = UserStats.moneyEarned.data.findIndex(q => q.id === id);
        if(index === -1) return 0;
        else return UserStats.moneyEarned.data[index].money.daily
    }

    static getMonthlyEarned(id: number) {
        let index = UserStats.moneyEarned.data.findIndex(q => q.id === id);
        if(index === -1) return 0;
        else return UserStats.moneyEarned.data[index].money.monthly
    }
    
    constructor(private readonly _user: User) {
        
    }
    
    public getDto(): IUserStatsDto {
        return {
            userStats: this._user.entity.stats,
            regDate: this._user.entity.date_reg,
            dailyOnline: UserStats.getDaylyOnline(this._user.id),
            monthlyOnline: UserStats.getMonthlyOnline(this._user.id),
            dailyMoneyEarned: UserStats.getDailyEarned(this._user.id),
            monthlyMoneyEarned: UserStats.getMonthlyEarned(this._user.id),
            workStats: this._user.jobStats
        }
    }
    
    public spendMoney(amount: number) {
        if (isNaN(amount) || amount <= 0)
            return
        
        this._user.entity.stats = {...this._user.entity.stats, totalMoneySpend: !this._user.entity.stats.totalMoneySpend ? amount : this._user.entity.stats.totalMoneySpend + amount }
    }

    public earnMoney(amount: number) {
        if (isNaN(amount) || amount <= 0)
            return

        this._user.entity.stats = {...this._user.entity.stats, totalMoneyEarned: !this._user.entity.stats.totalMoneyEarned ? amount : this._user.entity.stats.totalMoneyEarned + amount }
        let index = UserStats.moneyEarned.data.findIndex(q => q.id === this._user.id)
        if (index == -1)
            UserStats.moneyEarned.data.push({id: this._user.id, money: { daily: amount, monthly: amount }})
        else {
            UserStats.moneyEarned.data[index].money.daily += amount
            UserStats.moneyEarned.data[index].money.monthly += amount
        }
    }
    
    public kill(): void {
        this._user.entity.stats = {...this._user.entity.stats, totalKills: !this._user.entity.stats.totalKills ? 1 : this._user.entity.stats.totalKills + 1 }
    }
    
    public death(): void {
        this._user.entity.stats = {...this._user.entity.stats, totalDeaths: !this._user.entity.stats.totalDeaths ? 1 : this._user.entity.stats.totalDeaths + 1 }
    }
}

CustomEvent.register('newHour', () => {
    User.list.forEach(user => {
        if (user.afk) return;
        if (User.playedTime.has(user.id) && User.playedTime.get(user.id) < 20) return
        user.entity.stats = {...user.entity.stats, totalPlayedTime: !user.entity.stats.totalPlayedTime ? 1 : user.entity.stats.totalPlayedTime + 1 }
    })
})

CustomEvent.register('newHour', (hour) => {
    if (hour === 0) {
        UserStats.dailyOnline.clear()
        UserStats.moneyEarned.data.forEach(d => d.money.daily = 0)
    } else {
        User.list.forEach(user => {
            if (user.afk) return;
            if (User.playedTime.has(user.id) && User.playedTime.get(user.id) < 20) return
            user.achiev.achievTickByType("playTime")
            let index = UserStats.dailyOnline.data.findIndex(q => q.id === user.id);
            if (index == -1) UserStats.dailyOnline.data.push({id: user.id, hours: 1})
            else UserStats.dailyOnline.data[index].hours++;
        })
    }

    if (hour == 1 && (new Date()).getDate() == 1) {
        UserStats.monthlyOnline.clear()
        UserStats.moneyEarned.data.forEach(d => d.money.monthly = 0)
    } else {
        User.list.forEach(user => {
            if (user.afk) return;
            if (User.playedTime.has(user.id) && User.playedTime.get(user.id) < 20) return
            let index = UserStats.monthlyOnline.data.findIndex(q => q.id === user.id);
            if (index == -1) UserStats.monthlyOnline.data.push({id: user.id, hours: 1})
            else UserStats.monthlyOnline.data[index].hours++;
        })
    }

    UserStats.dailyOnline.save();
    UserStats.monthlyOnline.save();
    UserStats.moneyEarned.save()
})

CustomEvent.registerCef('userStats:get', (player) => {
    return player.user.stats.getDto()
})

export interface IUserStats {
    /** Все отыгранное время в часах */
    totalPlayedTime: number
    /** Сколько денег было потрачено всего */
    totalMoneySpend: number
    /** Сколько денег было заработано всего */
    totalMoneyEarned: number
    totalKills: number
    totalDeaths: number
}

export interface IUserStatsDto {
    userStats: IUserStats
    
    regDate: number
    dailyOnline: number,
    monthlyOnline: number

    dailyMoneyEarned: number
    monthlyMoneyEarned: number
    
    workStats: {[p: string]: number}
}
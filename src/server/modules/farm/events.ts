import { CustomEvent } from '../custom.event'
import Farm from './models/farm'
import { ACTIVITY_RENT_COST } from '../../../shared/farm/progress.config'
import { User } from '../user'

export const FARM_COLLECT_EVENT = 'farm:collectItem';
export const FARM_LAND_EVENT = 'farm:landItem';

CustomEvent.registerClient('farm:workPoint:enter', (player, pointIdx: number) => {
    if (!player.farmWorker) return
    player.farmWorker.activity.onPlayerEnterWorkPoint(player, pointIdx)
})

CustomEvent.registerCef('farm:work:start', (player, id: number) => {
    if (!player.user) return;
    const activity = Farm.instance.activities.find(a => a.id === id)
    activity.startWorkForPlayer(player)
    player.user.setGui(null)
})

CustomEvent.registerCef('farm:work:leave', (player) => {
    if (!player.user) return;
    player.farmWorker?.activity.stopWorkForPlayer(player)
})

CustomEvent.registerCef('farm:rent', (player, id: number) => {
    if (!player.user) return;
    const activity = Farm.instance.activities.find(a => a.id === id)
    activity.rentTo(player)
})

CustomEvent.registerCef('farm:rent:stop', (player, id: number) => {
    if (!player.user) return;
    const activity = Farm.instance.activities.find(a => a.id === id)
    activity.stopRent()
    player.user.setGui(null)
})

CustomEvent.registerCef('farm:capital:add', (player, sum: number) => {
    if (!player.user) return;
    const activity = player.farmWorker?.activity
    
    if (!activity || activity.owner != player.user.id) 
        return player.notify('Неожиданная ошибка!', 'error')
    if (isNaN(sum) || sum <= 0 || sum > 999999)
        return player.notify('Сумма введена неверно', 'error')
    if (player.user.money < sum || !player.user.removeMoney(sum, false, 'Аренда на ферме'))
        return player.notify('Недостаточно средств для аренды', 'warning')
    
    activity.capital += sum
    
    player.user.setGui(null)
})

mp.events.add('playerQuit', player => {
     if (!player.farmWorker) return;
     player.farmWorker.activity.stopWorkForPlayer(player)
})

mp.events.add('_userLoggedIn', (user: User) => {
    const activity = Farm.instance.activities.find(a => a.owner == user.id)
    if (!activity) return
    
    activity.startWorkForPlayer(user.player)
})
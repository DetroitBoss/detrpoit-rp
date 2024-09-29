
import { is } from 'bluebird';
import { OWNER_TYPES } from '../../shared/inventory';
import { CustomEvent } from './custom.event';
import { dress } from './customization';
import { inventory } from './inventory';
import { system } from './system';

export type WinTaskType = "money" | "coins" | "wear"


export const WinTaskCreate = (player: PlayerMp, task_name: string, win_type: WinTaskType, amount: number) => {
    if(!task_name) return system.debug.error('WinTaskCreate no task_name')
    if(!win_type) return system.debug.error('WinTaskCreate no win_type')
    let type: number
    let desc: string = ''
    if (win_type == "money") {
        player.user.addMoney(amount, false, `Награда (${task_name})`)
        type = 9999
    }
    if (win_type == "coins") {
        type = 10000
        player.user.account.donate += amount
        player.user.account.save()
    }
    if (win_type == "wear") {
        const isMale = player.user.is_male
        const randomWear = system.randomArrayElement( dress.data.filter(k => (k.forBox && k.male == isMale) ) )
        if (!randomWear) return; 
        inventory.createItem({
            item_id: randomWear.inventoryIcon,
            owner_type: OWNER_TYPES.PLAYER,
            owner_id: player.dbid,
            serial: randomWear.name,
            advancedNumber: randomWear.id
        })
        type = randomWear.inventoryIcon
        desc = `(${randomWear.name})`
    }
    
    if (type) {
        CustomEvent.triggerClient(player, 'wintask:create', task_name, [{ type, ammount:amount, desc }])
    }
}
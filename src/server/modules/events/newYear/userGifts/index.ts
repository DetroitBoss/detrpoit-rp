import { colshapes } from '../../../checkpoints'
import { CustomEvent } from '../../../custom.event'
import { UserGiftEntity } from '../../../typeorm/entities/userGift'
import { inventory } from '../../../inventory'
import { inventoryShared, OWNER_TYPES } from '../../../../../shared/inventory'
import { User } from '../../../user'

class NewYearGifts {
    public init(): void {
        colshapes.new(new mp.Vector3(-503.43, -229.03, 36.45), 'Получить подарок', async player => {
            const playerGifts = await UserGiftEntity.find({
                where: {userToId: player.user.id}
            })
            
            if (playerGifts.length == 0) {
                return player.user.notify('К сожалению, для вас не осталось подарков')
            }

            const data: [number, string][] = []
        
            await Promise.all(playerGifts.map(async giftEntity => {
                if (inventoryShared.get(giftEntity.item_id)?.blockMove)
                    return
                
                const userFrom = await User.getData(giftEntity.userFromId)
                data.push([giftEntity.item_id, `Подарок от ${userFrom.rp_name}`])
            }))
            player.user.setGui('newYearsGift')

            CustomEvent.triggerCef(player, 'newYearsGift:setGifts', data)
        }, { type: -1, radius: 8 })
    }

    /**
     * Добавить подарок в очередь на отправку
     */
    public async addGiftToQueue(player: PlayerMp, itemId: number, targetId: number): Promise<void> {
        if (!player.user.inventory.some(i => i.item_id === itemId))
            return player.user.notify('Предмета нет у вас в инвентаре', 'warning')
        
        if (isNaN(itemId) || isNaN(targetId) || targetId <= 0 || itemId <= 0)
            return player.user.notify('Ошибка ввода данных', 'warning')
        
        if (targetId == player.user.id)
            return player.user.notify('Нельзя отправить подарок самому себе', 'error')
        
        player.user.setGui(null)
        player.user.notify('Подарок отправлен и будет доставлен 1 января', 'success')
        inventory.deleteItemsById(player, itemId, 1)
        await UserGiftEntity.insert({
            item_id: itemId, 
            userFromId: player.user.id,
            userToId: targetId
        })
    }
    
    public async giveGiftToPlayer(player: PlayerMp): Promise<void> {
        const playerGifts = await UserGiftEntity.find({
            where: {userToId: player.user.id}
        })
        
        playerGifts.forEach(gift => {
            UserGiftEntity.delete(gift.id)
            inventory.createItem({
                item_id: gift.item_id, owner_type: OWNER_TYPES.PLAYER, owner_id: player.user.id
            })
        })
    }
}

export const newYearGiftsManager = new NewYearGifts()

//newYearGiftsManager.init()

CustomEvent.registerCef('newYearsGift:send', newYearGiftsManager.addGiftToQueue)
CustomEvent.registerCef('newYearsGift:get', newYearGiftsManager.giveGiftToPlayer)
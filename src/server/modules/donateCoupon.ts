import { gui } from './gui'
import fetch from 'node-fetch'
import { PAYMENT_SERVICE_USE_COUPON_PATH } from '../../shared/donate'

gui.chat.registerCommand("usecoupon", async (player, ...args) => {
    if (!player.user) return;
    
    const code = args.join(' ');
    
    if (!code) return;
    
    await useCoupon(player, code, player.user.id);
})

const useCoupon = async (player: PlayerMp, code: string, activatorId: number): Promise<void> => {
    const response = await fetch(PAYMENT_SERVICE_USE_COUPON_PATH, {
        method: 'POST',
        body: JSON.stringify({code, activatorId}),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const responseBody: IUseCouponResponse = await response.json()
    
    if (!responseBody.success)
        return player.notify('Неверно введен купон')
    
    if (isNaN(responseBody.coinsAmount))
        return player.notify('Серверная ошибка')
    
    player.user.addDonateMoney(responseBody.coinsAmount, `Ввел код kinguin купона (${code})`)
    player.notify(`Купон на ${responseBody.coinsAmount} коинов успешно активирован`)
}

interface IUseCouponResponse {
    success: boolean
    coinsAmount: number
}
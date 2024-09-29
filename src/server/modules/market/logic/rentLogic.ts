import {CustomEvent} from "../../custom.event";
import {getPlayerTent} from "../TradeTent";
import {getMarketRentCompensation, RENT_COMMON_TENT_COST, RENT_TICK_MINUTES} from "../../../../shared/market/config";
import {menu} from "../../menu";
import {systemUtil} from "../../../../shared/system";

CustomEvent.registerCef('market::finishRent', async (player) => {
    player.user.setGui(null);
    const tent = getPlayerTent(player);
    if (!tent) {
        return;
    }

    const compensation = getMarketRentCompensation(tent.timeLeftS);
    const playerAnswer = await menu.accept(player,
        `Вы уверены, что хотите досрочно завершить аренду и получить ${systemUtil.numberFormat(compensation)}`);

    if (!playerAnswer || !tent.exists) {
        return;
    }

    tent.destroy();
    player.user.addMoney(compensation, true, 'Возврат за досрочное завершение аренды палатки');
    player.notify('Вы завершили аренду палатки досрочно, нераспроданные предметы перемещены на склад', 'success');
});

CustomEvent.registerCef('market::expandRent', async (player, expandTimeMin: number) => {
    player.user.setGui(null);
    const tent = getPlayerTent(player);
    if (!tent) {
        return;
    }

    const expandRentCost = expandTimeMin / RENT_TICK_MINUTES * RENT_COMMON_TENT_COST;
    const isPaymentSuccess = await player.user.tryPayment(expandRentCost, 'all',
        () => tent.exists, 'Продление аренды палатки', 'Рынок');

    if (!isPaymentSuccess) {
        return;
    }

    tent.expandRentTime(expandTimeMin * 60);
    player.notify(`Вы увеличили время аренда на ${expandTimeMin} мин.`, 'success');
});

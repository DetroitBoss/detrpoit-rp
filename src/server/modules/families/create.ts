import {CustomEvent} from "../custom.event";
import {
    FAMILY_CREATE_COINS,
    FAMILY_CREATE_MONEY, FAMILY_CREATE_POS_CRIME,
    FAMILY_CREATE_POS_GOS,
    FamilyReputationType
} from "../../../shared/family";
import {PayType} from "../../../shared/pay";
import {colshapes} from "../checkpoints";
import {Family} from "./family";
import {system} from "../system";


enum PayTypeFamily {
    CASH = PayType.CASH,
    CARD = PayType.CARD,
    DONATE = 150
}
const createPosition = FAMILY_CREATE_POS_GOS


colshapes.new(new mp.Vector3(createPosition.x, createPosition.y, createPosition.z), 'Создание семьи', (player) => {
    familyCreateGUI(player)
}, {
    drawStaticName: "scaleform",
    dimension: 0
})

/** Отобразить ГУИ создания семьи игроку */
export const familyCreateGUI = (player: PlayerMp) => {
    if(!mp.players.exists(player) || !player.user) return;
    if(player.user.family) return player.notify('Вы не можете создать семью, так как состоите в другой семье')
    CustomEvent.triggerClient(player, 'family:create:start', [player.user.account.freeFamily ? 1 : FAMILY_CREATE_COINS, player.user.account.freeFamily ? 1 : FAMILY_CREATE_MONEY])
}

CustomEvent.registerCef('family:create', (player: PlayerMp, name: string, payType: PayTypeFamily, pin: string) => {
    if (!name || ! /^[a-zA-Z_-]{0,15}$/i.test(name)) {
        player.notify('Не удалось создать семью с выбранным названием.', "error")
        return false
    }
    if (Family.getAll().find(f => f.name == name)) {
        player.notify('Семья с таким названием уже существует', "error")
        return false;
    }
    let user = player.user;


    if(!user.account.freeFamily) {
        if (payType == PayTypeFamily.CASH) {
            if (user.money < FAMILY_CREATE_MONEY) {
                player.notify("У вас недостаточно средств", 'error');
                return false
            }
            user.removeMoney(FAMILY_CREATE_MONEY, true, 'Создание семьи')
        }
        else if (payType == PayTypeFamily.CARD) {
            if (!user.verifyBankCardPay(pin)) {
                player.notify(`Либо вы ввели не верный пин-код, либо у вас нет при себе банковской карты`, 'error')
                return false
            }
            if (!user.tryRemoveBankMoney(FAMILY_CREATE_MONEY, true, 'Создание семьи', `${name}`)) return false;
        }
        else if (payType == PayTypeFamily.DONATE) {
            if (!user.tryRemoveDonateMoney(FAMILY_CREATE_COINS, true, 'Создание семьи')) return false;
        }
        else {
            system.debug.error('[Семьи] Попытка использовать несуществующий тип оплаты')
            return false
        }
    }


    Family.new(name).then((f) => {
        if(!user.exists) return;
        player.user.family = f
        player.user.familyRank = player.user.family.leaderRankID
        if(player.user.account.freeFamily) player.user.account.freeFamily = 0
        player.notify('Поздравляем! Вы создали семью', "success")
    }).catch(r => {
        console.error('[ERROR] Ошибка создания семьи: ' + r);
        player.notify('Не удалось создать семью. Обратитесь к Администрации сервера.', "error")
    })
    return true;
})

import {CustomEvent} from "../custom.event";
import {tempPromo} from "../admin";
import {AccountEntity} from "../typeorm/entities/account";
import {MEDIA_PROMOCODE} from "../../../shared/economy";
import {PromocodeList, PromocodeUseEntity} from "../typeorm/entities/promocodes";
import {system} from "../system";
import {PROMO_VIP_ID, VIP_PROMO_USE_DAYS, VIP_START_DAYS, VIP_TARIFS} from "../../../shared/vip";
import {User} from "../user";


CustomEvent.registerCef('promocode:use:media', async (player, code: string) => {
    promoUseMedia(player, code)
})
CustomEvent.registerCef('promocode:use', async (player, code: string) => {
    promoUseMedia(player, code);
})


let enterPromoBlock = new Map<number, boolean>();

export const promoUseMedia = async (player: PlayerMp, code: string) => {
    const user = player.user;
    if (!user) return;
    if (enterPromoBlock.has(user.id)) return player.notify('Нельзя так часто вводить промо-код');
    enterPromoBlock.set(user.id, true);
    const uid = user.id;
    setTimeout(() => {
        enterPromoBlock.delete(uid)
    }, 5000);
    if(tempPromo.get(code.toUpperCase())){
        const promo = tempPromo.get(code.toUpperCase());
        if(!promo) return;
        user.addMoney(promo.sum, true, 'Активация одноразового промокода')
        tempPromo.delete(code.toUpperCase())
        return;
    }
    const media = await AccountEntity.findOne({promocode_my: code.toLowerCase()});
    if (!media) return promoUse(player, code);
    if (user.level > MEDIA_PROMOCODE.LEVEL_MAX) return player.notify('Ваш уровень слишком высок чтобы вводить медиа промокод', 'error');
    if (MEDIA_PROMOCODE.BLOCK_MULTIPLE) {
        const cnt = await PromocodeUseEntity.count({accountId: user.account.id, media: 1});
        if (cnt) return player.notify('Вы уже вводили медиа промокод на этом или другом персонаже', 'error');
    }
    if (user.account.promocode) return player.notify('Вы уже вводили медиа промокод на данном аккаунте', 'error');

    user.account.promocode = code.toLowerCase();
    user.account.save();
    const online = mp.players.toArray().find(q => q.user && q.user.account.id === media.id);
    if (online) {
        if (MEDIA_PROMOCODE.GIVE_DONATE_MEDIA) online.user.addDonateMoney(MEDIA_PROMOCODE.GIVE_DONATE_MEDIA, `${player.user.name} использовал ваш промокод`)
        if (MEDIA_PROMOCODE.NOTIFY) online.notify(`${player.user.name} использовал ваш промокод`, 'success');
    } else {
        if (MEDIA_PROMOCODE.GIVE_DONATE_MEDIA) {
            media.donate = media.donate + MEDIA_PROMOCODE.GIVE_DONATE_MEDIA
            media.save();
        }
    }
    if (MEDIA_PROMOCODE.GIVE_DONATE_PLAYER) user.addDonateMoney(MEDIA_PROMOCODE.GIVE_DONATE_PLAYER, `Ввод промокода ${code}`)
    if (MEDIA_PROMOCODE.GIVE_MONEY_PLAYER) user.addMoney(MEDIA_PROMOCODE.GIVE_MONEY_PLAYER, true, `Ввод промокода ${code}`);

    if (!user.vip) {
        //const vip = system.randomArrayElement(VIP_TARIFS.filter(q => q.start))
        user.giveVip(PROMO_VIP_ID, VIP_PROMO_USE_DAYS);
        player.notify('Вы получили VIP статус', 'success');
    }

    let q = new PromocodeUseEntity()
    q.code = code;
    q.media = 1;
    q.time = system.timestamp
    q.accountId = user.account.id;
    q.user = user.entity;
    q.save();
}
const promoUse = async (player: PlayerMp, code: string) => {
    const user = player.user;
    if (!user) return;

    const promo = await PromocodeList.findOne({code})

    if (!promo) return player.notify('Промокод не найден', 'error');
    if (promo.time_end && (promo.time_end == 1 || system.timestamp > promo.time_end)) return player.notify('Промокод уже не действует')
    const cnt = await PromocodeUseEntity.count({user: {id: user.id}, code});
    if (cnt) return player.notify('Вы уже вводили данный промокод', 'error');

    user.addMoney(promo.money, true, `Ввод промокода ${code}`);
    //user.giveVip(PROMO_VIP_ID, VIP_PROMO_USE_DAYS);
    let q = new PromocodeUseEntity()
    q.code = code;
    q.media = 0;
    q.time = system.timestamp
    q.accountId = user.account.id;
    q.user = user.entity;
    q.save();
}

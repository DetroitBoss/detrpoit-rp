import { BusinessEntity } from "../typeorm/entities/business";
import { menu } from "../menu";
import { OWNER_TYPES } from "../../../shared/inventory";
import { system } from "../system";
import {business, businessCatalogMenu, businessDefaultCostItem, clearBusinessProduct} from "../business";
import { inventory } from "../inventory";
import { CustomEvent } from "../custom.event";
import { tattoosShared } from "../../../shared/tattoos";
import { tattooRemoveCostMultipler, tattooRemoveMoneySendToBusinessMultipler } from "../../../shared/economy";
import { BUSINESS_TYPE } from "../../../shared/business";
import { needUnload, deliverSet, orderDeliverMenu } from "./order.system";
import {getAchievConfigBiz} from "../../../shared/achievements";
import {canUserStartBizWar, createBizMenuBizWarItem} from "../bizwar";
import {writeClientRatingLog} from "./tablet";

CustomEvent.registerCef('tattoo:buy', (player, shopId: number, itemId: number) => {
    if (!player.user) return;
    const user = player.user;
    if(user.tattoos.length >= 20) return player.notify('На вас уже нет живого места', 'error')
    let shop = business.get(shopId);
    if (!shop) return player.notify("Некорректный бизнес", "error"), reloadShopData(player, shop);
    if (shop.type !== BUSINESS_TYPE.TATTOO_SALON) return player.notify("Бизнес не является тату салоном", "error"), reloadShopData(player, shop);
    const conf = shop.catalog.find(q => q.item == itemId);
    if (!conf) return player.notify('Тату больше не продаётся', 'error'), reloadShopData(player, shop);
    let tattooCfg = tattoosShared.getTattoo(conf.item);
    if (!tattooCfg) return player.notify('Тату больше не продаётся', 'error'), reloadShopData(player, shop);
    if (!conf || !conf.price) return player.notify('Тату больше не продаётся', 'error'), reloadShopData(player, shop);
    if (conf.count <= 0 && shop.userId) return player.notify('У мастера нет подходящей заготовки под эту тату', 'error')
    if (shop.donate) {
        if (user.donate_money < conf.price) return player.notify('У вас недостаточно коинов для оплаты', 'error')
    } else {
        if (user.money < conf.price) return player.notify('У вас недостаточно средств для оплаты', 'error')
    }
    if(conf.count){
        shop.setItemCountByItemId(conf.item, conf.count - 1)
        business.addMoney(shop, conf.price, `Клиент (${player.dbid}) набил тату ${tattooCfg.name}`, false,
            false, true, true, businessDefaultCostItem(shop, conf.item));
    }
    if (shop.donate) {
        user.removeDonateMoney(conf.price, `Набил тату`)
    } else {
        user.removeMoney(conf.price, true, 'Набил тату');
        player.user.achiev.setAchievTickBiz(shop.type, shop.sub_type, conf.price)
    }
    user.newTattoo(tattooCfg.collection, user.male ? tattooCfg.overlay_male : tattooCfg.overlay_female)
    writeClientRatingLog(player, shopId, conf.price, tattooCfg.name, 1);
    player.notify("Мастер закончил нанесение тату", "success");
    reloadShopData(player, shop);
})


CustomEvent.registerCef('tattoo:remove', (player, shopId: number, itemId: number, removePrice: number) => {
    if (!player.user) return;
    const user = player.user;
    let shop = business.get(shopId);
    if (!shop) return player.notify("Некорректный бизнес", "error"), reloadShopData(player, shop);
    if (shop.type !== BUSINESS_TYPE.TATTOO_SALON) return player.notify("Бизнес не является тату салоном", "error"), reloadShopData(player, shop);
    const q = user.tattoos[itemId];
    if (!q) return player.notify('Тату уже сведено', 'error');
    let tattooCfg = tattoosShared.findTattoo(q[0], q[1])
    if(user.haveTattoo(tattooCfg.collection, user.male ? tattooCfg.overlay_male : tattooCfg.overlay_female)){
        if (user.money < tattooCfg.price * tattooRemoveCostMultipler) return player.notify("Недостаточно средств для оплаты", "error");
        user.removeMoney(tattooCfg.price * tattooRemoveCostMultipler, true, 'Свёл тату');
        user.removeTattoo(tattooCfg.collection, user.male ? tattooCfg.overlay_male : tattooCfg.overlay_female);
        business.addMoney(shop, tattooCfg.price * tattooRemoveCostMultipler * tattooRemoveMoneySendToBusinessMultipler, `Клиент (${player.dbid}) свёл тату ${tattooCfg.name}`);
        player.notify("Тату успешно сведено", "success");
        reloadShopData(player, shop);
        return;
    }
})


const reloadShopData = (player: PlayerMp, item: BusinessEntity) => {
    let catalog: { item_id: number, count: number, price: number }[] = [];
    item.catalog.map(data => {
        if (!data.price) return;
        if (!data.count && item.userId) return;
        let cfg = tattoosShared.getTattoo(data.item);
        if(!cfg) return;
        if(player.user.male && !cfg.overlay_male) return;
        if(!player.user.male && !cfg.overlay_female) return;
        catalog.push({ item_id: data.item, price: data.price, count: data.count })
    })
    if (player.dimension === 0) {
        player.user.teleport(item.positions[0].x, item.positions[0].y, item.positions[0].z, item.positions[0].h, player.id + 1)
        player.user.undress();
    }
    CustomEvent.triggerClient(player, "tattooshop:open", item.id, item.name, item.sub_type, catalog, player.user.tattoos, item.positions[0].h)
}


CustomEvent.registerClient('tattoo:exit', player => {
    player.user.reloadSkin();
    player.dimension = 0;
})

export const tattooMenu = (player: PlayerMp, item: BusinessEntity) => {
    if (!player.user) return;
    const user = player.user;
    const openShop = () => {
        if (item.catalog.length == 0) return player.notify('Каталог салона на данный момент пустой', 'error');
        if(!user.mp_character) return player.notify('Вы использовать тату салон пока используется не стандартный скин', 'error')
        reloadShopData(player, item)
    }
    if (!user.isAdminNow(6) && item.userId !== user.id && !needUnload(player, item) && !canUserStartBizWar(user))
        return openShop();
    let m = menu.new(player, "", user.isAdminNow(6) ? `Бизнес #${item.id}` : "");
    let sprite = "";
    switch (item.sub_type) {
        case 0:
            m.sprite = "shopui_title_tattoos";
            break;
        case 1:
            m.sprite = "shopui_title_tattoos2";
            break;
        case 2:
            m.sprite = "shopui_title_tattoos3";
            break;
        case 3:
            m.sprite = "shopui_title_tattoos4";
            break;
        case 4:
            m.sprite = "shopui_title_tattoos5";
            break;
        default:
            m.title = 'Тату салон'
            break;
    }
    m.sprite = sprite as any;

    m.newItem({
        name: "Каталог товаров",
        onpress: () => {
            m.close();
            openShop()
        },
    })
    if (needUnload(player, item)){
        m.newItem({
            name: "~g~Выгрузить заказ",
            onpress: () => {
                m.close();
                deliverSet(player)
            },
        })
    }

    createBizMenuBizWarItem(user, m, item);
    
    if (user.isAdminNow(6) || item.userId === user.id) {
        m.newItem({
            name: '~b~Управление бизнесом',
            onpress: () => {
                businessCatalogMenu(player, item, () => {
                    tattooMenu(player, item)
                })
            },
        })
        m.newItem({
            name: '~g~Заказ продукции',
            onpress: () => {
                orderDeliverMenu(player, item)
            }
        })
    }

    




    m.open();
};
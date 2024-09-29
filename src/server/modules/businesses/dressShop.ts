import { BusinessEntity } from "../typeorm/entities/business";
import { menu } from "../menu";
import { system } from "../system";
import {business, businessCatalogMenu, businessDefaultCostItem, clearBusinessProduct} from "../business";
import { inventory } from "../inventory";
import { CustomEvent } from "../custom.event";
import { dress } from "../customization";
import { OWNER_TYPES } from "../../../shared/inventory";
import { CLOTH_VARIATION_ID_MULTIPLER } from "../../../shared/cloth";
import { BUSINESS_TYPE } from "../../../shared/business";
import { needUnload, deliverSet, orderDeliverMenu } from "./order.system";
import { quests } from "../quest";
import {getAchievConfigBiz} from "../../../shared/achievements";
import {canUserStartBizWar, createBizMenuBizWarItem, startBizWar} from "../bizwar";
import {writeClientRatingLog} from "./tablet";

CustomEvent.registerCef('cloth:buy', async (player, shopId: number, itemId: number, variationId: number) => {
    if (!player.user) return;
    const user = player.user;
    let shop = business.get(shopId);
    if (!shop) return;
    if (shop.type !== BUSINESS_TYPE.DRESS_SHOP) return;
    const conf = shop.catalog.find(q => q.item == itemId);
    if (!conf || !conf.price) return player.notify('Данный товар больше не продаётся', 'error'), reloadShopData(player, shop);
    let dressCfg = dress.get(itemId);
    if (!dressCfg) return player.notify('Данная одежда больше не производится', 'error'), reloadShopData(player, shop);
    if(!dressCfg.data[variationId]) return player.notify("Выбрана не верная вариация данной одежды", "error");
    const price = conf.count > 0 ? conf.price : businessDefaultCostItem(shop, conf.item)
    let canPay: boolean;
    if (!shop.donate) {
        canPay = await user.tryPayment(
            price,
            'all',
            null, 
            `Покупка одежды в магазине ${shop.id} одежду ${itemId} ${dressCfg.name}`,
            'Магазин одежды'
        )
    }
    else canPay = user.donate_money >= price
    if (!canPay) return player.notify("Недостаточно средств для оплаты", "error");
    if (conf.count > 0) {
        business.addMoney(shop, price, `Клиент (${player.dbid}) купил ${dressCfg.name}`, false,
            false, true, true, businessDefaultCostItem(shop, conf.item));
        shop.setItemCountByItemId(conf.item, conf.count - 1)
    }
    if (shop.donate){
        user.removeDonateMoney(price, `Покупка одежды в магазине ${shop.id} одежду ${itemId} ${dressCfg.name}`);

    } else {
        //user.removeMoney(price, true, `Покупка одежды в магазине ${shop.id} одежду ${itemId} ${dressCfg.name}`);
        player.user.achiev.setAchievTickBiz(shop.type, shop.sub_type, price)
    }
    player.notify("Одежда успешно приобретена", "success");
    writeClientRatingLog(player, shopId, price, dressCfg.name, 1);
    user.quests.map(quest => {
        if (quest[2]) return;
        const qcfg = quests.getQuest(quest[0]);
        if (!qcfg) return;
        qcfg.tasks.map((task, taskindex) => {
            if (task.type === "dress") {
                user.setQuestTaskComplete(quest[0], taskindex);
            }
        })
    })
    let cfg = dress.get(itemId);
    if(cfg){
        itemId = itemId + variationId * CLOTH_VARIATION_ID_MULTIPLER
        if (cfg.category === 1000) user.setDressValueById(949, itemId);
        if (cfg.category == 107) user.setDressValueById(959, itemId);
        if (cfg.category == 106) user.setDressValueById(957, itemId);
        if (cfg.category == 102) user.setDressValueById(956, itemId);
        if (cfg.category == 101) user.setDressValueById(955, itemId);
        if (cfg.category == 100) user.setDressValueById(954, itemId);
        if (cfg.category == 7) user.setDressValueById(958, itemId);
        if (cfg.category == 6) user.setDressValueById(953, itemId);
        if (cfg.category == 4) user.setDressValueById(952, itemId);
        if (cfg.category == 3) user.setDressValueById(951, itemId);
        if (cfg.category == 1) user.setDressValueById(950, itemId);
    }
    reloadShopData(player, shop);
})


const reloadShopData = (player: PlayerMp, item: BusinessEntity) => {
    let catalog: number[] = [];
    let newcatalog = [...item.catalog]
    newcatalog.map((data, index) => {
        const cfg = dress.get(data.item);
        if(!cfg){
            return newcatalog.splice(index, 1);
        }
        if(player.user.is_male != cfg.male) return;
        catalog.push(data.item)
    })
    if (item.catalog.length != newcatalog.length){
        item.catalog = newcatalog;
    }
    if(player.dimension === 0){
        // player.user.teleport(item.positions[0].x, item.positions[0].y, item.positions[0].z, item.positions[0].h, player.id + 1)
        player.dimension = player.id + 1;
    }
    // console.log(item.id, item.name, item.sub_type, catalog, item.donate)
    CustomEvent.triggerClient(player, "clothshop:open", item.id, item.name, item.sub_type, catalog, item.donate, item.positions[0])
}

CustomEvent.registerClientCef("cloth:exit", player => {
    player.dimension = 0;
    player.user.reloadDress();
})


export const dressMenu = (player: PlayerMp, item: BusinessEntity) => {
    if (!player.user) return;
    const user = player.user;
    const openShop = () => {
        if (item.catalog.length == 0) return player.notify('Каталог магазина на данный момент пустой', 'error');
        if(user.getJobDress) return player.notify('Вы не можете пользоваться магазином одежды пока в форме', 'error')
        if(!user.mp_character) return player.notify('Вы не можете посетить магазин одежды пока используется не стандартный скин', 'error')
        reloadShopData(player, item)
    }
    if (!user.isAdminNow(6) && item.userId !== user.id && !needUnload(player, item) && !canUserStartBizWar(user))
        return openShop();
    let m = menu.new(player, "", user.isAdminNow(6) ? `Бизнес #${item.id}` : "");
    let sprite = "";

    switch (item.sub_type) {
        case 0:
            sprite = "shopui_title_lowendfashion";
            break;
        case 1:
            sprite = "shopui_title_lowendfashion2";
            break;
        case 2:
            sprite = "shopui_title_midfashion";
            break;
        case 3:
            sprite = "shopui_title_highendfashion";
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

    if (needUnload(player, item)) {
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
                    dressMenu(player, item)
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
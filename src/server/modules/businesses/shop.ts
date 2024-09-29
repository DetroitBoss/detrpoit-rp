import {BusinessEntity} from "../typeorm/entities/business";
import {menu} from "../menu";
import {
    getBaseItemNameById,
    getItemWeight,
    inventoryShared,
    ITEM_TYPE,
    OWNER_TYPES,
    weapon_list
} from "../../../shared/inventory";
import {system} from "../system";
import {business, businessCatalogItemName, businessCatalogMenu, businessDefaultCostItem} from "../business";
import {inventory} from "../inventory";
import {CustomEvent} from "../custom.event";
import {LicenseName} from "../../../shared/licence";
import {BUSINESS_SUBTYPE_NAMES, BUSINESS_TYPE} from "../../../shared/business";
import {deliverSet, needUnload, orderDeliverMenu} from "./order.system";
import {quests} from "../quest";
import {DONATE_MONEY_NAMES} from "../../../shared/economy";
import {canUserStartBizWar, createBizMenuBizWarItem} from "../bizwar";
import {ItemEntity} from "../typeorm/entities/inventory";
import {dress} from "../customization";
import {ArmorNames} from "../../../shared/cloth";
import {writeClientRatingLog} from "./tablet";

export const SHOP_BUY_ITEM_EVENT = 'item_shop:buyItem';

export const generateFreeSimNumber = () => {
    let number: number;
    const usedNumbers = [...inventory.data].map(q => q[1]).filter(q => [850, 851].includes(q.item_id)).map(q => q.advancedNumber)
    while (!number) {
        const newNumber = system.randomNumber(7);
        if (!usedNumbers.includes(newNumber)) number = newNumber;
    }
    return number;
}


CustomEvent.registerCef('server:item_shop:buy_item', (player, shopId: number, itemData: [number, number][], paytype: number, pin?: string) => {
    if (!player.user) return;
    const user = player.user;
    let shop = business.get(shopId);
    if (!shop) return;
    if (![BUSINESS_TYPE.ITEM_SHOP, BUSINESS_TYPE.BAR].includes(shop.type)) return;

    let ok = true;
    let weight = 0;
    let sum = 0;
    let catalog = shop.catalog
    const donate = !!shop.donate
    let remove: [number, number][] = []
    itemData.map(([itemId, amount]) => {
        if (!ok) return;
        if (!amount) return;
        const itemConf = inventoryShared.get(itemId);
        if (!itemConf) return ok = false;
        const conf = catalog.find(q => q.item == itemId);
        if (!conf || (!conf.price && conf.count)) return player.notify(itemConf.name + ' больше не продаётся', 'error'), reloadShopData(player, shop), ok = false;
        if ([ITEM_TYPE.WEAPON_MAGAZINE, ITEM_TYPE.WEAPON, ITEM_TYPE.AMMO_BOX].includes(itemConf.type)) {
            let needLic = false;
            if (ITEM_TYPE.WEAPON_MAGAZINE === itemConf.type) needLic = true;
            else if (ITEM_TYPE.AMMO_BOX === itemConf.type) needLic = true;
            else if (ITEM_TYPE.WEAPON === itemConf.type) {
                const wConf = weapon_list.find(q => q.weapon === itemId);
                if (wConf.need_license) needLic = true;
            }
            if (needLic && !user.haveActiveLicense('weapon'))
                return player.notify(`Чтобы приобрести ${getBaseItemNameById(itemId)} необходимо иметь активную лицензию на ${LicenseName['weapon']}`, "error"), ok = false;
        }
        const multiple = shop.sub_type === 3 && user.haveActiveLicense('med') ? 0.6 : 1.0
        if (donate) {
            if (conf.count < amount) return player.notify(`${itemConf.name} закончился`, 'error'), ok = false;
            sum += conf.price * amount;
        } else {
            sum += (((conf.count && conf.count >= amount) || !itemConf.defaultCost ? conf.price : itemConf.defaultCost) * multiple) * amount;
            if (conf.count && conf.count >= amount) remove.push([itemId, Math.min(conf.count, amount)])
        }

        const itemConfig = inventoryShared.get(conf.item);
        weight += getItemWeight(conf.item, itemConfig.default_count) * amount
    })

    if (!ok) return;


    if ((inventory.getWeightItems(inventory.getInventory(OWNER_TYPES.PLAYER, user.id)) + weight) > inventory.getWeightInventoryMax(OWNER_TYPES.PLAYER, user.id))
        return player.notify(`Недостаточно места в инвентаре для покупки всех товаров в корзине`, 'error'), reloadShopData(player, shop);

    if (donate) {
        if (user.donate_money < sum)
            return player.notify(`У вас недостаточно ${DONATE_MONEY_NAMES[2]} для оплаты`, 'error'), reloadShopData(player, shop);
        user.removeDonateMoney(sum, `Покупка товаров в магазине ${shop.name} ${shop.id}`)
    } else {
        if (paytype === 0) {
            if (user.money < sum) return player.notify(`У вас недостаточно средств для оплаты`, 'error'), reloadShopData(player, shop);
            user.removeMoney(sum, true, `Покупка товаров в магазине ${shop.name} ${shop.id}`)
        } else if (paytype === 1) {
            if (!user.verifyBankCardPay(pin))
                return player.notify(`Либо вы ввели не верный пин-код, либо у вас нет при себе банковской карты`, 'error'), reloadShopData(player, shop);
            if (!user.tryRemoveBankMoney(sum, true, `Покупка товаров`, `${shop.name} ${shop.id}`)) return reloadShopData(player, shop);
        } else {
            return;
        }
        player.user.achiev.setAchievTickBiz(shop.type, shop.sub_type, sum)
    }

    itemData.map(async ([itemId, amount]) => {
        const type = BUSINESS_TYPE.BAR === shop.type ? 'BAR' : "SHOP";

        const conf = catalog.find(q => q.item == itemId);
        const itemConf = inventoryShared.get(itemId);
        const multiple = shop.sub_type === 3 && user.haveActiveLicense('med') ? 0.6 : 1.0;
        const name = businessCatalogItemName(shop, itemId)

        writeClientRatingLog(
            player,
            shop.id,
            donate
                ?
                conf.price
                :
                (((conf.count && conf.count >= amount) || !itemConf.defaultCost ? conf.price : itemConf.defaultCost) * multiple),
            name,
            amount
        )

        for (let q = 0; q < amount; q++) {
            const itemParams: Partial<ItemEntity> = {
                owner_type: OWNER_TYPES.PLAYER,
                owner_id: user.id,
                item_id: itemId,
                serial: type + "_" + shop.id + "_" + user.id + "_" + system.timestamp
            }

            if (itemId === 960) {
                itemParams.count = ARMOR_DEFAULT_COUNT_IN_SHOP;

                const dressCfg = dress.data
                    .find(dressEntity => dressEntity.name === ArmorNames.StandardArmor);

                itemParams.advancedNumber = dressCfg.id;
                itemParams.serial = dressCfg.name;
            }

            mp.events.call(SHOP_BUY_ITEM_EVENT, player, itemParams.item_id, 1);
            await inventory.createItem(itemParams).then(item => {
                if (item.item_id === 851) {
                    const conf = catalog.find(q => q.item == itemId);
                    item.advancedString = `${Math.floor(conf.price / 2)}`;
                    item.save();
                }
            });
        }

    })
    let bizadd = 0;
    let totalItemsPurchasePrice = 0;
    remove.map(([itemId, amount]) => {
        const conf = catalog.find(q => q.item == itemId);
        shop.setItemCountByItemId(conf.item, conf.count - amount)
        bizadd += conf.price * amount;
        totalItemsPurchasePrice += businessDefaultCostItem(shop, conf.item, amount);
    })
    if (bizadd > 0) {
        business.addMoney(shop, bizadd, `Клиент (${player.dbid}) купил товары`, false, false,
            true, true, totalItemsPurchasePrice);
    }

    const itemsId = itemData.map(q => q[0])

    user.quests.map(quest => {
        const qcfg = quests.getQuest(quest[0]);
        if (!qcfg) return;
        qcfg.tasks.map((task, taskindex) => {
            if (task.type !== "itemBuy") return;
            if (task.item_id && !itemsId.includes(task.item_id)) return;
            user.setQuestTaskComplete(quest[0], taskindex)
        })
    })

    player.notify('Товары успешно приобретены', 'success');
    player.user.setGui(null);
    return;

})

const ARMOR_DEFAULT_COUNT_IN_SHOP = 50;

const reloadShopData = (player: PlayerMp, item: BusinessEntity) => {
    const user = player.user;
    if (!user) return;
    let catalog: { item_id: number, count: number, price: number }[] = [];
    const multiple = item.sub_type === 3 && user.haveActiveLicense('med') ? 0.9 : 1.0
    item.catalog.map(data => {
        const cfg = inventoryShared.get(data.item);
        catalog.push({item_id: data.item, price: data.price * multiple, count: data.count})
    })

    CustomEvent.triggerClient(player, "item_shop:init", item.id, item.name, catalog, item.donate, item.type, item.sub_type)
}


export const shopMenu = (player: PlayerMp, item: BusinessEntity) => {
    if (!player.user) return;
    const user = player.user;
    const openShop = () => {
        if (item.catalog.length == 0) return player.notify('Каталог магазина на данный момент пустой', 'error');
        if (item.sub_type == 5) {
            user.setGui('farm')
            CustomEvent.triggerCef(player, 'farm:setComponent', 'shop')
        } else {
            CustomEvent.triggerClient(player, 'shop:open');
        }
        reloadShopData(player, item)
    }
    if (!user.isAdminNow(6) && item.userId !== user.id && !needUnload(player, item) && !canUserStartBizWar(user))
        return openShop();
    const name = BUSINESS_TYPE.BAR === item.type ? item.name : `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`
    let m = menu.new(player, "", `${name} #${item.id}`);
    let sprite = "interaction_bgd";
    if (BUSINESS_TYPE.BAR !== item.type) {
        switch (item.sub_type) {
            case 0:
                sprite = "shopui_title_conveniencestore";
                break;
            case 1:
                sprite = "digital";
                break;
            case 2:
                sprite = "shopui_title_gunclub";
                break;
            case 3:
                sprite = "m3";
                break;
            case 5:
                sprite = "farm";
                break;
        }
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
                    shopMenu(player, item)
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
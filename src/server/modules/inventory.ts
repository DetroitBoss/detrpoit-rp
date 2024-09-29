import {ItemEntity} from "./typeorm/entities/inventory"
import {
    ARMOR_ITEM_ID,
    AUTO_SOUND_ITEM_ID,
    business_stock_level,
    canUse,
    CONTAINERS_DATA,
    CUFFS_ITEM_ID,
    CUFFS_KEY_ITEM_ID,
    getBaseItemNameById,
    getContainerByItemID,
    getContainerByOwnerType,
    getItemName,
    getItemWeight,
    getWeaponAddonKeyByItemId,
    HOUSE_DEFAULT_WEIGHT_KG,
    InventoryChoiseItemData,
    InventoryDataCef,
    InventoryEquipList,
    InventoryItemCef,
    inventoryShared,
    ITEM_TYPE,
    OWNER_TYPES,
    PLAYER_DEFAULT_WEIGHT_KG,
    PLAYER_INVENTORY_KG_PER_LEVEL,
    SCREWS_DESTROYER_ITEM_IDS,
    SCREWS_ITEM_ID
} from "../../shared/inventory";
import {system} from "./system";
import {CustomEvent} from "./custom.event";
import {User} from "./user";
import {menu} from "./menu";
import {business} from "./business";
import {getDocumentData} from "./city.hall";
import {dress} from "./customization";
import {Vehicle} from "./vehicles";
import {HOUSE_STOCK_POS, interriors} from "../../shared/inrerriors";
import {houses, isPlayerHasHouseKey} from "./houses";
import {HOUSE_CHEST_KG_DEFAULT, HOUSE_CHEST_KG_PER_LEVEL, HOUSE_UPGRADE_LEVEL_COST} from "../../shared/economy";
import {FractionGarage} from "./fraction.garages";
import {phone} from "./phone";
import {getIllConfig, illData, PILL_USE_TIMER, POISONING_CHANCE_PER_DAY, POISONING_DAYS} from "../../shared/ill";
import {generateFreeSimNumber} from "./businesses/shop";
import {VehicleConfigsEntity} from "./typeorm/entities/vehicle.configs";
import {PhoneEntity} from "./typeorm/entities/phoneData";
import {VEHICLE_FUEL_TYPE} from "../../shared/vehicles";
import {In} from "typeorm";
import {removeEntity, saveEntity} from "./typeorm";
import {LicenseName, UdoData} from "../../shared/licence";
import {FamilyTasks, FamilyTasksLoading} from "../../shared/family";
import {warehouses} from "./warehouse";
import {WAREHOUSE_SLOTS_POS} from "../../shared/warehouse";
import {tablet} from "./tablet";
import {Logs} from "./logs";
import {gui} from "./gui";
import {colshapes} from "./checkpoints";
import {gangfight} from "./gangfight";
import {SendUpdate} from "../../shared/GameVisualElement";
import {getNearestMarketInventory} from "./market/marketStock";
import {FarmActivityStock} from './farm/models/stock'
import {FEED_LIST, SUPPLIES_LIST} from '../../shared/farm/config'
import {getFisherLevelByExp, RODS} from '../../shared/fish'
import {invokeHook} from "../../shared/hooks";
import {AUTOPILOT_ITEM_ID} from "../../shared/autopilot";
import {DivingMaps} from "../../shared/diving/work.config";
import {BoxPlayer} from "./musicPlayer";

import {
    DIVING_FIRST_MAP_ITEM,
    DIVING_SECOND_MAP_ITEM,
    DIVING_THIRD_MAP_ITEM,
    DivingAchievementClothesItem
} from "../../shared/diving/achievement.config";
import {CLOTH_VARIATION_ID_MULTIPLER} from "../../shared/cloth";
import {BATTLE_PASS_SEASON} from "../../shared/battlePass/main";
import {isBattlePassItem} from "../../shared/battlePass/history-seasons";
import {donateStorage} from "./donateStorage";
import { getX2Param } from "./usermodule/static";

setInterval(() => {
    inventory.getInventory(0, 0).map(item => {
        if (item.dropped_time + 300 <= system.timestamp) inventory.deleteItem(item);
    })
}, 10000)


setTimeout(() => {
    if (getX2Param("testserver")) {
        let check: number[] = [];
        inventoryShared.items.map(q => {
            if (check.includes(q.item_id)) {
                for (let s = 0; s < 10; s++) system.debug.error(`ВНИМАНИЕ!!!! Предмет ${q.item_id} ${q.name} имеет дубликат по ID`)
            }
            //if(!fs.existsSync(`./src/shared/icons/Item_${q.item_id}.png`)) system.debug.error(`ВНИМАНИЕ!!!! Предмет ${q.item_id} ${q.name} не имеет картинки для инвентаря`)
            check.push(q.item_id)
        })
    }
}, 10000)

CustomEvent.registerClientCef('inventory:reload:weapon', async player => {
    const user = player.user;
    if (!user) return
    if (user.spam(500)) return player.notify('Не торопитесь', 'error')
    user.reloadCurrentWeapon(false)
})
CustomEvent.registerClientCef('inventory:unload:weapon', player => {
    if (player.user.spam(500)) return player.notify('Не торопитесь', 'error')
    let currentWeapon = player.user.currentWeapon;
    if (!currentWeapon) return player.notify('У вас не экипировано оружие', "error");
    player.user.unloadAmmo();
    inventory.reloadInventory(player, [OWNER_TYPES.PLAYER, player.user.id])
})
CustomEvent.registerClientCef('inventory:unequip:weapon', player => {
    if (player.user.spam(500)) return player.notify('Не торопитесь', 'error')
    let currentWeapon = player.user.currentWeapon;
    if (!currentWeapon) return player.notify('У вас не экипировано оружие', "error");
    player.user.removeCurrentWeapon(false, true);
    inventory.reloadInventory(player, [OWNER_TYPES.PLAYER, player.user.id])
})

CustomEvent.registerCef('player:unlock', (player, owner_type: OWNER_TYPES, owner_id: number, value: number) => {
    if (!player.user) return;
    if (player.user.spam(2000)) return;
    if (value != inventory.getPassword(owner_type, owner_id)) return player.notify("Пароль указан не верно", "error");
    player.user.setSavedPassword(owner_type, owner_id, value);
    player.notify("Пароль принят", "success");

})

CustomEvent.registerCef('inventory:bag:selectDisplay', (player, id: number) => {
    if (!player.user) return;
    if (player.user.spam(1000)) return;
    
    const item = player.user.inventory.find(i => i.id === id);
    if (!item) return player.notify('Невозможно выполнить действие');
    
    if (CONTAINERS_DATA.find(b => b.item_id === item.item_id)?.bag_sync)
        player.user.entity.selectedBag = item.item_id;
    
    player.user.sync_bag()
})


CustomEvent.registerClient('inventory:flashlight', player => {
    if (!player.user) return;
    if (player.user.spam(2000)) return;
    player.setVariable('flashlightWeapon', !player.getVariable('flashlightWeapon'))
})
CustomEvent.registerCef('inventory:unequip_item', (player, id: number) => {
    if (!player.user) return;
    if (player.user.spam(2000)) return;
    const user = player.user;

    if (id >= 949 && id <= 960) {
        if (id !== ARMOR_ITEM_ID) {
            if (user.getJobDress) return player.notify('Нельзя снимать одежду пока на вас рабочая форма', 'error')
            if (!user.mp_character) return player.notify('Вы не можете снимать одежду пока используется не стандартный скин', 'error')
        }

        user.setDressValueById(id, 0, user.customArmor);

        if (id === ARMOR_ITEM_ID) {
            user.armour = 0;
        }
        inventory.closeInventory(player);
    }

})


CustomEvent.registerCef('inventory:close', (player) => player.openInventory = null)
CustomEvent.registerClient('inventory:close', (player) => player.openInventory = null)
CustomEvent.registerClient('inventory:open', (player, ownertype?: number, ownerid?: number) => inventory.openInventory(player, ownertype, ownerid));
CustomEvent.registerCef('inventory:choiceItem', (player, data: InventoryChoiseItemData) => {
    if (!player.user) return;
    if (!player.openInventory) return;
    if (player.user.spam(500)) return player.notify('Не торопитесь', 'error')


    if ((data.owner_type === OWNER_TYPES.BUSINESS || data.target_type === OWNER_TYPES.BUSINESS) && !player.user.isAdminNow(6)) return player.notify("Со склада нельзя забирать предметы.", "error");
    if (data.task == "useItem") {
        if (data.owner_type != OWNER_TYPES.PLAYER || data.owner_id != player.user.id) return player.notify("Предмет можно использовать только со своего инвентаря", "error");
        inventory.useItem(player, data.item.id, data.owner_type, data.owner_id);
    } else if (data.task == "transfer") {
        inventory.transferItem(player, data.item.id, data.owner_type, data.owner_id, data.target_type, data.target_id);
    } else if (data.task == "drop") {
        if (data.owner_type === OWNER_TYPES.MARKET_STOCK) {
            return player.notify('Вы не можете выбросить товар со склада рынка', 'error');
        }

        Logs.insertInventoryLog(inventory.get(data.item.id, data.owner_type, data.owner_id), player.user.id, 0, "drop", `drop from ${data.owner_type}`)
        inventory.dropItem(player, data.item.id, data.owner_type, data.owner_id);
    } else if (data.task == "unload_hotkey") {
        player.user.setHotkey(data.owner_id, 0)
        player.notify('Хоткей очищен', 'success')
        inventory.reloadInventory(player, [OWNER_TYPES.PLAYER, player.dbid])
    } else if (data.task == "load_hotkey") {
        let item = inventory.get(data.item.id, OWNER_TYPES.PLAYER, player.dbid);
        if (!item) {
            player.notify('Ошибка назначения хоткея', 'error')
            return;
        }
        player.user.setHotkey(data.owner_id, item.id)
        //player.notify('Хоткей назначен', 'success')
        inventory.reloadInventory(player, [OWNER_TYPES.PLAYER, player.dbid])
    } else if (data.task == "split") {

        if (data.owner_type === OWNER_TYPES.MARKET_STOCK) {
            return player.notify('Вы не можете разделить товар на складе рынка', 'error');
        }

        let count = data.target_id;
        if (!count) return player.notify('Количество указано не верно', 'error');

        let item = inventory.get(data.item.id, data.owner_type, data.owner_id);
        if (item.count - count <= 0) return player.notify("Вы не можете так разделять предмет. Укажите значение меньше", 'error');

        if (data.owner_type === OWNER_TYPES.WORLD) {
            item.count -= count;

            inventory.createItem({
                owner_type: 1,
                owner_id: player.user.id,
                count,
                item_id: item.item_id,
                temp: item.temp,
            }, true).then((createdItem) => {
                if (!mp.players.exists(player))
                    return;

                inventory.dropItem(player, createdItem.id, createdItem.owner_type, player.user.id);
            })
        } else {
            if (!item) {
                player.notify('У вас нет данного предмета', 'error')
                return;
            }

            item.useCount(count, player);

            inventory.createItem({
                owner_type: data.owner_type,
                owner_id: data.owner_id,
                count,
                item_id: item.item_id,
                temp: item.temp,
            }, true).then(() => {
                if (mp.players.exists(player)) inventory.reloadInventory(player, [data.owner_type, data.owner_id]);
            })
        }
    }
})

CustomEvent.registerClient('inventory:hotkey:user', (player, slot: number) => {
    if (!player.user) return;
    if (!player.user.canUseInventory) return;
    if (player.user.spam(500)) return player.notify('Не торопитесь', 'error')
    let id = player.user.hotkeys[slot];
    if (!id) return player.notify('Хоткей не назначен. Откройте инвентарь и перенесите необходимый предмет из вашего инвентаря в слот быстрого доступа', 'error', null, 8000);
    let item = inventory.get(id, OWNER_TYPES.PLAYER, player.dbid);
    if (!item) return player.notify('Хоткей был сброшен, поскольку назначеного предмета в вашем инвентаре больше нет', 'error', null, 8000), player.user.setHotkey(slot, 0);

    const itemCfg = inventoryShared.get(item.item_id);
    if (itemCfg.blockHotkey) {
        player.notify('Этот предмет невозможно использовать через хоткей', 'error');
        return;
    }

    inventory.useItem(player, item.id, OWNER_TYPES.PLAYER, player.user.id)
})


function updateItemOwner(id: number, owner_type: OWNER_TYPES, owner_id: number, old_owner_type?: number, old_owner_id?: number, verifyGun?: boolean): void;
function updateItemOwner(item: ItemEntity, owner_type: OWNER_TYPES, owner_id: number): void;
function updateItemOwner(itm: number | ItemEntity, owner_type: OWNER_TYPES, owner_id: number, old_owner_type?: number, old_owner_id?: number, verifyGun = true) {
    let item = typeof itm === "number" ? inventory.get(itm, old_owner_type, old_owner_id) : itm;
    old_owner_type = parseInt(`${item.owner_type}`)
    old_owner_id = parseInt(`${item.owner_id}`)
    let id = item.id
    if (!item) return console.error(`inventory.updateItemOwner try update non existent item ${id} owner_type ${owner_type} owner_id ${owner_id} old_owner_type ${old_owner_type} old_owner_id ${old_owner_id}`)
    const world = item.owner_type == 0;
    let itmCfg = inventoryShared.get(item.item_id);
    if (!itmCfg) return;
    if (itmCfg.blockMove) return;
    if (item.owner_type == OWNER_TYPES.PLAYER) {
        let target = User.get(item.owner_id);
        if (target) {
            target.user.inventoryAttachSync()
            if (itmCfg.type == ITEM_TYPE.WEAPON && verifyGun) {
                let curWeapon = target.user.currentWeapon;
                if (curWeapon) {
                    if (curWeapon.id == item.id) {
                        target.user.removeCurrentWeapon(false, true)
                    }
                }
            }
        }
    }
    if (itmCfg.need_group && owner_type != OWNER_TYPES.WORLD && owner_type != OWNER_TYPES.BUSINESS && owner_type != OWNER_TYPES.EXCHANGE_MENU) {
        let allItems = inventory.getInventory(owner_type, owner_id);
        if (allItems) {
            let targetItem = allItems.find(q => q.item_id == item.item_id && q.id !== item.id && q.temp === item.temp);
            if (targetItem) {
                inventory.deleteItem(item);
                targetItem.count += item.count;
                if (!targetItem.temp) targetItem.save();
                if (world) {
                    if (item.prop) item.prop.destroy()
                    item.prop = null;
                    if (item.colshape && item.colshape.exists) {
                        item.colshape.destroy()
                        item.colshape = null;
                    }
                }
                return;
            }
        }
    }
    let oldInventory = inventory.getInventory(item.owner_type, item.owner_id);
    if (oldInventory && oldInventory.findIndex(q => q.id == id) > -1) oldInventory.splice(oldInventory.findIndex(q => q.id == id), 1);
    if (owner_type === OWNER_TYPES.PLAYER) {
        let target = User.get(owner_id);
        if (target) {
            target.user.questTick()
            target.user.currentWeaponSync();
            target.user.inventoryAttachSync();
            if (!target.user.entity.successItem.includes(item.item_id)) {
                const cfg = inventoryShared.get(item.item_id)
                if (cfg && cfg.helpDesc && cfg.helpIcon) {
                    target.user.entity.successItem = [...target.user.entity.successItem, item.item_id];
                    CustomEvent.triggerCef(target, 'success:screen:showitem', item.item_id);
                }
            }
        }
    }
    item.owner_type = owner_type;
    item.owner_id = owner_id;
    insert_item_into_inventory(item)
    if (!item.temp) item.save();
    if (owner_type !== OWNER_TYPES.WORLD) {
        if (item.prop) {
            if (mp.objects.exists(item.prop)) item.prop.destroy()
            item.prop = null;
        }
        if (item.colshape && item.colshape.exists) {
            item.colshape.destroy()
            item.colshape = null;
        }
    }
    CustomEvent.trigger('inventory:updateowner', id, owner_type, owner_id, old_owner_type, old_owner_id)
    if ([owner_type, old_owner_type].includes(OWNER_TYPES.WEAPON_MODS)) {
        if (owner_type === OWNER_TYPES.WEAPON_MODS) {
            const weapon = inventory.get(owner_id);
            if (weapon && weapon.owner_type === OWNER_TYPES.PLAYER) {
                const target = User.get(weapon.owner_id);
                if (target && target.user && target.user.currentWeapon?.id === weapon.id) target.user.syncAddonsWeapon()
            }
        }

        if (old_owner_type === OWNER_TYPES.WEAPON_MODS) {
            const weapon = inventory.get(old_owner_id);
            if (weapon && weapon.owner_type === OWNER_TYPES.PLAYER) {
                const target = User.get(weapon.owner_id);
                if (target && target.user && target.user.currentWeapon?.id === weapon.id) target.user.syncAddonsWeapon()
            }
        }
    }
    return;
}

CustomEvent.registerClient('playerDamage', (player: PlayerMp, healthLoss: number, armorLoss: number
    , healthLeft: number, armorLeft: number) => {
    if (!player.user) {
        return;
    }

    player.user.customArmor = armorLeft;

    if (armorLoss <= 0 || armorLeft > 0) {
        return;
    }

    const playerDress = player.user.dress as InventoryEquipList;
    if (playerDress.armor === 0) {
        return;
    }

    player.user.setDressValueById(ARMOR_ITEM_ID, 0, armorLeft);
});

/** Уникальный ID для временных предметов */
let inventoryTempId = 5000000000

export const INVENTORY_USE_ITEM_HOOK = 'inv:useItemHook';

export const inventory = {
    /**
     * Получает общее количество предметов определенного id.
     */
    getItemsCountById: (player: PlayerMp, itemId: number) => {
        return player.user.inventory
            .filter(i => i.item_id === itemId)
            .map(i => inventoryShared.get(i.item_id).canSplit ? i.count : 1)
            .reduce((prev, next) => prev + next, 0);
    },
    getItemsCountByType: (player: PlayerMp, itemType: ITEM_TYPE) => {
        return player.user.inventory
            .map(i => ({cfg: inventoryShared.get(i.item_id), item: i}))
            .filter(i => i.cfg.type === itemType)
            .map(i => i.cfg.canSplit ? i.item.count : 1)
            .reduce((prev, next) => prev + next, 0)
    },
    getTempId: () => {
        inventoryTempId++;
        return inventoryTempId;
    },
    dropItem: (player: PlayerMp, id: number, owner_type: OWNER_TYPES, owner_id: number, death = false, isSplit = false) => {
        const user = player.user;
        if (player.vehicle) return player.notify('Нельзя выбрасывать предметы находясь в транспорте', 'error')
        let item = inventory.get(id, owner_type, owner_id);
        if (!item) return player.notify("Предмет не обнаружен", "error");
        let itmCfg = inventoryShared.get(item.item_id);
        if (!itmCfg) return player.notify("Предмет некорректный", "error");
        if (itmCfg.blockMove) return player.notify('Данный предмет нельзя выбрасывать', 'error');
        if (isBattlePassItem(item.advancedString) || item.advancedString === 'BATTLE_PASS_CLOTHES') return player.notify('Данный предмет нельзя выбрасывать', 'error');
        if (donateStorage.isDonateItem(item)) return player.notify('Данный предмет нельзя выбрасывать', 'error');

        if (inventoryShared.get(item.item_id) && inventoryShared.get(item.item_id).type === ITEM_TYPE.BAGS) {
            const container = CONTAINERS_DATA.find(el => el.item_id === item.item_id)
            const items = inventory.getInventory(container.owner_type, item.id)
            let haveBattlePassItems: boolean = false;
            let haveDonateStorageItems: boolean = false;

            items.forEach(element => {
                if (isBattlePassItem(element.advancedString) || element.advancedString === 'BATTLE_PASS_CLOTHES')
                    haveBattlePassItems = true;

                if (donateStorage.isDonateItem(element))
                    haveDonateStorageItems = true;

            });


            if (haveBattlePassItems)
                return player.notify('В сумке лежит предмет из боевого пропуска, сперва нужно выложить его', 'error');

            if (haveDonateStorageItems)
                return player.notify('В сумке лежит донатный предмет, сперва нужно выложить его', 'error');
        }

        if (item.owner_type == OWNER_TYPES.WORLD) return player.notify("Предмет уже лежит на земле", "error");
        let allNearest = inventory.getAllNearestInventory(player)
        if (item.owner_type != 0 && !(item.owner_type == OWNER_TYPES.PLAYER && item.owner_id == user.id) && !allNearest.find(q => q.owner_type == item.owner_type && q.owner_id == item.owner_id)) {
            return player.notify('Вы отошли слишком далеко от места хранения предмета', 'error');
        }

        if (!isSplit) {
            let nearest = inventory.getDroppedItems(player, 6);
            if (nearest.length > 7) return player.notify("Рядом с вами уже некуда складывать вещи. Найдите место посвободнее", "error");
        }

        if (item.owner_type === OWNER_TYPES.WEAPON_MODS) return player.notify("Модификацию прежде необходимо снять", "error")

        if (itmCfg.protect && (item.owner_type !== OWNER_TYPES.PLAYER || item.owner_id != player.user.id)) return player.notify("Данный предмет нельзя выбросить из чужого инвентаря", "error")
        if (itmCfg.canFactionsTake && !itmCfg.canFactionsTake.includes(player.user.fraction)) return player.notify("Вы не можете это выбросить", "error")
        if (itmCfg.item_id === 863) return player.notify("Вы не можете это выбросить", "error")
        if (itmCfg.item_id == 864) {
            return player.notify("Вы можете взять данный предмет в свой инвентарь, автомобиль или вернуть на склад", "error")
        }
        
        if (player.user.entity.selectedBag === item.item_id) {
            player.user.entity.selectedBag = null
            player.user.sync_bag()            
        }
        
        if (!inventory.placeItemOnGround(item, player.user.dropPos, player.heading, player.dimension)) return;
        if (!death) player.user.playAnimation([["random@domestic", "pickup_low"]], true)
        inventory.reloadInventory(player, [owner_type, owner_id])


    },
    placeItemOnGround: (item: ItemEntity, pos: Vector3Mp, heading: number, dimension: number, verifyGun = true) => {
        let itmCfg = inventoryShared.get(item.item_id);
        if (!itmCfg) return false;
        if (item.owner_type == OWNER_TYPES.WORLD) return false;
        if (item.prop) {
            item.prop.destroy()
            item.prop = null;
        }
        if (item.colshape && item.colshape.exists) {
            item.colshape.destroy()
            item.colshape = null;
        }
        item.prop = mp.objects.new(itmCfg.prop, pos, {
            dimension,
            rotation: new mp.Vector3(0, 0, heading)
        })
        const {owner_type, owner_id} = item
        item.prop.setVariables({item_id: item.item_id, inventory_dropped: true})
        item.x = pos.x;
        item.y = pos.y;
        item.z = pos.z;
        item.d = dimension
        item.colshape = colshapes.new(pos, `${getItemName(item)}`, player => {
            if (player.user.dead) {
                return;
            }

            inventory.transferItem(player, item.id, OWNER_TYPES.WORLD, 0, OWNER_TYPES.PLAYER, player.dbid);
        }, {
            color: [0, 0, 0, 0],
            dimension,
            // drawStaticName: 'label'
        });
        item.dropped_time = system.timestamp;
        inventory.updateItemOwner(item.id, 0, 0, owner_type, owner_id, verifyGun);
        return true;
    },

    canUseInCar(player: PlayerMp, owner_type: OWNER_TYPES, new_owner_type: OWNER_TYPES): boolean {
        if (!player.vehicle) return true;

        if (owner_type > 15200 || owner_type < 15000 && owner_type !== 1) {
            return false;
        } else return !(new_owner_type > 15200 || new_owner_type < 15000 && new_owner_type !== 1);
    },

    transferItem: async (player: PlayerMp, id: number, owner_type: OWNER_TYPES, owner_id: number, new_owner_type: OWNER_TYPES, new_owner_id: number) => {
        const user = player.user;
        console.log(user.dead)
        if (!user || user.dead) return;

        if (!inventory.canUseInCar(player, owner_type, new_owner_type)) return player.notify('Покиньте транспорт', 'error');

        let item = inventory.get(id, owner_type, owner_id);
        if (!item) return player.notify("Предмет не обнаружен", "error");

        if (new_owner_type === OWNER_TYPES.MARKET_STOCK) {
            return player.notify('Вы не можете перемещать предметы на склад рынка', 'error');
        }

        const checkDistance = () => {
            if (!mp.players.exists(player)) return false;
            if (item.owner_type === OWNER_TYPES.WORLD) {
                return system.distanceToPos(item, player.position) <= 7
            }
            let allNearest = inventory.getAllNearestInventory(player)
            if (item.owner_type != 0 && !(item.owner_type == OWNER_TYPES.PLAYER && item.owner_id == user.id) && !allNearest.find(q => q.owner_type == item.owner_type && q.owner_id == item.owner_id)) {
                player.notify('Вы отошли слишком далеко от места хранения предмета', 'error');
                return false;
            }

            if (new_owner_type != 0 && !(new_owner_type == OWNER_TYPES.PLAYER && new_owner_id == user.id) && !allNearest.find(q => q.owner_type == new_owner_type && q.owner_id == new_owner_id)) {
                player.notify('Вы отошли слишком далеко от места передачи предмета', 'error');
                return false;
            }
            return true;
        }

        let itmCfg = inventoryShared.get(item.item_id);
        if (!itmCfg) return player.notify("Предмет некорректный", "error");
        if (itmCfg.item_id === 864) {
            if (new_owner_type == OWNER_TYPES.PLAYER && (owner_type == OWNER_TYPES.VEHICLE || owner_type == OWNER_TYPES.VEHICLE_TEMP || owner_type == OWNER_TYPES.FRACTION_VEHICLE)) {
                if (user.haveItem(864)) return player.notify('У вас уже есть коробка. Вы не можете взять еще одну', 'error');
                if (player.vehicle) return player.notify('Вы не должны находиться в транспорте', 'error')

                let veh: VehicleMp = null
                if (item.owner_type == OWNER_TYPES.VEHICLE) veh = Vehicle.get(item.owner_id) ? Vehicle.get(item.owner_id).vehicle : null
                if (item.owner_type == OWNER_TYPES.VEHICLE_TEMP) veh = Vehicle.getByTmpId(item.owner_id);
                if (item.owner_type == OWNER_TYPES.FRACTION_VEHICLE) veh = Vehicle.getByCarageCarId(item.owner_id);
                if (!veh) return console.log('error inventory family cargo #1')
                if (!user.family) return player.notify('Груз принадлежит семье. Вы не можете его взять', 'error')
                else if (veh.familyQuestFamilyID != user.family.id) return player.notify('Груз принадлежит другой семье. Вы не можете его взять', 'error');

                if (user.animation.isAnyAnimationWithResultNow) {
                    return player.notify('Вы сейчас не можете сделать этого.', 'error');
                }
            } else if (owner_type == OWNER_TYPES.PLAYER && (new_owner_type == OWNER_TYPES.VEHICLE || new_owner_type == OWNER_TYPES.VEHICLE_TEMP || new_owner_type == OWNER_TYPES.FRACTION_VEHICLE)) {
                let veh: VehicleMp = null
                if (new_owner_type == OWNER_TYPES.VEHICLE) veh = Vehicle.get(new_owner_id) ? Vehicle.get(new_owner_id).vehicle : null
                if (new_owner_type == OWNER_TYPES.VEHICLE_TEMP) veh = Vehicle.getByTmpId(new_owner_id);
                if (new_owner_type == OWNER_TYPES.FRACTION_VEHICLE) veh = Vehicle.getByCarageCarId(new_owner_id);
                if (!veh) return console.log('error inventory family cargo #2')
                if (!veh.familyQuestFamilyID) return player.notify('Данный транспорт не зарегистрирован для загрузки семейного груза. Найдите маркер регистрации неподалеку.', 'error')
                if (!user.family || veh.familyQuestFamilyID != user.family.id) return player.notify('Машина для загрузки груза другой семьи. Вы не можете положить его сюда', 'error')
            } else return player.notify("Вы можете взять данный предмет в свой инвентарь, автомобиль или вернуть на склад", "error")


            const loadingPositions = FamilyTasksLoading.find(ftl => ftl.type == 0).loadingCoords
            FamilyTasks.map(ftl => {
                if (ftl.type == 0) ftl.importCoords.map(ic => loadingPositions.push(ic))
            })
            if (system.isPointInPoints(player.position, loadingPositions, 10.0)) return player.notify('Политика склада запрещает нахождение транспорта вблизи зоны погрузки')
        }
        if (itmCfg.blockMove) return player.notify('Данный предмет нельзя перемещать', 'error');

        if (owner_type === OWNER_TYPES.WORLD && player.user.isInCombat) {
            return player.notify('Невозможно подобрать предмет, находясь в сражении', 'error');
        }

        if (new_owner_type >= OWNER_TYPES.BAG1 && new_owner_type <= OWNER_TYPES.BAG_LAST) {
            const bagsInInventoryCount = inventory.getItemsCountByType(player, ITEM_TYPE.BAGS);

            if (bagsInInventoryCount > 2) {
                return player.notify('Оставьте в инвентаре только 2 сумки');
            }
        }

        if (new_owner_type == OWNER_TYPES.PLAYER && itmCfg.type === ITEM_TYPE.BAGS) {
            const bagsInInventoryCount = inventory.getItemsCountByType(player, ITEM_TYPE.BAGS);

            if (bagsInInventoryCount >= 2) {
                return player.notify('Невозможно взять больше двух сумок в инвентаре');
            }
        }

        if (itmCfg.item_id === 863 && (new_owner_type !== OWNER_TYPES.PLAYER || new_owner_id !== user.id)) return player.notify("Вы можете положить даный предмет только себе в инвентарь", "error")
        if (itmCfg.protect) {
            const isContainer = getContainerByOwnerType(owner_type)
            if (isContainer) {
                const itemContainer = inventory.get(owner_id);
                if (itemContainer) {
                    if (itemContainer.owner_type !== OWNER_TYPES.PLAYER || itemContainer.owner_id !== user.id) return player.notify("Данный предмет нельзя забрать", "error")
                }
            } else if (owner_type === OWNER_TYPES.PLAYER && owner_id != user.id) return player.notify("Данный предмет нельзя забрать", "error")
        }
        if (itmCfg.canFactionsTake && owner_type === OWNER_TYPES.WORLD && !itmCfg.canFactionsTake.includes(user.fraction)) return player.notify("Вы не можете это забрать", "error")
        let access = inventory.haveAccess(player, owner_type, owner_id)
        let namedesc = inventory.getInventoryNameAndDesc(owner_type, owner_id, player)
        if (!access) return player.notify(`Вы не можете использовать инвентарь ${namedesc.name}`, "error");
        let access2 = inventory.haveAccess(player, owner_type, owner_id)
        let namedesc2 = inventory.getInventoryNameAndDesc(new_owner_type, new_owner_id, player)
        if (!access2) return player.notify(`Вы не можете использовать инвентарь ${namedesc2.name}`, "error");
        let targetInv = inventory.getInventory(new_owner_type, new_owner_id);

        const checkWeight = (): boolean => {
            if (inventory.getWeightItems(targetInv) + getItemWeight(item.item_id, item.count) > inventory.getWeightInventoryMax(new_owner_type, new_owner_id)) {
                if (itmCfg.item_id == 864)
                    player.notify(`${namedesc2.name} перегружен. Вы можете вернуть груз на склад`, "error");
                else
                    player.notify(`${namedesc2.name} перегружен`, "error");

                return false;
            }

            return true;
        }

        if (!checkWeight()) {
            return;
        }


        if (new_owner_type == OWNER_TYPES.WEAPON_MODS) {
            const weapon = inventory.get(new_owner_id);
            if (weapon) {
                let allItems = inventory.getInventory(new_owner_type, new_owner_id);
                const wcfg = inventoryShared.getWeaponConfigByItemId(weapon.item_id)
                if (wcfg && wcfg.addons) {

                    const typeT = getWeaponAddonKeyByItemId(weapon.item_id, item.item_id)
                    if (!typeT) return player.notify('Данная модификация не подходит для установки', 'error')
                    let groups: number[] = [];
                    allItems.map(q => {
                        const type = getWeaponAddonKeyByItemId(weapon.item_id, q.item_id)
                        const ids = wcfg.addons[type]?.group
                        if (ids) groups.push(ids)
                    })
                    const grT = wcfg.addons[typeT]?.group
                    if (grT && groups.includes(grT)) return player.notify('Данная модификация или модификация данной категории уже установлена', 'error')
                }


            }
        }
        const container = inventory.getContainerData(new_owner_type, new_owner_id);
        if (container && container.access && !container.access.includes(item.item_id)) return player.notify(`${getBaseItemNameById(container.item_id)} не позволяет хранить в себе ${getItemName(item)}`)
        if (container && CONTAINERS_DATA.find(q => q.item_id === item.item_id) && !inventoryShared.getWeaponConfigByItemId(item.item_id)) return player.notify(`${getBaseItemNameById(container.item_id)} не позволяет хранить в себе ${getItemName(item)}`)
        if (!checkDistance()) return;
        if (new_owner_type == OWNER_TYPES.PLAYER && new_owner_id !== user.id) {
            const target = User.get(new_owner_id);
            if (!target) return player.notify('Игрок покинул сервер', 'error');
            player.notify('Запрос отправлен', 'success');
            if (!(await menu.accept(target, `Взять ${getItemName(item)}`, 'small'))) return user.notify('Игрок отказался брать', 'error');
            if (!checkDistance()) return;
            if (!checkWeight()) {
                return;
            }
            if (!target.vehicle) target.user.playAnimation([['mp_common', 'givetake2_a']], true)
        }
        if (!player.vehicle && !container) {
            if (item.owner_type === 0) player.user.playAnimation([["random@domestic", "pickup_low"]], true)
            else player.user.playAnimation([['mp_common', 'givetake2_a']], true)
        }
        player.user.achiev.achievTickItemOwner(new_owner_type)

        if (owner_type === OWNER_TYPES.VEHICLE) Logs.new(`vehicle_${owner_id}`, `${user.name} ${user.id}`, `Взял ${getBaseItemNameById(item.item_id)}`)
        if (new_owner_type === OWNER_TYPES.VEHICLE) Logs.new(`vehicle_${new_owner_id}`, `${user.name} ${user.id}`, `Положил ${getBaseItemNameById(item.item_id)}`)

        if ([OWNER_TYPES.HOUSE, OWNER_TYPES.STOCK_SAFE].includes(owner_type)) Logs.new(`house_${owner_type}_${owner_id}`, `${user.name} ${user.id}`, `Взял ${getBaseItemNameById(item.item_id)}`)
        if (owner_type >= OWNER_TYPES.STOCK_1 && owner_type <= OWNER_TYPES.STOCK_15) Logs.new(`warehouse_${new_owner_id}`, `${user.name} ${user.id}`, `Взял ${getBaseItemNameById(item.item_id)}`)

        if ([OWNER_TYPES.HOUSE, OWNER_TYPES.STOCK_SAFE].includes(new_owner_type)) Logs.new(`house_${new_owner_type}_${new_owner_id}`, `${user.name} ${user.id}`, `Положил ${getBaseItemNameById(item.item_id)}`)
        if (new_owner_type >= OWNER_TYPES.STOCK_1 && new_owner_type <= OWNER_TYPES.STOCK_15) Logs.new(`warehouse_${new_owner_id}`, `${user.name} ${user.id}`, `Положил ${getBaseItemNameById(item.item_id)}`)

        if (new_owner_type === OWNER_TYPES.PLAYER && new_owner_id === user.id) {
            if (owner_type === OWNER_TYPES.PLAYER || owner_type >= 15000 || owner_type === OWNER_TYPES.BAG) {
                const ownerIsPlayer = owner_type === OWNER_TYPES.PLAYER;
                let target;

                if (ownerIsPlayer) {
                    target = User.get(owner_id);
                } else {
                    const bag = inventory.get(owner_id);
                    if (bag) target = User.get(bag.owner_id);
                }

                if (target && target.user && target.user.cuffed && user.is_police) {
                    inventory.deleteItem(id);
                    gui.chat.sendDoCommand(player, `Изъял ${getItemName(item)} у ${target.dbid}`)
                    return;
                }
            }
        }

        if (new_owner_type === OWNER_TYPES.FARM_STOCK && owner_type === OWNER_TYPES.PLAYER && owner_id === user.id) {
            if (!SUPPLIES_LIST.map(s => s.inventoryItemId).includes(item.item_id) &&
                !FEED_LIST.map(s => s.inventoryItemId).includes(item.item_id))
                return user.notify('Только семена и корм можно положить на этот склад', 'error')
        }

        if (owner_type == OWNER_TYPES.FARM_STOCK && new_owner_type != OWNER_TYPES.PLAYER) {
            return user.notify('Можно положить только в личный инвентарь', 'error')
        }

        if (new_owner_type === OWNER_TYPES.PLAYER && owner_type === OWNER_TYPES.FARM_STOCK && new_owner_id === user.id) {
            if (player.farmWorker?.activity.id != owner_id)
                return user.notify('У вас нет доступа к этому складу', 'error')

            if ((SUPPLIES_LIST.some(s => s.vegInventoryItemId == item.item_id) || item.item_id == 9000) &&
                player.farmWorker?.activity.owner != user.id)
                return user.notify('Только владелец может взять это со склада', 'error')
        }

        if (isBattlePassItem(item.advancedString) || item.advancedString === 'BATTLE_PASS_CLOTHES') {
            let blockBPTransfer = true;

            if (new_owner_type === OWNER_TYPES.PLAYER && new_owner_id === user.id) blockBPTransfer = false;
            else if (new_owner_type >= 15000 || new_owner_type === OWNER_TYPES.BAG) {
                const bag = inventory.get(new_owner_id);
                if (bag.owner_id === user.id) blockBPTransfer = false;
            } else if (new_owner_type === OWNER_TYPES.WEAPON_MODS) {
                blockBPTransfer = false;
            }

            if (blockBPTransfer) return player.notify('Данный предмет нельзя перемещать', 'error');
        }

        if (donateStorage.isDonateItem(item)) {
            let blockDITransfer = true;

            if (new_owner_type === OWNER_TYPES.PLAYER && new_owner_id === user.id) blockDITransfer = false;
            else if (new_owner_type >= 15000 || new_owner_type === OWNER_TYPES.BAG) {
                const bag = inventory.get(new_owner_id);
                if (bag.owner_id === user.id) blockDITransfer = false;
            } else if (new_owner_type === OWNER_TYPES.WEAPON_MODS) {
                blockDITransfer = false;
            }

            if (blockDITransfer) return player.notify('Данный предмет нельзя перемещать', 'error');
        }

        if (inventoryShared.get(item.item_id) && inventoryShared.get(item.item_id).type === ITEM_TYPE.BAGS) {
            const container = CONTAINERS_DATA.find(el => el.item_id === item.item_id)
                const items = inventory.getInventory(container.owner_type, item.id)
            let haveBattlePassItems: boolean = false;
            let haveDonateBlockItems: boolean = false;

            items.forEach(element => {
                if (isBattlePassItem(element.advancedString) || element.advancedString === 'BATTLE_PASS_CLOTHES')
                    haveBattlePassItems = true;
            });

            items.forEach(element => {
                if (donateStorage.isDonateItem(element)) haveDonateBlockItems = true;
            })

            if (haveBattlePassItems)
                return player.notify('В сумке лежит предмет из боевого пропуска, сперва нужно выложить его', 'error');

            if (haveDonateBlockItems)
                return player.notify('В сумке лежит донатный предмет, сперва нужно выложить его', 'error');
        }

        if (player.user.entity.selectedBag === item.item_id) {
            player.user.entity.selectedBag = null
            player.user.sync_bag()
        }

        inventory.updateItemOwner(id, new_owner_type, new_owner_id, owner_type, owner_id)
        inventory.reloadInventory(player, [new_owner_type, new_owner_id], [owner_type, owner_id])

        mp.events.call('inventory:itemTransferred', player, id, new_owner_type, new_owner_id, owner_type, owner_id);

        Logs.insertInventoryLog(item, owner_id, new_owner_id, 'transfer', `from ${owner_type} to ${new_owner_type}`)
    },
    /** Функция проверяет, влезел ли новый предмет в инвентарь */
    canTakeItem(owner_type: OWNER_TYPES, owner_id: number, item_id: number, amount = 1, count?: number) {
        const current = inventory.getWeightItems(inventory.getInventory(owner_type, owner_id));
        const max = inventory.getWeightInventoryMax(owner_type, owner_id);
        const addWeight = (count ? getItemWeight(item_id, count) : getItemWeight(item_id, count)) * amount;
        return (current + addWeight) <= max;
    },
    useItem: async (player: PlayerMp, id: number, owner_type: OWNER_TYPES, owner_id: number) => {
        const user = player.user;
        if (user.walkingWithObject) return user.notify('Недоступно при перемещении предмета', 'error');
        if (user.cuffed) return player.notify('Нельзя использовать предметы в наручниках', 'error');
        if (user.jailSyncHave) return player.notify('Нельзя использовать предметы в тюрьме', 'error');
        let item = inventory.get(id, owner_type, owner_id);
        if (!item) return player.notify("Предмет не обнаружен", "error");
        let itmCfg = inventoryShared.get(item.item_id);
        if (!itmCfg) return player.notify("Предмет некорректный", "error");
        if (!canUse(item.item_id)) return player.notify("Предмет нельзя использовать", "error");
        let count = itmCfg.default_count ? itmCfg.default_count : item.count;
        const illHave = illData.filter(q => q.healItem === itmCfg.item_id);
        if (illHave.length > 0) {
            if (user.pillUseCoolDown.has(itmCfg.item_id)) return player.notify(`Вы недавно уже принимали ${getItemName(item)}`, 'error');
            user.pillUseCoolDown.set(itmCfg.item_id, true);
            setTimeout(() => {
                if (!user) return;
                if (!mp.players.exists(player)) return;
                if (!user.exists) return;
                user.pillUseCoolDown.delete(itmCfg.item_id);
            }, PILL_USE_TIMER * 60000)
            user.playAnimation([["mp_player_intdrink", "intro_bottle", 1], ["mp_player_intdrink", "loop_bottle", 2], ["mp_player_intdrink", "outro_bottle", 1]], true, false);
            illHave.map(q => {
                user.removeIll(q.id, q.healItemMultiple || Math.floor(q.max / 10))
            })
            if ([900, 903].includes(item.item_id)) {
                CustomEvent.triggerClient(player, 'drug:clean')
            }
            item.useCount(1, player)
        }

        if (itmCfg.type === ITEM_TYPE.SMOKING) {
            mp.events.call('smoking:action', player, item.item_id, item);
        }

        if (item.item_id === AUTOPILOT_ITEM_ID) {
            if (!player.vehicle) {
                return player.notify('Этот предмет можно использовать только находясь в Т/С', 'error');
            }

            if (!player.vehicle?.entity?.data) {
                return player.notify('Систему автопилота невозможно установить в этом Т/С', 'error');
            }

            const vehicleData = player.vehicle.entity.data;
            if (vehicleData.isAutopilotInstalled) {
                return player.notify('Система автопилота уже установлена в этом Т/С', 'error');
            }

            vehicleData.isAutopilotInstalled = true;
            vehicleData.save();

            item.useCount(1);

            player.notify('Вы успешно установили систему автопилота в транспортное средство. ' +
                'Чтобы использовать его, нажмите (O), находясь в машине на водительском месте', 'success');
        }

        if (DivingMaps.find(el => el.itemId === item.item_id)) {
            if (item.item_id === 6526) player.user.achiev.achievTickItem(6526);
            if (item.item_id === 6527) player.user.achiev.achievTickItem(6527);
            if (item.item_id === 6528) player.user.achiev.achievTickItem(6528);

            let itemConfig: DivingAchievementClothesItem | null = null;

            if (item.item_id === 6526) {
                itemConfig = DIVING_FIRST_MAP_ITEM;
            } else if (item.item_id === 6527) {
                itemConfig = DIVING_SECOND_MAP_ITEM;
            } else if (item.item_id === 6528) {
                itemConfig = DIVING_THIRD_MAP_ITEM;
            }

            player.user.log('diving', `Получил предмет за сбор карты ${item.item_id}`);

            if (itemConfig !== null) {
                let advancedNumber: number = itemConfig.variation * CLOTH_VARIATION_ID_MULTIPLER;

                advancedNumber += player.user.male ? itemConfig.dressMaleCfg : itemConfig.dressFemaleCfg;

                player.user.giveItem({
                    item_id: itemConfig.item_id,
                    serial: itemConfig.serial,
                    advancedNumber: advancedNumber
                }, true);
            }

            CustomEvent.triggerClient(player, 'diving:useMap', item.item_id);
        }

        if ([ITEM_TYPE.WATER, ITEM_TYPE.FOOD, ITEM_TYPE.ALCO].includes(itmCfg.type)) {
            if (itmCfg.type === ITEM_TYPE.ALCO) {
                count = system.smallestNumber(count, 45)
                user.addIll('alco', count);
                CustomEvent.triggerClient(player, "drug:use", system.biggestNumber(10, count), true)
            }
            if (itmCfg.type != ITEM_TYPE.FOOD) {
                if (user.hasAttachment('item_' + itmCfg.item_id)) return player.notify("Потратьте время чтобы допить", "error")
                user.playAnimation([["mp_player_intdrink", "intro_bottle", 1], ["mp_player_intdrink", "loop_bottle", 1], ["mp_player_intdrink", "outro_bottle", 1]], true, false);
                player.user.water += count;
            } else {
                if (user.hasAttachment('item_' + itmCfg.item_id)) return player.notify("Потратьте время чтобы доесть", "error")
                user.playAnimation([["mp_player_inteat@burger", "mp_player_int_eat_burger_enter", 1], ["mp_player_inteat@burger", "mp_player_int_eat_burger", 1], ["mp_player_inteat@burger", "mp_player_int_eat_burger_fp", 1], ["mp_player_inteat@burger", "mp_player_int_eat_exit_burger", 1]], true, false);
                if (item.item_id === 30) player.user.water += count;
                player.user.food += count;
                if (!item.create) {
                    const cfgIll = getIllConfig('food')
                    if (system.getRandomInt(0, 30) <= (cfgIll.chance || 10)) {
                        user.addIll('food', cfgIll.step)
                    }
                }
            }

            if (item.create) {
                let lastTime = item.create + ((itmCfg.poisoning || POISONING_DAYS) * 24 * 60);
                let m = lastTime - system.timestamp;
                if (m > 0) {
                    let d = Math.floor(m / 60 / 24);
                    if (d) {
                        let chance = Math.min(100, POISONING_CHANCE_PER_DAY * d);
                        let z = system.getRandomInt(0, 100);
                        if (z <= chance) {
                            const cfgIll = getIllConfig('food')
                            user.addIll('food', cfgIll.step)
                        }
                    }
                }
            }
            user.addAttachment('item_' + itmCfg.item_id);
            setTimeout(() => {
                if (mp.players.exists(player)) user.removeAttachment('item_' + itmCfg.item_id);
            }, 4000)
            item.useCount(count, player)
        }
        if (itmCfg.inHand) {
            if (user.hasAttachment('item_' + itmCfg.item_id)) user.removeAttachment('item_' + itmCfg.item_id);
            else user.addAttachment('item_' + itmCfg.item_id);
        }
        if (item.item_id === 894) {
		    if (player.dimension) return player.notify('В данном месте нельзя cтавить Музыкальный центр', 'error')
            if (player.vehicle) return player.notify('Покиньте транспорт', 'error')
            if (user.inSaveZone) return player.notify('В данном месте нельзя cтавить Музыкальный центр', 'error')
            new BoxPlayer(player, item);
			inventory.closeInventory(player);
        }
        if (item.item_id === 868) {
            if (player.dimension) return player.notify('В данном месте нельзя выпускать фейерверк', 'error')
            if (player.vehicle) return player.notify('Покиньте транспорт', 'error')
            if (user.inSaveZone) return player.notify('В данном месте нельзя выпускать фейерверк', 'error')
            item.useCount(count, player)
            const targets = [...User.getNearestPlayers(player, 400), player];
            const pos = user.dropPos
            targets.map(target => {
                CustomEvent.triggerClient(target, 'fireshow:play', [pos.x, pos.y, pos.z])
            })
            player.user.playAnimation([["anim@mp_fireworks", "place_firework_3_box"]], false)
            inventory.closeInventory(player);
        }
        if (item.item_id === 866) {
            if (item.advancedNumber !== user.id) return player.notify('Вы не можете использовать данный купон', 'error');
            if (!item.advancedString) return player.notify('Купон повреждён', 'error');
            const [type, model] = item.advancedString.split('|');
            if (type === 'veh') {
                const vehConf = Vehicle.getVehicleConfig(model);
                if (!vehConf) return player.notify('Данный купон временно не подлежит обмену', 'error');
                if (vehConf.license && !user.haveActiveLicense(vehConf.license)) return player.notify(`Чтобы получить ${vehConf.name} необходимо иметь активную лицензию на ${LicenseName[vehConf.license]}`, "error");
                if (user.myVehicles.length >= user.current_vehicle_limit) return player.notify(`Вы можете иметь не более ${user.current_vehicle_limit} ТС. Дополнительные слоты можно приобрести в личном кабинете`, "error");
                Vehicle.createNewDatabaseVehicle(player, vehConf.id, {r: 0, g: 0, b: 0}, {
                    r: 0,
                    g: 0,
                    b: 0
                }, new mp.Vector3(0, 0, 0), 0, Vehicle.fineDimension, 0, 1)
                player.outputChatBox(`Вы получили ${vehConf.name} обменяв купон. Транспорт вы можете бесплатно забрать на ближайшей штрафстоянке`);
            } else {
                return player.notify('Данный купон нельзя применить', 'error');
            }
            item.useCount(1, player);
            player.notify('Купон применён', 'success');
            inventory.reloadInventory(player, [OWNER_TYPES.PLAYER, player.dbid])
            return;
        }
        if ([817, 862].includes(item.item_id)) {
            const veh = user.getNearestVehicle();
            if (!veh) return player.notify('Поблизости ТС не обнаружен', 'error');
            const cfg = Vehicle.getVehicleConfig(veh);
            if (cfg) {
                if (cfg.fuel_type === VEHICLE_FUEL_TYPE.ELECTRO && item.item_id !== 862) return player.notify(`${getBaseItemNameById(item.item_id)} не предназначен для ${cfg.name}`, 'error');
                if (cfg.fuel_type !== VEHICLE_FUEL_TYPE.ELECTRO && item.item_id !== 817) return player.notify(`${getBaseItemNameById(item.item_id)} не предназначен для ${cfg.name}`, 'error');
            }
            const max = Vehicle.getFuelMax(veh);
            const current = Vehicle.getFuel(veh);
            const needFuel = Math.min(item.count, max - current);
            if (!needFuel) return player.notify(`${cfg.fuel_type === VEHICLE_FUEL_TYPE.ELECTRO ? 'Аккумулятор полный' : 'Бак уже полный'}`, 'error');
            item.useCount(needFuel, player)
            Vehicle.addFuel(veh, needFuel);
            player.notify(`${cfg.fuel_type === VEHICLE_FUEL_TYPE.ELECTRO ? 'Аккумулятор заряжен' : 'Топливо заправлено'}`, 'success');

        }
        if (itmCfg.type === ITEM_TYPE.DRUG) {
            if (user.drugUse) return player.notify('Вы уже недавно применяли наркотики', 'error');

            if (user.isInCombat) {
                player.notify('Вы не можете сделать это в бою', 'error');
                return;
            }

            user.drugUse = true;
            user.playAnimation([["mp_player_intdrink", "intro_bottle", 1], ["mp_player_intdrink", "loop_bottle", 2], ["mp_player_intdrink", "outro_bottle", 1]], true, false);
            user.addIll('narko', itmCfg.drugMultiple || 1);
            CustomEvent.triggerClient(player, "drug:use", system.biggestNumber(30, itmCfg.drugMultiple * 0.3))
            item.useCount(1, player)
            if (itmCfg.drugHeal) {
                player.user.setRegeneration(itmCfg.drugHeal, 60, 5);
                //user.health = system.smallestNumber(user.health + (itmCfg.drugMultiple * 0.3), 100)
            }
            setTimeout(() => {
                if (mp.players.exists(player)) user.drugUse = false;
            }, 15000)

        }

        // Противоугонная система
        if (item.item_id === 865) {
            const veh = user.getNearestVehicle();
            if (!veh) return player.notify('Поблизости ТС не обнаружен', 'error');
            if (!veh.entity) return player.notify('На данный ТС нельзя установить противоугонную систему', 'error');
            if (veh.entity.owner && veh.entity.owner !== user.id) return player.notify('Противоугонную систему может установить только владелец', 'error');
            if (veh.entity.familyOwner && veh.entity.familyOwner !== user.familyId) return player.notify('Противоугонную систему может установить только член семьи', 'error');
            if (veh.entity.data.keyProtect) return player.notify('На данный ТС уже установлена противоугонная система', 'error');
            item.useCount(1, player);
            user.playAnimation([['mp_common', 'givetake2_a']], true)
            veh.entity.data.keyProtect = 1;
            veh.entity.save()
            player.notify('Противоугонная система успешно установлена', 'success');
            inventory.reloadInventory(player, [OWNER_TYPES.PLAYER, player.dbid])
            return;
        }
        // Набор инструментов
        if (item.item_id === 815) {
            if (player.vehicle) return player.notify('Нельзя ремонтировать ТС находясь в нём', 'error')
            inventory.closeInventory(player);
            const veh = user.getNearestVehicle();
            if (!veh) return player.notify('Поблизости ТС не обнаружен')
            if (veh.getOccupants().length > 0) {
                return player.notify('Нельзя отремонтировать ТС, пока кто-то в нём находится');
            }
            item.useCount(1, player)
            Vehicle.repair(veh, true);
            return;
        }
        // Наручники
        if ([CUFFS_ITEM_ID, SCREWS_ITEM_ID].includes(item.item_id)) {
            const target = player.user.getNearestPlayer(2);
            if (!target) return player.notify('Поблизости нет никого', 'error');
            user.setCuffedTarget(target, item)
        }

        if ([CUFFS_KEY_ITEM_ID, ...SCREWS_DESTROYER_ITEM_IDS].includes(item.item_id)) {
            const target = player.user.getNearestPlayer(2);
            if (!target) return player.notify('Поблизости нет никого', 'error');
            user.setUncuffedTarget(target)
        }

        // Аптечка
        if (itmCfg.use && itmCfg.healUse) {
            if (user.isInCombat) {
                player.notify('Вы не можете сделать это в бою', 'error');
                return;
            }

            let attach: string;

            if (item.item_id === 902) {
                attach = 'heal_902'
            }
            else if (item.item_id === 908) {
                attach = 'heal_908'
            }

            if (attach) player.user.addAttachment(attach);

            user.playAnimationWithResult(["amb@prop_human_movie_studio_light@idle_a", "idle_a", true], 5, 'Применяем ' + itmCfg.name).then(status => {
                if (attach) player.user.removeAttachment(attach);
                if (!status) return;
                if (!mp.players.exists(player)) return;
                if (!user.inventory.find(q => q.id === item.id)) return player.notify('У вас нет аптечки', 'error');
                player.user.health += itmCfg.healUse;

                item.useCount(1, player)
                player.notify('Предмет использован', 'success');
                if (attach) CustomEvent.triggerClient(player, 'attach:removeLocal', attach);
            })
        }
        // Документы
        if ([800, 802, 803, 824].includes(item.item_id)) {
            if (item.item_id === 824 && !UdoData.find(q => q.id === user.fraction)) return player.notify('Вы не можете использовать удостоверение', 'error');
            inventory.closeInventory(player);
            const show = async () => {
                if (item.item_id == 800) {
                    let data = await getDocumentData(item)
                    if (!data) return player.notify("Документы недействительные", "error")
                    // user.setGui('idcard');
                    CustomEvent.triggerCef(player, "cef:idcard:new", data)
                } else if (item.item_id == 824) {
                    CustomEvent.triggerCef(player, "udo:show", user.udoData)
                } else if (item.item_id == 802) {
                    const [document, date, code, id, name, social, idCreator, nameCreator, socialCreator, real] = item.serial.split('|')
                    CustomEvent.triggerCef(player, "document:show", document, date, code, id, name, social, idCreator, nameCreator, socialCreator, real)
                } else if (item.item_id == 803) {
                    const [type, serial, code, timestring, userid] = item.serial.split('-')
                    const time = parseInt(timestring);
                    const userdata = await User.getData(parseInt(userid));
                    if (!userdata) return player.notify("Владелец документов покинул страну"), inventory.deleteItem(item);
                    CustomEvent.triggerCef(player, "license:show", {
                        type, serial: parseInt(serial), time, player: userdata.rp_name, code
                    })
                }
            }
            const m = menu.new(player, "", "");
            if (!user.selectNearestPlayer()) return show();
            m.newItem({
                name: "Посмотреть документы",
                onpress: async () => {
                    m.close();
                    show();
                }
            })
            m.newItem({
                name: "Предъявить документы",
                onpress: async () => {
                    user.selectNearestPlayer().then(target => {
                        m.close()
                        menu.accept(target, "Желаете ознакомится с документами", null, 15000).then(async status => {
                            if (!status) return;
                            if (!mp.players.exists(player)) return;
                            if (!mp.players.exists(target)) return;
                            if (!item) return;
                            if (!user.getNearestPlayers(5).find(q => q.id === target.id)) return target.notify("Вы отошли слишком далеко", "error");
                            if (item.item_id == 800) {
                                let data = await getDocumentData(item)
                                if (!data) return player.notify("Документы недействительные", "error")
                                // target.user.setGui('idcard');
                                CustomEvent.triggerCef(target, "cef:idcard:new", data)
                            } else if (item.item_id == 824) {
                                CustomEvent.triggerCef(target, "udo:show", user.udoData)
                            } else if (item.item_id == 802) {
                                const [document, date, code, id, name, social, idCreator, nameCreator, socialCreator, real] = item.serial.split('|')
                                CustomEvent.triggerCef(target, "document:show", document, date, code, id, name, social, idCreator, nameCreator, socialCreator, real)
                            } else if (item.item_id == 803) {
                                const [type, serial, code, timestring, userid] = item.serial.split('-')
                                const time = parseInt(timestring);
                                const userdata = await User.getData(parseInt(userid));
                                if (!userdata) return player.notify("Владелец документов покинул страну"), inventory.deleteItem(item);
                                if (!mp.players.exists(target)) return;
                                CustomEvent.triggerCef(target, "license:show", {
                                    type, serial: parseInt(serial), time, player: userdata.rp_name, code
                                })
                            }
                        })
                    })


                }
            })
            m.open();
            return;
        }
        if (item.item_id === 856) {
            await tablet.openForPlayer(player)
        }
        if (item.item_id === 853) {
            CustomEvent.triggerCef(player, "terminal:open");
            inventory.closeInventory(player)
        }
        if (item.item_id === 852) {
            CustomEvent.triggerCef(player, "radio:switchRadio");
            inventory.closeInventory(player)
        }
        if (item.item_id === 850) {
            if (!player.phoneCurrent) {
                phone.openPhone(player, item.id)
                inventory.closeInventory(player)
            } else {
                CustomEvent.triggerCef(player, 'phone:closephone');
                player.phoneReadMessage = null;
                player.phoneCurrent = null;
            }
        }
        if (item.item_id === 851) {
            inventory.closeInventory(player);
            let itemsP = inventory.getInventory(OWNER_TYPES.PLAYER, player.user.id).filter(item => item.item_id === 850)
            const freePhones = itemsP.filter(q => !q.advancedNumber);
            if (freePhones.length === 1) {
                let sim = inventory.get(item.id, OWNER_TYPES.PLAYER, player.user.id);
                if (!sim) return player.notify(`Выбранной сим-карты больше нет в вашем инвентаре`, "error");
                let phone = inventory.get(freePhones[0].id, OWNER_TYPES.PLAYER, player.user.id);
                if (!phone) return player.notify(`Выбранного телефона больше нет в вашем инвентаре`, "error");
                if (phone.advancedNumber) return player.notify(`В телефон уже установлена сим-карта`, "error");
                phone.advancedNumber = sim.advancedNumber + 0;
                phone.advancedString = sim.advancedString + "";
                inventory.deleteItem(sim, OWNER_TYPES.PLAYER, player.user.id)
                if (!phone.temp) phone.save();
                user.notifyPhone("Система", "Смена оператора", "В телефон была установлена новая сим карта", "success")
                return;
            }
            if (itemsP.length == 0) return player.notify("У вас в инвентаре нет телефона, вам необходимо приобрести его в магазине", "error");
            let m = menu.new(player, "", "Выберите подходящий телефон");
            itemsP.map(itemq => {
                m.newItem({
                    name: getItemName(itemq),
                    icon: "Icon_" + itemq.item_id,
                    more: `${itemq.advancedNumber ? '~r~Сим-карта установлена' : '~g~Без сим-карты'}`,
                    onpress: () => {
                        if (itemq.advancedNumber) return player.notify(`В телефон уже установлена сим-карта`, "error");
                        m.close();
                        let sim = inventory.get(item.id, OWNER_TYPES.PLAYER, player.user.id);
                        if (!sim) return player.notify(`Выбранной сим-карты больше нет в вашем инвентаре`, "error");
                        let phone = inventory.get(itemq.id, OWNER_TYPES.PLAYER, player.user.id);
                        if (!phone) return player.notify(`Выбранного телефона больше нет в вашем инвентаре`, "error");
                        if (phone.advancedNumber) return player.notify(`В телефон уже установлена сим-карта`, "error");
                        phone.advancedNumber = sim.advancedNumber + 0;
                        phone.advancedString = sim.advancedString + "";
                        inventory.deleteItem(sim, OWNER_TYPES.PLAYER, player.user.id)
                        if (!phone.temp) phone.save();
                        user.notifyPhone("Система", "Смена оператора", "В телефон была установлена новая сим карта", "success")
                    }
                })
            })
            m.open();
            return;
        }
        if (itmCfg.type == ITEM_TYPE.CLOTH) {
            if (item.item_id !== ARMOR_ITEM_ID) {
                if (user.getJobDress) return player.notify('Нельзя использовать одежду пока на вас рабочая форма', 'error')
                if (!user.mp_character) return player.notify('Вы не можете использовать одежду пока используется не стандартный скин', 'error')
            }

            const dressCfg = dress.get(item.advancedNumber);
            if (!dressCfg) return player.notify('Одежда повреждена', 'error')

            if (item.item_id === ARMOR_ITEM_ID) {
                // У всех бронежилетов должны быть DressEntity как для мужского, так и для женского персонажа
                // Ищем аналог для противоположного пола
                if (dressCfg.male !== user.is_male) {
                    item.advancedNumber = dress.data
                        .find(dressEntity => dressEntity.male === user.is_male && dressEntity.name === item.serial)
                        .id;
                }
            } else {
                if (dressCfg.male !== user.is_male) return player.notify("Данная одежда предназначена для " + (dressCfg.male ? "мужчин" : "женщин"), "error");
            }

            user.setDressValueById(item.item_id, item.advancedNumber, user.customArmor);

            if (item.item_id === ARMOR_ITEM_ID) {
                user.armour = item.count;
            }

            inventory.deleteItem(item, OWNER_TYPES.PLAYER, user.id)
            inventory.reloadInventory(player, [OWNER_TYPES.PLAYER, player.dbid])
        }
        if (itmCfg.type == ITEM_TYPE.WEAPON) {
            player.user.currentWeapon = player.user.currentWeapon && player.user.currentWeapon.item_id === item.item_id ? null : {
                id: item.id,
                item_id: item.item_id,
                ammo: 0,
                serial: item.serial,
                unloaded: true,
                max_ammo: inventoryShared.getWeaponConfigByItemId(item.item_id).ammo_max
            }
        }
        if (itmCfg.type == ITEM_TYPE.WEAPON_MAGAZINE) {
            return;
        }
        if (itmCfg.type == ITEM_TYPE.AMMO_BOX) {
            return;
        }

        // Была использована удочка
        if (RODS.map(r => {
            return r.itemId
        }).includes(item.item_id)) {
            user.rodInHandId = item.item_id
            CustomEvent.triggerClient(player, 'rod:use', getFisherLevelByExp(user.getJobExp('fisher')), user.getJobExp('fisher'), user.entity.fishStats)
        }

        invokeHook(INVENTORY_USE_ITEM_HOOK, player, item, itmCfg);

        inventory.reloadInventory(player, [owner_type, owner_id]);
        Logs.insertInventoryLog(item, owner_id, -1, 'use', `useItem`)
    },
    closeInventory: (player: PlayerMp, sendGui = true) => {
        if (!mp.players.exists(player)) return;
        if (!player.user) return;
        if (sendGui) player.user.setGui(null);
        player.openInventory = null;
    },
    removeAllWeapons: (player: PlayerMp) => {
        const playerItems = player.user.allMyItems;
        const itemsToDelete = playerItems
            .filter(item => inventoryShared.get(item.item_id).type === ITEM_TYPE.WEAPON);

        inventory.deleteItems(...itemsToDelete);
    },
    getDroppedItems: (player: PlayerMp, radius = 5) => {
        let res: ItemEntity[] = inventory.inventory_blocks.get(`0_0`).filter(q => q && system.distanceToPos(q, player.position) <= radius && q.d == player.dimension)

        return res;
    },
    deleteItemsById: (player: PlayerMp, itemId: number, amount: number) => {
        const items = player.user.inventory
            .filter(i => i.item_id === itemId);

        for (let item of items) {
            const itemConfig = inventoryShared.get(item.item_id);

            const leftToDelete = amount - (itemConfig.canSplit ? item.count : 1);

            if (itemConfig.canSplit) {
                if (item.count < amount) {
                    item.count = 0;
                } else {
                    item.count -= amount;
                }
            } else {
                item.count = 0;
            }

            if (item.count <= 0) {
                inventory.deleteItem(item, OWNER_TYPES.PLAYER, player.user.id);
            } else {
                item.save();
            }

            amount = leftToDelete;
            if (amount <= 0) {
                break;
            }
        }

        inventory.reloadInventory(player, [OWNER_TYPES.PLAYER, player.user.id]);
    },
    deleteItem: (itemget: number | ItemEntity, owner_type?: OWNER_TYPES, owner_id?: number, deleteFromDatabase = true) => {
        let item = typeof itemget === "number" ? inventory.get(itemget, owner_type, owner_id) : itemget
        if (!item) return;
        if (item.prop) {
            if (mp.objects.exists(item.prop)) item.prop.destroy()
            item.prop = null;
        }
        if (item.colshape && item.colshape.exists) {
            item.colshape.destroy()
            item.colshape = null;
        }
        let oldInventory = inventory.getInventory(item.owner_type, item.owner_id);
        let itmCfg = inventoryShared.get(item.item_id);
        if (!itmCfg) {
            if (deleteFromDatabase && !item.temp) removeEntity(item)
        } else {
            if (item.owner_type == OWNER_TYPES.PLAYER) {
                if (itmCfg.type == ITEM_TYPE.WEAPON) {
                    let target = User.get(item.owner_id);
                    if (target) {
                        let curWeapon = target.user.currentWeapon;
                        if (curWeapon) {
                            if (curWeapon.id == item.id) {
                                target.user.removeCurrentWeapon(false, true)
                            }
                        }
                    }
                } /*else if(inventoryShared.getWeaponConfigByMagazine(item.item_id)){
                    let target = User.get(item.owner_id);
                    if (target){
                        target.user.currentWeaponSync();
                    }
                }*/
            }
        }
        if (item.item_id === 850) {
            phone.getPhoneEntity(item.id, false).then(phone => {
                if (phone) PhoneEntity.remove(phone);
            })
        }
        const container = CONTAINERS_DATA.find(q => q.item_id === item.item_id);
        if (container) {
            inventory.clearInventory(container.owner_type, item.id);
        }
        if (oldInventory && oldInventory.findIndex(q => q.id == item.id) > -1) oldInventory.splice(oldInventory.findIndex(q => q.id == item.id), 1);
        if (deleteFromDatabase && !item.temp) removeEntity(item)

        Logs.insertInventoryLog(item, owner_id, -1, 'delete', `delete from owner ${owner_type}`)
    },
    deleteItems: (...itemget: ItemEntity[]) => {
        const multiple = itemget.length > 10
        if (multiple) {
            let s = 0;
            const q = () => {
                ItemEntity.delete({id: In(itemget.map(q => q.id))}).then(status => {

                }).catch(err => {
                    system.debug.error(err);
                    s++;
                    if (s >= 5) return;
                    setTimeout(() => {
                        q();
                    }, 3000)
                })
            }
            q();
        }
        itemget.map(item => inventory.deleteItem(item, item.owner_type, item.owner_id, !multiple));
    },
    getPassword: (owner_type: number, owner_id: number) => {
        return 1234;
    },
    /**
     * @param checkAllNearest "странный" параметр, отвечающий за проверку блоков с ближайшими через getAllNearest.
     */
    reloadInventoryAdvanced: (position: Vector3Mp, range: number, dimension: number, checkAllNearest: boolean, ...blocks: [number, number][]) => {
        setTimeout(() => {
            let inventories = new Map<string, InventoryItemCef[]>();
            let weights = new Map<string, number>();
            let weightsMax = new Map<string, number>();
            blocks.map(block => {
                let items = inventory.getInventory(block[0], block[1])
                inventories.set(`${block[0]}_${block[1]}`, items.map(q => {
                    return [q.id, q.item_id, q.count, q.serial, q.extra]
                }));
                weights.set(`${block[0]}_${block[1]}`, inventory.getWeightItems(items));
                weightsMax.set(`${block[0]}_${block[1]}`, inventory.getWeightInventoryMax(block[0], block[1]));
            })

            let players: PlayerMp[] = [];
            mp.players.forEachInRange(position, range, pl => {
                if (!pl.openInventory) return;
                if (pl.dimension != dimension) return;
                players.push(pl);
            });

            players.map(player => {
                let allNearest = inventory.getAllNearestInventory(player)
                if (player.openInventory) {
                    let ownertype = system.parseInt(player.openInventory.split('_')[1]);
                    let ownerid = system.parseInt(player.openInventory.split('_')[2]);
                    if (ownertype && ownerid && !allNearest.find(q => q.owner_id === ownerid && q.owner_type == ownertype)) {
                        allNearest.push({
                            owner_type: ownertype,
                            owner_id: ownerid,
                            have_access: inventory.haveAccess(player, ownertype, ownerid)
                        });
                    }
                }
                if (!mp.players.exists(player)) return;
                if (!player.openInventory) return;
                if (!player.user) return;
                let blocksSend: InventoryDataCef[] = [];
                blocks.map(block => {
                    // полная херня, но с этой херней вероятность что-то сломать гораздо ниже
                    // без неё, он не дает обновить блоки, которые закрылись от игрока
                    if (checkAllNearest) {
                        if ((block[0] != OWNER_TYPES.PLAYER || block[1] != player.user.id) && !allNearest.find(q => q.owner_type == block[0] && q.owner_id == block[1] && q.have_access)) return;
                    }

                    let namedesc = inventory.getInventoryNameAndDesc(block[0], block[1], player);
                    let access = inventory.haveAccess(player, block[0], block[1])

                    blocksSend.push({
                        name: namedesc.name,
                        desc: namedesc.desc,
                        owner_type: block[0],
                        owner_id: block[1],
                        // weight: weights.get(`${block[0]}_${block[1]}`),
                        weight_max: weightsMax.get(`${block[0]}_${block[1]}`),
                        items: access ? inventories.get(`${block[0]}_${block[1]}`) : [],
                        closed: !access
                    })
                })

                blocksSend.push({
                    name: "Предметы на земле",
                    desc: "Радиус: 5m",
                    owner_type: 0,
                    owner_id: 0,
                    // weight: 0,
                    weight_max: 0,
                    items: inventory.getDroppedItems(player, 5).map(q => {
                        return [q.id, q.item_id, q.count, q.serial, q.extra]
                    })
                })
                CustomEvent.triggerCef(player, "inventory:update", blocksSend, allNearest, player.user.currentWeapon, player.user.hotkeys, player.user.entity.inventory_level);
            })
        }, 100)
    },
    reloadInventory: (target: PlayerMp, ...blocks: [number, number][]) => {
        if (!mp.players.exists(target)) return;

        inventory.reloadInventoryAdvanced(target.position, 5, target.dimension, true, ...blocks);
    },
    reloadPersonalInventory: (player: PlayerMp) => {
        const myInventory: InventoryDataCef = {
            name: "Ваш инвентарь",
            desc: player.user.name,
            owner_id: player.dbid,
            owner_type: OWNER_TYPES.PLAYER,
            weight_max: inventory.getWeightInventoryMax(OWNER_TYPES.PLAYER, player.dbid),
            items: inventory.getInventory(OWNER_TYPES.PLAYER, player.dbid)
                .map(item => [item.id, item.item_id, item.count, item.serial, item.extra])
        }

        CustomEvent.triggerCef(player, 'inventory:updateSelfBlock', myInventory);
    },
    openInventory: (player: PlayerMp, ownertype?: number, ownerid?: number) => {
        if (!player.user) return;
        if (!player.user.canUseInventory) return;
        let blocks: InventoryDataCef[] = [];
        let myid = player.user.id;
        let myinventory: InventoryItemCef[] = [];
        let myitems = inventory.getInventory(OWNER_TYPES.PLAYER, myid)
        myitems.map(item => {
            myinventory.push([item.id, item.item_id, item.count, item.serial, item.extra])
        })
        blocks.push({
            name: "Ваш инвентарь",
            desc: player.user.name,
            owner_id: myid,
            owner_type: OWNER_TYPES.PLAYER,
            weight_max: inventory.getWeightInventoryMax(OWNER_TYPES.PLAYER, myid),
            items: myinventory
        })
        blocks.push({
            name: "Предметы на земле",
            desc: "Радиус: 5m",
            owner_type: 0,
            owner_id: 0,
            weight_max: 0,
            items: inventory.getDroppedItems(player, 5).map(q => {
                return [q.id, q.item_id, q.count, q.serial, q.extra]
            })
        })
        inventory.getAllNearestInventory(player).map(inv => {
            let namedesc = inventory.getInventoryNameAndDesc(inv.owner_type, inv.owner_id, player)
            let items = inv.have_access ? inventory.getInventory(inv.owner_type, inv.owner_id) : [];
            blocks.push({
                name: namedesc.name,
                desc: namedesc.desc,
                owner_type: inv.owner_type,
                owner_id: inv.owner_id,
                closed: !inv.have_access,
                weight_max: inventory.getWeightInventoryMax(inv.owner_type, inv.owner_id),
                items: items.map(q => {
                    return [q.id, q.item_id, q.count, q.serial, q.extra]
                })
            })
        })
        if (player.openInventory && !ownertype && !ownerid) {
            ownertype = system.parseInt(player.openInventory.split('_')[1]);
            ownerid = system.parseInt(player.openInventory.split('_')[2]);
        }
        if (ownertype && !isNaN(ownertype) && ownertype > 0 && !isNaN(ownerid) && ownerid > 0) {
            let namedesc = inventory.getInventoryNameAndDesc(ownertype, ownerid, player)
            let items = inventory.getInventory(ownertype, ownerid)
            blocks.push({
                name: namedesc.name,
                desc: namedesc.desc,
                owner_type: ownertype,
                owner_id: ownerid,
                weight_max: inventory.getWeightInventoryMax(ownertype, ownerid),
                items: items.map(q => {
                    return [q.id, q.item_id, q.count, q.serial, q.extra]
                })
            })
        }

        player.openInventory = `inv_${ownertype}_${ownerid}`
        CustomEvent.triggerClient(player, "inventory:open", blocks, player.user.currentWeapon, player.user.hotkeys, player.user.entity.inventory_level)
    },
    getWeightItems: (items: ItemEntity[]) => {
        let weight = 0;
        items.map(item => {
            weight += getItemWeight(item.item_id, item.count)
        })
        return weight
    },
    getWeightInventoryMax: (owner_type: OWNER_TYPES, owner_id: number) => {
        if (owner_type === OWNER_TYPES.GANGWAR_CONTAINER) return 0;
        if (owner_type == OWNER_TYPES.BUSINESS) {
            let biz = business.get(owner_id);
            if (!biz) return 0;
            let lvl = business_stock_level[biz.upgrade];
            if (!lvl) lvl = business_stock_level[business_stock_level.length - 1]
            return lvl
        }
        if (owner_type == OWNER_TYPES.HOUSE) {
            let house = houses.get(owner_id);
            if (!house) return 0;
            let stockUpgrd = HOUSE_UPGRADE_LEVEL_COST[house.stock];
            if (!stockUpgrd) stockUpgrd = HOUSE_UPGRADE_LEVEL_COST[0]
            return (stockUpgrd.amount + HOUSE_DEFAULT_WEIGHT_KG) * 1000
        }
        if (owner_type == OWNER_TYPES.STOCK_SAFE) {
            let house = houses.get(owner_id);
            if (!house) return 0;
            return (HOUSE_CHEST_KG_DEFAULT + (house.haveChestLevel * HOUSE_CHEST_KG_PER_LEVEL)) * 1000;
        }
        if (owner_type >= OWNER_TYPES.STOCK_1 && owner_type <= OWNER_TYPES.STOCK_15) {
            let warehouse = warehouses.get(owner_id);
            if (warehouse) {
                return warehouse.getSlotWeightMax(owner_type - 4)
            }
        }
        if (owner_type == OWNER_TYPES.PLAYER) {
            const target = User.get(owner_id);
            if (target && target.user) return (target.user.entity.inventory_level * PLAYER_INVENTORY_KG_PER_LEVEL * 1000) + (PLAYER_DEFAULT_WEIGHT_KG * 1000)
            return PLAYER_DEFAULT_WEIGHT_KG * 1000
        }
        if (CONTAINERS_DATA.find(q => q.owner_type === owner_type)) {
            return CONTAINERS_DATA.find(q => q.owner_type === owner_type).max_size;
        }
        if ([OWNER_TYPES.FRACTION_VEHICLE, OWNER_TYPES.VEHICLE, OWNER_TYPES.VEHICLE_TEMP].includes(owner_type)) {
            let cfg: VehicleConfigsEntity;
            if (owner_type == OWNER_TYPES.VEHICLE) {
                const veh = Vehicle.get(owner_id);
                if (veh) cfg = veh.config
            } else {
                const veh = (owner_type === OWNER_TYPES.FRACTION_VEHICLE ? Vehicle.getByCarageCarId : Vehicle.getByTmpId)(owner_id);
                if (veh) cfg = Vehicle.getVehicleConfig(veh);
            }
            if (cfg) return cfg.stock * 1000
        }
        return 10000000
    },
    getInventoryNameAndDesc: (owner_type: OWNER_TYPES, owner_id: number, player: PlayerMp) => {
        if (owner_type == OWNER_TYPES.BUSINESS) {
            let biz = business.get(owner_id);
            if (biz) {
                return {
                    name: biz.name,
                    desc: "Хранилище продукции",
                }
            }
        } else if (owner_type == OWNER_TYPES.PLAYER && player.user.id == owner_id) {
            return {
                name: "Ваш инвентарь",
                desc: player.user.name,
            }
        } else if (owner_type == OWNER_TYPES.PLAYER) {
            return {
                name: player.user.getShowingNameString(owner_id),
                desc: `ID: ${owner_id}`,
            }
        } else if (owner_type == OWNER_TYPES.HOUSE && player.dimension) {
            let house = houses.get(owner_id);
            if (house) {
                return {
                    name: `Хранилище ${house.name} #${house.id}`,
                    desc: `LVL: ${house.stock}`,
                }
            }
        } else if (owner_type >= OWNER_TYPES.STOCK_1 && owner_type <= OWNER_TYPES.STOCK_15 && player.dimension) {
            let warehouse = warehouses.get(owner_id);
            if (warehouse) {
                const name = warehouse.getSlotName(owner_type - 4);
                return {
                    name: `Склад #${warehouse.id}`,
                    desc: `Контейнер: ${name}`,
                }
            }
        } else if (owner_type == OWNER_TYPES.STOCK_SAFE && player.dimension) {
            let house = houses.get(owner_id);
            if (house) {
                return {
                    name: `Склад ${house.name} #${house.id}`,
                    desc: `LVL: ${house.stock}`,
                }
            }
        } else if (owner_type == OWNER_TYPES.VEHICLE) {
            const veh = Vehicle.get(owner_id);
            if (veh) {
                const cfg = veh.config;
                if (cfg) {
                    return {
                        name: "Багажник " + cfg.name,
                        desc: veh.number ? veh.number : `ID: ${veh.id}`,
                    }
                }
            }
        } else if (owner_type == OWNER_TYPES.VEHICLE_TEMP) {
            const veh = Vehicle.getByTmpId(owner_id);
            if (veh) {
                const cfg = Vehicle.getVehicleConfig(veh);
                if (cfg) {
                    return {
                        name: "Багажник " + cfg.name,
                        desc: veh.numberPlate ? veh.numberPlate : `ID: ${owner_id}`,
                    }
                }
            }
        } else if (owner_type == OWNER_TYPES.FRACTION_VEHICLE) {
            const veh = Vehicle.toArray().find(veh => veh.garagecarid === owner_id);
            if (veh) {
                const cfg = Vehicle.getVehicleConfig(veh);
                return {
                    name: "Багажник " + (cfg ? cfg.name : veh.modelname),
                    desc: veh.numberPlate,
                }
            }
        } else if (CONTAINERS_DATA.find(q => q.owner_type === owner_type)) {
            const qs = inventory.getContainerData(owner_type, owner_id);
            const cfgname = getBaseItemNameById(qs.item_id);
            if (cfgname) {
                return {
                    name: cfgname,
                    desc: "#" + owner_id
                }
            }
        } else if (owner_type === OWNER_TYPES.MARKET_STOCK) {
            return {
                name: "Хранилище рынка",
                desc: "Предметы хранятся до 24 часов"
            }
        } else if (owner_type === OWNER_TYPES.FARM_STOCK) {
            return {
                name: "Фермерский склад",
                desc: "Семена и корм"
            }
        }
        return {
            name: "Хранилище",
            desc: "Номер " + owner_id
        }
    },
    getContainerData: (owner_type: OWNER_TYPES, owner_id: number, target_owner?: number, target_id?: number) => {
        const containers = CONTAINERS_DATA.filter(q => q.owner_type === owner_type)
        if (containers.length === 0) return null
        if (containers.length === 1) return containers[0]
        let res: any;
        containers.map(q => {
            if (res) return;
            const item = inventory.get(owner_id, target_owner, target_id)
            if (item) res = CONTAINERS_DATA.find(z => z.owner_type === owner_type && z.item_id === item.item_id)
        })
        return res;
    },
    getAllNearestInventory: (player: PlayerMp) => {
        const user = player.user
        let position = player.position;
        let dimension = player.dimension;
        let res: { owner_type: OWNER_TYPES, owner_id: number, have_access: boolean }[] = [];

        const marketStockInventory = getNearestMarketInventory(player);
        if (marketStockInventory) {
            res.push(marketStockInventory);
        }

        const farmStockInventory = FarmActivityStock.getNearestInventory(player);
        if (farmStockInventory) {
            res.push(farmStockInventory);
        }

        CONTAINERS_DATA.map(container => {
            user.getArrayItem(container.item_id).map(holder => {
                res.push({owner_type: container.owner_type, owner_id: holder.id, have_access: true});
            })
        })

        gangfight.list.forEach(item => {
            if (player.dimension === item.d && system.distanceToPos(player.position, item) < 5) res.push({
                owner_type: OWNER_TYPES.GANGWAR_CONTAINER,
                owner_id: item.id,
                have_access: item.factions.includes(user.fraction)
            });
        })

        mp.vehicles.forEachInRange(position, 5, vehicle => {
            if (vehicle.dimension !== dimension) return;
            if (Vehicle.getLocked(vehicle) && !Vehicle.hasAccessToVehicle(player, vehicle)) return;
            if (vehicle.garagecarid) {
                const garage = FractionGarage.get(vehicle.garage);
                if (garage) res.push({
                    owner_type: OWNER_TYPES.FRACTION_VEHICLE,
                    owner_id: vehicle.garagecarid,
                    have_access: !vehicle.locked && (!Vehicle.haveTruck(vehicle) || Vehicle.openTruckStatus(vehicle)) && (user.hasPermission('admin:garage:accessRemote') || (user.fraction === garage.fraction))
                });
            } else if (!vehicle.dbid) res.push({
                owner_type: OWNER_TYPES.VEHICLE_TEMP,
                owner_id: vehicle.inventoryTmp,
                have_access: Vehicle.openTruckStatus(vehicle)
            });
            else res.push({
                    owner_type: OWNER_TYPES.VEHICLE,
                    owner_id: vehicle.dbid,
                    have_access: Vehicle.openTruckStatus(vehicle)
                });
        })
        if (player.dimension > 0) {
            if (system.distanceToPos(player.position, new mp.Vector3(WAREHOUSE_SLOTS_POS[0][0], WAREHOUSE_SLOTS_POS[0][1], WAREHOUSE_SLOTS_POS[0][2])) < 20) {
                const warehouse = warehouses.get(player.dimension);
                if (warehouse) {
                    const haveAccess = inventory.haveAccess(player, OWNER_TYPES.STOCK_1, player.dimension)
                    WAREHOUSE_SLOTS_POS.map((item, index) => {
                        if (warehouse.chests[index]) {
                            const pos = new mp.Vector3(item[0], item[1], item[2]);
                            if (system.distanceToPos(player.position, pos) < 5) {
                                res.push({owner_type: 4 + index, owner_id: player.dimension, have_access: haveAccess});
                            }
                        }
                    })
                }
            }
            if (system.distanceToPos(player.position, HOUSE_STOCK_POS) < 5) {
                const house = houses.get(player.dimension);
                if (house && house.haveChest) {
                    let haveAccess = false;
                    if (player.user.isAdminNow(6)) haveAccess = true;
                    if (!house.key) haveAccess = true;
                    if (!haveAccess) haveAccess = !!inventory.getInventory(OWNER_TYPES.PLAYER, player.user.id).find(itm => itm.item_id == houses.key_id && itm.advancedNumber == house.key && itm.advancedString == "house_chest");
                    res.push({owner_type: OWNER_TYPES.STOCK_SAFE, owner_id: player.dimension, have_access: haveAccess});
                }
            }
            let isHouseStockPushed = false// Запрещаем открывать больше одного склада в инте (костыль для кастомных интов)
            interriors.map(int => {
                if (int.type === "garage") return;
                if (!int.stock) return;
                if (isHouseStockPushed) return;
                if (system.distanceToPos(player.position, int.stock) < 2) {
                    const house = houses.get(player.dimension);
                    if (!house || (!player.user.isAdminNow(3) && !isPlayerHasHouseKey(player, house))) return;
                    
                    res.push({owner_type: OWNER_TYPES.HOUSE, owner_id: player.dimension, have_access: true});
                    isHouseStockPushed = true;
                }
            })
        }
        User.getNearestPlayers(player, 3, true).filter(q => q.dimension === player.dimension && q.user).map(target => {
            res.push({
                owner_type: OWNER_TYPES.PLAYER,
                owner_id: target.dbid,
                have_access: inventory.haveAccess(player, OWNER_TYPES.PLAYER, target.dbid)
            });
        })
        res.map(data => {
            if (!data.have_access) return;
            inventory.getInventory(data.owner_type, data.owner_id).filter(item => getContainerByItemID(item.item_id)).map(item => {
                const cfg = getContainerByItemID(item.item_id);
                res.push({owner_type: cfg.owner_type, owner_id: item.id, have_access: true});
            })
        })
        return res
    },
    haveAccess: (player: PlayerMp, owner_type: OWNER_TYPES, owner_id: number) => {
        if (player.user.isAdminNow(6)) return true;
        if (owner_type == OWNER_TYPES.BUSINESS) {
            let biz = business.get(owner_id);
            if (biz) {
                return biz.userId == player.user.id;
            } else {
                return false
            }
        }
        if (owner_type == OWNER_TYPES.PLAYER) {
            if (owner_id === player.dbid) return true;
            const target = User.get(owner_id);
            if (!target) return false;
            if (!target.user.cuffed) return false;
            if (!player.user.is_police) return false;
        }
        if (owner_type == OWNER_TYPES.VEHICLE) {
            return Vehicle.openTruckStatus(Vehicle.get(owner_id).vehicle);
        }
        if (owner_type == OWNER_TYPES.VEHICLE_TEMP) {
            return Vehicle.openTruckStatus(Vehicle.getByTmpId(owner_id));
        }
        if (owner_type == OWNER_TYPES.FRACTION_VEHICLE) {
            const vehicle = Vehicle.getByCarageCarId(owner_id);
            const garage = FractionGarage.get(vehicle.garage);

            return !vehicle.locked
                && (!Vehicle.haveTruck(vehicle) || Vehicle.openTruckStatus(vehicle))
                && (player.user.hasPermission('admin:garage:accessRemote') || (player.user.fraction === garage.fraction));
        }
        if (owner_type == OWNER_TYPES.STOCK_SAFE) {
            const house = houses.get(owner_id);
            if (!house) return false;
            if (house.haveChest) {
                let haveAccess = false;
                if (player.user.isAdminNow(6)) haveAccess = true;
                if (!house.key) haveAccess = true;
                if (!haveAccess) haveAccess = !!inventory.getInventory(OWNER_TYPES.PLAYER, player.user.id).find(itm => itm.item_id == houses.key_id && itm.advancedNumber == house.key && itm.advancedString == "house_chest");
                return haveAccess
            }
        }
        if (owner_type >= OWNER_TYPES.STOCK_1 && owner_type <= OWNER_TYPES.STOCK_15) {
            let warehouse = warehouses.get(owner_id);
            if (warehouse) {
                let haveAccess = false;
                if (player.user.isAdminNow(6)) haveAccess = true;
                if (!haveAccess) haveAccess = !!inventory.getInventory(OWNER_TYPES.PLAYER, player.user.id).find(itm => itm.item_id == 805 && itm.advancedNumber == warehouse.key && itm.advancedString == "warehouse");
                return haveAccess
            }
        }
        if (owner_type == OWNER_TYPES.HOUSE) {
            return true;
        }
        return true
    },
    data: new Map<number, ItemEntity>(),
    inventory_blocks: new Map<string, ItemEntity[]>(),
    load: () => {
        return new Promise<void>((resolve, reject) => {
            let countRemoved = 0;
            console.time('Загрузка инвентаря завершена')
            inventory.inventory_blocks.set(`0_0`, [])
            ItemEntity.delete({owner_type: In([OWNER_TYPES.WORLD, OWNER_TYPES.TEMP, OWNER_TYPES.VEHICLE_TEMP])}).then((del) => {
                if (typeof del.affected === "number") countRemoved += del.affected;
                ItemEntity.delete({temp: 1}).then((del) => {
                    if (typeof del.affected === "number") countRemoved += del.affected;
                    ItemEntity.find().then(list => {
                        system.debug.info(`Загрузка инвентаря, количество предметов: ${list.length}`);
                        list.map(item => {
                            if (item.owner_type === OWNER_TYPES.PLAYER_TEMP) {
                                item.owner_type = OWNER_TYPES.PLAYER
                            }
                            if (item.temp == 1 || item.item_id === 863 || [OWNER_TYPES.TEMP, OWNER_TYPES.WORLD, OWNER_TYPES.VEHICLE_TEMP].includes(item.owner_type)) {
                                item.remove();
                                countRemoved++;
                            } else {
                                inventory.data.set(item.id, item);
                                insert_item_into_inventory(item)
                            }
                        })
                        system.debug.info('---------------')
                        console.timeEnd('Загрузка инвентаря завершена')
                        system.debug.info('Количество предметов', list.length)
                        system.debug.info('Количество удалённых предметов', countRemoved)
                        system.debug.info('---------------')
                        resolve()
                    })
                })
            })
        })
    },
    get: (id: number, owner_type?: number, owner_id?: number) => {
        if (typeof owner_type !== "number" || typeof owner_id !== "number") return inventory.data.get(id)
        let invBlock = inventory.getInventory(owner_type, owner_id);
        if (!invBlock) return inventory.data.get(id);
        return invBlock.find(q => q.id === id);
    },
    clearInventory: (owner_type: OWNER_TYPES, owner_id: number) => {
        if (!inventory.inventory_blocks.has(`${owner_type}_${owner_id}`)) inventory.inventory_blocks.set(`${owner_type}_${owner_id}`, []);
        else inventory.deleteItems(...inventory.inventory_blocks.get(`${owner_type}_${owner_id}`))
    },
    getInventory: (owner_type: OWNER_TYPES, owner_id: number) => {
        if (!inventory.inventory_blocks.has(`${owner_type}_${owner_id}`)) inventory.inventory_blocks.set(`${owner_type}_${owner_id}`, []);
        return inventory.inventory_blocks.get(`${owner_type}_${owner_id}`)
    },
    createItem: (param: Partial<ItemEntity>, notJoin = false): Promise<ItemEntity> => {
        return new Promise((resolve, reject) => {
            if (!param.item_id) return console.error(`inventory.createItem required param item_id`), reject(`inventory.createItem required param item_id`);
            if (!param.owner_type) return console.error(`inventory.createItem required param owner_type`), reject(`inventory.createItem required param owner_type`);
            if (!param.owner_id) return console.error(`inventory.createItem required param owner_id`), reject(`inventory.createItem required param owner_id`);

            if (typeof param.temp !== "number") param.temp = 0;
            let itmCfg = inventoryShared.get(param.item_id);
            if (!itmCfg) return console.error(`inventory.createItem item with id ${param.item_id} not found`), reject(`inventory.createItem item with id ${param.item_id} not found`);
            let count = 0;
            if (typeof param.count === "number") count = param.count;
            if (typeof param.count !== "number" && itmCfg.default_count) count = itmCfg.default_count;
            if (typeof count !== "number") return console.error(`inventory.createItem no param count and no default count param for item ${param.item_id}`), reject(`inventory.createItem no param count and no default count param for item ${param.item_id}`);
            if (itmCfg.need_group && param.owner_type != OWNER_TYPES.BUSINESS && !notJoin) {
                let allItems = inventory.getInventory(param.owner_type, param.owner_id);
                if (allItems) {
                    let targetItem = allItems.find(q => q.item_id == param.item_id && param.temp === q.temp);
                    if (targetItem) {
                        targetItem.count += count;
                        if (!targetItem.temp) targetItem.save();
                        return resolve(targetItem);
                    }
                }
            }
            let itm = new ItemEntity();
            itm.create = system.timestamp
            for (let name in param) {
                let val = param[name as keyof ItemEntity] as any;
                (itm as any)[name as any] = val;
            }
            itm.count = count;
            if (itm.item_id === 851 && !itm.advancedNumber) {
                const serial = generateFreeSimNumber();
                itm.advancedNumber = serial;
                itm.advancedString = `${Math.floor((itmCfg.defaultCost ? itmCfg.defaultCost : 100) / 2)}`;
                itm.serial = itm.serial + '_' + serial
            }


            if (itm.temp === 1) {
                itm.id = inventory.getTempId()
                inventory.data.set(itm.id, itm);
                insert_item_into_inventory(itm)
                if (param.owner_type === OWNER_TYPES.PLAYER) {
                    const target = User.get(param.owner_id);
                    if (target && target.user) {
                        target.user.questTick()
                        target.user.currentWeaponSync();
                        if (!target.user.entity.successItem.includes(itm.item_id)) {
                            const cfg = inventoryShared.get(itm.item_id)
                            if (cfg && cfg.helpDesc && cfg.helpIcon) {
                                target.user.entity.successItem = [...target.user.entity.successItem, itm.item_id];
                                CustomEvent.triggerCef(target, 'success:screen:showitem', itm.item_id);
                            }
                        }
                    }
                }
                resolve(itm);
            } else {
                saveEntity(itm).then(item => {
                    inventory.data.set(item.id, item);
                    insert_item_into_inventory(item)
                    Logs.insertInventoryLog(item, 0, param.owner_id, 'create', `create to ${param.owner_type}`)
                    if (param.owner_type === OWNER_TYPES.PLAYER) {
                        const target = User.get(param.owner_id);
                        if (target && target.user) {
                            target.user.questTick()
                            target.user.currentWeaponSync();
                            if (!target.user.entity.successItem.includes(item.item_id)) {
                                const cfg = inventoryShared.get(item.item_id)
                                if (cfg && cfg.helpDesc && cfg.helpIcon) {
                                    target.user.entity.successItem = [...target.user.entity.successItem, item.item_id];
                                    CustomEvent.triggerCef(target, 'success:screen:showitem', item.item_id);
                                }
                            }

                            if (param.item_id === houses.key_id) {
                                SendUpdate(target, 'houseKey');
                            }
                        }
                    }
                    resolve(item);
                }).catch(err => {
                    console.error(err);
                    reject(err);
                })
            }

        })
    },
    updateItemOwner: updateItemOwner,
    moveItemsOwner: (owner_type: OWNER_TYPES, owner_id: number, new_owner_type: OWNER_TYPES, new_owner_id: number) => {
        let oldInventory = inventory.getInventory(owner_type, owner_id);
        if (!oldInventory || oldInventory.length === 0) return;
        let newInventory = inventory.getInventory(new_owner_type, new_owner_id);
        if (newInventory && newInventory.length > 0) return;
        let savesList: ItemEntity[] = []
        let resItems: ItemEntity[] = []
        oldInventory.map(item => {
            item.owner_type = new_owner_type
            item.owner_id = new_owner_id
            if (!item.temp) savesList.push(item)
            resItems.push(item)
        })
        inventory.inventory_blocks.set(`${owner_type}_${owner_id}`, []);
        inventory.inventory_blocks.set(`${new_owner_type}_${new_owner_id}`, resItems);
        if (owner_type === OWNER_TYPES.PLAYER) {
            const target = User.get(owner_id);
            if (target && target.user) target.user.inventoryAttachSync()
        }
        if (new_owner_type === OWNER_TYPES.PLAYER) {
            const target = User.get(new_owner_id);
            if (target && target.user) target.user.inventoryAttachSync()
        }
        ItemEntity.save(savesList);
    }
}

function insert_item_into_inventory(item: ItemEntity) {
    if (inventory.inventory_blocks.has(`${item.owner_type}_${item.owner_id}`)) {
        inventory.inventory_blocks.get(`${item.owner_type}_${item.owner_id}`).push(item)
    } else {
        inventory.inventory_blocks.set(`${item.owner_type}_${item.owner_id}`, [item])
    }
}

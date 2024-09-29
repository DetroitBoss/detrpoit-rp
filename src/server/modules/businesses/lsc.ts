import {BusinessEntity} from "../typeorm/entities/business";
import {menu} from "../menu";
import {business, businessCatalogMenu, businessDefaultCostItem} from "../business";
import {CustomEvent} from "../custom.event";
import {VEHICLE_REPAIR_COST} from "../../../shared/economy";
import {BUSINESS_TYPE} from "../../../shared/business";
import {deliverSet, needUnload, orderDeliverMenu} from "./order.system";
import {
    buyUpgrades,
    convertModCostFromCarCost, getProfitFromTuningCost,
    LSC_PROFIT_PERCENT,
    LSC_VEHICLE_POS,
    LSC_WHEELS,
    lscBrakeUpgrades,
    lscEngineUpgrades,
    lscNumberUpgrades,
    lscSuspensionUpgrades,
    lscTintUpgrades,
    lscTransmissionUpgrades,
    lscXenonColorUpgrades, vehicleModItemBase, vehicleModsList
} from "../../../shared/lsc";
import {saveEntity} from "../typeorm";
import {system} from "../system";
import {PayType} from "../../../shared/pay";
import {canUserStartBizWar, createBizMenuBizWarItem, startBizWar} from "../bizwar";
import {setVehicleParamsByConfig, vehicleConfigs} from "../vehicles";
import {LscConfigEntity} from "../typeorm/entities/lscConfig";
import {writeClientRatingLog} from "./tablet";

// Массив с ID бизнесов, на которых идет тюнинг, нужен чтобы не тюнились на одной ЛСК 2 машины
const busyLscPoints = new Map<number, PlayerMp>()

export const lscConfig: vehicleModItemBase[] = []

export const getVehicleMod = (id: number) => {
    return lscConfig.find(q => q.id === id);
}

const updateModCost = async (modSlotId: number, newValue: number) => {
    lscConfig.find(c => c.id == modSlotId).cost = newValue

    const entityToUpdate = await LscConfigEntity.findOne({ slotId: modSlotId })
    entityToUpdate.cost = newValue

    await entityToUpdate.save()

    mp.players.forEach(p => CustomEvent.triggerClient(p, 'lsc:updateCost', modSlotId, newValue))
}

export const loadConfig = async () => {
    const vehiclesMods = await LscConfigEntity.find()

    if (!vehiclesMods.length) {
        vehicleModsList.forEach(modFromConfig => {
            const configToInsert = new LscConfigEntity()

            configToInsert.slotId = modFromConfig.id;
            configToInsert.name = modFromConfig.name;
            configToInsert.cost = modFromConfig.cost;
            configToInsert.default = modFromConfig.default ?? null;
            configToInsert.percent = modFromConfig.percent;
            configToInsert.isColor = modFromConfig.isColor;
            configToInsert.isColorMod = modFromConfig.isColorMod
            configToInsert.sector = modFromConfig.sector;
            configToInsert.isWheelType = modFromConfig.isWheelType;
            configToInsert.isWheelTypeValue = modFromConfig.isWheelTypeValue;
            configToInsert.level = modFromConfig.level;
            configToInsert.target = modFromConfig.target ?? 'all';

            configToInsert.save()
        })
    }

    vehiclesMods.forEach(modFromDb => {
        lscConfig.push({
            name: modFromDb.name,
            id: modFromDb.slotId,
            cost: modFromDb.cost,
            default: modFromDb.default,
            percent: modFromDb.percent,
            isColor: modFromDb.isColor,
            isColorMod: modFromDb.isColorMod,
            sector: modFromDb.sector,
            isWheelType: modFromDb.isWheelType,
            isWheelTypeValue: modFromDb.isWheelTypeValue,
            level: modFromDb.level as (0 | 1 | 2),
            target: modFromDb.target as ("car" | "bike" | "all")
        })
    })
}

CustomEvent.registerClient('admin:gamedata:lsc', player => {
    if (!player.user) return;
    if (!player.user.hasPermission('admin:gamedata:lsc')) return player.notify("У вас нет доступа", "success");
    openEditMenu(player)
})
const openEditMenu = (player: PlayerMp) => {
    let m = menu.new(player, "", "Конфиг ЛСК")
    lscConfig.forEach(modItem => {
        m.newItem({
            name: modItem.name,
            desc: `Текущая базовая стоимость ${modItem.cost}`,
            onpress: () => {
                menu.input(player, 'Введите цену', modItem.cost, 7, 'int').then(val => {
                    if (typeof val !== "number") return;
                    if (isNaN(val)) return;
                    if (val < 0) return;
                    if (val > 99999999) return;
                    updateModCost(modItem.id, val)
                    openEditMenu(player)
                })
            }
        })
    })
    m.open()
}

CustomEvent.registerClient('business:lsc:restoreCar', (player, carId: number) => {
    restore(carId);
});

CustomEvent.registerClient('lsc:restoreExit', (player, carId: number) => {
    restore(carId);
})

CustomEvent.registerCef('vehicle:lsc:repair', (player, shopId: number) => {
    const user = player.user;
    if(!user) return false;
    const veh = player.vehicle;
    if(!veh) return player.notify('Вы должны быть за рулём', 'error'), false;
    let shop = business.get(shopId);
    if (!shop) return player.notify("Некорректный бизнес", "error"), false;
    if (user.money < VEHICLE_REPAIR_COST) return player.notify('У вас недостаточно средств для оплаты' , 'error'), false;
    user.removeMoney(VEHICLE_REPAIR_COST, true, `Ремонт и обслуживание ТС`)
    player.vehicle.repair();

    setTimeout(() => {
        if (!mp.players.exists(player) || !mp.vehicles.exists(player.vehicle)) {
            return;
        }

        setVehicleParamsByConfig(player.vehicle);
    }, 500)
    business.addMoney(shop, VEHICLE_REPAIR_COST / 10, 'Ремонт ТС');
    player.user.achiev.setAchievTickBiz(shop.type, shop.sub_type, VEHICLE_REPAIR_COST)
    player.notify('ТС отремонтирован', 'success');
    writeClientRatingLog(player, shopId, VEHICLE_REPAIR_COST, "Ремонт ТС", 1);
    return true
})

const restore = (carId: number) => {
    const veh = mp.vehicles.at(carId);
    if (!veh) return;
    if (!veh.entity) return;
    // Vehicle.repair(veh, true)
    veh.entity.applyCustomization();
}

CustomEvent.registerCef('lsc:buyTuning', (player, shopId:number, carId: number, payType:PayType, pin:string, buyElementsJSON:string, buyWheelsType:number, buyWheelsID:number) => {
    if(!mp.players.exists(player) || !player.user) return true;
    const user = player.user;
    const vehicle = player.vehicle;
    const shop = business.get(shopId);

    if((!buyElementsJSON || !buyElementsJSON.length) && buyWheelsID == null && buyWheelsType == null) return true;
    let buyElements:buyUpgrades[] = JSON.parse(buyElementsJSON)
    if((!buyElements || !buyElements.length)  && buyWheelsID == null && buyWheelsType == null) return true;

    const check = () => {
        if(!mp.vehicles.at(carId)) return false;
        if(!vehicle || player.vehicle != mp.vehicles.at(carId)) return player.notify('Произошла ошибка тюнинга #LSCBT1, обратитесь к Администрации сервера'), false;
        if(!player.vehicle.entity) return player.notify('Данный автомобиль не подлежит тюнингу'), false;
        if (!player.user) return false;
        if(!shop) return player.notify('Произошла ошибка тюнинга #LSCBT2, обратитесь к Администрации сервера'), false;
        if (shop.type !== BUSINESS_TYPE.TUNING) return player.notify("Произошла ошибка тюнинга #LSCBT3, обратитесь к Администрации сервера", "error"), false;
        return true;
    }
    if (!check()) {
        exitLsc(player, shopId, carId, true)
        return true;
    }

    const vehEntity = vehicle.entity
    let vehicleCost = vehEntity ? vehEntity.sellSumMoney : 2000000
    if (vehicleCost == 0) vehicleCost = vehicle.entity.config.cost;
    let tuningData:[number,number][] = []
    let primaryColor:[number,number,number] = null
    let secondaryColor:[number,number,number] = null
    let neonColor:[number,number,number] = null
    let tyreSmokeColor:[number,number,number] = null

    let tuningCostBeforeBuyElementIteration = 0
    let tuningCost = 0
    let tuningToShopCost = 0
    let totalComponentsPurchasePriceRaw = 0;

    buyElements.map(async element => {
        const mod = getVehicleMod(element.id)
        if(!mod) return;
        const bizItem = shop.catalog.find(i => i.item == mod.id)
        totalComponentsPurchasePriceRaw += bizItem.count ? businessDefaultCostItem(shop, bizItem.item) : 0;

        if(mod.id == 55) tuningCost += convertModCostFromCarCost(lscTintUpgrades.find(t => t.value == element.selectedElementID)?.percent + bizItem.price || mod.percent + bizItem.price, vehicleCost)
        // else if(mod.id == 16) tuningCost += convertModCostFromCarCost(lscArmourUpgrades.find(t => t.value == element.selectedElementID)?.cost || mod.cost, vehicleCost)
        else if(mod.id == 15) tuningCost += convertModCostFromCarCost(lscSuspensionUpgrades.find(t => t.value == element.selectedElementID)?.percent + bizItem.price || mod.percent + bizItem.price, vehicleCost)
        else if(mod.id == 13) tuningCost += convertModCostFromCarCost(lscTransmissionUpgrades.find(t => t.value == element.selectedElementID)?.percent + bizItem.price || mod.percent + bizItem.price, vehicleCost)
        else if(mod.id == 12) tuningCost += convertModCostFromCarCost(lscBrakeUpgrades.find(t => t.value == element.selectedElementID)?.percent + bizItem.price || mod.percent + bizItem.price, vehicleCost)
        else if(mod.id == 1007) tuningCost += convertModCostFromCarCost(lscNumberUpgrades.find(t => t.value == element.selectedElementID)?.percent + bizItem.price || mod.percent + bizItem.price, vehicleCost)
        else if(mod.id == 1008) tuningCost += convertModCostFromCarCost(lscXenonColorUpgrades.find(t => t.value == element.selectedElementID)?.percent + bizItem.price || mod.percent + bizItem.price, vehicleCost)
        else if(mod.id == 11) tuningCost += convertModCostFromCarCost(lscEngineUpgrades.find(t => t.value == element.selectedElementID)?.percent + bizItem.price || mod.percent + bizItem.price, vehicleCost)
        else tuningCost += element.selectedElementID == -1 && !element.color && !element.colorMod ? convertModCostFromCarCost(bizItem.price / 2, vehicleCost) : convertModCostFromCarCost(bizItem.price, vehicleCost)

        if (shop.upgrade > 0) {
            tuningToShopCost += bizItem.count ? mod.cost - (mod.cost * (shop.upgrade * 10 / 100)) : 0;
        }else{
            tuningToShopCost += bizItem.count ? mod.cost : 0;
        }

        if(mod.id == 1000) {
            if(element.color) primaryColor = element.color
            if(element.colorMod) tuningData.push([1005, element.colorMod])
        }
        else if(mod.id == 1001) {
            if(element.color) secondaryColor = element.color
            if(element.colorMod) tuningData.push([1006, element.colorMod])
        }
        else if(mod.id == 4004) {
            if(element.color) neonColor = element.color
        }
        else if(mod.id == 3002) {
            if(element.color) tyreSmokeColor = element.color
        }
        else tuningData.push([mod.id, element.selectedElementID])

        await writeClientRatingLog(
            player,
            shopId,
            tuningCost - tuningCostBeforeBuyElementIteration,
            mod.name,
            1
        );
        tuningCostBeforeBuyElementIteration = tuningCost
    })

    if (buyWheelsID != -500) {
        const bizItem = shop.catalog.find(i => i.item == 62)
        // player.notify(`type: ${buyWheelsType}, cost: ${LSC_WHEELS.find(w => w.type == buyWheelsType)?.cost || 0}, applier: ${applier}, veh: ${vehicleCost}`)
        const wheelMod = LSC_WHEELS.find(w => w.type == buyWheelsType)
        tuningCost += convertModCostFromCarCost(wheelMod?.percent || 5000, vehicleCost)
        tuningToShopCost += bizItem && bizItem.count > 0 ? (getVehicleMod(62) ? getVehicleMod(62).cost : (1350)) : 0
    }
    if(!tuningData.length && !primaryColor && !secondaryColor && !neonColor && !tyreSmokeColor && buyWheelsID == null && buyWheelsType == null) return true;
    if(!tuningCost) return true;
    // if(tuningToShopCost > tuningCost) tuningToShopCost = tuningCost;
    tuningToShopCost += getProfitFromTuningCost(tuningCost)



    if (payType == PayType.CASH) {
        if (user.money < tuningCost) {
            return player.notify("У вас недостаточно средств", 'error'), true
        }
        user.removeMoney(tuningCost, true, 'Ремонт и обслуживание ТС')
    }
    else if (payType == PayType.CARD) {
        if (!user.verifyBankCardPay(pin)) {
            return player.notify(`Либо вы ввели неверный пин-код, либо у вас нет при себе банковской карты`, 'error'), true
        }
        if (!user.tryRemoveBankMoney(tuningCost, true, 'Ремонт и обслуживание ТС', `#${shop.id} ${shop.name}`)) return false;
    }
    else {
        system.debug.error('[ЛСК] Попытка использовать несуществующий тип оплаты')
        return true
    }

    const totalComponentsPurchasePrice = totalComponentsPurchasePriceRaw - (totalComponentsPurchasePriceRaw / 100 * (shop.upgrade * 10))

    let totalTuningIncome = totalComponentsPurchasePrice + tuningCost * 0.2
    if (totalTuningIncome < totalComponentsPurchasePrice)
        totalTuningIncome = totalComponentsPurchasePrice + tuningCost * 0.9

    business.addMoney(shop, totalTuningIncome, `Тюнинг ТС [${player.user.id}]`, false, false, true,
        true, totalComponentsPurchasePriceRaw, getProfitFromTuningCost(tuningCost));
    player.user.achiev.setAchievTickBiz(shop.type, shop.sub_type, tuningCost)

    buyElements.map(element => {
        const mod = getVehicleMod(element.id)
        if (!mod) return;
        const conf = shop.catalog.find(q => q.item == mod.id);
        if (conf && conf.count > 0) shop.setItemCountByItemId(conf.item, conf.count - 1)
    })

    if(buyWheelsID != -500) {
        const conf = shop.catalog.find(q => q.item == 62);
        if (conf && conf.count > 0) shop.setItemCountByItemId(conf.item, conf.count - 1)
    }
    
    let currentTuning = vehEntity.data.tuning
    if(buyWheelsType != -500) {
        let ind = currentTuning.findIndex(d => d[0] == 2999)

        if(ind != -1) currentTuning[ind][1] = buyWheelsType
        else currentTuning.push([2999, buyWheelsType])
    }
    if(buyWheelsID != -500) {
        let ind = currentTuning.findIndex(d => d[0] == 62)

        if(ind != -1) currentTuning[ind][1] = buyWheelsID
        else currentTuning.push([62, buyWheelsID])
    }
    for(let i = 0, l = tuningData.length; i<l; i++) {
        let ind = currentTuning.findIndex(d => d[0] == tuningData[i][0])

        if(ind != -1) currentTuning[ind][1] = tuningData[i][1]
        else currentTuning.push(tuningData[i])
    }

    vehEntity.data.tuning = currentTuning
    if(primaryColor) vehEntity.data.color_primary = JSON.stringify([primaryColor[0], primaryColor[1], primaryColor[2]])
    if(secondaryColor) vehEntity.data.color_secondary = JSON.stringify([secondaryColor[0], secondaryColor[1], secondaryColor[2]])
    if(neonColor) vehEntity.data.color_neon = JSON.stringify([neonColor[0], neonColor[1], neonColor[2]])
    if(tyreSmokeColor) vehEntity.data.color_tyre_smoke = JSON.stringify([tyreSmokeColor[0], tyreSmokeColor[1], tyreSmokeColor[2]])
    saveEntity(vehEntity.data)
    restore(carId)
    user.teleportVeh(shop.positions[1].x, shop.positions[1].y, shop.positions[1].z, shop.positions[1].h, 0)
    return false;
})

CustomEvent.registerClient('lsc:release', (player, shopId: number) => {
    busyLscPoints.delete(shopId)
})

CustomEvent.registerClient('lsc:exit', (player, shopId, carId, healthed:boolean) => {
    exitLsc(player, shopId, carId, healthed)
})

export const exitLsc = (player: PlayerMp, shopId: number, carId: number, healthed: boolean) => {
    if(!mp.players.exists(player) || !player.user) return;

    const vehicle = player.vehicle;
    const shop = business.get(shopId);
    busyLscPoints.delete(shop.id)

    if(!shop) return player.notify('Произошла ошибка тюнинга #LSCE2, обратитесь к Администрации сервера');
    if (shop.type !== BUSINESS_TYPE.TUNING) return player.notify("Произошла ошибка тюнинга #LSCE3, обратитесь к Администрации сервера", "error");

    if(!mp.vehicles.at(carId) || !vehicle || player.vehicle != mp.vehicles.at(carId)) {
        player.user.teleport(shop.positions[1].x, shop.positions[1].y, shop.positions[1].z, shop.positions[1].h, 0)
    }
    else {
        if(healthed) restore(carId)
        player.user.teleportVeh(shop.positions[1].x, shop.positions[1].y, shop.positions[1].z, shop.positions[1].h, 0)
    }
}

export function checkVehicleTuningAvailable(player: PlayerMp, vehicle: VehicleMp): boolean {
    const carId = vehicle.id
    const user = player.user

    if(!vehicle || vehicle.id != carId) {
        player.notify("Вы должны быть в ТС", "error");
        return false;
    }
    if (!user.isDriver) {
        player.notify("Вы должны быть за рулём", "error")
        return false
    }
    if(vehicle.getOccupants().length > 1) {
        player.notify("В транспорте не должно быть пассажиров", "error")
        return false
    }
    if((!vehicle.entity || !vehicle.entity.data) && !user.isAdminNow()) {
        player.notify("Данный ТС недоступен для тюнинга", "error");
        return false
    }
    if (!user.isAdminNow() && ((vehicle.entity.owner && vehicle.entity.owner !== user.id) || (vehicle.entity.familyOwner && vehicle.entity.familyOwner !== user.familyId))){
        user.notify("ТС, который вы тюнингуете, должен принадлежать Вам.", "error", "CHAR_TOM");
        return false
    }
    return true
}


export const openLscBuyMenu = (player: PlayerMp, item: BusinessEntity) => {
    const user = player.user
    const vehicle = player.vehicle
    if (!vehicle) return player.notify('Вы должны быть в ТС')
    const carId = vehicle.id

    if (!checkVehicleTuningAvailable(player, vehicle)) return;

    if (busyLscPoints.has(item.id) && mp.players.exists(busyLscPoints.get(item.id))) return;
    //user.teleportVeh(LSC_VEHICLE_POS.x, LSC_VEHICLE_POS.y, LSC_VEHICLE_POS.z, LSC_VEHICLE_POS.h)
    if (!checkVehicleTuningAvailable(player, vehicle)) {
        if(player) exitLsc(player, item.id, carId, false)
        return;
    }
    let vehicleCost = (vehicle && vehicle.entity) ? vehicle.entity.sellSumMoney : 0
    if (vehicleCost == 0) vehicleCost = vehicle.entity.config.cost;

    busyLscPoints.set(item.id, player)
    CustomEvent.triggerClient(player, "business:lsc:open", item.id, vehicleCost, vehicle.entity?.data?.tuning || [], item.catalog)
}

export const lscMenu = (player: PlayerMp, item: BusinessEntity) => {
    if (!player.user) return;
    const user = player.user;
    if (!user.isAdminNow(6) && item.userId !== user.id && !needUnload(player, item) && !canUserStartBizWar(user))
        return player.notify('У вас нет доступа к управлению бизнесом', 'error')
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
            m.title = 'LSC'
            break;
    }
    m.sprite = sprite as any;

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
                    lscMenu(player, item)
                }, true)
            }
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
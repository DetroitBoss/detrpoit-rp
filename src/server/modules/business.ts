import "./businesses/lsc.chip";
import {BusinessEntity, BusinessHistoryEntity} from "./typeorm/entities/business"
import {colshapes} from "./checkpoints"
import {menu} from "./menu"
import {system} from "./system"
import {CustomEvent} from "./custom.event"
import {inventory} from "./inventory"
import {ELECTRO_SHOP_ITEMS, getBaseItemNameById, inventoryShared, ITEM_TYPE, OWNER_TYPES} from "../../shared/inventory"
import {User} from "./user"
import {
    bankMaxPercent,
    bankPercentDefault,
    bankPercentMoneyReceive,
    BUSINESS_UPGRADE_DATA,
    SELL_GOS_TAX_PERCENT,
    shopFineWhenNoItems
} from "../../shared/economy"
import {randomArrayElement} from "../../shared/arrays"
import {shopMenu} from "./businesses/shop"
import {bankMenu} from "./businesses/bank"
import {autosalonMenu} from "./businesses/autosalon"
import {dressMenu} from "./businesses/dressShop"
import {tattooMenu} from "./businesses/tattoo"
import {fuelTypeNames} from "../../shared/vehicles"
import {getVehicleMod, lscConfig, lscMenu, openLscBuyMenu} from "./businesses/lsc"
import {Vehicle, vehicleConfigs} from "./vehicles"
import {
    CASH_GRAB_BIZ_DIST,
    CASH_GRAB_MANY,
    CASH_GRAB_MIN_ONLINE,
    CASH_GRAB_PED_SCARE_TIME,
    CASH_RESTORE_HOURS,
    CASH_SUM_REVARD
} from "../../shared/cash.machines"
import {
    BUSINESS_BUY_LEVEL, BUSINESS_GOV_PERCENT,
    BUSINESS_SUBTYPE_NAMES,
    BUSINESS_TYPE,
    BUSINESS_TYPE_NAMES,
    getFuelCost,
    npcBusiness
} from "../../shared/business"
import './businesses/order.system'
import {parkingMenu} from "./businesses/parking"
import {azsMenuBase} from "./businesses/fuel"
import {FACTION_ID} from "../../shared/fractions"
import {barberMenu} from "./businesses/barber";
import {barberCatalogBase, BarberCatalogNames, BarberShopCost} from "../../shared/barbershop";
import {dress} from "./customization";
import {tattoosShared} from "../../shared/tattoos";
import {getBusinessBlip} from "../../shared/blips";
import {BUSINESS_BUY_NEED_LICENSE} from "../../shared/licence";
import {MARKERS_SETTINGS} from "../../shared/markers.settings";
import {Dispatch} from "./dispatch";
import {saveEntity} from "./typeorm";
import {CAR_WASH_ITEM_COST, CAR_WASH_ITEM_COUNT_DEFAULT, CAR_WASH_ITEM_COUNT_MAX_DEFAULT} from "../../shared/carwash";
import {openWashBuyMenu, washMenu} from "./businesses/carwash";
import {Family} from "./families/family";
import {FamilyContractList, FamilyReputationType} from "../../shared/family";
import {openLscChipMenu} from "./businesses/lsc.chip";
import {writeSpecialLog} from "./specialLogs";
import {MoneyChestClass} from "./money.chest";
import {fractionCfg} from "./fractions/main";
import { getX2Param } from "./usermodule/static";

CustomEvent.registerClient('admin:gamedata:createbiz', player => {
    business.createBiz(player);
})

let grabPos: { x: number, y: number, z: number }[] = [];
let alertPos: { x: number, y: number }[] = [];
const alreadyGrabbed = (x: number, y: number) => {
    return system.isPointInPoints({x, y}, grabPos, CASH_GRAB_MANY ? 1 : CASH_GRAB_BIZ_DIST);
}

const alreadyAlerted = (x: number, y: number) => {
    return system.isPointInPoints({x, y}, alertPos, CASH_GRAB_BIZ_DIST);
}

CustomEvent.registerClient('cash:mashine:grab:status', (player, x: number, y: number, z: number) => {
    const user = player.user;
    if (!user) return;
    if (!user.fractionData?.gang && !user.fractionData?.mafia) return {err: true, text: "Вы не можете грабить кассы"}
    if (user.is_gos) return {err: true, text: 'Организация, в которой вы состоите, не позволяет Вам грабить кассы'}
    if (player.dimension) return {err: true, text: "Тут грабить нельзя"}
    if (alreadyGrabbed(x, y)) return {err: true, text: "Касса уже ограблена"}
    let biz = business.data.find(q => system.distanceToPos(q.positions[0], {x, y, z}) < CASH_GRAB_BIZ_DIST);
    if (!biz) return {err: true, text: "Касса не обслуживается, поэтому пустая"}
    if (!alreadyAlerted(x, y)) {
        Dispatch.new([FACTION_ID.LSPD, FACTION_ID.SHERIFF], `Ограбление кассы ${biz.name} #${biz.id}`, {x, y});
        alertPos.push({x, y})
        setTimeout(() => {
            const index = alertPos.findIndex(q => q.x === x && q.y === y)
            if (index > -1) alertPos.splice(index, 1)
        }, 240000)
    }
    return {}
})

CustomEvent.registerClient('cash:mashine:grab:success', (player, x: number, y: number, z: number) => {
    const user = player.user;
    if (!user) return;
    if (!user.fractionData?.gang && !user.fractionData?.mafia)
        return player.notify("Вы не можете грабить эту кассу", "error")
    if (user.is_gos) return player.notify('Организация, в которой вы состоите, не позволяет Вам грабить кассы', 'error')
    if (mp.players.length < CASH_GRAB_MIN_ONLINE) {
        if (!getX2Param('testserver')) {
            return player.notify(`Грабить кассы можно только когда есть минимум ${CASH_GRAB_MIN_ONLINE} игроков онлайн`, "error")
        } else {
            player.notify(`Система отработала проверку на онлайн в ${CASH_GRAB_MIN_ONLINE} игроков, но продолжила работу, поскольку это тестовый сервер`);
        }
    }
    if (alreadyGrabbed(x, y)) return player.notify("Касса уже ограблена", "error")
    let biz = business.data.find(q => system.distanceToPos(q.positions[0], {x, y, z}) < 10);
    if (!biz) return player.notify("Касса пустая", "error");
    if (!user.grab_money_shop) player.notify('Доставьте награбленную сумму в сейф', 'success');
    const totalReward = typeof CASH_SUM_REVARD === "number" ? CASH_SUM_REVARD : system.getRandomInt(CASH_SUM_REVARD[0], CASH_SUM_REVARD[1]);
    user.grab_money_shop += totalReward;
    player.user.family.addContractValueIfExists(FamilyContractList.robbers, totalReward);
    grabPos.push({x, y, z});
    if (CASH_RESTORE_HOURS) {
        setTimeout(() => {
            const index = grabPos.findIndex(q => q.x === x && q.y === y && q.z === z)
            if (index > -1) grabPos.splice(index, 1)
        }, CASH_RESTORE_HOURS * 60 * 60000);
    }
    let ped = mp.peds.toArray().find(ped => ped.dimension === player.dimension && system.isPointInPoints(ped.position, biz.positions, 5));
    if (!ped) return;
    setTimeout(() => {
        if (!ped) return;
        if (!mp.peds.exists(ped)) return;
        let current = Number(ped.getVariable("grabScared"));
        if (!current) return;
        ped.setVariable("grabScared", current - 1);
    }, CASH_GRAB_PED_SCARE_TIME * 60000)
    if (!mp.peds.exists(ped)) return;
    let current = Number(ped.getVariable("grabScared"));
    ped.setVariable("grabScared", current + 1);
})


setTimeout(() => {
    system.createBlip(535, 67, business.BusinessStreetPos[0], 'Arcadius - Бизнес Центр')
}, 100)


setInterval(() => {
    business.saveAllWait();
}, 120000)

export const business = {
    BanksNames: BUSINESS_SUBTYPE_NAMES[0],
    BusinessOfficePos: <[Vector3Mp, number]>[new mp.Vector3(-140.7121, -617.3683, 167.8204), 183],
    BusinessMotorPos: <[Vector3Mp, number]>[new mp.Vector3(-138.6593, -592.6267, 166.0002), 73],
    BusinessStreetPos: <[Vector3Mp, number]>[new mp.Vector3(-116.8427, -604.7336, 35.28074), 250],
    BusinessGaragePos: <[Vector3Mp, number]>[new mp.Vector3(-155.6696, -577.3766, 31.42448), 164],
    BusinessRoofPos: <[Vector3Mp, number]>[new mp.Vector3(-136.6686, -596.3055, 205.9157), 250],
    BusinessMenuPos: new mp.Vector3(-139.2922, -631.5964, 167.8204),
    data: <BusinessEntity[]>[],
    dataEntity: new Map<number, { destroy: () => void }[]>(),
    saveAll: () => {
        business.data.map(item => {
            item.save()
        });
    },
    saveAllWait: () => {
        const list = business.data.filter(q => q.mark_for_save).map(q => {
            q.mark_for_save = false;
            return q
        });
        if (list.length == 0) return;
        BusinessEntity.save(list);
    },
    getAllBanks: () => {
        return business.data.filter(q => q.type == BUSINESS_TYPE.BANK)
    },
    /** Получить бизнес по ID */
    get: (id: number) => {
        return business.data.find(b => b.id === id)
    },
    /** Получить бизнес по ID владельца */
    getByOwner: (id: number | PlayerMp) => {
        if (typeof id !== "number") {
            if (!mp.players.exists(id)) return;
            if (!id.user) return;
            if (!id.user.id) return;
        }
        return business.data.find(b => b.userId === (typeof id === "number" ? id : id.user.id))
    },
    load: () => {
        return new Promise((resolve, reject) => {
            BusinessEntity.find().then(async (items) => {
                items.map(item => business.loadItem(item));
                resolve(true)
            })
        })
    },
    delete: (id: number | BusinessEntity) => {
        let item = typeof id === "number" ? business.get(id) : id;
        business.dataEntity.get(item.id).map(q => {
            try {
                q.destroy();
            } catch (error) {
                console.error(error);
            }
        })
        if (business.data.findIndex(q => q.id == item.id) > -1) business.data.splice(business.data.findIndex(q => q.id == item.id), 1);
        item.remove();
    },
    fixCatalog: (item: BusinessEntity) => {
        const catalog = [...item.catalog];
        const mult = item.multiple_price;
        catalog.map(itemC => {
            if (itemC.count < 0) itemC.count = 0;
            if (!itemC.count) itemC.count = 0;
            if (typeof itemC.max_count !== "number") itemC.max_count = itemC.count
            if (item.userId && !item.donate) {
                const max = businessDefaultCostItem(item, itemC.item) * mult;
                if (max) {
                    itemC.price = Math.min(itemC.price, max);
                    if (!itemC.price) itemC.price = max;
                    if (itemC.price && itemC.price > max) itemC.price = max;
                }
            }
        })
        item.catalog = [...catalog];
    },
    loadItem: (item: BusinessEntity) => {
        Vehicle.addBlockNpcCarZone(new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z))
        ////////////////////////////
        // Возврат резервных средств
        item.money += item.reserve_money;
        item.reserve_money = 0;
        let entities: { destroy: () => void }[] = []
        const blipdata = getBusinessBlip(item.type, item.sub_type)
        const blip = system.createBlip(blipdata ? blipdata.blip : 1, blipdata ? blipdata.color : 1, new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z), `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`, item.dimension)
        if (blipdata && blipdata.scale) blip.scale = blip.scale * blipdata.scale;
        entities.push(blip)
        if (item.type == BUSINESS_TYPE.BANK) {
            item.positions.map(pos => {
                entities.push(colshapes.new(new mp.Vector3(pos.x, pos.y, pos.z), () => {
                    return `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]} #${item.id}`
                }, player => {
                    bankMenu(player, item)
                }, {
                    dimension: item.dimension
                }))
            })
        } else if (item.type == BUSINESS_TYPE.FUEL) {
            const object = mp.objects.new('prop_electrokolonka', new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z + 1), {
                rotation: new mp.Vector3(0.0, .0, item.positions[0].h),
                dimension: item.dimension
            })
            entities.push(object)
            entities.push(colshapes.new(new mp.Vector3(item.positions[1].x, item.positions[1].y, item.positions[1].z), `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`, player => {
                azsMenuBase(player, item, true)
            }, {
                radius: 4,
                color: [0, 0, 0, 0],
                dimension: item.dimension
            }))
            item.positions.map((q, qi) => {
                if (qi <= 1) return;
                entities.push(colshapes.new(new mp.Vector3(q.x, q.y, q.z), `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`, player => {
                    azsMenuBase(player, item, false)
                }, {
                    radius: 4,
                    color: [0, 0, 0, 0],
                    dimension: item.dimension
                }))
            })
            const l = [...item.catalog]
            l.map(item => {
                if (!item.item) item.item = 0
            })
            item.catalog = l;


        } else if (item.type == BUSINESS_TYPE.TUNING) {

            let catalog = [...item.catalog];

            let shouldUpdateCatalog = false
            catalog.forEach(el => {
                if (el.price > 1) {
                    console.log(el.item)
                    shouldUpdateCatalog = true
                    el.price = lscConfig.find(c => c.id == el.item)?.percent ?? 0.1
                }
            })

            lscConfig.map(mod => {
                if (mod.level > item.upgrade) return;
                if (!item.catalog.find(q => q.item === mod.id)) {
                    catalog.push({item: mod.id, count: 5, price: mod.percent, max_count: 20});
                }
            })
            if (catalog.length != item.catalog.length || shouldUpdateCatalog) {
                item.catalog = catalog;
                item.save()
            }

            if (item.sub_type === 1) {
                entities.push(colshapes.new(new mp.Vector3(item.positions[1].x, item.positions[1].y, item.positions[1].z), `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`, player => {
                    openLscChipMenu(player, item);
                }, {
                    type: 27, radius: 5, color: [255, 0, 0, 200],
                    dimension: item.dimension
                }))
            } else {
                entities.push(colshapes.new(new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z), `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`, player => {
                    lscMenu(player, item)
                }, {
                    drawStaticName: 'scaleform',
                    dimension: item.dimension
                }))
                entities.push(colshapes.new(new mp.Vector3(item.positions[1].x, item.positions[1].y, item.positions[1].z), `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`, player => {
                    openLscBuyMenu(player, item)
                }, {type: 27, radius: 5, color: [255, 0, 0, 200], dimension: item.dimension}))
            }
        } else if (item.type == BUSINESS_TYPE.WASH) {

            if (item.catalog.length === 0) {
                item.catalog = [{
                    item: 0,
                    price: CAR_WASH_ITEM_COST,
                    count: CAR_WASH_ITEM_COUNT_DEFAULT,
                    max_count: CAR_WASH_ITEM_COUNT_MAX_DEFAULT
                }];
            }

            entities.push(colshapes.new(new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z), `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`, player => {
                washMenu(player, item)
            }, {
                drawStaticName: 'scaleform',
                dimension: item.dimension
            }))
            entities.push(colshapes.new(new mp.Vector3(item.positions[1].x, item.positions[1].y, item.positions[1].z), `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`, player => {
                openWashBuyMenu(player, item)
            }, {type: 27, radius: 5, color: [255, 0, 0, 200], dimension: item.dimension}))

        } else if (item.type == BUSINESS_TYPE.PARKING) {

            entities.push(colshapes.new(new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z), `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`, player => {
                parkingMenu(player, item)
            }, {type: 27, radius: 3, color: [0, 0, 120, 200], drawStaticName: 'scaleform', dimension: item.dimension}))


        } else if (item.type == BUSINESS_TYPE.VEHICLE_SHOP) {
            entities.push(colshapes.new(new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z), item.name, player => {
                autosalonMenu(player, item)
            }, {
                drawStaticName: 'scaleform',
                radius: 2.5,
                dimension: item.dimension
            }))
        } else if (item.type == BUSINESS_TYPE.ITEM_SHOP) {

            let model = randomArrayElement(npcBusiness.ITEM[item.sub_type])

            entities.push(system.createPed(new mp.Vector3(item.positions[1].x, item.positions[1].y, item.positions[1].z), item.positions[1].h, model, true, true, item.dimension))
            entities.push(colshapes.new(new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z), () => {
                return item.name
            }, player => {
                shopMenu(player, item)
            }, {
                radius: MARKERS_SETTINGS.ITEMS.r,
                color: MARKERS_SETTINGS.ITEMS.color,
                dimension: item.dimension
            }))
        } else if (item.type == BUSINESS_TYPE.BAR) {
            let model = randomArrayElement(npcBusiness.BAR[item.sub_type])
            entities.push(system.createPed(new mp.Vector3(item.positions[1].x, item.positions[1].y, item.positions[1].z), item.positions[1].h, model, true, true, item.dimension))
            entities.push(colshapes.new(new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z), () => {
                return item.name
            }, player => {
                shopMenu(player, item)
            }, {
                radius: MARKERS_SETTINGS.BAR.r,
                color: MARKERS_SETTINGS.BAR.color,
                dimension: item.dimension
            }))
        } else if (item.type == BUSINESS_TYPE.BARBER) {
            if (item.catalog.length === 0) {
                item.catalog = barberCatalogBase
                item.mark_for_save = true
            }
            let model = randomArrayElement(npcBusiness.BARBER[item.sub_type])
            entities.push(system.createPed(new mp.Vector3(item.positions[1].x, item.positions[1].y, item.positions[1].z), item.positions[1].h, model, true, true, item.dimension))
            entities.push(colshapes.new(new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z), () => {
                return item.name
            }, player => {
                barberMenu(player, item)
            }, {
                radius: MARKERS_SETTINGS.BARBER.r,
                color: MARKERS_SETTINGS.BARBER.color,
                dimension: item.dimension
            }))
        } else if (item.type == BUSINESS_TYPE.TATTOO_SALON) {
            let model = randomArrayElement(npcBusiness.TATTOO[item.sub_type])

            entities.push(system.createPed(new mp.Vector3(item.positions[1].x, item.positions[1].y, item.positions[1].z), item.positions[1].h, model, true, true, item.dimension))
            entities.push(colshapes.new(new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z), () => {
                return item.name
            }, player => {
                tattooMenu(player, item)
            }, {
                radius: MARKERS_SETTINGS.TATTOO.r,
                color: MARKERS_SETTINGS.TATTOO.color,
                dimension: item.dimension
            }))
        } else if (item.type == BUSINESS_TYPE.DRESS_SHOP) {

            let model = randomArrayElement(npcBusiness.DRESS[item.sub_type])

            entities.push(system.createPed(new mp.Vector3(item.positions[1].x, item.positions[1].y, item.positions[1].z), item.positions[1].h, model, true, true, item.dimension))
            entities.push(colshapes.new(new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z), () => {
                return item.name
            }, player => {
                dressMenu(player, item)
            }, {
                radius: MARKERS_SETTINGS.DRESS.r,
                color: MARKERS_SETTINGS.DRESS.color,
                dimension: item.dimension
            }))
        }
        business.data.push(item);
        business.dataEntity.set(item.id, entities)

        ////////////////////////////
        // Восстановление параметров каталога
        business.fixCatalog(item);
        ///////////////////////////
    },
    setOwner: async (id: number | BusinessEntity, owner: PlayerMp | number) => {
        let businessEntity = typeof id === "number" ? business.get(id) : id;
        if (!businessEntity) return;

        if (!businessEntity.userId) {
            businessEntity.tax = 0;
            businessEntity.money = 0;
            businessEntity.reserve_money = 0;
        }

        if (!owner && businessEntity.type !== BUSINESS_TYPE.PARKING) businessEntity.upgrade = 0;

        if (!owner) {
            businessEntity.user = null;
            businessEntity.userId = 0;
        } else {
            const userEntity = typeof owner === "number" ? await User.getData(owner) : owner.user.entity
            if (!userEntity) return;

            businessEntity.user = userEntity;
            businessEntity.userId = userEntity.id;
            businessEntity.tax = businessEntity.taxDay * 2;

            if (typeof owner !== 'number') {
                owner.notify('Налоги оплачены на двое суток, включая эти. Не забудьте оплатить', 'warning');
            }
        }

        businessEntity.save();
    },
    bizMenu: async (player: PlayerMp, item?: BusinessEntity) => {
        const user = player.user;
        if (player.dimension == 0 && !item) return player.notify("Ошибка", "error"), player.user.teleport(business.BusinessStreetPos[0].x, business.BusinessStreetPos[0].y, business.BusinessStreetPos[0].z, business.BusinessStreetPos[1], 0);
        if (!item) item = business.get(player.dimension);
        if (!item) return player.notify("Ошибка", "error"), player.user.teleport(business.BusinessStreetPos[0].x, business.BusinessStreetPos[0].y, business.BusinessStreetPos[0].z, business.BusinessStreetPos[1], 0);
        const name = [BUSINESS_TYPE.BAR, BUSINESS_TYPE.PARKING].includes(item.type) ? item.name : `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`
        let m = menu.new(player, "", `${name} #${item.id}`)
        m.sprite = "arcadius"

        if (!item.userId) {
            m.newItem({
                name: "~g~Купить",
                more: `$${system.numberFormat(item.price)}`,
                onpress: () => {
                    m.close();
                    if (!item.price) return player.notify("Бизнес не продаётся", "error")
                    if (item.userId) return player.notify("Бизнес уже приобретён", "error");
                    if (business.getByOwner(player)) return player.notify("У вас уже есть приобретённый бизнес", "error");
                    if (BUSINESS_BUY_NEED_LICENSE && !player.user.haveActiveLicense('biz')) return player.notify("Для покупки необходима лицензия на владение бизнесом", "error");
                    if (player.user.level < BUSINESS_BUY_LEVEL) return player.notify("Для покупки необходимо иметь " + BUSINESS_BUY_LEVEL + " уровень персонажа либо больше", "error");
                    const check = () => {
                        let status = !(!!item.userId)
                        if (!status) player.notify("Бизнес уже приобретён", "error");
                        return status;
                    }
                    player.user.tryPayment(item.price, "all", check, "Приобрёл бизнес #" + item.id, "Государственная фискальная служба").then((status) => {
                        if (!status) return;
                        business.setOwner(item, player);
                        player.notify("Поздравляем с приобретением", "success");
                        player.user.log("PlayerBuy", "Приобрёл бизнес " + item.id);
                        business.bizMenu(player, item);
                    })
                }
            })
        }

        const selectOwnerAdmin = () => {
            const nearest = user.getNearestPlayer()
            menu.input(player, 'Введите ID игрока', nearest ? nearest.dbid : null, 6, 'int').then(async ids => {
                if (!ids || ids < 0 || ids > 999999) return;
                const data = await User.getData(ids);
                if (!data) return player.notify('Игрок с указанным ID не обнаружен', 'error');
                business.setOwner(item, ids)
                business.bizMenu(player, item);
            })
        }

        if (item.userId) {
            let owner = await User.getData(item.userId);
            m.newItem({
                name: "Владелец",
                more: `${owner.rp_name} (${owner.id})`,
                onpress: () => {
                    if (!user.isAdminNow(6)) return;
                    menu.selector(player, 'Выберите действие', ['Снять текущего владельца', 'Передать бизнес'], true).then(q => {
                        if (typeof q !== "number") return;
                        if (!q) business.setOwner(item, null)
                        else selectOwnerAdmin()

                        writeSpecialLog(`Забрал бизнес у игрока - ${item.id}`, player, owner.id);
                    })
                }
            })
        }

        if (item.userId === player.user.id || player.user.isAdminNow(6)) {
            if (item.userId === player.dbid) {
                m.newItem({
                    name: "Продать бизнес государству",
                    more: `Налог при продаже - ${SELL_GOS_TAX_PERCENT}%`,
                    onpress: () => {
                        m.close();
                        if (!player.user.bank_have) return player.notify('У вас должен быть счёт в банке для того чтобы продать бизнес', "error");
                        menu.accept(player, 'Вы уверены?').then(status => {
                            if (!status) return;
                            if (business.get(item.id).userId !== player.user.id) return player.notify("Бизнес уже не принадлежит вам", "error");
                            const sum = (item.price - ((item.price / 100) * SELL_GOS_TAX_PERCENT))
                            business.setOwner(item, null);
                            player.user.addBankMoney(sum, true, 'Продажа бизнеса ' + name + " #" + item.id + ' государству', "Arcadius");
                            player.notify("Бизнес успешно продан", "success");
                        })
                    }
                })
                m.newItem({
                    name: "Продать бизнес игроку",
                    more: ``,
                    onpress: () => {
                        m.close();
                        if (!player.user.bank_have) return player.notify('У вас должен быть счёт в банке для того чтобы продать бизнес', "error");
                        menu.input(player, 'Введите стоимость продажи', item.price, 8, 'int').then(cost => {
                            if (!cost || isNaN(cost) || cost <= 0 || cost >= 999999999) return;
                            player.user.selectNearestPlayer(5).then(target => {
                                if (!target) return;
                                if (!target.user.haveActiveLicense('biz')) return target.notify("Для покупки необходима лицензия на владение бизнесом", "error");
                                if (target.user.level < 3) return target.notify("Для покупки необходимо иметь третий уровень персонажа либо больше", "error");
                                if (business.get(item.id).userId !== player.user.id) return player.notify("Бизнес уже не принадлежит вам", "error");
                                if (!target.user.bank_have) return target.notify('У вас должен быть счёт в банке для того чтобы купить бизнес', "error");
                                player.notify('Запрос отправлен', "success");
                                menu.accept(target, `Вы хотите приобрести данный бизнес за ${cost}`).then(status => {
                                    if (!status) return;
                                    if (!mp.players.exists(player)) return;
                                    if (business.get(item.id).userId !== player.user.id) return;
                                    if (system.distanceToPos(business.BusinessMenuPos, player.position) > 10) {
                                        player.notify('Вы отошли слишком далеко от зоны управления бизнесом', "error");
                                        target.notify('Владелец бизнеса отошёл слишком далеко от зоны управления бизнесом', "error");
                                        return;
                                    }
                                    if (system.distanceToPos(target.position, player.position) > 10) {
                                        player.notify('Покупатель слишком далеко от Вас', "error");
                                        target.notify('Продавец слишком далеко от Вас', "error");
                                        return;
                                    }
                                    target.user.tryPayment(cost, 'card', () => {
                                        return mp.players.exists(player) && business.get(item.id).userId === player.user.id
                                    }, `Покупка бизнеса ${name} #${item.id} у ${player.user.name} (${player.dbid})`, 'Arcadius').then(paystatus => {
                                        if (!paystatus) return;
                                        player.user.addBankMoney(cost, true, `Продажа бизнеса ${name} #${item.id} ${target.user.name} (${target.dbid})`, 'Arcadius')
                                        business.setOwner(item, target);
                                        menu.close(player);
                                        menu.close(target);
                                        player.notify('Бизнес успешно продан', 'success');
                                        target.notify('Бизнес успешно куплен', 'success');
                                    })
                                })
                            })
                        })
                    }
                })
            }
            const cfgUpdate = BUSINESS_UPGRADE_DATA.find(q => q.type.includes(item.type));
            if (cfgUpdate) {
                m.newItem({
                    name: "Улучшение бизнеса",
                    more: `Текущий уровень: ${item.upgrade}`,
                    desc: cfgUpdate.desc,
                    onpress: () => {
                        let submenu = menu.new(player, "", "Выбор уровня")
                        submenu.sprite = "arcadius"

                        for (let level = 0; level <= cfgUpdate.max_level; level++) {
                            const cost = ((item.price / 100 * cfgUpdate.level_percent) * (cfgUpdate.level_multiple ? level : 1))
                            submenu.newItem({
                                name: `Уровень ${level}`,
                                more: `${item.upgrade == level ? 'Текущий |' : ''}${(item.upgrade + 1) == level ? 'Доступный |' : ''} $${system.numberFormat(cost)}`,
                                desc: cfgUpdate.desc,
                                onpress: () => {
                                    if (!player.user.isAdminNow(6)) {
                                        if (item.upgrade == level) return player.notify("Бизнес уже имеет текущий уровень", "error");
                                        if (level < item.upgrade) return player.notify('Выбранный уровень ниже текущего', 'error');
                                        if ((item.upgrade + 1) != level && cfgUpdate.step_by_step) return player.notify("Бизнес не может быть улучшен до данного уровня", "error");
                                        if (item.money < cost) return player.notify(`На балансе бизнеса недостаточно средств. Пополните баланс на $${system.numberFormat(cost - item.money)}`, 'error');
                                        item.upgrade = level;
                                        business.removeMoney(item, cost, 'Улучшение бизнеса', false);
                                    } else {
                                        item.upgrade = level;
                                    }
                                    player.notify('Бизнес улучшен', 'success');
                                    business.bizMenu(player, item);
                                }
                            })
                        }

                        submenu.open();
                    }
                })
            }
            m.newItem({
                name: "Баланс бизнеса",
                more: `$${system.numberFormat(item.money)}`
            })
            if (item.donate) {
                m.newItem({
                    name: "Донат магазин",
                    more: `Да`,
                    desc: 'Данный магазин принимает в качестве оплаты донат валюту. Для покупки не предназначен'
                })
            }
            m.newItem({
                name: "Оплаченный налог",
                more: `$${system.numberFormat(item.tax)} / $${system.numberFormat(item.taxMax)}`,
                desc: "Если налог достигнет 0 - бизнес будет изъят государством",
                onpress: () => {
                    const withdrawAmount = item.taxMax - item.tax;

                    if (withdrawAmount <= 0) {
                        return player.notify('Налоги уже полностью оплачены');
                    }

                    if (item.money < withdrawAmount)
                        return player.notify(`На балансе бизнеса недостаточно средств. Пополните баланс на $${system.numberFormat(withdrawAmount - item.money)}`, 'error');
                    business.removeMoney(item, withdrawAmount, "Оплата налогов")
                    item.tax = item.taxMax;
                    player.notify("Налоги успешно оплачены", "success");
                    business.bizMenu(player, item);
                }
            })
            if (item.type !== BUSINESS_TYPE.BANK) {
                const banks = business.getAllBanks();
                const bank = item.bank;
                if (bank) {
                    if (!banks.find(q => q.id == bank.id)) {
                        item.bank = null;
                        item.mark_for_save = true
                    }
                }
                m.newItem({
                    name: "Обслуживающий банк",
                    more: bank ? `${bank.name} #${bank.id}` : "Государственный",
                    desc: `Комиссия за все переводы: ${bank ? bank.param1 : bankPercentDefault}%`,
                    onpress: () => {
                        let submenu = menu.new(player, "", "Выбор банка");
                        submenu.onclose = () => {
                            business.bizMenu(player, item);
                        }
                        banks.map(itm => {
                            submenu.newItem({
                                name: `${itm.name} #${itm.id}`,
                                more: `Обслуживание: ${itm.param1}%`,
                                onpress: () => {
                                    submenu.close();
                                    player.notify(`Вы заключили договор на обслуживание с ${itm.name} #${itm.id}`, `success`);
                                    item.bank = itm;
                                    item.mark_for_save = true
                                    business.bizMenu(player, item);
                                }
                            })
                        })
                        submenu.open();
                    }
                })
            }
            m.newItem({
                name: "Пополнить баланс",
                more: `Минимум: $${system.numberFormat(1000)}`,
                onpress: () => {
                    m.close();
                    menu.input(player, "Введите сумму пополнения", "", 7, "int").then(sum => {
                        if (sum === null) return business.bizMenu(player, item);
                        if (isNaN(sum) || sum <= 0) return player.notify("Сумма пополнения указана не верно", "success"), business.bizMenu(player, item);
                        if (sum < 1000) return player.notify(`Минимальная сумма пополнения $${system.numberFormat(1000)}`, "success"), business.bizMenu(player, item);
                        player.user.tryPayment(sum, "card", null, "Пополнение баланса бизнеса #" + item.id, item.name).then(status => {
                            if (status) business.addMoney(item, sum, "Пополнение баланса владельцем", false, true), player.notify("Бизнес успешно пополнен", "success");
                            business.bizMenu(player, item);
                        })
                    })
                }
            })
            m.newItem({
                name: "Снять средства с бизнеса",
                more: `Минимум: $${system.numberFormat(1000)}`,
                onpress: () => {
                    m.close();
                    menu.input(player, "Введите сумму снятия", "", 7, "int").then(sum => {
                        if (sum === null) return business.bizMenu(player, item);
                        if (isNaN(sum) || sum <= 0) return player.notify("Сумма снятия указана не верно", "success"), business.bizMenu(player, item);
                        if (sum < 1000) return player.notify(`Минимальная сумма снятия $${system.numberFormat(1000)}`, "success"), business.bizMenu(player, item);
                        if (!player.user.bank_number) return player.notify('У вас должен быть банковский счёт для снятия средств', 'error');
                        if (item.money < sum) return player.notify('Указанной суммы нет на счету бизнеса', 'error');
                        business.removeMoney(item, sum, 'Снятие средств владельцем');
                        player.user.addBankMoney(sum, true, `Снятие средств со счёта бизнеса #${item.id}`, 'Arcadius');
                        business.bizMenu(player, item);
                    })
                }
            })
        }


        if (player.user.isAdminNow(6)) {
            m.newItem({
                name: "~b~Админ раздел"
            })
            m.newItem({
                name: 'Максимальный доход в сутки',
                more: `${system.numberFormat(item.max_per_day)}`,
                desc: "Это максимальный доход бизнеса за сутки. Сбрасывается при рестарте сервера",
                onpress: () => {
                    if (!player.user.isAdminNow(6)) return;
                    menu.input(player, "Введите новый ограничитель", item.max_per_day, 2, 'int').then(val => {
                        if (typeof val !== "number" || isNaN(val)) return;
                        if (val <= 0) return player.notify('Данный показатель не может быть менее чем 1', 'error');
                        if (val > 999999999) return player.notify('Данный показатель не может быть более чем 999999999', 'error');
                        item.max_per_day = val;
                        item.save().then(() => {
                            business.bizMenu(player, item);
                            player.notify('Новый параметр сохранён', 'success');
                        })
                    })
                }
            })
            m.newItem({
                name: "Изменить название",
                onpress: () => {
                    m.close();
                    menu.input(player, "Введите название", item.name, 100).then(name => {
                        if (!name) return;
                        item.name = name;
                        item.save();
                    })
                }
            })
            m.newItem({
                name: "Изменить стоимость",
                more: `$${system.numberFormat(item.price)}`,
                onpress: () => {
                    if (item.donate) return player.notify('Донат магазин может стоить только $0, чтобы его нельзя было купить', 'error')
                    m.close();
                    menu.input(player, "Введите стоимость", item.price, 100, "int").then(price => {
                        if (typeof price !== 'number') return;
                        if (isNaN(price) || price < 0) return;
                        item.price = price;
                        item.save();
                        player.notify('Действие выполнено')
                    })
                }
            })
            if (item.price) {
                m.newItem({
                    name: "Сделать бизнес не продаваемым",
                    desc: 'По сути это установить цену за 0. Игрок не сможет купить бизнес',
                    onpress: () => {
                        m.close();
                        menu.accept(player).then(status => {
                            if (!status) return;
                            item.price = 0;
                            item.save()
                            player.notify('Действие выполнено')
                        })
                    }
                })
            }
            m.newItem({
                name: "~r~Удалить бизнес",
                onpress: () => {
                    m.close();
                    menu.accept(player).then(status => {
                        if (status) business.delete(item);
                    })
                }
            })
        }

        if (player.user.isAdminNow(4)) {
            m.newItem({
                name: 'Крыша',
                more: `${fractionCfg.getFraction(item.mafiaOwner)?.name ?? 'Отсутствует'}`,
                desc: "Мафия контролирующая бизнес",
                onpress: () => {
                    if (!player.user.isAdminNow(4)) return;
                    let submenu = menu.new(player, "", "Выбор семьи");
                    submenu.onclose = () => {
                        business.bizMenu(player, item);
                    }
                    fractionCfg.mafiaFactions.map(itm => {
                        submenu.newItem({
                            name: `${fractionCfg.getFraction(itm)?.name}`,
                            onpress: () => {
                                submenu.close();
                                player.notify(`Вы передали управление бизнесом фракции ${fractionCfg.getFraction(itm)?.name}`, `success`);
                                item.mafiaOwner = itm
                                item.mark_for_save = true
                                business.bizMenu(player, item);
                            }
                        })
                    })
                    submenu.open();
                }
            })
        }

        m.open();
    },
    fineItem: (biz: number | BusinessEntity, sum: number) => {
        let item = typeof biz === "number" ? business.get(biz) : biz;
        sum = sum / 100 * shopFineWhenNoItems
        item.money -= sum;
        if (item.money < 0) item.tax += Math.abs(item.money);
        item.mark_for_save = true
    },
    log: (biz: number | BusinessEntity, sum: number, type: "add" | "remove", reason: string) => {
        let item = new BusinessHistoryEntity();
        item.business = typeof biz === "number" ? business.get(biz) : biz;
        item.type = type;
        item.time = system.timestamp
        item.text = reason;
        item.sum = sum;
        saveEntity(item);
    },
    addTax: (biz: number | BusinessEntity, sum: number) => {
        let item = typeof biz === "number" ? business.get(biz) : biz;
        item.tax += sum;
        item.mark_for_save = true
    },
    addMoney: (biz: number | BusinessEntity, sum: number, reason?: string, fromReserve = false,
               ignoreLimit = false, needSave = true, notify = true,
               purchaseComponentsPrice: number = null, profit = 0) => {
        if (typeof sum !== "number") return;
        if (isNaN(sum) || sum <= 0) return;
        let item = typeof biz === "number" ? business.get(biz) : biz;
        if (!item) return;
        if (item.type !== BUSINESS_TYPE.BANK) {
            const bank = item.bank;
            if (bank && !fromReserve) {
                if (bank.param1 > bankMaxPercent) bank.param1 = bankMaxPercent;
                let banksum;

                if (profit !== 0) {
                    banksum = profit / 100 * bank.param1
                } else {
                    banksum = sum / 100 * bank.param1;
                }

                sum -= banksum;
                banksum = banksum / 100 * bankPercentMoneyReceive;
                business.addMoney(bank, banksum, `Процент от бизнеса #${item.id}`, false, true)
            } else {
                if (fromReserve) {
                    item.reserve_money -= sum
                } else {
                    sum -= sum / 100 * bankPercentDefault
                }
            }
        }
        if (item.type !== BUSINESS_TYPE.BANK && item.type != BUSINESS_TYPE.TUNING) {
            let amount;

            if (profit !== 0) {
                amount = Math.floor(profit / 100 * BUSINESS_GOV_PERCENT);
            } else {
                amount = Math.floor(sum / 100 * BUSINESS_GOV_PERCENT);
            }

            sum -= amount;
            const fraction = MoneyChestClass.getByFraction(1);
            if (fraction) fraction.money = fraction.money + amount;
            console.log(amount);
        }
        if (!ignoreLimit) {
            if (item.current_day < item.max_per_day) {
                if (item.type === BUSINESS_TYPE.TUNING && purchaseComponentsPrice !== 0) {
                    item.current_day += sum;
                    item.money += sum;
                    if (reason && notify) business.log(item, sum, "add", reason)
                }

                if (item.type !== BUSINESS_TYPE.TUNING) {
                    item.current_day += sum;
                    item.money += sum;
                    if (reason && notify) business.log(item, sum, "add", reason)
                }
            } else if (purchaseComponentsPrice) {
                let increment = purchaseComponentsPrice
                // Учитываем уровень прокачки бизнеса и стоимость закупки товаров
                if (item.upgrade > 0 &&
                    [BUSINESS_TYPE.BAR, BUSINESS_TYPE.ITEM_SHOP, BUSINESS_TYPE.BARBER, BUSINESS_TYPE.TATTOO_SALON, BUSINESS_TYPE.FUEL, BUSINESS_TYPE.DRESS_SHOP, BUSINESS_TYPE.TUNING]
                        .includes(item.type))
                    increment = purchaseComponentsPrice - (purchaseComponentsPrice / 100 * (item.upgrade * 10))
                item.money += increment
                if (reason && notify) business.log(item, increment, "add", reason + " [после лимита]");
            }
        } else {
            if (item.type === BUSINESS_TYPE.TUNING && purchaseComponentsPrice !== 0) {
                item.money += sum;
                if (reason && notify) business.log(item, sum, "add", reason)
            }

            if (item.type !== BUSINESS_TYPE.TUNING) {
                item.money += sum;
                if (reason && notify) business.log(item, sum, "add", reason)
            }
        }

        if (needSave) {
            setTimeout(() => {
                item.mark_for_save = true
            }, 100)
        }

    },
    removeMoney: (biz: number | BusinessEntity, sum: number, reason?: string, reserve = false, save = true) => {
        if (typeof sum !== "number") return;
        if (isNaN(sum) || sum <= 0) return;
        let item = typeof biz === "number" ? business.get(biz) : biz;
        item.money -= sum;
        if (reserve) item.reserve_money += sum;
        if (reason) business.log(item, sum, "remove", reason)
        if (save) item.mark_for_save = true
    },
    arcadiusMenu: (player: PlayerMp) => {
        const user = player.user;
        if (!user) return;
        let m = menu.new(player, "", "Категории");
        m.sprite = "arcadius"
        const myBiz = user.business;
        if (myBiz) {
            m.newItem({
                name: `Мой бизнес`,
                more: `${BUSINESS_SUBTYPE_NAMES[myBiz.type][myBiz.sub_type]}`,
                onpress: () => {
                    player.user.teleport(business.BusinessOfficePos[0].x, business.BusinessOfficePos[0].y, business.BusinessOfficePos[0].z, business.BusinessOfficePos[1], myBiz.id);
                }
            })
        }
        BUSINESS_TYPE_NAMES.map((catName, type) => {
            m.newItem({
                name: catName,
                onpress: () => {
                    let submenu = menu.new(player, "", "Категории");
                    submenu.sprite = "arcadius"
                    submenu.onclose = () => {
                        business.arcadiusMenu(player)
                    };
                    const admin = player.user.isAdminNow(6);
                    business.data.filter(biz => biz.type == type && (!biz.donate || admin)).map(biz => {
                        const name = [BUSINESS_TYPE.BAR, BUSINESS_TYPE.PARKING].includes(biz.type) ? biz.name : `${BUSINESS_SUBTYPE_NAMES[biz.type][biz.sub_type]} #${biz.id}`
                        const desc = [BUSINESS_TYPE.BAR, BUSINESS_TYPE.PARKING].includes(biz.type) ? '' : `${biz.name}. `
                        submenu.newItem({
                            name,
                            desc: desc + `Владелец: ${biz.userId ? biz.userId : 'Государство'}. Стоимость: $${system.numberFormat(biz.price)}`,
                            onpress: () => {
                                player.user.teleport(business.BusinessOfficePos[0].x, business.BusinessOfficePos[0].y, business.BusinessOfficePos[0].z, business.BusinessOfficePos[1], biz.id);
                            }
                        })
                    })
                    submenu.open();
                }
            })
        })
        if (player.dimension != 0) {
            m.newItem({
                name: "Улица",
                onpress: () => {
                    player.user.teleport(business.BusinessStreetPos[0].x, business.BusinessStreetPos[0].y, business.BusinessStreetPos[0].z, business.BusinessStreetPos[1], 0)
                }
            })
        }
        m.open();
    },
    createBiz: (player: PlayerMp) => {
        if (!player.user.hasPermission('admin:gamedata:createbiz')) return player.notify('У вас нет доступа', "error");
        const user = player.user;
        let m = menu.new(player, "", "Выберите категорию");
        m.sprite = "arcadius"
        const biznear = business.data.find(q => system.isPointInPoints(player.position, q.positions, 20));
        if (biznear) {
            m.newItem({
                name: 'Открыть бизнес рядом',
                onpress: () => {
                    business.bizMenu(player, biznear)
                }
            })
        }
        BUSINESS_TYPE_NAMES.map((catName, type) => {
            m.newItem({
                name: catName,
                onpress: () => {
                    let points: { x: number, y: number, z: number, h?: number }[] = []
                    const create = async (item?: BusinessEntity) => {
                        if (!player.user.hasPermission('admin:gamedata:createbiz')) return player.notify('У вас нет доступа', "error");
                        if (!item) {
                            item = new BusinessEntity();
                            item.type = type;
                            item.sub_type = 0;
                            item.mafiaOwner = 0;
                            item.multiple_price = 2;
                            item.max_per_day = 0;
                        }
                        item.dimension = player.dimension;
                        item.catalog = [];
                        if (!item.name) {
                            item.name = await CustomEvent.callClient(player, "currentStreet")
                        }
                        let submenu = menu.new(player, "", "Настройка бизнеса");
                        submenu.sprite = "arcadius"
                        submenu.exitProtect = true
                        submenu.newItem({
                            name: item.type === BUSINESS_TYPE.PARKING ? "Название (Улица)" : "Название",
                            more: item.name ? item.name : `~r~Не указано`,
                            onpress: () => {
                                menu.input(player, "Введите название", item.name ? item.name : ``, 100).then(name => {
                                    if (name) item.name = name;
                                    else if (!item.name) player.notify('Название в любом случае придётся указать', 'error');
                                    create(item);
                                })
                            }
                        })
                        if (BUSINESS_SUBTYPE_NAMES[type].length > 1) {
                            submenu.newItem({
                                name: "Подтип бизнеса",
                                type: "list",
                                list: BUSINESS_SUBTYPE_NAMES[type],
                                listSelected: item.sub_type,
                                onchange: (val) => {
                                    item.sub_type = val;
                                }
                            })
                        }
                        submenu.newItem({
                            name: "Стоимость",
                            more: item.price ? `~g~$${system.numberFormat(item.price)}` : `~r~$0 - Не для продажи`,
                            onpress: () => {
                                menu.input(player, "Введите стоимость", item.price, 100, "int").then(price => {
                                    if (typeof price !== "number") return create();
                                    if (isNaN(price) || price < 0 || price > 99999999999) return player.notify('Стоимость указана не верно', 'error');
                                    item.price = price;
                                    create(item);
                                })
                            }
                        })
                        submenu.newItem({
                            name: "Ограничитель стоимости",
                            more: item.multiple_price ? `~g~$${system.numberFormat(item.multiple_price)}` : `~r~$0 - необходимо указать`,
                            desc: 'Этот параметр указывает насколько сильно владелец бизнеса может увеличить стоимость продукта исходя из базовой стомости. Например, если базовая цена продукта 100$, а параметр стоит 2 - то он не сможет установить цену выше чем 200$',
                            onpress: () => {
                                menu.input(player, "Введите ограничитель", item.multiple_price, 2, "int").then(price => {
                                    if (typeof price !== "number") return create();
                                    if (isNaN(price) || price < 1 || price > 99) return player.notify('Ограничитель указан не верно', 'error');
                                    item.multiple_price = price;
                                    business.fixCatalog(item);
                                    create(item);
                                })
                            }
                        })
                        submenu.newItem({
                            name: "Максимальный доход в сутки",
                            more: item.max_per_day ? `~g~$${system.numberFormat(item.max_per_day)}` : `~r~$0 - необходимо указать`,
                            desc: 'Это максимальный доход бизнеса за сутки. Сбрасывается при рестарте сервера',
                            onpress: () => {
                                menu.input(player, "Введите максимальный доход в сутки", item.max_per_day, 2, "int").then(price => {
                                    if (typeof price !== "number") return create();
                                    if (isNaN(price) || price < 1 || price > 999999999) return player.notify('Параметр указан не верно', 'error');
                                    item.max_per_day = price;
                                    create(item);
                                })
                            }
                        })

                        submenu.newItem({
                            name: "Очистить точки взаимодействия",
                            more: `~r~Необратимо`,
                            onpress: () => {
                                points = []
                                player.notify('Точки очищены', 'error');
                                create(item);
                            }
                        })

                        if (item.type == BUSINESS_TYPE.BANK) {
                            submenu.newItem({
                                name: "Добавить метку окна кассы",
                                onpress: () => {
                                    points.push({
                                        x: (player.position.x),
                                        y: (player.position.y),
                                        z: (player.position.z - 1)
                                    })
                                    player.notify('Точка добавлена. Всего точек: x' + points.length, 'success');
                                }
                            })
                        } else if (item.type == BUSINESS_TYPE.FUEL) {
                            submenu.newItem({
                                name: "Место спавна пропа электрозаправки",
                                onpress: () => {
                                    if (points.length === 0) points.push({
                                        x: (player.position.x),
                                        y: (player.position.y),
                                        z: (player.position.z - 1),
                                        h: Math.floor(player.heading)
                                    })
                                    else points[0] = {
                                        x: (player.position.x),
                                        y: (player.position.y),
                                        z: (player.position.z - 1),
                                        h: Math.floor(player.heading)
                                    };
                                    player.notify('Готово', 'success');
                                }
                            })
                            submenu.newItem({
                                name: "Маркер возле пропа электрозаправки",
                                onpress: () => {
                                    if (points.length === 0) return player.notify('Сначала укажите место спавна пропа', 'error')
                                    else if (points.length === 1) points.push({
                                        x: (player.position.x),
                                        y: (player.position.y),
                                        z: (player.position.z - 1),
                                        h: Math.floor(player.heading)
                                    })
                                    else points[1] = {
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1),
                                            h: Math.floor(player.heading)
                                        };
                                    player.notify('Готово', 'success');
                                }
                            })
                            submenu.newItem({
                                name: "Маркер заправки топливом",
                                onpress: () => {
                                    if (points.length === 0) return player.notify('Сначала укажите место спавна пропа', 'error')
                                    else if (points.length === 1) return player.notify('Сначала укажите маркер электрозаправки', 'error')
                                    else points.push({
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1)
                                        })
                                    player.notify('Маркер добавлен', 'success');
                                }
                            })
                        } else if (item.type == BUSINESS_TYPE.PARKING) {
                            submenu.newItem({
                                name: "Добавить точку входа",
                                desc: "Учитывайте что точка будет иметь широкий радиус",
                                onpress: () => {
                                    points[0] = {
                                        x: (player.position.x),
                                        y: (player.position.y),
                                        z: (player.position.z - 0.85),
                                        h: Math.floor(player.heading)
                                    };
                                    player.notify('Точка указана', 'success');
                                }
                            })
                        } else if ([BUSINESS_TYPE.TUNING, BUSINESS_TYPE.WASH].includes(item.type)) {
                            submenu.newItem({
                                name: "Добавить/Изменить меню управления бизнесом",
                                onpress: () => {
                                    if (points.length == 1) {
                                        points[0] = {
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1)
                                        }
                                        player.notify('Точка изменена', 'success');
                                    } else {
                                        points.push({
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1)
                                        })
                                        player.notify('Точка добавлена', 'success');
                                    }
                                }
                            })
                            submenu.newItem({
                                name: "Добавить/Изменить точку тюнинга",
                                onpress: () => {
                                    if (points.length == 0) return player.notify("Сначала необходимо добавить точку входа")
                                    if (points.length >= 2) {
                                        points[1] = {
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 0.85),
                                            h: Math.floor(player.heading)
                                        }
                                        player.notify('Точка изменена', 'success');
                                    } else {
                                        points.push({
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 0.85),
                                            h: Math.floor(player.heading)
                                        })
                                        player.notify('Точка добавлена', 'success');
                                    }
                                }
                            })
                        } else if (item.type == BUSINESS_TYPE.VEHICLE_SHOP) {
                            submenu.newItem({
                                name: "Добавить точку входа",
                                onpress: () => {
                                    if (points.length == 1) {
                                        points[0] = {
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1)
                                        }
                                        player.notify('Точка изменена', 'success');
                                    } else {
                                        points.push({
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1)
                                        })
                                        player.notify('Точка добавлена', 'success');
                                    }
                                }
                            })
                            submenu.newItem({
                                name: "Добавить точку просмотра транспорта",
                                desc: "Если тип бизнеса прокат - то тут будет спанится арендованый ТС",
                                onpress: () => {
                                    if (points.length == 0) return player.notify("Сначала необходимо добавить точку входа")
                                    if (points.length >= 2) {
                                        points[1] = {
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1),
                                            h: Math.floor(player.heading)
                                        }
                                        player.notify('Точка изменена', 'success');
                                    } else {
                                        points.push({
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1),
                                            h: Math.floor(player.heading)
                                        })
                                        player.notify('Точка добавлена', 'success');
                                    }
                                }
                            })
                            if (item.sub_type != 0) {

                                submenu.newItem({
                                    name: "Добавить точку начала тестдрайва",
                                    desc: "Если тип бизнеса прокат - точку надо поставить, но использоваться она не будет",
                                    onpress: () => {
                                        if (points.length < 2) return player.notify("Сначала необходимо добавить точку входа и точку просмотра транспорта")
                                        if (points.length >= 3) {
                                            points[2] = {
                                                x: (player.position.x),
                                                y: (player.position.y),
                                                z: (player.position.z - 1),
                                                h: Math.floor(player.heading)
                                            }
                                            player.notify('Точка изменена', 'success');
                                        } else {
                                            points.push({
                                                x: (player.position.x),
                                                y: (player.position.y),
                                                z: (player.position.z - 1),
                                                h: Math.floor(player.heading)
                                            })
                                            player.notify('Точка добавлена', 'success');
                                        }
                                    }
                                })
                                submenu.newItem({
                                    name: "Добавить точку спавна купленной ТС",
                                    desc: "Если тип бизнеса прокат - точку надо поставить, но использоваться она не будет",
                                    onpress: () => {
                                        if (points.length < 3) return player.notify("Сначала необходимо добавить точку входа, точку просмотра транспорта и точку начала тестдрайва")
                                        points.push({
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1),
                                            h: Math.floor(player.heading)
                                        })
                                        player.notify('Точка добавлена', 'success');
                                    }
                                })
                            }
                        } else if ([BUSINESS_TYPE.BAR, BUSINESS_TYPE.TATTOO_SALON, BUSINESS_TYPE.DRESS_SHOP, BUSINESS_TYPE.ITEM_SHOP, BUSINESS_TYPE.BARBER].includes(item.type)) {
                            submenu.newItem({
                                name: "Добавить маркер меню покупок",
                                desc: "Учитывайте угол поворота персонажа, для некоторых типов бизнеса это важно",
                                onpress: () => {
                                    if (points.length != 0) {
                                        points[0] = {
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1),
                                            h: (player.heading)
                                        }
                                        player.notify('Точка изменена', 'success');
                                    } else {
                                        points.push({
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1),
                                            h: (player.heading)
                                        })
                                        player.notify('Точка добавлена', 'success');
                                    }
                                }
                            })
                            submenu.newItem({
                                name: "Добавить NPC",
                                desc: "Учитывайте угол поворота персонажа",
                                onpress: () => {
                                    if (points.length == 0) {
                                        player.notify('Сначала необходимо добавить маркер меню покупок', 'error');
                                    } else if (points.length == 2) {
                                        points[1] = {
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z),
                                            h: (player.heading)
                                        }
                                        player.notify('Точка изменена', 'success');
                                    } else {
                                        points.push({
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z),
                                            h: (player.heading)
                                        })
                                        player.notify('Точка добавлена', 'success');
                                    }
                                }
                            })
                        }

                        submenu.newItem({
                            name: "Проверка точек",
                            desc: "На 5 секунд все позиции будут отображены в мире, чтобы убедится что они стоят ровно",
                            onpress: () => {
                                let d = player.dimension;
                                [...points].map(q => {
                                    let marker = mp.markers.new(1, new mp.Vector3(q.x, q.y, q.z), 1,
                                        {
                                            color: [255, 0, 0, 120],
                                            dimension: d
                                        });

                                    setTimeout(() => {
                                        if (mp.markers.exists(marker)) marker.destroy();
                                    }, 5000)
                                })
                            }
                        })

                        submenu.newItem({
                            name: "Предзаготовленый каталог",
                            more: item.catalog.length === 0 ? 'Пустой' : 'Склонирован',
                            onpress: () => {
                                const submenu2 = menu.new(player, "Клонирование каталога", "Выберите бизнес");
                                submenu2.sprite = "arcadius"
                                submenu2.onclose = () => {
                                    create(item);
                                }
                                submenu2.exitProtect = true
                                if (item.catalog.length !== 0) {
                                    submenu2.newItem({
                                        name: `~r~Очистить каталог`,
                                        onpress: () => {
                                            item.catalog = [];
                                            player.notify('Каталог очищен', "success");
                                            create(item);
                                        }
                                    })
                                }
                                business.data.filter(q => q.type === item.type && q.sub_type === item.sub_type).map(q => {
                                    submenu2.newItem({
                                        name: `#${q.id} ${q.name}`,
                                        onpress: () => {
                                            item.catalog = [...q.catalog];
                                            player.notify('Каталог скопирован', "success");
                                            create(item);
                                        }
                                    })
                                })
                                submenu2.open();
                            }
                        })

                        if ([BUSINESS_TYPE.ITEM_SHOP, BUSINESS_TYPE.VEHICLE_SHOP, BUSINESS_TYPE.TATTOO_SALON, BUSINESS_TYPE.DRESS_SHOP].includes(item.type)) {
                            submenu.newItem({
                                name: "Валюта",
                                type: "list",
                                list: ["Игровая валюта", "Донат валюта"],
                                desc: "Что игроки будут тратить при покупке в данном магазине. Если донатный бизнес - то его нельзя будет купить",
                                onchange: (val: number) => {
                                    item.donate = val;
                                }
                            })
                        }

                        submenu.newItem({
                            name: "Сохранить",
                            onpress: () => {
                                if (!item.name) return player.notify('Необходимо указать название', 'error');
                                if (item.donate && item.price) return player.notify('Если продажа проходит за донат валюту, то бизнес не должен стоить денег', 'error');
                                if (points.length == 0) return player.notify('У бизнеса нет ни одной точки взаимодействия', 'error');
                                if ([BUSINESS_TYPE.TUNING, BUSINESS_TYPE.WASH].includes(item.type) && points.length < 2) return player.notify('Для работы автомастерской требуется добавить 2 точки', 'error');
                                if ([BUSINESS_TYPE.TATTOO_SALON, BUSINESS_TYPE.DRESS_SHOP, BUSINESS_TYPE.ITEM_SHOP].includes(item.type) && points.length < 2) return player.notify('Для работы магазина требуется добавить точку взаимодействия и бота', 'error');
                                if (item.type == BUSINESS_TYPE.VEHICLE_SHOP && ((item.sub_type != 0 && points.length < 6) || (item.sub_type == 0 && points.length < 2))) return player.notify('Добавьте больше точек', 'error');
                                submenu.close();
                                item.positions = points;
                                item.save().then(itm => {
                                    business.loadItem(itm)
                                    player.notify("Бизнес добавлен", "success")
                                }).catch(err => {
                                    console.error(err)
                                    player.notify("Возникла ошибка при добавлении бизнеса", "error")
                                })
                            }
                        })

                        submenu.open();
                    }
                    create();
                }
            })
        })
        m.newItem({
            name: `~r~Удалить бизнес рядом`,
            onpress: () => {
                m.close();
                const biz = business.data.find(q => system.distanceToPos(q.positions[0], player.position) < 5);
                if (!biz) return player.notify('Бизнеса поблизости нет', 'error');
                menu.accept(player, `Удалить бизнес`).then(status => {
                    if (!status) return;
                    business.delete(biz.id);
                    player.notify("Бизнес удалён", "success");
                })
            }
        })
        m.open();
    }
}

colshapes.new(business.BusinessMenuPos, (player) => {
    if (!player.dimension) return "";
    let item = business.get(player.dimension);
    if (!item) return "";
    return `${item.name}`;
}, player => {
    business.bizMenu(player);
}, {dimension: -1})

colshapes.new([business.BusinessStreetPos[0]], "Меню Arcadius", player => {
    business.arcadiusMenu(player);
}, {dimension: 0})

colshapes.new([business.BusinessOfficePos[0]], "Меню Arcadius", player => {
    business.arcadiusMenu(player);
}, {dimension: -1})

mp.events.add("playerQuit", (player: PlayerMp, exitType: string, reason: string) => {
    if (!player.user) return;
    if (!player.user.hasPermission('admin:gamedata:createbiz')) return;
    mp.markers.toArray().filter(item => item.tmpid = player.user.id).map(item => {
        item.destroy();
    })
});


export const clearBusinessProduct = (item: BusinessEntity) => {
    inventory.clearInventory(OWNER_TYPES.BUSINESS, item.id)
    item.catalog = inventoryShared.items.filter(q =>
        (item.sub_type == 0 && [ITEM_TYPE.FOOD, ITEM_TYPE.WATER].includes(q.type)) ||
        (item.sub_type == 2 && [ITEM_TYPE.WEAPON, ITEM_TYPE.WEAPON_MAGAZINE, ITEM_TYPE.AMMO_BOX].includes(q.type)) ||
        (item.sub_type == 1 && ELECTRO_SHOP_ITEMS.includes(q.item_id)) ||
        (item.sub_type == 3 && ITEM_TYPE.MEDICATION === q.type)
    ).map(cat => {
        return {
            item: cat.item_id,
            price: 0,
            count: 10,
            max_count: 20
        }
    })
    item.save();
}


export const businessDefaultCostItem = (biz: BusinessEntity, item: number, count = 1) => {
    let sum = 0;
    if (biz.type === BUSINESS_TYPE.ITEM_SHOP || biz.type === BUSINESS_TYPE.BAR) {
        const cfg = inventoryShared.get(item);
        sum = cfg ? (cfg.defaultCost || 0) * count : 0
    } else if (biz.type === BUSINESS_TYPE.BARBER) {
        if (item === 1) sum += BarberShopCost.hair * count;
        if (item === 2) sum += BarberShopCost.paint * count;
        if (item === 3) sum += BarberShopCost.lenses * count;
    } else if (biz.type === BUSINESS_TYPE.FUEL) {
        sum = getFuelCost(item) * count
    } else if (biz.type === BUSINESS_TYPE.DRESS_SHOP) {
        const cfg = dress.get(item);
        sum = cfg ? (cfg.price || 0) * count : 0;
    } else if (biz.type === BUSINESS_TYPE.VEHICLE_SHOP) {
        sum = vehicleConfigs.has(item) ? vehicleConfigs.get(item).cost : 0;
    } else if (biz.type === BUSINESS_TYPE.TATTOO_SALON) {
        const cfg = tattoosShared.getTattoo(item)
        sum = cfg ? (cfg.price || 0) * count : 0;
    } else if (biz.type === BUSINESS_TYPE.WASH) {
        sum = CAR_WASH_ITEM_COST * count
    } else if (biz.type === BUSINESS_TYPE.TUNING) {
        let cfg = getVehicleMod(item);
        sum = cfg ? (cfg.cost || 0) * count : 0;
    }

    return sum;
}

export const businessCatalogItemName = (biz: BusinessEntity, item: number) => {
    let name: string;
    if (biz.type === BUSINESS_TYPE.ITEM_SHOP || biz.type === BUSINESS_TYPE.BAR) name = getBaseItemNameById(item);
    else if (biz.type === BUSINESS_TYPE.FUEL) {
        name = fuelTypeNames[item];
    } else if (biz.type === BUSINESS_TYPE.DRESS_SHOP) {
        const cfg = dress.get(item);
        name = cfg ? cfg.name : "Ошибка";
    } else if (biz.type === BUSINESS_TYPE.VEHICLE_SHOP) {
        name = vehicleConfigs.has(item) ? vehicleConfigs.get(item).name : '';
    } else if (biz.type === BUSINESS_TYPE.WASH) {
        name = 'Химикаты'
    } else if (biz.type === BUSINESS_TYPE.BARBER) {
        name = BarberCatalogNames[item - 1] || "Ошибка";
    } else if (biz.type === BUSINESS_TYPE.TATTOO_SALON) {
        const cfg = tattoosShared.getTattoo(item)
        name = cfg ? cfg.name : "Ошибка";
    } else if (biz.type === BUSINESS_TYPE.TUNING) {
        let cfg = getVehicleMod(item);
        if (!cfg) return;
        name = cfg.name;
    }
    return name;
}

export const businessCatalogMenu = (player: PlayerMp, biz: BusinessEntity, onback: (player: PlayerMp) => any, markup = false, search?: string) => {
    const user = player.user;
    const m = menu.new(player, 'Управление каталогом');
    m.workAnyTime = true;
    m.onclose = () => {
        onback(player);
    }
    const fullAccessCatalog = ![BUSINESS_TYPE.BARBER].includes(biz.type);
    const rent = biz.type === BUSINESS_TYPE.VEHICLE_SHOP && biz.sub_type === 0;
    if (user.isAdminNow(6)) {
        m.newItem({
            name: '~r~Админ управление',
            onpress: () => {
                const s = () => {
                    const submenu = menu.new(player, 'Управление бизнесом', 'Админ действия')
                    submenu.onclose = () => {
                        businessCatalogMenu(player, biz, onback, markup, search)
                    }
                    submenu.workAnyTime = true;
                    submenu.newItem({
                        name: 'Скопировать данные с другого бизнеса по ID',
                        desc: 'Это действие перезапишет каталог бизнеса данными другого бизнеса. Типы и подтипы бизнеса должны совпадать.',
                        onpress: () => {
                            menu.input(player, "Введите ID бизнеса", '', 6, "int").then(val => {
                                if (!val) return;
                                let oldBiz = business.get(val);
                                if (!oldBiz) return player.notify("Бизнес не обнаружен", "error");
                                submenu.close();
                                inventory.clearInventory(OWNER_TYPES.BUSINESS, biz.id)
                                inventory.getInventory(OWNER_TYPES.BUSINESS, oldBiz.id).map(itm => {
                                    inventory.createItem({
                                        owner_type: OWNER_TYPES.BUSINESS,
                                        owner_id: biz.id,
                                        item_id: itm.item_id
                                    });
                                });
                                biz.catalog = [...oldBiz.catalog];
                                biz.save().then(() => {
                                    player.notify('Действие успешно выполнено', 'success')
                                    businessCatalogMenu(player, biz, onback, markup, search)
                                });
                            })
                        }
                    })
                    submenu.open();
                }
                s();
            }
        })
        m.newItem({
            name: 'Ограничитель цены продукта',
            more: biz.multiple_price,
            desc: "Этот параметр указывает насколько сильно владелец бизнеса может увеличить стоимость продукта исходя из базовой стомости. Например, если базовая цена продукта 100$, а параметр стоит 2 - то он не сможет установить цену выше чем 200$",
            onpress: () => {
                menu.input(player, "Введите новый ограничитель", biz.multiple_price, 2, 'int').then(val => {
                    if (typeof val !== "number" || isNaN(val)) return;
                    if (val <= 0) return player.notify('Данный показатель не может быть менее чем 1', 'error');
                    if (val > 99) return player.notify('Данный показатель не может быть более чем 99', 'error');
                    biz.multiple_price = val;
                    business.fixCatalog(biz);
                    biz.save().then(() => {
                        businessCatalogMenu(player, biz, onback, markup, search)
                        player.notify('Новый параметр сохранён', 'success');
                    })
                })
            }
        })

        m.newItem({
            name: "Меню Arcadius",
            onpress: () => {
                business.bizMenu(player, biz);
            },
        })
        m.newItem({
            name: "~r~Удалить бизнес",
            onpress: () => {
                menu.accept(player).then(status => {
                    if (!status) return;
                    business.delete(biz);
                    menu.close(player)
                })
            },
        })
        m.newItem({name: '~y~Каталог'})
    }
    if (fullAccessCatalog && user.isAdminNow(6) && biz.type !== BUSINESS_TYPE.WASH) {
        m.newItem({
            name: '~b~Добавить предмет в каталог',
            onpress: () => {
                let item = {item: <number>null, price: 0, count: 0, max_count: 0}
                const s = () => {
                    const submenu = menu.new(player, 'Добавление предмета в каталог', 'Управление');
                    submenu.onclose = () => {
                        businessCatalogMenu(player, biz, onback, markup, search)
                    }
                    submenu.workAnyTime = true;
                    submenu.newItem({
                        name: `Выбранный предмет`,
                        more: `${typeof item.item === "number" ? businessCatalogItemName(biz, item.item) : 'Не выбрано'}`,
                        onpress: async () => {
                            let itm: number;
                            if ([BUSINESS_TYPE.ITEM_SHOP, BUSINESS_TYPE.BAR].includes(biz.type)) itm = await menu.selectItem(player, biz.catalog.map(q => q.item));
                            if ([BUSINESS_TYPE.TATTOO_SALON, BUSINESS_TYPE.DRESS_SHOP, BUSINESS_TYPE.VEHICLE_SHOP].includes(biz.type)) itm = await menu.input(player, 'Введите ID элемента', itm, 6, 'int');
                            if ([BUSINESS_TYPE.FUEL].includes(biz.type)) itm = await menu.selector(player, 'Выберите топливо', ["Отмена", ...fuelTypeNames], true, null, true);
                            if (typeof itm === "number") {
                                if ([BUSINESS_TYPE.FUEL].includes(biz.type)) itm--;
                                if (biz.type === BUSINESS_TYPE.TATTOO_SALON && !tattoosShared.getTattoo(itm)) return player.notify('ID тату указан не верно', 'error');
                                if (biz.type === BUSINESS_TYPE.DRESS_SHOP && !dress.get(itm)) return player.notify('ID одежды указан не верно', 'error');
                                if (biz.type === BUSINESS_TYPE.VEHICLE_SHOP && !vehicleConfigs.get(itm)) return player.notify('ID ТС указан не верно', 'error');
                                if (biz.catalog.find(q => q.item === itm)) return player.notify(businessCatalogItemName(biz, itm) + ' уже добавлен в каталог', 'error');
                                item.item = itm;
                            }
                            s();

                        }
                    })

                    if (typeof item.item === "number") {
                        if (biz.type === BUSINESS_TYPE.TATTOO_SALON) {
                            const cfg = tattoosShared.getTattoo(item.item)
                            if (cfg) {
                                submenu.newItem({
                                    name: `Параметры`,
                                    more: `ID: ${cfg.id}`,
                                    desc: `М: ${!!cfg.overlay_male ? 'да' : 'нет'} | Ж: ${!!cfg.overlay_female ? 'да' : 'нет'}`
                                })
                            }
                        }

                        submenu.newItem({
                            name: "Базовая стоимость",
                            desc: 'Это стоимость, которая указана в конфиге, отображается исключительно для вашего удобства',
                            more: `$${businessDefaultCostItem(biz, item.item)}`
                        })
                        submenu.newItem({
                            name: "Максимальная стоимость",
                            desc: 'Это максимум, который может указать владелец бизнеса',
                            more: `$${businessDefaultCostItem(biz, item.item) * biz.multiple_price}`
                        })
                        submenu.newItem({
                            name: rent ? "Стоимость аренды" : (markup ? 'Сумма наценки' : "Стоимость продажи"),
                            more: `$${system.numberFormat(item.price)}`,
                            onpress: () => {
                                menu.input(player, `Укажите стоимость продукта (Базовая ${businessDefaultCostItem(biz, item.item) || 'Не указана'})`, item.price, 8, "int").then(val => {
                                    if (val === null) return;
                                    if (isNaN(val) || val < 1 || val > 999999999) return player.notify("Цена указана не верно", "error");
                                    item.price = val;
                                    player.notify("Новая цена указана", "success")
                                    s()

                                })
                            }
                        })

                        if (!rent) {
                            submenu.newItem({
                                name: "Количество",
                                desc: 'Данный параметр отражает текущее количество предметов на складе',
                                more: `${(item.count)}`,
                                onpress: () => {
                                    if (!user.isAdminNow(6)) return;
                                    menu.input(player, "Укажите количество продукта", item.count, 8, "int").then(val => {
                                        if (val === null) return;
                                        if (isNaN(val) || val < 0 || val > 999999999) return player.notify("Количество указанно не верно", "error");
                                        const lastValue = item.count;
                                        item.count = val;
                                        s()
                                        writeSpecialLog(`Изменил количество товара в бизнесе с ${lastValue} на ${item.count} (BID)`, player, biz.id);
                                        player.notify("Новое количество указано", "success")
                                    })
                                }
                            })
                            submenu.newItem({
                                name: "Максимальное количество",
                                desc: 'Данный параметр отражает сколько всего максимум может быть данного предмета на складе бизнеса',
                                more: `${(item.max_count)}`,
                                onpress: () => {
                                    if (!user.isAdminNow(6)) return;
                                    menu.input(player, "Укажите максимальное количество продукта", item.max_count, 8, "int").then(val => {
                                        if (val === null) return;
                                        if (isNaN(val) || val < 0 || val > 999999999) return player.notify("Количество указанно не верно", "error");
                                        item.max_count = val;
                                        s()
                                        player.notify("Новое количество указано", "success")
                                    })
                                }
                            })
                        }


                        submenu.newItem({
                            name: '~g~Сохранить',
                            desc: 'При нажатии настройки полетят в каталог',
                            onpress: () => {
                                if (!rent) {
                                    if (item.count > item.max_count) return player.notify('Текущее количество не может быть больше чем максимальное', 'error');
                                    if (!item.max_count) return player.notify('Максимальное количество не может быть меньше одного', 'error');
                                }
                                submenu.close();
                                const catalog = [...biz.catalog];
                                catalog.push(item);
                                biz.catalog = catalog;
                                biz.save().then(() => {
                                    businessCatalogMenu(player, biz, onback, markup, search)
                                })
                            }
                        })
                    } else {
                        submenu.newItem({
                            name: `~b~Укажите предмет чтобы продолжить`
                        })
                    }
                    submenu.open()

                }
                s();
            }
        })
    }

    m.newItem({
        name: 'Поиск',
        more: search || '',
        onpress: () => {
            menu.input(player, 'Введите данные для поиска').then(res => {
                if (typeof res !== 'string') return;
                search = system.filterInput(res);
                businessCatalogMenu(player, biz, onback, markup, search)
            })
        }
    })

    biz.catalog.map((item, index) => {
        const name = businessCatalogItemName(biz, item.item);
        if (biz.type == BUSINESS_TYPE.TUNING && (!name || name.length <= 0)) return;
        if (search && !name.toLowerCase().includes(search.toLowerCase())) return;
        m.newItem({
            name,
            more: biz.type == BUSINESS_TYPE.TUNING
                ? `${item.price}% / x${item.count} / x${item.max_count}`
                : `$${system.numberFormat(item.price)} / x${item.count} / x${item.max_count}`,
            desc: rent ? '' : `Стоимость одной единицы $${system.numberFormat(item.price)}. Текущее количество на складе: ${item.count}. Максимальное количество: ${item.max_count}`,
            onpress: () => {
                if (rent && !user.isAdminNow(6)) return;
                const s = () => {
                    const submenu = menu.new(player, name, 'Управление');
                    submenu.onclose = () => {
                        businessCatalogMenu(player, biz, onback, markup, search)
                    }
                    if (biz.type == BUSINESS_TYPE.TUNING) {
                        const currentDefaultPercent = lscConfig.find(m => m.id == item.item).percent
                        submenu.newItem({
                            name: 'Процент прибыли',
                            more: `${system.numberFormat(item.price)}%`,
                            onpress: () => {
                                // Процент с конфига
                                if (!currentDefaultPercent) return
                                menu.input(player, `Укажите процент продукта от стоимости ТС (Базовый % ${currentDefaultPercent || 'Не указана'})`).then(value => {
                                    if (value === null) return;
                                    const val = Number(value)
                                    if (isNaN(val) || val < 0 || val > 99) return player.notify("% указан не верно", "error");
                                    if (!user.isAdminNow(6)) {
                                        if (val < currentDefaultPercent / 2) return player.notify('Нельзя указывать процент ниже базового более чем в 2 раза', 'error');
                                        if (val > currentDefaultPercent * 2) return player.notify('Нельзя указывать процент более базового более чем в 2 раза', 'error');
                                    }
                                    biz.setItemPrice(index, val)
                                    biz.save().then(() => {
                                        player.notify("Новый процент указан", "success")
                                        s()
                                    });

                                })
                            }
                        })
                        submenu.newItem({
                            name: `Максимальный процент`,
                            desc: 'Это максимум, который может указать владелец бизнеса',
                            more: `${currentDefaultPercent * 2}%`
                        })
                    } else {
                        submenu.newItem({
                            name: rent ? "Стоимость аренды" : (markup ? 'Сумма наценки' : "Стоимость продажи"),
                            more: `$${system.numberFormat(item.price)}`,
                            onpress: () => {
                                if (rent && !user.isAdminNow(6)) return;
                                menu.input(player, `Укажите ${markup ? 'наценку' : 'стоимость'} продукта (Базовая ${businessDefaultCostItem(biz, item.item) || 'Не указана'})`, item.price, 8, "int").then(val => {
                                    if (val === null) return;
                                    if (isNaN(val) || val < 1 || val > 999999999) return player.notify("Цена указана не верно", "error");
                                    if (!user.isAdminNow(6)) {
                                        if (!markup && val < businessDefaultCostItem(biz, item.item)) return player.notify('Нельзя указывать цену ниже закупочной', 'error');
                                        if (val > businessDefaultCostItem(biz, item.item) * biz.multiple_price) return player.notify('Указанная стоимость превышает максимально допустимую', 'error');
                                    }
                                    biz.setItemPrice(index, val)
                                    biz.save().then(() => {
                                        player.notify("Новая цена указана", "success")
                                        s()
                                    });

                                })
                            }
                        })
                        submenu.newItem({
                            name: `Максимальная ${markup ? 'наценка' : 'стоимость'}`,
                            desc: 'Это максимум, который может указать владелец бизнеса',
                            more: `$${system.numberFormat(businessDefaultCostItem(biz, item.item) * biz.multiple_price)}`
                        })
                    }


                    if (!rent) {
                        submenu.newItem({
                            name: "Количество",
                            desc: 'Данный параметр отражает текущее количество предметов на складе',
                            more: `${(item.count)}`,
                            onpress: () => {
                                if (!user.isAdminNow(6)) return;
                                menu.input(player, "Укажите количество продукта", item.count, 8, "int").then(val => {
                                    if (val === null) return;
                                    if (isNaN(val) || val < 0 || val > 999999999) return player.notify("Количество указанно не верно", "error");
                                    biz.setItemCount(index, val)
                                    biz.save().then(() => s());
                                    player.notify("Новое количество указана", "success")
                                })
                            }
                        })
                        submenu.newItem({
                            name: "Максимальное количество",
                            desc: 'Данный параметр отражает сколько всего максимум может быть данного предмета на складе бизнеса',
                            more: `${(item.max_count)}`,
                            onpress: () => {
                                if (!user.isAdminNow(6)) return;
                                menu.input(player, "Укажите максимальное количество продукта", item.max_count, 8, "int").then(val => {
                                    if (val === null) return;
                                    if (isNaN(val) || val < 0 || val > 999999999) return player.notify("Количество указанно не верно", "error");
                                    biz.setItemMaxCount(index, val)
                                    biz.save().then(() => s());
                                    player.notify("Новое количество указано", "success")
                                })
                            }
                        })
                    }


                    if (user.isAdminNow(6)) {
                        submenu.newItem({
                            name: "~r~Удалить из каталога",
                            desc: 'Внимание, в некоторых типах бизнеса это не допускается, будьте внимательны',
                            onpress: () => {
                                if (!fullAccessCatalog) return player.notify('В данном типе бизнеса нельзя удалять предметы из каталога', 'error');
                                menu.accept(player).then(val => {
                                    if (!val) return;
                                    const newCatalog = [...biz.catalog].filter(q => q.item !== item.item);
                                    biz.catalog = [...newCatalog]
                                    biz.save().then(() => businessCatalogMenu(player, biz, onback, markup, search));
                                    player.notify("Товар удалён из конфига", "success")
                                })
                            }
                        })
                    }

                    submenu.open();
                }
                s();
            }
        })
    })

    m.open();
}
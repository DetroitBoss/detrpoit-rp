import {HouseEntity} from "./typeorm/entities/houses"
import {menu} from "./menu"
import {
    DEFAULT_FAMILY_HOUSE_GARAGE,
    getInteriorGarageById,
    getInteriorHouseById,
    getInteriorsGarage,
    HOUSE_MONEY_POS,
    HOUSE_STOCK_ENTER_POS,
    interriorGarageData,
    interriorHouseData,
    interriorPointData,
    interriors
} from "../../shared/inrerriors"
import {system} from "./system"
import {colshapes} from "./checkpoints"
import {inventory} from "./inventory"
import {getBaseItemNameById, getItemName, OWNER_TYPES} from "../../shared/inventory"
import {
    HOUSE_CHEST_KG_PER_LEVEL,
    HOUSE_CHEST_LEVEL_COST,
    HOUSE_CHEST_LEVEL_COST_COIN,
    HOUSE_CHEST_LEVEL_COST_MULTIPLE,
    HOUSE_CHEST_MAX_LEVEL,
    HOUSE_UPGRADE_LEVEL_COST,
    houseKeyCost,
    houseLockRepairCost,
    houseVehicleRemoveFine,
    SELL_GOS_TAX_PERCENT
} from "../../shared/economy"
import {User} from "./user"
import {Vehicle} from "./vehicles"
import {CustomEvent} from "./custom.event"
import {ScaleformTextMp} from "./scaleform.mp"
import {Family} from "./families/family"
import {HOUSES_TELEPORT_SEPARATOR, HousesTeleportsItem, HousesTeleportsList} from "../../shared/houses";
import {saveEntity} from "./typeorm";
import {getAchievConfigByType} from "../../shared/achievements";
import {Logs} from "./logs";
import {ItemEntity} from "./typeorm/entities/inventory";
import {sendMiningData} from "./mining";
import {House} from "@material-ui/icons";
import {equalReturnKey} from "@inovua/reactdatagrid-community/packages/shallowequal";
import {gui} from "./gui";
import { FamilyEntity } from './typeorm/entities/family'
import {invokeHook} from "../../shared/hooks";
import {MenuItem} from "../../shared/menu";
import {writeSpecialLog} from "./specialLogs";
import {furniture} from "./houses/furniture";
import {FurnitureEntity} from "./typeorm/entities/furniture";

export const HOUSES_ENTER_MENU_HOOK = 'houses-enter-menu';


const tpHouseMenu = (player: PlayerMp, item: HousesTeleportsItem, tpid: number) => {
    const user = player.user;
    if(!user) return;
    const rooms = houses.getAllHouseInMultihouse(tpid);
    let floors: number[] = [];
    rooms.map(room => {
        if(!floors.includes(room.d)) floors.push(room.d);
    });
    const m = menu.new(player, item.name, 'Список этажей');
    if(player.dimension){
        m.newItem({
            name: `Выход на улицу`,
            onpress: () => {
                m.close();
                user.teleport(item.pos.x, item.pos.y, item.pos.z, item.posH, 0);
            }
        })
    }
    floors.map((floor, floorShow) => {
        const thisrooms = rooms.filter(q => q.d === floor);
        m.newItem({
            name: `${(floorShow + 1)} Этаж`,
            more: player.dimension === floor ? `Текущий` : '',
            desc: `Квартиры: ${thisrooms.map(q => q.id).join(', ')}`,
            onpress: () => {
                m.close();
                user.teleport(item.inside.x, item.inside.y, item.inside.z, item.insideH, floor);
            }
        })
    })

    m.open();
}

const tpVehicleMenu = (player: PlayerMp, item: HousesTeleportsItem, tpid: number) => {
    const user = player.user;
    if(!user) return;
    const rooms = houses.getAllHouseInMultihouse(tpid);
    let floors: number[] = [];
    rooms.map(room => {
        if(!floors.includes(room.d)) floors.push(room.d);
    });
    const m = menu.new(player, item.name, 'Список этажей');
    if(player.dimension){
        m.newItem({
            name: `Выход на улицу`,
            onpress: () => {
                m.close();
                user.teleportVeh(item.carExit.x, item.carExit.y, item.carExit.z, item.carH, 0);
            }
        })
    }
    floors.map((floor, floorShow) => {
        const thisrooms = rooms.filter(q => q.d === floor);
        m.newItem({
            name: `${(floorShow + 1)} Этаж`,
            more: player.dimension === floor ? `Текущий` : '',
            desc: `Квартиры: ${thisrooms.map(q => q.id).join(', ')}`,
            onpress: () => {
                const submenu = menu.new(player, "Список квартир");
                submenu.onclose = () => {
                    tpVehicleMenu(player, item, tpid);
                }
                thisrooms.map(item => {
                    submenu.newItem({
                        name: `Квартира ${item.id}`,
                        onpress: () => {
                            enterGarage(player, item);
                        }
                    })
                })

                submenu.open();

            }
        })
    })

    m.open();
}

CustomEvent.registerClient('houseteleport:houseMenu', (player, index: number) => {
    const tpid = index + 1;
    const item = HousesTeleportsList[index];
    tpHouseMenu(player, item, tpid)
})
CustomEvent.registerClient('houseteleport:vehicleMenu', (player, index: number) => {
    const tpid = index + 1;
    const item = HousesTeleportsList[index];
    tpVehicleMenu(player, item, tpid)
})

const houseMenu = (player: PlayerMp, int:  interriorGarageData | interriorHouseData) => {
    const user = player.user;
    if(!user) return;
    let item = houses.get(player.dimension)
    if (!item) return player.notify("Кажется вы застряли, попросите помощи у администратора", "error");
    const m = menu.new(player, "", `${item.name} №${item.id}`)
    m.sprite = "house";

    m.newItem({
        name: "Покинуть дом",
        onpress: () => {
            m.close();
            furniture.leaveHouse(player);
            if (int.type == "house"){
                player.user.teleport(item.x, item.y, item.z, item.h, item.d);
            } else {
                if(!item.forTp){
                    player.user.teleport(item.car_x, item.car_y, item.car_z, item.car_h, item.car_d);
                } else {
                    const tpcfg = HousesTeleportsList[item.forTp - 1];
                    if(!tpcfg) return player.notify('Возникла ошибка', 'error');
                    player.user.teleport(tpcfg.carExit.x, tpcfg.carExit.y, tpcfg.carExit.z, tpcfg.carH, 0);
                }
            }

            mp.events.call('playerLeaveHouse', player, item);
        }
    })
    if (item.car_interrior && int.type == "house"){
        m.newItem({
            name: "Войти в гараж",
            onpress: () => {
                m.close();
                furniture.leaveHouse(player);
                enterGarage(player, item);
            }
        })
    }
    if(item.haveChest){
        m.newItem({
            name: "Войти в склад",
            onpress: () => {
                m.close();
                let haveAccess = !!item.opened;
                if (player.user.isAdminNow(6)) haveAccess = true;
                if (!item.key) haveAccess = true;
                if (!haveAccess) haveAccess = !!player.user.allMyItems.find(itm => itm.item_id == houses.key_id && itm.advancedNumber == item.key && itm.advancedString == "house_chest");
                if (!haveAccess) return player.notify("У вас нет ключей от склада", "error")
                player.user.teleport(HOUSE_STOCK_ENTER_POS.x, HOUSE_STOCK_ENTER_POS.y, HOUSE_STOCK_ENTER_POS.z, HOUSE_STOCK_ENTER_POS.h, item.id);
            }
        })
    }

    if (item.interrior && int.type == "garage"){
        m.newItem({
            name: "Войти в дом",
            onpress: () => {
                m.close();

                let haveAccess = !!item.opened;
                if (player.user.isAdminNow(6)) haveAccess = true;
                if (!item.key) haveAccess = true;
                if (!haveAccess) haveAccess = !!player.user.allMyItems.find(itm => itm.item_id == houses.key_id && itm.advancedNumber == item.key && itm.advancedString == "house");
                if (!haveAccess) return player.notify("У вас нет ключей от дома", "error")

                let int = getInteriorHouseById(item.interrior);
                if (!int) return player.notify("Возникла ошибка внутри здания, сообщите администрации о данном моменте", "error")
                houses.enterHouse(player, item)
                furniture.enterHouse(player, item);
            }
        })
    }

    if(item.userId && (user.isAdminNow(6) || item.userId == user.id)){
        // if(!item.miningData){
        //     m.newItem({
        //         name: 'Установить майнинг ферму',
        //         onpress: () => {
        //             if(item.miningData) return player.notify('Майнинг ферма уже установлена', 'error');
        //             if(!(user.isAdminNow(6) || item.userId == user.id)) return player.notify('Вы не можете установить майнинг ферму', 'error');
        //             const itemInt = user.haveItem(3001)
        //             if(!itemInt) return player.notify(`Требуется ${getBaseItemNameById(3001)} в инвентаре`, 'error');
        //             inventory.deleteItem(itemInt);
        //             item.miningData = {...MiningHouseDefault};
        //             item.save();
        //             player.notify(`Майнинг ферма установлена`, 'success');
        //         }
        //
        //     })
        // } else {
        //     m.newItem({
        //         name: 'Майнинг ферма',
        //         more: `${item.miningData.level} LVL`,
        //         desc: 'Enter чтобы улучшить',
        //         onpress: () => {
        //             if(!item.miningData) return player.notify('Майнинг ферма уже не установлена', 'error');
        //             if(!(user.isAdminNow(6) || item.userId == user.id)) return player.notify('Вы не можете установить майнинг ферму', 'error');
        //             const cfg = getMiningLevel(item.miningData.level);
        //             if(!cfg) return;
        //             const nextLevel = cfg.next;
        //             if(!nextLevel) return player.notify('Больше улучшений нет', 'error');
        //             const cfgNext = getMiningLevel(nextLevel);
        //             if(!cfgNext) return;
        //             if(cfgNext.requireMoney && user.money < cfgNext.requireMoney) return player.notify(`Требуется $${system.numberFormat(cfgNext.requireMoney)}`, 'error')
        //             let allhave = true;
        //             if(cfgNext.requireItems) cfgNext.requireItems.map(q => {
        //                 if(allhave && !user.haveItem(q)){
        //                     allhave = false;
        //                     player.notify(`Требуется ${getBaseItemNameById(q)}`, 'error')
        //                 }
        //             })
        //             if(!allhave) return;
        //             if(cfgNext.requireMoney) user.removeMoney(cfgNext.requireMoney, true, `Улучшение майнинг фермы`);
        //             let items: ItemEntity[] = []
        //             if(cfgNext.requireItems) cfgNext.requireItems.map(q => {
        //                 const itemq = user.haveItem(q)
        //                 if(itemq) items.push(itemq)
        //             })
        //             if(items.length > 0) inventory.deleteItems(...items);
        //             item.miningData = {...item.miningData, level: nextLevel};
        //             item.save();
        //             player.notify('Ферма улучшена', 'success');
        //         }
        //     })
        //     const myItems = user.inventory;
        //
        //     const dataMining = calculateMiningFarmData(item.miningData);
        //     if(dataMining){
        //         m.newItem({name: 'Информация о ферме'})
        //         m.newItem({name: 'Заработано', more: `${system.numberFormat(dataMining.amount)}`})
        //         m.newItem({name: 'Профит', more: `${system.numberFormat(dataMining.profit)}`})
        //         m.newItem({name: 'Производительность', more: `${system.numberFormat(dataMining.tf)}TF`})
        //         m.newItem({name: 'Питание', more: `${system.numberFormat(dataMining.power.current)} / ${system.numberFormat(dataMining.power.max)}`})
        //         m.newItem({name: 'CPU', more: `${system.numberFormat(dataMining.cpu.current)} / ${system.numberFormat(dataMining.cpu.max)}`})
        //         m.newItem({name: 'RAM', more: `${system.numberFormat(dataMining.ram.current)} / ${system.numberFormat(dataMining.ram.max)}`})
        //
        //
        //         if(item.miningData.amount > 0){
        //             m.newItem({
        //                 name: 'Вывести заработаные средства',
        //                 onpress: () => {
        //                     if(!item.miningData) return player.notify('Майнинг ферма уже не установлена', 'error');
        //                     if(!(user.isAdminNow(6) || item.userId == user.id)) return player.notify('Вы не можете установить майнинг ферму', 'error');
        //                     if(!item.miningData.amount) return player.notify('Пустой баланс', 'error');
        //
        //                     if(!user.crypto_number) user.newCryptoNumber();
        //                     user.addCryptoMoney(item.miningData.amount, true, 'Вывод с майнинг фермы');
        //                     item.miningData = {...item.miningData, amount: 0};
        //                     saveEntity(item);
        //                     player.notify('Вы успешно вывели криптовалюту с фермы', 'success');
        //                 }
        //             })
        //         }
        //
        //         const testSelect = (item_ids: number[]): Promise<ItemEntity> => {
        //             const myItems = user.inventory.filter(q => item_ids.includes(q.item_id));
        //             return new Promise(resolve => {
        //                 const submenu = menu.new(player, 'Выбор предмета')
        //                 submenu.onclose = () => {
        //                     resolve(null);
        //                 }
        //
        //                 myItems.map(q => {
        //                     submenu.newItem({
        //                         name: getItemName(q),
        //                         onpress: () => {
        //                             submenu.close()
        //                             resolve(q);
        //                         }
        //                     })
        //                 })
        //
        //                 submenu.open();
        //             })
        //         }
        //
        //         m.newItem({
        //             name: 'Установить алгоритм',
        //             more: `${item.miningData.algorithm ? 'Установлен' : 'Не установлен'}`,
        //             onpress: () => {
        //                 testSelect(MINING_ALGORITHMS_LEVELS.map(q => q.item)).then(q => {
        //                     if(!q) return houseMenu(player, int);
        //                     const itm = inventory.get(q.id, OWNER_TYPES.PLAYER, user.id);
        //                     if(!itm) return player.notify('Предмет не обнаружен в инвентаре', 'error');
        //                     if(item.miningData.algorithm) user.giveItem(item.miningData.algorithm)
        //                     item.miningData = {...item.miningData, algorithm: itm.item_id};
        //                     saveEntity(item);
        //                     houseMenu(player, int)
        //                 })
        //             }
        //         })
        //         m.newItem({
        //             name: 'Установить CPU',
        //             more: `${item.miningData.cpu ? 'Установлен' : 'Не установлен'}`,
        //             onpress: () => {
        //                 testSelect(MINING_CPUS.map(q => q.item)).then(q => {
        //                     if(!q) return houseMenu(player, int);
        //                     const itm = inventory.get(q.id, OWNER_TYPES.PLAYER, user.id);
        //                     if(!itm) return player.notify('Предмет не обнаружен в инвентаре', 'error');
        //                     if(item.miningData.cpu) user.giveItem(item.miningData.cpu)
        //                     item.miningData = {...item.miningData, cpu: itm.item_id};
        //                     saveEntity(item);
        //                     houseMenu(player, int)
        //                 })
        //             }
        //         })
        //         let cfg = getMiningLevel(item.miningData.level);
        //         for(let i = 0; i < cfg.max_ram_count; i++){
        //             m.newItem({
        //                 name: `RAM #${i + 1}`,
        //                 more: `${item.miningData.ram[i] ? 'Установлен' : 'Не установлен'}`,
        //                 onpress: () => {
        //                     testSelect(MINING_RAMS.map(q => q.item)).then(q => {
        //                         if(!q) return houseMenu(player, int);
        //                         const itm = inventory.get(q.id, OWNER_TYPES.PLAYER, user.id);
        //                         if(!itm) return player.notify('Предмет не обнаружен в инвентаре', 'error');
        //                         if(item.miningData.ram[i]) user.giveItem(item.miningData.ram[i])
        //                         let ram = [...item.miningData.ram];
        //                         ram[i] = q.item_id;
        //                         item.miningData = {...item.miningData, ram};
        //                         saveEntity(item);
        //                         houseMenu(player, int)
        //                     })
        //                 }
        //             })
        //         }
        //         for(let i = 0; i < cfg.max_cards; i++){
        //             m.newItem({
        //                 name: `Видеокарта #${i + 1}`,
        //                 more: `${item.miningData.cards[i] ? 'Установлен' : 'Не установлен'}`,
        //                 onpress: () => {
        //                     testSelect(MINING_VIDEOCARDS.map(q => q.item)).then(q => {
        //                         if(!q) return houseMenu(player, int);
        //                         const itm = inventory.get(q.id, OWNER_TYPES.PLAYER, user.id);
        //                         if(!itm) return player.notify('Предмет не обнаружен в инвентаре', 'error');
        //                         if(item.miningData.cards[i]) user.giveItem(item.miningData.cards[i])
        //                         let cards = [...item.miningData.cards];
        //                         cards[i] = q.item_id;
        //                         item.miningData = {...item.miningData, cards};
        //                         saveEntity(item);
        //                         houseMenu(player, int)
        //                     })
        //                 }
        //             })
        //         }
        //         for(let i = 0; i < cfg.max_additional_power_blocks; i++){
        //             m.newItem({
        //                 name: `Блок питания #${i + 1}`,
        //                 more: `${item.miningData.powers[i] ? 'Установлен' : 'Не установлен'}`,
        //                 onpress: () => {
        //                     testSelect(MINING_POWERSS.map(q => q.item)).then(q => {
        //                         if(!q) return houseMenu(player, int);
        //                         const itm = inventory.get(q.id, OWNER_TYPES.PLAYER, user.id);
        //                         if(!itm) return player.notify('Предмет не обнаружен в инвентаре', 'error');
        //                         if(item.miningData.powers[i]) user.giveItem(item.miningData.powers[i])
        //                         let powers = [...item.miningData.powers];
        //                         powers[i] = q.item_id;
        //                         item.miningData = {...item.miningData, powers};
        //                         saveEntity(item);
        //                         houseMenu(player, int)
        //                     })
        //                 }
        //             })
        //         }
        //
        //
        //     }
        //
        //
        // }
    }

    if (int.type == "house" && ((item.familyId && user.family && user.familyId === item.familyId && user.family.isCan(user.familyRank, 'houseUpgrade')) || (item.userId && item.userId === user.id))) {
        if(item.haveChest){
            const multiple = Math.pow(HOUSE_CHEST_LEVEL_COST_MULTIPLE, item.haveChestLevel + 1)
            const costCoin = HOUSE_CHEST_LEVEL_COST_COIN * multiple;
            const cost = item.haveChestLevel >= HOUSE_CHEST_MAX_LEVEL ? 0 : HOUSE_CHEST_LEVEL_COST * multiple;
            m.newItem({
                name: 'Улучшение склада',
                more: `${item.haveChestLevel} / ${HOUSE_CHEST_MAX_LEVEL}`,// HOUSE_CHEST_KG_PER_LEVEL `Следующее улучшение стоит $${system.numberFormat(cost)} или ${costCoin} коинов`
                desc: `Склад - это защищённое место, доступное только по специальному ключу. ${cost ? `Следующее улучшение увеличит склад на ${HOUSE_CHEST_KG_PER_LEVEL} кг` : 'Уровень склада достиг максимального уровня'}`,
                onpress: () => {
                    if(item.haveChestLevel >= HOUSE_CHEST_MAX_LEVEL) return player.notify('Склад достиг максимального уровня', 'error');
                    const multiple = Math.pow(HOUSE_CHEST_LEVEL_COST_MULTIPLE, item.haveChestLevel + 1)
                    const costCoin = HOUSE_CHEST_LEVEL_COST_COIN * multiple;
                    const cost = HOUSE_CHEST_LEVEL_COST * multiple;
                    menu.selector(player, 'Вариант оплаты', [`Игровая валюта $${system.numberFormat(cost)}`, `Коины ${system.numberFormat(costCoin)}`], true).then(status => {
                        if(typeof status !== "number" || status < 0) return;
                        if(item.haveChestLevel >= HOUSE_CHEST_MAX_LEVEL) return player.notify('Склад достиг максимального уровня', 'error');
                        const multiple = Math.pow(HOUSE_CHEST_LEVEL_COST_MULTIPLE, item.haveChestLevel + 1)
                        const costCoin = HOUSE_CHEST_LEVEL_COST_COIN * multiple;
                        const cost = HOUSE_CHEST_LEVEL_COST * multiple;


                        if(item.forFamily){
                            const family = user.family;
                            if(!family || family.id !== item.familyId || !user.family.isCan(user.familyRank, 'houseUpgrade')) return player.notify('Вы не можете улучшать данный дом', 'error')
                            if(status === 0){
                                if(family.money < cost) return player.notify('У вашей семьи недостаточно средств', 'error');
                                family.removeMoney(cost, player,`Улучшение склада дома до ${item.haveChestLevel+1} LVL`);
                            } else {
                                if(family.donate < costCoin) return player.notify('У вашей семьи недостаточно коинов', 'error');
                                family.removeDonateMoney(costCoin, player,`Улучшение склада дома до ${item.haveChestLevel+1} LVL`);
                            }
                        } else {
                            if(status === 0){
                                if(!user.bank_have) return player.notify('У вас должен быть счёт в банке', "error");
                                if(user.bank_money < cost) return player.notify('У ваc недостаточно средств', 'error');
                                user.removeBankMoney(cost, true, `Улучшение склада дома до ${item.haveChestLevel+1} LVL`, 'Обслуживание дома');
                            } else {
                                if(user.donate_money < costCoin) return player.notify('У вас недостаточно коинов', 'error');
                                user.removeDonateMoney(costCoin, 'Увеличил уровень склада в доме')
                            }
                        }
                        item.haveChestLevel++;
                        item.save();
                        player.notify(`Уровень склада успешно повышен`, 'success');
                        houseMenu(player, int);
                    })
                }
            })
        }
        m.newItem({
            name: "Улучшения хранилища",
            desc: 'Хранилище - место, которые находится внутри дома и доступно всем, кто окажется внутри квартиры',
            onpress: () => {
                const current = item.stock;
                const submenu = menu.new(player, "Хранилище", `${item.name} №${item.id}`)
                submenu.sprite = "house";
                const nextUpgrade = HOUSE_UPGRADE_LEVEL_COST.find((upgrade, index) => (index == (item.stock + 1) && upgrade.house <= item.price))
                const currentUpgrade = HOUSE_UPGRADE_LEVEL_COST.find((upgrade, index) => (index == (item.stock)))
                submenu.newItem({
                    name: "Хранилище",
                    more: `LVL: ${item.stock}`,
                    desc: nextUpgrade ? `Доступно улучшение. Стоимость: $${system.numberFormat(nextUpgrade.price)} Вместительность хранилища: +${(nextUpgrade.amount - currentUpgrade.amount)} кг` : (item.stock ? `Хранилище дома достигло максимального уровня улучшения` : 'Данный дом не имеет улучшений хранилища'),
                    onpress: () => {
                        if (!nextUpgrade) return player.notify("Лучше больше не сделать", "error");

                        const success = () => {
                            item.stock++;
                            item.save();
                            player.notify(`Уровень хранилища успешно повышен`, 'success');
                        }
                        if(item.forFamily){
                            const family = user.family;
                            if(!family || family.id !== item.familyId || !user.family.isCan(user.familyRank, 'houseUpgrade')) return player.notify('Вы не можете улучшать данный дом', 'error')
                            if(family.money < nextUpgrade.price) return player.notify('У вашей семьи недостаточно средств', 'error');
                            family.removeMoney(nextUpgrade.price, player,'Установка вместительного шкафа в дом');
                            success();
                        } else {
                            user.tryPayment(nextUpgrade.price, "all", () => {
                                return current === item.stock
                            }, 'Установка вместительного шкафа', 'Обслуживание дома').then(res => {
                                if (!res) return;
                                success()
                            })
                        }
                    }
                })
                submenu.open();
            }
        })

    }
    if (int.type == "house" && !item.familyId) {
        if(item.residents.includes(user.id)){
            m.newItem({
                name: 'Выселиться',
                onpress: () => {
                    menu.accept(player, 'Вы уверены что хотите выселиться?', 'small').then(status => {
                        if(!item.residents.includes(user.id)) return;
                        const d = [...item.residents];
                        if(d.findIndex(q => q === user.id) > -1) d.splice(d.findIndex(q => q === user.id), 1);
                        if (item.car_interrior) {
                            let int = getInteriorGarageById(item.car_interrior);
                            if (int) {
                                Vehicle.getPlayerVehicles(user.id).map(veh => {
                                    const pos = veh.position;
                                    if (pos.d === item.id) {
                                        if (system.distanceToPos2D({ x: pos.x, y: pos.y }, { x: int.cars[0].x, y: int.cars[0].y }) < 100) {
                                            veh.moveToParkingFine(houseVehicleRemoveFine, !veh.vehicle.usedAfterRespawn, 'Потеря дома')
                                        }
                                    }
                                })
                            }
                        }
                        CustomEvent.triggerClient(player, 'house:homeBlip:delete')
                        item.residents = d;
                        item.save();
                        menu.close(player);
                        player.notify('Вы успешно выселились', 'success');
                    })
                }
            })
        }
        if ((item.userId === user.id || user.isAdminNow(5))) {
            if(item.max_residents){
                m.newItem({
                    name: 'Список подселённых',
                    more: `${item.residents.length} из ${item.max_residents}`,
                    onpress: () => {
                        const s = () => {
                            User.getDatas(...item.residents).then(residents => {
                                const submenu = menu.new(player, "Список подселённых");
                                submenu.sprite = "house";
                                submenu.onclose = () => {
                                    houseMenu(player, int);
                                }
                                if(item.residents.length < item.max_residents){
                                    const nearestPlayer = user.getNearestPlayer(2);
                                    if(nearestPlayer){
                                        submenu.newItem({
                                            name: `Подселить ${nearestPlayer.user.name} #${nearestPlayer.dbid}`,
                                            onpress: () => {
                                                if(!nearestPlayer || !mp.players.exists(nearestPlayer)) return player.notify('Игрок отошёл слишком далеко', 'error');
                                                menu.accept(nearestPlayer, 'Вы хотите быть подселённым в дом?', 'small').then(status => {
                                                    if(!mp.players.exists(player)) return;
                                                    if(!status) return player.notify('Игрок отказался', 'error');
                                                    if(item.residents.length >= item.max_residents) return player.notify('У вас больше нет места для подселения', 'error');
                                                    if(houses.dataArray.find(q => q.residents.includes(nearestPlayer.dbid) || q.userId === nearestPlayer.dbid)){
                                                        player.notify('Игрок уже где то проживает', 'error');
                                                        nearestPlayer.notify('Вы уже где то проживаете', 'error');
                                                        return;
                                                    }
                                                    const q = [...item.residents];
                                                    q.push(nearestPlayer.dbid);
                                                    item.residents = q;
                                                    player.notify('Игрок успешно прописан', 'success');
                                                    nearestPlayer.notify('Вы успешно прописаны', 'success');
                                                    player.user.achiev.achievTickByType("inviteResident")
                                                    nearestPlayer.user.achiev.achievTickByType("beResident")
                                                    CustomEvent.triggerClient(nearestPlayer, 'house:homeBlip:create', 
                                                        JSON.stringify({x: item.x, y: item.y, z: item.z}))
                                                    item.save().then(() => {
                                                        if(mp.players.exists(player)) s();
                                                    });
                                                })
                                            }
                                        })
                                    } else {
                                        submenu.newItem({
                                            name: `Подселить игрока поблизости`,
                                            desc: 'Чтобы подселить игрока он должен быть поблизости'
                                        })
                                    }
                                } else {
                                    submenu.newItem({
                                        name: `Подселить игрока поблизости`,
                                        desc: 'В доме больше нет места чтобы подселить игрока'
                                    })
                                }
                                residents.map(resident => {
                                    submenu.newItem({
                                        name: resident.rp_name,
                                        more: `#${resident.id}`,
                                        onpress: () => {
                                            menu.accept(player, `Выселить ${resident.rp_name}?`).then(status => {
                                                if(!status) return;
                                                const d = [...item.residents];
                                                if(d.findIndex(q => q === resident.id) > -1) d.splice(d.findIndex(q => q === resident.id), 1);
                                                if (item.car_interrior) {
                                                    let int = getInteriorGarageById(item.car_interrior);
                                                    if (int) {
                                                        Vehicle.getPlayerVehicles(resident.id).map(veh => {
                                                            const pos = veh.position;
                                                            if (pos.d === item.id) {
                                                                if (system.distanceToPos2D({ x: pos.x, y: pos.y }, { x: int.cars[0].x, y: int.cars[0].y }) < 100) {
                                                                    veh.moveToParkingFine(houseVehicleRemoveFine, !veh.vehicle.usedAfterRespawn, 'Потеря дома')
                                                                }
                                                            }
                                                        })
                                                    }
                                                }
                                                item.residents = d;
                                                item.save().then(() => {
                                                    s();
                                                })
                                            })
                                        }
                                    })
                                })
                                submenu.open();
                            })
                        }
                        s();
                    }
                })
            }
        }
    }

    m.open();
}

interriors.map(int => {
    colshapes.new(new mp.Vector3(int.enter.x, int.enter.y, int.enter.z), int.type == "garage" ? "Меню гаража" : "Меню дома", player => {
        houseMenu(player, int);
    }, {
        // radius: int.type == "house" ? 1 : 3,
        dimension: -1
    })
})

colshapes.new(new mp.Vector3(HOUSE_STOCK_ENTER_POS.x, HOUSE_STOCK_ENTER_POS.y, HOUSE_STOCK_ENTER_POS.z), 'Выход', player => {
    if(!player.user) return
    if(!player.dimension) return;
    const house = houses.get(player.dimension);
    if(!house) return;
    const houseInt = getInteriorHouseById(house.interrior);
    player.user.teleport(houseInt.enter.x, houseInt.enter.y, houseInt.enter.z, houseInt.enter.h, player.dimension);
}, {
    dimension: -1,
    drawStaticName: 'scaleform'
})

mp.events.add("playerEnterVehicle", (player:PlayerMp, vehicle) => {
    if (!player.user) return;
    if (!vehicle.dbid) return;
    if (!player.dimension) return;
    if (vehicle.getOccupant(0) != player) return;
    let house = houses.get(player.dimension);
    if(!house) return;
    if (!houses.isEntityInGarage(vehicle, house)) return;
    vehicle.entity.engine = true;
    if(!house.forTp){
        player.user.teleportVeh(house.car_x, house.car_y, house.car_z, house.car_h, house.d);
    } else {
        const tpcfg = HousesTeleportsList[house.forTp - 1];
        if(!tpcfg) return player.notify('Возникла ошибка', 'error');
        player.user.teleportVeh(tpcfg.carExit.x, tpcfg.carExit.y, tpcfg.carExit.z, tpcfg.carH, 0);
    }
    setTimeout(() => {
        Vehicle.repair(vehicle)
    }, system.TELEPORT_TIME + 1000)
});

const CACHING_ITEMS_MS : number = 1000;
const _cachedAllMyItems : Map<number, { items: ItemEntity[], cachedMs: number }>
    = new Map<number, {items: ItemEntity[], cachedMs: number}>();
export const isPlayerHasHouseKey = (player: PlayerMp, house: HouseEntity) : boolean => {
    if (!_cachedAllMyItems.has(player.user.id)) {
        _cachedAllMyItems.set(player.user.id, { items: player.user.allMyItems, cachedMs: system.timestampMS });
    }

    const cache = _cachedAllMyItems.get(player.user.id);
    if (system.timestampMS > cache.cachedMs + CACHING_ITEMS_MS) {
        const items = player.user.allMyItems;
        cache.items = items;
        _cachedAllMyItems.set(player.user.id, { items: items, cachedMs: system.timestampMS });
    }

    return !!cache.items.find(itm => itm.item_id == houses.key_id && itm.advancedNumber == house.key && itm.advancedString == "house");
}

const enterGarage = (player: PlayerMp, house: HouseEntity) => {
    if (player.dimension === house.d && (!house.forFamily  && !house.userId) && (house.forFamily && house.familyId != player.user.family.id)) return player.notify("Гараж закрыт, поскольку дом не куплен", "error");
    let int = getInteriorGarageById(house.car_interrior);
    if (!int) return player.notify("Возникла ошибка внутри здания, сообщите администрации о данном моменте", "error")
    let haveAccess = false;
    if (player.user.isAdminNow(6)) haveAccess = true;
    if (!haveAccess) haveAccess = isPlayerHasHouseKey(player, house);
    if (!haveAccess) return player.notify("У вас нет ключей от дома", "error")

    const veh = player.vehicle;
    if(veh){
        const driver = veh.getOccupant(0);
        if(!driver || driver.id != player.id) return player.notify('Вы должны быть за рулём для того, чтобы заехать в гараж');
        if( !veh.entity || (!veh.entity.familyOwner && !veh.user) || !veh.dbid) return player.notify('Данный транспорт должен принадлежать владельцу дома', 'error');
        if(!house.garageAccessVehicle(veh)) return player.notify('Данный ТС не принадлежит владельцу дома', "error");
        const spawn_position = veh.entity.position;
        if (houses.isVehInHouse(house, veh)){
            player.user.teleportVeh(spawn_position.x, spawn_position.y, spawn_position.z, spawn_position.h, house.id);
        } else {
            let freeSlot = houses.getFreeVehicleSlot(house);
            if(!freeSlot) return player.notify("В гараже нет доступных слотов для того, чтобы разместить ещё один ТС", "error");
            veh.entity.position = {
                x: freeSlot.x,
                y: freeSlot.y,
                z: freeSlot.z,
                h: freeSlot.h,
                d: house.id
            }
            player.notify("Транспорт теперь будет храниться в данном гараже", "success");
            player.user.teleportVeh(freeSlot.x, freeSlot.y, freeSlot.z, freeSlot.h, house.id);
        }
        veh.entity.engine = false;
        setTimeout(() => {
            if (mp.vehicles.exists(veh)){
                veh.getOccupants().filter(target => mp.players.exists(target) && target.user).map(target => target.user.leaveVehicle())
                veh.usedAfterRespawn = false;
                veh.entity.engine = false;
            }
        }, system.TELEPORT_TIME)
    } else {
        player.user.teleport(int.enter.x, int.enter.y, int.enter.z, int.enter.h, house.id);
    }
}

export const HOUSES_LOADED_EVENT = 'houses:loaded';

export const houses = {
    setDoorOpenStatus: (house: HouseEntity, opened: boolean) => {
        house.opened = opened ? 1 : 0;
        let q = houses.dataList.get(house.id);
        if (q) (q[1] as ScaleformTextMp).text =  `${house.name} #${house.id}\n${house.userId || house.familyId ? `${house.opened ? '~g~Открыт' : '~r~Закрыт'}` : `~g~$${system.numberFormat(house.price)}`}`;
    },

    enterHouse: (player: PlayerMp, item: HouseEntity) => {
        if(!item) return;
        const houseInt = getInteriorHouseById(item.interrior);
        if(!houseInt) return;
        player.user.teleport(houseInt.enter.x, houseInt.enter.y, houseInt.enter.z, houseInt.enter.h, item.id);
        setTimeout(() => {
            if(mp.players.exists(player)) sendMiningData(player, item)
        }, system.TELEPORT_TIME * 1.2)
    },
    key_id: 805,
    data: new Map <number, HouseEntity>(),
    get dataArray(){
      return [...houses.data].map(q => q[1])
    },
    saveAll: () => {
        houses.dataArray
            .forEach(async house => await house.save());
    },
    dataList: new Map <number, { destroy: () => void}[]>(),
    getAllHouseInMultihouse(id: number){
        return houses.dataArray.filter(room => room.forTp === id)
    },
    getFreePosInMultihouse(id: number){
        const rooms = houses.getAllHouseInMultihouse(id);
        const cfg = HousesTeleportsList[id - 1];
        let startD = HOUSES_TELEPORT_SEPARATOR * id
        const coords = cfg.rooms.map(q => {
            return {
                x: q[0],
                y: q[1],
                z: q[2],
                h: q[3],
            }
        });
        let freeD: number;
        let freePos: {x: number, y: number, z: number, h: number};

        while(!freeD && startD < (HOUSES_TELEPORT_SEPARATOR * (id + 1))){
            const floorRoom = rooms.filter(q => q.d === startD);
            if(floorRoom.length < coords.length){
                freeD = startD;
                freePos = coords[floorRoom.length];
            } else {
                startD++;
            }
        }

        return freeD ? {...freePos, d: freeD} : null;

    },
    isEntityInGarage: (entity: EntityMp, house?: number | HouseEntity) => {
        if(!entity) return false;
        if(!entity.dimension) return false;
        if(!house) house = entity.dimension;
        let item = typeof house === "number" ? houses.get(house) : house;
        let int = getInteriorGarageById(item.car_interrior);
        if (!int) return false;
        if(entity.dimension !== item.id) return false;
        return system.isPointInPoints(entity.position, int.cars, 60)
    },
    isVehInHouse: (house: number | HouseEntity, vehicle: VehicleMp) => {
        if (!mp.vehicles.exists(vehicle)) return false;
        if (!vehicle.dbid) return false;
        if (!vehicle.entity) return false;
        let item = typeof house === "number" ? houses.get(house) : house;
        if (!item) return false;
        const spawn = vehicle.entity.position
        if(item.air_x && spawn.d === item.air_d && system.distanceToPos(spawn, {x: item.air_x, y: item.air_y, z: item.air_z}) < 5) return true;

        let int = getInteriorGarageById(item.car_interrior);
        if (!int) return false;
        return spawn.d === item.id && system.isPointInPoints(spawn, int.cars)
    },
    vehiclesInHouses: (house: number | HouseEntity) => {
        let item = typeof house === "number" ? houses.get(house) : house;
        if(!item) return []
        if(!item.familyId && !item.userId) return [];
        return Vehicle.toArray().filter(veh => veh.dbid && veh.entity && !veh.entity.onParkingFine
            && ((!item.forFamily && veh.entity.owner && item.userList.includes(veh.entity.owner) )
                || (item.forFamily && veh.entity.familyOwner && veh.entity.familyOwner === item.familyId))).filter(q => houses.isVehInHouse(item, q))
    },
    getFreeVehicleSlot: (house: number | HouseEntity, air = false) => {
        let item = typeof house === "number" ? houses.get(house) : house;
        if(!item) return null;
        if(air){
            if(!item.air_x) return null;
            let vehsPos = houses.vehiclesInHouses(item).map(veh => {
                return veh.entity.position
            });
            if(system.isPointInPoints(new mp.Vector3(item.air_x, item.air_y, item.air_z), vehsPos)) return null;
            return {x: item.air_x, y: item.air_y, z: item.air_z, h: item.air_h, d: item.air_d}
        }
        let int = getInteriorGarageById(item.car_interrior);
        if(!int) return null
        let vehsPos = houses.vehiclesInHouses(item).map(veh => {
            return veh.entity.position
        });
        let freeSlot: interriorPointData;
        int.cars.map(slot => {
            if(freeSlot) return;
            let free = !system.isPointInPoints(slot, vehsPos, 3)
            if(free) freeSlot = slot
        })
        if (!freeSlot) return null;
        return { ...freeSlot, d: item.id};
    },
    load: () => {
        console.time("Загрузка домов")
        return new Promise((resolve, reject) => {
            HouseEntity.find().then(items => {
                items.map(item => houses.loadItem(item))
                console.timeEnd("Загрузка домов")
                resolve(null)

                mp.events.call(HOUSES_LOADED_EVENT, items);
            })
        })
    },
    get: (id:number) => {
        return houses.data.get(id)
    },
    getByOwner: (id:number): HouseEntity => {
        return [...houses.data].map(q => q[1]).find(q => q.userId === id)
    },
    getByFamilyId: (id: number): HouseEntity => {
        return [...houses.data].map(q => q[1]).find(q => q.familyId === id)
    },
    getByUserList: (id:number): HouseEntity => {
        return [...houses.data].map(q => q[1]).find(q => q.userList.includes(id))
    },
    getVehicleSlots: (house: number | HouseEntity) => {
        let item = typeof house === "number" ? houses.get(house) : house;
        if (!item.car_interrior) return null;
        return getInteriorGarageById(item.car_interrior).cars;
    },
    moveAllVehOnParkingFine: (house: number | HouseEntity) => {
        houses.vehiclesInHouses(typeof house === "number" ? house : house.id).map(q => q.entity.moveToParkingFine(0, !q.usedAfterRespawn))
    },
    delete: async (house: number | HouseEntity) => {
        let item = typeof house === "number" ? houses.get(house) : house;
        houses.moveAllVehOnParkingFine(house);
        houses.dataList.get(item.id).map(q => q.destroy());
        houses.data.delete(item.id);
        houses.dataList.delete(item.id);
        await item.remove();
    },
    setOwner: (house:number|HouseEntity, owner:number|PlayerMp, isFamily: boolean, save = true) => {
        return new Promise(async (resolve) => {
            let houseEntity = typeof house === "number" ? houses.get(house) : house;
            if (!owner) houseEntity.stock = 0;
            if (!owner) houseEntity.haveChestLevel = 0;
            if (!owner || (!houseEntity.familyId && !houseEntity.userId)) houseEntity.tax = 0;
            const targetId = !owner ? 0 : (typeof owner === "number" ? owner : owner.user.id);
            if (houseEntity.userId) {
                houseEntity.key = system.getRandomInt(10000000, 90000000);
                houseEntity.tax = 0;
                let int = getInteriorGarageById(houseEntity.car_interrior);
                User.getDatas(...houseEntity.userList).then(users => {
                    if (!users) return;
                    users.map(userEntity => {
                        if (targetId === userEntity.id && !houseEntity.forFamily) return;
                        const vehs = houseEntity.air_x || houseEntity.car_interrior ? Vehicle.getPlayerVehicles(userEntity.id) : []
                        if (houseEntity.car_interrior) {
                            if (int) {
                                vehs.map(veh => {
                                    const pos = veh.position;
                                    if (pos.d === houseEntity.id) {
                                        if (system.isPointInPoints({x: pos.x, y: pos.y}, int.cars)) {
                                            veh.moveToParkingFine(houseVehicleRemoveFine, !veh.vehicle.usedAfterRespawn, 'Потеря дома')
                                        }
                                    }
                                })
                            }
                        }
                        if (houseEntity.air_x) {
                            vehs.map(veh => {
                                const pos = veh.position;
                                if (pos.d === houseEntity.air_d) {
                                    if (system.isPointInPoints({x: pos.x, y: pos.y}, [{
                                        x: houseEntity.air_x,
                                        y: houseEntity.air_y
                                    }])) {
                                        veh.moveToParkingFine(houseVehicleRemoveFine, !veh.vehicle.usedAfterRespawn, 'Потеря дома')
                                    }
                                }
                            })
                        }
                    })
                })
            }
            if (houseEntity.familyId) Vehicle.getFamilyVehicles(houseEntity.familyId).map(veh => veh.moveToParkingFine(houseVehicleRemoveFine, !veh.vehicle.usedAfterRespawn, 'Потеря дома'))

            houseEntity.residents = [];

            if (typeof isFamily === 'boolean') houseEntity.forFamily = isFamily ? 1 : 0

            if (houseEntity.userId) {
                const oldOwner = User.get(houseEntity.userId);
                if (oldOwner) CustomEvent.triggerClient(oldOwner, 'house:homeBlip:delete')
            }

            if (targetId) {
                if (houseEntity.forFamily) {
                    houseEntity.familyId = owner as number;
                    houseEntity.car_interrior = DEFAULT_FAMILY_HOUSE_GARAGE;
                    houseEntity.haveChest = 1
                    houseEntity.haveMoneyChest = 1;
                    houseEntity.family = Family.getByID(owner as number).entity
                } else {
                    const target = User.get(targetId);
                    if (target) {
                        houseEntity.user = target.user.entity;
                        houseEntity.userId = target.user.entity.id;
                        houseEntity.tax = houseEntity.taxDay * 2;
                        target.user.achiev.achievTickByType("buyHouse");
                        target.notify('Налоги оплачены на 2 дня. Не забудьте оплатить их на более длительный срок', 'warning');
                    } else {
                        const q = await User.getData(targetId)
                        if (q) {
                            houseEntity.user = q;
                            houseEntity.userId = q.id;
                            await q.save()
                        } else {
                            houseEntity.haveChest = 0
                            houseEntity.haveMoneyChest = 0
                            houseEntity.user = null;
                            houseEntity.userId = 0;
                        }
                    }
                }
            } else {
                houseEntity.miningData = null;
                houseEntity.user = null;
                houseEntity.family = null;
                houseEntity.userId = 0;
                houseEntity.familyId = 0;
                houseEntity.haveChest = 0;
                houseEntity.haveMoneyChest = 0;
            }

            let blip = mp.blips.toArray().find(bl => bl.house == houseEntity.id);
            if (blip) blip.color = !!houseEntity.userId || !!houseEntity.familyId ? 1 : 2


            if (blip) {
                if (houseEntity.forFamily && houseEntity.familyId) blip.dimension = 1234567;
                else if (!houseEntity.forFamily && houseEntity.userId) blip.dimension = 1234567;
                else blip.dimension = houseEntity.d;
                blip.color = !!houseEntity.userId || !!houseEntity.familyId ? 1 : 2;
            }
            const target = User.get(targetId);
            if (target) {
                CustomEvent.triggerClient(target, 'house:homeBlip:create', JSON.stringify(new mp.Vector3(
                    houseEntity.x,
                    houseEntity.y,
                    houseEntity.z
                )));
            }

            let q = houses.dataList.get(houseEntity.id);

            if (q) (q[0] as ScaleformTextMp).text = `${houseEntity.name} #${houseEntity.id}\n${houseEntity.userId || houseEntity.familyId ? `${houseEntity.opened ? '~g~Открыт' : '~r~Закрыт'}` : `~g~$${system.numberFormat(houseEntity.price)}`}`;

            if (houseEntity.haveMoneyChest) {
                q.push(colshapes.new(HOUSE_MONEY_POS, `Денежный сейф`, (p) => houses.openMoneyChestMenu(p, houseEntity), {
                    color: [100, 103, 163, 100],
                    dimension: houseEntity.id,
                    type: 1,
                    drawStaticName: "scaleform"
                }))
            }

            houses.updateScaleformText(houseEntity);
            if (save) await saveEntity(houseEntity);
            return resolve(null)
        })
    },
    updateScaleformText: (item: HouseEntity) => {
        let q = houses.dataList.get(item.id);
        if (q) (q[1] as ScaleformTextMp).text = `${item.name} #${item.id}\n${item.userId || item.familyId ? `${item.opened ? '~g~Открыт' : '~r~Закрыт'}` : `~g~$${system.numberFormat(item.price)}`}`;
    },
    buyHouse: (player: PlayerMp, item: HouseEntity, res: ()=>void) => {
        const user = player.user;
        if(!user) return;
        const m = menu.new(player, "Покупка дома", `${item.name} #${item.id}`);
        m.sprite = "house";

        m.newItem({
            name: 'Стоимость',
            more: `$${system.numberFormat(item.price)}`
        })


        m.newItem({
            name: 'Купить себе',
            onpress: async () => {
                if (!item.canPurchase) return player.notify('Данный дом ещё недоступен для покупки');
                if(item.userId || item.familyId) return player.notify('Данный дом уже куплен', 'error');
                if (player.user.houseEntityLive) return player.notify("Вы уже прописаны", "error")
                if (await player.user.tryPayment(item.price, "all", () => {
                    return !(item.userId || item.familyId)
                }, "Приобрёл дом #" + item.id, "Риелторское агенство")) {
                    item.user = player.user.entity;
                    item.key = system.getRandomInt(10000000, 90000000);
                    houses.setOwner(item, player, false);
                    player.notify("Дом успешно приобретён")
                    inventory.createItem({
                        owner_type: OWNER_TYPES.PLAYER,
                        owner_id: player.user.id,
                        item_id: houses.key_id,
                        advancedNumber: item.key,
                        advancedString: "house",
                        serial: `Дом ${item.name} #${item.id}`,
                    })
                    if(res) res();
                }
            }
        })

        m.newItem({
            name: 'Купить в семью',
            onpress: async () => {
                const family = user.family;
                if (!item.canPurchase) return player.notify('Данный дом ещё недоступен для покупки');
                if (!family || !family.isCan(user.familyRank, 'buyHouse')) return player.notify("Вы не можете покупать дом для семьи", "error")
                const allowClass = family.getFamilyCanHouseClass;
                if(!!item.forTp && !allowClass.inMultiHouse)
                    return player.notify('Уровень Вашей семьи не позволяет иметь дом выбранной категории.', "error")
                if(!!item.air_x && !allowClass.inHouseWithAir)
                    return player.notify('Уровень Вашей семьи не позволяет иметь дом выбранной категории. Попробуйте купить дом без вертолетной площадки или квартиру в многоквартирном здании', "error")
                if(!item.forTp && !item.air_x && !allowClass.inCustomHouse)
                    return player.notify('Уровень Вашей семьи не позволяет иметь дом выбранной категории. Попробуйте купить квартиру в многоквартирном здании', "error")
                if (family.house) return player.notify('У вашей семьи уже есть дом', 'error');
                if (family.money < item.price) return player.notify('У вашей семьи недостаточно средств', 'error');
                family.removeMoney(item.price, player,`Покупка дома ${item.name} #${item.id}`)
                player.notify('Дом успешно приобретён', 'success')
                houses.setOwner(item, family.id, true)
                if(res) res();
            }
        })

        m.open()
    },
    clearHouseEntities: (house: HouseEntity) => {
        const entities = houses.dataList.get(house.id);
        for (let entity of entities) {
            entity.destroy();
        }
    },
    loadItem: async (item: HouseEntity) => {
        Vehicle.addBlockNpcCarZone(new mp.Vector3(item.x, item.y, item.z))
        houses.data.set(item.id, item);
        let ents:any[] = []
        /*
        const blip = system.createBlip(492, 2, new mp.Vector3(item.x, item.y, item.z), !!item.familyId ? 'Семейный дом':'Дом', item.d)
        
        blip.scale = system.blipBaseScale / 1.5;
        blip.house = item.id;
        if (item.userId || (item.familyId)) blip.dimension = 1234567;
        else blip.dimension = item.d;
        ents.push(blip)
        */

        const furnitureResult = await FurnitureEntity.find({
            where: {
                houseId: item.id
            }
        })

        if (furnitureResult) {
            item.furnitureData = furnitureResult;
        }


        const houseInt = getInteriorHouseById(item.interrior);
        ents.push(new ScaleformTextMp(new mp.Vector3(item.x, item.y, item.z + 1),  `${item.name} #${item.id}\n${item.userId || item.familyId ? `${item.opened ? '~g~Открыт' : '~r~Закрыт'}` : `~g~$${system.numberFormat(item.price)}`}`, {
            dimension: item.d
        }));
        ents.push(colshapes.new(new mp.Vector3(item.x, item.y, item.z), () => { return `${item.name} #${item.id}`}, player => {
            if (!houseInt) return player.notify("Возникла ошибка внутри здания, сообщите администрации о данном моменте", "error")
            const cmenu = async () => {
                const user = player.user
                const m = menu.new(player, "", `${item.name} #${item.id}`)
                m.sprite = "house";
                if (!item.userId && !item.familyId) {
                    m.newItem({
                        name: "Купить",
                        more: `$${system.numberFormat(item.price)}`,
                        desc: `${item.forFamily ? `${item.forTp ? 'Квартира' : 'Дом'} для семьи` : `${item.forTp ? 'Квартира' : 'Дом'} для игрока`}`,
                        onpress: async () => {
                            houses.buyHouse(player, item, cmenu);
                        }
                    })
                    m.newItem({
                        name: "Гараж",
                        more: `${item.car_interrior ? '~g~Имеется (' + getInteriorGarageById(item.car_interrior).cars.length + ' ТС)' : '~r~Отсутствует'}`
                    })
                    m.newItem({
                        name: "Склад",
                        more: `${item.haveChest ? '~g~Имеется' : '~r~Отсутствует'}`
                    })
                    if(item.haveChest){
                        m.newItem({
                            name: "Денежный сейф",
                            more: `${item.haveMoneyChest ? '~g~Имеется' : '~r~Отсутствует'}`
                        })
                    }
                    m.newItem({
                        name: "Вертолетная площадка",
                        more: `${!!item.air_x ? '~g~Имеется' : '~r~Отсутствует'}`
                    })
                    m.newItem({
                        name: "Хранилище",
                        more: `${houseInt.stock ? '~g~Имеется' : '~r~Отсутствует'}`
                    })
                    m.newItem({
                        name: "Осмотреть дом",
                        onpress: () => {
                            m.close();
                            if (item.userId) return player.notify("Дом уже приобретён", 'error')
                            player.user.teleport(houseInt.enter.x, houseInt.enter.y, houseInt.enter.z, houseInt.enter.h, item.id);
                        }
                    })
                } else {
                    if(item.userId) {
                        const owner = await User.getData(item.userId);
                        if (owner) {
                            m.newItem({
                                name: `Владелец дома`,
                                desc: `${owner.rp_name} (${owner.id})`
                            })
                        }
                    }
                    if(item.familyId) {
                        const owner = Family.getByID(item.familyId)
                        if(owner) {
                            m.newItem({
                                name: `Дом семьи`,
                                desc: `${owner.name}`
                            })
                        }
                    }
                    if (player.user.hasPermission('admin:houses:door') || !!user.allMyItems.find(itm => itm.item_id == houses.key_id && itm.advancedNumber == item.key && itm.advancedString == "house")) {
                        m.newItem({
                            name: "Дверь",
                            more: !item.opened ? "~g~Закрыта" : "~r~Открыта",
                            onpress: () => {
                                m.close();
                                if (player.user.spam(1000)) return player.notify('Не торопитесь', 'error');

                                houses.setDoorOpenStatus(item, !item.opened);

                                player.notify("Дверь " + (item.opened ? "открыта" : "закрыта"), "success");
                                Logs.new(`house_door_${item.id}`, `${user.name} [${user.id}]`, `${item.opened ? 'Открыл' : 'Закрыл'} дверь`);
                                item.save();
                            },
                        })
                        m.newItem({
                            name: "Записи дверного замка",
                            desc: 'Вы можете посмотреть кто открывал и закрывал дверной замок',
                            onpress: () => {
                                Logs.open(player,`house_door_${item.id}`, `Дверь ${item.name} #${item.id}`);
                            },
                        })
                    }
                    m.newItem({
                        name: "Войти в дом",
                        onpress: () => {
                            m.close();
                            let haveAccess = !!item.opened;
                            if (player.user.isAdminNow(6)) haveAccess = true;
                            if (!item.key) haveAccess = true;
                            if (!haveAccess) haveAccess = !!player.user.allMyItems.find(itm => itm.item_id == houses.key_id && itm.advancedNumber == item.key && itm.advancedString == "house");
                            if (!haveAccess) return player.notify("У вас нет ключей от дома", "error")
                            player.user.teleport(houseInt.enter.x, houseInt.enter.y, houseInt.enter.z, houseInt.enter.h, item.id);
                            houses.enterHouse(player, item)
                            furniture.enterHouse(player, item);
                        }
                    })
                    if (item.userId === player.user.id || player.user.isAdminNow(6) || (item.forFamily && user.familyId === item.familyId && user.family.isCan(user.familyRank, 'keyDublicate'))) {
                        m.newItem({
                            name: "Сделать дубликат ключей от дома",
                            more: `$${system.numberFormat(houseKeyCost)}`,
                            onpress: async () => {
                                m.close();
                                let haveAccess = false;
                                if (player.user.isAdminNow(6)) haveAccess = true;
                                if (!haveAccess) {
                                    haveAccess = await player.user.tryPayment(houseKeyCost, "all", () => {
                                        return (item.userId === player.user.id || player.user.isAdminNow(6) || (item.forFamily && user.familyId === item.familyId && user.family.isCan(user.familyRank, 'keyDublicate')))
                                    }, "Оплата услуг по выпуску дубликата ключей для дома #" + item.id, "Обслуживание дома")
                                }
                                if (!haveAccess) return;
                                inventory.createItem({
                                    owner_type: OWNER_TYPES.PLAYER,
                                    owner_id: player.user.id,
                                    item_id: houses.key_id,
                                    advancedNumber: item.key,
                                    advancedString: "house",
                                    serial: `Дом ${item.name} #${item.id}${item.forFamily ? ` для ${user.name}` : ``}`,
                                })
                                player.notify("Вы получили дубликат ключей", "success")
                            }
                        })
                        if(item.haveChest){
                            m.newItem({
                                name: "Сделать дубликат ключей от склада",
                                more: `$${system.numberFormat(houseKeyCost)}`,
                                onpress: async () => {
                                    m.close();
                                    let haveAccess = false;
                                    if (player.user.isAdminNow(6)) haveAccess = true;
                                    if (!haveAccess) {
                                        haveAccess = await player.user.tryPayment(houseKeyCost, "all", () => {
                                            return (item.userId === player.user.id || player.user.isAdminNow(6) || (item.forFamily && user.familyId === item.familyId && user.family.isCan(user.familyRank, 'keyDublicate')))
                                        }, "Оплата услуг по выпуску дубликата ключей для склада дома #" + item.id, "Обслуживание дома")
                                    }
                                    if (!haveAccess) return;
                                    inventory.createItem({
                                        owner_type: OWNER_TYPES.PLAYER,
                                        owner_id: player.user.id,
                                        item_id: houses.key_id,
                                        advancedNumber: item.key,
                                        advancedString: "house_chest",
                                        serial: `Склад дома ${item.name} #${item.id}${item.forFamily ? ` для ${user.name}` : ``}`,
                                    })
                                    player.notify("Вы получили дубликат ключей", "success")
                                }
                            })
                        }
                        if(item.userId === player.user.id || player.user.isAdminNow(6) || (item.forFamily && user.family.isCan(user.familyRank, 'changeLock'))){
                            m.newItem({
                                name: "Сменить замок",
                                more: `$${system.numberFormat(houseLockRepairCost)}`,
                                desc: "При смене замка все существующие ключи перестанут подходить",
                                onpress: async () => {
                                    m.close();
                                    let haveAccess = false;
                                    if (player.user.isAdminNow(6)) haveAccess = true;
                                    if (!haveAccess) {
                                        if(item.forFamily){
                                            if(user.family && user.family.money > houseLockRepairCost) {
                                                haveAccess = true
                                                user.family.removeMoney(houseLockRepairCost, player, `Смена замка на доме #${item.id}`)
                                            } else {
                                                player.notify('У вашей семьи недостаточно средств для смены замка', 'error');
                                            }
                                        } else {
                                            haveAccess = await player.user.tryPayment(houseLockRepairCost, "all", () => {
                                                return (item.userId === player.user.id || player.user.isAdminNow(6) || (item.forFamily && user.familyId === item.familyId && user.family.isCan(user.familyRank, 'changeLock')))
                                            }, "Оплата услуг мастера по смене замка для дома #" + item.id, 'Обслуживание дома')
                                        }
                                    }
                                    if (!haveAccess) return;
                                    item.key = system.getRandomInt(10000000, 90000000);
                                    item.save();
                                    player.notify("Замок заменён", "success")
                                }
                            })
                        }
                    }
                }
                if (item.userId === player.dbid || (item.forFamily && item.familyId === user.familyId && user.family.isCan(user.familyRank, 'sellHouse'))) {
                    m.newItem({
                        name: `Продать в государство`,
                        more: `$${system.numberFormat(item.price - ((item.price / 100) * SELL_GOS_TAX_PERCENT))}`,
                        desc: `Комиссия за продажу имущества в гос - ${SELL_GOS_TAX_PERCENT}%`,
                        onpress: () => {
                            const vehs = houses.vehiclesInHouses(item).length
                            menu.accept(player, `Вы уверены?${vehs > 0 ? ' Весь транспорт находящийся в гараже дома будет отправлен на штрафстоянку' : ''}`).then(status => {
                                if (!status) return;
                                if(item.forFamily){
                                    if(!item.familyId || item.familyId !== user.familyId) return player.notify('Дом уже не принадлежит вашей семье', 'error');
                                    user.family.addMoney(item.price - ((item.price / 100) * SELL_GOS_TAX_PERCENT), player,'Продажа дома в государство')
                                } else {
                                    if (!user.bank_have) return player.notify('У вас должен быть счёт в банке для продажи дома', "error");
                                    if (item.userId !== player.dbid) return;
                                    user.addBankMoney(item.price - ((item.price / 100) * SELL_GOS_TAX_PERCENT), true, `Продажа дома ${item.name} ${item.id} государству`, 'Риэлторское агентство')
                                }
                                houses.setOwner(item, null, true);
                                player.notify('Дом успешно продан', 'success')
                                menu.close(player);
                            })
                        }

                    })
                    if(item.userId === player.dbid){
                        const target = user.getNearestPlayer(2);
                        if (target && !item.forFamily) {
                            m.newItem({
                                name: `Продать игроку`,
                                onpress: () => {
                                    const vehs = houses.vehiclesInHouses(item).length
                                    menu.accept(player, `Вы уверены?${vehs > 0 ? ' Весь транспорт находящийся в гараже дома будет отправлен на штрафстоянку' : ''}`).then(async status => {
                                        if (!status) return;
                                        if (!mp.players.exists(target)) return;
                                        if (!user.bank_have) return player.notify('У вас должен быть счёт в банке для продажи дома', "error");
                                        if (!target.user.bank_have) return target.notify('У вас должен быть счёт в банке для покупки дома', "error");
                                        if (target.user.house) return target.notify('Вы не можете иметь несколько домов одновременно', "error");
                                        const sum = await menu.input(player, 'Введите сумму', '', 7, 'int');
                                        if(!sum || sum < 0) return;
                                        menu.accept(target, `Вы хотите приобрести дом за ${system.numberFormat(sum)}?`).then(status2 => {
                                            if (!status2) return;
                                            if (!mp.players.exists(target)) return;
                                            if (!mp.players.exists(player)) return;
                                            if(user.house !== item.id) return player.notify('Дом вам не принадлежит', 'error'), target.notify('Владелец дома сменился', 'error');
                                            if (target.user.tryRemoveBankMoney(sum, true, `Покупка дома ${item.name} ${item.id} у ${player.user.name} ${player.dbid}`, 'Риэлторское агентство')) {
                                                houses.setOwner(item, target, false);
                                                user.addBankMoney(sum, true, `Продажа дома ${item.name} ${item.id} жителю ${target.user.name} ${target.dbid}`, 'Риэлторское агентство')
                                                player.notify('Сделка прошла успешно', 'success')
                                                target.notify('Сделка прошла успешно', 'success')
                                            } else {
                                                player.notify('Сделка не состоялась', 'error')
                                                target.notify('Сделка не состоялась', 'error')
                                            }
                                            menu.close(player);
                                            menu.close(target);
                                        })


                                    })
                                }
                            })
                        }
                    }
                }
                if (player.user.hasPermission('admin:gamedata:edithouse')) {
                    m.newItem({
                        name: "~b~Управлени домом",
                        onpress: async () => {}
                    })
                    m.newItem({
                        name: "Сменить стоимость дома",
                        more: `$${system.numberFormat(item.price)}`,
                        onpress: async () => {
                            m.close();
                            menu.input(player, 'Введите новую стоимость дома', item.price, 7, 'int').then(status => {
                                if (!status || status < 0 || status > 9999999) return;
                                const lastValue = item.price;
                                item.price = status;
                                houses.updateScaleformText(item);
                                cmenu()
                                writeSpecialLog(`Изменил стоимость дома с ${item.price} на ${status} (HID)`, player, item.id);
                                player.notify('Стоимость дома изменена', 'success')
                                saveEntity(item)
                            })
                        }
                    })
                    m.newItem({
                        name: "Сменить инту дома",
                        desc: 'Убедитесь что внутри никого нет, чтобы игрок не застрял',
                        more: item.interrior ? getInteriorHouseById(item.interrior).name : "~r~Необходимо указать",
                        onpress: () => {

                            const ints:[number, string][] = interriors.filter(q => q.type === "house").map(q => {
                                return [q.id, `${q.name}`]
                            });
                            const z = ints.findIndex(q => q[0] === item.interrior)

                            menu.selector(player, 'Выбор инты', ints.map(q => `${q[0]}) ${q[1]}`), true, null, true, z > -1 ? z : 0).then(index => {
                                if(typeof index !== "number") return;
                                if(!ints[index]) return;
                                item.interrior = ints[index][0];
                                furniture.clearPlacementFurniture(player, item);
                                saveEntity(item);
                                cmenu();
                                player.notify('Инта изменена', 'success')
                            })
                        }
                    })
                    m.newItem({
                        name: "Сменить инту гаража",
                        desc: 'Убедитесь что внутри никого нет, чтобы игрок не застрял. Так же учитывайте, что если дом уже куплен - все ТС, что привязаны к дому отправятся на штрафстоянку. Это необходимость',
                        more: item.car_interrior ? getInteriorGarageById(item.car_interrior).name : "~r~Гаража нет",
                        onpress: () => {

                            const ints:[number, string][] = interriors.filter(q => q.type === "garage").map(q => {
                                return [q.id, `${q.name}`]
                            });
                            const z = ints.findIndex(q => q[0] === item.car_interrior)

                            menu.selector(player, 'Выбор инты', ints.map(q => `${q[0]}) ${q[1]}`), true, null, true, z > -1 ? z : 0).then(index => {
                                if(typeof index !== "number") return;
                                if(!ints[index]) return;
                                item.car_interrior = ints[index][0];
                                saveEntity(item);
                                cmenu();
                                player.notify('Инта изменена', 'success')
                            })
                        }
                    })
                    m.newItem({
                        name: "~r~Удалить дом",
                        onpress: async () => {
                            m.close();
                            menu.accept(player).then(status => {
                                if (!status) return;
                                writeSpecialLog(`Удалил дом ${houses.get(item.id).x}, ${houses.get(item.id).y}, ${houses.get(item.id).z}`, player, item.userId ? item.userId : 0);
                                houses.delete(item);
                                player.notify('Дом удалён', 'success')
                            })
                        }
                    })
                    m.newItem({
                        name: "~r~Удалить майнинг",
                        onpress: async () => {
                            m.close();
                            menu.accept(player).then(status => {
                                if (!status) return;
                                item.miningData = null;
                                item.save();
                            })
                        }
                    })
                }

                invokeHook(HOUSES_ENTER_MENU_HOOK, player, item, m, cmenu);

                m.open();
            }
            cmenu();
        }, {
            dimension: item.d,
            type: -1
        }))
        if(item.car_interrior && !item.forTp){
            ents.push(colshapes.new(new mp.Vector3(item.car_x, item.car_y, item.car_z + 0.03), () => { return `Гараж ${item.name} #${item.id}`}, player => {
                const m = menu.new(player, "", `Гараж ${item.name} #${item.id}`)
                m.sprite = "house";
                
                m.newItem({
                    name: "Войти в гараж",
                    onpress: async () => {
                        m.close();
                        enterGarage(player, item)
                    }
                })
                
                m.open();
            }, {
                dimension: item.car_d,
                color: [255, 0, 0, 60],
                type: 27,
                radius: 4,
                predicate: player => {
                    return player.user && (player.user.isAdminNow(6) || isPlayerHasHouseKey(player, item));
                }
            }, 'admin', 'houseKey'))
        }
        if(item.haveMoneyChest){
            ents.push(colshapes.new(HOUSE_MONEY_POS, `Денежный сейф`, (p) => houses.openMoneyChestMenu(p, item), {
                color: [100, 103, 163, 100],
                dimension: item.id,
                type: 1,
                drawStaticName: "scaleform"
            }))
        }
        houses.dataList.set(item.id, ents)
    },
    openMoneyChestMenu: (player: PlayerMp, item: HouseEntity) => {
        const user = player.user;
        if(!user) return;
        const m = menu.new(player, 'Денежный сейф');
        m.newItem({
            name: 'Баланс',
            more: `$${system.numberFormat(item.moneyChest)}`
        })
        m.newItem({
            name: 'Взять средства',
            onpress: () => {
                if(!item.forFamily && item.userId !== user.id) return player.notify('Вы не можете брать деньги с сейфа')
                if(item.forFamily && ((item.familyId !== user.familyId) || !user.family || !user.family.isCan(user.familyRank, 'money_take'))) return player.notify('Вы не можете брать деньги с сейфа')
                menu.close(player);
                menu.input(player, 'Введите сумму', Math.min(100, item.moneyChest), 8, 'int').then(sum => {
                    if(!sum || isNaN(sum) || sum <= 0) return;
                    if(!item.forFamily && item.userId !== user.id) return player.notify('Вы не можете брать деньги с сейфа')
                    if(item.forFamily && ((item.familyId !== user.familyId) || !user.family || !user.family.isCan(user.familyRank, 'money_take'))) return player.notify('Вы не можете брать деньги с сейфа')
                    if(sum > item.moneyChest) return player.notify('Указанной суммы нет в сейфе', 'error');
                    user.addMoney(sum, true, `Взял деньги с сейфа дома ${item.id}`);
                    item.removeMoneyChest(sum, player, 'Взял деньги с сейфа')
                })
            }
        })
        m.newItem({
            name: 'Положить средства',
            onpress: () => {
                menu.close(player);
                menu.input(player, 'Введите сумму', Math.min(100, user.money), 8, 'int').then(sum => {
                    if(!sum || isNaN(sum) || sum <= 0) return;
                    if(sum > user.money) return player.notify('У вас нет указанной суммы', 'error');
                    user.removeMoney(sum, true, `Положил деньги в сейф дома ${item.id}`);
                    item.addMoneyChest(sum, player, 'Положил деньги в сейф')
                })
            }
        })
        m.newItem({
            name: 'Записи',
            onpress: () => {
                Logs.open(player, `housemoney_${item.id}`, 'Сейф')
            }
        })
        if((user.grab_money_shop || user.grab_money) && item.forFamily){
            let amount = user.grab_money ? user.grab_money : user.grab_money_shop;
            m.newItem({
                name: "Разгрузить сумку с деньгами",
                more: `$${system.numberFormat(amount)}`,
                onpress: () => {
                    amount = user.grab_money ? user.grab_money : user.grab_money_shop;
                    if (!amount) return;
                    m.close();
                    item.addMoneyChest(amount, player, 'Разгрузил сумку с деньгами')
                    user.grab_money_shop = 0;
                    user.grab_money = 0;
                    player.notify("Вы успешно разгрузили сумку с деньгами", "success");
                }
            })
        }
        m.open()
    },
    createNewHouseMenu: async (player:PlayerMp, item?: HouseEntity) => {
        if(!item){
            item = new HouseEntity();
            item.name = await CustomEvent.callClient(player, "currentStreet")
            item.price = 0;
        }
        const m = menu.new(player, "Создание дома")

        if(!item.forTp){
            m.newItem({
                name: "Название (Адрес улицы)",
                more: item.name,
                onpress: () => {
                    menu.input(player, "Название", item.name, 100).then(val => {
                        if(val) item.name = val;
                        houses.createNewHouseMenu(player, item);
                    })
                }
            })
        }
        m.newItem({
            name: "Стоимость",
            more: `$${system.numberFormat(item.price)}`,
            onpress: () => {
                menu.input(player, "Стоимость", item.price, 100, "int").then(val => {
                    if (val) item.price = val;
                    houses.createNewHouseMenu(player, item);
                })
            }
        })
        // m.newItem({
        //     type: 'list',
        //     name: "Для семьи",
        //     list: ['Нет', 'Да'],
        //     listSelected: item.forFamily,
        //     onchange: (val) => {
        //         item.forFamily = val
        //     }
        // })

        m.newItem({
            type: 'list',
            name: "Для многоквартиного дома",
            list: ['Нет', ...HousesTeleportsList.map(q => q.name)],
            listSelected: item.forTp,
            onchange: (val) => {
                let change = !!item.forTp != !!val;
                item.forTp = val;
                if(change) houses.createNewHouseMenu(player, item)
            }
        })
        if(!item.forTp){
            m.newItem({
                name: "Вертолётная площадка",
                more: item.air_x ? "~g~Указано" : "~r~Можно выбрать",
                onpress: () => {
                    item.air_x = player.position.x;
                    item.air_y = player.position.y;
                    item.air_z = player.position.z - 1;
                    item.air_h = player.heading;
                    item.air_d = player.dimension;
                    player.notify("Метка вертолётной площадки установлена", "success")
                    houses.createNewHouseMenu(player, item);
                }
            })
            m.newItem({
                name: "Место входа",
                more: item.x ? "~g~Указано" : "~r~Необходимо выбрать",
                onpress: () => {
                    item.x = player.position.x;
                    item.y = player.position.y;
                    item.z = player.position.z - 1;
                    item.h = player.heading;
                    item.d = player.dimension;
                    player.notify("Метка дома установлена", "success")
                    houses.createNewHouseMenu(player, item);
                }
            })
        } else {
            item.name = HousesTeleportsList[item.forTp - 1].name;
            if(!item.x){
                const pos = houses.getFreePosInMultihouse(item.forTp)
                if(pos){
                    item.x = pos.x;
                    item.y = pos.y;
                    item.z = pos.z;
                    item.h = pos.h;
                    item.d = pos.d;
                } else {
                    player.notify('Внимание! В данном доме вы больше не можете создать квартиру', 'error');
                }
            }
            m.newItem({
                name: "Место входа",
                more: item.x ? "~g~Указано" : "~r~Лимит квартир в доме",
                onpress: () => {
                    player.notify('Местоположение дома выбирается самостоятельно')
                }
            })
        }

        m.newItem({
            type: 'list',
            name: "Добавить склад",
            list: ['Нет', 'Да'],
            listSelected: item.haveChest,
            onchange: (val) => {
                item.haveChest = val;
            }
        })

        m.newItem({
            type: 'list',
            name: "Добавить денежный сейф в склад",
            list: ['Нет', 'Да'],
            listSelected: item.haveMoneyChest,
            onchange: (val) => {
                item.haveMoneyChest = val;
            }
        })


        if (item.x){
            m.newItem({
                name: "Инта дома",
                more: item.interrior ? getInteriorHouseById(item.interrior).name : "~r~Необходимо указать",
                onpress: () => {
                    let submenu = menu.new(player, "Выбор инты", "")
                    interriors.filter(q => q.type === "house").map(int => {
                        submenu.newItem({
                            name: int.name,
                            onpress: () => {
                                item.interrior = int.id;
                                houses.createNewHouseMenu(player, item);
                            }
                        })
                    })
                    submenu.open();
                }
            })
        }
        if(!item.forTp){
            m.newItem({
                name: "Место гаража",
                more: item.car_x ? "~g~Указано" : "~r~Можно указать",
                onpress: () => {
                    if(item.car_x){
                        item.car_x = 0;
                        item.car_y = 0;
                        item.car_z = 0;
                        item.car_h = 0;
                        player.notify("Метка гаража сброшена", "success")
                    } else {
                        item.car_x = player.position.x;
                        item.car_y = player.position.y;
                        item.car_z = player.position.z - 1;
                        item.car_h = player.heading;
                        item.car_d = player.dimension;
                        player.notify("Метка гаража установлена", "success")
                    }
                    houses.createNewHouseMenu(player, item);
                }
            })
        }
        if (item.car_x || item.forTp) {
            m.newItem({
                name: "Инта гаража",
                more: item.car_interrior ? getInteriorGarageById(item.car_interrior).name : `~r~${item.forTp ? 'Можно' : 'Необходимо'} указать`,
                onpress: () => {
                    let submenu = menu.new(player, "Выбор инты", "")
                    getInteriorsGarage().map(int => {
                        submenu.newItem({
                            name: `${int.name} (Слоты: ${int.cars.length})`,
                            onpress: () => {
                                item.car_interrior = int.id;
                                houses.createNewHouseMenu(player, item);
                            }
                        })
                    })
                    submenu.open();
                }
            })
        }
        m.newItem({
            name: "~g~Сохранить",
            onpress: async () => {
                if (!item.name) return player.notify("Название (Адрес улици) дома не указана", "error");
                if (!item.price) return player.notify("Стоимость дома не указана", "error");
                if (!item.x) return player.notify("Метка дома не указана", "error");
                if (!item.interrior) return player.notify("Инта дома не выбрана", "error");
                if (!item.forTp && item.car_x && !item.car_interrior) return player.notify("Метка гаража указана но инта не выбрана", "error");
                if(!item.haveChest && item.haveMoneyChest) return player.notify("Денежный сейф можно добавить только добавив склад", "error");
                let count = 1;
                if(item.forTp){
                    count = await menu.input(player, 'Количество квартир', 1, 2, 'int');
                    if(!count || count < 0 || count > 99) return;
                }
                m.close();
                let herr = false
                for(let q = 0; q < count; q++){
                    let err = false
                    if(item.forTp){
                        item.name = HousesTeleportsList[item.forTp - 1].name;
                        const pos = houses.getFreePosInMultihouse(item.forTp)
                        if(pos){
                            item.x = pos.x;
                            item.y = pos.y;
                            item.z = pos.z;
                            item.h = pos.h;
                            item.d = pos.d;
                        } else {
                            herr = true;
                            err = true
                        }
                    }
                    if(!err){
                        item.id = null;
                        item.key = system.getRandomInt(10000000, 90000000);
                        const z = await item.save()
                        if(z) houses.loadItem(z);
                        else {
                            herr = true
                        }
                    }
                }
                writeSpecialLog(`Создал дом - ${item.x},${item.y},${item.z}`, player, 0);
                if(herr) player.notify('При выполнении действия возникла ошибка', 'error')
                else player.notify('Действие успешно выполнено', 'success')
            }
        })

        m.open();
    }
}

export function openHouseEditAdminMenu(player: PlayerMp, house: HouseEntity) {
    const m = menu.new(player, `Управление домом #${house.id}`);

    m.newItem({
        name: 'Телепортироваться ко входу',
        onpress: () => {
            player.user.teleport(house.x, house.y, house.z, house.h, house.d);
        }
    });

    m.newItem({
        name: 'Переместить метку входа',
        more: 'Перемещает метку входа на текущую позицию (не меняет дименшн)',
        onpress: () => {
            house.x = player.position.x;
            house.y = player.position.y;
            house.z = player.position.z - 1;
            house.h = player.heading;

            house.save();

            houses.clearHouseEntities(house);
            houses.loadItem(house);

            player.notify('Метка входа в дом перемещена на новую позицию', 'success');
        }
    });

    m.newItem({
        name: 'Переместить метку гаража',
        more: 'Перемещает метку гаража на текущую позицию',
        onpress: () => {
            house.car_x = player.position.x;
            house.car_y = player.position.y;
            house.car_z = player.position.z - 1;
            house.car_h = player.heading;

            house.save();

            houses.clearHouseEntities(house);
            houses.loadItem(house);

            player.notify('Метка гаража перемещена на новую позицию', 'success');
        }
    });

    m.open();
}

gui.chat.registerCommand('openhouseedit', (player, houseIdStr) => {
    if (!player.user.hasPermission('admin:houses:editmarks')) {
        return;
    }

    const houseId = parseInt(houseIdStr);
    const house = houses.get(houseId);

    if (!house) {
        return player.notify('Дом с таким id не найден', 'error');
    }

    openHouseEditAdminMenu(player, house);
});
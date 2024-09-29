import {CustomEvent} from "../custom.event";
import {menu} from "../menu";
import {system} from "../system";
import {
    GIVE_MONEY_PER_TASK,
    QUICK_HEAL_COST,
    VEHICLE_FINE_POLICE_MAX,
    VEHICLE_KEY_CREATE_COST
} from "../../../shared/economy";
import {SYNC_ANIM_LIST} from "../../../shared/anim";
import {Vehicle} from "../vehicles";
import {inventory} from "../inventory";
import {User} from "../user";
import {CRIME_ROBBERY_INTEREST, CRIME_ROBBERY_PROFIT_LIMIT, FACTION_ID} from "../../../shared/fractions";
import {taxi} from "../taxi";
import {business} from "../business";
import {houses} from "../houses";
import {
    CUFFS_ITEM_ID,
    CUFFS_KEY_ITEM_ID,
    getItemName,
    OWNER_TYPES,
    SCREWS_DESTROYER_ITEM_IDS,
    SCREWS_ITEM_ID
} from "../../../shared/inventory";
import {getDocumentData} from "../city.hall";
import {ANCHOR_LIST} from "../../../shared/vehicles";
import {canFight, getZoneAtPosition, getZoneConf, getZoneOwner, setZoneControl, startFight} from "../gangwar";
import {UdoData} from "../../../shared/licence";
import {nonHiddenMasksIds} from "../../../shared/masks";
import {
    ADV_JAIL_FREE_COST_MIN,
    ADV_JAIL_FREE_COST_MIN_MORE,
    ADV_JAIL_FREE_COST_MIN_MORE_TIME,
    ADV_MONEY_PERCENT_TO_USER
} from "../../../shared/jail";
import {MoneyChestClass} from "../money.chest";
import {GANGWAR_RADIUS} from "../../../shared/gangwar";
import {parking} from "../businesses/parking";
import {vehTaskData} from "../task";
import {FRACTION_LIST_TASKS_NPC} from "../../../shared/tasks";
import {gui} from "../gui";
import {
    FIRE_EXTINGUISHER_MIXTURE_ITEM_ID,
    FIRE_EXTINGUISHER_MIXTURE_PER_BALLOON,
    FIRETRUCK_FILL_MIXTURE_RANGE,
    FIRETRUCK_MAX_BALLOON_COUNT
} from "../jobs/firefighter/config";
import {isWaterSpotInRange} from "../jobs/firefighter/FireStation";
import {InterractionMenu} from "./InterractionMenu";
import {activeCars} from '../vehicle.grab'
import {sendExchangeRequest} from "../inventory.exchange";
import {Carry} from '../carry'
import {BATTLE_PASS_VEHICLES} from "../../../shared/battlePass/main";
import {BANNED_TAXI_MODELS} from "../../../shared/taxi";
import {fraction, fractionCfg} from "../fractions/main";
import {FRACTION_RIGHTS} from "../../../shared/fractions/ranks";

CustomEvent.registerClient('vehicle:interaction', (player, targetId: number) => {
    vehInteract(player, targetId);
});

const vehInteract = (player: PlayerMp, targetId: number) => {
    const user = player.user;
    if (!user) return;
    const target = mp.vehicles.at(targetId);
    if (!target) return;
    const check = () => {
        if (!mp.players.exists(player)) return false;
        if (!mp.vehicles.exists(target)) return false;
        if (system.distanceToPos(player.position, target.position) > 5) return false;
        if (player.dimension !== target.dimension) return false;
        return true;
    }

    const unlockVehGrab = () => {
        if(!check()) return;
        if(player.dimension) return player.notify('Тут нельзя вскрывать двери', 'error')
        if(player.vehicle) return player.notify('Вы не должны быть в транспорте', 'error');
        user.waitTimer(5,30, 'Вскрываем двери', ["amb@medic@standing@tendtodead@idle_a", "idle_a"], target).then(status => {
            if (!status) return;
            if(!mp.players.exists(player)) return;
            if (!check()) return;
            if (!Vehicle.getLocked(target)) return;
            const itm = user.haveItem(813)
            if (!itm) return;
            if (system.getRandomInt(1, 7) === 3 || (target.entity && target.entity.data && target.entity.data.keyProtect)) itm.useCount(1, player), player.notify('Отмычка сломалась', 'error');
            if((target.entity && target.entity.data && target.entity.data.keyProtect) || (target.fraction && fractionCfg.getFraction(target.fraction).gos)){
                // dispatch.new(FACTION_ID.LSPD, `Сработала противоугонная защита на ${Vehicle.getName(target)} ${target.numberPlate}`, target.position, 30)
                return player.notify('Сработала противоугонная защита', 'error')
                // if(system.getRandomInt(1, 100) < 85) {
                // }
            }
            Vehicle.setLocked(target, false);
            Vehicle.setEngine(target, true);
            player.notify('Замок вскрыт', "success");
            // Если вскрыл машину для Ламара
            if (activeCars.find(c => c.veh.id == target.id)) {
                mp.players.toArray().filter(u => u.user?.fractionData?.police).forEach(player => {
                    player.notifyWithPicture("Сдача транспорта", 'Ламар', `Кто-то взломал авто ${target.modelname}, Номерной знак ${target.numberPlate}. Координаты на карте`, 'DIA_LAMAR')
                    player.outputChatBox(`!{25B000} Кто-то взломал авто ${target.modelname}, Номерной знак ${target.numberPlate}. Координаты на карте`)
                    CustomEvent.triggerClient(player, 'vehicleGrab:setBlipPos', target.position.x, target.position.y, target.position.z);
                })
                CustomEvent.triggerClient(player, 'vehicleGrab:deleteBlip')
            }
            player.user.achiev.achievTickByType("vehJack")
        })
    }
    
    if(target.isMission && target.missionOwner !== user.id) return player.notify('Вы не можете взаимодействовать с данным ТС', 'error');
    const interaction = new InterractionMenu(player, true);
    interaction.autoClose = true;
    
    if (target.fireSquad && player.user.fireSquad && target.fireSquad === player.user.fireSquad) {
        interaction.add('Заправить огнетушительной смесью', '', 'star', () => {
            if (!isWaterSpotInRange(target.position, FIRETRUCK_FILL_MIXTURE_RANGE)) {
                player.notify('Поблизости нет точек, чтобы заправить машину огнетушительной смесью. Они находятся на пожарных станциях', 'error');
                return;
            }

            if (target.fireExtinguishingMixtureCount === FIRETRUCK_MAX_BALLOON_COUNT) {
                player.notify('Машина заполнена полными баллонами с огнетушительной смесью', 'error');
                return;
            }

            target.fireExtinguishingMixtureCount = FIRETRUCK_MAX_BALLOON_COUNT;
            player.notify(`Теперь в машине ${FIRETRUCK_MAX_BALLOON_COUNT} полных баллонов с огнетушительной смесью`, 'success');
        });

        interaction.add('Взять огнетушительную смесь', '', 'star', async () => {
            if (target.fireExtinguishingMixtureCount === 0) {
                player.notify('В машине закончились баллоны с огнетушительной смесью. Вернитесь на станицию, ' +
                    'чтобы пополнить запасы', 'error');
                return;
            }

            const isPlayerAlreadyHasMixture =
                player.user.allMyItems.some(item => item.item_id === FIRE_EXTINGUISHER_MIXTURE_ITEM_ID)
                || await CustomEvent.callClient(player, 'firefighter:getMixtureInWeapon');
            if (isPlayerAlreadyHasMixture) {
                player.notify('Вы ещё не израсходовали текущий баллон со смесью');
                return;
            }

            target.fireExtinguishingMixtureCount--;
            await player.user.giveItem(FIRE_EXTINGUISHER_MIXTURE_ITEM_ID, true, true, FIRE_EXTINGUISHER_MIXTURE_PER_BALLOON);
        });
    }

    if(target.missionType == 'fractionVehicleDeliver'){
        const data = vehTaskData.get(user.id);
        if(!data || !data.count) return player.notify('Вы не можете взаимодействовать с данным ТС', 'error');
        const cfg = FRACTION_LIST_TASKS_NPC[data.npc].tasks[data.task];
        if(!cfg) return player.notify('Вы не можете взаимодействовать с данным ТС', 'error');
        if(cfg.returnPoint){
            if(!Vehicle.getLocked(target)) return player.notify('Доставьте ТС до отмеченного на карте места', 'error');
            else interaction.add("Вскрыть двери", 'Криминальные', 'car', () => {
                const data = vehTaskData.get(user.id);
                if(!data || !data.count) return player.notify('Вы не можете взаимодействовать с данным ТС', 'error');
                if(!user.haveItem(813)) return player.notify('У Вас нет отмычек', 'error');
                unlockVehGrab()
            })
        } else {
            interaction.add("Эвакуировать", '', 'evacuation', () => {
                const data = vehTaskData.get(user.id);
                if(!data || !data.count) return player.notify('Вы не можете взаимодействовать с данным ТС', 'error');
                Vehicle.destroy(target);
                data.count--;
                if(data.count > 0){
                    vehTaskData.set(user.id, data);
                } else {
                    FRACTION_LIST_TASKS_NPC[data.npc].tasks[data.task].positions.push(...data.points)
                    if(data.returnNeed) {
                        user.setWaypoint(data.returnNeed.x, data.returnNeed.y, data.returnNeed.z, 'Награда за доставку ТС');
                        return player.notify('Теперь необходимо вернуться обратно чтобы забрать награду');
                    } else {
                        user.addMoney(data.reward, true, 'Награда за доставку ТС по заданию');
                        vehTaskData.set(user.id, data);
                        const ids = user.id;

                        setTimeout(() => {
                            vehTaskData.delete(user.id);
                        }, data.cooldown * 60000)
                    }
                }
            })
        }

        return interaction.open();
    }





    if(target.entity && target.entity.owner === user.id){
        interaction.add("Управление ключами", '', 'car', () => {
            const m = menu.new(player, 'Управление ключами', 'Действия');
            m.onclose = () => {
                if (check()) return vehInteract(player, targetId);
            }

            m.newItem({
                name: "Сделать ключи",
                more: `$${system.numberFormat(VEHICLE_KEY_CREATE_COST)}`,
                desc: 'Ключи позволят открывать и закрывать транспорт любому, кто ими обладает',
                onpress: () => {
                    player.user.tryPayment(VEHICLE_KEY_CREATE_COST, "card", () => {
                        return check()
                    }, `Оплата услуг по выпуску дубликата ключей для ТС ${Vehicle.getName(target)} #${target.dbid}`, "Обслуживание ТС").then(q => {
                        if(!q) return;
                        inventory.createItem({
                            owner_type: OWNER_TYPES.PLAYER,
                            owner_id: player.user.id,
                            item_id: houses.key_id,
                            advancedNumber: target.entity.key,
                            advancedString: "car",
                            serial: `ТС ${Vehicle.getName(target)} #${target.dbid}`,
                        })
                        player.notify("Вы получили дубликат ключей", "success")
                    })
                }
            })
            m.newItem({
                name: "Сменить замок",
                desc: 'При смене замка все старые ключи перестают подходить',
                onpress: () => {
                    menu.accept(player).then(status => {
                        if (!status) return;
                        if (!check()) return;
                        target.entity.key = system.getRandomInt(1000000, 9999999);
                        target.entity.save();
                        player.notify('Замок заменён', 'success');
                        m.close();
                    })
                }
            })

            m.open();
        })
    }

    if(user.is_police && target.dbid){
        interaction.add("Отправить на штрафстоянку", 'Фракционные', 'evacuation', async () => {
            const sum = await menu.input(player, 'Введите сумму штрафа', '', 4, 'int');
            if (isNaN(sum) || typeof sum !== "number" || sum < 0 || sum > VEHICLE_FINE_POLICE_MAX) return player.notify(`Сумма штрафа указана не верно. Максимальная сумма штрафа $${system.numberFormat(VEHICLE_FINE_POLICE_MAX)}`, 'error');
            const reason = await menu.input(player, 'Введите причину штрафа', '', 100);
            if(!reason) return player.notify('Причина не указана', "error");
            if (!check()) return;
            if (target.getOccupants().length != 0) return player.notify("ТС должен быть пустым", "error");
            target.entity.moveToParkingFine(sum, true, `${reason}. Штраф выписан ${user.name}[${user.dbid}]`);
            if(target.entity.owner) User.writeRpHistory(target.entity.owner, `ТС ${target.entity.name} ${target.numberPlate} был отправлен на штрафстоянку $${system.numberFormat(sum)}`)
            user.log(user.isAdminNow(2) ? 'AdminJob' : 'gosJob', `ТС ${target.entity.name} ${target.numberPlate} был отправлен на штрафстоянку $${system.numberFormat(sum)}`, target.entity.owner);
            player.notify('Транспорт отправлен на штрафстоянку', 'success');
        })
    }
    if(target === player.vehicle && user.isDriver && Vehicle.haveDriftMode(target)){
        interaction.add("Настройка дрифт мода", '', 'carTrunk', () => {
            if(!check()) return;
            CustomEvent.triggerCef(player, 'drift:setting', Vehicle.getDriftSettings(target))
        })
    }
    if (Vehicle.getLocked(target) && user.haveItem(813)){
        interaction.add("Вскрыть двери", 'Криминальные', 'car',() => {
            unlockVehGrab();
        })
    }

    if(user.taxiJob && user.taxiCar && user.taxiCar === target){
        interaction.add("Меню заказов", '', 'receipt', () => {
            taxi.orderList(player);
        })
    }

    if (user.taxiJob && !user.taxiCar && Vehicle.hasAccessToVehicle(player, target) && target.entity && target.entity.owner) {
        interaction.add("Таксовать", '', 'car', () => {
            if (!target.modelname) return player.notify('На данном транспорте нельзя таксовать', 'error');

            if (BANNED_TAXI_MODELS.find(el => el === target.modelname))
                return player.notify('На данном транспорте нельзя таксовать', 'error');

            user.taxiCar = target;
            CustomEvent.triggerClient(player, 'taxi:car', user.taxiCar.id)
            player.notify('Вы успешно начали работу такси на личном транспорте!', 'success');
        })
    }

    if(target.getOccupants().length >= 1){
        interaction.add("Список пассажиров", '', 'peoples', () => {
            if (!check()) return;
            if(target.getOccupants().length < 1) return;
            const m = menu.new(player, 'Пассажиры', 'Список');
            target.getOccupants().map(pl => {
                if(pl.dbid === user.id) return;
                m.newItem({
                    name: `${user.getShowingNameString(pl)} #${pl.dbid}`,
                    onpress: () => {
                        m.close();
                        if (!check()) return;
                        playerInteract(player, pl.id)
                    }
                })
            })
            m.open()
        })
    }

    if (ANCHOR_LIST.find(q => q.toLowerCase() === target.modelname.toLowerCase())){
        interaction.add(Vehicle.getFreezeStatus(target) ? 'Снять с якоря' : 'Поставить на якорь', '', 'car', () => {
            Vehicle.freeze(target, !Vehicle.getFreezeStatus(target))
        })
    }

    interaction.add("Инвентарь", '', 'fileTray', () => {
        let hasAccess = Vehicle.hasAccessToVehicle(player, target);

        if (Vehicle.getLocked(target) && !hasAccess) {
            player.notify("Нет доступа", "error");
            vehInteract(player, targetId);
            return;
        }

        if (Vehicle.openTruckStatus(target)) inventory.openInventory(player);
        else return player.notify('Багажник закрыт', 'error'), vehInteract(player, targetId)
    })

    interaction.add(Vehicle.getLocked(target) ? 'Открыть двери' : 'Закрыть двери', '', 'carHood', () => {
        Vehicle.lockVehStatusChange(player, target);
        vehInteract(player, targetId)
    })
    if (target.rentCar) {
        interaction.add('Закончить аренду', '', 'car', () => {
            if(target.rentCarOwner){
                const owner = User.get(target.rentCarOwner);
                if (!owner) return;
                if (owner.user.id !== player.user.id) return;
                owner.rentCar = null;
                Vehicle.destroy(target)
            }
        })
    }
    if (Vehicle.haveHood(target)){
        interaction.add(Vehicle.openHoodStatus(target) ? "Закрыть капот" : "Открыть капот", '', 'carTrunk', () => {
            if (!check()) return;
            if (!user.canUseInventory) return;
            if (Vehicle.getLocked(target) && !Vehicle.openHoodStatus(target)) return player.notify("ТС закрыт", "error"), vehInteract(player, targetId);
            Vehicle.setHoodStatus(target, !Vehicle.openHoodStatus(target));
            vehInteract(player, targetId);
        })
    }

    if(user.familyId != 0 && user.isFamilyLeader && target.entity && user.myVehicles.includes(target.entity)) {
        interaction.add('Передать своё ТС в семью', 'Действия', 'car', () => {
            if (!check()) return;

            if (!user.family.canBuyMoreCar) return user.notify('Семья достигла лимита ТС')
            if (!target.entity || !user.myVehicles.includes(target.entity)) return;
            if (BATTLE_PASS_VEHICLES.find(el => target.entity.model === el) !== undefined)
                return player.notify('Нельзя передавать машины из боевого пропуска');

            menu.accept(player, `Подтвердите передачу ТС ${target.entity.model} Вашей семье`, 'small').then(status => {
                if (!status) return;
                if (!check()) return;
                if (!target.entity || !user.myVehicles.includes(target.entity)) return;
                if (user.familyId == 0 || !user.isFamilyLeader) return;
                if (!user.family.canBuyMoreCar) return user.notify('Семья достигла лимита ТС')

                Vehicle.selectParkPlace(player, target.entity.avia, true).then(place => {
                    if (!place) return player.notify("Для перемещения ТС необходимо указать парковочное место, где ТС будет храниться", "error");
                    if (!check()) return;
                    if (!target.entity || !user.myVehicles.includes(target.entity)) return;
                    const getParkPos = () => {
                        if (place.type === "house") return houses.getFreeVehicleSlot(place.id, target.entity.avia)
                        else return parking.getFreeSlot(place.id)
                    }
                    if (user.familyId == 0 || !user.isFamilyLeader) return;
                    if (!user.family.canBuyMoreCar) return player.notify('В семье недостаточно слотов для нового ТС')
                    target.entity.setOwnerFamily(user.family.entity, getParkPos())
                    user.notify(`Вы передали своё ТС в семью`)
                })
            })
        })
    }


    const nearestPlayer = user.getNearestPlayer(2);
    if (user.isAdminNow(2) || user.is_police || (user.fraction === FACTION_ID.GOV && user.rank >= 3)){
        interaction.add("Эвакуация на свою парковку", 'Действия', 'evacuation', async () => {
            if (!check()) return;
            if(target.getOccupants().length != 0) return player.notify('В ТС не должно быть пассажиров', 'error')
            target.getOccupants().map(q => {
                q.user.leaveVehicle();
            })
            setTimeout(() => {
                if (!check()) return;
                player.notify("ТС эвакуирован")
                if (target.entity && target.entity.owner) user.log(user.isAdminNow(2) ? 'AdminJob' : 'gosJob', `ТС ${Vehicle.getName(target)} ${target.numberPlate} был эвакуирован`, target.entity.owner);
                Vehicle.respawn(target)
            }, 500)
        })
    }
    const truckCfg = Vehicle.haveTruck(target)

    interaction.add(Vehicle.openTruckStatus(target) ? "Закрыть багажник" : "Открыть багажник", '', 'carTrunk', () => {
        if (!check()) return;
        if (!user.canUseInventory) return;
        let hasAccess = Vehicle.hasAccessToVehicle(player, target);
        if (!hasAccess) return player.notify('У вас нет ключей от этого ТС', 'error'), vehInteract(player, targetId);

        Vehicle.setTruckStatus(target, !Vehicle.openTruckStatus(target))
        vehInteract(player, targetId)

        let vehicleInventoryBlock: [number, number];

        if (target.garagecarid) {
            vehicleInventoryBlock = [OWNER_TYPES.FRACTION_VEHICLE, target.garagecarid]
        }
        else if (!target.dbid) {
            vehicleInventoryBlock = [OWNER_TYPES.VEHICLE_TEMP, target.inventoryTmp]
        }
        else {
            vehicleInventoryBlock = [OWNER_TYPES.VEHICLE, target.dbid]
        }

        if (!vehicleInventoryBlock) {
            return;
        }

        inventory.reloadInventoryAdvanced(target.position, 10, target.dimension, false, vehicleInventoryBlock)
    })

    if (player.user && player.user.sanitationTrashBag && target.getVariable('sanitation')) {
        interaction.add('Положить мусорный мешок', '', 'carTrunk', () => {
            if (!player.user.sanitationSquad)
                return player.notify('Вы не состоите в сессии', 'error');

            if (player.user.sanitationSquad !== target.getVariable('sanitation'))
                return player.notify('Это машина не принадлежит вашей сессии', 'error');

            player.user.sanitationTrashBag = false;

            target.trashBags += 1;

            CustomEvent.triggerClient(player, 'sanitation:deleteTrashBag');
        })
    }

    if (nearestPlayer && nearestPlayer.user && (nearestPlayer.user.cuffed || nearestPlayer.getVariable('inVehicleTruck'))){
        interaction.add(nearestPlayer.getVariable('inVehicleTruck') ? "Вытащить человека из багажника" : "Засунуть человека в багажник", 'Действия', 'carTrunk',() => {
            if (!check()) return;
            if (!truckCfg) return;
            const nearestPlayer = user.getNearestPlayer(2);
            if (!mp.players.exists(nearestPlayer)) return;
            if (!nearestPlayer.user.cuffed && !nearestPlayer.getVariable('inVehicleTruck')) return;
            if (!Vehicle.openTruckStatus(target)) return player.notify("Откройте багажник", "error"), vehInteract(player, targetId);
            const pos = system.offsetPosition(target.position, target.rotation, new mp.Vector3(truckCfg.x, truckCfg.y, truckCfg.z));
            if (system.distanceToPos(player.position, pos) > 2) return player.notify("Вы слишком далеко от багажника", "error"), vehInteract(player, targetId);
            if (system.distanceToPos(nearestPlayer.position, pos) > 2) return player.notify("Цель слишком далеко от багажника", "error"), vehInteract(player, targetId);
            if(nearestPlayer.vehicle) return player.notify('Цель находится в транспорте', 'error');
            if (!nearestPlayer.getVariable('inVehicleTruck') && target.playerInTruck) return player.notify("В багажнике уже кто то есть", "error"), vehInteract(player, targetId);
            if (nearestPlayer.getVariable('inVehicleTruck') && target.playerInTruck !== nearestPlayer.dbid) return player.notify("Вы пытаетесь вытащить человека из багажника другого ТС", "error"), vehInteract(player, targetId);
            target.playerInTruck = nearestPlayer.getVariable('inVehicleTruck') ? null : nearestPlayer.dbid
            nearestPlayer.setVariable('inVehicleTruck', nearestPlayer.getVariable('inVehicleTruck') ? null : target.id);
            vehInteract(player, targetId);
        })
    }
    if (!target.playerInTruck){
        interaction.add("Залезть в багажник", 'Действия', 'carTrunk', () => {
            if (!check()) return;
            if (target.playerInTruck) return;
            if (Carry.isPlayerCarry(player) || Carry.isPlayerCarried(player)) return;
            if (!truckCfg) return;
            if (!Vehicle.openTruckStatus(target)) return player.notify("Откройте багажник", "error"), vehInteract(player, targetId);
            if(player.vehicle) return player.notify('Покиньте транспорт', 'error')
            const pos = system.offsetPosition(target.position, target.rotation, new mp.Vector3(truckCfg.x, truckCfg.y, truckCfg.z));
            if (system.distanceToPos(player.position, pos) > 2) return player.notify("Вы слишком далеко от багажника", "error"), vehInteract(player, targetId);
            if (target.playerInTruck) return player.notify("В багажнике уже кто то есть", "error"), vehInteract(player, targetId);
            target.playerInTruck = player.getVariable('inVehicleTruck') ? null : player.dbid
            player.setVariable('inVehicleTruck', player.getVariable('inVehicleTruck') ? null : target.id);
        })
    } else if (target.playerInTruck === player.dbid){
        interaction.add("Вылезти из багажника", 'Действия', 'carTrunk', () => {
            if (!truckCfg) return;
            if (!check()) return;
            if (!Vehicle.openTruckStatus(target) && user.canUseInventory) return player.notify("Багажник закрыт и у вас не получается его открыть", "error"), vehInteract(player, targetId);
            target.playerInTruck = null
            player.setVariable('inVehicleTruck', null);
        })
    }

    interaction.open();
}

CustomEvent.registerClient('player:interaction', (player, targetId: number) => {
    playerInteract(player, targetId);
})

let healByItemTimer = new Map<number, boolean>();

const playerInteract = async (player: PlayerMp, targetId: number) => {
    const user = player.user;
    if (!user) return;
    if (targetId === player.id) return player.notify("Вы не можете взаимодействовать с самим собой", "error");
    const target = mp.players.at(targetId);
    if (!mp.players.exists(target)) return;

    const check = () => {
        if (!mp.players.exists(player)) return false;
        if (!mp.players.exists(target)) return false;
        if (system.distanceToPos(player.position, target.position) > 5) return false;
        if (player.dimension !== target.dimension) return false;

        return true;
    }

    const interaction = new InterractionMenu(player)
    interaction.autoClose = true;

    if(user.is_police){
        interaction.add('Выписать штраф', 'Фракционные', 'receipt',() => {
            if (!check()) return;
            menu.input(player, 'Введите сумму штрафа', '', 4, 'int').then(sum => {
                if (!check()) return;
                if(!sum || sum <= 0 || isNaN(sum)) return;
                if (sum > 10000) return player.notify(`Нельзя указать больше ${system.numberFormat(10000)}`);
                menu.input(player, 'Введите причину', '', 30).then(reason => {
                    if (!check()) return;
                    if(!reason) return;
                    reason = system.filterInput(reason);
                    if(!reason) return;
                    player.notify('Запрос отправлен');
                    menu.accept(target, `Вы согласны оплатить штраф $${system.numberFormat(sum)}?`, 'small', 30000).then(status => {
                        if (!check()) return;
                        if (!status) return player.notify('Отказ', 'error');
                        if(!target.user.newFine(player, sum, reason)) {
                            player.notify(`Человек не имеет возможности оплатить штраф`, 'error');
                            target.notify(`У вас нет возможности оплатить штраф`, 'error');
                        } else {
                            player.notify(`Человек оплатил штраф`, 'success');
                            const chest = MoneyChestClass.getByFraction(user.fraction);
                            if(chest) chest.addMoney(player, sum * 0.8, false)
                            user.addMoney(sum * 0.2, true, 'Выписка штрафа');
                        }
                    });
                })
            })
        });
    }

    if(user.fraction === 1 && user.tag && user.tag.toLowerCase().includes('адвокат') && target.user.jail_time){
        interaction.add('Освободить из тюрьмы', 'Фракционные', 'thief',() => {
            if (!check()) return;
            const sum = Math.max(ADV_JAIL_FREE_COST_MIN, Math.floor((ADV_JAIL_FREE_COST_MIN_MORE_TIME > target.user.jail_time ? ADV_JAIL_FREE_COST_MIN : ADV_JAIL_FREE_COST_MIN_MORE) * (target.user.jail_time  / 60)))
            menu.accept(target, `Вы согласны выйти на свободу заплатив $${system.numberFormat(sum)}`).then(status => {
                if (!check()) return;
                if (!status) return player.notify('Отказ', 'error');
                if(!target.user.jail_time) return;
                if(target.user.money < sum) return player.notify('У вас недостаточно средств для оплаты', 'error');
                target.user.removeMoney(sum, true, 'Оплата услуг адвоката');
                const foradv = ((sum / 100) * ADV_MONEY_PERCENT_TO_USER)
                user.addMoney(foradv, true, 'Услуги адвоката');
                const chest = MoneyChestClass.getByFraction(1);
                if(chest) chest.addMoney(player, sum - foradv, false);
                player.notify('Услуги оказаны', 'success')
                target.notify('Услуги оказаны', 'success')
                target.user.jail_time = 5;
                target.user.jail_reason = 'Освобождение';
                CustomEvent.triggerClient(target, 'jail:sync', 5, 'Освобождение', false)
            });
        });
    }

    if(user.is_gang && target.user.is_gang && user.rank >= 8 && target.user.rank >= 8 && user.fraction !== target.user.fraction){
        const zone = getZoneAtPosition(player.position);
        if(zone){
            const cfg = getZoneConf(zone);
            if(cfg && !cfg.spawn){
                const zoneowner = getZoneOwner(zone);
                if(zoneowner === target.user.fraction){
                    interaction.add('Объявить войну за данную территорию', 'Фракционные', 'swords',() => {
                        if (!check()) return;
                        if(system.distanceToPos2D({x: cfg.x, y: cfg.y}, player.position) > GANGWAR_RADIUS / 2) return player.notify('Соберитесь ближе к центру зоны', 'error')
                        menu.accept(target, `Вы согласны на войну за территорию?`).then(status => {
                            if (!check()) return;
                            if (!status) return player.notify('Отказ', 'error');
                            if(!canFight(zone, user.fraction)) return player.notify('Сейчас нельзя напасть', 'error');
                            startFight(zone, user.fraction)
                        });
                    });
                } else if(zoneowner === user.fraction && user.isLeader && target.user.isLeader){
                    interaction.add('Передать территорию', 'Фракционные', 'swords', () => {
                        if (!check()) return;
                        menu.accept(player, `Вы уверены`).then(status => {
                            if (!check()) return;
                            if (!status) return player.notify('Отказ', 'error');
                            if(!canFight(zone, user.fraction)) return player.notify('Сейчас идёт бой, передать территорию нельзя', 'error');
                            setZoneControl(zone, target.user.fraction)
                            player.notify('Территория передана', 'success')
                            target.notify('Территория передана', 'success')
                        });
                    });
                }
            }
        }
    }

    if (user.fraction === 16){
        if(target.user.health < 0.1){
            interaction.add('Укол эпинефрина', 'Лечение', 'heart', () => {
                if (!check()) return;
                if(healByItemTimer.has(user.id)) return player.notify('Вы недавно уже кололи эпинефрин', 'error');
                if (target.user.health > 0) return player.notify('Пациент не нуждается в реанимации');
                const item = user.haveItem(910);
                if(!item) return player.notify('У вас нет эпинефрина', 'error');
                gui.chat.sendDoCommand(player, `Сделал${player.user.feemale ? 'а' : ''} внутримышечную инъекцию эпинефрина и начал${player.user.feemale ? 'а' : ''} проводить сердечно-легочную реанимацию`)
                user.waitTimer(5,5, 'Реанимация', ["missheistfbi3b_ig8_2", "cpr_loop_paramedic", true], target).then(status2 => {
                    if (!status2) return;
                    if (!check()) return;
                    if(healByItemTimer.has(user.id)) return player.notify('Вы недавно уже кололи эпинефрин', 'error');
                    if (target.user.health > 0) return player.notify('Пациент не нуждается в реанимации');
                    const item = user.haveItem(910);
                    if(!item) return player.notify('У вас нет эпинефрина', 'error');
                    item.useCount(1, player);
                    let chance = system.getRandomInt(0, 100);
                    if(user.haveActiveLicense('reanimation')) chance = 100;
                    if(chance < 90) return player.notify('Реанимация не удалась', 'error');
                    target.user.health = 100;
                    player.notify('Вы реанимировали человека', 'success')
                    target.notify('Вас реанимировали', 'success');
                    CustomEvent.triggerClient(player, 'markDeath:destroy')// Удаляем маркер мертвого игрока если он есть
                    healByItemTimer.set(user.id, true);
                    const ids = user.id;
                    setTimeout(() => {
                        healByItemTimer.delete(ids);
                    }, 5 * 60000)
                })
            })
            interaction.add('Реанимировать', 'Лечение', 'heart', () => {
                if (!check()) return;
                if (target.user.health > 0) return player.notify('Пациент не нуждается в реанимации');
                if (system.timestamp - target.user.lastReanimationTime <= 180) return player.notify('Пациента недавно реанимировали');
                const itm = user.haveItem(902);
                if (!itm) return player.notify('У вас нет аптечки для реанимации', 'error');
                if (target.user.health > 0) return player.notify('Пациент не нуждается в реанимации');
                user.waitTimer(5,10, 'Реанимация', ["missheistfbi3b_ig8_2", "cpr_loop_paramedic", true], target)
                    .then(status => {
                        if(!status) return;
                        if(!mp.players.exists(player)) return;
                        if (!check()) return;
                        if(target.user.health > 0) return player.notify('Пациент не нуждается в реанимации');
                        const itm = user.haveItem(902);
                        if (!itm) return player.notify('У вас нет аптечки для реанимации', 'error');
                        user.addMoney(350, true, 'Реанимация')
                        target.user.health = 100;
                        itm.useCount(1, player)
                        player.notify('Вы реанимировали человека', 'success')
                        CustomEvent.triggerClient(player, 'markDeath:destroy')// Удаляем маркер мертвого игрока если он есть
                        target.notify('Вас реанимировали', 'success');
                        target.user.lastReanimationTime = system.timestamp;
                    })
            })
        } else if(target.user.health < 100){
            interaction.add('Вылечить', 'Лечение', 'heart', () => {
                if (!check()) return;
                if (target.user.health === 100) return;
                const itm = user.haveItem(902);
                if (!itm) return player.notify('У вас нет аптечки для лечения', 'error');
                menu.input(player, 'Введите сумму (0-700)', 100, 3, 'int').then(sum => {
                    if(typeof sum !== "number") return;
                    if(isNaN(sum)) return;
                    if(sum < 0 || sum > 700) return player.notify('Сумма указана не верно', 'error')
                    if (!check()) return;
                    if (target.user.health === 100) return;
                    menu.accept(target, `Вылечится за ${system.numberFormat(sum)}`).then(status => {
                        if(!status) return;
                        if (!check()) return;
                        if (target.user.health === 100) return;
                        const itm = user.haveItem(902);
                        if (!itm) return player.notify('У вас нет аптечки для лечения', 'error');
                        if(sum > 0){
                            if(target.user.money < sum) return target.notify('У вас недостаточно средств для оплаты', 'error')
                            target.user.removeMoney(sum, true, 'Оплата лечения');
                            user.addMoney(sum, true, 'Лечение')
                        }
                        target.user.health = 100;
                        itm.useCount(1, player)
                        player.notify('Вы вылечили человека', 'success')
                        target.notify('Вас вылечили', 'success');
                    })
                })

            })
        }
        if (target.user.health > 0.1){
            const timer = await target.user.getHospitalTimer();
            if (!check()) return;
            if (timer > 0) {
                const sum = target.user.haveActiveLicense('med') ? QUICK_HEAL_COST.MANUAL_LICENSE : QUICK_HEAL_COST.MANUAL;
                interaction.add(`Выписать $${sum}`, 'Лечение', 'documentText', async () => {
                    if (!check()) return;
                    const timer = await target.user.getHospitalTimer();
                    if (timer <= 0) return;
                    if (!check()) return;
                    menu.accept(target, `Выписаться за $${sum}`).then(status => {
                        if(!status) return;
                        if (!check()) return;
                        if (target.user.money < sum) return target.notify('У вас недостаточно средств для выписки из больницы', 'error');
                        target.user.removeMoney(sum, true, `Выписка из больницы ${target.user.name} #${target.user.id}`)
                        CustomEvent.triggerClient(target, 'hospital:clearHealTimer')
                        player.notify('Вы выписали человека', 'success')
                        user.addMoney(sum * 0.3, true, 'Выписка из больницы');
                        const chest = MoneyChestClass.getByFraction(16);
                        if(chest) chest.addMoney(player, sum - (sum * 0.3), false);
                    })
                })
            }
        }
    } else if(target.user.health <= 0){
        interaction.add('Укол эпинефрина', 'Лечение', 'heart', () => {
            if (!check()) return;
            if(healByItemTimer.has(user.id)) return player.notify('Вы недавно уже кололи эпинефрин', 'error');
            if (target.user.health > 0) return player.notify('Пациент не нуждается в реанимации');
            const item = user.haveItem(910);
            if(!item) return player.notify('У вас нет эпинефрина', 'error');
            gui.chat.sendDoCommand(player, `Сделал${player.user.feemale ? 'а' : ''} внутримышечную инъекцию эпинефрина и начал${player.user.feemale ? 'а' : ''} проводить сердечно-легочную реанимацию`)
            user.waitTimer(5,5, 'Реанимация', ["missheistfbi3b_ig8_2", "cpr_loop_paramedic", true], target).then(status2 => {
                if (!status2) return;
                if (!check()) return;
                if(healByItemTimer.has(user.id)) return player.notify('Вы недавно уже кололи эпинефрин', 'error');
                if (target.user.health > 0) return player.notify('Пациент не нуждается в реанимации');
                const item = user.haveItem(910);
                if(!item) return player.notify('У вас нет эпинефрина', 'error');
                item.useCount(1, player);
                let chance = system.getRandomInt(0, 100);
                if(user.haveActiveLicense('reanimation')) chance = 100;
                if(chance < 66) return player.notify('Реанимация не удалась', 'error');
                target.user.health = 100;
                player.notify('Вы реанимировали человека', 'success')
                target.notify('Вас реанимировали', 'success');
                healByItemTimer.set(user.id, true);
                const ids = user.id;
                setTimeout(() => {
                    healByItemTimer.delete(ids);
                }, 1 * 60000)
            })
        })
    }
    const nearestVehicle = user.getNearestVehicle(4);
    if(nearestVehicle){
        const truckCfg = Vehicle.haveTruck(nearestVehicle)
        if(truckCfg){
            if (target && target.user && (target.user.cuffed || target.getVariable('inVehicleTruck'))){
                interaction.add(target.getVariable('inVehicleTruck') ? "Вытащить человека из багажника" : "Засунуть человека в багажник", 'Транспорт', 'carTrunk', () => {
                    if (!check()) return;
                    if (!target.user.cuffed && !target.getVariable('inVehicleTruck')) return;
                    if (!Vehicle.openTruckStatus(nearestVehicle)) return player.notify("Откройте багажник", "error"), vehInteract(player, targetId);
                    const pos = system.offsetPosition(nearestVehicle.position, nearestVehicle.rotation, new mp.Vector3(truckCfg.x, truckCfg.y, truckCfg.z));
                    if (system.distanceToPos(player.position, pos) > 2) return player.notify("Вы слишком далеко от багажника", "error"), vehInteract(player, targetId);
                    if (system.distanceToPos(target.position, pos) > 2) return player.notify("Цель слишком далеко от багажника", "error"), vehInteract(player, targetId);
                    if(target.vehicle) return player.notify('Цель находится в транспорте', 'error');
                    if (!target.getVariable('inVehicleTruck') && nearestVehicle.playerInTruck) return player.notify("В багажнике уже кто то есть", "error"), vehInteract(player, targetId);
                    if (target.getVariable('inVehicleTruck') && nearestVehicle.playerInTruck !== target.dbid) return player.notify("Вы пытаетесь вытащить человека из багажника другого ТС", "error"), vehInteract(player, targetId);
                    nearestVehicle.playerInTruck = target.getVariable('inVehicleTruck') ? null : target.dbid
                    target.setVariable('inVehicleTruck', target.getVariable('inVehicleTruck') ? null : nearestVehicle.id);
                    vehInteract(player, targetId);
                })
            }
        }

    }

    if (user.fraction && user.fractionData.mafia && user.isLeader && target.user.fraction && target.user.fractionData.mafia && target.user.isLeader){
        const biz = business.data
            .filter(biz => biz.mafiaOwner === user.fraction)
            .find(biz => system.isPointInPoints(player.position, biz.positions, 10))
        if(biz){
            interaction.add("Передать контроль над бизнесом", 'Действия', 'peoples', () => {
                if (!check()) return;
                menu.accept(player).then(status => {
                    if(!status) return;
                    if (!check()) return;
                    biz.mafiaOwner = target.user.fraction;
                    biz.save().then(() => {
                        if (!check()) return;
                        player.notify('Бизнес передан', "success");
                        target.notify('Бизнес передан', "success");
                    })
                })
            })
        }
    }

    if(target.vehicle && target.user.cuffed){
        interaction.add("Вытащить из ТС", 'Транспорт', 'carTrunk', () => {
            if (!check()) return;
            if (target.vehicle && target.user.cuffed) {
                target.user.leaveVehicle();
            }
        })
    }
    if(!target.vehicle && target.user.cuffed){
        interaction.add("Затащить в ближайшее ТС", 'Транспорт', 'carTrunk', () => {
            if (!check()) return;
            if (!target.vehicle &&  target.user.cuffed) {
                const veh = User.getNearestVehicle(player, 3);
                if(!veh) return player.notify('ТС поблизости не обнаружен', 'error')
                if (veh.getOccupant(2) && veh.getOccupant(3)) return player.notify('В ТС нет места', 'error');
                if (veh.getOccupant(2)) target.user.putIntoVehicle(veh, 3)
                else target.user.putIntoVehicle(veh, 2);
            }
        })
    }

    if(player.vehicle && user.isDriver && player.vehicle === target.vehicle){
        interaction.add("Выкинуть из ТС", 'Транспорт', 'carTrunk', () => {
            if (!check()) return;
            if(player.vehicle && user.isDriver && player.vehicle === target.vehicle){
                if(player.vehicle.taxiCar){
                    if(player.dbid === player.vehicle.taxiCar){
                        const order = taxi.list.find(q => q.driver === player.dbid && target.dbid === q.user);
                        if(order){
                            const dist = system.distanceToPos2D(player.position, order.end);
                            if(dist > 20) return player.notify('Вы не можете выкинуть пассажира пока не приедете до места назначения', 'error');
                        }
                    }
                }
                target.user.leaveVehicle();
                target.notify('Водитель выгнал Вас из ТС', 'error');
            }
        })
    }


    const items = user.allMyItems;
    const itcard = items.find(q => q.item_id === 800 && user.id + "_" + user.social_number === q.serial);
    if (itcard){
        interaction.add("Предъявить ID карту", 'Документы', 'documentText', async () => {
            if (!check()) return;
            if (!(await menu.accept(target, "Желаете ознакомится с документами", null, 15000))) return player.notify('Игрок отказался');
            if (!check()) return;
            let data = await getDocumentData(itcard)
            if (!data) return player.notify("Документы недействительные", "error")
            CustomEvent.triggerCef(target, "cef:idcard:new", data)
        })
    }
    if(UdoData.find(q => q.id === user.fraction)){
        const doc = user.haveItem(824);
        if(doc){
            interaction.add("Предъявить " + getItemName(doc), 'Документы', 'documentText', async () => {
                if (!check()) return;
                if (!(await menu.accept(target, "Желаете ознакомится с документами", null, 15000))) return player.notify('Игрок отказался');
                if (!check()) return;
                CustomEvent.triggerCef(target, "udo:show", user.udoData)
            })
        }
    }
    items.filter(q => q.item_id === 802).map(item => {
        interaction.add("Предъявить " + getItemName(item), 'Документы', 'documentText',async () => {
            if (!check()) return;
            if (!(await menu.accept(target, "Желаете ознакомится с документами", null, 15000))) return player.notify('Игрок отказался');
            if (!check()) return;
            const [document, date, code, id, name, social, idCreator, nameCreator, socialCreator, real] = item.serial.split('|')
            CustomEvent.triggerCef(target, "document:show", document, date, code, id, name, social, idCreator, nameCreator, socialCreator, real)
        })
    })
    items.filter(q => q.item_id === 803).map(item => {
        interaction.add("Предъявить " + getItemName(item), 'Документы', 'documentText',async () => {
            if (!check()) return;
            if (!(await menu.accept(target, "Желаете ознакомится с документами", null, 15000))) return player.notify('Игрок отказался');
            if (!check()) return;
            const [type, serial, code, timestring, userid] = item.serial.split('-')
            const time = parseInt(timestring);
            const userdata = await User.getData(parseInt(userid));
            if (!userdata) return player.notify("Владелец документов покинул страну"), inventory.deleteItem(item);
            CustomEvent.triggerCef(target, "license:show", {
                type, serial: parseInt(serial), time, player: userdata.rp_name, code
            })
        })
    })

    interaction.add("Передать наличные", '', 'cash', () => {
        if (!check()) return;
        menu.input(player, `Введите сумму ($1 - $${system.numberFormat(system.smallestNumber(GIVE_MONEY_PER_TASK, user.money))})`, "", GIVE_MONEY_PER_TASK.toString().length, 'int').then(sum => {
            if (!sum) return;
            if (!check()) return;
            if (isNaN(sum)) return player.notify("Сумма указана не верно", "error");
            if (sum <= 0) return player.notify("Сумма указана не верно", "error");
            if (sum > 9999999) return player.notify("Сумма указана не верно", "error");
            if (sum > GIVE_MONEY_PER_TASK) return player.notify(`Указанная сумма превышает лимит $${system.numberFormat(GIVE_MONEY_PER_TASK)}`, "error");
            if (sum > player.user.money) return player.notify(`У вас недостаточно наличных средств чтобы передать $${system.numberFormat(sum)}`, "error");

            menu.accept(target, `Вы хотите взять $${system.numberFormat(sum)}?`, 'small').then(status => {
                if(!status) return;
                if (!check()) return;
                user.giveMoneyToPlayer(target, sum)
            })
        })
    })

    interaction.add("Предложить обмен", '', 'exchange', () => sendExchangeRequest(player, target));

    if (target.user.cuffed) {
        let uncuffText: string = null;

        if (target.user.policeCuffed && user.getItemsByIds([CUFFS_KEY_ITEM_ID])) {
            uncuffText = 'Снять наручники';
        } else if (!target.user.policeCuffed && user.getItemsByIds(SCREWS_DESTROYER_ITEM_IDS)) {
            uncuffText = 'Разрезать стяжки'
        }

        if (uncuffText) {
            interaction.add(uncuffText, 'Фракционные', 'handcuffs', () => {
                if (!check()) return;
                user.setUncuffedTarget(target);
            })
        }
    } else if (!target.user.cuffed){
        let cuffText: string = null;

        if (user.getItemsByIds([CUFFS_ITEM_ID]) && (user.is_police || user.is_government)) {
            cuffText = 'Надеть наручники';
        } else if (user.getItemsByIds([SCREWS_ITEM_ID])) {
            cuffText = 'Заковать в стяжки'
        }

        if (cuffText) {
            interaction.add(cuffText, 'Фракционные', 'handcuffs',() => {
                if (!check()) return;
                user.setCuffedTarget(target);
            })
        }
    }

    if (user.is_police) {
        const inMask = !nonHiddenMasksIds.includes(target.getClothes(1).drawable)
        if (inMask) interaction.add("Снять маску", 'Фракционные', 'mask',() => {
            if (!check()) return;
            if(target.user.getJobDress && target.user.getJobDress.find(q => q[0] === 1)){
                const d = [...target.user.getJobDress]
                if(d.findIndex(q => q[0] === 1) > -1)d.splice(d.findIndex(q => q[0] === 1), 1);
                target.user.setJobDress(d);
            } else target.user.setDressValueById(950, 0);
            player.notify('Маска снята')
            target.notify('С вас сорвали маску')
        })
    }

    if (user.is_gang || user.is_mafia) {
        // Если накинуты стяжки краймом
        if (target.user.cuffed && !target.user.policeCuffed) {
            interaction.add('Ограбить', 'Фракционные', 'thief', () => {
                if (!check()) return;

                if (target.user.dead) {
                    return player.notify('Нельзя грабить мертвого игрока', 'error');
                }

                if (!target.user.canBeRobbed)
                    return player.notify('Нельзя часто грабить одного игрока', 'error');

                if (user.family && target.user.family && user.familyId == target.user.familyId)
                    return player.notify('Нельзя грабить члена своей семьи', 'error');

                let totalRobbed = Math.floor(target.user.money * CRIME_ROBBERY_INTEREST / 100);
                if (totalRobbed > CRIME_ROBBERY_PROFIT_LIMIT) totalRobbed = CRIME_ROBBERY_PROFIT_LIMIT;

                target.user.removeMoney(totalRobbed, false, `Ограблен игроком ${player.user.dbid} на ${system.numberFormat(totalRobbed)}`);
                player.user.addMoney(totalRobbed, false, `Ограбил игрока ${target.user.dbid} на ${system.numberFormat(totalRobbed)}`);

                user.playAnimation([['oddjobs@shop_robbery@rob_till', 'loop']], true, false);

                target.notify(`Вас ограбили на ${system.numberFormat(totalRobbed)}`);
                target.user.lastRobbedTime = system.getTimeStamp();
            })
        }
    }
    if(user.haveItem(869)){
        interaction.add("Подарить цветы", 'Социальные', 'flowers', () => {
            if (!check()) return;
            menu.accept(target, `Принять цветы?`, 'small').then(status => {
                if (!check()) return;
                if(!status) return player.notify('Приглашение отклонено', 'error');
                const item = user.haveItem(869);
                if(!item) return;
                player.user.removeAttachment('item_869');
                inventory.updateItemOwner(item.id, OWNER_TYPES.PLAYER, target.dbid, OWNER_TYPES.PLAYER, player.dbid)
                target.user.addAttachment('item_869');
                user.playSyncAnimation(target, ['mp_common', 'givetake2_a'], ['mp_common', 'givetake1_a']);
            })
        })
    }

    if (target.user.cuffed) {
        if(user.haveItem(813)){
            interaction.add("Вскрыть наручники отмычками", '', 'handcuffs', () => {
                if (!check()) return;
                if(!target.user.cuffed) return;
                user.waitTimer(3, 15, 'Вскрываем наручники', ['mp_arresting', 'a_uncuff'], target).then(status => {
                    if(!status) return;
                    if(!mp.players.exists(player)) return;
                    if (!check()) return;
                    if(!target.user.cuffed) return;
                    if(target.user.cuffed && target.user.policeCuffed && !user.is_police && target.user.getNearestPlayers(50).find(q => q && q.user && q.user.is_police && q.health > 0)) return player.notify('Вы не можете снять наручники, пока рядом находится сотрудник гос структур', 'error')
                    const item = user.haveItem(813);
                    if(!item) return;
                    item.useCount(1, player)
                    target.user.cuffed = false;
                    player.notify('Наручники сняты', 'success')
                    target.notify('Наручники сняты', 'success')
                })
            })
        }
        interaction.add(!target.user.follow ? "Вести за собой" : "Перестать вести", 'Фракционные', 'handshake',() => {
            if (!check()) return;
            user.setFollowTarget(target)
        })
    }

    if(user.family && !target.user.familyId && user.familyId !== target.user.familyId && user.family.isCan(user.familyRank, 'invite')){
        interaction.add("Пригласить в семью", 'Семейные', 'peoples', async () => {
            if (!check()) return;
            if(user.family.maximumMembersCount <= await user.family.getMembersCount()) return player.notify('У Вашей семьи достигнут лимит участников');
            if (target.user.familyId) return player.notify("Нельзя инвайтить человека, который уже состоит в семье", 'error');

            player.notify('Приглашение отправлено', 'success');
            menu.accept(target, `Хотите вступить в семью ${user.family.name}?`, 'small').then(status => {
                if (!check()) return;
                if(!status) return player.notify('Приглашение отклонено', 'error');
                target.user.family = user.family;
                user.log('familyInvite', `принял в семью ${user.family.name}`, target)
                player.notify('Приглашение принято', 'success');
                target.notify('Приглашение принято', 'success');
            })
        })
    }

    if (user.fraction && user.fraction !== target.user.fraction){
        if(fraction.getRightsForRank(user.fraction, user.rank).includes(FRACTION_RIGHTS.INVITE)){
            interaction.add("Пригласить в организацию", 'Фракционные', 'businessSharp',() => {
                if (!check()) return;
                if (target.user.fraction) return player.notify("Нельзя инвайтить человека, который уже состоит в организации", 'error');
                if (target.user.haveActiveWarns){
                    player.notify('Невозможно пригласить данного человека', 'error')
                    target.notify('У вас есть активный варн, вас нельзя приглашать', 'error')
                    return;
                }
                player.notify('Приглашение отправлено', 'success');
                menu.accept(target, `Хотите вступить в организацию ${fractionCfg.getFractionName(user.fraction)}?`, 'small').then(status => {
                    if (!check()) return;
                    if(!status) return player.notify('Приглашение отклонено', 'error');
                    target.user.fraction = user.fraction;
                    user.log('fractionInvite', `принял в организацию ${fractionCfg.getFractionName(user.fraction)}`, target)
                    player.notify('Приглашение принято', 'success');
                    target.notify('Приглашение принято', 'success');
                })
            })
        }
    }

    if (user.gr6job && user.gr6jobLeader && target.user.gr6job && !target.user.gr6jobId){
        interaction.add("Добавить в отряд GR6", '', 'peoples', () => {
            if (!check()) return;
            menu.accept(target, `Желаете вступить в отряд GR6`, 'small').then(status => {
                if (!status) return;
                if (!check()) return;
                if (user.gr6job && user.gr6jobLeader && target.user.gr6job && !target.user.gr6jobId){
                    target.user.gr6jobId = user.gr6jobId
                    target.user.gr6jobLeader = false;
                    player.notify("Пополнение в отряде");
                    target.notify("Вы успешно вступили в отряд");
                }
            })

        })
    }

    if(user.familyId != 0 && target.user.familyId == user.familyId && target.user.isFamilyLeader) {
        interaction.add('Передать своё ТС в семью', 'Фракционные', 'car',() => {
            if (!check()) return;

            if(!target.user.family.canBuyMoreCar) return user.notify('Семья достигла лимита ТС')
            if(!user.myVehicles.length) return user.notify('У вас нет ТС')
            const m = menu.new(player, 'Передача ТС семье')
            user.myVehicles.map(v => {
                m.newItem({
                    name: v.model,
                    onpress: () => {
                        if (!check()) return;
                        if(!user.myVehicles.includes(v)) return;
                        if(system.distanceToPos(v.vehicle.position, player.position) > 50) return user.notify('ТС должно быть рядом с Вами')
                        m.close()
                        menu.accept(target, `Игрок ${target.user.getShowingNameString(player)} (${target.user.getShowingIdString(player)}) хочет передать ТС ${v.model} Вашей семье`, 'small').then(status => {
                            if (!status) return;
                            if (!check()) return;
                            if(!user.myVehicles.includes(v)) return;
                            if(user.familyId == 0 || target.user.familyId != user.familyId || !target.user.isFamilyLeader) return;
                            if(!target.user.family.canBuyMoreCar) return user.notify('Семья достигла лимита ТС')
                            if (BATTLE_PASS_VEHICLES.find(el => v.model === el) !== undefined)
                                return player.notify('Нельзя передавать машины из боевого пропуска');

                            // v.setOwnerFamily(target.user.family.entity, )

                            Vehicle.selectParkPlace(target, v.avia, true).then(place => {
                                if (!place) return target.notify("Для покупки ТС необходимо указать парковочное место, где ТС будет храниться", "error");
                                if (!check()) return;
                                if(!user.myVehicles.includes(v)) return;
                                const getParkPos = () => {
                                    if (place.type === "house") return houses.getFreeVehicleSlot(place.id, v.avia)
                                    else return parking.getFreeSlot(place.id)
                                }
                                if(user.familyId == 0 || target.user.familyId != user.familyId || !target.user.isFamilyLeader) return;
                                if (!target.user.family.canBuyMoreCar) return target.notify('В семье недостаточно слотов для нового ТС')
                                v.setOwnerFamily(target.user.family.entity, getParkPos());
                                user.notify(`Вы передали своё ТС в семью`)
                                target.notify('Вы получили новое ТС в семью')
                            })

                        })
                    }
                })
            })

            m.open()

        })
    }

    if (!target.user.cuffed) {
        interaction.add("Романтическое", '', 'heart', () => {
            if (!check()) return;
            let subinteract = new InterractionMenu(player);
            subinteract.onBack = () => {
                playerInteract(player, targetId);
            }
            SYNC_ANIM_LIST.map(item => {
                subinteract.add(item.name, '', 'lips', () => {
                    if (!check()) return;
                    menu.accept(target, `Желаете проиграть анимацию ${item.name} с ${target.user.getShowingNameString(player)} (${target.user.getShowingIdString(player)})?`, 'small').then(status => {
                        if(!status) return;
                        if (!check()) return;
                        let playerAnim = typeof item.anim1 === "string" ? item.anim1 : (player.user.male ? item.anim1[0] : item.anim1[1]);
                        let targetAnim = typeof item.anim2 === "string" ? item.anim2 : (target.user.male ? item.anim2[0] : item.anim2[1]);
                        player.user.playSyncAnimation(target, [item.dict1, playerAnim], [item.dict2, targetAnim], item.dist)
                    })
                })
            })
            subinteract.open();
        })
    }

    if(!user.isFamiliar(target)) interaction.add(user.isFamiliar(target) ? "Познакомиться повторно" : "Познакомиться", 'Социальные', 'chatbubbles',() => {
        if (!check()) return;
        player.notify("Вы предложили человеку познакомиться", "success");
        menu.accept(target, "Хотите познакомиться? (" + player.dbid + ")", 'small').then(status => {
            if (!check()) return;
            if (!status) return player.notify("Человек не захотел с вами знакомиться", "error");


            user.newFamiliar(target, target.user.name);
            target.user.newFamiliar(player, user.name);
            if(!user.isFamiliar(target)){
                player.user.achiev.achievTickByType("newMeet")
                target.user.achiev.achievTickByType("newMeet")
            }
            player.notify("Вы успешно познакомились", "success")
            target.notify("Вы успешно познакомились", "success")

            // menu.input(player, "Как хотите представиться", user.name).then(myname => {
            //     if (!check()) return;
            //     if (!myname) {
            //         player.notify("Знакомство не состоялось", "error")
            //         target.notify("Знакомство не состоялось", "error")
            //         return;
            //     }
            //     menu.input(target, "Как хотите запомнить человека?", myname).then(myname => {
            //         if (!check()) return;
            //         if (!myname) {
            //             player.notify("Знакомство не состоялось", "error")
            //             target.notify("Знакомство не состоялось", "error")
            //             return;
            //         }
            //         menu.input(target, "Как хотите представиться", target.user.name).then(targetname => {
            //             if (!check()) return;
            //             if (!targetname) {
            //                 player.notify("Знакомство не состоялось", "error")
            //                 target.notify("Знакомство не состоялось", "error")
            //                 return;
            //             }
            //             menu.input(player, "Как хотите запомнить человека?", targetname).then(targetname => {
            //                 if (!check()) return;
            //                 if (!targetname) {
            //                     player.notify("Знакомство не состоялось", "error")
            //                     target.notify("Знакомство не состоялось", "error")
            //                     return;
            //                 }
            //                 user.newFamiliar(target, targetname);
            //                 target.user.newFamiliar(player, myname);
            //                 if(!user.isFamiliar(target)){
            //                     player.user.achiev.achievTickByType("newMeet")
            //                     target.user.achiev.achievTickByType("newMeet")
            //                 }
            //                 player.notify("Вы успешно познакомились", "success")
            //                 target.notify("Вы успешно познакомились", "success")
            //                 user.playSyncAnimation(target, ["mp_ped_interaction", "handshake_guy_a"], ["mp_ped_interaction", "handshake_guy_b"])
            //             })
            //         })
            //     })
            // })

        })
    })

    mp.events.call('interaction:openPlayer', player, target, interaction);

    interaction.open();
}

CustomEvent.registerClient('interractionMenu:select', (player, id: number, index: number) => {
    const m = InterractionMenu.get(id);
    if(!m) return;
    m.handle(index);
})
CustomEvent.registerClient('interractionMenu:onBack', (player, id: number) => {
    const m = InterractionMenu.get(id);
    if(!m) return;
    m.handle(99);
})
CustomEvent.registerClient('interractionMenu:onExit', (player, id: number) => {
    const m = InterractionMenu.get(id);
    if(!m) return;
    m.handle(100);
})

mp.events.add('playerDeath', player => {
    truckLeaveEvent(player)
})

mp.events.add('playerQuit', player => {
    truckLeaveEvent(player)
})

const truckLeaveEvent = (player: PlayerMp) => {
    if(!player.user) return;
    if (player.dbid && player.getVariable('inVehicleTruck')) {
        player.setVariable('inVehicleTruck', null);
        const veh = Vehicle.toArray().find(target => target.playerInTruck === player.dbid);
        if (veh) veh.playerInTruck = null
    }
}
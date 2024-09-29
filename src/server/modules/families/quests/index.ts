import {inventory} from '../../inventory';
import {colshapes} from '../../checkpoints'
import {CustomEvent} from '../../custom.event';
import {
    FAMILY_REQUEST_CARGO_AMOUNT,
    FAMILY_REQUEST_CARGO_PRICE,
    FAMILY_TIMEOUT_AFTER_CARGO_REQUEST,
    FamilyTasks,
    FamilyTasksInterface,
    FamilyTasksLoading
} from '../../../../shared/family';
import {inventoryShared, OWNER_TYPES} from "../../../../shared/inventory";
import {User} from "../../user";
import {Vehicle} from "../../vehicles";

import './cargobattle'
import {system} from "../../system";
import {isABike, isAHeli, isAMotorcycle, isAPlane} from "../../../../shared/vehicles";
import {NpcSpawn} from "../../npc";
import {menu} from "../../menu";


let quests = FamilyTasks

mp.events.add({
    'playerDeath': (p) => findAndDeleteQuestBox(p),
    'playerQuit': (p) => findAndDeleteQuestBox(p),
})

CustomEvent.registerCef('family:tasks:setGPS', (player:PlayerMp, name:string) => {
    if(!player.user || !player.user.family) return;
    const quest = player.user.family.hourQuests.find(hq => hq.name == name)
    if(!quest) return;
    if(quest.type == 0) {
        const pos = FamilyTasksLoading[0].carRegisterCoords[0]
        player.user.setWaypoint(pos.x, pos.y, pos.z)
    }
})

const findAndDeleteQuestBox = (player: PlayerMp, nobox = false) => {
    if(!mp.players.exists(player) || !player.user) return;
    const user = player.user
    const findItem = user.haveItem(864)
    if(findItem || nobox) {
        if(findItem) inventory.deleteItem(findItem)
        if(user.walkingWithObject) user.walkingWithObject = false
        CustomEvent.triggerClient(player, 'family:outBox')
        if(!player.vehicle) player.stopAnimation()
    }
}

mp.events.add("playerEnterVehicle", (player: PlayerMp, vehicle: VehicleMp, seat: number) => {
    if(!mp.players.exists(player)) return;
    if(seat) return;
    if(!vehicle.familyQuest || !player.user || !player.user.family) return;
    if(!Vehicle.getInventory(vehicle).find(i => i.item_id == 864)) return;
    if(vehicle.familyQuestFamilyID && vehicle.familyQuestFamilyID != player.user.family.id) return player.notify('В машине лежит семейный груз, не принадлежащий Вашей семье');
    CustomEvent.triggerClient(player, 'family:quest:setBlip', vehicle.familyQuest.importCoords[0])
    player.notify('В машине лежит семейный груз. Метка разгрузки указана на карте.')
})


const OnQuestObjectSetOwner = (id:number, newOwnerType:OWNER_TYPES, newOwnerID:number, oldOwnerType:OWNER_TYPES, oldOwnerID:number)  => {
    if (!oldOwnerID) return;
    const item = inventory.get(id)
    let takingAnim = false
    if (item && item.item_id == 864) {
        if ((newOwnerType == OWNER_TYPES.VEHICLE || newOwnerType == OWNER_TYPES.VEHICLE_TEMP || newOwnerType == OWNER_TYPES.FRACTION_VEHICLE) && (oldOwnerType == OWNER_TYPES.PLAYER)) {
            if(takingAnim) return;
            const player = User.get(oldOwnerID)
            player.notify('Вы переложили коробку в автомобиль', 'success')
            findAndDeleteQuestBox(player, true)
        }
        if ((oldOwnerType == OWNER_TYPES.VEHICLE || oldOwnerType == OWNER_TYPES.VEHICLE_TEMP || oldOwnerType == OWNER_TYPES.FRACTION_VEHICLE) && (newOwnerType == OWNER_TYPES.PLAYER)) {
            const player = User.get(newOwnerID)
            if(!player.user) return
            let veh:VehicleMp = null
            if(oldOwnerType == OWNER_TYPES.VEHICLE) veh = Vehicle.get(oldOwnerID) ? Vehicle.get(oldOwnerID).vehicle : null
            if(oldOwnerType == OWNER_TYPES.VEHICLE_TEMP) veh = Vehicle.getByTmpId(oldOwnerID);
            if(oldOwnerType ==  OWNER_TYPES.FRACTION_VEHICLE) veh = Vehicle.getByCarageCarId(oldOwnerID) || null
            if(!veh || !veh.familyQuest) return player.notify('Произошла ошибка. Обратитесь к Администрации сервера');
            player.user.familyCargoType = FamilyTasks.findIndex(ft => ft.name == veh.familyQuest.name && ft.type == veh.familyQuest.type && ft.desc == veh.familyQuest.desc)
            takingAnim = true
            player.user.playAnimationWithResult(["anim@heists@box_carry@", "idle"], 1, 'Получаем коробку', player.heading).then(status => {
                takingAnim = false
                if(!status) return;
                if(!mp.players.exists(player)) return;
                if(!player.user.haveItem(864)) return;
                player.notify(`Вы взяли коробку из автомобиля. Задание: ${veh.familyQuest.name}`, 'success')
                giveFamilyQuestCargo(player)
            })
        }
    }
}

CustomEvent.register('inventory:updateowner', OnQuestObjectSetOwner)

CustomEvent.registerClient('family:quest:veryOut', (player) => {
    findAndDeleteQuestBox(player)
    player.notify('Вы потеряли коробку', 'info')
    player.user.family.cargo += inventoryShared.get(864) ? inventoryShared.get(864).base_weight / 1000 : 10
})

CustomEvent.registerCef('family:tasks', (player, task, isActive) => {
    if(!mp.players.exists(player) || !player.user) return;
    if(isActive) {
        player.user.active_family_quest = task+1
        player.notify('Теперь вы участвуете в выполнении семейного задания', 'info')
    }
    else player.user.active_family_quest = 0
});


export const registerFamilyCargoVehicle = (player:PlayerMp) => {
    const user = player.user
    if(!user) return;
    if(!user.family) return player.notify('Вы должны состоять в семье')
    const quest = user.getActiveFamilyQuest(0);
    if(!quest) return player.notify('Вы не активировали задание для семьи в планшете', 'error')
    const vehicle = player.vehicle;
    if(!vehicle || player.seat != 0) return player.notify('Вы должны быть за рулем транспорта', 'error')
    if(isABike(vehicle.modelname) || isAMotorcycle(vehicle.modelname) || isAPlane(vehicle.modelname) || isAHeli(vehicle.modelname)) return player.notify('Вы не можете зарегистрировать данное транспортное средство')
    if(vehicle.familyQuestFamilyID && vehicle.familyQuestFamilyID != user.family.id) return player.notify('Машина зарегистрирована для доставки груза другой семьи', 'error')
    if(Vehicle.getInventory(vehicle).find(i => i.item_id == 864)) return player.notify('В автомобиле уже присутствует груз. Вам нужно его отвезти', 'error')
    vehicle.familyQuestFamilyID = user.family.id;
    vehicle.familyQuest = quest
    player.notify('Машина загрузки груза семьи для задания назначена', 'success');
}


setTimeout(() => {
    FamilyTasksLoading.map(questSettings => {
        if (questSettings.type == 0) {
            questSettings.requestCargoNpc.map(coords => {
                new NpcSpawn(new mp.Vector3(coords.x, coords.y, coords.z), coords.h, coords.model, 'Покупка груза', player => {
                    const user = player.user;
                    if(!user || !user.family) return;
                    const family = user.family;
                    if(!family.isCan(user.familyRank, 'request_cargo')) return player.notify('У вас нет полномочий для заказа семейного груза')
                    const m = menu.new(player, 'Заказ груза для семьи', '');
                    const lastRequestTime = family.lastCargoRequest ? system.timestamp - family.lastCargoRequest - FAMILY_TIMEOUT_AFTER_CARGO_REQUEST : 0
                    m.newItem({
                        name: 'Купить груз для семьи',
                        more: lastRequestTime<0 ? 'Недоступно' : '',
                        desc: lastRequestTime<0 ?
                            `Будет доступно через ${system.secondsToString(lastRequestTime*-1)}` :
                            `Нажмите для заказа ${FAMILY_REQUEST_CARGO_AMOUNT} кг груза за $${system.numberFormat(FAMILY_REQUEST_CARGO_PRICE)}`,
                        onpress: item => {
                            if(family.lastCargoRequest && system.timestamp - family.lastCargoRequest < FAMILY_TIMEOUT_AFTER_CARGO_REQUEST) return;
                            m.close()
                            if(family.money < FAMILY_REQUEST_CARGO_PRICE) return player.notify('На счету семьи недостаточно средств')
                            if(family.cargo + FAMILY_REQUEST_CARGO_AMOUNT > family.maximumCargoCount) return player.notify('Склад семьи переполнен, груз не поместится')
                            family.removeMoney(FAMILY_REQUEST_CARGO_PRICE, player, 'Покупка груза в порту')
                            family.cargo += FAMILY_REQUEST_CARGO_AMOUNT
                            family.lastCargoRequest = system.timestamp
                            player.notify(`Вы купили ${FAMILY_REQUEST_CARGO_AMOUNT} кг груза за $${system.numberFormat(FAMILY_REQUEST_CARGO_PRICE)}`)
                        }
                    })
                    m.open();
                })
            })

            questSettings.carRegisterCoords.map(coords => {
                colshapes.new(new mp.Vector3(coords.x, coords.y, coords.z + 0.03),
                    `Регистрация на загрузку для семей` ,
                    (player) => registerFamilyCargoVehicle(player),
                    {
                        drawStaticName: "scaleform",
                        type: 27,
                        radius: 4
                    }
                )
            })

            questSettings.loadingCoords.map(loadingCoords => {
                colshapes.new(new mp.Vector3(loadingCoords.x, loadingCoords.y, loadingCoords.z), "Точка загрузки товара для семей", player => {
                    if(player.vehicle) return player.notify('Вы не можете получить груз, находясь в машине', 'error')
                    const user = player.user;
                    if (!user || !user.family) return;

                    let vehHere = false
                    let vehVeryClose = false
                    mp.vehicles.toArray().map(veh => {
                        if(vehHere) return;
                        if(veh.streamedPlayers.find(p => p == player)) {
                            if(veh.familyQuestFamilyID == player.user.family.id) {
                                if (system.distanceToPos(player.position, veh.position) <= 50.0) vehHere = true
                                if (system.distanceToPos(player.position, veh.position) <= 12.0) vehVeryClose = true
                            }
                        }
                    })
                    if(!vehHere) return player.notify('Рядом должен находиться автомобиль, зарегистрированный для доставки груза Вашей семьи')
                    if(vehVeryClose) return player.notify('Политика склада запрещает нахождение транспорта Вашей семьи вблизи зоны погрузки')

                    const item = user.haveItem(864)
                    const weight = inventoryShared.get(864) ? inventoryShared.get(864).base_weight / 1000 : 10
                    if(user.family.cargo < weight) return player.notify('На складе семьи недостаточно груза')
                    if (!item) {
                        user.playAnimationWithResult(["anim@heists@box_carry@", "idle"], 3, 'Получаем коробку', player.heading).then(status => {
                            if (!status) return;
                            if(!mp.players.exists(player)) return;
                            if(user.family.cargo < weight) return player.notify('На складе семьи недостаточно груза')
                            user.family.cargo -= weight
                            giveFamilyQuestCargo(player)
                        })
                    }
                    else {
                        player.notify('Вы вернули коробку на склад', 'success')
                        user.family.cargo += weight
                        findAndDeleteQuestBox(player)
                    }
                }, {
                    radius: 1,
                    type: 27,
                    drawStaticName: "scaleform"
                })
            })
        }
    })
}, 10000)


export const giveFamilyQuestCargo = (player:PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if(player.vehicle) return player.notify('Вы не можете получить груз, находясь в машине', 'error')
    CustomEvent.triggerClient(player, 'family:getBox')
    player.user.walkingWithObject = true
    player.user.playAnimation([["anim@heists@box_carry@", "idle"]], true, true)
    if(!user.haveItem(864)) {
        user.giveItem(864, true, true).then(r => {
            player.notify('Отнесите коробку в автомобиль, предназначенный для семейного задания', 'info')
        })
    }
}


export const exportFamilyQuestCargo = (player:PlayerMp, quest:FamilyTasksInterface) => {
    const user = player.user;
    if (!user) return;
    if(!user.haveItem(864) || user.familyCargoType == -1) return;
    user.familyCargoType = -1
    player.notify(`Вы сдали коробку на склад. Получено +${quest.scores} очков семьи.`, 'success')
    user.familyScores += quest.scores
    user.family.addPoints(quest.scores)
    user.family.money += quest.money
    // user.family.addMoney(quest.money, player,`Сдал коробку на склад`)
    findAndDeleteQuestBox(player)
}

quests.map((quest,id) => {
    if (quest.type == 0) {

        
        quest.importCoords.map(importPos => {
            colshapes.new(new mp.Vector3(importPos.x, importPos.y, importPos.z), "Точка разгрузки товара для семей", player => {
                const user = player.user;
                if (!user) return;
                if(!user.haveItem(864) || user.familyCargoType == -1) return;
                if(user.familyCargoType != id) return player.notify('Вы не можете сдать сюда эту коробку, так как она для другого задания', 'error')
                user.playAnimationWithResult(["anim@heists@box_carry@", "idle"], 2, 'Погрузка коробки', player.heading).then(status => {
                    if(!status) return;
                    if(!mp.players.exists(player)) return;
                    exportFamilyQuestCargo(player, quest)
                })
            }, {
                radius: 1,
                type: 27,
                drawStaticName: "scaleform"
            })
        })
    }
})




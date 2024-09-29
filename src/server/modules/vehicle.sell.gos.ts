import {
    VEHICLE_SELL_CONFIG,
    VEHICLE_SELL_GOS_CONFIG,
    VEHICLE_SELL_PLAYER_RADIUS,
    VEHICLE_SELL_POS_RADIUS
} from "../../shared/vehicle.sell.gos";
import {menu} from "./menu";
import {NpcSpawn} from "./npc";
import {system} from "./system";
import {colshapes} from "./checkpoints";
import {Vehicle} from "./vehicles";
import {CustomEvent} from "./custom.event";
import {PARKING_START_COST} from "../../shared/parking";
import {houses} from "./houses";
import {parking} from "./businesses/parking";
import {Family} from "./families/family";
import {BATTLE_PASS_VEHICLES} from "../../shared/battlePass/main";

new NpcSpawn(VEHICLE_SELL_GOS_CONFIG.pos, VEHICLE_SELL_GOS_CONFIG.heading, VEHICLE_SELL_GOS_CONFIG.model, VEHICLE_SELL_GOS_CONFIG.name, player => {
    const user = player.user;
    if(!user) return;
    const m = menu.new(player, VEHICLE_SELL_GOS_CONFIG.name, 'Список ТС на продажу');

    let myVehs = user.myVehicles;
    let famVehs = user.family && user.family.isCan(user.familyRank, 'sellVehicle') ? Vehicle.getFamilyVehicles(user.familyId) : [];

    [...myVehs, ...famVehs].map(veh => {

        const target = veh.vehicle
        const ch = () => {
            if (!veh.exists || target.dimension != player.dimension || system.distanceToPos(player.position, target.position) > VEHICLE_SELL_GOS_CONFIG.distanceForSell) { player.notify('Транспорт должен быть поблизости', 'error'); return false; }
            if (veh.fine) { player.notify('На ТС есть неоплаченый штраф', 'error'); return false }
            return true;
        }

        if(veh.isDonate && BATTLE_PASS_VEHICLES.find(el => el === target.entity.model) === undefined){
            m.newItem({
                name: `${veh.name} ${veh.number}`,
                type: 'list',
                list: [`$${system.numberFormat(veh.sellSumMoney)}`, `${system.numberFormat(veh.sellSumCoin)} коинов`],
                onpress: (item) => {
                    if (!ch()) return;
                    menu.accept(player, `Вы уверены что хотите продать ${veh.name} государству за ${item.listSelected ? `${system.numberFormat(veh.sellSumCoin)} коинов` : `$${system.numberFormat(veh.sellSumMoney)}`}`).then(status => {
                        if (!status) return;
                        if (!ch()) return;
                        menu.close(player);
                        if (item.listSelected) veh.sellVehicleByCoin()
                        else veh.sellVehicleByMoney();
                        user.achiev.achievTickByType('vehSellGos')
                        player.notify('ТС успешно продан', 'success');
                    })
                }
            })
        } else {
            m.newItem({
                name: `${veh.name} ${veh.number}`,
                more: `$${system.numberFormat(veh.sellSumMoney)}`,
                onpress: (item) => {
                    if (!ch()) return;
                    menu.accept(player, `Вы уверены что хотите продать ${veh.name} государству за $${system.numberFormat(veh.sellSumMoney)}`).then(status => {
                        if (!status) return;
                        if (!ch()) return;
                        menu.close(player);
                        veh.sellVehicleByMoney();
                        user.achiev.achievTickByType('vehSellGos')
                        player.notify('ТС успешно продан', 'success');
                    })
                }
            })
        }
    })


    m.open();
})

let textList = new Map<number, TextLabelMp>();
let sellerList = new Map<number, PlayerMp>();
let vehicleList = new Map<number, VehicleMp>();
let priceList = new Map<number, number>();

const verifyPoints = () => {
    [...sellerList].map(([index, target]) => {
        const cfg = VEHICLE_SELL_CONFIG[index];
        if(!mp.players.exists(target)) return clearPoint(index);
        if(system.distanceToPos(target.position, cfg.pos) > VEHICLE_SELL_PLAYER_RADIUS) return clearPoint(index);
    });
    [...vehicleList].map(([index, veh]) => {
        const cfg = VEHICLE_SELL_CONFIG[index];
        if(!mp.vehicles.exists(veh)) return clearPoint(index);
        if(system.distanceToPos(veh.position, cfg.pos) > VEHICLE_SELL_POS_RADIUS) return clearPoint(index);
    })
}

setInterval(() => {
    verifyPoints();
}, 5000)

const clearPoint = (index: number) => {
    const veh = vehicleList.get(index)
    if (veh && mp.vehicles.exists(veh)){
        Vehicle.freeze(veh, false)
    }
    vehicleList.delete(index);
    sellerList.delete(index);
    if(textList.has(index) && mp.labels.exists(textList.get(index))) textList.get(index).text = 'Свободное место'
    priceList.delete(index);
}

const canControl = (player: PlayerMp, index: number) => {
    verifyPoints();
    if(!sellerList.has(index) && [...sellerList].find(q => q[1].dbid === player.dbid)) {
        player.notify('Вы уже продаёте ТС в другой точке', 'error');
        return false
    }
    return true
}

const getVehicleData = async (vehicle: VehicleMp, index: number) => {
    if(!mp.vehicles.exists(vehicle) || !vehicle.entity) return null;
    const ent = vehicle.entity
    const ownerData = await ent.ownerData;
    return {
        carModel: vehicle.modelname.toLowerCase(),
        carName: ent.name,
        carPlate: ent.number,
        carFuel: ent.config.fuel_max,
        carOwner: ent.owner ? ownerData.rp_name : Family.getByID(ent.familyOwner)?.name,
        carTypeFuel: ent.config.fuel_type,
        carBag: ent.config.stock,
        pos: index,
        color: Vehicle.getPrimaryColor(vehicle),
        color2: Vehicle.getSecondaryColor(vehicle),
        carPrice: priceList.has(index) ? priceList.get(index) : 0
    }
}

VEHICLE_SELL_CONFIG.map((item, index) => {
    textList.set(index, mp.labels.new('Свободное место', item.textPos, {
        drawDistance: 5,
        los: true
    }))
    colshapes.new(item.pos, `Точка продажи #${(index + 1)}`, player => {
        verifyPoints();
        if(sellerList.has(index) && sellerList.get(index).dbid !== player.dbid){
            getVehicleData(player.vehicle, index).then(data => {
                if(!data) return;
                if(!player.vehicle || !player.vehicle.entity || !player.vehicle.entity.data) return;
                CustomEvent.triggerClient(player, 'vehicle:sell:menu', data, player.vehicle.entity.data.tuning);
            });
            return;
        }
        if(!canControl(player, index)) return;
        if(sellerList.has(index)){
            const m = menu.new(player, 'Авторынок', 'Действия');
            m.newItem({
                name: 'Цена продажи',
                more: `$${system.numberFormat(priceList.get(index))}`,
                onpress: () => {
                    verifyPoints();
                    if(!vehicleList.has(index)) return;
                    menu.input(player, 'Введите новую цену', priceList.get(index), 8, 'int').then(cost => {
                        if(!cost) return;
                        if(cost < 0) return;
                        if(isNaN(cost)) return;
                        verifyPoints();
                        if(!vehicleList.has(index)) return;
                        priceList.set(index, cost);
                        textList.get(index).text = `${vehicleList.get(index).entity.name}\n$${system.numberFormat(cost)}`;
                    })
                }
            })
            m.newItem({
                name: '~r~Снять с продажи',
                onpress: () => {
                    verifyPoints();
                    if(!vehicleList.has(index)) return;
                    menu.accept(player).then(status => {
                        if(!status) return;
                        clearPoint(index);
                    })
                }
            })
            m.open()
        } else {

            const checkSellableError = checkPlayerVehicleSellable(player);
            if (checkSellableError) {
                return player.notify(checkSellableError, 'error');
            }

            getVehicleData(player.vehicle, index).then(data => {
                if(!data) return;
                if(!player.vehicle || !player.vehicle.entity || !player.vehicle.entity.data) return;
                CustomEvent.triggerClient(player, 'vehicle:sell:menu', data, player.vehicle.entity.data.tuning);
            })
        }
    }, {
        radius: VEHICLE_SELL_POS_RADIUS,
        type: 27
    })
})

/**
 * Проверяет, может ли игрок выставить авто, в котором сидит, на продажу на авторынке
 * @return Возвращает текст ошибки
 */
function checkPlayerVehicleSellable(player: PlayerMp): string {
    if(!player.vehicle)
        return 'Вы должны быть в ТС';
    if(!player.vehicle.entity)
        return 'Данный ТС нельзя выставить на продажу';
    if(player.vehicle.entity.owner && player.vehicle.entity.owner != player.dbid)
        return 'Данный ТС вам не принадлежит';
    if(player.vehicle.entity.familyOwner && player.vehicle.entity.familyOwner != player.user.familyId)
        return 'Данный ТС принадлежит не вашей семье';
    if(player.vehicle.entity.familyOwner && player.vehicle.entity.familyOwner == player.user.familyId && !player.user.isFamilyLeader)
        return 'Вы не можете выставлять ТС на продажу на Авторынке';
    if(player.vehicle.entity.isDonate)
        return 'Нельзя выставлять на продажу ТС, который был куплен за донат';
    if(player.vehicle.entity.data.cost < 1)
        return 'Данное ТС невозможно выставить на продажу';
    if(player.vehicle.entity.tax)
        return 'Оплатите все налоги на данный ТС прежде чем выставлять на продажу';

    return null;
}

CustomEvent.registerCef('vehicle:sell:place', (player, index: number, price: number) => {
    const user = player.user;
    if(!user) return;
    verifyPoints();
    if(sellerList.has(index)) return player.notify('Место уже занято');

    const checkSellableError = checkPlayerVehicleSellable(player);
    if (checkSellableError) {
        return player.notify(checkSellableError, 'error');
    }

    if(price < 1) return player.notify('Укажите цену', 'error');
    textList.get(index).text = `${player.vehicle.entity.name}\n$${system.numberFormat(price)}`;
    priceList.set(index, price);
    sellerList.set(index, player);
    vehicleList.set(index, player.vehicle);
    player.notify('ТС размещён на продажу');
    const pos = VEHICLE_SELL_CONFIG[index].pos
    player.vehicle.position = new mp.Vector3(pos.x, pos.y, player.vehicle.position.z);
    player.vehicle.rotation = new mp.Vector3(0,0, VEHICLE_SELL_CONFIG[index].heading)
    Vehicle.freeze(player.vehicle, true)
    Vehicle.setEngine(player.vehicle, false);
})


CustomEvent.registerCef('vehicle:sell:buy', (player, index: number, price: number, isFamily = false) => {
    const user = player.user;
    if(!user) return;
    verifyPoints();
    if(!sellerList.has(index)) return player.notify('ТС не продаётся', "error");
    if(price < 1) return player.notify('Укажите цену', 'error');
    if(priceList.get(index) !== price) return player.notify('Цена изменилась', 'error');
    const vehicle = vehicleList.get(index);
    if (!vehicle) return player.notify('ТС не продаётся', "error");
    const veh = vehicle.entity;
    if(vehicle !== player.vehicle) return player.notify('Вы должны находиться в ТС для покупки', 'error');
    if(isFamily) {
        if(!user.family || !user.family.isCan(user.familyRank, 'buyCar')) return player.notify('У вас нет полномочий покупать транспорт семьи')
        if(!user.family.canBuyMoreCar) return player.notify('В семье недостаточно слотов для нового ТС')
        if(user.family.money < price) return player.notify('У вашей семьи недостаточно средств для покупки данного ТС')
    }
    else {
        if (user.myVehicles.length >= user.current_vehicle_limit) return player.notify(`Вы можете иметь не более ${user.current_vehicle_limit} ТС. Дополнительные слоты можно приобрести в личном кабинете`, "error");
        if(user.money < price) return player.notify('У вас недостаточно средств для покупки', 'error')
    }

    Vehicle.selectParkPlace(player, veh.avia, isFamily).then(place => {
        if (!place) return player.notify("Для покупки ТС необходимо указать парковочное место, где ТС будет храниться", "error");
        const getParkPos = () => {
            if (place.type === "house") {
                return houses.getFreeVehicleSlot(place.id, veh.avia)
            } else {
                return parking.getFreeSlot(place.id)
            }
        }
        if (priceList.get(index) !== price) return player.notify('Цена изменилась', 'error');
        if (!sellerList.has(index)) return player.notify('ТС не продаётся', "error");
        const owner = sellerList.get(index);
        if (!owner) return player.notify('ТС не продаётся', 'error');
        const familyVeh = veh.familyOwner
        if(isFamily){
            if(!user.family || !user.family.isCan(user.familyRank, 'buyCar')) return player.notify('У вас нет полномочий покупать транспорт семьи')
            if(!user.family.canBuyMoreCar) return player.notify('В семье недостаточно слотов для нового ТС')
            if(user.family.money < price) return player.notify('У вашей семьи недостаточно средств для покупки данного ТС')
            user.family.removeMoney(price, player, `Покупка ТС ${veh.name} на авторынке`)
            veh.setOwnerFamily(user.family.entity, getParkPos());
        } else {

            if (user.money < price) return player.notify('У вас недостаточно средств для покупки', 'error');

            if (place.type === "parking") {
                if(!user.bank_have) return player.notify('Для оплаты парковки необходимо иметь банковский счёт', 'error');
                if (user.bank_money < PARKING_START_COST) return player.notify('У вас недостаточно средств на банковском счету для оплаты парковки', 'error')
                user.tryRemoveBankMoney(PARKING_START_COST, true, 'Оплата парковочного места', 'Парковка #' + place.id)
            }

            user.removeMoney(price, true, `Покупка ТС на авторынке ${veh.name} ${veh.id} у ${owner.user.name} ${owner.dbid}`);
            veh.setOwner(user.entity, getParkPos());
        }
        if(owner.vehicle === vehicle && owner.user.isDriver) owner.user.leaveVehicle();
        if(owner) owner.user.achiev.achievTickByType("vehSellPlayer")
        player.notify('ТС успешно приобретено', 'success');
        owner.notify('ТС успешно приобретено', 'success');
        if(familyVeh){
            owner.user.family.addMoney(price, owner, `Продажа ТС на авторынке ${veh.name} ${veh.id} игроку ${user.name} ${player.dbid}`);
        } else {
            owner.user.addMoney(price, true, `Продажа ТС на авторынке ${veh.name} ${veh.id} игроку ${user.name} ${player.dbid}`);
        }
        clearPoint(index);
    })
    
    
})

import {BusinessEntity} from "../typeorm/entities/business";
import {menu} from "../menu";
import {business, businessCatalogMenu} from "../business";
import {system} from "../system";
import {getVehicleConfigById, Vehicle} from "../vehicles";
import {CustomEvent} from "../custom.event";
import {AutosalonCarItem} from "../../../shared/autosalon";
import {LicenseName} from "../../../shared/licence";
import {BUSINESS_TYPE} from "../../../shared/business";
import {parking} from "./parking";
import {houses} from "../houses";
import {PARKING_START_COST} from "../../../shared/parking";
import {VEHICLE_FUEL_TYPE} from "../../../shared/vehicles";
import {getAchievConfigBiz, getAchievConfigByType} from "../../../shared/achievements";
import {saveEntity} from "../typeorm";
import {canUserStartBizWar, createBizMenuBizWarItem, startBizWar} from "../bizwar";
import {writeClientRatingLog} from "./tablet";

const openShop = (player: PlayerMp, item: BusinessEntity) => {
    if (!player.user) return;
    const user = player.user;
    if (item.sub_type === 0) {
        player.user.setGui('rent');
        if (player.rentCar) CustomEvent.triggerCef(player, 'rentCar:denied', player.rentCar.modelname)
        const rentCars: { name: string, cost: number }[] = [];
        item.catalog.map(car => {
            const { name } = getVehicleConfigById(car.item)
            rentCars.push({ name: name, cost: car.price })
        })
        CustomEvent.triggerCef(player, 'rentCar:open', item.id, rentCars)
        return;
    }
    const catalog: AutosalonCarItem[] = item.catalog.filter(car => getVehicleConfigById(car.item)).map(car => {
        const { name, fuel_type, fuel_max, fuel_min, model, stock } = getVehicleConfigById(car.item)
        return {
            ...car, name, fuel_type, fuel_max, fuel_min, model, stock
        }
    })
    player.dimension = player.id + 1;
    CustomEvent.triggerClient(player, "autosalon:start", item.name, item.id, catalog, item.positions[0], item.positions[1], item.positions[2], item.donate, user.family && user.family.isCan(user.familyRank, 'buyCar'))
}

CustomEvent.registerClient('server:autosalon:stopBuyCar', player => {
    player.dimension = 0;
})

CustomEvent.registerCef('rentCar:stopRent', (player) => {
    const user = player.user;
    if (!user) return;
    if (!player.rentCar) return;
    Vehicle.destroy(player.rentCar);
    player.rentCar = null;
    user.setGui(null);
})

CustomEvent.registerCef('rentCar:rent', (player, shopId: number, modelName: string) => {
    const user = player.user;
    if (!user) return;
    const shop = business.get(shopId);
    const car = shop.catalog.find(el => getVehicleConfigById(el.item).name == modelName)
    if (!car) return;
    const { name, fuel_type, fuel_max, fuel_min, model, stock, license } = getVehicleConfigById(car.item)
    if (license && !user.haveActiveLicense(license)) return player.notify(`Чтобы взять ${name} в аренду необходимо иметь активную лицензию на ${LicenseName[license]}`, "error");
    user.tryPayment(car.price, 'all', () => {
        return !player.rentCar
    }, `Аренда транспорта ${name}`, `#${shop.id} ${shop.name}`).then(val => {
        if (!val) return openShop(player, shop);
        const veh = Vehicle.spawn(model, new mp.Vector3(shop.positions[1].x, shop.positions[1].y, shop.positions[1].z), shop.positions[1].h, player.dimension, true, false);
        veh.rentCar = true;
        veh.rentCarOwner = user.id;
        veh.usedAfterRespawn = true;
        player.rentCar = veh;
        let sumBiz = car.price * 0.3;
        sumBiz = sumBiz + (sumBiz / 100 * (shop.upgrade * 10))
        business.addMoney(shop, sumBiz, `Аренда ${name} пользователем ${user.name} ${user.id}`);
        player.user.achiev.setAchievTickBiz(shop.type, shop.sub_type, car.price)
        setTimeout(() => {
            if(mp.players.exists(player) && mp.vehicles.exists(veh)) player.user.putIntoVehicle(player.rentCar, 0);
        }, 100)
        user.setGui(null)
    })
})

CustomEvent.registerClient('autosalon:buyCar', async (player, itemId: number, shopId: number, primary: { r: number, g: number, b: number }, secondary: { r: number, g: number, b: number}, isFamilyMoney:boolean) => {
    if (!player.user) return;
    const user = player.user;
    let shop = business.get(shopId);
    if (!shop) return;
    if (shop.type !== BUSINESS_TYPE.VEHICLE_SHOP) return;
    if(user.myVehicles.find(veh => veh.onParkingFine)) return player.notify('Вы не можете ничего покупать пока имеете ТС на штрафстоянке', 'error');
    const conf = shop.catalog.find(q => q.item == itemId);
    if (!conf || !conf.price) return player.notify('Данный ТС больше не продаётся', 'error');
    if (!conf.count) return player.notify("ТС отсутствует на складе", "error");
    // const pos = user.getFreeVehicleSlot()
    // if(!pos) return player.notify("Для покупки транспорта необходим собственный дом с свободным местом в гараже, либо свободное парковочное место", "error");
    const vehConf = getVehicleConfigById(itemId);
    if(!vehConf) return;
    if (vehConf.license && !user.haveActiveLicense(vehConf.license)) return player.notify(`Чтобы приобрести ${vehConf.name} необходимо иметь активную лицензию на ${LicenseName[vehConf.license]}`, "error");
    if(isFamilyMoney){
        if(!user.family || !user.family.canBuyMoreCar) return player.notify(`У вашей семьи достигнут лимит на количество приобретнённого транспорта`, "error");
    } else {
        if (user.myVehicles.length >= user.current_vehicle_limit) return player.notify(`Вы можете иметь не более ${user.current_vehicle_limit} ТС. Дополнительные слоты можно приобрести в личном кабинете`, "error");
    }
    const air = vehConf.fuel_type === VEHICLE_FUEL_TYPE.AIR;
    if(air && isFamilyMoney){
        const airVeh = Vehicle.getFamilyVehicles(user.familyId).filter(q => q.avia);
        if(airVeh.length > 0) return player.notify("У вашей семьи есть один вертолёт", "error");
    }
    let place = await Vehicle.selectParkPlace(player, air, isFamilyMoney);
    if(!place) return player.notify("Для покупки ТС необходимо указать парковочное место, где ТС будет храниться", "error");
    const getParkPos = () => {
        if (place.type === "house") {
            return houses.getFreeVehicleSlot(place.id, vehConf.fuel_type === VEHICLE_FUEL_TYPE.AIR)
        } else {
            return parking.getFreeSlot(place.id)
        }
    }

    const success = () => {
        shop.removeItemCountByItemId(conf.item, 1)
        saveEntity(shop);
        const pos = getParkPos();
        const {x,y,z,d,h} = pos ? pos : {x: 0, y: 0, z: 0, d: Vehicle.fineDimension, h: 0}
        Vehicle.createNewDatabaseVehicle(player, itemId, primary, secondary, new mp.Vector3(x, y, z), h, d, conf.price, shop.donate, isFamilyMoney).then(async veh => {
            let points = shop.positions.filter((_, index) => index >= 3);
            let nearestvehs = Vehicle.toArray().filter(veh => veh.dimension == 0 && system.isPointInPoints(veh.position, points, 10)).map(veh => veh.position);
            let freePoint = points.find(point => !system.isPointInPoints(point, nearestvehs, 3))
            if (!freePoint) freePoint = Vehicle.findFreeParkingZone(new mp.Vector3(points[0].x, points[0].y, points[0].z), 200)
            if (pos && place.type === "parking"){
                if (!user.tryRemoveBankMoney(PARKING_START_COST, true, 'Оплата парковочного места', 'Парковка #'+place.id) && !user.removeMoney(PARKING_START_COST, true, 'Оплата парковочного места')){
                    veh.moveToParkingFine(0);
                    player.notify("Поскольку у вас нет возможности оплатить парковку мы вынуждены отправить транспорт на штрафстоянку. Вы сможете забрать его оттуда как только будет возможность оплатить первоначальный взнос за парковочное место", "error", null, 15000)
                    return;
                }
            }
            veh.engine = false;
            veh.locked = true;
            if (freePoint){
                Vehicle.teleport(veh.vehicle, new mp.Vector3(freePoint.x, freePoint.y, freePoint.z), freePoint.h, 0);
                veh.vehicle.usedAfterRespawn = true;
                player.notify("Транспорт успешно приобретён и ожидает вас на ближайшей парковке", "success", "CHAR_PEGASUS_DELIVERY");
                if (system.distanceToPos(shop.positions[0], freePoint) > 20) user.setWaypoint(freePoint.x, freePoint.y, freePoint.z, 'Новый ТС', true), player.notify("Поблизости все места заняты, поэтому нам пришлось отогнать ТС подальше. Координаты в вашем GPS навигаторе")
            } else {
                player.notify("Транспорт успешно приобретён. К сожалению все парковочные места заняты и мы доставили ваш ТС на парковочное место.", "success", "CHAR_PEGASUS_DELIVERY");
            }
            player.notify("Не забудьте зарегистрировать ТС, установив на него номерной знак. Передвигатся по городу без регистрации можно лишь ограниченное время", "info", "CHAR_PEGASUS_DELIVERY");
        });
    }
    if(isFamilyMoney){
        const family = user.family;
        if(!family) return;
        if(!family.isCan(user.familyRank, 'buyCar')) return;
        if(shop.donate){
            if(family.donate < conf.price) return player.notify('У вашей семьи недостаточно средств для покупки', 'error');
            family.removeDonateMoney(conf.price, player,`Приобретение транспорта ${vehConf.name}`)
        } else {
            if(family.money < conf.price) return player.notify('У вашей семьи недостаточно средств для покупки', 'error');
            family.removeMoney(conf.price, player,`Приобретение транспорта ${vehConf.name}`)
        }
        success();
        writeClientRatingLog(player, shopId, conf.price, vehConf.name, 1);
    } else {
        user.tryPayment(conf.price, shop.donate ? "donate" : "all", () => {
            const conf = shop.catalog.find(q => q.item == itemId);
            if (!conf || !conf.price){
                player.notify('Данный ТС больше не продаётся', 'error');
                return false
            }
            if (!conf.count){
                player.notify("ТС отсутствует на складе", "error");
                return false
            }
            return !!getParkPos()
        }, `Приобретение транспорта ${vehConf.name}`, `#${shop.id} ${shop.name}`).then(status => {
            if(!status) return;
            success();
            writeClientRatingLog(player, shopId, conf.price, vehConf.name, 1);
            if(!shop.donate) player.user.achiev.setAchievTickBiz(shop.type, shop.sub_type, conf.price)
        })
    }
})

export const autosalonMenu = (player: PlayerMp, item: BusinessEntity) => {
    if (!player.user) return;
    const user = player.user;
    if (!user.isAdminNow(6) && item.userId !== user.id && !canUserStartBizWar(user)) return openShop(player, item);
    let m = menu.new(player, "", user.isAdminNow(6) ? `Бизнес #${item.id}` : "");
    let sprite = "";


    m.newItem({
        name: "Каталог товаров",
        onpress: () => {
            m.close();
            openShop(player, item)
        },
    })
    
    createBizMenuBizWarItem(user, m, item);
    
    if (user.isAdminNow(6) || item.userId === user.id) {
        m.newItem({
            name: '~b~Управление бизнесом',
            onpress: () => {
                businessCatalogMenu(player, item, () => {
                    autosalonMenu(player, item)
                })
            },
        })
    }

    m.open();
}
import {TAXI_CONF} from "../../shared/taxi";
import {colshapes} from "./checkpoints";
import {menu} from "./menu";
import {Vehicle} from "./vehicles";
import {system} from "./system";
import {User} from "./user";
import {NpcSpawn} from "./npc";
import {CustomEvent} from "./custom.event";
import {LEVEL_PERMISSIONS} from "../../shared/level.permissions";
import {getAchievConfigByType} from "../../shared/achievements";
import {JOB_TASK_MANAGER_EVENT} from "./battlePass/tasks/jobTaskManager";

colshapes.new(TAXI_CONF.carRent.pos, 'Пункт аренды такси', player => {
    const user = player.user;
    if(!user) return;
    if (user.level < LEVEL_PERMISSIONS.TAXI) return player.notify(`Аренда доступна с ${LEVEL_PERMISSIONS.TAXI} LVL персонажа`)
    if(!user.taxiJob) return player.notify('Чтобы взять в аренду такси необходимо работать таксистом', 'error', 'CHAR_TAXI');
    const m = menu.new(player, 'Пункт аренды такси', 'Список ТС для аренды');

    TAXI_CONF.carRent.cars.map(car => {
        const cfg = Vehicle.getVehicleConfig(car.model);
        if(!cfg) return;
        m.newItem({
            name: cfg.name,
            more: `$${system.numberFormat(car.cost)}`,
            desc: 'Список заказов вы сможете посмотреть в меню взаимодействия с транспортом. Заказы можно выполнять исключительно на рабочем транспорте',
            onpress: () => {
                user.tryPayment(car.cost, 'all', () => {
                    return user.taxiJob && !user.taxiCar
                }, `Аренда служебного транспорта ${cfg.name}`, 'TAXI').then(status => {
                    if(!status) return;
                    menu.close(player);
                    user.taxiCar = Vehicle.spawn(car.model, TAXI_CONF.carRent.pos, TAXI_CONF.carRent.h, 0, false, false);
                    setTimeout(() => {
                        if(!mp.players.exists(player)) return;
                        if(!mp.vehicles.exists(user.taxiCar)) return;
                        Vehicle.setPrimaryColor(user.taxiCar, TAXI_CONF.carRent.primaryColor.r, TAXI_CONF.carRent.primaryColor.g, TAXI_CONF.carRent.primaryColor.b)
                        Vehicle.setSecondaryColor(user.taxiCar, TAXI_CONF.carRent.secondaryColor.r, TAXI_CONF.carRent.secondaryColor.g, TAXI_CONF.carRent.secondaryColor.b)
                    }, 100)
                    setTimeout(() => {
                        if(!mp.players.exists(player)) return;
                        if(!mp.vehicles.exists(user.taxiCar)) return;
                        user.taxiCar.taxiCar = user.id;
                        player.user.putIntoVehicle(user.taxiCar, 0);
                        CustomEvent.triggerClient(player, 'taxi:car', user.taxiCar.id)
                    }, 1000);
                })
            }
        })
    })
    m.open();
})

system.createBlip(198, 70, TAXI_CONF.carRent.pos, 'Таксопарк');

Vehicle.addBlockNpcCarZone(TAXI_CONF.carRent.pos)

new NpcSpawn(TAXI_CONF.npc.pos, TAXI_CONF.npc.heading, TAXI_CONF.npc.model, TAXI_CONF.npc.name, (player) => {
    const user = player.user;
    if(!user) return;
    const m = menu.new(player, 'Пункт аренды такси', 'Список ТС для аренды');

    if(user.taxiJob){
        m.newItem({
            name: `Уволиться`,
            onpress: () => {
                m.close();
                player.notify('Вы успешно уволились с работы. Будем рады видеть Вас снова', 'error', 'CHAR_TAXI')
                leaveJob(player);
            }
        })
    } else {
        m.newItem({
            name: `Устроиться на работу`,
            onpress: () => {
                if (user.level < LEVEL_PERMISSIONS.TAXI) return player.notify(`Устроиться на работу такси можно с ${LEVEL_PERMISSIONS.TAXI} LVL персонажа`)
                m.close();
                player.notify('Вы успешно устроились на работу', 'success', 'CHAR_TAXI');
                user.taxiJob = true;
            }
        })
    }
    m.open();
})


let orderids = 0;

export const taxi = {
    calculateOrderCost: (start: {x: number, y: number}, end: {x: number, y: number}) => {
        const dist = system.distanceToPos2D(start, end);
        return Math.floor(TAXI_CONF.cost.base + TAXI_CONF.cost.km * (dist / 1000));
    },
    list: <{id: number, user: number, driver?: number, start: {x: number, y: number}, end: {x: number, y: number}, startName: string, endName: string, orderName: string, fake?:true}[]>[],
    newOrder: (player: PlayerMp, start: {x: number, y: number}, end: {x: number, y: number}, startName: string, endName: string) => {
        const user = player.user;
        if(!user) return;
        if(user.taxiJob) return player.notify('Вы не можете заказывать такси поскольку сами в нём работаете', 'error', 'CHAR_TAXI');
        if(taxi.list.find(order => order.user === user.id)) return player.notify('У вас уже есть активный заказ', 'error', 'CHAR_TAXI');
        const dist = system.distanceToPos2D(start, end);
        if(dist < 100) return player.notify('Заказ должен быть не менее чем на 100 метров', 'error', 'CHAR_TAXI');
        orderids++;
        player.notify('Поиск водителя, ожидайте...', 'success', 'CHAR_TAXI');
        const str = `Поступил новый заказ $${system.numberFormat(taxi.calculateOrderCost(start, end))} / ${system.distanceToPos2D(start, end).toFixed(2)}km`;
        mp.players.toArray().filter(target => target.user && target.user.taxiJob).map(target => {
            target.notify(str, 'info', 'CHAR_TAXI');
        })
        taxi.list.push({id: orderids, user: user.id, start, end, startName, endName, orderName: user.name});
    },
    removeOrder: (id: number) => {
        if(taxi.list.findIndex(q => q.id === id) > -1) taxi.list.splice(taxi.list.findIndex(q => q.id === id), 1);
    },
    takeOrder: (player: PlayerMp, id: number) => {
        const user = player.user;
        if(!user) return;
        if(!user.taxiJob) return player.notify('Вы должны работать в такси чтобы принять заказ', 'error', 'CHAR_TAXI');
        if(!user.taxiCar) return player.notify('Вы должны арендовать служебный транспорт чтобы принять заказ', 'error', 'CHAR_TAXI');
        if(player.taxiNpc) return player.notify('Вы уже взяли случайный заказ', 'error', 'CHAR_TAXI');
        if(taxi.list.find(q => q.driver === user.id)) return player.notify('У вас уже есть активный заказ', 'error', 'CHAR_TAXI');
        const order = taxi.list.find(q => q.id === id)
        if(!order) return player.notify('Заказ более не доступен', 'error', 'CHAR_TAXI');
        if(order.user === user.id) return player.notify('Вы не можете принять собственный заказ', 'error', 'CHAR_TAXI');
        const passanger = User.get(order.user);
        if(!passanger || !mp.players.exists(passanger)) return player.notify('Заказ более не доступен', 'error', 'CHAR_TAXI'), taxi.removeOrder(id);
        if(order.driver) return player.notify('Заказ уже принят другим водителем', 'error', 'CHAR_TAXI');
        if(!passanger.user.tryRemoveBankMoney(taxi.calculateOrderCost(order.start, order.end), true, `Оплата заказа такси ${order.id} от ${order.startName} до ${order.endName}`, 'Служба такси')){
            taxi.removeOrder(id);
            passanger.notify('Заказ отменён. У вас недостаточно средств для оплаты', 'error', 'CHAR_TAXI');
            return player.notify('Заказ отменён. У пассажира недостаточно средств для оплаты', 'error', 'CHAR_TAXI');
        }
        order.driver = user.id;
        player.notify('Заказ принят', 'success', 'CHAR_TAXI');
        passanger.notify('Водитель принял ваш заказ, ожидайте приезда', 'success', 'CHAR_TAXI');
        user.setWaypoint(order.start.x, order.start.y, 0, `Пассажир такси. Заказ #${order.id}`);
    },
    orderList: (player: PlayerMp) => {
        const user = player.user;
        if(!user) return;
        const m = menu.new(player, 'Служба такси', 'Список заказов');
        let myOrder = taxi.list.find(q => q.driver === user.id)
        if(myOrder){
            m.newItem({
                name: `~r~Отменить текущий заказ`,
                onpress: () => {
                    myOrder = taxi.list.find(q => q.driver === user.id)
                    if(!myOrder) return player.notify('У вас нет текущего заказа', 'error', 'CHAR_TAXI'), taxi.orderList(player);
                    menu.accept(player, 'Вы точно хотите отменить заказ?', 'big').then(status => {
                        if(!status) return;
                        taxi.setOrderEnd(myOrder.id, false);
                        taxi.orderList(player);
                    })
                }
            })
        }
        const list = taxi.list.filter(q => !q.driver);
        if(list.length === 0){
            m.newItem({
                name: `~r~Заказов нет`,
                more: ``
            })
            m.newItem({
                name: `~b~Взять случайный заказ`,
                desc: 'Система сгенерирует заказ по перевозке случайного пассажира',
                more: ``,
                onpress: () => {
                    if(player.taxiNpc) return player.notify('Вы уже взяли случайный заказ', 'error');
                    if(!user.taxiCar) return player.notify('У вас нет арендованного такси', 'error');
                    myOrder = taxi.list.find(q => q.driver === user.id)
                    if(myOrder) return player.notify('У вас уже есть активный заказ', 'error', 'CHAR_TAXI'), taxi.orderList(player);
                    m.close();
                    const ind = system.randomArrayElementIndex(TAXI_CONF.ordersNpc)
                    if(ind === -1) return;
                    let el = TAXI_CONF.ordersNpc[ind]
                    player.taxiNpc = el.price
                    CustomEvent.triggerClient(player, 'taxi:random', ind)
                }
            })
        }
        list.map((order) => {
            m.newItem({
                name: `${order.orderName}`,
                more: `$${system.numberFormat(taxi.calculateOrderCost(order.start, order.end))} / ${system.distanceToPos2D(order.start, order.end).toFixed(2)}km`,
                desc: `От ${order.startName} до ${order.endName}`,
                onpress: () => {
                    taxi.takeOrder(player, order.id);
                    taxi.orderList(player);
                }
            })
        })
        m.open();
    },
    setOrderEnd: (id: number, status: boolean) => {
        const order = taxi.list.find(q => q.id === id);
        if(!order) return;
        const sum = taxi.calculateOrderCost(order.start, order.end);
        const passanger = User.get(order.user)
        if(!status){
            if(passanger && mp.players.exists(passanger)) passanger.user.addMoney(sum, true, 'Возврат средств за такси');
        } else {
            const driver = User.get(order.driver)
            if(driver && mp.players.exists(driver)) {
                driver.user.addMoney(sum * TAXI_CONF.rewardMultipler, true, 'Оплата перевозки такси игрока ' + order.user)
                mp.events.call(JOB_TASK_MANAGER_EVENT, driver, 'taxi');
                driver.user.achiev.achievTickByType("taxiDriverCount")
                driver.user.achiev.achievTickByType("taxiDriverSum", sum * TAXI_CONF.rewardMultipler)
            }
            if(passanger && mp.players.exists(passanger)){
                passanger.user.achiev.achievTickByType("taxiPassengerCount")
                passanger.user.achiev.achievTickByType("taxiPassengerSum", sum)
            }
        }
        return taxi.removeOrder(id);
    }
}

CustomEvent.registerClient('taxi:delivernpc', player => {
    if(!player.taxiNpc) return;
    player.user.addMoney(player.taxiNpc, true, 'Доставка NPC');
    player.user.achiev.achievTickByType("taxiDriverCount")
    player.user.achiev.achievTickByType("taxiDriverSum", player.taxiNpc)
    player.taxiNpc = null;
})

mp.events.add('playerQuit', player => {
    leaveJob(player)
});

mp.events.add('playerExitVehicle', (player: PlayerMp, vehicle: VehicleMp) => {
    if(!player.user) return;
    if(player.dimension) return;
    if(!vehicle.taxiCar) return;
    const order = taxi.list.find(q => q.user === player.user.id && q.driver === vehicle.taxiCar);
    if(!order) return;
    const driver = User.get(vehicle.taxiCar);
    if(!driver) return taxi.setOrderEnd(order.id, false);
    taxi.setOrderEnd(order.id, true);
})
mp.events.add('playerEnterVehicle', (player: PlayerMp, vehicle: VehicleMp) => {
    if(!player.user) return;
    if(player.dimension) return;
    if(!vehicle.taxiCar) return;
    const order = taxi.list.find(q => q.user === player.user.id && q.driver === vehicle.taxiCar);
    if(!order) return;
    const driver = User.get(vehicle.taxiCar);
    if(!driver) return;
    player.notify('Не покидайте транспорт до прибытия на точку назначения', 'warning', 'CHAR_TAXI');
    driver.notify('Ваш пассажир сел в транспорт. Довезите его в целости и сохранности', 'warning', 'CHAR_TAXI');
    driver.user.setWaypoint(order.end.x, order.end.y, 0, `Точка назначения. Заказ #${order.id}`);
})


CustomEvent.registerClient('phone:requestTaxi', (player,end, startZone, endZone) => {
    taxi.newOrder(player, player.position, end, startZone, endZone)
})

const leaveJob = (player: PlayerMp) => {
    const user = player.user;
    if(!user) return;
    const id = user.id;
    if(user.taxiCar && mp.vehicles.exists(user.taxiCar) && !user.taxiCar.entity?.owner) Vehicle.destroy(user.taxiCar);
    taxi.list.map((order, id) => {
        if([order.driver, order.user].includes(id)) taxi.setOrderEnd(id, false);
    })
    user.taxiCar = null;
    user.taxiJob = null;
}

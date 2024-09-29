import {CustomEvent} from "./custom.event";
import {user} from "./user";
import {system} from "./system";
import {TAXI_CONF} from "../../shared/taxi";
import {colshapes} from "./checkpoints";
import {dispatch} from "./dispatch";

let currentTaxiCar: number;

CustomEvent.registerServer('taxi:car', (id: number) => {
    currentTaxiCar = id;
})

CustomEvent.registerServer('phone:requestTaxi', () => {
    let pos = system.getWaypointPosition();
    if(!pos || pos.x == 0) return user.notify(`Чтобы вызвать такси необходимо указать на карте метку точки назначения`, 'error', 'CHAR_TAXI');
    if(system.distanceToPos2D(mp.players.local.position, pos) < 100) return user.notify(`Минимальная дистанция заказа такси 100 метров`, 'error', 'CHAR_TAXI');
    const startZone = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z));
    const endZone = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(pos.x, pos.y, pos.z));
    CustomEvent.triggerServer('phone:requestTaxi', pos, startZone, endZone);
})

let call = false;
let timer = 120;

CustomEvent.registerServer('phone:requestPolice', () => {
    if(call) return user.notify('Вы уже совершали вызов недавно');
    call = true;
    setTimeout(() => {
        call = false;
    }, timer * 1000)
    dispatch.call([2, 7], 'Поступил новый вызов', true);
})

CustomEvent.register('phone:requestEms', () => {
    if(call) return user.notify('Вы уже совершали вызов недавно');
    call = true;
    setTimeout(() => {
        call = false;
    }, timer * 1000)
    dispatch.call(16, 'Поступил новый вызов', true);
})

CustomEvent.registerServer('phone:requestEms', () => {
    if(call) return user.notify('Вы уже совершали вызов недавно');
    call = true;
    setTimeout(() => {
        call = false;
    }, timer * 1000)
    dispatch.call(16, 'Поступил новый вызов', true);
})

CustomEvent.registerServer('phone:requestNews', () => {
    if(call) return user.notify('Вы уже совершали вызов недавно');
    call = true;
    setTimeout(() => {
        call = false;
    }, timer * 1000)
    dispatch.call(5, 'Поступил новый вызов', true);
})

CustomEvent.registerServer('taxi:random', (index: number) => {
    const cfg = TAXI_CONF.ordersNpc[index];
    // user.clearWaypointHistoryByName('[TAXI]');
    user.notify('Новый заказ получен. Проследуйте по навигатору', 'success')
    // user.setWaypoint(cfg.start.x, cfg.start.y, cfg.start.z, true, '[TAXI] Забрать пассажира')

    const blip = system.createBlip(TAXI_CONF.blipNpcOrder.blipStart, TAXI_CONF.blipNpcOrder.color, new mp.Vector3(cfg.start.x, cfg.start.y, cfg.start.z), '[TAXI] Забрать пассажира')
    blip.setRoute(true)
    blip.setRouteColour(TAXI_CONF.blipNpcOrder.color);

    let shape = colshapes.new(cfg.start, 'Начальная точка', player => {
        if(!player.vehicle || player.vehicle.remoteId !== currentTaxiCar) return user.notify('Вы должны быть в такси', 'error')
        if(player.getSpeed() > 1) return user.notify('Остановите ТС', "error");
        shape.destroy()
        user.notify('Пассажир в такси, проследуйте до точки высадки', 'success');
        // user.clearWaypointHistoryByName('[TAXI]');
        setTimeout(() => {
            // user.setWaypoint(cfg.end.x, cfg.end.y, cfg.end.z, true, '[TAXI] Доставить пассажира')
            if(blip && mp.blips.exists(blip)) blip.destroy()
            const blip2 = system.createBlip(TAXI_CONF.blipNpcOrder.blipEnd, TAXI_CONF.blipNpcOrder.color, new mp.Vector3(cfg.end.x, cfg.end.y, cfg.end.z), '[TAXI] Забрать пассажира')
            blip2.setRoute(true)
            blip2.setRouteColour(TAXI_CONF.blipNpcOrder.color);
            shape = colshapes.new(cfg.end, 'Точка доставки', player => {
                if(!player.vehicle || player.vehicle.remoteId !== currentTaxiCar) return user.notify('Вы должны быть в такси', 'error')
                if(player.getSpeed() > 1) return user.notify('Остановите ТС', "error");
                if(blip2 && mp.blips.exists(blip2)) blip2.destroy()
                shape.destroy()
                user.notify('Пассажир успешно доставлен', 'success');
                user.clearWaypointHistoryByName('[TAXI]');
                CustomEvent.triggerServer('taxi:delivernpc')
            }, {
                type: 27,
                radius: 5
            })
        }, 1000)
    }, {
        type: 27,
        radius: 5
    })
})
import {npcGrabCarSetting, npcVehicleJack, VEHICLE_GRAB_COOLDOWN_MINUTES} from "../../shared/vehicles";
import {system} from "./system";
import {colshapes} from "./checkpoints";
import {getVehicleConfig, Vehicle} from "./vehicles";
import {menu} from "./menu";
import {quests} from "./quest";
import {NpcSpawn} from "./npc";
import {CustomEvent} from "./custom.event";
import {Family} from "./families/family";
import {FamilyReputationType} from "../../shared/family";
import {MoneyChestClass} from "./money.chest";
import { getX2Param } from "./usermodule/static";

/** Список ТС, которые сейчас в заказе */
export let activeCars: {model: string, number: string, pos: Vector3Mp, veh: VehicleMp}[] = [];

const getModelCost = (model: string) => {
    let data = npcVehicleJack.find(q => q[0] === model);
    if(!data) return 0
    return data[1]
}

setTimeout(() => {
    setInterval(() => {
        activeCars.map((item, itemid) => {
            if (!mp.vehicles.exists(item.veh) || item.veh.deleted) return activeCars.splice(itemid, 1);
        });
        if (activeCars.length === 20) return;
        let npcCars = Vehicle.toArray().filter(q => q.npc && !q.usedAfterRespawn && q.dimension === 0);
        const grabModels = [...npcVehicleJack].map(q => q[0])
        npcCars = npcCars.filter(q => grabModels.includes(q.modelname));
        if (npcCars.length === 0) return;
        let randCar = system.randomArrayElement(npcCars);
        const model = randCar.modelname;
        const number = randCar.numberPlate;
        const pos = new mp.Vector3(system.getRandomInt(randCar.position.x - npcGrabCarSetting.vehPosOffset, randCar.position.x + npcGrabCarSetting.vehPosOffset), system.getRandomInt(randCar.position.y - npcGrabCarSetting.vehPosOffset, randCar.position.y + npcGrabCarSetting.vehPosOffset), system.getRandomInt(randCar.position.z - npcGrabCarSetting.vehPosOffset, randCar.position.z + npcGrabCarSetting.vehPosOffset));
        activeCars.push({ model, number, pos, veh: randCar});
    }, 1000)
},  mp.config.announce ? 120000 : 10000)

new NpcSpawn(new mp.Vector3(npcGrabCarSetting.npcPos.x, npcGrabCarSetting.npcPos.y, npcGrabCarSetting.npcPos.z), npcGrabCarSetting.npcHeading, npcGrabCarSetting.npcModel, 'Ламар', (player) => {
    handle(player)
});

let blockReward = new Map<number, boolean>();

const handle = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    const vehicle = player.vehicle;
    if (vehicle) {
        if (blockReward.has(user.id)) return player.notifyWithPicture("Сдача транспорта", 'Ламар', "Эм... Куда летим? Давай потом поговорим, дай другим поработать, ты уже и так засветился", 'DIA_LAMAR');
        const model = vehicle.modelname;
        if (!user.isDriver) return player.notifyWithPicture("Сдача транспорта", 'Ламар', "Эм... Давайте обсудим все дела с водителем", 'DIA_LAMAR');
        if (!vehicle.npc || !activeCars.find(q => q.model === model && q.number === vehicle.numberPlate)) {
            return player.notifyWithPicture("Сдача транспорта", 'Ламар', system.randomArrayElement(npcGrabCarSetting.incorrectCarText), 'DIA_LAMAR');
        }
        system.debug.debug("ТС для Ламара был сдан", model, vehicle.numberPlate)
        Vehicle.destroy(vehicle);
        const sum = getModelCost(model);
        user.quests.map(quest => {
            if (quest[2]) return;
            const qcfg = quests.getQuest(quest[0]);
            if (!qcfg) return;
            qcfg.tasks.map((task, taskindex) => {
                if (task.type === "lamar") {
                    user.setQuestTaskComplete(quest[0], taskindex);
                }
            })
        })
        if (sum) {
            if (user.fraction) {
                const safe = MoneyChestClass.getByFraction(user.fraction);
                if (safe) safe.money = safe.money + Math.floor(sum * 0.2);
            }
            user.addMoney(sum, false, 'Сдал ТС ' + model + " Ламару");
            player.notifyWithPicture("Сдача транспорта", 'Ламар', `Отлично. Вот твои $${sum} как договаривались`, 'DIA_LAMAR');
        }
        player.user.achiev.achievTickByType("vehJackLamar")
        CustomEvent.triggerClient(player, 'vehicleGrab:deleteBlip')
        blockReward.set(user.id, true);
        const ids = user.id;
        setTimeout(() => {
            blockReward.delete(ids);
        }, VEHICLE_GRAB_COOLDOWN_MINUTES * 60000);
        return;
    }
    if (activeCars.length === 0) return player.notifyWithPicture("Сдача транспорта", 'Ламар', `Сорян, но сейчас мне ничего не требуется. Подходи попозже как нибудь`, 'DIA_LAMAR');
    let canWork = false;
    user.quests.map(quest => {
        if (quest[2]) return;
        const qcfg = quests.getQuest(quest[0]);
        if (!qcfg) return;
        qcfg.tasks.map((task, taskindex) => {
            if (task.type === "lamar") canWork = true;
        })
    })
    if (!canWork) canWork = player.user.fractionData.gang
    
    if (canWork) {
        const m = menu.new(player, "Ламар", "Список заказанных ТС");
        m.newItem({
            name: 'Как угнать ТС',
            desc: 'Около нужной машины открой меню взаимодействия с ней, и сверху выбери пункт [Вскрыть двери]. Нужна отмычка'
        })
        activeCars.map((item, itemid) => {
            if (!mp.vehicles.exists(item.veh) || item.veh.deleted) return activeCars.splice(itemid, 1);
            if(item.veh.usedAfterRespawn) return;
            const cfg = getVehicleConfig(item.model)
            const name = cfg ? cfg.name : item.model;

            m.newItem({
                name,
                desc: `${item.veh && item.veh.usedAfterRespawn ? 'По моей информации этот ТС уже везут ко мне' : ''}`,
                more: `$${system.numberFormat(getModelCost(item.model))}`,
                onpress: () => {
                    player.notifyWithPicture("Сдача транспорта", 'Ламар', `Вот примерные координаты местоположения тачки. Модель ${name}, Номерной знак ${item.number}`, 'DIA_LAMAR');
                    player.outputChatBox(`!{25B000} Вот примерные координаты местоположения тачки. Модель ${name}, Номерной знак ${item.number}`,"SERVER")
                    CustomEvent.triggerClient(player, 'vehicleGrab:setBlipPos', item.pos.x, item.pos.y, item.pos.z);
                    //user.setWaypoint(item.pos.x, item.pos.y, item.pos.z, `Доставка для Ламара ${name} ${item.number} за $${system.numberFormat(getModelCost(item.model))}`);
                }
            })
        })
        m.open();
    }
    else return player.notifyWithPicture("Сдача транспорта", 'Ламар', `Я работаю только с настоящими гангстерами`, 'DIA_LAMAR');
}

colshapes.new(new mp.Vector3(npcGrabCarSetting.vehiclePos.x, npcGrabCarSetting.vehiclePos.y, npcGrabCarSetting.vehiclePos.z), "Ламар", player => {
    handle(player)
}, {
    radius: 4,
    dimension: 0,
    type: 27
})

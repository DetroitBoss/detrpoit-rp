import {
    DRUG_ITEM,
    DRUG_NPC_TASK,
    DRUG_POS_LIST,
    DRUG_TASK_COUNT, DRUG_TASK_FRACTION_MONEY_PERCENT,
    DRUG_TASK_REWARD, FRACTION_LIST_TASKS_NPC, NPCTaskItemVehicle, VEHICLE_EVACUATION_NPC
} from "../../shared/tasks";
import {system} from "./system";
import {colshapeHandle, colshapes} from "./checkpoints";
import {NpcSpawn} from "./npc";
import {menu} from "./menu";
import {inventory} from "./inventory";
import {CustomEvent} from "./custom.event";
import {Vehicle} from "./vehicles";
import {HousesTeleportsList} from "../../shared/houses";
import {houses} from "./houses";
import {MoneyChestClass} from "./money.chest";



export let vehTaskData = new Map<number, {count: number, reward: number, returnNeed?: Vector3Mp, cooldown: number, points: NPCTaskItemVehicle['positions'], npc: number, task: number}>();

export let getGpsMissionVehs = (player: PlayerMp) => {

    const user = player.user;
    if(!user) return;
    if(!vehTaskData.has(user.id)) return;
    const points = Vehicle.toArray().filter(veh => veh.isMission && veh.missionType == 'fractionVehicleDeliver' && veh.missionOwner == user.id).map(veh => veh.position);
    if(points.length === 0) return;
    user.setWaypointBlips(points.map(q => {
        return {
            x: q.x,
            y: q.y,
            name: 'Транспорт',
            shortRange: false,
            type: 225,
            color: 59,
            distDestroy: 15
        }
    }))
}

mp.events.add("playerEnterVehicle", (player:PlayerMp, vehicle) => {
    const user = player.user;
    if (!player.user) return;
    if(!vehicle.isMission) return;
    if(vehicle.missionOwner !== user.id) return player.notify('Вы не можете сидеть в данном ТС', 'error');
    if(vehicle.missionType == 'fractionVehicleDeliver'){
        const data = vehTaskData.get(user.id);
        if(!data || !data.count) {
            user.leaveVehicle()
            return player.notify('Вы не можете сидеть в данном ТС', 'error');
        }
        const cfg = FRACTION_LIST_TASKS_NPC[data.npc].tasks[data.task];
        if(!cfg) return player.notify('Вы не можете взаимодействовать с данным ТС', 'error');
        if(cfg.returnPoint){
            user.setWaypoint(cfg.returnPoint.x, cfg.returnPoint.y, cfg.returnPoint.z);
            player.notify('Отправляйтесь в точку назначения', 'info')
        } else {
            player.notify('Эвакуируйте транспорт через меню взаимодействия', 'error')
        }
    }
});

FRACTION_LIST_TASKS_NPC.map((npc, npcid) => {
    npc.tasks.map((task, taskid) => {
       if(task.type === "vehicle" && task.returnPoint){
           colshapes.new(new mp.Vector3(task.returnPoint.x, task.returnPoint.y, task.returnPoint.z), task.returnPoint.name, player => {
               const user = player.user;
               if(!user) return;
               if(!vehTaskData.has(user.id)) return player.notify('У вас нет заданий чтобы сдать ТС', 'error');
               const veh = player.vehicle;
               if(!veh) return player.notify('Вы должны быть в ТС');
               if(!user.isDriver) return player.notify('Вы должны быть за рулём', 'error');
               if(veh.missionType != 'fractionVehicleDeliver') return player.notify('Этот ТС не подходит', 'error');
               if(veh.missionOwner != user.id) return player.notify('Этот ТС должны доставить не вы', 'error');
               let data = vehTaskData.get(user.id);
               if(data.count <= 0) return player.notify('Вы уже сдали достаточно ТС', 'error');
               if(data.npc !== npcid) return player.notify('ТС необходимо сдавать в другое место', 'error');
               if(data.task !== taskid) return player.notify('ТС необходимо сдавать в другое место', 'error');
               data.count--;
               Vehicle.destroy(veh);
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
           }, {
               type: task.returnPoint.type,
               radius: task.returnPoint.r,
               drawStaticName: "scaleform"
           })
       }
    });
    new NpcSpawn(npc.pos, npc.heading, npc.model, npc.name, player => {
        const user = player.user;
        if(!user) return;
        if(npc.fraction && !npc.fraction.includes(user.fraction)) return player.notify(`Нет доступа`, 'error');
        if(npc.rank && user.rank < npc.rank) return player.notify(`Доступ только с ${npc.rank} ранга`, 'error');

        const m = menu.new(player, npc.name);

        let data = vehTaskData.get(user.id);
        npc.tasks.map((task, taskid) => {
            if(data && data.count === 0 && data.npc === npcid && data.task === taskid){
                m.newItem({
                    name: task.name,
                    more: 'Забрать награду',
                    onpress: () => {
                        m.close()
                        let data = vehTaskData.get(user.id);
                        if(data && data.count === 0 && data.npc === npcid && data.task === taskid){
                            data.count = -1
                            user.addMoney(data.reward, true, 'Награда за доставку ТС по заданию');
                            vehTaskData.set(user.id, data);
                            const ids = user.id;

                            setTimeout(() => {
                                vehTaskData.delete(user.id);
                            }, data.cooldown * 60000)
                        } else {
                            player.notify('Вы уже получили награду либо не выполнили задание', 'error');
                        }
                    }
                })
            } else {
                m.newItem({
                    name: task.name,
                    desc: task.desc,
                    more: `$${system.numberFormat(task.reward)}`,
                    onpress: () => {
                        if(task.positions.length < task.count) return player.notify('Сейчас нет свободных точек для выполнения задания', 'error');
                        if(vehTaskData.has(user.id)) return player.notify('Вы сейчас не можете брать новое задание', 'error');
                        let points: typeof task.positions = [];
                        for(let z = 0; z < task.count; z++){
                            const i = system.randomArrayElementIndex(task.positions);
                            points.push(task.positions[i])
                            task.positions.splice(i, 1);
                        }

                        points.map(pos => {
                            const veh = Vehicle.spawn(system.randomArrayElement(task.models), new mp.Vector3(pos.x, pos.y, pos.z), pos.h, 0, false, true);
                            veh.isMission = true;
                            veh.missionType = 'fractionVehicleDeliver';
                            veh.missionOwner = user.id;
                            veh.deliverPos = task.returnPoint
                        })



                        player.notify('Задание успешно взято. Отправляйтесь по указанным в навигаторе точкам', 'error');
                        vehTaskData.set(user.id, {count: task.count, reward: task.reward, returnNeed: task.returnToNpc ? npc.pos : null, cooldown: task.cooldown, points, npc: npcid, task: taskid});
                        getGpsMissionVehs(player)
                    }
                })
            }

        })

        m.open();

    })
})




//
//
//
//
// class Task {
//     owner: PlayerMp;
//     config: typeof FRACTION_LIST_TASKS_NPC[number]['tasks'][number];
//     constructor(owner: PlayerMp, config: typeof FRACTION_LIST_TASKS_NPC[number]['tasks'][number]){
//         this.owner = owner;
//         this.config = config;
//
//     }
// }

let missionIds = 0;

let drugTaskPoints: Vector3Mp[] = [...DRUG_POS_LIST];
const getDrugPoint = () => {
    const index = system.randomArrayElementIndex(drugTaskPoints)
    const req = [...drugTaskPoints][index];
    drugTaskPoints.splice(index, 1);
    return req;
}
let npcTaskList = new Map<number, colshapeHandle[]>();

mp.events.add('playerQuit', player => {
    const user = player.user;
    if (!user) return;
    if (npcTaskList.has(user.id)) npcTaskList.delete(user.id);
})

DRUG_NPC_TASK.map(npc => {
    new NpcSpawn(npc.pos, npc.heading, npc.model, npc.name, player => {
        const user = player.user;
        if(!user) return;
        if(npc.fraction && !npc.fraction.includes(user.fraction)) return;
        if(npc.rank && user.rank < npc.rank) return;

        const m = menu.new(player, npc.name);

        m.newItem({
            name: 'Взять задание',
            onpress: () => {
                if(npcTaskList.has(user.id)) return player.notify('Вы уже взяли задание', 'error');
                const drugsInInventoryCount = inventory.getItemsCountById(player, DRUG_ITEM.item_id);
                if(drugsInInventoryCount < DRUG_TASK_COUNT) return player.notify(`Чтобы взять задание необходимо иметь ${DRUG_TASK_COUNT} нераспечатанных ${DRUG_ITEM.name}${npc.errorCountString ? `. ${npc.errorCountString}` : ''}`, 'error');
                if(drugTaskPoints.length < DRUG_TASK_COUNT) return player.notify(`Сейчас нет свободных заданий.`, 'error');
                const uid = user.id;
                let shapes:colshapeHandle[] = []
                let count = parseInt(`${DRUG_TASK_COUNT}`);
                let posList:[number, number, number, number][] = []
                const sendPos = (target: PlayerMp) => {
                    CustomEvent.triggerClient(target, 'task:getDrugPoints', posList)
                }
                for(let q = 0; q < DRUG_TASK_COUNT; q++){
                    const point = getDrugPoint()
                    posList.push([q, point.x, point.y, point.z])
                    const shape = colshapes.new(point, 'Точка закладки', target => {
                        const utarget = target.user;
                        if(!utarget) return;
                        if(utarget.id !== uid) return target.notify('Вы не можете делать тут закладку', 'error');
                        const myItem = utarget.allMyItems.find(q => q.item_id === DRUG_ITEM.item_id && q.count >= DRUG_ITEM.default_count);
                        if(!myItem) return target.notify(`Требуется целый пакет ${DRUG_ITEM.name}`, 'error');

                        inventory.deleteItemsById(target, DRUG_ITEM.item_id, 1);

                        utarget.playAnimation([["random@domestic", "pickup_low"]], true)
                        drugTaskPoints.push(point)
                        count--;
                        posList.splice(posList.findIndex(s => s[0] === q), 1);
                        sendPos(target);
                        shape.destroy()

                        utarget.addMoney(DRUG_TASK_REWARD, false, `Награда за работу`);
                        const fractionMoneySafe = MoneyChestClass.getByFraction(user.fraction);
                        fractionMoneySafe.money += DRUG_TASK_REWARD * DRUG_TASK_FRACTION_MONEY_PERCENT / 100;

                        if(count) target.notify(`Осталось ${count} мест`);
                        else {

                            target.notify('Все задачи выполнены', 'success');
                            npcTaskList.delete(user.id);
                        }
                    }, {
                        type: 27,
                        drawStaticName: "scaleform",
                        predicate: colshapePredicatePlayer => colshapePredicatePlayer === player
                    });
                    shapes.push(shape)
                }
                player.notify('Задание успешно взято. Отправляйтесь по указанным в навигаторе точкам', 'error');
                sendPos(player)
                npcTaskList.set(user.id, shapes)
            }
        })


        m.open()
    })
})


VEHICLE_EVACUATION_NPC.map(npc => {
    new NpcSpawn(npc.pos, npc.heading, npc.model, npc.name, player => {
        const user = player.user;
        if(!user) return;
        if(npc.fraction && !npc.fraction.includes(user.fraction)) return;
        if(npc.rank && user.rank < npc.rank) return;

        const m = menu.new(player, npc.name);

        m.newItem({
            name: 'Взять задание',
            onpress: () => {

            }
        })


        m.open()
    })
})

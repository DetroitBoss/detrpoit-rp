import {
    GR6_BASE_POS,
    GR6_DRESS_CONFIG_MAN,
    GR6_DRESS_CONFIG_WOMAN,
    GR6_LEVEL_ACCESS,
    GR6_MONEY_GIVE_RANGE,
    GR6_MONEY_REWARD_PERCENT,
    GR6_POINTS_GRAB,
    GR6_TASKS_COUNT,
    GR6_VEH_BUY_POSITION,
    GR6_VEH_COST,
    GR6_VEH_COST_RETURN,
    GR6_VEH_MODEL
} from "../../shared/gr6";
import {colshapes} from "./checkpoints";
import {menu} from "./menu";
import {system} from "./system";
import {Vehicle} from "./vehicles";
import {LicenseName} from "../../shared/licence";
import {User} from "./user";
import {CustomEvent} from "./custom.event";
import {MINIGAME_TYPE} from "../../shared/minigame";
import {FamilyContractList} from "../../shared/family";
import {JOB_TASK_MANAGER_EVENT} from "./battlePass/tasks/jobTaskManager";
import { getX2Param } from "./usermodule/static";

const pointData = new Map<number, number>();

[...GR6_POINTS_GRAB, ...GR6_VEH_BUY_POSITION, GR6_BASE_POS].map(pos => {
    Vehicle.addBlockNpcCarZone(pos)
})

GR6_POINTS_GRAB.map((item, index) => {
    pointData.set(index, 0);
    const check = (player: PlayerMp) => {
        const user = player.user;
        if (!user) return false;
        if (!user.gr6job){
            player.notify(`Вы не сотрудник GR6`, 'error');
            return false
        }
        if (pointData.get(index) !== user.gr6jobId){
            player.notify("Данная точка сбора предназначена не для вашего отряда");
            return false
        }
        const veh = User.getNearestVehicles(player, 30).find(q => q.gr6Id === user.gr6jobId);
        if (!veh){
            player.notify("Вы слишком далеко от рабочего транспорта");
            if(getX2Param("testserver")) player.notify('Мы проигнорируем ТС, но на основном сервере игнорировать не будем', 'info')
            else return false
        }
        return true;
    }
    colshapes.new(item, "Точка сбора средств Gruupe Sechs", player => {
        const user = player.user;
        if (!user) return;
        if (!check(player)) return;
        user.playAnimationWithResult(["anim@heists@money_grab@duffel", "loop"], 15, 'Сбор средств в сумку', player.heading, MINIGAME_TYPE.MONEY).then(status => {
            if(!status) return;
            if(!mp.players.exists(player)) return;
            if (!check(player)) return;
            pointData.set(index, 0);
            const sum = system.getRandomInt(GR6_MONEY_GIVE_RANGE[0], GR6_MONEY_GIVE_RANGE[1]);
            if (!user.gr6Money) user.gr6Money = 0;
            user.gr6Money += sum;
            player.user.achiev.achievTickByType("gr6count")
            player.user.achiev.achievTickByType("gr6sum", sum)
            player.notify(`Вы успешно собрали $${system.numberFormat(sum)}. Отнесите их в рабочий транспорт`, 'success');
            mp.events.call(JOB_TASK_MANAGER_EVENT, player, 'collector');
            const targets = mp.players.toArray().filter(q => q.user && q.user.gr6jobId === user.gr6jobId);
            targets.map(target => {
                CustomEvent.triggerClient(target, "gr6:tasks:setClear", index)
            })
        })
    }, {
        radius: 1,
        type: 27,
        predicate: colshapePlayerPredicate
    }, 'job');
});

function colshapePlayerPredicate(player: PlayerMp): boolean {
    return player.user && player.user.gr6job;
}

mp.events.add("playerEnterVehicle", (player: PlayerMp, vehicle: VehicleMp) => {
    const user = player.user;
    if(!user) return;
    if (!user.gr6Money) return;
    if (vehicle.locked) return;
    if (!player.user.gr6job) return;
    if (!vehicle.gr6Id) return;
    if (vehicle.gr6Id !== player.user.gr6jobId) return;
    vehicle.getOccupants().map(target => {
        target.notify(`${player.user.name} загрузил в ТС $${system.numberFormat(user.gr6Money)}`, 'success')
    })
    if (!vehicle.gr6Money) vehicle.gr6Money = 0;
    vehicle.gr6Money += user.gr6Money;
    user.gr6Money = 0;
});


GR6_VEH_BUY_POSITION.map(pos => {
    colshapes.new(pos, "Точка аренды транспорта GR6", player => {
        const user = player.user;
        if (!user) return;
        if (user.level < GR6_LEVEL_ACCESS) return player.notify(`Для доступа к GR6 требуется ${GR6_LEVEL_ACCESS} уровень. Ваш уровень ${user.level} `, 'error');
        if (!user.gr6job) return player.notify(`Арендовать транспорт может только сотрудник GR6`, 'error');
        const m = menu.new(player, "", "Действия");
        m.sprite = "gr6";
        if (user.gr6jobCar && !mp.vehicles.exists(user.gr6jobCar)) user.gr6jobCar = null

        if (user.gr6jobCar){
            const returnCost = ((GR6_VEH_COST / 100) * GR6_VEH_COST_RETURN);
            m.newItem({
                name: "Вернуть транспорт",
                more: returnCost ? `+$${system.numberFormat(returnCost)}` : '',
                desc: `Если вы вернёте транспорт - отряд будет распущен`,
                onpress: () => {
                    if (user.gr6jobCar && !mp.vehicles.exists(user.gr6jobCar)) user.gr6jobCar = null;
                    if (!user.gr6jobCar) return player.notify("У вас нет арендованого транспорта", "error");
                    if (user.gr6jobCar.gr6Money) return player.notify("В транспорте есть деньги, сперва необходимо их сдать", "error");
                    if (system.distanceToPos(user.gr6jobCar.position, player.position) > 10 || user.gr6jobCar.dimension) return player.notify("Транспорт находится слишком далеко", "error");
                    if (returnCost) user.addBankMoney(returnCost, true, `Возврат части средств за аренду транспорта`, "Агентство Gruppe Sechs");
                    user.gr6jobCar.destroy();
                    user.gr6jobCar = null;
                    leaveTeam(player);
                }
            })
        } else {
            m.newItem({
                name: "Взять транспорт в аренду",
                more: `$${system.numberFormat(GR6_VEH_COST)}`,
                desc: `Если вы арендуете транспорт - вы станете лидером отряда`,
                onpress: () => {
                    if(user.gr6jobId) return player.notify("Нельзя арендовать транспорт будучи членом отряда", "error");
                    if (user.gr6jobCar && mp.vehicles.exists(user.gr6jobCar)) return player.notify("У вас уже есть транспорт", "error");
                    if (!user.haveActiveLicense('truck')) return player.notify(`Для работы вам необходимо иметь лицензию на ${LicenseName.truck}`, 'error');
                    if(!user.tryRemoveBankMoney(GR6_VEH_COST, true, `Оплата аренды транспорта`, "Агентство Gruppe Sechs")) return;
                    user.gr6jobLeader = true;
                    user.gr6jobId = system.getRandomInt(100000, 900000);
                    const crd = Vehicle.findFreeParkingZone(pos, 20);
                    user.gr6jobCar = Vehicle.spawn(GR6_VEH_MODEL, crd ? new mp.Vector3(crd.x, crd.y, crd.z) : pos, crd ? crd.heading : player.heading, 0, true, true);
                    user.gr6jobCar.gr6Money = 0;
                    user.gr6jobCar.gr6Id = user.gr6jobId;
                    setTimeout(() => {
                        if (!mp.vehicles.exists(user.gr6jobCar)) return;
                        player.user.putIntoVehicle(user.gr6jobCar, 0);
                        player.notify("Вы стали капитаном отряда. Через взаимодействие с игроком добавьте людей в свой отряд и получите задания в центре", "error");
                    }, 1000)
                }
            }) 
        }

        m.open();
    }, {
        radius: 3,
        type: 27
    })
})

setTimeout(() => {
    system.createBlip(318, 2, GR6_BASE_POS, "Инкассаторская служба Gruppe Sechs")
})

colshapes.new(GR6_BASE_POS, "Инкассаторская служба Gruppe Sechs", player => {
    gr6Menu(player);
}, {
    radius: 1.5,
    type: 27
})

const gr6Menu = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (user.level < GR6_LEVEL_ACCESS) return player.notify(`Для доступа к GR6 требуется ${GR6_LEVEL_ACCESS} уровень. Ваш уровень ${user.level} `, 'error');
    const m = menu.new(player, "", "Действия");
    m.sprite = "gr6";
    if (user.gr6job) {
        m.newItem({
            name: user.gr6jobLeader ? "Распустить отряд" : "Покинуть отряд",
            onpress: () => {
                menu.accept(player).then(status => {
                    if (!status) return;
                    leaveTeam(player);
                    gr6Menu(player);
                })
            }
        })
        if (user.gr6jobCar && !mp.vehicles.exists(user.gr6jobCar)) user.gr6jobCar = null
        if (user.gr6jobCar){
            if (!user.gr6jobCar.gr6Money) user.gr6jobCar.gr6Money = 0;
            m.newItem({
                name: "Выгрузить наличку с транспорта",
                more: `$${system.numberFormat(user.gr6jobCar.gr6Money)}`,
                onpress: () => {
                    if (!user.gr6jobId) return player.notify("Вы должны быть членом экипажа для разгрузки", "error"), gr6Menu(player);
                    if (user.gr6jobCar && !mp.vehicles.exists(user.gr6jobCar)) user.gr6jobCar = null;
                    if (!user.gr6jobCar) return player.notify("Транспорта нет", "error"), gr6Menu(player);
                    if (system.distanceToPos(user.gr6jobCar.position, GR6_BASE_POS) > 10 || user.gr6jobCar.dimension) return player.notify("Транспорт находится слишком далеко", "error"), gr6Menu(player);
                    if (!user.gr6jobCar.gr6Money) return player.notify("В транспорте нет денег", "error");
                    unLoadCar(player);
                    player.notify("Транспорт успешно разгружен, вы можете получить новые задания", "success");
                    gr6Menu(player);
                }
            })
        }
        m.newItem({
            name: "Получить задания",
            onpress: () => {
                if (!user.gr6jobId) return player.notify("Вы должны быть членом экипажа для разгрузки", "error"), gr6Menu(player);
                if (user.gr6jobCar && !mp.vehicles.exists(user.gr6jobCar)) user.gr6jobCar = null;
                if (!user.gr6jobCar) return player.notify("Вы должны быть капитаном отряда чтобы взять задание. Чтобы стать капитаном возьмите транспорт в аренду", "error"), gr6Menu(player);
                if ([...pointData].filter(q => q[1] === user.gr6jobId).length > 0) return player.notify("У вас ещё есть задания, которые вы не выполнили", "error");
                if (user.gr6jobCar.gr6Money) return player.notify("Перед тем, как получить новые задания сдайте средства за предыдущие", "error");
                const targets = mp.players.toArray().filter(q => q.user && q.user.gr6jobId === user.gr6jobId);
                if (targets.length < 2){
                    if(!getX2Param("testserver")){
                        player.notify("Политика компании обязывает сотрудников работать минимум по двое", "error")
                        return 
                    } else {
                        player.notify("Политика компании обязывает сотрудников работать минимум по двое, но поскольку мы тут тестируем систему - мы разрешим вам работать в одну персону", "error", "", 10000)
                    }
                }
                let pos:{x: number, y: number, z: number, id: number}[] = []
                for (let id = 0; id < GR6_TASKS_COUNT; id++) {
                    let rand = system.randomArrayElement([...pointData].filter(q => !q[1]).map(q => q[0]));
                    if (!pointData.get(rand)) {
                        pointData.set(rand, user.gr6jobId)
                        const { x, y, z } = GR6_POINTS_GRAB[rand];
                        pos.push({ x, y, z, id: rand});
                    }
                }
                targets.map(target => {
                    CustomEvent.triggerClient(target, "gr6:tasks", pos)
                })
            }
        })
        m.newItem({
            name: "~r~Покинуть службу",
            onpress: () => {
                if (!user.gr6job) return player.notify("Вы уже тут работаете", "error"), gr6Menu(player);
                if (user.gr6jobId) return player.notify(`Перед тем как покинуть службу вам необходимо покинуть отряд`, 'error');
                user.gr6job = false;
                user.gr6jobId = null;
                user.gr6jobLeader = false;
                user.gr6Money = 0;
                CustomEvent.triggerClient(player, "gr6:tasks:clear")
                user.setJobDress(null);
                player.notify("Вы закончили работу", "success");
                gr6Menu(player);
            }
        })
    } else {
        m.newItem({
            name: "Устроиться работать",
            onpress: () => {
                if (user.gr6job) return player.notify("Вы уже тут работаете", "error"), gr6Menu(player);
                //if (user.fraction) return player.notify("Нельзя работать в службе доставки работая в организации", 'error')
                if (user.level < GR6_LEVEL_ACCESS) return player.notify(`Для доступа к GR6 требуется ${GR6_LEVEL_ACCESS} уровень. Ваш уровень ${user.level} `, 'error');
                // if(!user.haveActiveLicense('weapon')) return player.notify(`Для работы вам необходимо иметь лицензию на ${LicenseName.weapon}`, 'error');
                if(!user.bank_have) return player.notify(`Для работы вам необходимо иметь банковский счёт`, 'error');
                user.gr6job = true;
                user.gr6Money = 0;
                user.setJobDress(user.male ? GR6_DRESS_CONFIG_MAN : GR6_DRESS_CONFIG_WOMAN);
                player.notify("Вы успешно устроились на работу. Теперь Вы можете либо присоединится к отряду либо взять грузовик в аренду чтобы стать лидером отряда");
                gr6Menu(player);
            }
        })
    }
    m.open();
}

mp.events.add('playerQuit', player => {
    const user = player.user;
    if (!user) return;
    if(user.gr6jobCar) unLoadCar(player);
    

    leaveTeam(player)
})

const unLoadCar = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (!user.gr6jobCar) return;
    if (!mp.vehicles.exists(user.gr6jobCar)) return;
    if (!user.gr6jobCar.gr6Money) return;
    const targets = mp.players.toArray().filter(q => q.user && q.user.gr6jobId === user.gr6jobId);
    let sum = Math.floor(((user.gr6jobCar.gr6Money / 100) * GR6_MONEY_REWARD_PERCENT) / targets.length);
    targets.map(target => {
        target.user.addBankMoney(sum, true, `Выплата за рейс ${(GR6_MONEY_REWARD_PERCENT / targets.length).toFixed(2)}%`, "Агентство Gruppe Sechs")

        if(target.user.familyId) target.user.family.addContractValueIfExists(FamilyContractList.moneytransfers, sum)

    })
    user.gr6jobCar.gr6Money = 0;
}

const leaveTeam = (player: PlayerMp) => {
    const user = player.user;
    if(!user) return;
    if (!user.gr6jobId) return;
    if (user.gr6jobLeader){
        pointData.forEach((item, index) => {
            if (item === user.gr6jobId){
                pointData.set(index, 0)
            }
        })
    }
    if (mp.players.exists(player)) {
        if (user.gr6jobLeader) {
            player.notify("Отряд распущен", "success");
        } else {
            player.notify(`Вы покинули отряд`, "warning")
        }
    }
    const targets = mp.players.toArray().filter(q => q.user && q.user.gr6jobId === user.gr6jobId && q.user.id !== user.id);
    targets.map(target => {
        if (user.gr6jobLeader){
            target.user.gr6jobId = null;
            target.notify("Отряд распущен", "success");
            CustomEvent.triggerClient(target, "gr6:tasks:clear")
        } else {
            target.notify(`${user.name} покинул отряд`, "warning")
        }
    })
    CustomEvent.triggerClient(player, "gr6:tasks:clear")
    user.gr6jobLeader = false;
    user.gr6jobId = null;
    
}
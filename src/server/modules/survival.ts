import {CustomEvent} from "./custom.event";
import {system} from "./system";
import {QUICK_HEAL_COST} from "../../shared/economy";
import {getIllConfig, IllId} from "../../shared/ill";
import {User} from "./user";
import {AFTER_DEATH_TIME, SURGEON_COST, SURGEON_POS} from "../../shared/survival";
import {MoneyChestClass} from "./money.chest";
import {colshapes} from "./checkpoints";
import {FACTION_ID} from "../../shared/fractions";
import {DeathMathLobby} from "./gungame";
import {UserDatingEntity} from "./typeorm/entities/user";
import { HOSPITAL_TELEPORT_DIMENSION } from '../../shared/teleport.system'


CustomEvent.registerClient('illdata:data', (player, targetID: number) => {
    const user = player.user;
    if(!user) return false;
    if(user.fraction != 16) return false;
    const target = mp.players.at(targetID);
    if(!target) return false;
    if(!target.user) return false;
    if(target.dimension !== player.dimension || player.dist(target.position) > 7) return false;
    return target.user.illData
})
CustomEvent.registerClient('illdata:heal', (player, targetID: number, ill: IllId, cost: number) => {
    const user = player.user;
    if(!user) return;
    if(user.fraction != 16) return;
    const target = mp.players.at(targetID);
    if(!target) return;
    if(!target.user) return;
    const cfg = getIllConfig(ill);
    if(!cfg) return;

    const checkPlayers = () => {
        if(!mp.players.exists(player)) return false;
        if(!mp.players.exists(target)) return false;
        if(target.dimension !== player.dimension || player.dist(target.position) > 7) return false;
        return true;
    }
    if(!checkPlayers()) return;

    const checkPrice = () => {
        const costServer = target.user.getIll(ill) * cfg.healByMedicCostPerOne;
        if(!costServer) return;
        return costServer - cost <= 30;
    }
    if(!checkPrice()) return;

    target.user.tryPayment(cost, 'all', () => checkPrice() && checkPlayers(), `Лечение ${cfg.name}`, 'EMS').then(status => {
        if(!status) return;
        target.user.setIll(ill, 0);
        player.notify('Пациент вылечен', 'success');
        target.notify(`Вы были вылечены. ${cfg.name} Вас больше не побеспокоит`, 'success');
        
        CustomEvent.triggerClient(player, 'markDeath:destroy')// Удаляем маркер мертвого игрока если он есть
        
        const chest = MoneyChestClass.getByFraction(FACTION_ID.EMS);
        if(chest) chest.addMoney(player, cost * 0.3, false)
        user.addMoney(cost * 0.7, true, `Лечение ${cfg.name}`);
    })

})

let deathList = new Map<number, [number, number, number, number][]>();

setInterval(() => {
    const time = system.timestamp
    deathList.forEach((data, id) => {
        let changed = false;
        data.map((item, i) => {
            if(item[3] + (AFTER_DEATH_TIME * 60) < time){
                data.splice(i, 1);
                changed = true;
            }
        })
        if(changed) deathList.set(id, data);
        syncDeathId(id);
        if(data.length === 0) deathList.delete(id);
    })
}, 60000)

export const syncDeathId = (id: number) => {
    const target = User.get(id);
    if(!target) return;
    if(!deathList.has(id)){
        if(target.getVariable('deathLog')) target.setVariable('deathLog', null);
        return;
    }
    const current: [number, number, number, number][] = target.getVariable('deathLog');
    const data = deathList.get(id);
    if(!current && data && data.length > 0) return target.setVariable('deathLog', data);
    else if(current && (!data || data.length == 0)) return target.setVariable('deathLog', null);
    else if(current && data && data.length > 0 && JSON.stringify(current) != JSON.stringify(data)) return target.setVariable('deathLog', data);
}

CustomEvent.registerClient('survival:death', (player, x: number, y: number, z: number) => {
    const user = player.user;
    if (!user) return;
    user.cuffed = false;
    if(DeathMathLobby.death(player)) return;
    user.sendDispatch = false;
    const id = user.id
    const list = deathList.has(id) ? deathList.get(id) : []
    list.push([player.position.x, player.position.y, player.position.z, system.timestamp]);
    deathList.set(id, list)
    syncDeathId(id);
    setTimeout(() => {
        if(!mp.players.exists(player)) return;
        user.anticheatProtects(['heal', 'teleport']);
        player.user.spawn(new mp.Vector3(x, y, z));
        // if(user.wanted_level && !!user.killedByPolice && mp.players.exists(user.killedByPolice) && user.killedByPolice.user) {
        //     user.jail(user.killedByPolice, user.wanted_reason)
        // }
        // else {
        user.heal_time = user.isAdminNow() ? 1 : 60 * 5;
        user.health = 100;
        CustomEvent.triggerClient(player, "heal:start", user.heal_time)
        // }
    }, 100)
})
CustomEvent.registerClient('heal:payauto', (player) => {
    const user = player.user;
    if (!user) return false;
    const sum = user.haveActiveLicense('med') ? QUICK_HEAL_COST.AUTO_LICENSE : QUICK_HEAL_COST.AUTO;
    if (user.money < sum) return false;
    user.removeMoney(sum, true, 'Оплата лечения в больнице');
    const chest = MoneyChestClass.getByFraction(16);
    if(chest) chest.addMoney(null, sum * 0.2, false);
    return true;
})
CustomEvent.registerClient('heal:tryrun', (player, x: number, y: number, z: number) => {
    const user = player.user;
    if (!user) return;
    user.anticheatProtects(['heal', 'teleport']);
    player.dimension = 0;
    player.user.spawn(new mp.Vector3(x, y, z));
    // user.heal_time = user.isAdminNow() ? 1 : user.heal_time + system.getRandomInt(30, 90);
    CustomEvent.triggerClient(player, "heal:start", user.heal_time)
    // player.notify("Ваши швы разошлись при попытке покинуть больницу, придётся пройти усиленый курс", "success")
})

CustomEvent.registerClient('survival:sync', (player, food: number, water: number) => {
    if(!player.user) return;
    player.user.food = food;
    player.user.water = water;
})

CustomEvent.registerClient('heal:setTime', (player, time: number) => {
    if(!player.user) return;
    player.user.heal_time = time;
})
CustomEvent.registerClient('heal:end', (player) => {
    if(!player.user) return;
    player.user.heal_time = 0;
})


colshapes.new(SURGEON_POS, `Хирургия`, (player) => {
    const user = player.user;
    if(!user) return;
    user.tryPayment(SURGEON_COST, 'all', () => true, 'Оплата услуг хирурга', 'EMS').then(status => {
        if(!status) return;
        user.startCustomization()

        UserDatingEntity.delete({target: {id: user.id}})
    });
}, {
    drawStaticName: "scaleform",
    type: 27
})

CustomEvent.registerClient('survival:updateHealth', (player: PlayerMp, count: number) => {
    if (!player || !player.user) return;

    player.setVariable("customHealth", count);
    player.user.hp = count;
})
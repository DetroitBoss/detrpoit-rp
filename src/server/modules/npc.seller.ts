import {NPC_SELLERS_LIST} from "../../shared/npc.seller";
import {NpcSpawn} from "./npc";
import {LicenseName} from "../../shared/licence";
import {menu} from "./menu";
import {getBaseItemNameById} from "../../shared/inventory";
import {system} from "./system";
import {CustomEvent} from "./custom.event";
import {MoneyChestClass} from "./money.chest";

NPC_SELLERS_LIST.map(npc => {
    let current = npc.items.map(q => q.start);
    let currentC = npc.items.map(q => typeof q.cost === "number" ? q.cost : system.getRandomIntStep(q.cost[0], q.cost[1], 10));
    new NpcSpawn(npc.pos, npc.heading, npc.model, npc.name, player => {
        const user = player.user;
        if(!user) return;
        if(npc.factions && !npc.factions.includes(user.fraction)) return player.notify('У вас нет доступа', 'error')
        if(npc.forFamily && !user.family) return player.notify('Вы должны быть членом семьи', 'error')
        if(npc.license && !user.haveActiveLicense(npc.license)) return player.notify(`Для доступа требуется лицензия ${LicenseName[npc.license]}`, 'error');
        const m = menu.new(player, npc.name);

        npc.items.map((item, itemid) => {
            let cost = currentC[itemid]
            m.newItem({
                name: getBaseItemNameById(item.item),
                more: `$${system.numberFormat(cost)}`,
                desc: `${item.max && current[itemid] <= item.max ? `Осталось: ${current[itemid]} / ${item.max}` : ``}`,
                onpress: () => {
                    if(item.max && current[itemid] <= 0) return player.notify('Товар закончился', 'error');
                    if(user.money < cost) return player.notify('Недостаточно средств', 'error');
                    if(!user.tryGiveItem(item.item, true, true)) return;
                    user.removeMoney(cost, true, `Покупка ${getBaseItemNameById(item.item)}`);
                    let sumtofraction = npc.partToFraction ? ((cost / 100) * npc.partToFraction) : 0
                    if(sumtofraction){
                        if(user.fraction){
                            const safe = MoneyChestClass.getByFraction(user.fraction);
                            if (safe) safe.money = safe.money + sumtofraction;
                        }
                    }
                    if(item.max) current[itemid]--;
                }
            })
        })

        m.open();
    })
    CustomEvent.register('newHour', () => {
        npc.items.map((item, itemid) => {
            if(item.max) current[itemid] = Math.min(current[itemid] + item.perhour, item.max);
        })
        currentC = npc.items.map(q => typeof q.cost === "number" ? q.cost : system.getRandomIntStep(q.cost[0], q.cost[1], 10));
    })
})
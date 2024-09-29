import {NpcSpawn} from "./npc.dialog";
import {MAFIA_CLEAN_WANTED_CONFIG} from "../../shared/mafia.clean.wanted";
import {DialogInput, MenuClass} from "./menu";
import {user} from "./user";
import {system} from "./system";
import {CustomEvent} from "./custom.event";

const player = mp.players.local

MAFIA_CLEAN_WANTED_CONFIG.map((item, itemid) => {
    new NpcSpawn(item.pos, item.heading, item.model, item.name, async () => {
        if (!user.family) return user.notify('Я тебя не знаю, уходи', 'error');
        const id = await DialogInput('Введите ID игрока', null, 6, 'int');
        if(!id) return;
        if(isNaN(id) || id < 0 || id > 999999) return user.notify('ID указан не верно', 'error');
        const target = mp.players.toArray().find(q => q.handle && q.getVariable('id') == id);
        if(!target) return user.notify('Игрок не обнаружен', 'error');
        if(system.distanceToPos(player.position, target.position) > 5) return user.notify('Игрок должен быть поблизости', 'error');
        if(player.dimension != target.dimension) return user.notify('Игрок должен быть поблизости', 'error');
        const data:string|number = await CustomEvent.callServer('mafia:wanted:data', id)
        if(typeof data === "string"){
            if (data === "NOT_FND") return user.notify('ID указан не верно', 'error');
            if (data === "NOT_NEAR") return user.notify('Игрок должен быть поблизости', 'error');
        } else {
            const m = new MenuClass(item.name, 'Очистка розыска');
            m.newItem({
                name: `Уровень розыска`,
                more: `${data}`
            })
            m.newItem({
                name: `Стоимость очистки розыска`,
                more: `$${system.numberFormat(item.costPerStar * data)}`
            })
            m.newItem({
                name: `~g~Очистить розыск`,
                desc: 'За очистку розыска вы заплатите со своего кармана, так что не забудьте взять с человека оплату, если вам всё таки нужны деньги',
                onpress: () => {
                    m.close();
                    CustomEvent.triggerServer('mafia:wanted:clear', id, itemid)
                }
            })
    
            m.open();
        }
    })
})

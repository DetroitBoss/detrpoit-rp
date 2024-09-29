import {FRACTION_TASK_ITEMS} from "../../../shared/fraction.task";
import {NpcSpawn} from "../npc";
import {menu} from "../menu";

FRACTION_TASK_ITEMS.map(npc => {
    let currentList = new Map<number, number>()
    npc.tasks.map((q, i) => currentList.set(i, -1));
    new NpcSpawn(npc.pos, npc.heading, npc.model, npc.name, player => {
        const user = player.user;
        if(!user) return;
        if(npc.fraction && !npc.fraction.includes(user.fraction)) return player.notify(`У вас нет доступа`, 'error');
        const m = menu.new(player, npc.name, 'Список заданий');
        currentList.forEach((owner, id) => {
            if(owner === -1) return;
            const cfg = npc.tasks[id];
            if(!cfg) return;
            m.newItem({
                name: cfg.name,
                desc: cfg.desc,
                onpress: () => {
                    let owner = currentList.get(id);
                    if(owner === -1) return player.notify('Данное задание более не доступно', 'error')
                    if(owner !== 0) return player.notify('Данное уже взял другой человек', 'error')
                    currentList.set(id, user.id);

                }
            })
        })
        m.open()
    })
})
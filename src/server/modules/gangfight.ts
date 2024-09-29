import {CustomEvent} from "./custom.event";
import {GANGFIGHT_MODEL, GANGFIGHT_POS} from "../../shared/gangfight";
import {system} from "./system";
import {colshapes} from "./checkpoints";
import {inventory} from "./inventory";
import {OWNER_TYPES} from "../../shared/inventory";



export const gangfight = {
    list: new Map<number, {x: number, y: number, z: number, d: number, id: number, factions: number[]}>(),
    create: (index: number) => {
        const cfg = GANGFIGHT_POS[index];
        if (!cfg) return;
        if (gangfight.list.has(index)) return;
        const id = system.personalDimension;
        gangfight.list.set(index, {x: cfg.x, y: cfg.y, z: cfg.z, d: cfg.d, id, factions: cfg.factions});
        mp.players.toArray().filter(q =>
            q && q.user && q.user.exists && q.user.fraction && cfg.factions.includes(q.user.fraction)).map(target =>
            target.notify(`Началась битва за груз ${cfg.name}`, 'success')
        );
        let timer = cfg.timer * 60;
        const text = () => {
            return `Открытие через ${system.secondsToString(timer)}`
        }
        let label = mp.labels.new(text(), new mp.Vector3(cfg.x, cfg.y, cfg.z + 1), {
            drawDistance: 5,
            los: true,
            dimension: cfg.d
        });

        const blip = system.createDynamicBlip(`gangfight_${index}`, cfg.bliptype, cfg.blipcolor, {x: cfg.x, y: cfg.y, z: cfg.z}, cfg.name, {
            fraction: cfg.factions,
            dimension: cfg.d
        })

        const object = mp.objects.new(mp.joaat(GANGFIGHT_MODEL), new mp.Vector3(cfg.x, cfg.y, cfg.z), {
            rotation: new mp.Vector3(0,0,cfg.h),
            dimension: cfg.d
        })

        let int = setInterval(() => {
            timer--;
            if (mp.labels.exists(label)) label.text = text()
            if (!timer) {





                const colshape = colshapes.new(new mp.Vector3(cfg.x, cfg.y, cfg.z), cfg.name, player => {
                    const user = player.user;
                    if(!user) return;
                    if(!cfg.factions.includes(user.fraction)) return player.notify('Вы не можете открыть данный контейнер', 'error');
                    inventory.openInventory(player);
                }, {
                    radius: 2,
                    dimension: cfg.d,
                    color: [0,0,0,0]
                })

                clearInterval(int);
                if (mp.labels.exists(label)) label.text = 'Контейнер открыт';
                let items: typeof cfg['items'] = [];
                while (items.length < cfg.itemsCount) {
                    let pool: typeof cfg['items'] = [...cfg.items];
                    pool.map(item => {
                        const z = new Array(item.chance).fill(item)
                        pool.push(...z);
                    })
                    items.push(system.randomArrayElement(pool));
                }
                items.map(q => {
                    for(let c = 0; c < q.amount; c++){
                        let b: any = {
                            owner_type: OWNER_TYPES.GANGWAR_CONTAINER,
                            owner_id: id,
                            item_id: q.item_id
                        };
                        if(q.count) b.count = q.count;
                        // console.log(b);
                        inventory.createItem(b, true);
                    }

                })
                setTimeout(() => {

                    const text = () => {
                        return `Закрытие через ${system.secondsToString(timer)}`
                    }
                    timer = cfg.destroyTime * 60;

                    let int2 = setInterval(() => {
                        timer--;
                        if (mp.labels.exists(label)) label.text = text()
                        if (!timer) {
                            clearInterval(int2);
                            inventory.clearInventory(OWNER_TYPES.GANGWAR_CONTAINER, id);
                            if(object && mp.objects.exists(object)) object.destroy();
                            if (colshape && colshape.exists) colshape.destroy()
                            if (blip) blip.destroy()
                            if (label && mp.labels.exists(label)) label.destroy()
                            gangfight.list.delete(index)
                        }
                    }, 1000)
                }, 60000)
            }
        }, 1000)


    }
}


CustomEvent.register('newHour', hour => {
    GANGFIGHT_POS.map((q, i) => {
        if (!q.startHours || !q.startHours.includes(hour)) return;
        gangfight.create(i);
    })
})
//
// setTimeout(() => {
//     gangfight.create(0);
// }, 10000)

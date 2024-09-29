import {FARMING_POSITIONS} from "../../shared/farm";
import {CustomEvent} from "./custom.event";
import {system} from "./system";
import {colshapes} from "./checkpoints";
import {getBaseItemNameById} from "../../shared/inventory";
import {FamilyContractList} from "../../shared/family";

let currentItems = new Map<number, number>();
let currentItemsSplit = new Map<number, number[]>();
let currentBlock = new Map<number, boolean>();

FARMING_POSITIONS.map((item, id) => {
    currentItems.set(id, item.amount_max);
    currentItemsSplit.set(id, new Array(item.pos.length).fill(Math.floor(item.amount_max / item.pos.length)));
    const count = (posid: number) => {
        if(item.split) return currentItemsSplit.get(id)[posid]
        return currentItems.get(id);
    }

    setInterval(() => {
        currentItems.set(id, Math.min(currentItems.get(id) + item.restore_tick, item.amount_max))
        let q = [...currentItemsSplit.get(id)];
        q.map((s, i) => {
            q[i] = Math.floor(Math.min(s + (item.restore_tick / item.pos.length), item.amount_max / item.pos.length))
        })
        currentItemsSplit.set(id, [...q])
    }, item.tick_interval_minutes * 60000)

    colshapes.new(item.pos.map(q => new mp.Vector3(q.x, q.y, q.z)), item.name, async (player, posid) => {
        const user = player.user;
        const uid = user.id;
        if (currentBlock.has(uid)) return player.notify('Вы не можете сейчас брать задание', 'error')

        if (item.needNotFraction && user.fraction)
            player.notify('Доступно только тем кто не состоит во фракции', 'error');

        if (item.fraction && !item.family){
            if (!item.fraction.includes(user.fraction)) return player.notify('Вы не состоите во фракции для которой есть доступ', 'error');
        }

        if (item.family) {
            if (!user.family) return player.notify('Вы должны состоять в семье', 'error');
        }

        if(item.needFamily && !user.family) return player.notify('Вы должны состоять в семье', 'error');
        if(count(posid) <= 0) return player.notify(`Пусто`, 'error')
        const itemid = typeof item.item === "number" ? item.item : system.randomArrayElement(item.item)
        if(!user.canTakeItem(itemid)) return player.notify(`Недостаточно места для ${getBaseItemNameById(itemid)}`, 'error')
        if(item.anim){
            currentBlock.set(uid, true);
            const status = await user.playAnimationWithResult(item.anim.task, item.anim.seconds, item.anim.text, item.anim.heading, item.anim.minigame);
            currentBlock.delete(uid)
            if(!status) return;
        }
        if(count(posid) <= 0) return player.notify(`Пусто`, 'error')
        if(!user.canTakeItem(itemid)) return player.notify(`Недостаточно места для ${getBaseItemNameById(itemid)}`, 'error');
        user.giveItem(itemid);

        user.family.addContractValueIfExists(FamilyContractList.farmers, 1)
        //

        if(item.split){
            let q = [...currentItemsSplit.get(id)];
            q[posid] = Math.max(q[posid] - 1, 0);
            currentItemsSplit.set(id, q)
        } else {
            currentItems.set(id, Math.max(currentItems.get(id) - 1, 0))
        }


        if(item.cooldown){
            currentBlock.set(uid, true);
            setTimeout(() => {
                currentBlock.delete(uid);
            }, item.cooldown * 1000)
        }
    }, {
        type: item.markerType,
        dimension: item.d,
    })
})



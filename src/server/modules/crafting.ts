import {CRAFTING_ITEMS, CRAFTING_TABLES, CraftItem, TableData} from "../../shared/crafting";
import {colshapes} from "./checkpoints";
import {menu} from "./menu";
import {getBaseItemNameById} from "../../shared/inventory";
import {ScaleformTextMp} from "./scaleform.mp";
import {system} from "./system";
import {User} from "./user";
import './crafting.factories';

let usedTable = new Map<string, PlayerMp>();
let longItems:[string, number, number, number][] = []
CRAFTING_TABLES.map((table, tableId) => {
    colshapes.new(table.pos.map(q => new mp.Vector3(q.x, q.y, q.z)), table.name, (player, colshapeIndex) => {
        const pos = table.pos[colshapeIndex];
        if (!pos) return;
        const user = player.user;
        if (!user) return;

        if (checkLongItems(user.id, tableId, colshapeIndex)) {
            getLongItems(user, tableId, colshapeIndex);
            return;
        }

        let hasAccess = false;
        if (table.fractions && table.fractions.includes(user.fraction)) hasAccess = true;
        if (!hasAccess) return player.notify('У вас нет доступа к данному столу', 'error');
        
        openCraftMenuForPlayer(player, table, tableId, colshapeIndex);
    });
})

function checkLongItems(userId: number, tableId: number, colshapeIndex: number): boolean {
    return longItems.findIndex(q => q[0] === `${tableId}_${colshapeIndex}` && q[1] === userId) !== -1;
}

function getLongItems(user: User, tableId: number, colshapeIndex: number) {
    const longItemIndex = longItems.findIndex(q => q[0] === `${tableId}_${colshapeIndex}` && q[1] === user.id)
    if (longItemIndex === -1){
        return;
    }

    if(!user.tryGiveItem(longItems[longItemIndex][2], true, true, longItems[longItemIndex][3])){
        return;
    }

    longItems.splice(longItemIndex, 1);
    return;
}

function openCraftMenuForPlayer(player: PlayerMp, table: TableData, tableid: number, colshapeIndex: number) {
    const user = player.user;
    const m = menu.new(player, table.name, 'Список рецептов');

    CRAFTING_ITEMS.filter(s => s.type === table.type).map(item => {
        m.newItem({
            name: getBaseItemNameById(item.item),
            desc: `Требуется:\n${item.recipe ? `${getBaseItemNameById(item.recipe)} (${user.haveItem(item.recipe) ? 'В наличии' : 'Нет в наличии'})\n` : ""}${item.items.map(z => `${getBaseItemNameById(z[0])} x${z[1]} (${user.haveItem(z[0]) ? 'В наличии' : 'Нет в наличии'})`).join('\n')}`,
            onpress: () => {
                craftItem(player, table, tableid, colshapeIndex, item);
                m.close();
            }
        });
    });

    m.open();
}

function craftItem(player: PlayerMp, table: TableData, tableid: number, colshapeIndex: number, craftItem: CraftItem) {
    const user = player.user;

    if (usedTable.has(`${tableid}_${colshapeIndex}`) && mp.players.exists(usedTable.get(`${tableid}_${colshapeIndex}`)))
        return player.notify("Место занято", "error");

    const check = () => {
        if (craftItem.recipe && !user.haveItem(craftItem.recipe)){
            player.notify(`Требуется ${getBaseItemNameById(craftItem.recipe)}`, 'error');
            return false;
        }

        let isHaveAllComponents = true;
        craftItem.items.forEach(q => {
            const [ item_id, needAmount ] = q;

            let totalItemAmount = 0;
            const arrayItems = user.getArrayItem(item_id);
            arrayItems.forEach(item => totalItemAmount += item.count)
            if (totalItemAmount < needAmount) {
                isHaveAllComponents = false;
                player.notify(`Требуется ${getBaseItemNameById(item_id)} x${needAmount}`, 'error');
            }
        });

        return isHaveAllComponents;
    }

    const pos = table.pos[colshapeIndex];

    if (!check())
        return;

    usedTable.set(`${tableid}_${colshapeIndex}`, player);
    let timer = table.mode === "short" ? craftItem.seconds : craftItem.seconds + 5;
    let textTimer = new ScaleformTextMp(new mp.Vector3(pos.x, pos.y, pos.z + 1.5), `${getBaseItemNameById(craftItem.item)}\n${timer} сек.`, {
        dimension: player.dimension,
        type: 'front',
        range: 5,
    });

    user.playAnimationWithResult(table.anim, table.mode === "short" ? craftItem.seconds : 5, getBaseItemNameById(craftItem.item), pos.h).then(status => {
        if(!mp.players.exists(player)) return;

        if (!status){
            usedTable.delete(`${tableid}_${colshapeIndex}`);
            if (ScaleformTextMp.exists(textTimer)) textTimer.destroy();
            return;
        }

        if (!check())
            return usedTable.delete(`${tableid}_${colshapeIndex}`);

        const id = user.id
        if (table.mode === "short"){
            usedTable.delete(`${tableid}_${colshapeIndex}`);

            if (craftItem.itemFactoryMethod) {
                const itemParams = craftItem.itemFactoryMethod(table, colshapeIndex);

                if (!user.canTakeItem(itemParams.item_id, 1, itemParams.count)) {
                    player.notify(`Недостаточно места в инвентаре для ${getBaseItemNameById(itemParams.item_id)}`, "error");
                    return;
                }

                user.giveItem(itemParams, true);
            }
            else {
                if (!user.tryGiveItem(craftItem.item, true, true, craftItem.count)) {
                    return;
                }
            }
        } else {
            player.notify(`${getBaseItemNameById(craftItem.item)} будет готов через ${craftItem.seconds} секунд.`)
            user.drawTimer(`Создание ${getBaseItemNameById(craftItem.item)}`, craftItem.seconds)
            setTimeout(() => {
                usedTable.delete(`${tableid}_${colshapeIndex}`);
                longItems.push([`${tableid}_${colshapeIndex}`, id, craftItem.item, craftItem.count]);
                if (mp.players.exists(player)){
                    player.notify(`${getBaseItemNameById(craftItem.item)} готов`, "success");
                    if (system.distanceToPos(player.position, pos) > 30) user.setWaypoint(pos.x, pos.y, pos.z, `Создание ${getBaseItemNameById(craftItem.item)}`, true);
                }
            }, craftItem.seconds * 1000)
        }

        craftItem.items.map(q => {
            const [ item_id, needAmount ] = q;

            let amountTaken = 0// Счетчик кол-ва предметов, которое забрали
            const items = user.getArrayItem(item_id);
            items.forEach(item => {
                if (amountTaken < needAmount) {
                    const itemCountBeforeTake = item.count
                    item.useCount(needAmount - amountTaken, player)
                    // Если в стаке больше чем требуется, то забираем только сколько
                    amountTaken += itemCountBeforeTake > needAmount ? needAmount : itemCountBeforeTake
                }
            })
        })
    })
}
import {NPC_CUSTOMERS_LIST, NpcItemDto, NpcMenuBackground} from "../../shared/npc.customer";
import {CustomEvent} from "./custom.event";
import {NpcSpawn} from "./npc.dialog";
import {system} from "./system";
import {gui} from "./gui";

NPC_CUSTOMERS_LIST.map((item, itemid) => {
    if(item.blip) system.createDynamicBlip(`npc_customer_${itemid}`, item.blip.id, item.blip.color, item.pos, item.name, {
        fraction: item.factions,
        dimension: item.dimension,
    })
    new NpcSpawn(item.pos, item.heading, item.model, item.name, () => {
        CustomEvent.triggerServer('npc:customer:open', itemid)
    }, 10, item.dimension || 0, item.radius)
});

CustomEvent.registerServer('npc:customer:open', (data: NpcItemDto[], background: NpcMenuBackground) => {
    gui.setGuiWithEvent('buyers', 'buyes:setData', data, background);
});
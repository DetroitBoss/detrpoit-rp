import {system} from "./system";
import {NPC_SELLERS_LIST} from "../../shared/npc.seller";
NPC_SELLERS_LIST.map((item, itemid) => {
    if(item.blip) system.createDynamicBlip(`npc_seller_${itemid}`, item.blip.id, item.blip.color, item.pos, item.name, {
        fraction: item.factions,
        dimension: item.dimension,
    })
})

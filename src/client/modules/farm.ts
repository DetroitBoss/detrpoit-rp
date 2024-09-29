import {FARMING_POSITIONS} from "../../shared/farm";
import {system} from "./system";

FARMING_POSITIONS.map((item, id) => {
    if(item.blip) {
        system.createDynamicBlip(`farm_${id}`, item.blip.id, item.blip.color, system.middlePoint3d(...item.pos), item.name, {
            dimension: item.d,
            fraction: item.fraction
        })
    }
})

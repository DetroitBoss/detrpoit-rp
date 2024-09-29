import {CustomEvent} from "./custom.event";
import {system} from "./system";

let blips = new Map<number, BlipMp>();

CustomEvent.registerServer('task:getDrugPoints', (data: [number, number, number, number][]) => {
    blips.forEach(q => {
        if(mp.blips.exists(q)) q.destroy()
    })
    blips = new Map();
    data.map(item => {
        blips.set(item[0], system.createBlip(140, 1, new mp.Vector3(item[1], item[2], item[3]), 'Точка закладки', 0, false))
    })
})
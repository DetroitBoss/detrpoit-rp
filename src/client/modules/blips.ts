import {BLIPS_DATA} from "../../shared/blips";
import {system} from "./system";
import {CustomEvent} from "./custom.event";

system.createBlip(60, 4, new mp.Vector3(434.95, -981.83, 30.69), "LSPD")

let blid = 0;
BLIPS_DATA.map(blip => {
    blid++;
    system.createDynamicBlip(`BLIP_${blid}`, blip.type, blip.color, blip.position, blip.name, blip.options);
})

const routeBlips = new Map<string, BlipMp>();

export function createRouteBlip(name: string, position: Vector3Mp, color: number) {
    destroyRouteBlip(name);

    const blip = mp.blips.new(1, position, {
        shortRange: true,
        color: color,
        scale: 1,
        name: name
    });

    blip.setRoute(true);
    blip.setRouteColour(color);

    routeBlips.set(name, blip);
}

CustomEvent.registerServer('blips:createRouteBlip',
    (name: string, position: Vector3Mp, color: number) => createRouteBlip(name, position, color));

CustomEvent.registerServer('blips:destroyRouteBlip', (name: string) => {
    destroyRouteBlip(name);
});

export function destroyRouteBlip(name: string) {
    const routeBlip = routeBlips.get(name);
    if (routeBlip && mp.blips.exists(routeBlip)) {
        routeBlip.destroy();
        routeBlips.delete(name);
    }
}
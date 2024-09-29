import {CustomEvent} from "./custom.event";

let blip: BlipMp;
CustomEvent.registerServer('vehicleGrab:setBlipPos', (x: number, y: number, z: number) => {
    if (blip && blip.doesExist()) blip.destroy();
    blip = mp.blips.new(9, new mp.Vector3(x, y, z),
        {
            color: 6,
            rotation: 0,
            dimension: 0,
            radius: 160,
            alpha: 100
        });
})

CustomEvent.registerServer('vehicleGrab:deleteBlip', () => {
    if (blip && blip.doesExist()) {
        blip.destroy();
        blip = null;
    }
})
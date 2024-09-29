import {CustomEvent} from "../../custom.event";

let blip: BlipMp = null;
CustomEvent.registerServer('firefighter:deleteBlip', () => {
    if (blip) {
        blip.destroy();
        blip = null;
    }
});

CustomEvent.registerServer('firefighter:setBlip', (position: Vector3Mp) => {
    blip = mp.blips.new(1, position, {
        color: 1,
        name: 'Пожар',
        shortRange: false
    });

    mp.game.ui.setNewWaypoint(position.x, position.y);
});
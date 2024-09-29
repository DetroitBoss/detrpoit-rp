import {colshapes, colshapeHandle} from "../../checkpoints";
import {CustomEvent} from "../../custom.event";
import {gui} from "../../gui";
import {createRouteBlip, destroyRouteBlip} from "../../blips";

const sortGameInteractionHandler = () => {
    gui.setGui('sortGarbage');
}

let interaction: colshapeHandle = null;

CustomEvent.registerServer('sanitation:sort:addInteraction', (pos: Vector3Mp) => {
    if (interaction) interaction.destroy();

    interaction = colshapes.new(new mp.Vector3(pos.x, pos.y, pos.z - 1), "Сортировать", sortGameInteractionHandler, {
        type: 1,
        radius: 2,
        color: [249, 215, 28, 255]
    })

    createRouteBlip("Место сортировки", new mp.Vector3(pos.x, pos.y, pos.z - 1), 21);
})

CustomEvent.registerServer('sanitation:sort:removeInteraction', () => {
    destroyRouteBlip("Место сортировки");
    if (interaction) interaction.destroy();
    interaction = null;
})







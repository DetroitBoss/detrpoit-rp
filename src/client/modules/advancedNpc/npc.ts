import {registerHookHandler} from "../../../shared/hooks";
import {ENTITY_TYPES, InteractData, RAYCAST_DETECT_ENTITY_HOOK} from "../interact";
import {CustomEvent} from "../custom.event";
import {systemUtil} from "../../../shared/system";

const PED_NAMES_RENDER_DISTANCE = 10;

registerHookHandler<InteractData>(RAYCAST_DETECT_ENTITY_HOOK, (raycastEntity: EntityMp) => {
    if (raycastEntity.type !== ENTITY_TYPES.PED) {
        return null;
    }

    if (!raycastEntity.getVariable('advancedPedName')) {
        return null;
    }

    return {
        helpText: 'Поговорить с ' + raycastEntity.getVariable('advancedPedName'),
        onInteract: (entity) => {
            CustomEvent.triggerServer('advancedPed:interact', entity.remoteId);
        }
    }
});

let advancedNpcPeds: PedMp[] = [];
function updateAdvancedNpc() {
    const peds: PedMp[] = [];

    mp.peds.forEachInStreamRange((ped) => {
        const pos = ped?.getCoordsAutoAlive();

        if (systemUtil.distanceToPos(pos, mp.players.local.position) > PED_NAMES_RENDER_DISTANCE) {
            return;
        }

        if (ped.getVariable('advancedPedName')) {
            peds.push(ped);
        }
    });

    advancedNpcPeds = peds;
}
setInterval(updateAdvancedNpc, 500);

mp.events.add('render', () => {
    for (let ped of advancedNpcPeds) {
        const pos = ped?.getCoordsAutoAlive();
        const name = ped?.getVariable('advancedPedName');
        if (pos) {
            mp.game.graphics.drawText(name, [pos.x, pos.y, pos.z + 1], {
                font: 0,
                color: [255, 255, 255, 255],
                scale: [0.4, 0.4],
                outline: true
            });
        }
    }
});

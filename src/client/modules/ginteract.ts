import {CustomEvent} from "./custom.event";
import {
    ENTITY_TYPES,
    entitysData,
    gameObjectClick,
    gInteractObject,
    InteractData,
    RAYCAST_DETECT_ENTITY_HOOK
} from "./interact";
import {doorEvent} from "./doors";
import {system} from "./system";
import {user} from "./user";
import {HUNTING_ANIMALS_MODELS} from "../../shared/hunting";
import {invokeHook} from "../../shared/hooks";

const player = mp.players.local;
CustomEvent.register('gpress', () => {
    if(player.isDead()) return player.notify('Вы мертвы', 'error');
    if(user.cuffed) return player.notify('Вы в наручниках', 'error');
    if(player.vehicle && player.vehicle.remoteId && !player.vehicle.autosalon) return CustomEvent.triggerServer('vehicle:interaction', player.vehicle.remoteId);
    if(doorEvent()) return;
    let closest: {text?: string, handle: number, x: number, y: number, z: number, pl?:boolean, ped?:boolean, vh?:boolean}[] = entitysData.filter(q => system.distanceToPos(player.position, q) < 2);

    let raycastEntity = gInteractObject.get() as EntityMp;

    if (raycastEntity) {
        const data = invokeHook<InteractData>(RAYCAST_DETECT_ENTITY_HOOK, raycastEntity)[0];
        if (data) {
            data.onInteract(raycastEntity);
            return;
        }

        if (raycastEntity.type === ENTITY_TYPES.PLAYER) {
            return CustomEvent.triggerServer('player:interaction', raycastEntity.remoteId);
        } else if (raycastEntity.type === ENTITY_TYPES.VEHICLE) {
            return CustomEvent.triggerServer('vehicle:interaction', raycastEntity.remoteId);
        }
    }

    if(closest.length > 0){
        closest = closest.sort((a,b) => {
            const adist = system.distanceToPos(player.position, a)
            const bdist = system.distanceToPos(player.position, b)
            return adist - bdist;
        })

        return gameObjectClick(closest[0].handle)
    }
})
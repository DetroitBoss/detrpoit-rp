import {
    HUNTING_ANIMALS_MODELS,
    HUNTING_ANIMALS_POSITION_ZONE,
    HUNTING_BLIP,
    HUNTION_ANIMAL_SEE_DIST
} from "../../shared/hunting";
import {system} from "./system";
import {isPedMy, taskGoCoords, taskRoutePlay} from "./peds";
import {user} from "./user";
import {CustomEvent} from "./custom.event";
import {hudBar} from "./hudBar";
import {registerHookHandler} from "../../shared/hooks";
import {ENTITY_TYPES, InteractData, RAYCAST_DETECT_ENTITY_HOOK} from "./interact";

const player = mp.players.local;


const getMiddlePosZone = (zoneid: number) => {
    const zone = HUNTING_ANIMALS_POSITION_ZONE[zoneid];
    if(!zone) return null;
    return system.middlePoint2d(...zone);
}
HUNTING_ANIMALS_POSITION_ZONE.map((item, id) => {
    system.createBlip(HUNTING_BLIP.id, HUNTING_BLIP.color, getMiddlePosZone(id), `Охота`, 0);
})

mp.events.add('entityControllerChange', (ped: PedMp, controller: PlayerMp) => {
    verify(ped)
})

mp.events.add('entityStreamIn', (ped: PedMp, controller: PlayerMp) => {
    verify(ped)
})

registerHookHandler<InteractData>(RAYCAST_DETECT_ENTITY_HOOK, (raycastEntity: EntityMp) => {
    const isModelForHunting = () => {
        return HUNTING_ANIMALS_MODELS.some(q => mp.game.joaat(q.hash) === raycastEntity.getModel())
    }

    if (raycastEntity.type !== ENTITY_TYPES.PED || !raycastEntity.isDead() || !isModelForHunting()) {
        return null;
    }

    const animalName = HUNTING_ANIMALS_MODELS.find(q => mp.game.joaat(q.hash) === raycastEntity.getModel()).name;
    return {
        helpText: `${animalName}`,
        onInteract: (entity) => {
            CustomEvent.triggerServer('interaction:huntingPed', entity.remoteId);
        }
    }
});


setInterval(() => {
    mp.peds.forEachInStreamRange(ped => {
        const zoneId = ped.getVariable('hunting');
        const huntingCfgI = ped.getVariable('huntingCfg');
        if(typeof zoneId !== 'number') return;
        if(typeof huntingCfgI !== 'number') return;
        const huntingCfg = HUNTING_ANIMALS_MODELS[huntingCfgI];
        if(!huntingCfg) return;
        if(!isPedMy(ped)) return;
        let nearest = user.getNearestPlayersInCoord(ped.position, ped.dimension, HUNTION_ANIMAL_SEE_DIST);
        nearest.map(target => mp.game.invoke('0xF166E48407BAC484', ped.handle, target.handle, 0, 16))
    })
}, 2000)

const verify = (ped: PedMp) => {
    if(ped.type !== 'ped') return;
    if(!ped.handle) return;
    const zoneId = ped.getVariable('hunting');
    if(typeof zoneId !== 'number') return;
    if(!isPedMy(ped)) return;
    mp.game.invoke('0xBB9CE077274F6A1B', ped.handle, true, true)
}
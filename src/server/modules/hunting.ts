import {system} from "./system";
import {
    HUNTING_ANIMALS_MODELS,
    HUNTING_ANIMALS_POSITION_ZONE,
    HUNTING_IN_ZONE_SAME_TIME,
    HUNTING_RESPAWN_MINUTE, HUNTING_SKINNING_WEAPON, HUNTION_SKINNING_SECONDS
} from "../../shared/hunting";
import {User} from "./user";
import {CustomEvent} from "./custom.event";
import {InterractionMenu} from "./interactions/InterractionMenu";
import {getBaseItemNameById} from "../../shared/inventory";
import {HUNT_TASK_MANAGER_EVENT} from "./battlePass/tasks/huntTaskManager";

export const HUNTING_ANIMAL_SKINNED_EVENT = 'hunting:skinnedAnimal';

export const spawnHuntingAnimal = (zone: number) => {
    const item = system.randomArrayElement(HUNTING_ANIMALS_MODELS);
    if(!item) return;
    const pos = system.randomArrayElement(HUNTING_ANIMALS_POSITION_ZONE[zone]);
    const ped = system.createPed(new mp.Vector3(pos.x, pos.y, pos.z), pos.h, item.hash, false, false);
    ped.setVariable('hunting', zone);
}

CustomEvent.registerClient('interaction:huntingPed', (player: PlayerMp, pedId: number) => {
    const user = player.user;
    if (!user) return;
    const target = mp.peds.at(pedId);
    if (!target) return;

    const check = (checkItem: boolean = true) => {
        if (!mp.players.exists(player)) return false;
        if (!mp.peds.exists(target)) return false;
        if (system.distanceToPos(player.position, target.position) > 5) return false;
        if (player.dimension !== target.dimension) return false;

        if(checkItem && !user.haveItem(HUNTING_SKINNING_WEAPON)) {
            player.notify(`Требуется ${getBaseItemNameById(HUNTING_SKINNING_WEAPON)}`, 'error');
            return false;
        }

        return true;
    }

    if(!check(false)) {
        return;
    }

    let animalHunting = HUNTING_ANIMALS_MODELS.find(q => mp.joaat(q.hash) === target.model)
    const interaction = new InterractionMenu(player);
    if(animalHunting){
        interaction.add(`Освежевать`, '', 'skinning',() => {
            if(!check()) return;

            user.playAnimationWithResult(["amb@medic@standing@kneel@base" ,"base"], HUNTION_SKINNING_SECONDS, `Освежевание`).then((status) => {
                if(!check()) return;
                if(!status) return;

                if(!user.tryGiveItem(animalHunting.item, true, true)) {
                    return;
                }

                mp.events.call(HUNTING_ANIMAL_SKINNED_EVENT, player, animalHunting.item);
                mp.events.call(HUNT_TASK_MANAGER_EVENT, player, animalHunting.item);
                user.achiev.achievTickByType('animalHunt')
                target.destroy()
            })
        })
    }

    interaction.open()
});

HUNTING_ANIMALS_POSITION_ZONE.map((zone, id) => {
    setTimeout(() => {
        for(let i = 0; i < HUNTING_IN_ZONE_SAME_TIME; i++){
            let canSpawn = 1;
            let ped: PedMp;
            setInterval(() => {
                if(canSpawn === 1){
                    const modelIndex = system.randomArrayElementIndex(HUNTING_ANIMALS_MODELS);
                    if(modelIndex === -1) return;
                    const model = HUNTING_ANIMALS_MODELS[modelIndex];
                    if(!model) return;
                    const pos = system.randomArrayElement(zone);
                    if(ped && mp.peds.exists(ped)) ped.destroy()
                    if(User.getNearestPlayerByCoord(new mp.Vector3(pos.x, pos.y, pos.z), 50, 0)) return;
                    ped = system.createPed(new mp.Vector3(pos.x, pos.y, pos.z), pos.h, model.hash, false, false);
                    ped.setVariables({
                        hunting: id,
                        huntingCfg: modelIndex
                    });
                    canSpawn = 2;
                } else if(canSpawn === 2){
                    if(!ped || !mp.peds.exists(ped)){
                        canSpawn = 0
                        setTimeout(() => {
                            canSpawn = 1;
                        }, HUNTING_RESPAWN_MINUTE * 60000)
                    }
                }

            }, 10000)
        }
    }, 100)
})
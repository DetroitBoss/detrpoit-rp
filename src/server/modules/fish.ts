import {
    FISH_CATCH_CHANCE,
    FISH_POS,
    FishAnimTime,
    FISHES, getBestAvailabelFishByLevel,
    getFisherLevelByExp,
    IFish,
    IRod,
    RODS
} from "../../shared/fish";
import {CustomEvent} from "./custom.event";
import {system} from "./system";
import {FISHING_TASK_MANAGER_EVENT} from "./battlePass/tasks/fishingTaskManager";
import { writeSpecialLog } from './specialLogs'

CustomEvent.registerClient('fish:catch:start', (player, id: number, throwLength: number) => {
    let conf = FISH_POS[id];
    if (!conf) return false;
    const user = player.user;
    if (!user) return false;
    user.tempData.fishing = true;

    setTimeout(() => {
        if (mp.players.exists(player)) return false;
    }, FishAnimTime)

    if (conf.needLicense && !user.haveActiveLicense('fishrod')){
        player.notify("В данном месте требуется лицензия для ловли рыбы", "error")
        return false
    }
    if (!user.haveFishRod) {
        player.notify('У вас нет удочки', "error");
        return false
    }

    const randomFish = getRandomFish(player, throwLength)
    user.tempData.fishToCatch = randomFish.itemId
    
    return randomFish
})

CustomEvent.registerClient('fish:catch:done', (player, fishId: number) => {
    const user = player.user;
    if (!user) 
        return;

    const catchedFish = FISHES.find(f => f.itemId == fishId);
    
    if (!catchedFish || !player.user.rodInHandId || !player.user.tempData.fishing)
        return
    
    if (user.tempData.fishToCatch != catchedFish.itemId) {
        writeSpecialLog(`Обман рыбы ${user.tempData.fishToCatch} ${catchedFish.itemId}`, player)
    }
    
    user.tryGiveItem(fishId, true, true);
    mp.events.call(FISHING_TASK_MANAGER_EVENT, player, fishId);

    player.user.addJobExp('fisher', catchedFish.expPerCatch);
    player.user.addFishStat(catchedFish);
    player.user.achiev.achievTickByType("fishCount");

    player.user.rodInHandId = 0
    player.user.tempData.fishing = false
})

const getRodImpactToFishCatchChance = (fishDefaultChance: number, rod: IRod): number => {
    return fishDefaultChance + rod.bestFishChanceIncrement
}

/**
 * Высчитать рандомную рыбу с учетом всех возможных бустов
 */
const getRandomFish = (player: PlayerMp, throwLength: number): IFish => {
    const fisherLevel = getFisherLevelByExp(player.user.getJobExp('fisher'))
    const fisherRod = RODS.find(r => r.itemId === player.user.rodInHandId)
    const bestAvailableFish = getBestAvailabelFishByLevel(fisherLevel)
    
    const chances: { fish: IFish, chance: number }[] = FISHES.map(fish => {
        return {
            fish: fish,
            // Если это лучшая рыба доступная на уровне, то к стандартному шансу поимки рыбы прибавляем влияние удочки 
            chance: fish.catchChances.get(fisherLevel)
                + (bestAvailableFish == fish ? getRodImpactToFishCatchChance(fish.catchChances.get(fisherLevel), fisherRod) + throwLength / 3 : 0)
        }
    })
    
    const randomNumber = system.getRandomInt(1, 100)

    let randomFish = chances[0]
    chances.forEach(fish => {
        if (fish.chance >= randomNumber) {
            randomFish = fish;
            return;
        }
    })
    
    return randomFish.fish
}

CustomEvent.registerClient('fish:cancel', (player) => {
    if (!player.user) 
        return
    
    player.user.rodInHandId = 0
})

CustomEvent.registerClient('fish:haveAccess', (player, id: number) => {
    const user = player.user;
    if (!user) return false;
    let conf = FISH_POS[id];
    if (!conf) return;
    const currentRod = RODS.find(r => r.itemId === player.user.rodInHandId)
    const fisherLvl = getFisherLevelByExp(player.user.getJobExp('fisher'))
    if (currentRod.minLevelToBuy > fisherLvl) {
        player.user.notify(`Данная удочка доступна с ${currentRod.minLevelToBuy} уровня рыбака, а у вас ${fisherLvl} уровень`, 'warning')
        return false
    }
        
    return { rod: user.haveFishRod, license: !conf.needLicense || user.haveActiveLicense('fishrod')}
})
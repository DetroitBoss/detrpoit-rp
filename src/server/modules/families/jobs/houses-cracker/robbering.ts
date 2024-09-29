import {HouseEntity} from "../../../typeorm/entities/houses";
import {getInteriorHouseById} from "../../../../../shared/inrerriors";
import {CustomEvent} from "../../../custom.event";
import {getRandomInt} from "../../../../../shared/arrays";
import {RobberyItems, RobberyTexts, RobbingTimeSeconds} from "./config";
import {getBaseItemNameById} from "../../../../../shared/inventory";
import {MINIGAME_TYPE} from "../../../../../shared/minigame";

/** Создает точки ограбления */
export function createRobberyCheckpoints(player: PlayerMp, house: HouseEntity) {
    const interiorCfg = getInteriorHouseById(house.interrior);
    if (!interiorCfg) {
        player.notify('Произошла непредвиденная ошибка. Обратитесь к администрации', 'error');
        return;
    }

    CustomEvent.triggerClient(player, 'jobs:houseCracking:createRobberyPoints', house.interrior, house.id);
}

CustomEvent.registerClient('jobs:houseCracking:rob', async (player) => {
    if (!player.user || !player.housesCrackerData) {
        return;
    }

    const house = player.housesCrackerData.house;
    const interiorCfg = getInteriorHouseById(house.interrior);
    if (player.housesCrackerData.robbedPoints + 1 > interiorCfg.robberyPoints.length) {
        return;
    }

    player.housesCrackerData.robbedPoints++;

    const minigameCompleted = await player.user.playAnimationWithResult(['anim@heists@money_grab@duffel', 'loop'],
        RobbingTimeSeconds, RobberyTexts[getRandomInt(0, RobberyTexts.length - 1)], player.heading, MINIGAME_TYPE.COLLECT_GAME);

    if (!mp.players.exists(player) || !player.user || !minigameCompleted) {
        return;
    }

    generateRobberyItem(player);

    if (player.housesCrackerData.robbedPoints === interiorCfg.robberyPoints.length) {
        player.notify('Всё обыскали, пора сваливать отсюда');
    }
});

function generateRobberyItem(player: PlayerMp) {
    const robberyItem = RobberyItems[getRandomInt(0, RobberyItems.length - 1)];
    const [min, max] = robberyItem.DropAmountRange;
    const amount = getRandomInt(min, max);

    const existingItem = player.housesCrackerData.robbedItems.find(i => i.itemId === robberyItem.ItemId);
    if (existingItem) {
        existingItem.amount += amount;
    }
    else {
        player.housesCrackerData.robbedItems.push({ itemId: robberyItem.ItemId, amount: amount });
    }

    player.notify(`Вы нашли ${amount} шт. ${getBaseItemNameById(robberyItem.ItemId)}`);
}
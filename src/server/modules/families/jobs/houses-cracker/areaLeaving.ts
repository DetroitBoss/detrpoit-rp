/** Создание зоны, которую нужно покинуть для завершения ограбления */
import {CustomEvent} from "../../../custom.event";
import {LeavingAreaRadius} from "./config";
import {inventory} from "../../../inventory";
import {OWNER_TYPES} from "../../../../../shared/inventory";
import {HouseEntity} from "../../../typeorm/entities/houses";
import {deleteHouseRobbingNow} from "./index";

export function createLeavingArea(player: PlayerMp, position: Vector3Mp) {
    CustomEvent.triggerClient(player, 'jobs:houseCracking:createLeavingArea', position, LeavingAreaRadius);
    player.housesCrackerData.isLeavingAreaCreated = true;
}

CustomEvent.registerClient('jobs:houseCracking:leftArea', (player) => {
    if (!player.user || player.dimension !== 0) {
        return;
    }

    endRobberyTask(player);
});

mp.events.add('playerLeaveHouse', (player: PlayerMp, house: HouseEntity) => {
    if (!player.user || !player.housesCrackerData || house.id !== player.housesCrackerData.house.id) {
        return;
    }

    if (!player.housesCrackerData.isLeavingAreaCreated) {
        createLeavingArea(player, new mp.Vector3(house.x, house.y, house.z));
    }
});

mp.events.add('playerQuit', (p) => endRobberyTask(p, false));
mp.events.add('playerDeath', (p) => endRobberyTask(p, false));
mp.events.add('playerCuffed', (p, isCuffed: boolean) => {
    if (!isCuffed) {
        return;
    }

    endRobberyTask(p, false);
});

function endRobberyTask(player: PlayerMp, isSuccessfully: boolean = true) {
    if (!player.user || !player.housesCrackerData) {
        return;
    }

    if (player.housesCrackerData.govRobberyBlip) {
        player.housesCrackerData.govRobberyBlip.destroy();
    }

    deleteHouseRobbingNow(player.dbid);
    CustomEvent.triggerClient(player, 'jobs:houseCracking:end');

    if (isSuccessfully) {
        player.notify('Задание успешно завершено: вы покинули зону. ' +
            'Всё награбленное находится у вас в инвентаре, можете продать на черном рынке.');

        const robbedItems = player.housesCrackerData.robbedItems;
        for (const item of robbedItems) {
            inventory.createItem({
                owner_type: OWNER_TYPES.PLAYER,
                owner_id: player.user.id,
                count: item.amount,
                item_id: item.itemId
            });
        }
        
        delete player.housesCrackerData;
    } else {
        player.notify('Задание ограбления провалено.', 'warning');
    }
}
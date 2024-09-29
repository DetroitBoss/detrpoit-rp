import {
    HALLOWEEN_ISLAND_DIMENSION_BASE,
    HALLOWEEN_ISLAND_PORTAL_POSITION,
    HALLOWEEN_PORTAL_MODEL,
    HALLOWEEN_PORTAL_POSITION,
    HALLOWEEN_PORTALS_QUEST_ID, HALLOWEEN_ZOMBIES_EVENT_GROUP_LENGTH
} from "../../../../../../shared/events/halloween.config";
import {colshapeHandle} from "../../../../checkpoints";
import {CustomEvent} from "../../../../custom.event";
import {systemUtil} from "../../../../../../shared/system";
import {ZombiesDemolitionEvent} from "./zombiesDemolitionEvent";
import {inventory} from "../../../../inventory";
import {ITEM_TYPE} from "../../../../../../shared/inventory";
import {gui} from "../../../../gui";
import {randomArrayElement, takeElements} from "../../../../../../shared/arrays";

const MAX_DISTANCE_TO_TELEPORT = 10;

const portalObject = mp.objects.new(HALLOWEEN_PORTAL_MODEL, HALLOWEEN_PORTAL_POSITION, {
    rotation: new mp.Vector3(0, 0, 252),
    alpha: 255,
    dimension: 0
});

for (let i = 0; i < 50; i++) {
    const islandPortalObject = mp.objects.new(HALLOWEEN_PORTAL_MODEL, HALLOWEEN_ISLAND_PORTAL_POSITION, {
        rotation: new mp.Vector3(0, 0, 252),
        alpha: 255,
        dimension: HALLOWEEN_ISLAND_DIMENSION_BASE + i
    });
}

const enterPortalColshape = new colshapeHandle(HALLOWEEN_PORTAL_POSITION, 'Войти в портал', handlePlayerEnterPortal,
    {
        type: -1,
        radius: 5
    }
);

function handlePlayerEnterPortal(player: PlayerMp, index: number) {
    if (!player.user || !mp.players.exists(player)) {
        return;
    }

    if (!player.user.advancedQuests.isQuestActive(HALLOWEEN_PORTALS_QUEST_ID)) {
        player.notify('Вы не сможете зайти в портал, пока не дойдете по квестовой цепочке до этого задания', 'error');
        return;
    }

    if (inventory.getItemsCountByType(player, ITEM_TYPE.WEAPON) < 1) {
        player.notify('Не забудьте взять с собой оружие', 'warning');
    }

    player.notify('Портал автоматически телепортирует в **:00 всех находящихся по-близости игроков');
}

let demolitionEvents: ZombiesDemolitionEvent[] = [];

function startDemolitionEvent() {
    const playersToTeleport = mp.players.toArray()
        .filter(player => player && player.user && mp.players.exists(player))
        .filter(player => player.user.advancedQuests.isQuestActive(HALLOWEEN_PORTALS_QUEST_ID))
        .filter(player => systemUtil.distanceToPos(player.position, HALLOWEEN_PORTAL_POSITION) < MAX_DISTANCE_TO_TELEPORT);

    for (let demolitionEvent of demolitionEvents) {
        if (demolitionEvent) {
            demolitionEvent.destroy();
        }
    }

    demolitionEvents = [];

    let dimension = HALLOWEEN_ISLAND_DIMENSION_BASE;
    while (playersToTeleport.length > 0) {
        const playersGroup = takeElements(playersToTeleport, HALLOWEEN_ZOMBIES_EVENT_GROUP_LENGTH);
        const demolitionEvent = new ZombiesDemolitionEvent(playersGroup, dimension++);
        demolitionEvents.push(demolitionEvent);

        playersToTeleport.splice(0, HALLOWEEN_ZOMBIES_EVENT_GROUP_LENGTH);
    }
}

CustomEvent.register('newHour', () => {
    startDemolitionEvent();
});

gui.chat.registerCommand('testzombies', (player) => {
    if (!player.user.isAdminNow(7)) {
        return;
    }

    startDemolitionEvent();
})




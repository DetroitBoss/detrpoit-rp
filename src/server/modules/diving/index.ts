import './employer';
import {CustomEvent} from "../custom.event";
import {DIVING_COSTUME_ITEM_ID, DivingMaps, REWARDS} from "../../../shared/diving/work.config";
import {DRESS_CONFIG_FEMALE, DRESS_CONFIG_MALE} from "../../../shared/diving/work.config";
import {system} from "../system";
import {inventory} from "../inventory";
import {gui} from "../gui";
import {JOB_TASK_MANAGER_EVENT} from "../battlePass/tasks/jobTaskManager";

const divers: Map<number, boolean> = new Map<number, boolean>();

gui.chat.registerCommand('debugdiving', (player) => {
    if (!player.user.isAdminNow(6)) return;

    CustomEvent.triggerClient(player, 'diving:debug:chests');
})

async function giveMap(player: PlayerMp) {
    if (Math.floor(Math.random() * 90) !== 1) return;

    let haveAllSlices = true,
        length = 1;

    if (player.user.entity.achievements.usecarttreasures && player.user.entity.achievements.usecarttreasures[1])
        length = 2;
    if (player.user.entity.achievements.usecartlocman && player.user.entity.achievements.usecartlocman[1])
        length = 3;



    const randMap = DivingMaps[Math.floor(Math.random() * length)],
        randSlice = randMap.slices[Math.floor(Math.random() * randMap.slices.length)];

    await player.user.giveItem(randSlice);

    player.user.log('diving', `Получил кусок карты (${randSlice})`);

    randMap.slices.map(el => {
        if (!player.user.haveItem(el)) haveAllSlices = false;
    });

    if (!haveAllSlices) return;

    randMap.slices.map(el => {
        inventory.deleteItemsById(player, el, 1);
    });

    player.user.giveItem(randMap.itemId, true);
}

CustomEvent.registerClient('diving:dive', (player) => {
    if (!player.user.haveItem(DIVING_COSTUME_ITEM_ID))
        return player.notify('У вас отсутствует костюм для дайвинга');

    player.user.setJobDress(player.user.male ? DRESS_CONFIG_MALE : DRESS_CONFIG_FEMALE);
    divers.set(player.user.id, true);
    player.call('diving:startDive');
})

CustomEvent.registerClient('diving:dropCloth', (player) => {
    player.user.setJobDress(null);
})


CustomEvent.registerClient('diving:canCreateChest', (player) => {
    if (system.timestamp - player.user.lastDiveMissionTime < 360) return;

    player.user.haveDiverMission = true;
    CustomEvent.triggerClient(player, 'diving:createMission');
});

CustomEvent.registerClient('diving:missionCompleted', (player) => {
    divers.set(player.user.id, false);
    player.user.lastDiveMissionTime = system.timestamp;
});


CustomEvent.registerClient('diving:reward', (player, isMapMission: boolean) => {
    if (!divers.get(player.user.id)) return;
    if (!player.user.haveDiverMission) return;
    player.user.haveDiverMission = false;

    const rewardItem: number = REWARDS[Math.floor(Math.random()*REWARDS.length)];
    player.user.log('diving', `Нашёл на работе дайвера (${rewardItem})`);
    mp.events.call(JOB_TASK_MANAGER_EVENT, player, 'diving');
    player.user.giveItem(rewardItem, true);
    giveMap(player);
});

CustomEvent.registerClient('diving:deleteMapItem', (player, item_id: number) => {
    inventory.deleteItemsById(player, item_id, 1);
    player.notify('Карта активирована', 'success');
});


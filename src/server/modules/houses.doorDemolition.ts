import {registerHookHandler} from "../../shared/hooks";
import {houses, HOUSES_ENTER_MENU_HOOK} from "./houses";
import {HouseEntity} from "./typeorm/entities/houses";
import {MenuClass} from "./menu";
import {FamilyReputationType} from "../../shared/family";
import {inventory} from "./inventory";
import {CustomEvent} from "./custom.event";
import {systemUtil} from "../../shared/system";
import {isHouseRobbingNow} from "./families/jobs/houses-cracker";

const DOOR_EXPLODE_ITEM_ID = 798;
const DOOR_EXPLODE_TIME_S = 10;
const DOOR_EXPLODE_RANGE = 50;
const BOMB_OBJECT_MODEL = 'ch_prop_ch_ld_bomb_01a';

registerHookHandler(HOUSES_ENTER_MENU_HOOK, (
    player: PlayerMp,
    houseEntity: HouseEntity,
    _menu: MenuClass,
    updateMenu: () => void
) => {
    if (!isPlayerCanExplodeDoor(player, houseEntity)) {
        return;
    }

    _menu.newItem({
        name: '~o~Взорвать дверь',
        onpress: () => {
            _menu.close();
            explodeDoor(player, houseEntity);
        }
    });
});

function isPlayerCanExplodeDoor(player: PlayerMp, houseEntity: HouseEntity): boolean {
    if (houseEntity.opened) {
        return false;
    }

    if (!player.user.is_police && !isPlayerHasAbilityToExplode(player)) {
        return false;
    }

    if (inventory.getItemsCountById(player, DOOR_EXPLODE_ITEM_ID) < 1) {
        return false;
    }

    if (!isHouseRobbingNow(houseEntity.id)) {
        return false;
    }

    return true;
}

function isPlayerHasAbilityToExplode(player: PlayerMp) {
    return player.user.fractionData?.mafia
}

async function explodeDoor(player: PlayerMp, houseEntity: HouseEntity) {
    if (!isPlayerCanExplodeDoor(player, houseEntity)) {
        return player.notify('Вы не можете сделать это');
    }

    const housePos = new mp.Vector3(houseEntity.x, houseEntity.y, houseEntity.z);

    const isInstalled = await player.user.playAnimationWithResult(["amb@medic@standing@kneel@base", "base", false], 15, 'Установка взрывного устройства');
    if (!isInstalled || !mp.players.exists(player)) {
        return;
    }

    inventory.deleteItemsById(player, DOOR_EXPLODE_ITEM_ID, 1);
    player.notify('Устройство взорвётся через 10 секунд, отойдите на безопасное расстояние');

    const bombObj = mp.objects.new(BOMB_OBJECT_MODEL, housePos, {
        alpha: 255,
        dimension: houseEntity.d
    });

    setTimeout(() => {
        bombObj.destroy();

        houses.setDoorOpenStatus(houseEntity, true);

        const explodePos = new mp.Vector3(housePos.x, housePos.y, housePos.z + 0.3);
        mp.players.toArray()
            .filter(player => player.user && systemUtil.distanceToPos(player.position, housePos) < DOOR_EXPLODE_RANGE)
            .forEach(player => CustomEvent.triggerClient(player, 'fxes:addExplosion',
                    explodePos, 2, 30, true, false, 2.0
                )
            );

    }, DOOR_EXPLODE_TIME_S * 1000);
}

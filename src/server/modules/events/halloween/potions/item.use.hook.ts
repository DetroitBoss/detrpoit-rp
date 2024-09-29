import {registerHookHandler} from "../../../../../shared/hooks";
import {INVENTORY_USE_ITEM_HOOK} from "../../../inventory";
import {ItemEntity} from "../../../typeorm/entities/inventory";
import {ITEM_TYPE, itemConfig} from "../../../../../shared/inventory";
import {PotionType} from "../../../../../shared/events/halloween.potions";
import {CustomEvent} from "../../../custom.event";
import {system} from "../../../system";
import {ANIM_LIST} from "../../../../../shared/anim";

const healPotions = new Map<PotionType, number>([
    [PotionType.HEALTH_DWARF, 10],
    [PotionType.HEALTH_GIANT, 50],
    [PotionType.HEALTH, 70],
    [PotionType.HEALTH_COCKROACH, 100]
])

registerHookHandler(INVENTORY_USE_ITEM_HOOK, (player: PlayerMp, item: ItemEntity, itemConfig: itemConfig) => {
    if (itemConfig.type !== ITEM_TYPE.POTION) {
        return;
    }

    if (player.user.isInCombat) {
        player.notify('Вы не можете сделать это в бою', 'error');
        return;
    }

    if (healPotions.has(item.item_id)) {
        player.user.health += healPotions.get(item.item_id);
    }
    else if (item.item_id === PotionType.ARMOR_BUG) {
        player.notify('Вам будет увеличено сопротивление к урону на 5% в течении двух минут');
        player.user.giveDamageResist(0.05, 120);
    }
    else if (item.item_id === PotionType.MANTIS) {
        player.notify('Вы отравились :(');
        player.user.health = 0;
        item.useCount(1);
        return;
    }
    else if (item.item_id === PotionType.SOFA_CRITIC) {
        player.notify('Набор диванного критика выдан!');

        // Пиво
        player.user.giveItem({
            item_id: 201
        });

        // Чипсы
        player.user.giveItem({
            item_id: 21
        });

    }
    else if (item.item_id === PotionType.UNKNOWN) {
        player.user.addIll('narko', itemConfig.drugMultiple || 1);
        CustomEvent.triggerClient(player, "drug:use", system.biggestNumber(30, itemConfig.drugMultiple * 0.3))

    }
    else if (item.item_id === PotionType.ALPHA) {
        let count = itemConfig.default_count ? itemConfig.default_count : item.count;
        count = system.smallestNumber(count, 45);
        player.user.addIll('alco', count);
        CustomEvent.triggerClient(player, "drug:use", system.biggestNumber(10, count), true)

    }
    else if (item.item_id === PotionType.DANCER) {
        const dancesAnims = Object.values(ANIM_LIST["Танцы"]);
        const animToPlay = system.randomArrayElement(dancesAnims)[1][0];

        if (typeof animToPlay === "string") {
            return;
        }

        player.user.playAnimationWithResult([animToPlay[0], animToPlay[1], true], 5000, 'Неотменяемый танец ;0');

        item.useCount(1);
        return;
    }
    else if (item.item_id === PotionType.LOGAN) {
        player.notify('Здоровье будет увеличиваться каждые 15 секунд в течении двух минут')
        player.user.setRegeneration(10, 120, 15);
    }

    player.user.playAnimation([
        ["mp_player_intdrink", "intro_bottle", 1],
        ["mp_player_intdrink", "loop_bottle", 1],
        ["mp_player_intdrink", "outro_bottle", 1]
    ], true, false);
    item.useCount(1);
});
import {CustomEvent} from "../custom.event";
import {ItemEntity} from "../typeorm/entities/inventory";
import {
    BONG_ITEM_ID,
    CBD_ITEM_ID,
    HOOKAH_ITEM_ID,
    VAPE_ITEM_ID,
    VAPE_LIQUIDS_ITEM_IDS
} from "../../../shared/smoking/items";
import {MenuClass} from "../menu";
import {inventory} from "../inventory";
import {inventoryShared, OWNER_TYPES} from "../../../shared/inventory";
import {Hookah} from "./Hookah";
import {system} from "../system";


class Smoking {
    smokingActions: Map<number, Function> = new Map<number, Function>();

    constructor() {
        mp.events.add("smoking:action", (player: PlayerMp, itemId: number, item: ItemEntity) => {
            if (!this.smokingActions.has(itemId)) return;

            const action = this.smokingActions.get(itemId);

            action(player, item);
        });

        CustomEvent.registerClient('smoking:startUseVape', this.startUseVapeHandle);
        CustomEvent.registerClient('smoking:sendSmoke', this.smokeHandle);



        this.vapeAction();
        this.vapeLiquidsActions();
        this.hookahAction();
        this.bongAction();
    }

    startUseVapeHandle = (player: PlayerMp) => {
        if (!player.user || !player.user.vapeInHand) return;
        const item = inventory.getInventory(OWNER_TYPES.PLAYER, player.user.id)
            .find(el => el.id === player.user.vapeInHand);

        if (!item) return;

        if (item.advancedNumber <= 0) return player.notify('В вейпе не осталось жидкости', 'error');

        item.advancedNumber -= 1;
        CustomEvent.triggerClient(player, 'smoking:useVape');
    }

    vapeAction() {
        this.smokingActions.set(VAPE_ITEM_ID, (player: PlayerMp, item: ItemEntity) => {
            if (player.user.vapeInHand === null) {
                player.user.vapeInHand = item.id;
                CustomEvent.triggerClient(player, 'smoking:vapeInHandToggle', true);
            }else{
                if (player.user.vapeInHand === item.id) {
                    player.user.vapeInHand = null;
                    CustomEvent.triggerClient(player, 'smoking:vapeInHandToggle', false);
                }else{
                    player.user.vapeInHand = item.id;
                }
            }
        })
    }

    hookahAction() {
        this.smokingActions.set(HOOKAH_ITEM_ID, (player: PlayerMp, item: ItemEntity) => {
            new Hookah(player, item);
        })
    }

    bongAction() {
        this.smokingActions.set(BONG_ITEM_ID, (player: PlayerMp, item: ItemEntity) => {
            if (system.timestamp - player.user.lastSmoke < 5)
                return player.notify('Слишком быстро', 'error');

            const cbd = inventory.getInventory(OWNER_TYPES.PLAYER, player.user.id)
                .find(el => el.item_id === CBD_ITEM_ID);

            if (!cbd)
                return player.notify('У вас нет CBD для бонга', 'error');

            inventory.deleteItemsById(player, CBD_ITEM_ID, 1);
            player.user.lastSmoke = system.timestamp;

            CustomEvent.triggerClient(player, 'smoking:useBong');
        })
    }

    vapeLiquidsActions() {
        VAPE_LIQUIDS_ITEM_IDS.forEach(liquidId => {
            this.smokingActions.set(liquidId, (player: PlayerMp, item: ItemEntity) => {
                const cfg = inventoryShared.get(item.item_id);
                const size = cfg.base_weight / 10;

                if (!cfg) return;

                let items = inventory.getInventory(OWNER_TYPES.PLAYER, player.user.id);
                items = items.filter(el => el.item_id === VAPE_ITEM_ID);

                if (items.length === 0) {
                    return player.notify(`У вас нет вейпa в инвентаре`)
                }else if (items.length === 1) {
                    if (items[0].advancedNumber + size > 20)
                        return player.notify(`В баке недостаточно места`);

                    inventory.deleteItemsById(player, item.item_id, 1);
                    items[0].advancedNumber = items[0].advancedNumber + size;
                }else{
                    let m = new MenuClass(player, 'Заправить вейп', '');

                    items.forEach(el => {
                        m.newItem({
                            name: `Вейп ${el.id}`,
                            onpress: async () => {
                                if (el.advancedNumber + size > 20)
                                    return player.notify(`В баке недостаточно места`);

                                inventory.deleteItemsById(player, item.item_id, 1);
                                el.advancedNumber = el.advancedNumber + size;
                                el.save();
                            }
                        })
                    })

                    m.open();
                }
            })
        })
    }

    smokeHandle = (player: PlayerMp, position: Vector3Mp) => {
        if (!player.user) return;

        mp.players.forEachInRange(player.position, 30, target => {
            if (!target.user || target.dimension !== 0) return;

            CustomEvent.triggerClient(target, 'smoking:addSmoke', position);
        })

    }
}

new Smoking();




import {ServerNpc} from "../../../advancedNpc";
import {
    NEW_YEAR_EXCHANGE_DIALOG_ID,
    NEW_YEAR_EXCHANGE_NPC_ID, NEW_YEAR_EXCHANGE_NPC_NAME,
    NEW_YEAR_EXCHANGE_NPC_PARAMETERS
} from "../../../../../shared/events/newYear/exchange.config";
import {registerDialog} from "../../../advancedNpc/dialogs/dialogs";
import {FuncAnswer} from "../../../advancedNpc/dialogs/impl/funcAnswer";
import {NEW_YEAR_EXCHANGE_ACTIVE} from "../../../../../shared/events/newYear/main.config";
import {
    DressConfigDto,
    ExchangeClothesItem, ExchangeInventoryItem, ExchangeItem,
    ExchangeItemType
} from "../../../../../shared/events/halloween.exchange";
import {EXCHANGE_ITEMS} from "../../../../../shared/events/newYear/exchange.config";
import {dress} from "../../../customization";
import {CustomEvent} from "../../../custom.event";
import {menu} from "../../../menu";


export class Exchange {
    constructor() {
        this.spawnExchangeNPC();
        this.createNPCDialog();

        CustomEvent.registerCef('new-year:exchange:buy',
            (player, id: number) => this.buyItemHandle(player, id));
    }

    spawnExchangeNPC() {
        new ServerNpc(NEW_YEAR_EXCHANGE_NPC_ID, NEW_YEAR_EXCHANGE_NPC_PARAMETERS, NEW_YEAR_EXCHANGE_DIALOG_ID);
    }

    createNPCDialog() {
        registerDialog({
            id: NEW_YEAR_EXCHANGE_DIALOG_ID,
            characterName: NEW_YEAR_EXCHANGE_NPC_NAME,
            nodes: [
                {
                    id: 0,
                    npcReplies: [
                        { text: 'Привет! Ты наверно хочешь обменять леденцы на что-то интересное?' }
                    ],
                    answers: [
                        {
                            text: 'Да, покажи всё что у тебя есть',
                            toNode: NEW_YEAR_EXCHANGE_ACTIVE ? 2 : 1
                        }
                    ]
                },

                {
                    id: 1,
                    npcReplies: [
                        { text: 'Дело вот в чём, все приколюхи мне ещё только везут' },
                        { text: 'Приходи 30 декабря в 4 утра' }
                    ],
                    answers: [
                        { text: 'Хорошо, обязательно приду!', isExit: true }
                    ]
                },

                {
                    id: 2,
                    npcReplies: [
                        { text: 'Забирай всё что хочешь' }
                    ],
                    answers: [
                        { text: 'Показывай уже', isExit: true, onReply: new FuncAnswer((player) => this.openMenuHandle(player))  }
                    ]
                }
            ]
        })
    }

    openMenuHandle(player: PlayerMp) {
        setTimeout(() => {
            const dressDtos = EXCHANGE_ITEMS
                .filter(item => item.itemType === ExchangeItemType.CLOTHES)
                .map<DressConfigDto>(item => {
                    const exchangeDressItem = item as ExchangeClothesItem;
                    const dressCfg = dress.get(exchangeDressItem.dressConfigId);

                    return {
                        id: exchangeDressItem.dressConfigId,
                        name: dressCfg.name,
                        isMale: dressCfg.male === 1
                    }
                });

            player.user.setGui('lollipopsExchanger', 'new-year:exchange:open',
                player.user.lollipops,
                player.user.male,
                dressDtos
            );
        }, 500);
    }

    async buyItemHandle(player: PlayerMp, itemIdx: number) {
        if (!player || !player.user || !mp.players.exists(player)) {
            return;
        }

        const item = EXCHANGE_ITEMS[itemIdx];
        if (!item) return;

        if (player.user.lollipops < item.price) return player.notify('У вас недостаточно леденцов');

        player.user.setGui(null);

        const isAccepted = await menu.accept(player);

        if (!isAccepted) return;

        player.user.lollipops -= item.price;

        this.givePlayerExchangeItem(player, item);
        CustomEvent.triggerCef(player, 'new-year:exchange:setBalance', player.user.lollipops);
    }

    givePlayerExchangeItem(player: PlayerMp, item: ExchangeItem) {
        if (item.itemType === ExchangeItemType.INVENTORY_ITEM) {
            player.user.giveItem((item as ExchangeInventoryItem).configItemId, true);
        } else if (item.itemType === ExchangeItemType.CLOTHES) {
            const dressId = (item as ExchangeClothesItem).dressConfigId;
            const dressConfig = dress.get(dressId);

            if (dressConfig.category == 107) player.user.setDressValueById(959, dressId);
            if (dressConfig.category == 106) player.user.setDressValueById(957, dressId);
            if (dressConfig.category == 102) player.user.setDressValueById(956, dressId);
            if (dressConfig.category == 101) player.user.setDressValueById(955, dressId);
            if (dressConfig.category == 100) player.user.setDressValueById(954, dressId);
            if (dressConfig.category == 7) player.user.setDressValueById(958, dressId);
            if (dressConfig.category == 6) player.user.setDressValueById(953, dressId);
            if (dressConfig.category == 4) player.user.setDressValueById(952, dressId);
            if (dressConfig.category == 3) player.user.setDressValueById(951, dressId);
            if (dressConfig.category == 1) player.user.setDressValueById(950, dressId);
        }
    }
}
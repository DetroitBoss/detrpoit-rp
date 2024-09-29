import {ServerNpc} from "../../advancedNpc";
import {registerDialog} from "../../advancedNpc/dialogs/dialogs";
import {
    HALLOWEEN_EXCHANGE_NPC_ID,
    HALLOWEEN_EXCHANGE_NPC_NAME,
    HALLOWEEN_EXCHANGE_NPC_PARAMETERS,
    HALLOWEEN_EXCHANGE_STARTS_DATE
} from "../../../../shared/events/halloween.config";
import {DateCondition} from "../../advancedNpc/dialogs/impl/dateCondition";
import {
    DressConfigDto,
    EXCHANGE_ITEMS,
    ExchangeClothesItem,
    ExchangeInventoryItem,
    ExchangeItem,
    ExchangeItemType
} from "../../../../shared/events/halloween.exchange";
import {menu} from "../../menu";
import {dress} from "../../customization";
import {FuncAnswer} from "../../advancedNpc/dialogs/impl/funcAnswer";
import {CustomEvent} from "../../custom.event";

const HALLOWEEN_EXCHANGE_DIALOG_ID = 'halloween-exchange';

//const exchangeNpc = new ServerNpc(HALLOWEEN_EXCHANGE_NPC_ID, HALLOWEEN_EXCHANGE_NPC_PARAMETERS, HALLOWEEN_EXCHANGE_DIALOG_ID);

registerDialog({
    id: HALLOWEEN_EXCHANGE_DIALOG_ID,
    characterName: HALLOWEEN_EXCHANGE_NPC_NAME,
    nodes: [
        {
            id: 0,
            npcReplies: [
                { text: 'Привет! Ты наверно хочешь обменять конфеты на что-то интересное?' }
            ],
            answers: [
                {
                    text: 'Да, покажи всё что у тебя есть',
                    toNode: 2
                }
            ]
        },

        {
            id: 1,
            npcReplies: [
                { text: 'Дело вот в чём, все приколюхи мне ещё только везут' },
                { text: 'Приходи 8 ноября в 5 утра' }
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
                { text: 'Показывай уже', isExit: true, onReply: new FuncAnswer(openHalloweenMenu)  }
            ]
        }
    ]
})

function openHalloweenMenu(player: PlayerMp) {
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

        player.user.setGui('candyShop', 'halloween::exchange::open',
            player.user.candyCount,
            player.user.male,
            dressDtos
        );
    }, 500);
}

CustomEvent.registerCef('halloween:exchange:buy', (player, itemIdx: number) => {
    buyHalloweenItem(player, itemIdx);
});

async function buyHalloweenItem(player: PlayerMp, itemIdx: number) {
    if (!player || !player.user || !mp.players.exists(player)) {
        return;
    }

    const item = EXCHANGE_ITEMS[itemIdx];
    if (!item) {
        return;
    }

    const checkCandies = () => {
        if (player.user.candyCount < item.price) {
            player.notify('У Вас недостаточно конфет', 'error')
            return false;
        }

        return true;
    }

    if (!checkCandies())
        return;

    player.user.setGui(null);

    const isAccepted = await menu.accept(player);
    if (!isAccepted || !checkCandies()) {
        return;
    }

    player.user.candyCount -= item.price;
    givePlayerExchangeItem(player, item);

    CustomEvent.triggerCef(player, 'halloween::exchange::setBalance', player.user.candyCount);
}

function givePlayerExchangeItem(player: PlayerMp, item: ExchangeItem) {
    switch (item.itemType) {
        case ExchangeItemType.INVENTORY_ITEM:
            player.user.giveItem((item as ExchangeInventoryItem).configItemId, true);
            break;
        case ExchangeItemType.CLOTHES:
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
            break;
    }
}

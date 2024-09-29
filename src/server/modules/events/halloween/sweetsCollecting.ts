import {registerHookHandler} from "../../../../shared/hooks";
import {MenuItem} from "../../../../shared/menu";
import {HALLOWEEN_MANAGE_MENU_HOOK} from "./adminPanel";
import {houses, HOUSES_ENTER_MENU_HOOK, HOUSES_LOADED_EVENT} from "../../houses";
import {HouseEntity} from "../../typeorm/entities/houses";
import {isHalloweenEnabled} from "./index";
import {inventory} from "../../inventory";
import {HALLOWEEN_BASKET_ITEM_ID} from "../../../../shared/inventory";
import {MenuClass} from "../../menu";
import {system} from "../../system";
import {ServerNpc} from "../../advancedNpc";
import {NpcParameters} from "../../npc";
import {registerDialog} from "../../advancedNpc/dialogs/dialogs";
import {INodeCondition} from "../../advancedNpc/dialogs/interfaces/INodeCondition";
import {IAnswerAction} from "../../advancedNpc/dialogs/interfaces/IAnswerAction";
import {Dialog} from "../../advancedNpc/dialogs/interfaces/dialog";
import {
    HALLOWEEN_SWEET_NPC_ID,
    HALLOWEEN_SWEET_NPC_NAME,
    HALLOWEEN_SWEET_NPC_PARAMETERS
} from "../../../../shared/events/halloween.config";
import {getRandomInt} from "../../../../shared/arrays";

const TAKE_SWEETS_COOLDOWN_MINUTE = 15;
const SWEETS_PER_HOUSE_MAX = 5;
const SWEETS_PER_HOUSE_MIN = 15;
const HALLOWEEN_PUMPKIN_MODEL = 'halloween_props_pumpkin_003';
let housesPumpkins: { houseId: number, sweetsTakenTime: number }[] = [];

let isCollectingEnabled = false;

mp.events.add(HOUSES_LOADED_EVENT, loadHousesPumpkins);
function loadHousesPumpkins(houses: HouseEntity[]) {
    for (let house of houses) {
        housesPumpkins.push({ houseId: house.id, sweetsTakenTime: 0 });
    }
}
function unloadHousesPumpkins() {
    housesPumpkins = [];
}

/**
 * Выдает игроку хэллоунский костюм и корзину
 */
function giveSweetCollectorSet(player: PlayerMp) {
    player.user.giveItem({
        item_id: HALLOWEEN_BASKET_ITEM_ID
    });
}
function isPlayerHasSweetCollectorSet(player: PlayerMp): boolean {
    return inventory.getItemsCountById(player, HALLOWEEN_BASKET_ITEM_ID) > 0;
}

registerHookHandler(HOUSES_ENTER_MENU_HOOK, (player: PlayerMp, house: HouseEntity, menu: MenuClass, updateMenu: () => void) => {
    if (!isCollectingEnabled) {
        return;
    }

    menu.newItem({
        name: '~o~Собрать конфеты',
        onpress: () => {
            const housePumpkin = housesPumpkins.find(pumpkin => pumpkin.houseId === house.id);
            if (!housePumpkin) {
                return player.notify('Невозможно собрать конфеты в этом доме', 'error');
            }

            if (!player.user.hasAttachment('item_' + HALLOWEEN_BASKET_ITEM_ID)) {
                return player.notify('Вы должны взять корзинку в руки');
            }

            if (housePumpkin.sweetsTakenTime + TAKE_SWEETS_COOLDOWN_MINUTE * 60 > system.timestamp) {
                return player.notify('Приходите позже. Конфеты у хозяев этого дома закончились :(');
            }

            housePumpkin.sweetsTakenTime = system.timestamp;

            const candiesAmount = getRandomInt(SWEETS_PER_HOUSE_MIN, SWEETS_PER_HOUSE_MAX);
            player.user.giveCandies(candiesAmount);
            player.user.log('candiesAdd', `Собрал ${candiesAmount} конфет`);

            player.user.playAnimation([["random@domestic", "pickup_low"]], true)
        }
    })
});

registerHookHandler(HALLOWEEN_MANAGE_MENU_HOOK, (player: PlayerMp, menu: MenuClass, updateMenu: () => void) => {
    menu.newItem({
        name: (isCollectingEnabled ? 'Выключить' : 'Включить') + ' сбор конфет',
        onpress: () => {
            isCollectingEnabled = !isCollectingEnabled;
            player.notify(`Вы ${isCollectingEnabled ? 'включили' : 'выключили'} сбор конфет`);

            updateMenu();
        }
    });
});



const HALLOWEEN_SWEET_NPC_DIALOG = 'halloween-sweet-npc-dialog';

const sweetNpc = new ServerNpc(HALLOWEEN_SWEET_NPC_ID, HALLOWEEN_SWEET_NPC_PARAMETERS, HALLOWEEN_SWEET_NPC_DIALOG);

class HasBasketCondition implements INodeCondition {
    private readonly _hasNodeId: number;
    private readonly _hasNotNodeId: number;

    constructor(hasNodeId: number, hasNotNodeId: number) {
        this._hasNodeId = hasNodeId;
        this._hasNotNodeId = hasNotNodeId;
    }

    getNextNode(player: PlayerMp): number {
        return isPlayerHasSweetCollectorSet(player) ? this._hasNodeId : this._hasNotNodeId;
    }

}

class GiveBasketAction implements IAnswerAction {
    handle(player: PlayerMp, dialog: Dialog): void {
        giveSweetCollectorSet(player);
    }
}

registerDialog({
    id: HALLOWEEN_SWEET_NPC_DIALOG,
    characterName: HALLOWEEN_SWEET_NPC_NAME,
    nodes: [
        {
            id: 0,
            npcReplies: [
                { text: 'Чего хотел?' }
            ],
            answers: [
                { text: 'Корзину для конфет', toNode: new HasBasketCondition(1, 2) }
            ]
        },

        {
            id: 1,
            npcReplies: [
                { text: 'У тебя уже есть корзина, проваливай!' }
            ],
            answers: [
                { text: 'Понял, принял, уяснил', isExit: true }
            ]
        },

        {
            id: 2,
            npcReplies: [
                { text: 'Так-с, вот корзинка. Теперь можешь идти по домам и собирать конфеты' },
                { text: 'В некоторых домах конфеты могут закончиться, но не переживай, через какое-то время тыква с конфетами опять заполнится' }
            ],
            answers: [
                { text: 'Понял, спасибо', isExit: true, onReply: new GiveBasketAction() }
            ]
        }
    ]
});


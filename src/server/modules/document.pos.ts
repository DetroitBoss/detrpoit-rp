import {getDocumentName} from "../../shared/documents";
import {DOCUMENT_GIVE_MONEY_FOR_PLAYER_PERCENT, DOCUMENT_GIVE_POSITIONS} from "../../shared/documents.pos";
import {LicenseName} from "../../shared/licence";
import {CustomEvent} from "./custom.event";
import {system} from "./system";
import {User} from "./user";
import {getBaseItemNameById} from "../../shared/inventory";
import {menu} from "./menu";
import {MoneyChestClass} from "./money.chest";

CustomEvent.registerClient('document:pos:get', async (player, id: number, type: 'doc' | "lic" | "item", ids: number, val: number) => {
    const user = player.user;
    if(!user) return;
    const cfg = DOCUMENT_GIVE_POSITIONS[id];
    if(!cfg) return;
    const target = User.get(val);

    const check = () => {
        if(!mp.players.exists(player)) return false;
        if(!target || !mp.players.exists(target)) {
            player.notify('ID указан не верно.', 'error');
            return false;
        }
        if(system.distanceToPos(player.position, target.position) > 5 || player.dimension != target.dimension) {
            player.notify('Игрок слишком далеко', 'error');
            return false;
        }
        return true
    }
    if(!check()) return;

    const tuser = target.user

    if(type === "lic"){
        if(!await menu.accept(target, `Оплатить $${system.numberFormat(cfg.license[ids].cost)} для получения лицензии ${LicenseName[cfg.license[ids].id]}`, 'small')) return;
        if(!check()) return;
        if (tuser.money < cfg.license[ids].cost) return player.notify('У вас недостаточно средств для оплаты', 'error');
        tuser.removeMoney(cfg.license[ids].cost, true, `Оплата лицензии ${LicenseName[cfg.license[ids].id]} в зоне ${cfg.name}`)
        tuser.giveLicense(cfg.license[ids].id, cfg.license[ids].days)
        const total = cfg.license[ids].cost
        const forplayer = ((total / 100) * DOCUMENT_GIVE_MONEY_FOR_PLAYER_PERCENT)
        user.addMoney(forplayer, true, `Выдача лицензии ${LicenseName[cfg.license[ids].id]} в зоне ${cfg.name}`)
        const chest = MoneyChestClass.getByPlayer(player);
        if(chest) chest.addMoney(player, total - forplayer, false)
        player.notify('Лицензия успешно выдана');
    } else if(type === 'item'){
        const item = cfg.items[ids]
        if(item.cost && item.cost > 0){
            if(!await menu.accept(target, `Оплатить $${system.numberFormat(item.cost)} для получения предмета ${getBaseItemNameById(item.id)}`, 'small')) return;
            if(!check()) return;
            if (tuser.money < item.cost) return player.notify('У вас недостаточно средств для оплаты', 'error');
            const give = tuser.tryGiveItem(item.id, true, true);
            player.notify(`Предмет ${give ? 'был успешно выдан' : 'не был выдан'}`, give ? 'success' : 'error');
            if(give) {
                tuser.removeMoney(item.cost, true, `Оплата предмета ${getBaseItemNameById(item.id)} в зоне ${cfg.name}`)
                const total = item.cost
                const forplayer = ((total / 100) * DOCUMENT_GIVE_MONEY_FOR_PLAYER_PERCENT)
                user.addMoney(forplayer, true, `Выдача предмета ${getBaseItemNameById(item.id)}`)
                const chest = MoneyChestClass.getByPlayer(player);
                if(chest) chest.addMoney(player, total - forplayer, false)
            }
        } else {
            const give = tuser.tryGiveItem(item.id, true, true);
            player.notify(`Предмет ${give ? 'был успешно выдан' : 'не был выдан'}`, give ? 'success' : 'error');
        }
    } else {
        if(!await menu.accept(target, `Оплатить $${system.numberFormat(cfg.documents[ids].cost)} для получения документа ${getDocumentName(cfg.documents[ids].id)}`, 'small')) return;
        if(!check()) return;
        if (tuser.money < cfg.documents[ids].cost) return player.notify('У вас недостаточно средств для оплаты', 'error');
        tuser.removeMoney(cfg.documents[ids].cost, true, `Оплата документа ${getDocumentName(cfg.documents[ids].id)} в зоне ${cfg.name}`)
        tuser.giveDocument(cfg.documents[ids].id, player);
        const total = cfg.documents[ids].cost
        const forplayer = ((total / 100) * DOCUMENT_GIVE_MONEY_FOR_PLAYER_PERCENT)
        user.addMoney(forplayer, true, `Выдача документа ${getDocumentName(cfg.documents[ids].id)} в зоне ${cfg.name}`)
        const chest = MoneyChestClass.getByPlayer(player);
        if(chest) chest.addMoney(player, total - forplayer, false)
        player.notify('Справка успешно выдана');
    }
})
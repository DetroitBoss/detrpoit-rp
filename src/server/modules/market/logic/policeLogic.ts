import {CustomEvent} from "../../custom.event";
import {getPlayerTent, getTentById} from "../TradeTent";
import {TENT_DESTROY_AFTER_CUFFS_SECONDS} from "../../../../shared/market/config";

CustomEvent.registerCef('market::callSeller', (player, tentId: number) => {
    const tent = getTentById(tentId)
    if (!tent) {
        return player.user.setGui(null);
    }

    tent.callSeller(player);
});

mp.events.add('playerCuffed', (targetPlayer: PlayerMp, isCuffed: boolean) => {
    if (!isCuffed || !targetPlayer.user.policeCuffed) {
        return;
    }

    const playerTent = getPlayerTent(targetPlayer);
    if (!playerTent) {
        return;
    }

    setTimeout(() => {
        if (!mp.players.exists(targetPlayer) || !targetPlayer.user || !playerTent.exists) {
            return;
        }

        if (!targetPlayer.user.cuffed || !targetPlayer.user.policeCuffed) {
            return;
        }

        playerTent.destroy(true);
        targetPlayer.notify('Аренда палатки завершена автоматически, так как вы были арестованы', 'warning');
    }, TENT_DESTROY_AFTER_CUFFS_SECONDS * 1000);
});

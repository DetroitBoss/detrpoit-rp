import {gui} from "../gui";
import {FACTION_ID} from "../../../shared/fractions";

const NEWS_COMMAND_MIN_RANK = 6;

gui.chat.registerCommand('w', (player, ...args) => {
    if (!player.user) return;

    if (player.user.fraction !== FACTION_ID.LIFEINVADER) return;
    if (player.user.rank < NEWS_COMMAND_MIN_RANK) {
        player.notify('Нет доступа', 'error');
        return;
    }

    const message = args.join(' ');
    mp.players.toArray()
        .forEach(p => p.outputChatBox(`!{FC5A03}Weazel News ${player.user.name} [${player.dbid}]: ${message}`));
});
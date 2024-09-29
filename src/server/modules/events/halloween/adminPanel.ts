import {menu} from "../../menu";
import {invokeHook} from "../../../../shared/hooks";
import {gui} from "../../gui";
import {weather} from "../../weather";

export const HALLOWEEN_MANAGE_MENU_HOOK = 'halloween-manage-menu';

export function openHalloweenManageMenu(player: PlayerMp) {
    const _menu = menu.new(player, 'Управление хэллоуином');
    invokeHook(HALLOWEEN_MANAGE_MENU_HOOK, player, _menu, () => openHalloweenManageMenu(player));

    _menu.newItem({
        name: 'Включить/выключить хельсинскую погоду',
        onpress: () => {
            weather.halloweenEnabled = !weather.halloweenEnabled;
            weather.setWeather(weather.halloweenEnabled ? 'HALLOWEEN' : 'EXTRASUNNY')
        }
    })

    _menu.open();
}

gui.chat.registerCommand('halloween', (player) => {
    if (!player.user || !player.user.isAdminNow(7)) {
        return;
    }

    openHalloweenManageMenu(player);
});

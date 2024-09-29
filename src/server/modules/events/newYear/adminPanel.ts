import {gui} from "../../gui";
import {menu} from "../../menu";
import {Presents} from "./presents";


export function adminPanel (Presents: Presents) {
    gui.chat.registerCommand('newyear', (player) => {
        if (!player.user || !player.user.isAdminNow(6)) return;

        const _menu = menu.new(player, 'Управление Новым Годом');

        _menu.newItem({
            name: "Включить/Выключить раздачу подарков",
            more: `${Presents.active ? '~g~Вкл.' : '~r~Выкл.'}`,
            onpress: () => {
                Presents.switcher(player);
            }
        })

        _menu.open();
    });
}

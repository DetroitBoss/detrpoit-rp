import {gui} from "../gui";
import {menu, MenuClass} from "../menu";
import {ISupplyWarItem, ISupplyWarCreate} from "../../../shared/supplyWar/config";
import {SupplyWar} from "./supplyWar";

let war: SupplyWar | null = null;

function openSupplyWarMenu(player: PlayerMp, item: ISupplyWarCreate) {
    const _menu = new MenuClass(player, 'Война за снабжение');

    if (war === null) {

        _menu.newItem({
            type: 'range',
            name: 'Кол-во машин для погрузки',
            rangeselect: [1, 100],
            listSelected: item.maxVehiclesLoad,
            onchange: (value) => {
                item.maxVehiclesLoad = value;
            }
        });

        _menu.newItem({
            name: 'Предметы',
            more: item.items ? item.items : '~r~Необходимо указать',
            onpress: async () => {
                const newItems = await menu.input(player, 'Предметы', item.items, 150, 'text');
                if (newItems) {
                    item.items = newItems;
                }

                openSupplyWarMenu(player, item);
            }
        });

        _menu.newItem({
            name: "Точка войны за снабжение",
            more: item.position && item.position.x ? "~g~Указано" : "~r~Можно указать",
            onpress: () => {
                if (item.position && item.position.x !== 0) {
                    item.position = new mp.Vector3(0, 0, 0)
                } else {
                    item.position = player.position;
                }

                openSupplyWarMenu(player, item);
            }
        })

        _menu.newItem({
            name: "~g~Создать",
            onpress: async () => {
                if (!item.maxVehiclesLoad || !item.items || !item.position || item.position.x === 0) {
                    player.notify('Необходимо указать все данные');
                    openSupplyWarMenu(player, item);
                    return;
                }


                try {
                    const splitItems = item.items.split(','),
                        items: ISupplyWarItem[] = []

                    splitItems.forEach(el => {
                        const split = el.split(':');

                        if (!split[0] || !split[1]) return;

                        items.push({
                            itemId: parseInt(split[0]),
                            count: parseInt(split[1])
                        })
                    })

                    war = new SupplyWar(item.position, item.maxVehiclesLoad, items);
                    player.notify('Война за снабжение начата', 'success');
                }
                catch (e) {
                    player.notify('Произошла ошибка в предметах', 'error');
                    console.log(`SupplyWar error (${player.user.id}): ${e}`);
                }

                _menu.close();
            }
        })
    } else {
        _menu.newItem({
            name: "~r~Остановить",
            onpress: async () => {
                if (!war) return player.notify('Произошла ошибка', 'error');
                war.destroy();
                war = null;
                _menu.close();
                player.notify('Война за снабжение остановлена', 'success');
            }
        })
    }

    _menu.open();
}

gui.chat.registerCommand('supplywar', (player) => {
    if (!player.user.isAdminNow(6)) return;

    const item: ISupplyWarCreate = {
        maxVehiclesLoad: 2
    }

    openSupplyWarMenu(player, item)
});
import {IBonus} from "./IBonus";
import {menu, MenuClass} from "../../menu";

interface MoneyBonusData {
    amount: number
}

export class MoneyBonus implements IBonus<MoneyBonusData> {
    activate(player: PlayerMp, promocodeName: string, data: MoneyBonusData): void {
        player.user.addMoney(data.amount, true, `Активация промокода ${promocodeName.toUpperCase()}`);
    }

    addItemsToCreateMenu(player: PlayerMp, _menu: MenuClass, data: MoneyBonusData, updateMenu: () => void): void {
        if (!data.amount) {
            data.amount = 0
        }

        _menu.newItem({
            name: 'Количество',
            more: data.amount,
            onpress: async () => {
                const amount = await menu.input(player, 'Введите количество', 0, 7, 'int');
                if (amount && !isNaN(amount)) {
                    data.amount = amount;
                }

                updateMenu();
            }
        });
    }
}
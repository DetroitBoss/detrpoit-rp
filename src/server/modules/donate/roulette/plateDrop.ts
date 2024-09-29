import {DropBase} from "./dropBase";
import {PlateDropData} from "../../../../shared/donate/donate-roulette/Drops/plateDrop";
import {menu} from "../../menu";

export class PlateDrop extends DropBase {
    constructor(public readonly data: PlateDropData) {
        super(data.dropId);
    }

    protected onDropActivated(player: PlayerMp): boolean {
        let m = menu.new(player, 'Выбор машины', 'Список');
        if (player.user.myVehicles.length === 0) {
            player.notify('У вас нет транспорта на который можно установить номер');
            return false;
        }
        
        player.user.myVehicles.forEach(v => {
            m.newItem({
                name: `${v.name} (${v.number})`,
                onpress: () => {
                    v.setNumber(this.data.plateNumber)
                }
            })
        });
        
        m.open();
        
        return true;
    };
}
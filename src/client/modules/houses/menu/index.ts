import {CustomEvent} from "../../custom.event";
import {furniture} from "../furniture";
import {user} from "../../user";
import {gui} from "../../gui";

class HomeMenu {
    constructor() {
        CustomEvent.registerServer('homeMenu:open', this.openHandler)
    }

    openHandler = (
        houseId: number,
        furnitureArray: string,
        interiorId: number,
        cash: number,
        bank: number,
        coins: number
    ) => {
        if (furniture.currentHouseId !== houseId)
            return user.notify('Необходимо находиться в своем доме', 'error');
        gui.setGui('interiorControl');
        CustomEvent.triggerCef('homeMenu:furniture', furnitureArray);
        CustomEvent.triggerCef('homeMenu:interior', interiorId);
        CustomEvent.triggerCef('homeMenu:currencies', cash, bank, coins);
    }


}

new HomeMenu();
import { CustomEvent } from "./custom.event";
import { VENDOR_MACHINES } from "../../shared/vendor.mashines";
import { inventory } from "./inventory";
import { OWNER_TYPES } from "../../shared/inventory";

CustomEvent.registerClient('vendor:buy', (player, model: number) => {
    const vendor = VENDOR_MACHINES.find(q => q.model === model);
    if (!vendor) return false;
    const user = player.user;
    if(!user) return false
    if(user.money < vendor.cost){
        player.notify("У вас недостаточно средств", "error")
        return false;
    }
    user.removeMoney(vendor.cost, true, `Использовал автомат ${vendor.model} ${vendor.item_id}`);
    inventory.createItem({
        owner_type: OWNER_TYPES.PLAYER,
        owner_id: user.id,
        item_id: vendor.item_id
    })
    return true
})
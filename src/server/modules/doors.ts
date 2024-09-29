import { DOORS_LIST } from "../../shared/doors";
import { CustomEvent } from "./custom.event";
import {User} from "./user";

/** Текущий статус двери */
let doorsStatus = new Map<number, boolean>();
DOORS_LIST.map((item, index) => {
    doorsStatus.set(index, !item.defaultOpened)
})

mp.events.add("_userLoggedIn", (user: User) => {
    const player = user.player;
    CustomEvent.triggerClient(player, "doors:data", [...doorsStatus])
})

export const getDoorStatus = (id: number) => {
    return doorsStatus.get(id);
}
export const getDoorData = (id: number) => {
    return DOORS_LIST[id]
}

CustomEvent.registerClient('door:status', (player, id: number, status: boolean, ignoreAccess: boolean) => {
    const user = player.user;
    if(!user) return;
    const data = getDoorData(id);
    if (!ignoreAccess){
        if (!user.isAdminNow() && data.fraction !== user.fraction) return player.notify("У вас нет ключей", "error");
    }
    doorsStatus.set(id, status);
    CustomEvent.triggerClients('doors:data', [[id, status]])
})
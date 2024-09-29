import {CustomEvent} from "../custom.event";
import {user} from "../user";
import {TextTimerBar} from "../bars/classes/TextTimerBar";

let loadTime: number = -1;
let timeBar: TextTimerBar | null;
let veh: number | null;

CustomEvent.registerServer('supplyWar:startLoading', (vehId: number) => {
    if (loadTime !== -1) return user.notify("Погрузка уже начата");
    loadTime = 10;
    timeBar = new TextTimerBar(`Грузим машину`, loadTime.toString());
    veh = vehId;
    user.notify("Погрузка начата, ожидайте на месте", "info");
});

setInterval(() => {
    if (loadTime === -1) return;

    if (loadTime > 0) {
        loadTime -= 1;
        timeBar.text = loadTime.toString();
    }

    if (loadTime === 0) {
        loadTime = -1;
        timeBar.destroy();
        timeBar = null;
        mp.events.callRemote('supplyWar:finishLoading', veh);
        veh = null;
    }

}, 1000);


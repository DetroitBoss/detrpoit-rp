import {CustomEvent} from "./custom.event";
import {user} from "./user";
import {system} from "./system";
import {GR6_GPS_TASK_NAME} from "../../shared/gr6";

let blips = new Map<number, BlipMp>()

const name = GR6_GPS_TASK_NAME;

const clearBlips = () => {
    blips.forEach(item => {
        if (mp.blips.exists(item)) item.destroy();
    })
    blips = new Map();
}

CustomEvent.registerServer('gr6:tasks:clear', () => {
    user.clearWaypointHistoryByName(name);
    clearBlips();
})
CustomEvent.registerServer('gr6:tasks:setClear', (index: number) => {
    user.clearWaypointHistoryByName(`${name} #${index}`);
    const item = blips.get(index);
    if (item && mp.blips.exists(item)) item.destroy();
    blips.delete(index);
})
CustomEvent.registerServer('gr6:tasks', async (pos: { x: number, y: number, z: number, id: number }[]) => {
    user.clearWaypointHistoryByName(name);
    clearBlips();
    await system.sleep(500);
    if (pos.length === 0) return user.notify("К сожалению сейчас нет заданий. Подождите", "error");
    user.notify(`Вы получили ${pos.length} заданий. Адреса доступны в вашем навигаторе. После сбора всех точек возвращайтесь сюда и сдавайте средства`)
    pos.map(item => {
        blips.set(item.id, system.createBlip(1, 1, new mp.Vector3(item.x, item.y, item.z), `Задание Gruppe Sechs #${item.id}`, 0, false))
        user.addWaypointHistory(item.x, item.y, item.z, `${name} #${item.id}`);
    })
})
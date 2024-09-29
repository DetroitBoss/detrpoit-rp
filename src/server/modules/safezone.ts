import {system} from "./system";
import {CustomEvent} from "./custom.event";
import {safeZones} from "../../shared/savezone";
import {gui} from "./gui";
import {NoSQLbase} from "./nosql";
import {User} from "./user";

export let disabledSafeZones = new NoSQLbase<number>('disabledSafeZones');

/** Переклюбчить состояние зеленой зоны */
const toggleSafeZone = (player: PlayerMp): void => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission("admin:safezones")) return;

    const safeZone = safeZones.find(zone =>
        system.distanceToPos(player.position, {x: zone.x, y: zone.y, z: zone.z}) <= zone.r);
    if (!safeZone) return player.notify('Вы не находитесь в зеленой зоне', 'error');

    const index: number = safeZones.indexOf(safeZone);
    const disabled: boolean = disabledSafeZones.data.includes(index);

    if (!disabled)
        disabledSafeZones.insert(index)
    else disabledSafeZones.data.splice(disabledSafeZones.data.indexOf(index), 1)

    disabledSafeZones.save();
    CustomEvent.triggerClients('safezone:set', index, !disabled)
}

/**( Находится ли игрок в активной зеленой зоне */
export const isPlayerInActiveSafeZone = (player: PlayerMp): boolean => {
    const safeZone = safeZones.find(zone =>
        system.distanceToPos(player.position, {x: zone.x, y: zone.y, z: zone.z}) <= zone.r);
    
    const index: number = safeZones.indexOf(safeZone);
    return safeZone && !disabledSafeZones.data.includes(index);
}

gui.chat.registerCommand("safezone", toggleSafeZone)

mp.events.add('_userLoggedIn', (user: User) => {
    const player = user.player;
    CustomEvent.triggerClient(player, 'safezone:init', disabledSafeZones.data);
})

CustomEvent.registerClient('admin:safezone', toggleSafeZone)

// вынести если работает
mp.events.add("__ragemp_cheat_detected", (player: PlayerMp, cheatcode: string) => {
    system.debug.info(`cheatcode1 ${cheatcode} detected`)
});

mp.events.add("_ragemp_cheat_detected", (player: PlayerMp, cheatcode: string) => {
    system.debug.info(`cheatcode2 ${cheatcode} detected`)
});

mp.events.add("ragemp_cheat_detected", (player: PlayerMp, cheatcode: string) => {
    system.debug.info(`cheatcode3 ${cheatcode} detected`)
});
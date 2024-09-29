import {REDZONE_POSITIONS, safeZones} from "../../shared/savezone";
import {system} from "./system";
import {CustomEvent} from "./custom.event";
import {user} from "./user";
import {disableControlGroup} from "./controls";
import {inConstruction} from "./construction";
import {CASINO_INTERIORS_IDS_IN} from "../../shared/casino/main";
import {fireExtinguisherHash} from "./jobs/firefighter/extinguishing";
import {testDriveMode} from "./businesses/autosalon";

export let inSaveZone = false;
let inRedZone = false;

export const blockShootSaveZoneStatus = () => {
    let {x, y, z} = mp.players.local.position;
    const inCasino = CASINO_INTERIORS_IDS_IN.includes(mp.game.interior.getInteriorAtCoords(x, y, z));
    if (inCasino) mp.game.controls.disableControlAction(0, 22, true); // disable jump

    const currentWeapon = mp.game.invoke('0x0A6DB4965674D243', mp.players.local.handle)
    return (inSaveZone && ((!user.is_police && user.fraction != 1) || inCasino) && currentWeapon !== fireExtinguisherHash);
}

setInterval(() => {
    if (!mp.players.local.vehicle) return;
    const maxSpeed = mp.players.local.vehicle.getVariable('maxSpeed') ?
        mp.players.local.vehicle.getVariable('maxSpeed') / 3.6 : 999;

    let {x, y, z} = mp.players.local.position;
    const zone = safeZones.find(zone => system.distanceToPos(mp.players.local.position, {
            x: zone.x,
            y: zone.y,
            z: zone.z
        }) <= zone.r),
        inZone = inConstruction || user.inDriftMap
            || CASINO_INTERIORS_IDS_IN.includes(mp.game.interior.getInteriorAtCoords(x, y, z))
            || (zone && !zone.disabled)
            && !mp.players.local.dimension;

    if (inZone && zone && !zone.disableLockSpeed) {
        mp.players.local.vehicle.setMaxSpeed(11);
    } else {
        if (!testDriveMode) mp.players.local.vehicle.setMaxSpeed(maxSpeed);
    }
}, 300)

setInterval(() => {
    if (!user.login) return;
    let {x, y, z} = mp.players.local.position;
    const zone = safeZones.find(zone => system.distanceToPos(mp.players.local.position, {
        x: zone.x,
        y: zone.y,
        z: zone.z
    }) <= zone.r)
    const inZone = inConstruction || user.inDriftMap
        || CASINO_INTERIORS_IDS_IN.includes(mp.game.interior.getInteriorAtCoords(x, y, z))
        || (zone && !zone.disabled)
        && !mp.players.local.dimension;
    if (inSaveZone !== inZone) CustomEvent.triggerCef('savezone:set', inZone);
    inSaveZone = inZone;
    const inZone2 = !!REDZONE_POSITIONS.find(zone => system.distanceToPos(mp.players.local.position, zone) <= zone.r) && !mp.players.local.dimension;
    if (inRedZone !== inZone2) CustomEvent.triggerCef('redzone:set', inZone);
    inRedZone = inZone2;
}, 1000)


mp.events.add('render', () => {
    if (blockShootSaveZoneStatus()) disableControlGroup.saveZone()
    if (user.cuffed || user.walkingWithObject) disableControlGroup.handcuff()
})

CustomEvent.registerServer('safezone:set', (index, toggle) => {
    const safeZone = safeZones[index];
    safeZone.disabled = toggle;
})

CustomEvent.registerServer('safezone:init', (disabledZones: number[]) => {
    disabledZones.forEach(zone => {
        safeZones[zone].disabled = true
    })
})
import {CustomEvent} from "../custom.event";
import {HudUpdateDTO, RegistrationDTO} from "../../../shared/snowWar/dtos";
import {guiNames} from "../../../shared/gui";
import {SNOW_WAR_WEAPON_HASH} from "../../../shared/snowWar/main.config";
import {system} from "../system";

mp.events.add('snowwar:update:registration', (data: RegistrationDTO) => {
    CustomEvent.triggerCef('snowwar:registration:update', data);
});

mp.events.add('snowwar:update:hud', (data: HudUpdateDTO) => {
    CustomEvent.triggerCef('snowwar:hud:update', data);
});

mp.events.add('gui:menuClosed', (closedGui: guiNames) => {
    if (closedGui !== 'snowWar') return;

    CustomEvent.triggerServer('snowwar:registrationClose');
});

interface SnowballTarget {
    entity: EntityMp,
    time: number,
    position: Vector3Mp
}

const targets: SnowballTarget[] = [];
let snowWarActive: boolean = false;

CustomEvent.registerServer('snowwar:activate', (toggle: boolean) => {
    snowWarActive = toggle;
});

mp.events.add('playerWeaponShot', (targetPosition, targetEntity) => {
    if (!snowWarActive) return;
    if (!targetEntity || targetEntity.type !== 'player') return;
    if (targetEntity.remoteId === mp.players.local.remoteId) return;
    //CustomEvent.triggerServer('snowwar:outgoingDamage', targetEntity);

    targets.push({entity: targetEntity, time: system.timestamp, position: mp.players.local.position})
});

mp.events.add('render', () => {
    if (!snowWarActive) return;

    targets.forEach((el, key) => {
        if (system.timestamp - el.time > 10) {
            targets.splice(key, 1);
            return;
        }
        if (el.entity.handle === 0) return;
        // const toggle = mp.game.invoke(
        //     '0x82FDE6A57EE4EE44',
        //     el.entity.handle,
        //     SNOW_WAR_WEAPON_HASH,
        //     0.01,
        //     el.position,
        //     mp.players.local.handle,
        //     true
        // );
        //
        // if (toggle) {
        //     CustomEvent.triggerServer('snowwar:outgoingDamage', el.entity.remoteId);
        //     targets.splice(key, 1);
        // }
    })
});


import {user} from "./user";
import {DAMAGE_CONTROLLER_CONFIGS, DAMAGE_HEAD_BONE_INDEX} from "../../shared/damageController";
import {CustomEvent} from "./custom.event";
import { gui } from './gui'
import { system } from './system'
import {inSaveZone} from "./savezone";
import {hitmarker} from "./hitMarker";
const player = mp.players.local;

const DAMAGE_ENABLE_FROM_LEVEL = 2;

let lastAnticheatReportTime = 0

mp.events.add('incomingDamage', (sourceEntity, sourcePlayer, targetEntity, weapon, boneIndex, damage) => {
    if(!sourcePlayer || !sourceEntity) return;
    if(!targetEntity) return;
    if(targetEntity.type !== 'player') return;
    if(targetEntity.type === 'player' && targetEntity.remoteId == player.remoteId && user.isAdminNow()) return;
    
    if (targetEntity.remoteId == player.remoteId && Number(sourcePlayer.getVariable('level')) < DAMAGE_ENABLE_FROM_LEVEL) {
        return true;
    }

    if (targetEntity.remoteId == player.remoteId && inSaveZone) {
        CustomEvent.triggerServer('srv:log', `${weapon} & ${mp.game.joaat('weapon_stungun')} | ${sourcePlayer.getVariable('fraction')}`)
        if (weapon !== mp.game.joaat('weapon_stungun') || ![1,2,3,4,6].includes(sourcePlayer.getVariable('fraction')))
            return true;
    }

    if (targetEntity.remoteId == player.remoteId && player.getVariable('inZombiesDemolition')) {
        return true;
    }

    let multipler = 1;

    const configs = DAMAGE_CONTROLLER_CONFIGS.filter(z => (
        (!z.weapon || z.weapon === weapon) &&
        (!z.headShot || boneIndex === DAMAGE_HEAD_BONE_INDEX)
    ))

    let maxDamage = Math.min(9999999, ...configs.filter(q => q.maxDamage).map(q => q.maxDamage));

    configs.map(item => {
        if(!maxDamage || item.maxDamage < maxDamage) maxDamage = item.maxDamage
        multipler *= item.damageMultipler
    })
    let resDamage = damage * multipler;
    resDamage = Math.min(resDamage, maxDamage);

    if (targetEntity.remoteId === player.remoteId) {
        CustomEvent.triggerServer('damage:updateCombatBlock');
    }

    const damageResist = targetEntity.getVariable('damageResist');
    if (damageResist != null) {
        resDamage -= resDamage * damageResist;
    }


    if(resDamage !== damage){
        resDamage = Math.trunc(resDamage);
        if(targetEntity.getHealth() + targetEntity.getArmour() - resDamage > 0){
            targetEntity.applyDamageTo(resDamage, true)
            CustomEvent.triggerServer('hitmarker:damage', sourceEntity.remoteId, resDamage, targetEntity.getCoords(false));
            hitmarker.addPersonal(resDamage);
            return true;
        }
    } else {
        CustomEvent.triggerServer('hitmarker:damage', sourceEntity.remoteId, damage, targetEntity.getCoords(false))
        hitmarker.addPersonal(damage);
    }

    if (damage > 220 && system.timestamp - lastAnticheatReportTime > 30) {
        CustomEvent.triggerServer('anticheat:detect', "weapon", `Подозрение на увеличенный урон. Нанесено ${resDamage}, native: ${damage}`)
        lastAnticheatReportTime = system.timestamp
    }
})

import {isPedMy} from "../../../../peds";
import {CustomEvent} from "../../../../custom.event";
import {systemUtil} from "../../../../../../shared/system";
import {ZOMBIES_MOVEMENT_CLIPSET} from "./zombiesDemolition";

const PLAYER_GROUP = 'playersTeam';
const ZOMBIE_GROUP = 'zombiesGroup';
const PLAYER_GROUP_HASH = mp.game.joaat('playersTeam');
const ZOMBIE_GROUP_HASH = mp.game.joaat('zombiesGroup');

mp.events.add('playerReady', () => {
    mp.game.ped.addRelationshipGroup(PLAYER_GROUP, PLAYER_GROUP_HASH);
    mp.game.ped.addRelationshipGroup(ZOMBIE_GROUP, ZOMBIE_GROUP_HASH);

    mp.game.ped.setRelationshipBetweenGroups(0, ZOMBIE_GROUP_HASH, PLAYER_GROUP_HASH);
    mp.game.ped.setRelationshipBetweenGroups(2, PLAYER_GROUP_HASH, ZOMBIE_GROUP_HASH);
});

mp.events.add('playerWeaponShot', (targetPosition: Vector3Mp, targetEntity: EntityMp) => {
    try {
        if (mp.players.local.dimension === 0) {
            return;
        }

        mp.peds.toArray()
            .forEach(ped => {
                if (!ped || !ped.handle || !ped.getVariable('halloweenZombie')) {
                    return;
                }

                if (ped.isDead()) {
                    return;
                }

                if (mp.game.player.isFreeAimingAtEntity(ped.handle)) {
                    CustomEvent.triggerServer('halloween:damageZombie', ped.remoteId);
                }
            });
    } catch (e) { }
});

CustomEvent.registerServer('halloween:killZombie', (pedRemoteId: number) => {
    try {
        mp.peds.toArray()
            .forEach(ped => {
                if (!ped || !mp.peds.exists(ped) || ped.remoteId !== pedRemoteId) {
                    return;
                }

                ped.applyDamageTo(200, true);
            });
    } catch (e) { }
});

function startPedControlling(ped: PedMp) {
    try {
        if (!verifyZombiePed(ped)) {
            return;
        }

        applyZombiePedAttributes(ped);
        applyZombieRelations(ped);

        const distanceToAttack = 2;

        const interval = setInterval(() => {
            try {
                if (mp.players.local.dimension === 0) {
                    clearInterval(interval);
                    return;
                }

                if (!ped || !ped.handle || ped.isDead()) {
                    clearInterval(interval);
                    return;
                }

                const target = getNearestPlayer(ped.getCoordsAutoAlive());
                if (!target) {
                    return;
                }

                const tPos = target.position;
                if (systemUtil.distanceToPos(ped.getCoordsAutoAlive(), tPos) < distanceToAttack) {
                    mp.game.streaming.requestAnimDict('misscarsteal4@actor');
                    ped.taskPlayAnim("misscarsteal4@actor", "stumble", 1.5, 1.0, 500, 9, 1.0, false, false, false)
                    CustomEvent.triggerServer('halloween:zombieDamage', target.remoteId);
                } else {
                    ped.taskGoToCoordAnyMeans(tPos.x, tPos.y, tPos.z, 4.0, 0.0, true, 1.0, 0);
                }
            } catch (e) {
                return;
            }
        }, 2000);
    } catch (e) { }
}

function applyZombiePedAttributes(ped: PedMp) {
    ped.setInvincible(false);
    ped.setCanBeDamaged(false);
    ped.freezePosition(false);

    ped.setCanRagdoll(true);
    ped.setCanRagdollFromPlayerImpact(false);
    mp.game.invoke('0x26695EC767728D84', ped.handle, 1);

    ped.setCombatAbility(0);
    ped.setCombatMovement(0);
    ped.setCombatRange(0);
    // setPedIsDrunk
    mp.game.invoke('0x95D2D383D5396B8A', ped.handle, true);
    ped.setBlockingOfNonTemporaryEvents(true);

    // Аттрибуты, отвечающие за то, что пед не убежит от игрока
    for (let i = 0; i < 64; i+= 2) {
        ped.setFleeAttributes(i, false);
    }
    ped.setFleeAttributes(0, false);

    ped.setMovementClipset(ZOMBIES_MOVEMENT_CLIPSET, 1.0);
}

function applyZombieRelations(ped: PedMp) {
    ped.setRelationshipGroupHash(ZOMBIE_GROUP_HASH);

    mp.players.forEach(player => {
        if (player.dimension !== mp.players.local.dimension) {
            return;
        }

        player.setRelationshipGroupHash(PLAYER_GROUP_HASH);
    });
}

function getNearestPlayer(position: Vector3Mp) {
    return mp.players.toArray()
        .filter(player => player?.handle && player.dimension === mp.players.local.dimension)
        .map(player => ({
            player: player,
            dist: systemUtil.distanceToPos(position, player.position)
        }))
        .sort((a, b) => a.dist - b.dist)
        [0]?.player;
}

function verifyZombiePed(ped: PedMp): boolean {
    if (ped?.type !== 'ped')
        return false;

    if (!ped.handle)
        return false;

    if (!ped.getVariable('halloweenZombie')) {
        return false;
    }

    if (!isPedMy(ped)) {
        return false;
    }

    return true;
}


mp.events.add('entityControllerChange', (ped: PedMp, controller: PlayerMp) => {
    if (mp.players.local.dimension === 0) {
        return;
    }

    startPedControlling(ped);
});

mp.events.add('entityStreamIn', (ped: PedMp) => {
    startPedControlling(ped);
});
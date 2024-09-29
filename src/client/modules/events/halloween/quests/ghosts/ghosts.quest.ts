import {CustomEvent} from "../../../../custom.event";
import {
    GHOST_APPEARS_POSITIONS, GHOST_DAMAGE_PER_SECOND, GHOST_HEALTH, GHOST_MODEL,
    GHOSTBUSTERS_BACKPACK_MODEL,
    HALLOWEEN_DESTROY_GHOST_EVENT, HALLOWEEN_END_GHOSTS_DESTROY_EVENT,
    HALLOWEEN_START_GHOSTS_DESTROY_EVENT
} from "../../../../../../shared/events/halloween.config";
import {systemUtil} from "../../../../../../shared/system";
import {Ghost} from "./ghost";
import {Raycast} from "../../../../raycast";
import {FPS} from "../../../../fps";
import {clearAllWeapons, giveWeaponLocally} from "../../../../user";
import {disableHalloweenWeather, enableHalloweenWeather} from "../common";

const GHOST_RADIUS = 2.5;
const gameplayCamera = mp.cameras.new('gameplay');

let isQuestEnabled = false;
let ghost: Ghost = null;
let questSuit: {
    backpackObject: ObjectMp,
} = null;
let last_health = GHOST_HEALTH;

setInterval(() => {
    if (!isQuestEnabled || ghost !== null) {
        return;
    }

    createGhost();
}, 5000);

CustomEvent.registerServer(HALLOWEEN_START_GHOSTS_DESTROY_EVENT, () => {
    if (mp.players.local.isInAnyVehicle(false)) {
        mp.players.local.taskLeaveVehicle(mp.players.local.vehicle.handle,256);

        setTimeout(() => {
            startQuest();
        }, 2000);
    } else {
        startQuest();
    }
});

function startQuest() {
    isQuestEnabled = true;

    enableHalloweenWeather(20);

    givePlayerQuestSuit();
    createGhost();
}

async function givePlayerQuestSuit() {
    const playerPos = mp.players.local.position;

    const objectH = mp.game.object.createObject(mp.game.joaat(GHOSTBUSTERS_BACKPACK_MODEL), playerPos.x, playerPos.y, playerPos.z - 10, true, true, true);
    const object = mp.objects.newWeak(objectH);

    while (!object.handle) {
        await mp.game.waitAsync(10);
    }

    const boneIndex = mp.players.local.getBoneIndex(64729);
    object.attachTo(mp.players.local.handle, boneIndex, 0.035, -0.190, 0.260, 356, 156, 173,
        false, false, false, false, 2, true);

    questSuit = {
        backpackObject: object,
    };

    giveWeaponLocally('weapon_rayminigun', 0, true);
}
function createGhost() {
    const position = systemUtil.randomArrayElement(GHOST_APPEARS_POSITIONS);
    ghost = new Ghost(last_health, GHOST_MODEL, position, (healthLeft: number) => {
        last_health = healthLeft > 0 ? healthLeft : GHOST_HEALTH;
        ghost = null;
    });
    const targetPosition = systemUtil.randomArrayElement(GHOST_APPEARS_POSITIONS);

    ghost.slide(targetPosition[0]);
}

CustomEvent.registerServer(HALLOWEEN_END_GHOSTS_DESTROY_EVENT, () => {
    isQuestEnabled = false;

    if (questSuit) {
        questSuit.backpackObject.destroy();
    }

    questSuit = null;

    if (ghost && ghost.alive) {
        ghost.destroy();
        ghost = null;
    }

    clearAllWeapons();
    disableHalloweenWeather(20);
});

mp.events.add('render', () => {
    if (!questSuit) {
        return;
    }

    // INPUT_ATTACK
    mp.game.controls.disableControlAction(0, 24, true);

    // INPUT_AIM && INPUT_ATTACK
    if (mp.game.controls.isControlPressed(0, 25) &&
        mp.game.controls.isDisabledControlPressed(0, 24)) {
        tryDamageGhost();
    }
});

function tryDamageGhost() {
    if (!ghost || !ghost.alive) {
        return;
    }

    if (isAimingOnGhost()) {
        const isDead = ghost.applyDamage(GHOST_DAMAGE_PER_SECOND / FPS.fps);
        if (isDead) {
            ghost.destroy();
            CustomEvent.triggerServer(HALLOWEEN_DESTROY_GHOST_EVENT);
        }
    }
}
function isAimingOnGhost(): boolean {
    const ghostPos = ghost.position;
    if (!ghostPos) {
        return false;
    }

    const lookAtPosition = Raycast.getPositionLookAt();
    const cameraPosition = gameplayCamera.getCoord();

    const raycastResult = mp.raycasting.testPointToPoint(cameraPosition, lookAtPosition);
    if (!raycastResult) {
        return false;
    }

    const surfacePosition = raycastResult.position;

    if (surfacePosition) {
        playRailgunFx(surfacePosition);
    }

    const lineDist = systemUtil.distanceToPos(cameraPosition, surfacePosition);
    let t = (
        (ghostPos.x - cameraPosition.x) * (surfacePosition.x - cameraPosition.x) +
        (ghostPos.y - cameraPosition.y) * (surfacePosition.y - cameraPosition.y) +
        (ghostPos.z - cameraPosition.z) * (surfacePosition.z - cameraPosition.z)
    ) / lineDist;
    t = Math.max(0, Math.min(1, t));

    const dist = systemUtil.distanceToPos(ghostPos, {
        x: cameraPosition.x + t * (surfacePosition.x - cameraPosition.x),
        y: cameraPosition.y + t * (surfacePosition.y - cameraPosition.y),
        z: cameraPosition.z + t * (surfacePosition.z - cameraPosition.z)
    });

    return dist <= GHOST_RADIUS;
}

let ptfxHandle: number = null;
function playRailgunFx(position: Vector3Mp) {
    if (!mp.game.streaming.hasNamedPtfxAssetLoaded('weap_xs_weapons')) {
        mp.game.streaming.requestNamedPtfxAsset('weap_xs_weapons');
    }

    const camRotation = gameplayCamera.getRot(4);

    if (ptfxHandle) {
        return;
    }

    mp.game.graphics.setPtfxAssetNextCall('weap_xs_weapons');
    ptfxHandle = mp.game.graphics.startParticleFxLoopedAtCoord('proj_xs_sr_raygun_trail',
        position.x, position.y, position.z,
        -camRotation.x, camRotation.y, camRotation.z + 90,
        1, false, false, false, false
    );

    setTimeout(() => {
        mp.game.graphics.removeParticleFx(ptfxHandle, true);
        ptfxHandle = null;
    }, 50);
}

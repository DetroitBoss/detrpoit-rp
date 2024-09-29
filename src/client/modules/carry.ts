import {CARRY_LIST, CarrySharedData} from "../../shared/carry";
import {disableControlGroup, enableControlGroup} from "./controls";
import {user} from "./user";
import {gui} from "./gui";
import {CustomEvent} from "./custom.event";
import {asyncLoadDictPlayAnim} from "./anim";

const carryMap = new Map<PlayerMp, CarrySharedData>();

// TODO: Исправить заход в интерьеры

export function isPlayerCarryOrCarried(): boolean {
    return carryMap.has(mp.players.local)
        || [...carryMap.values()].some(carryData => carryData.targetId === mp.players.local.remoteId)
}

mp.events.addDataHandler('carry:target', (entity, value) => {
    if (!entity?.handle) {
        return;
    }
    handleEntityCarry(entity);
});
mp.events.add('entityStreamIn', (entity) => {
    setTimeout(() => {
        if (!entity?.handle) {
            return;
        }

        handleEntityCarry(entity);
        handleCarriedPlayer(entity);
    }, 1000);
});
mp.events.add('entityStreamOut', (entity) => {
    if (entity.type != 'player')
        return

    let isCarriedPlayerQuit = false
    
    if (carryMap.has(mp.players.local) && [...carryMap.values()].some(carryData => carryData.targetId === entity.remoteId)) {
        isCarriedPlayerQuit = true
        carryMap.delete(mp.players.local)
    }
    if (carryMap.has(entity) && [...carryMap.values()].some(carryData => carryData.targetId === mp.players.local.remoteId)) {
        carryMap.delete(entity)
        isCarriedPlayerQuit = true
    }
    
    if (!isCarriedPlayerQuit)
        return
    
    enableControls()
    
    mp.players.local.clearTasksImmediately()
    mp.players.local.detach(true, false)
    
    entity.clearTasksImmediately()
    entity.detach(true, false);
});

mp.events.add('teleportEnd', () => {
    setTimeout(() => {
        handleEntityCarry(mp.players.local);
        handleCarriedPlayer(mp.players.local);
    }, 1000);
});

function handleCarriedPlayer(player: PlayerMp) {
    const carriedInfo = [...carryMap.entries()]
        .find(entry => entry[1].targetId === player.remoteId);

    if (!carriedInfo) {
        return;
    }

    handleEntityCarry(carriedInfo[0]);
}

function handleEntityCarry(entity: PlayerMp) {
    if (!entity?.handle)
        return
    
    const carryDataJson = entity.getVariable('carry:target');

    if (carryDataJson) {
        const carryData: CarrySharedData = JSON.parse(carryDataJson);
        addCarry(entity, carryData);
    } else {
        removeCarry(entity);
    }
}

async function addCarry(player: PlayerMp, carryData: CarrySharedData) {
    carryMap.set(player, carryData);

    const carryCfg = CARRY_LIST[carryData.carryCfgIdx];

    await asyncLoadDictPlayAnim(player,
        carryCfg.carryAnimation.dictionary, carryCfg.carryAnimation.name,
        8.0, 1.0, -1, 49, 0.0, true, true, true
    );

    if (mp.players.local.remoteId === player.remoteId) {
        user.showHelp('Перестать тащить [F10]');
        disableControls(true);
    }

    if (mp.players.local.remoteId === carryData.targetId) {
        disableControls(false);
    }

    const targetPlayer = mp.players.atRemoteId(carryData.targetId)
    if (!targetPlayer?.handle) {
        return;
    }

    await asyncLoadDictPlayAnim(targetPlayer,
        carryCfg.carriedAnimation.dictionary, carryCfg.carriedAnimation.name,
        8.0, 1.0, -1, 33, 0.0, true, true, true
    );

    targetPlayer.attachTo(player.handle, carryCfg.carriedAttach.boneIndex,
        carryCfg.carriedAttach.posOffset.x, carryCfg.carriedAttach.posOffset.y, carryCfg.carriedAttach.posOffset.z,
        carryCfg.carriedAttach.rotation.x, carryCfg.carriedAttach.rotation.y, carryCfg.carriedAttach.rotation.z,
        false, false, false, false, 2, false
    );
}

function removeCarry(player: PlayerMp) {
    const carryData = carryMap.get(player);
    if (!carryData) {
        return;
    }

    carryMap.delete(player);

    player.clearTasks();

    if (mp.players.local.remoteId === player.remoteId) {
        user.showHelp(null);
    }

    if (mp.players.local.remoteId === player.remoteId ||
        mp.players.local.remoteId === carryData.targetId
    ) {
        enableControls();
    }

    const targetPlayer = mp.players.atRemoteId(carryData.targetId);
    if (!targetPlayer?.handle) {
        return;
    }

    targetPlayer.clearTasks();
    targetPlayer.detach(true, false);
}

let isControlsDisabled = false;
let isCarry = false;
function disableControls(carry: boolean) {
    isControlsDisabled = true;
    isCarry = carry;
}

function enableControls() {
    isControlsDisabled = false;
}

// F10
mp.keys.bind(121, false, () => {
    if (gui.currentGui) {
        return;
    }

    if (!carryMap.has(mp.players.local)) {
        return;
    }

    CustomEvent.triggerServer('carry:endCarry');
});

mp.events.add('render', () => {
    if (isControlsDisabled) {
        disableControlGroup.baseKeyDisable();

        if (isCarry) {
            enableControlGroup.move();
        }
    }
});

mp.events.add('playerStartedEnterVehicle', (handle: number) => {
    if (!handle)
        return

    if (!isPlayerCarryOrCarried())
        return
    
    removeCarry(mp.players.local)
})

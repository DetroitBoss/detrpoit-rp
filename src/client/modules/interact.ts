import {gui} from "./gui";
import {user} from "./user";
import {system} from "./system";
import {VENDOR_MACHINES} from "../../shared/vendor.mashines";
import {CustomEvent} from "./custom.event";
import {getBaseItemNameById} from "../../shared/inventory";
import {ATM_PROPS} from "../../shared/atm";
import {CASH_MACHINE_GRAB_SECOND, CASH_MACHINES_LIST} from "../../shared/cash.machines";
import {doorEventHave} from "./doors";
import {inFishPosStatus} from "./fish";
import {FISH_HELP_TEXT} from "../../shared/fish";
import {getKeyName} from "../../shared/hotkeys";
import {currentColshape} from "./checkpoints";
import {playAnimationWithResult} from "./anim";
import {inDiceGame, nearestDiceTable} from "./casino/dice";
import {getNearestRouletteTable, inCasinoRoulette} from "./casino/roulette";
import {getNearestSlotsMachine, inSlotGame} from "./casino/slots";
import {Raycast} from "./raycast";
import {invokeHook} from "../../shared/hooks";
import {systemUtil} from "../../shared/system";

export const RAYCAST_DETECT_ENTITY_HOOK = 'interact-detect-entity';
export interface InteractData {
    helpText: string,
    onInteract: (entity: EntityMp) => void
}

export let inInteract = false
export let entitysData: { text: string, handle: number, x: number, y: number, z: number }[] = [];
const player = mp.players.local;

CustomEvent.register('cuff', () => {
    const target = gInteractObject.get()
    if (target?.type != 'player') return
    CustomEvent.triggerServer('cuffTarget', target.remoteId)
});

CustomEvent.register('uncuff', () => {
    const target = gInteractObject.get()
    if (target?.type != 'player') return
    CustomEvent.triggerServer('uncuffTarget', target.remoteId)
});

CustomEvent.register('follow', () => {
    const target = gInteractObject.get()
    if (target?.type != 'player') return
    CustomEvent.triggerServer('followTarget', target.remoteId)
});

export const gameObjectClick = async (handle: number) => {
    if (!user.free) return;

    const model = mp.game.invoke('0x9F47B058362C84B5', handle)

    if ([233175726, 1920863736].includes(model)) {
        if (player.isUsingScenario('PROP_HUMAN_MUSCLE_CHIN_UPS')) return user.stopAnim();
        // const target = mp.players.toArray().find(t => t.handle && t.dimension === player.dimension && system.distanceToPos(pos, t.position) < 3 && t.isUsingScenario("PROP_HUMAN_MUSCLE_CHIN_UPS"))
        // if (target) return user.notify("Место занято", "error");
        const pos = mp.game.invokeVector3('0x3FEF770D40960D5A', handle, true)
        const heading = mp.game.invokeVector3("0xE83D4F9BA2A38914", handle)
        let posres = mp.game.object.getObjectOffsetFromCoords(pos.x, pos.y, pos.z, heading.x, model == 233175726 ? -1.5 : 0.0, -0.15, 0.98);
        user.playScenario('PROP_HUMAN_MUSCLE_CHIN_UPS', posres.x, posres.y, posres.z, heading.x)
        return;
    }
    if (1005957871 === model) {
        if (player.isUsingScenario('PROP_HUMAN_SEAT_MUSCLE_BENCH_PRESS')) return user.stopAnim();
        // const target = mp.players.toArray().find(t => t.handle && t.dimension === player.dimension && system.distanceToPos(pos, t.position) < 3 && t.isUsingScenario("PROP_HUMAN_SEAT_MUSCLE_BENCH_PRESS"))
        // if (target) return user.notify("Место занято", "error");
        const pos = mp.game.invokeVector3('0x3FEF770D40960D5A', handle, true)
        const heading = mp.game.invokeVector3("0xE83D4F9BA2A38914", handle)
        let posres = mp.game.object.getObjectOffsetFromCoords(pos.x, pos.y, pos.z, heading.x, 0.0, -0.15, -0.23);
        user.playScenario('PROP_HUMAN_SEAT_MUSCLE_BENCH_PRESS', posres.x, posres.y, posres.z, heading.x + 180, true)
        return;
    }

    const cash = CASH_MACHINES_LIST.find(q => q === model);
    if (cash) {
        const heading = mp.game.invokeVector3("0xE83D4F9BA2A38914", handle)
        const pos = mp.game.invokeVector3('0x3FEF770D40960D5A', handle, true)
        player.taskGoStraightToCoord(pos.x, pos.y, pos.z, 1.0, 30000, system.headingToCoord(player.position, pos), 1.0)
        let c = 0;
        while (system.distanceToPos2D(player.position, pos) > 1.1 && c < 50) await system.sleep(100), c++;
        if (system.distanceToPos2D(player.position, pos) > 1.1) return user.stopAnim();
        CustomEvent.callServer('cash:mashine:grab:status', Math.floor(pos.x), Math.floor(pos.y), Math.floor(pos.z)).then((status: any) => {
            if (status && status.err) {
                user.stopAnim();
                user.notify(status.text, "error");
                return;
            }
            user.notify("Начинаем вскрывать кассу", "success");
            playAnimationWithResult(['anim@heists@money_grab@duffel', 'loop'], CASH_MACHINE_GRAB_SECOND, 'Вскрытие кассового аппарата', system.headingToCoord(player.position, pos) + 90).then(status => {
                if(status) CustomEvent.triggerServer('cash:mashine:grab:success', Math.floor(pos.x), Math.floor(pos.y), Math.floor(pos.z))
            })
        })
        return;
    }

    const vendor = VENDOR_MACHINES.find(q => q.model === model);

    if (vendor) {
        const heading = mp.game.invokeVector3("0xE83D4F9BA2A38914", handle)
        const pos = mp.game.invokeVector3('0x3FEF770D40960D5A', handle, true)
        let posres = mp.game.object.getObjectOffsetFromCoords(pos.x, pos.y, pos.z, heading.x, vendor.offset.x, vendor.offset.y, vendor.offset.z);


        player.taskLookAt(handle, 2000, 2048, 2);
        player.setResetFlag(322, true);
        player.taskGoStraightToCoord(posres.x, posres.y, posres.z, 1.0, 20000, heading.x, 0.1)
        let c = 0;
        while (system.distanceToPos2D(player.position, posres) > 0.1 && c < 50) await system.sleep(100), c++;
        if (system.distanceToPos2D(player.position, posres) > 0.1) return user.stopAnim();
        if (!(await CustomEvent.callServer('vendor:buy', model))) return user.stopAnim();
        player.setCoords(posres.x, posres.y, posres.z - 1, true, true, true, true);
        player.setHeading(heading.x)
        // Audio.RequestAmbientAudioBank("VENDING_MACHINE", false, -1);
        mp.game.audio.requestAmbientAudioBank('VENDING_MACHINE', false)
        user.playAnim([["MINI@SPRUNK@FIRST_PERSON", "PLYR_BUY_DRINK_PT1"]], false, false);
        setTimeout(() => {
            user.stopAnim()
        }, 4000)
        return;
    }

    const atm = ATM_PROPS.find(q => q.model === model);
    if (atm) {
        const heading = mp.game.invokeVector3("0xE83D4F9BA2A38914", handle)
        const pos = mp.game.invokeVector3('0x3FEF770D40960D5A', handle, true)
        let posres = mp.game.object.getObjectOffsetFromCoords(pos.x, pos.y, pos.z, heading.x, atm.offset.x, atm.offset.y, atm.offset.z);
        user.playScenario("PROP_HUMAN_ATM", posres.x, posres.y, posres.z, heading.x, false)
        CustomEvent.triggerServer('atm:load')
        return;
    }
}

// freezing all chairs


const pickAllObjects = () => {
    entitysData = [];
    if (!user.login) return;
    const { x, y, z } = player.position
    CASH_MACHINES_LIST.forEach(model => {
        const handle = mp.game.object.getClosestObjectOfType(x, y, z + 1, 3, model, true, true, true);
        if (handle){
            const pos = mp.game.invokeVector3('0x3FEF770D40960D5A', handle, true)
            const mz = Math.abs(pos.z - z);
            if (mz > 4) return;
            entitysData.push({text: "Ограбить", handle, x: pos.x, y: pos.y, z: pos.z});
        }
    })
    VENDOR_MACHINES.forEach(vendor => {
        const handle = mp.game.object.getClosestObjectOfType(x, y, z + 1, 3, vendor.model, true, true, true);
        if(!handle) return;
        const pos = mp.game.invokeVector3('0x3FEF770D40960D5A', handle, true);
        const heading = mp.game.invokeVector3("0xE83D4F9BA2A38914", handle)
        let posres = mp.game.object.getObjectOffsetFromCoords(pos.x, pos.y, pos.z, heading.x, 0, 0, vendor.offset.z);
        entitysData.push({ text: `${getBaseItemNameById(vendor.item_id)} ($${system.numberFormat(vendor.cost)})`, handle, x: posres.x, y: posres.y, z: posres.z });
    })
    ATM_PROPS.forEach(item => {
        const handle = mp.game.object.getClosestObjectOfType(x, y, z + 1, 3, item.model, true, true, true);
        if (!handle) return;
        const pos = mp.game.invokeVector3('0x3FEF770D40960D5A', handle, true)
        const mz = Math.abs(pos.z - z);
        if(mz > 4) return;
        entitysData.push({ text: `Банкомат`, handle, x: pos.x, y: pos.y, z: pos.z + 1 });
    })
    
    let handleC = mp.game.object.getClosestObjectOfType(x, y, z, 3, 1005957871, true, true, true);
    if (handleC) {
        const pos = mp.game.invokeVector3('0x3FEF770D40960D5A', handleC, true)
        entitysData.push({ text: `Поднимать штангу`, handle: handleC, x: pos.x, y: pos.y, z: pos.z + 1 });
    }
    let handleP = mp.game.object.getClosestObjectOfType(x, y, z, 3, 1920863736, true, true, true);
    if (!handleP) handleP = mp.game.object.getClosestObjectOfType(x, y, z, 3, 233175726, true, true, true);
    if (handleP){
        const pos = mp.game.invokeVector3('0x3FEF770D40960D5A', handleP, true)
        entitysData.push({ text: `Подтягиватся`, handle: handleP, x: pos.x, y: pos.y, z: pos.z + 1 });
    }
}

let split = false;
let interactCefString = "[]"
mp.events.add('render', () => {
    if(!user.login) return;
    if (gui.currentGui) return;
    let items: {
        text: string;
        handle: number;
        x: number;
        y: number;
    }[] = []
    entitysData.map(item => {
        const xy = mp.game.graphics.world3dToScreen2d(item.x, item.y, item.z);
        if(!xy) return;
        if(xy.x < 0) return;
        if(xy.y < 0) return;
        if(xy.x > 1) return;
        if(xy.y > 1) return;
        items.push({
            text: item.text,
            handle: item.handle,
            x: xy.x,
            y: xy.y
        });
    })
    items.map(item => {
        gui.drawText(item.text, item.x, item.y)
    })
})

export const gInteractObject = {
    get: () => {
        return currentGInteractObject;
    }
};
let currentGInteractObject: EntityMp = null;
function updateRaycastInteractObject() {
    let entity = Raycast.getEntityLookAt();

    if (typeof entity === 'number') {
        if (mp.players.atHandle(entity)) {
            entity = mp.players.atHandle(entity);
        } else if (mp.vehicles.atHandle(entity)) {
            entity = mp.vehicles.atHandle(entity);
        } else if (mp.objects.atHandle(entity)) {
            const mpEntity = mp.objects.atHandle(entity);

            if (mpEntity) {
                entity = mpEntity;
            }
            else {
                entity = mp.objects.newWeak(entity)
            }
        } else if (mp.peds.atHandle(entity)) {
            entity = mp.peds.atHandle(entity);
        } else {
            currentGInteractObject = null;
            return;
        }
    }

    currentGInteractObject = entity as EntityMp;
}

export const ENTITY_TYPES = {
    PED: 'ped',
    VEHICLE: 'vehicle',
    OBJECT: 'object',
    PLAYER: 'player'
}

setInterval(() => {
    if (!user.login) {
        return;
    }

    updateRaycastInteractObject();

    pickAllObjects();

    if (currentColshape || player.vehicle) return user.showHelp(null);
    const anyscenario = player.isUsingAnyScenario()
    if(player.isUsingAnyScenario()) return user.showHelp(`Остановить анимацию [${getKeyName(mp.storage.data.hotkeys.stopanim)}]`);
    const door = doorEventHave();
    if (door) return user.showHelp(door);
    let closest: { text?: string, handle: number, x: number, y: number, z: number, ped?:boolean, pl?: boolean, vh?: boolean, entity?: EntityMp }[] = entitysData.filter(q => system.distanceToPos(player.position, q) < 2);

    let raycastEntity = currentGInteractObject as EntityMp;

    if (raycastEntity) {
        const data = invokeHook<InteractData>(RAYCAST_DETECT_ENTITY_HOOK, raycastEntity)[0];

        if (data) {
            return user.showHelp(`${data.helpText} [${getKeyName(mp.storage.data.hotkeys.gpress)}]`);
        }

        if (raycastEntity.type === ENTITY_TYPES.PLAYER) {
            if (raycastEntity.alpha === 0) return;
            const dating = user.getDating(raycastEntity.getVariable('id'), raycastEntity as PlayerMp);
            return user.showHelp(`Взаимодействие с ${dating ? dating : 'Незнакомцем'} #${raycastEntity.getVariable('id')} [${getKeyName(mp.storage.data.hotkeys.gpress)}]`);
        } else if (raycastEntity.type === ENTITY_TYPES.VEHICLE) {
            return user.showHelp(`Взаимодействие с ${raycastEntity.getVariable('name') || raycastEntity.getVariable('modelname') || "ТС"} [${getKeyName(mp.storage.data.hotkeys.gpress)}]`);
        }
    }

    if (closest.length > 0) {
        closest = closest.sort((a, b) => {
            const adist = system.distanceToPos(player.position, a)
            const bdist = system.distanceToPos(player.position, b)
            return adist - bdist;
        })

        const itm = closest[0];
        return user.showHelp(`${itm.text} [${getKeyName(mp.storage.data.hotkeys.gpress)}]`);
    }
    if(!anyscenario){
        //if (inFishPosStatus()) return user.showHelp(FISH_HELP_TEXT);
        if (!inDiceGame() && nearestDiceTable() > -1) return user.showHelp('Кости [E]');
        if (!inCasinoRoulette() && getNearestRouletteTable() > -1) return user.showHelp('Рулетка [E]');
        if (!inSlotGame() && getNearestSlotsMachine()) return user.showHelp('Игровой автомат [E]');
    }
    user.showHelp(null);
}, 500);
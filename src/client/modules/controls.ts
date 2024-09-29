import {gui, phoneOpened, terminalOpened, unitpayBrowser} from "./gui";
import {CustomEvent} from "./custom.event";
import {currentMenu} from "./menu";
import {Raycast} from "./raycast";
import {system} from "./system";

mp.events.add('render', () => {
    mp.game.controls.disableControlAction(0, 81, true)
    mp.game.controls.disableControlAction(0, 82, true)
    mp.game.controls.disableControlAction(0, 83, true)
    mp.game.controls.disableControlAction(0, 84, true)
    mp.game.controls.disableControlAction(2, 81, true)
    mp.game.controls.disableControlAction(2, 82, true)
    mp.game.controls.disableControlAction(2, 83, true)
    mp.game.controls.disableControlAction(2, 84, true)
    if (gui.chat.active) mp.game.controls.disableAllControlActions(0);
    // Disable weapon controls
    for (let id = 12; id < 18; id++) mp.game.controls.disableControlAction(0, id, true);
    mp.game.controls.disableControlAction(0, 37, true);
    mp.game.controls.disableControlAction(0, 53, true);
    mp.game.controls.disableControlAction(0, 54, true);
    mp.game.controls.disableControlAction(0, 56, true);
    mp.game.controls.disableControlAction(0, 99, true);
    mp.game.controls.disableControlAction(0, 100, true);
    mp.game.controls.disableControlAction(0, 115, true);
    mp.game.controls.disableControlAction(0, 116, true);

    mp.game.player.setLockon(false);
    mp.game.invoke(system.natives.SET_PLAYER_LOCKON, mp.players.local, false);

    for (let id = 157; id < 166; id++) mp.game.controls.disableControlAction(0, id, true);
    mp.game.controls.disableControlAction(0, 261, true);
    mp.game.controls.disableControlAction(0, 262, true);

    if (mp.players.local.isSprinting())
        mp.game.player.restoreStamina(100);
    
    moveX = mp.gui.cursor.position[0] - oldX
    moveY = mp.gui.cursor.position[1] - oldY
    oldX = mp.gui.cursor.position[0]
    oldY = mp.gui.cursor.position[1]
    cursorX = oldX / objectRes.x;
    cursorY = oldY / objectRes.y;
})
let objectRes = mp.game.graphics.getScreenActiveResolution(1, 1);
setInterval(() => {
    objectRes = mp.game.graphics.getScreenActiveResolution(1, 1)
}, 5000)

let leftKeyPressed = false;
let rightKeyPressed = false;
let oldX = mp.gui.cursor.position[0]
let oldY = mp.gui.cursor.position[1]
let moveX = mp.gui.cursor.position[0]
let moveY = mp.gui.cursor.position[1]
export let cursorX = 0;
export let cursorY = 0;

let entityOnClickSpam = false;

export let raycastTarget: RaycastResult;
setInterval((): any => {
    if (!mp.gui.cursor.visible) return raycastTarget = null;
    if (!!gui.currentGui) return raycastTarget = null;
    if (currentMenu) return raycastTarget = null;
    if (phoneOpened) return raycastTarget = null;
    if (terminalOpened) return raycastTarget = null;
    raycastTarget = Raycast.getByCursor();
}, 120)

mp.events.add('click', (x: number, y: number, upOrDown: "up" | "down", leftOrRight: "left" | "right", relativeX: number, relativeY: number, worldPosition: number, hitEntity) => {
    if (leftOrRight === "left") {
        leftKeyPressed = upOrDown === "down"
    } else {
        rightKeyPressed = upOrDown === "down"
    }
    if(leftKeyPressed){
        if (!raycastTarget) return;
        if (!raycastTarget.entity) return;
        if (typeof raycastTarget.entity === "number"){
            if (raycastTarget.entity === mp.players.local.handle) return;
        } else {
            if (raycastTarget.entity.handle === mp.players.local.handle) return;
        }
        if(system.distanceToPos(mp.players.local.position, raycastTarget.position) > 3) return;
        if (entityOnClickSpam) return;
        entityOnClickSpam = true;
        setTimeout(() => {
            entityOnClickSpam = false;
        }, 500)
        if (typeof raycastTarget.entity === "number"){
            onclickEntityWorldHandles.map(q => {
                q(raycastTarget.entity as any)
            })
        } else {
            onclickEntityHandles.map(q => {
                q(raycastTarget.entity as any)
            })
        }
    }
});

let onclickEntityHandles: ((ent: EntityMp) => void)[] = []
export const onclickEntity = (handle: (ent: EntityMp)=>void) => {
    onclickEntityHandles.push(handle);
}
let onclickEntityWorldHandles: ((ent: number) => void)[] = []
export const onclickEntityWorld = (handle: (ent: number)=>void) => {
    onclickEntityWorldHandles.push(handle);
}

let dir = 0;

// mp.events.add('render', () => {
//     if (mp.players.local.getVariable('cuffed')) disableControlGroup.handcuff();
//     dir--;
//     if (dir == 0) dir = 360
//     if(!user.login) return;
//     if(gui.currentGui) return;
//     if(currentMenu) return;
//     if(!mp.gui.cursor.visible) return;
//     if (!raycastTarget) return;
//     if (!raycastTarget.entity) return;
//     if (typeof raycastTarget.entity === "number") return;
//     if (raycastTarget.entity.handle === mp.players.local.handle) return;
//     const entity = raycastTarget.entity as EntityMp
//     if (system.distanceToPos(mp.players.local.position, entity.position) > 4) return;
//     if(entity.type === "player"){
//         mp.game.graphics.drawMarker(
//             27,
//             raycastTarget.entity.position.x,
//             raycastTarget.entity.position.y,
//             raycastTarget.entity.position.z - 0.95,
//             0,
//             0,
//             0,
//             0,
//             0,
//             dir,
//             1,
//             1,
//             1,
//             0,
//             255,
//             0,
//             170,
//             false,
//             false,
//             2,
//             false,
//             '',
//             '',
//             false
//         );
//     }
// })

export interface MouseMoveSystem {
    destroy:()=>any;
}

export const mouseMove = (cb: (right: number, down: number, leftKey?: boolean, rightKey?: boolean, posX?: number, posY?: number) => void, interval: number = 100): MouseMoveSystem => {
    let int: any;
    int = setInterval(() => {
        if (!leftKeyPressed && !rightKeyPressed) return;
        cb(moveX, moveY, leftKeyPressed, rightKeyPressed, cursorX, cursorY);
    }, interval)
    return {
        destroy: () => clearInterval(int)
    }
}

/**
 * Keycode list https://keycode.info/
 */
export const registerHotkey = (key: number, callbackPress: (val?: () => void) => void, callbackUnPress?: (val?: () => void) => void) => {
    const callpress = () => {
        // if (!!gui.currentGui) return;
        if (!!gui.chat.active) return;
        return callbackPress(callpress);
    }
    const callunpress = () => {
        // if (!!gui.currentGui) return;
        if (!!gui.chat.active) return;
        return callbackUnPress(callpress);
    }
    mp.keys.bind(key, true, callpress);
    if (callbackUnPress) mp.keys.bind(key, false, callunpress);
    return {
        destroy: () => {
            mp.keys.unbind(key, true, callpress)
            if (callbackUnPress) mp.keys.unbind(key, true, callunpress)
        }
    }
}

export const enableControlGroup = {
    move: () => {
        mp.game.controls.enableControlAction(0, 32, true); // disable move up
        mp.game.controls.enableControlAction(0, 33, true); // disable move down
        mp.game.controls.enableControlAction(0, 34, true); // disable move left
        mp.game.controls.enableControlAction(0, 35, true); // disable move right

        mp.game.controls.enableControlAction(0, 268, true);
        mp.game.controls.enableControlAction(0, 269, true);
        mp.game.controls.enableControlAction(0, 270, true);
        mp.game.controls.enableControlAction(0, 271, true);
    }
}

export const disableControlGroup = {
    saveZone: () => {
        mp.game.controls.disableControlAction(0, 24, true); // disable attack
        mp.game.controls.disableControlAction(0, 58, true); // disable weapon
        mp.game.controls.disableControlAction(0, 69, true); // INPUT_VEH_ATTACK
        mp.game.controls.disableControlAction(0, 70, true); // INPUT_VEH_ATTACK2
        mp.game.controls.disableControlAction(0, 91, true); // disable select weapon
        mp.game.controls.disableControlAction(0, 92, true); // disable select weapon
        mp.game.controls.disableControlAction(0, 140, true); // disable melee
        mp.game.controls.disableControlAction(0, 141, true); // disable melee
        mp.game.controls.disableControlAction(0, 142, true); // disable melee
        mp.game.controls.disableControlAction(0, 143, true); // disable melee
        mp.game.controls.disableControlAction(0, 257, true); // disable melee
        mp.game.controls.disableControlAction(0, 263, true); // disable melee
        mp.game.controls.disableControlAction(0, 264, true); // disable melee
    },
    baseKeyDisable: () => {
        mp.game.controls.disableControlAction(0, 44, true); // disable cover
        mp.game.controls.disableControlAction(0, 21, true); // disable sprint
        mp.game.controls.disableControlAction(0, 22, true); // disable jump
        mp.game.controls.disableControlAction(0, 23, true); // disable enter vehicle
        mp.game.controls.disableControlAction(0, 24, true); // disable attack
        mp.game.controls.disableControlAction(0, 25, true); // disable aim
        mp.game.controls.disableControlAction(0, 32, true); // disable move up
        mp.game.controls.disableControlAction(0, 33, true); // disable move down
        mp.game.controls.disableControlAction(0, 34, true); // disable move left
        mp.game.controls.disableControlAction(0, 35, true); // disable move right
        mp.game.controls.disableControlAction(0, 37, true); // disable select weapon
        mp.game.controls.disableControlAction(0, 58, true); // disable weapon
        mp.game.controls.disableControlAction(0, 75, true); // disable exit vehicle
        mp.game.controls.disableControlAction(0, 91, true); // disable select weapon
        mp.game.controls.disableControlAction(0, 92, true); // disable select weapon
        mp.game.controls.disableControlAction(0, 140, true); // disable melee
        mp.game.controls.disableControlAction(0, 141, true); // disable melee
        mp.game.controls.disableControlAction(0, 142, true); // disable melee
        mp.game.controls.disableControlAction(0, 143, true); // disable melee
        mp.game.controls.disableControlAction(0, 257, true); // disable melee
        mp.game.controls.disableControlAction(0, 263, true); // disable melee
        mp.game.controls.disableControlAction(0, 264, true); // disable melee
        mp.game.controls.disableControlAction(0, 268, true);
        mp.game.controls.disableControlAction(0, 269, true);
        mp.game.controls.disableControlAction(0, 270, true);
        mp.game.controls.disableControlAction(0, 271, true);
        mp.game.controls.disableControlAction(27, 23, true); // disable enter vehicle
        mp.game.controls.disableControlAction(27, 75, true); // disable exit vehicle
        mp.game.controls.disableControlAction(27, 91, true); // disable select weapon
        mp.game.controls.disableControlAction(27, 92, true); // disable select weapon
    },
    moveGui: () => {
        mp.game.controls.disableControlAction(0, 1, true);
        mp.game.controls.disableControlAction(0, 2, true);
        mp.game.controls.disableControlAction(0, 3, true);
        mp.game.controls.disableControlAction(0, 4, true);
        mp.game.controls.disableControlAction(0, 5, true);
        mp.game.controls.disableControlAction(0, 6, true);
        mp.game.controls.disableControlAction(0, 199, true);
        mp.game.controls.disableControlAction(0, 329, true);
        mp.game.controls.disableControlAction(0, 330, true);
        mp.game.controls.disableControlAction(1, 329, true);
        mp.game.controls.disableControlAction(1, 330, true);
        mp.game.controls.disableControlAction(0, 106, true);
        disableControlGroup.baseKeyDisable();
    },
    allControls: () => {
        mp.game.controls.disableAllControlActions(0);
        mp.game.controls.disableAllControlActions(2);
        mp.game.controls.enableControlAction(2, 172, true);
        mp.game.controls.enableControlAction(2, 173, true);
        mp.game.controls.enableControlAction(2, 174, true);
        mp.game.controls.enableControlAction(2, 175, true);
        mp.game.controls.enableControlAction(2, 201, true);
        mp.game.controls.enableControlAction(2, 177, true);
    },
    cameraChanging: () => {
        mp.game.controls.disableControlAction(0, 0, true);
        mp.game.controls.disableControlAction(1, 0, true);
        mp.game.controls.disableControlAction(2, 0, true);
    },
    handcuff: () => {
        disableControlGroup.baseKeyDisable();
        mp.game.controls.disableControlAction(0, 71, true);
        mp.game.controls.disableControlAction(0, 72, true);
    }
}

export let disableAllControlSystem = false;
export const disableAllControlSystemStatus = (status: boolean) => {
    disableAllControlSystem = status;
}
mp.events.add("render", () => {
    if (disableAllControlSystem) disableControlGroup.allControls();
});

CustomEvent.registerServer('disableAllControls', (status: boolean) => {
    disableAllControlSystem = status;
})

let cursorEvent = false

setInterval(() => {
    //if (mp.game.ui.isPauseMenuActive()) return mp.gui.cursor.show(false, false)
    if(unitpayBrowser) return mp.gui.cursor.show(true, true)
    if(!cursorEvent) return;
    if (mp.gui.cursor.visible) return;
    mp.gui.cursor.show(false, cursorEvent)
}, 200)

export const tempCursorStatus = (enable: boolean = true) => {
    if (mp.game.ui.isPauseMenuActive()) return;
    if(!cursorEvent && enable) mp.game.invoke("0xFC695459D4D0E219", 0.5, 0.5)
    cursorEvent = enable;
    mp.gui.cursor.show(false, cursorEvent)
}

CustomEvent.register('cursor', () => {
    tempCursorStatus(!cursorEvent)
})
mp.events.add('enableCursor', () => {
    tempCursorStatus(true)
})
mp.events.add('disableCursor', () => {
    tempCursorStatus(false)
})
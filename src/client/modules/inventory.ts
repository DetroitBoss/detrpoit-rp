import {CustomEvent} from "./custom.event"
import {
    ExchangeData,
    getBaseItemNameById,
    InventoryDataCef, InventoryEquipList,
    inventoryShared,
    InventoryWeaponPlayerData,
    ITEM_TYPE,
    ITEM_TYPE_ARRAY,
    WeaponAddonsItem
} from "../../shared/inventory"
import {gui, inputOnFocus, phoneOpened, terminalOpened} from "./gui"
import {user} from "./user"
import {dressData} from "./cloth"
import {currentMenu, DialogInput, MenuClass} from "./menu"
import {system} from "./system"
import {menu} from "../../server/modules/menu";
import {dancing} from "./dance";
import {furniturePlace} from "./houses/furniturePlace";
import e from "cors"

const player = mp.players.local;
export const inventory = {
    open: () => {
        CustomEvent.triggerServer('inventory:open')
    },
    close: () => {

    }
}

let remCnt = 0;
CustomEvent.registerServer('fireshow:play', async ([x,y,z]:[number, number, number]) => {
    const countTry = 10;
    remCnt+=countTry
    await system.sleep(2000);
    const object = mp.objects.new('ind_prop_firework_03', new mp.Vector3(x,y,z), {
        dimension: 0,
    })
    await system.sleep(10);
    object.placeOnGroundProperly()
    object.freezePosition(true)

    await system.sleep(5000);
    for(let count = 0; count < countTry; count++){
        while(!mp.game.streaming.hasNamedPtfxAssetLoaded('scr_indep_fireworks')){
            mp.game.streaming.requestNamedPtfxAsset('scr_indep_fireworks')
            await system.sleep(10);
        }
        mp.game.graphics.setPtfxAssetNextCall('scr_indep_fireworks');
        let part1 = mp.game.graphics.startParticleFxLoopedAtCoord('scr_indep_firework_trailburst', x, y, z, 0.0, 0.0, 0.0, 1.0, false, false, false, false);
        await system.sleep(3500);
        remCnt--;
    }
    if(remCnt <= 0) mp.game.streaming.removeNamedPtfxAsset('scr_indep_fireworks')
    if(remCnt < 0) remCnt = 0;
    await system.sleep(2000);
    if(mp.objects.exists(object)) object.destroy();
})

CustomEvent.registerServer('inventory:openExchange', (
    myInventory: InventoryDataCef,
    exchange: ExchangeData,
    weapons: InventoryWeaponPlayerData,
    hotkeys: [number, number, number, number, number],
    inv_level: number,
) => {
    gui.setGuiWithEvent('inventory', 'inventory:exchange', myInventory, exchange, {...dressData, armour: player.getArmour()}, weapons, hotkeys, inv_level);
})

CustomEvent.registerServer('inventory:open', (blocks: InventoryDataCef[], weapon: InventoryWeaponPlayerData, hotkeys, inv_level) => {
    gui.setGui('inventory');
    CustomEvent.triggerCef('inventory:open', blocks, {...dressData, armour: player.getArmour()}, weapon, hotkeys, inv_level)
})


CustomEvent.register('invopen', () => {
    inventory.open();
})

let sendHotkeyCommand = false

for(let i = 0; i < 5; i++) {
    CustomEvent.register('invslot'+(i + 1), () => {
        if (gui.is_block_keys) return;
        // if (phoneOpened) return;
        if (terminalOpened) return;
        if (inputOnFocus) return;
        //if (sendHotkeyCommand) return user.notify('Не нажимайте на хоткей так часто', 'error')
        if(user.cuffed) return user.notify('Нельзя использовать в наручниках');
        if(user.walkingWithObject) return user.notify('Недоступно при перемещении предмета', 'error');
        CustomEvent.triggerServer('inventory:hotkey:user', i)
        sendHotkeyCommand = true;
        setTimeout(() => {
            sendHotkeyCommand = false;
        }, 2000)
    })
}

CustomEvent.register('phoneSlot', () => {
    if (!user.login) return;
    if (currentMenu) return;
    if (terminalOpened) return;
    if (inputOnFocus) return;
    if (dancing) return;
    if (!furniturePlace.lockControls) return;
    //if (sendHotkeyCommand) return user.notify('Не нажимайте на хоткей так часто', 'error')
    if (user.cuffed) return user.notify('Нельзя использовать в наручниках');
    if (user.walkingWithObject) return user.notify('Недоступно при перемещении предмета', 'error');
        //if (gui.is_block_keys) return;
        if (gui.currentGui === 'phone') {
            CustomEvent.triggerServer('phone:openPhone');
            gui.setGui(null)
        } else {
            if (!gui.currentGui && !mp.game.ui.isPauseMenuActive()) {
            CustomEvent.triggerServer('phone:openPhone');
            gui.setGui('phone');
            }
        }
   
    sendHotkeyCommand = true;
    setTimeout(() => {
        sendHotkeyCommand = false;
    }, 500)
})

CustomEvent.register('tabletSlot', () => {
    if (!user.login) return;
    if (currentMenu) return;
    if (terminalOpened) return;
    if (inputOnFocus) return;
    if (dancing) return;
    if (!furniturePlace.lockControls) return;
    if (user.cuffed) return user.notify('Нельзя использовать в наручниках');
    if (user.walkingWithObject) return user.notify('Недоступно при перемещении предмета', 'error');

        //if (gui.is_block_keys) return;
    if (gui.currentGui === 'tablet') {
        gui.setGui(null)
        mp.console.logInfo(`Tablet closed`);
    } else {
        if (!gui.currentGui && !mp.game.ui.isPauseMenuActive()) {
        CustomEvent.triggerServer('tablet:openTablet');
        gui.setGui('tablet');
        mp.console.logInfo(`Tablet open`);
        mp.console.logInfo(`Tablet open gui.currentGui: ${gui.currentGui}`);
        }
    }
   
})

// for(let key = 0; key < 5; key++){
//     registerHotkey((49+key), () => {
//         if (gui.is_block_keys) return;
//         // if (phoneOpened) return;
//         if (terminalOpened) return;
//         if (inputOnFocus) return;
//         if (sendHotkeyCommand) return user.notify('Не нажимайте на хоткей так часто', 'error')
//         CustomEvent.triggerServer('inventory:hotkey:user', key)
//         sendHotkeyCommand = true;
//         setTimeout(() => {
//             sendHotkeyCommand = false;
//         }, 2000)
//     })
// }

let sendReloadCommand = false
let serverWeapon: number;
CustomEvent.registerServer('user:removeWeapon', (data: {
    hash: number,
    magazines: number[],
    weapon: number,
    maxMagazine: number
}) => {
    serverWeapon = data ? data.hash : null;
    sendWeaponAmmo = 0;
    CustomEvent.triggerCef('hud:weapon', data ? {...data, ammo: 0} : null)
})

CustomEvent.registerServer('weaponInHand', (data: {
    hash: number,
    magazines: number[],
    weapon: number,
    maxMagazine: number
}) => {
    serverWeapon = data ? data.hash : null;
    sendWeaponAmmo = 0;
    CustomEvent.triggerCef('hud:weapon', data ? {...data, ammo: 0} : null)
})


let sendWeaponAmmo = 0

const AMMO_UPDATE_COOLDOWN_MS = 100;
let nextAmmoUpdateTime = 0;

let finalAmmoCheckTimer: number = null;

function updateHudAmmo(ammo: number) {
    if (system.timestampMS < nextAmmoUpdateTime) {
        if (finalAmmoCheckTimer == null) {
            finalAmmoCheckTimer = setTimeout(() => {
                CustomEvent.triggerCef('hud:ammo', user.currentAmmo);
                clearTimeout(finalAmmoCheckTimer);
                finalAmmoCheckTimer = null;
            }, AMMO_UPDATE_COOLDOWN_MS);
        }

        return;
    }

    CustomEvent.triggerCef('hud:ammo', ammo);
    nextAmmoUpdateTime = system.timestampMS + AMMO_UPDATE_COOLDOWN_MS;
}

mp.events.add('render', () => {
    if(serverWeapon) mp.game.controls.disableControlAction(0, 45, true);
    mp.game.controls.disableControlAction(0, 140, true);
    const hand = 2725352035
    const currentAmmo = user.currentAmmo
    if(sendWeaponAmmo !== currentAmmo){
        sendWeaponAmmo = currentAmmo;
        updateHudAmmo(currentAmmo);
    }
    if (mp.players.local.weapon !== hand
        && mp.game.weapon.getWeaponClipSize(mp.players.local.weapon)
        && mp.game.controls.isDisabledControlJustPressed(0, 45)
        && !sendReloadCommand
        && !gui.is_block_keys
        && !phoneOpened
        && !terminalOpened
        && !inputOnFocus)
    {
        CustomEvent.triggerServer('inventory:reload:weapon')
        sendReloadCommand = true;
        setTimeout(() => {
            sendReloadCommand = false;
        }, 3000)
    }
})


export const selectItem = (disabled: number[] = [], disableName?: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        const select = (name?: string, category: ITEM_TYPE = ITEM_TYPE_ARRAY.length) => {
            if (name) name = name.toLowerCase();
            let m = new MenuClass('Выберите предмет')
            m.onclose = () => { resolve(null) }
            m.newItem({
                name: 'Поиск',
                more: name,
                onpress: () => {
                    DialogInput("Введите имя или ID", name ? name : "").then(val => {
                        if (val === null) return select(name)
                        else return select(val);
                    })
                }
            })
            m.newItem({
                name: 'Категория',
                type: "list",
                list: [...ITEM_TYPE_ARRAY, "Все предметы"],
                listSelected: category,
                onpress: (itm) => {
                    select(name, itm.listSelected);
                }
            })
            inventoryShared.items.map(item => {
                if (disabled.includes(item.item_id) && !disableName) return;
                if (category !== ITEM_TYPE_ARRAY.length) {
                    if (item.type !== category) return;
                }
                let idsrch = parseInt(name);
                if (!name || item.name.toLowerCase().includes(name) || (idsrch === item.item_id)) {
                    m.newItem({
                        name: item.name+" #"+item.item_id,
                        icon: `Item_${item.item_id}`,
                        more: disabled.includes(item.item_id) && disableName ? disableName : "",
                        onpress: () => {
                            if (disabled.includes(item.item_id)) return user.notify(disableName, "error");
                            m.close();
                            resolve(item.item_id)
                        }
                    })
                }
            });
            if (name) m.subtitle = `Список найденых предметов (${m.items.length} / ${inventoryShared.items.length})`
            else m.subtitle = `Список всех доступных пердметов`
            m.open();
        }
        select();
    })
}

CustomEvent.register('tablet:getTrackSuspect', () => {
    return user.trackSuspect
})

CustomEvent.registerServer('tablet:open', (
    house: {
        carInt: number,
        name: string,
        id: number,
        owner: string,
        price: number,
        tax: number,
        cars: { name: string, number: string, model: string }[],
        pos: { x: number, y: number }
    },
    vehicles: { name: string, model: string, number: string, x: number, y: number, onSpawn: boolean, id: number }[],
    faction: any,
    myNumbers: any,
    lifeInvaderModerate: any,
    bussinessData,
    familyData,
    gosSuspects) => {
    gui.setGui('tablet');
    const trackSuspect = user.trackSuspect;
    CustomEvent.triggerCef('tablet:open', house, vehicles, faction, myNumbers, lifeInvaderModerate, bussinessData, familyData, gosSuspects, trackSuspect)
})

let objects: {handle: number, x: number, y: number, z: number, name: string}[] = []

setInterval(() => {
    if(!user.login) return;
    // if(mp.players.local.dimension) return;
    objects = []
    mp.objects.forEachInStreamRange(object => {
        if (!object.getVariable('inventory_dropped')) return;

        if (!object.isCollisonDisabled()) {
            object.setCollision(false, true)
        }

        if (system.distanceToPos(object.position, mp.players.local.position) > 5) return;
        objects.push({handle: object.handle, x: object.position.x, y: object.position.y, z: object.position.z, name: getBaseItemNameById(object.getVariable('item_id'))})
    })
}, 400)


mp.events.add('render', () => {
    objects.map(item => {
        gui.drawText3D(item.name, item.x, item.y, item.z, 0.5, true)
    })
})

let flashEnabled = new Map<number, string>()

const setWeaponAddons = (target: PlayerMp, data: [string, (keyof WeaponAddonsItem)[]], oldData: [string, (keyof WeaponAddonsItem)[]], tick = false) => {
    if(!mp.players.exists(target) || !target.handle) return;
    if(oldData){
        const weaponHash = oldData[0];
        const weaponHashInt = mp.game.joaat(weaponHash) as number;
        const cfg = inventoryShared.getWeaponConfigByHash(weaponHash);
        if (cfg) {
            const addons = oldData[1];
            if(addons){
                addons.map(addon => {
                    const hash = cfg.addons[addon]?.hash
                    if (hash) {
                        mp.game.invoke('0x1E8BE90C74FB4C09', target.handle, weaponHashInt >> 0, mp.game.joaat(hash) as number >> 0)
                    }
                })
            }

        }
    }

    flashEnabled.delete(target.remoteId)

    if(data){
        const weaponHash = data[0];
        const weaponHashInt = mp.game.joaat(weaponHash.toUpperCase());
        const cfg = inventoryShared.getWeaponConfigByHash(weaponHash);
        if(cfg){
            const addons = data[1];
            if(addons){
                addons.map(addon => {
                    const hash = cfg.addons[addon]?.hash
                    if(hash){
                        if(hash.includes('_FLSH')) flashEnabled.set(target.remoteId, hash)
                        
                        const hashC = mp.game.joaat(hash);
                        if (hash.includes('WEAPON_TINT')) {
                            mp.game.invoke('0x50969B9B89ED5738', target.handle, weaponHashInt >> 0, Number.parseInt(hash.toString().replace('WEAPON_TINT', '')) >> 0);
                        }
                        mp.game.invoke('0xD966D51AA5B28BB9', target.handle, weaponHashInt >> 0, hashC >> 0)
                        if(!tick){
                            setTimeout(() => {
                                if(target && mp.players.exists(target) && target.handle) mp.game.invoke('0xD966D51AA5B28BB9', target.handle, weaponHashInt >> 0, hashC >> 0)
                            }, 500)
                        }
                    }
                })
                // mp.game.invoke("0xADF692B254977C0C", target.handle, weaponHashInt >> 0, true);
            }
        }
    }
}

let flashPos = {
    COMPONENT_AT_AR_FLSH: [
        new mp.Vector3(0.5, 0.03, 0.05),
        new mp.Vector3(1.0, -0.16, 0.145)
    ],
    COMPONENT_AT_PI_FLSH: [
        new mp.Vector3(0.28, 0.04, 0.0),
        new mp.Vector3(1.0, -0.12, 0.03)
    ],
    COMPONENT_AT_PI_FLSH_02: [
        new mp.Vector3(0.28, 0.04, 0.0),
        new mp.Vector3(1.0, -0.135, 0.03)
    ],
    COMPONENT_AT_PI_FLSH_03: [
        new mp.Vector3(0.28, 0.04, 0.0),
        new mp.Vector3(1.0, -0.135, 0.03)
    ]
}
let block = false;
CustomEvent.register('flashlight', () => {
    if(block) return;
    if(!flashEnabled.has(player.remoteId)) return;
    block = true;
    CustomEvent.triggerServer('inventory:flashlight')
    mp.game.audio.playSoundFrontend(-1, "PICK_UP_WEAPON", "HUD_FRONTEND_CUSTOM_SOUNDSET", true)
    setTimeout(() => {
        block = false;
    }, 3000)
})

mp.events.add('render', () => {
    flashEnabled.forEach((hash: keyof typeof flashPos, targetid) => {
        const target = mp.players.atRemoteId(targetid);
        if(!target || !mp.players.exists(target) || !target.handle) return flashEnabled.delete(targetid);
        if(!target.getVariable('flashlightWeapon')) return;
        const cfg = flashPos[hash]
        if(!cfg) return;
        let FlashlightPosition = target.getBoneCoords(0xDEAD, cfg[0].x, cfg[0].y, cfg[0].z)
        let FlashlightDirection = target.getBoneCoords(0xDEAD, cfg[1].x, cfg[1].y, cfg[1].z)
        let DirectionVector = new mp.Vector3(FlashlightDirection.x - FlashlightPosition.x, FlashlightDirection.y - FlashlightPosition.y, FlashlightDirection.z - FlashlightPosition.z)
        let VectorMagnitude = Math.hypot(DirectionVector.x, DirectionVector.y, DirectionVector.z);
        let FlashlightEndPosition = new mp.Vector3(DirectionVector.x / VectorMagnitude, DirectionVector.y / VectorMagnitude, DirectionVector.z / VectorMagnitude)
        mp.game.graphics.drawSpotLight(FlashlightPosition.x, FlashlightPosition.y, FlashlightPosition.z, FlashlightEndPosition.x, FlashlightEndPosition.y, FlashlightEndPosition.z, 255, 255, 255, 40.0, 2.0, 2.0, 10.0, 15.0)
    })
})

mp.events.addDataHandler("currentWeaponAddons", async (target: PlayerMp, data: [string, (keyof WeaponAddonsItem)[]], oldData: [string, (keyof WeaponAddonsItem)[]]) => {
    if(target.type !== "player") return;
    setTimeout(() => {
        if(!mp.players.exists(target) || !target.handle) return;
        setWeaponAddons(target, data, oldData)
    }, mp.players.local === target ? 100 : 500)
})

mp.events.add('entityStreamIn', async (target: PlayerMp) => {
    if (target.type !== "player") return;
    setTimeout(() => {
        if(!mp.players.exists(target) || !target.handle) return;
        const val = target.getVariable('currentWeaponAddons');
        if(val) setWeaponAddons(target, target.getVariable('currentWeaponAddons'), null)
    }, mp.players.local === target ? 100 : 500)

});

setInterval(() => {
    if(!user.login) return;
    const my = mp.players.local.getVariable('currentWeaponAddons')
    if(my)setWeaponAddons(mp.players.local, my, null, true)
    mp.players.forEachInStreamRange(target => {
        const val = target.getVariable('currentWeaponAddons')
        if(val) setWeaponAddons(target, val, null, true)
    })
}, 1000)
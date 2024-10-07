import {defaultHotkeys, hotkeysAllowed, hotkeysTasks} from "../../shared/hotkeys";
import {CustomEvent} from "./custom.event";
import {gui, inputOnFocus} from "./gui";
import {user} from "./user";
import {registerHotkey} from "./controls";

export let currentHotkeys = defaultHotkeys;

setInterval(() => {
    syncHotkeys();
}, 10000)

const syncHotkeys = () => {
    CustomEvent.triggerCef('currentHotkeys', currentHotkeys, mp.storage.data.alertsEnable.hudHotkeys)
}

const getTasksOnKey = (key: number): (keyof typeof defaultHotkeys)[] => {
    let tasks: (keyof typeof defaultHotkeys)[] = []
    for (let task in currentHotkeys) {
        let keycode = <number>(currentHotkeys as any)[task];
        if(keycode === key){
            tasks.push(task as any);
        }
    }
    return tasks;
}
mp.events.add('hotkeys:set', (task: keyof typeof currentHotkeys, key:number, notify = true) => {
    currentHotkeys[task] = key;
    mp.storage.data.hotkeys[task] = key;
    if (notify) user.notify("Горячая клавиша назначена", "success")
    syncHotkeys();
})

if(typeof mp.storage.data.hotkeys === "object"){
    for (let task in mp.storage.data.hotkeys){
        let key = (mp.storage.data.hotkeys as any)[task as any];
        (currentHotkeys as any)[task] = key;
    }
}
mp.storage.data.hotkeys = currentHotkeys

let hotkeySpamPress = false;
let hotkeySpamUnPress = false;
for (let key in hotkeysAllowed) registerHotkey(parseInt(key), () => {
    getTasksOnKey(parseInt(key)).map(task => {
        if (!checkHotkey(task, false)) return;
        CustomEvent.trigger(task, true)
    })
}, () => {
        getTasksOnKey(parseInt(key)).map(task => {
            if (!hotkeysTasks[task][2]) return;
            if (!checkHotkey(task, true)) return;
            CustomEvent.trigger(task, false)
        })
})


const checkHotkey = (task: keyof typeof currentHotkeys, unpress: boolean) => {
    if (inputOnFocus) return false;
    if (unpress && task === "voice") return true;
    if (!unpress && hotkeySpamPress) return false;
    if (unpress && hotkeySpamUnPress) return false;
    if (unpress){
        hotkeySpamUnPress = true;
        setTimeout(() => {
            hotkeySpamUnPress = false
        }, 500)
    } else {
        hotkeySpamPress = true;
        setTimeout(() => {
            hotkeySpamPress = false
        }, 500)
    }
    if (task === "voice") return true;
    if (task === "cursor") return true;
    if (task === 'gpress' && gui.currentGui === 'interact') {
        gui.setGui(null);
        return;
    }
    if (task === "invopen" && gui.currentGui === "inventory") {
        CustomEvent.triggerServer('inventory:close');
        gui.setGui(null);
        return;
    }
    if (task === "mmenu" && gui.currentGui === "mainmenu") {
        gui.setGui(null);
        return;
    }
    /*
    if (task === "tabletSlot" && gui.currentGui === "tablet") {
        gui.setGui(null);
        return;
    }
    if (task === "phoneSlot" && gui.currentGui === "phone") {
        gui.setGui(null);
        return;
    }*/
    if (task === "phoneSlot") return true;
    if (task === "tabletSlot") return true;
    if (task === "report" && gui.currentGui === "deathpopup") return true;
    if (gui.cursor) return false;
    if (task === "admin") return true;
    if (task === "mmenu") return true;
    if (gui.is_block_keys) return false;
    if (user.dead) return false;

    return true;
}
import {tempCursorStatus} from "./controls";
import {CustomEvent} from "./custom.event";
import {any} from "prop-types";
import {gui} from "./gui";

let ids = 0;
let DialogAcceptHandles = new Map<number, ((status: boolean) => any)>()

type deathAcceptCallback = (status: boolean) => void;
let deathCallback: deathAcceptCallback

export const DialogAccept = (text: string, type:"big"|"small", time: number = 5000, accept: string = "Да", cancel: string = "Нет"):Promise<boolean> => {
    return new Promise((resolve) => {
        ids++;
        const id = parseInt(`${ids}`);
        DialogAcceptHandles.set(id, resolve)
        if (type === "big") tempCursorStatus(true)
        CustomEvent.triggerCef('dialog:accept', id, type, text, time, accept, cancel)
    })
}

export const DialogAcceptDestroyBig = () => {
    CustomEvent.triggerCef('dialog:accept:destroyBig')
}

export const openDeathDialog = (time: number, killerId?: number, killerName?: string, disableChoose: boolean = false): Promise<boolean> => {
    return new Promise((resolve) => {
        deathCallback = resolve;
        tempCursorStatus(true);
        CustomEvent.triggerCef('deathpopup:show', true);
        CustomEvent.triggerCef('deathpopup:setTime', time)
        if (killerName) CustomEvent.triggerCef('deathpopup:setKillerName', killerId, killerName)
        else CustomEvent.triggerCef('deathpopup:setSuicide')

        if (disableChoose) {
            resolve(null);
        }
    })
}

export const destroyDeathDialog = (): void => {
    deathCallback = null;
    CustomEvent.triggerCef('deathpopup:show', false);
}

mp.events.add('deathDialog:accept:status', (status: boolean) => {
    if (!deathCallback) return
    deathCallback(status)
    deathCallback = null;
    tempCursorStatus(false);
})

mp.events.add('dialog:accept:status', (id: number, status: boolean) => {
    let prom = DialogAcceptHandles.get(id);
    if(!prom) return;
    prom(status);
    DialogAcceptHandles.delete(id);
    if ([...DialogAcceptHandles].length === 0) tempCursorStatus(false);
})

CustomEvent.registerServer('dialog:accept', (text: string, type: "big" | "small", time: number = 5000, accept: string = "Да", cancel: string = "Нет") => {
    return DialogAccept(text, type, time, accept, cancel)
})
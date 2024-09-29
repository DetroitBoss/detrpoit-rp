import {CustomEvent} from "./custom.event";
import {gui} from "./gui";

let signatureIDS = 0;

let signaturePromises = new Map<number, (res: boolean) => any>()

export const getSignature = (document: string, info: string = 'Поставьте подпись в своих документах') => {
    return new Promise((resolve) => {
        gui.setGui('signature');
        signatureIDS++
        CustomEvent.triggerCef('signature:load', info, document, signatureIDS);
        signaturePromises.set(signatureIDS, resolve)
    })
}

CustomEvent.registerServer('signature:get', (document: string, info?: string) => {
    return getSignature(document, info);
})

mp.events.add('signature:save', (ids: number, status: boolean) => {
    if (!signaturePromises.has(ids)) return;
    signaturePromises.get(ids)(status);
    signaturePromises.delete(ids);
})
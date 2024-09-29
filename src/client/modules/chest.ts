import {CustomEvent} from "./custom.event";
import {gui} from "./gui";

CustomEvent.registerServer('chest:open', (id: number, name: string, items: {
    id: number,
    amount: number,
    canTake: boolean
}[]) => {
    gui.setGui("chest");
    CustomEvent.triggerCef('chest:open', id, name, items);
})
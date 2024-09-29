import {InteractionItem, interractionMenuBasic} from "../../shared/interactions";
import {CustomEvent} from "./custom.event";
import {gui} from "./gui";

export class interractionMenu extends interractionMenuBasic {
    private _forVehicle: boolean;
    constructor(forVehicle: boolean) {
        super('');
        this._forVehicle = forVehicle;
    }
    open() {
        this.name = this.name.replace(/\n/g, '|');
        gui.setGui('interact')
        CustomEvent.triggerCef('intMenu:open', this.id, this._forVehicle, this.items);
    }
    close(){
        if (gui.currentGui === "interact") gui.setGui(null)
    }
}

CustomEvent.registerServer('intMenu:open', (id: number, forVehicle: boolean, items: InteractionItem[]) => {
    const m = new interractionMenu(forVehicle)
    m.autoClose = true;
    // if (onBack) m.onBack = () => {
    //     CustomEvent.triggerServer('interractionMenu:onBack', id)
    // }
    // if (onExit) m.onExit = () => {
    //     CustomEvent.triggerServer('interractionMenu:onExit', id)
    // }
    // if (onNext) m.onNext = () => {
    //     CustomEvent.triggerServer('interractionMenu:onNext', id)
    // }
    items.map((item, index) => {
        m.add(item.name, item.category, item.icon, () => {
            CustomEvent.triggerServer('interractionMenu:select', id, index)
        })
    })
    m.open();
})

mp.events.add('interractionMenu:select', (id: number, index: number) => {
    const m = interractionMenu.get(id);
    if (!m) return;
    gui.setGui(null)
    m.handle(index);
})
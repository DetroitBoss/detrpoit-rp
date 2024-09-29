import {MINIGAME_TYPE} from "../../shared/minigame";
import {CustomEvent} from "./custom.event";
import {gui} from "./gui";

let ids = 0;
let handlers = new Map<number, (status: boolean) => void>();
export const MinigamePlay = (game: MINIGAME_TYPE):Promise<boolean> => {
    return new Promise((resolve) => {
        ids++;
        handlers.set(ids, resolve);
        gui.setGui("minigame")
        CustomEvent.triggerCef('minigame:play', game, ids);
    })
}

CustomEvent.registerServer('minigame:play', (game: MINIGAME_TYPE) => {
    return MinigamePlay(game);
})

mp.events.add('minigame:status', (id: number, status: boolean) => {
    let handle = handlers.get(id);
    if(!handle) return;
    gui.setGui(null);
    handle(status)
    handlers.delete(id);
})
import {CustomEvent} from "../custom.event";
import {gui} from "../gui";

CustomEvent.registerServer('fuel:open', (...args) => {
    gui.setGui('fuel')
    CustomEvent.triggerCef('fuel:open', ...args)
})
import {CustomEvent} from "../custom.event";
import {gui} from "../gui";

CustomEvent.register('battlePass', () => {
    if (gui.currentGui === 'battlePass') {
        gui.setGui(null);
    }else{
        CustomEvent.triggerServer('battlePass:openInterface')
    }
});